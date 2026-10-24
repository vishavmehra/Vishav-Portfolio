import type { CollisionShape, PlanarPosition, WorldCollider } from './CollisionTypes'

/**
 * Generic XZ collision registry and movement resolver.
 *
 * Response is "slide along the surface, never stop dead" (docs/03 §6): the move
 * is applied, then the player circle is pushed out of anything it overlaps along
 * the contact normal. Only the penetrating component is removed, so the
 * tangential part of the motion survives and the player slides around a trunk or
 * along a wall instead of sticking.
 *
 * Cost is a bounding reject plus one closest-point test per nearby collider,
 * all plain arithmetic, so hundreds of colliders are cheap. If the world ever
 * outgrows a linear scan, a uniform grid slots in behind `active` without
 * changing this API.
 */

type Entry = {
  collider: WorldCollider
  enabled: boolean
  x: number
  z: number
  /** Radius of a circle enclosing the shape, for the cheap reject. */
  bound: number
  cos: number
  sin: number
}

const entries = new Map<string, Entry>()
/** Enabled entries, rebuilt only when the registry changes — never per frame. */
let active: Entry[] = []

/** Resolution passes, for when a push out of one collider lands in another. */
const PASSES = 3

function rebuild() {
  active = []
  for (const entry of entries.values()) if (entry.enabled) active.push(entry)
}

function boundOf(shape: CollisionShape) {
  if (shape.type === 'circle') return shape.radius
  if (shape.type === 'capsule') return shape.halfLength + shape.radius
  return Math.hypot(shape.halfWidth, shape.halfDepth)
}

export function registerCollider(collider: WorldCollider): () => void {
  const yaw = collider.shape.type === 'circle' ? 0 : (collider.shape.rotation ?? 0)
  entries.set(collider.id, {
    collider,
    enabled: collider.enabled ?? true,
    x: collider.position[0],
    z: collider.position[2],
    bound: boundOf(collider.shape),
    cos: Math.cos(yaw),
    sin: Math.sin(yaw),
  })
  rebuild()
  return () => {
    // Only remove what this call registered; a later re-registration keeps its slot.
    if (entries.get(collider.id)?.collider === collider) removeCollider(collider.id)
  }
}

export function removeCollider(id: string) {
  if (entries.delete(id)) rebuild()
}

export function setColliderEnabled(id: string, enabled: boolean) {
  const entry = entries.get(id)
  if (!entry || entry.enabled === enabled) return
  entry.enabled = enabled
  rebuild()
}

/** Every registered collider, enabled or not. For tooling (debug drawing). */
export function getColliders(): WorldCollider[] {
  return Array.from(entries.values(), (entry) => ({ ...entry.collider, enabled: entry.enabled }))
}

/**
 * Moves a circle of `radius` from `from` by (dx, dz) and writes the collision-free
 * result into `out`. Allocation-free; `out` may be `from`.
 *
 * Tunnelling cannot occur at game speeds: the largest per-frame step
 * (walkSpeed * the controller's 0.1 s delta clamp = 0.4) is smaller than the
 * thinnest collider plus the player radius.
 */
export function resolveMovement(
  from: PlanarPosition,
  dx: number,
  dz: number,
  radius: number,
  out: PlanarPosition,
): PlanarPosition {
  let x = from.x + dx
  let z = from.z + dz

  for (let pass = 0; pass < PASSES; pass++) {
    let pushed = false

    for (let i = 0; i < active.length; i++) {
      const e = active[i]
      const ox = x - e.x
      const oz = z - e.z
      const reach = e.bound + radius
      if (ox > reach || ox < -reach || oz > reach || oz < -reach) continue

      const shape = e.collider.shape

      if (shape.type === 'circle') {
        const min = shape.radius + radius
        const d2 = ox * ox + oz * oz
        if (d2 >= min * min) continue
        const d = Math.sqrt(d2)
        if (d > 1e-6) {
          x = e.x + (ox / d) * min
          z = e.z + (oz / d) * min
        } else {
          // Exactly centred (only possible if spawned inside): back out along the move.
          const m = Math.hypot(dx, dz) || 1
          x = e.x - (dx / m) * min
          z = e.z - (dz / m) * min
        }
        pushed = true
        continue
      }

      // Box and capsule: work in the local frame (inverse of the Object3D yaw rotation).
      const lx = ox * e.cos - oz * e.sin
      const lz = ox * e.sin + oz * e.cos

      if (shape.type === 'capsule') {
        // Closest point on the core segment, then the circle rule from there.
        const sx = lx < -shape.halfLength ? -shape.halfLength : lx > shape.halfLength ? shape.halfLength : lx
        const qx = lx - sx
        const min = shape.radius + radius
        const d2 = qx * qx + lz * lz
        if (d2 >= min * min) continue
        const d = Math.sqrt(d2)
        // On the core line itself: leave sideways, toward the side the move came from.
        const nx = d > 1e-6 ? sx + (qx / d) * min : sx
        const nz = d > 1e-6 ? (lz / d) * min : (dx * e.sin + dz * e.cos > 0 ? -min : min)
        x = e.x + nx * e.cos + nz * e.sin
        z = e.z - nx * e.sin + nz * e.cos
        pushed = true
        continue
      }

      const cx = lx < -shape.halfWidth ? -shape.halfWidth : lx > shape.halfWidth ? shape.halfWidth : lx
      const cz = lz < -shape.halfDepth ? -shape.halfDepth : lz > shape.halfDepth ? shape.halfDepth : lz
      const qx = lx - cx
      const qz = lz - cz
      const d2 = qx * qx + qz * qz

      let nx: number
      let nz: number
      if (d2 > 1e-12) {
        if (d2 >= radius * radius) continue
        const d = Math.sqrt(d2)
        nx = cx + (qx / d) * radius
        nz = cz + (qz / d) * radius
      } else {
        // Centre inside the box: leave through the nearest face.
        if (shape.halfWidth - Math.abs(lx) < shape.halfDepth - Math.abs(lz)) {
          nx = (lx < 0 ? -1 : 1) * (shape.halfWidth + radius)
          nz = lz
        } else {
          nx = lx
          nz = (lz < 0 ? -1 : 1) * (shape.halfDepth + radius)
        }
      }
      x = e.x + nx * e.cos + nz * e.sin
      z = e.z - nx * e.sin + nz * e.cos
      pushed = true
    }

    if (!pushed) break
  }

  out.x = x
  out.z = z
  return out
}
