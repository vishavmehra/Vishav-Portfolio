/**
 * Checks every river stone against the ground and the water: a bank stone must
 * bed into the ground, a water stone must sit at the waterline, and none may float.
 *
 * Run: node --import ./tools/ts-resolve.mjs tools/stone-seating.mjs
 */
import { RIVER_STONE_PLACEMENTS } from '../src/game/world/riverStones.ts'
import { heightAt, streamSurfaceAt } from '../src/game/world/worldGen.ts'

let bank = 0, water = 0, floating = 0, worstFloat = -Infinity, buried = 0, bankFloat = 0, bankWorst = -Infinity, waterTopsAbove = 0
for (const list of RIVER_STONE_PLACEMENTS) {
  for (const p of list) {
    const ground = heightAt(p.x, p.z)
    const surface = streamSurfaceAt(p.x, p.z)
    const aboveGround = p.y - ground
    worstFloat = Math.max(worstFloat, aboveGround)
    if (aboveGround > 0.02) floating++
    if (aboveGround < -0.3) buried++
    if (ground < surface - 0.02) {
      water++
      // A water stone's base is under the opaque surface; what matters is that
      // its top still breaks it. Seating is at most 0.16 below the waterline.
      if (p.y > surface - 0.2) waterTopsAbove++
    } else {
      bank++
      bankWorst = Math.max(bankWorst, aboveGround)
      if (aboveGround > 0.02) bankFloat++
    }
  }
}
console.log(JSON.stringify({ bankStonesFloating: bankFloat, bankWorstAboveGround: +bankWorst.toFixed(3), waterStonesSeatedAtWaterline: waterTopsAbove, stones: bank + water, onBank: bank, inWater: water, floatingOver2cm: floating, worstAboveGround: +worstFloat.toFixed(3), buriedDeeperThan30cm: buried }))
