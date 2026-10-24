import { BRIDGE, BRIDGE_BASE } from './bridge'
import type { WorldCollider } from './collision/CollisionTypes'
import { LAMP_PLACEMENTS, SIGN_PLACEMENTS, SIGN_POSTS, SIGN_POST_RADIUS, SIGN_POST_SETBACK } from './lampPosts'
import { BUSH_PLACEMENTS, CONIFER_PLACEMENTS, ROCK_PLACEMENTS } from './propPlacements'
import { RIVER_STONE_PLACEMENTS } from './riverStones'
import { BIRCH_STAND, DESTINATIONS, HERO_TREES, TRAILHEAD } from './worldConfig'
import { heightAt, type Placement } from './worldGen'

type DestinationId = keyof typeof DESTINATIONS

/**
 * A point authored in a destination's local frame (as in destinationGeometry.ts),
 * converted to world space with the destination's own position and yaw.
 */
function local(id: DestinationId, lx: number, lz: number): [number, number, number] {
  const { position, rotation } = DESTINATIONS[id]
  const c = Math.cos(rotation)
  const s = Math.sin(rotation)
  const x = position[0] + lx * c + lz * s
  const z = position[1] - lx * s + lz * c
  return [x, heightAt(x, z), z]
}

/**
 * A prop's footprint at the player's body height (0.4–1.5 m), at scale 1, in the
 * asset's own frame. Measured from each GLB by tools/collider-measure.mjs — the
 * dense mass, not the outermost leaf or the root flare — so the player stops where
 * the object visibly is and walks round it without meeting an invisible wall.
 * `offset` is the mass centre when the asset is not centred on its origin.
 */
type Footprint =
  | { type: 'circle'; radius: number; offset?: [number, number] }
  | { type: 'capsule'; halfLength: number; radius: number; offset?: [number, number] }

/** Rock family, by variant: small stone, medium boulder, large boulder, low wide rock, tall rock. */
const ROCK_FOOTPRINT: Footprint[] = [
  { type: 'circle', radius: 0.19 },
  { type: 'circle', radius: 0.38 },
  { type: 'circle', radius: 0.8 },
  { type: 'capsule', halfLength: 0.3, radius: 0.5 },
  { type: 'circle', radius: 0.33 },
]
/** The small stone is 0.23 m high at scale 1; below this height it is stepped over, not walked into. */
const STEP_OVER_HEIGHT = 0.25
const SMALL_STONE_HEIGHT = 0.23

/**
 * Bushes a–d (art/blender/bush-set): low spreading shrub, dense rounded shrub,
 * taller asymmetric shrub, irregular one-sided shrub. The footprint is the woody
 * mass a walker meets, not the outermost leaf tips — a bush stops you, but you can
 * brush its edge.
 */
const BUSH_FOOTPRINT: Footprint[] = [
  { type: 'circle', radius: 0.62, offset: [0.04, 0.1] },
  { type: 'circle', radius: 0.46, offset: [0.07, 0.05] },
  { type: 'circle', radius: 0.42, offset: [0.07, 0.03] },
  { type: 'capsule', halfLength: 0.24, radius: 0.5, offset: [0.14, -0.05] },
]

/**
 * Conifers a–c: the lowest foliage tiers sit at knee-to-chest height and are as
 * solid as the trunk to someone walking, so the footprint is the skirt at body
 * height, not the trunk alone. The canopy above is never collided with.
 */
const CONIFER_FOOTPRINT: Footprint[] = [
  { type: 'circle', radius: 1.3 },
  { type: 'circle', radius: 1.9, offset: [0, -0.3] },
  { type: 'circle', radius: 1.4 },
]

/**
 * River stones a–d. The in-water stones (a, c) are seated so only their tops break
 * the surface — a wader steps over them, so they have no collider. The bank stones
 * (b, d) stand clear of the ground and block.
 */
const RIVER_STONE_FOOTPRINT: (Footprint | null)[] = [
  null,
  { type: 'circle', radius: 0.42 },
  null,
  { type: 'circle', radius: 0.45, offset: [0, 0.12] },
]

/** One collider per placed prop, from its footprint, scale and yaw. */
function propColliders(prefix: string, placements: Placement[], footprint: Footprint): WorldCollider[] {
  return placements.map((p, i) => {
    const c = Math.cos(p.rotation)
    const s = Math.sin(p.rotation)
    const [ox, oz] = footprint.offset ?? [0, 0]
    const x = p.x + (ox * c + oz * s) * p.scale
    const z = p.z + (-ox * s + oz * c) * p.scale
    return {
      id: `${prefix}-${i + 1}`,
      position: [x, p.y, z],
      shape:
        footprint.type === 'circle'
          ? { type: 'circle', radius: footprint.radius * p.scale }
          : { type: 'capsule', halfLength: footprint.halfLength * p.scale, radius: footprint.radius * p.scale, rotation: p.rotation },
    }
  })
}

/**
 * World collision footprints.
 *
 * Measured, not guessed: the destinations from their geometry builders, the
 * authored props from their GLBs (see the footprint tables above). Anything the
 * player could see themselves walk through has one; grass, flowers and reeds, the
 * backdrop trees beyond the playable edge, and stones low enough to step over do not.
 *
 * Add one like:
 *   { id: 'hero-tree-a-01', position: [x, 0, z], shape: { type: 'circle', radius: 1 } }
 */
export const WORLD_COLLIDERS: WorldCollider[] = [
  // PROJECTS — the shack on its stilts: the platform measures 2.98 x 2.75 and the
  // whole thing stands on it, so the footprint is the platform. The ladder on the
  // front face and the pole's guy lines are outside it and stay walkable.
  {
    id: 'projects-shack',
    position: local('projects', 0, 0),
    shape: { type: 'box', halfWidth: 1.49, halfDepth: 1.38, rotation: DESTINATIONS.projects.rotation },
  },

  // TRAILHEAD — just the post and the stones packed round its foot; the arrow boards
  // are overhead at 1.5-1.9 and the player walks under them.
  {
    id: 'trailhead-post',
    position: [TRAILHEAD.position[0], heightAt(...TRAILHEAD.position), TRAILHEAD.position[1]],
    shape: { type: 'circle', radius: 0.32 },
  },

  // EDUCATION — the log cabin: 3.37 x 4.6 over its sill. The porch steps at the
  // front are inside this box, so the player stops at the porch rather than on it.
  {
    id: 'education-cabin',
    position: local('education', 0, 0),
    shape: { type: 'box', halfWidth: 1.69, halfDepth: 2.3, rotation: DESTINATIONS.education.rotation },
  },

  // ACHIEVEMENTS — the stepped dais (bottom step radius 3.25-3.4). There is no step-up,
  // so the whole platform is solid; shrine, benches and props all sit inside it.
  { id: 'achievements-dais', position: local('achievements', 0, 0), shape: { type: 'circle', radius: 3.3 } },

  // EXPERIENCE — the authored cabin's body, 6.2 x 5.2 between the gable planes. Interior,
  // chimney and crates all sit inside it; the cabin is not enterable, as before. The front
  // face stops at the gable, so the threshold deck (z 2.5-3.74) stays walkable and the
  // player can stand at the opening to interact.
  {
    id: 'experience-cabin',
    position: local('experience', 0, 0),
    shape: { type: 'box', halfWidth: 3.1, halfDepth: 2.95, rotation: DESTINATIONS.experience.rotation },
  },
  // the outdoor workbench beside the threshold — waist high and right on the approach
  {
    id: 'experience-outdoor-bench',
    position: local('experience', -2.46, 2.65),
    shape: { type: 'box', halfWidth: 0.78, halfDepth: 0.36, rotation: DESTINATIONS.experience.rotation },
  },

  // BRIDGE RAILS — the deck is only enterable from its ends. Without these a walker
  // could step onto the deck sideways from the stream, where the ground is 1.5 below
  // it, and be lifted in a single stride. The rails are real geometry standing on the
  // deck edge, so blocking them is also what the asset shows.
  ...[-1, 1].map(
    (side): WorldCollider => ({
      id: `bridge-rail-${side < 0 ? 'west' : 'east'}`,
      position: [BRIDGE.x + side * BRIDGE.railOffset, BRIDGE_BASE, BRIDGE.z],
      shape: {
        type: 'box',
        halfWidth: BRIDGE.railHalfWidth,
        halfDepth: BRIDGE.railHalfLength,
        rotation: BRIDGE.rotation,
      },
    }),
  ),

  // HERO TREE A (GLB) — trunk footprint only, never the canopy. Approved radius:
  // covers the bole (0.84-0.99 measured at walking height); the low root flare stays walkable.
  ...HERO_TREES.filter((t) => t.kind === 0).map(
    (t, i): WorldCollider => ({
      id: `hero-tree-a-${i + 1}`,
      position: [t.x, heightAt(t.x, t.z), t.z],
      shape: { type: 'circle', radius: 0.9 * t.scale },
    }),
  ),

  // HERO TREE B (GLB) — the leaning oak. Its bole measures 1.19-1.23 across walking height
  // because the lean carries the axis off the base centre, so 1.05 covers it without
  // swallowing the root flare.
  ...HERO_TREES.filter((t) => t.kind === 1).map(
    (t, i): WorldCollider => ({
      id: `hero-tree-b-${i + 1}`,
      position: [t.x, heightAt(t.x, t.z), t.z],
      shape: { type: 'circle', radius: 1.05 * t.scale },
    }),
  ),

  // BIRCH STAND (GLB) — trunk only. The bole is ~0.21-0.25 in radius at walking height and its
  // S-lean moves the axis ~0.1 off the base centre, so 0.32 at scale 1 covers both; root lobes stay walkable.
  ...BIRCH_STAND.map(
    (t, i): WorldCollider => ({
      id: `birch-${i + 1}`,
      position: [t.x, heightAt(t.x, t.z), t.z],
      shape: { type: 'circle', radius: 0.32 * t.scale },
    }),
  ),

  // TRAIL LANTERNS — the post only. Its stone foot is 0.17 high and stepped over,
  // and the lantern hangs at 1.8, well above a walker's head.
  ...LAMP_PLACEMENTS.map(
    (p, i): WorldCollider => ({
      id: `lamp-${i + 1}`,
      position: [p.x, p.y, p.z],
      shape: { type: 'circle', radius: 0.14 * p.scale },
    }),
  ),

  // TRAIL MARKERS — the single hewn post each plank is nailed to. The plank
  // itself hangs at 1.3-1.8 m, over a walker's head, so only the post blocks.
  ...SIGN_PLACEMENTS.map((p, i): WorldCollider => {
    const c = Math.cos(p.rotation)
    const s = Math.sin(p.rotation)
    return {
      id: `${SIGN_POSTS[i].id}-post`,
      position: [p.x - SIGN_POST_SETBACK * s, p.y, p.z - SIGN_POST_SETBACK * c],
      shape: { type: 'circle', radius: SIGN_POST_RADIUS },
    }
  }),

  // ROCKS — every rock of the family except small stones low enough to step over.
  ...ROCK_PLACEMENTS.flatMap((list, v) =>
    propColliders(
      `rock-${'abcde'[v]}`,
      v === 0 ? list.filter((p) => p.scale * SMALL_STONE_HEIGHT >= STEP_OVER_HEIGHT) : list,
      ROCK_FOOTPRINT[v],
    ),
  ),

  // BUSHES — the dense mass of each, so thickets block but can be walked round.
  ...[0, 1, 2, 3].flatMap((v) =>
    propColliders(`bush-${'abcd'[v]}`, BUSH_PLACEMENTS.filter((p) => p.variant % 4 === v), BUSH_FOOTPRINT[v]),
  ),

  // CONIFERS — trunk and the low foliage skirt.
  ...[0, 1, 2].flatMap((v) =>
    propColliders(`conifer-${'abc'[v]}`, CONIFER_PLACEMENTS.filter((p) => p.variant % 3 === v), CONIFER_FOOTPRINT[v]),
  ),

  // RIVER STONES — the bank stones.
  ...RIVER_STONE_PLACEMENTS.flatMap((list, v) => {
    const footprint = RIVER_STONE_FOOTPRINT[v]
    return footprint ? propColliders(`river-stone-${'abcd'[v]}`, list, footprint) : []
  }),
]
