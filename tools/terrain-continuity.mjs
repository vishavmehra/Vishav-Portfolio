/**
 * Walks straight lines across the stream at 1 cm steps and reports the largest
 * step in ground height — the channel carve is piecewise, and a seam anywhere in
 * it would be a ledge the player walks into.
 *
 * Run: node --import ./tools/ts-resolve.mjs tools/terrain-continuity.mjs
 */
import { heightAt } from '../src/game/world/worldGen.ts'
import { STREAM } from '../src/game/world/worldConfig.ts'

let worst = 0
let worstAt = null
let worstSlope = 0
const STEP = 0.01
for (let i = 0; i < STREAM.length - 1; i++) {
  const [ax, az] = STREAM[i]
  const [bx, bz] = STREAM[i + 1]
  for (let f = 0.1; f < 1; f += 0.2) {
    const cx = ax + (bx - ax) * f
    const cz = az + (bz - az) * f
    const len = Math.hypot(bx - ax, bz - az)
    const nx = -(bz - az) / len
    const nz = (bx - ax) / len
    let prev = heightAt(cx - nx * 14, cz - nz * 14)
    for (let d = -14 + STEP; d <= 14; d += STEP) {
      const h = heightAt(cx + nx * d, cz + nz * d)
      const step = Math.abs(h - prev)
      if (step > worst) { worst = step; worstAt = [+(cx + nx * d).toFixed(2), +(cz + nz * d).toFixed(2), +d.toFixed(2)] }
      worstSlope = Math.max(worstSlope, step / STEP)
      prev = h
    }
  }
}
console.log(JSON.stringify({ largestStepPerCm: +worst.toFixed(4), at: worstAt, steepestSlope: +worstSlope.toFixed(2) }))
