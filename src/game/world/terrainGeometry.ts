import { BufferGeometry, Color, Float32BufferAttribute, PlaneGeometry } from 'three'

import { PATH_WIDTH } from './worldConfig'
import { distanceToPath, fbm, heightAt, shoreDistance } from './worldGen'

/**
 * The meadow.
 *
 * A displaced grid with all of its colour baked into vertices: grass that shifts
 * warm on rises and cool in hollows, dirt blended in along the trails so the path
 * never reads as a decal on a green plane, and damp earth at the stream banks.
 *
 * The grid stays indexed so neighbouring triangles share vertex normals. Splitting it
 * (toNonIndexed) gave every 1.3 m triangle its own face normal, and the sun then lit
 * each one differently: that, not the colour, was the giant triangular patchwork.
 * Hero assets stay faceted; the ground is the calm surface they stand on.
 */
export function buildTerrain(size: number, centerZ: number, segments: number) {
  const geometry = new PlaneGeometry(size, size, segments, segments)
  geometry.rotateX(-Math.PI / 2)
  geometry.translate(0, 0, centerZ)

  const pos = geometry.attributes.position
  for (let i = 0; i < pos.count; i++) {
    pos.setY(i, heightAt(pos.getX(i), pos.getZ(i)))
  }
  pos.needsUpdate = true

  geometry.deleteAttribute('uv')
  geometry.computeVertexNormals()
  paintTerrain(geometry)
  return geometry
}

const grassLow = new Color('#4e6b32')
const grassHigh = new Color('#8ba354')
const grassWarm = new Color('#a8ad5c')
const grassCool = new Color('#5f7a45')
const trodden = new Color('#6f7440')
const dirt = new Color('#b8935f')
const dirtDark = new Color('#8f6f45')
const mud = new Color('#6b5b40')
const gravel = new Color('#a2957c')
const tmp = new Color()
const tmp2 = new Color()

/**
 * Every noise term here is at least ~5 m in wavelength. The vertices are ~1.3 m apart,
 * and anything finer than about three vertex spacings interpolates into triangle-shaped
 * blotches instead of reading as texture.
 */
function paintTerrain(geometry: BufferGeometry) {
  const pos = geometry.attributes.position
  const normal = geometry.attributes.normal
  const colors = new Float32Array(pos.count * 3)

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const z = pos.getZ(i)

    // Base grass: warmer and lighter as the ground rises, cooler in hollows.
    const lift = Math.min(1, Math.max(0, (y + 1.6) / 5.5))
    tmp.copy(grassLow).lerp(grassHigh, lift)

    // Sun-caught tops on the flatter, higher ground.
    const flatness = Math.max(0, normal.getY(i))
    tmp.lerp(grassWarm, lift * lift * flatness * 0.45)

    // Broad warm/cool drift across the meadow (~30 m), kept subtle.
    const drift = fbm(x * 0.033 + 7.1, z * 0.033 - 3.4, 2)
    tmp.lerp(grassCool, Math.max(0, 0.5 - drift) * 0.32)

    // Soft value mottling (~11 m and ~5 m) so large areas never read as one flat green.
    const patch = fbm(x * 0.09, z * 0.09, 2) - 0.5
    const mottle = fbm(x * 0.2 + 13.7, z * 0.2 - 5.2, 2) - 0.5
    tmp.multiplyScalar(1 + patch * 0.18 + mottle * 0.07)

    // Trails: a worn dirt core, a band of trodden grass, and an edge that wanders at a
    // walking scale (~6 m) instead of wobbling at the grid's scale.
    const pathD = distanceToPath(x, z)
    const half = PATH_WIDTH * 0.5
    const wander = (fbm(x * 0.16 + 2.3, z * 0.16 + 9.1, 2) - 0.5) * 1.6
    const dirtEdge = half + 0.35 + wander
    const wornEdge = dirtEdge + 1.7 + (fbm(x * 0.11 - 4.4, z * 0.11, 2) - 0.5) * 1.2
    if (pathD < wornEdge) {
      const worn = smooth01((wornEdge - pathD) / (wornEdge - dirtEdge))
      tmp.lerp(trodden, worn * 0.45)
      const core = smooth01((dirtEdge + 0.9 - pathD) / 1.8)
      tmp2.copy(dirtDark).lerp(dirt, 0.45 + patch * 0.9 + mottle * 0.6)
      tmp.lerp(tmp2, core * 0.95)
    }

    // The shore. Measured from the river's own waterline, so the damp band follows
    // the channel where it widens into a pool and narrows again, instead of running
    // parallel to the centre-line at a fixed width: wet earth right at the water,
    // then a pale gravel strand, then grass.
    const shore = shoreDistance(x, z)
    if (shore < 2.6) {
      const strand = smooth01((2.6 - shore) / 2.0)
      tmp2.copy(gravel).lerp(mud, smooth01((0.9 - shore) / 1.1))
      tmp.lerp(tmp2, strand * 0.85)
    }

    colors[i * 3] = tmp.r
    colors[i * 3 + 1] = tmp.g
    colors[i * 3 + 2] = tmp.b
  }

  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3))
}

function smooth01(t: number) {
  const c = t < 0 ? 0 : t > 1 ? 1 : t
  return c * c * (3 - 2 * c)
}
