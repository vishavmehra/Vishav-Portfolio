import type { BufferGeometry } from 'three'

import { STREAM_PATH, streamSurfaceAt } from './worldGen'

/**
 * The river.
 *
 * `river.glb` is one continuous authored channel — bank, wet stone, foam, shallow
 * shelf and deep centre — but it is authored in *ribbon space* rather than in the
 * world:
 *
 *   x  fraction along the stream, 0 … 1
 *   y  metres across the centre-line
 *   z  metres above the water surface
 *
 * This function bends it onto the real centre-line and reads every vertex's height
 * from `streamSurfaceAt`. The asset therefore carries the profile — width
 * variation, bank shape, facet detail, flow colour — while the heightfield stays
 * the single source of truth for where the water sits, exactly as it does for the
 * player and the camera.
 *
 * One mesh, one draw call, and no tiles, which is what removes the seams the tiled
 * version showed. The bridge needs no special case: the channel simply passes
 * beneath it, because the deck is derived from the same terrain height.
 */

/**
 * Arc-length parameterisation of the stream centre-line, built once.
 *
 * The centre-line itself comes from worldGen: the terrain carves its channel
 * around exactly this curve, so the water cannot sit outside the ground that was
 * cut for it.
 */
type Path = {
  points: { x: number; z: number }[]
  /** Cumulative distance to each point. */
  distance: number[]
  length: number
}

function buildPath(): Path {
  const points = STREAM_PATH
  const distance = [0]
  for (let i = 1; i < points.length; i++) {
    distance.push(distance[i - 1] + Math.hypot(points[i].x - points[i - 1].x, points[i].z - points[i - 1].z))
  }
  return { points, distance, length: distance[distance.length - 1] }
}

const path = buildPath()

/**
 * Position and unit tangent at a fraction along the smoothed stream.
 */
function sample(t: number, out: { x: number; z: number; tx: number; tz: number }) {
  const target = Math.min(Math.max(t, 0), 1) * path.length
  let i = 1
  while (i < path.distance.length - 1 && path.distance[i] < target) i++
  const a = path.points[i - 1]
  const b = path.points[i]
  const segment = path.distance[i] - path.distance[i - 1]
  const local = segment > 0 ? (target - path.distance[i - 1]) / segment : 0

  out.x = a.x + (b.x - a.x) * local
  out.z = a.z + (b.z - a.z) * local

  // Central difference across the neighbouring samples: on a smoothed path this
  // is already a continuous tangent, so the ribbon never kinks at a joint.
  const before = path.points[Math.max(i - 2, 0)]
  const after = path.points[Math.min(i + 1, path.points.length - 1)]
  const tx = after.x - before.x
  const tz = after.z - before.z
  const length = Math.hypot(tx, tz) || 1
  out.tx = tx / length
  out.tz = tz / length
}

/**
 * Bends the authored ribbon onto the stream, in place.
 *
 * Called once per geometry, off the frame loop. The geometry is a private clone
 * from the instancing loader, so mutating it cannot disturb the GLTF cache.
 */
export function bendRiverToStream(geometry: BufferGeometry) {
  const position = geometry.getAttribute('position')
  const normal = geometry.getAttribute('normal')
  const point = { x: 0, z: 0, tx: 1, tz: 0 }

  for (let i = 0; i < position.count; i++) {
    // The Y-up export maps Blender (x, y, z) to glTF (x, z, -y), so the ribbon's
    // "across" arrives negated on Z and its "lift" arrives on Y.
    const t = position.getX(i)
    const lift = position.getY(i)
    const across = -position.getZ(i)

    sample(t, point)
    // Left-hand normal of the tangent, on the ground plane.
    const nx = -point.tz
    const nz = point.tx
    const x = point.x + nx * across
    const z = point.z + nz * across

    // The water height comes from the CENTRE-LINE, not from each displaced vertex.
    // Sampling per vertex tilts the surface across the channel and lifts the edges
    // clear of the bank — the terrain's carve is deepest at the centre, so a vertex
    // out at the bank reads a shallower bed and floats the water above the ground
    // there. A stream's surface is level across its width.
    position.setXYZ(i, x, streamSurfaceAt(point.x, point.z) + lift, z)

    // The authored normals are in the same ribbon frame; rotate them by the yaw
    // the vertex was just placed with, so lighting follows the bends.
    if (normal) {
      const along = normal.getX(i)
      const up = normal.getY(i)
      const side = -normal.getZ(i)
      normal.setXYZ(i, point.tx * along + nx * side, up, point.tz * along + nz * side)
    }
  }

  position.needsUpdate = true
  if (normal) normal.needsUpdate = true
  geometry.computeBoundingSphere()
  geometry.computeBoundingBox()
  return geometry
}
