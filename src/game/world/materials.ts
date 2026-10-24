import { MeshBasicMaterial, MeshLambertMaterial } from 'three'

/**
 * The world's entire material palette.
 *
 * Colour lives in vertex attributes rather than textures, so most of these are
 * plain vertex-coloured Lambert. That keeps the count low, the memory tiny and
 * the hand-painted value variation intact.
 */
export function createWorldMaterials() {
  const vertexLit = (extra: ConstructorParameters<typeof MeshLambertMaterial>[0] = {}) =>
    new MeshLambertMaterial({ vertexColors: true, ...extra })

  return {
    /** terrain, paths, rocks, structures — everything that carries baked colour */
    terrain: vertexLit(),
    foliage: vertexLit(),
    /** vegetation is doubled-sided so thin blades never disappear edge-on */
    vegetation: vertexLit({ side: 2 }),
    timber: vertexLit(),
    stone: vertexLit(),
    metal: vertexLit(),
    /** distant scenery: unlit and unfogged-adjacent, cheapest possible */
    distant: new MeshBasicMaterial({ vertexColors: true }),
    sky: new MeshBasicMaterial({ vertexColors: true, side: 1, depthWrite: false, fog: false }),
    /** destination props — one merged geometry each, colour baked in */
    propsBaked: vertexLit(),
    /** the bridge, which is still authored as separate planks */
    propTimber: new MeshLambertMaterial({ color: '#9a7d5c' }),

    /** the one saturated accent in the world (DD-23) */
    screen: new MeshLambertMaterial({
      color: '#3a2a14',
      emissive: '#f0932b',
      emissiveIntensity: 0.75,
    }),
  }
}

export type WorldMaterials = ReturnType<typeof createWorldMaterials>
