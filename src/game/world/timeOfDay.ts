import { Color } from 'three'

/**
 * Time of day.
 *
 * One world, four lighting states. Nothing is reloaded, duplicated or swapped:
 * a preset is a set of light, fog and tint values, and the live state eases
 * toward the selected preset every frame. The renderer reads `timeOfDay`
 * directly in the frame loop, so a transition never passes through React
 * (CLAUDE.md §29) — only the mode selector does, and that changes on click.
 *
 * Colour discipline (DD-23): evening warms the *light and haze*, night cools
 * them. Neither recolours terrain, trees, rocks or flowers, and amber #F0932B
 * stays on practicals and interaction states only.
 */

export type TimeOfDayId = 'morning' | 'afternoon' | 'evening' | 'night'
export type TimeMode = TimeOfDayId | 'auto'

export type TimeOfDayPreset = {
  label: string
  /** Key light. Direction is a position on the light's hemisphere, as three.js wants it. */
  sunColor: string
  sunIntensity: number
  sunPosition: readonly [number, number, number]
  /** Ambient pair: sky fill above, bounced ground below. */
  skyColor: string
  groundColor: string
  ambientIntensity: number
  /** Fog and clear colour — the same value, so the horizon dissolves into it. */
  haze: string
  fogNear: number
  fogFar: number
  /** Multiplied onto the baked vertex colours of the sky dome and the distant ring. */
  skyTint: string
  distantTint: string
  /** Emissive strength of the amber practicals — screens, lamps, the lantern. */
  practicalIntensity: number
  /** 0 by day, 1 at night: drives the star field's opacity. */
  starOpacity: number
}

export const TIME_PRESETS: Record<TimeOfDayId, TimeOfDayPreset> = {
  morning: {
    label: 'Morning',
    sunColor: '#ffe6c8',
    sunIntensity: 2.05,
    sunPosition: [-46, 30, 28],
    skyColor: '#cadfef',
    groundColor: '#8d8a63',
    ambientIntensity: 1.05,
    haze: '#e2e9e6',
    fogNear: 66,
    fogFar: 178,
    skyTint: '#e8f0f4',
    distantTint: '#eaf0f1',
    practicalIntensity: 0.35,
    starOpacity: 0,
  },
  afternoon: {
    label: 'Afternoon',
    sunColor: '#fff3dc',
    sunIntensity: 2.5,
    sunPosition: [26, 48, 20],
    skyColor: '#d2e4f4',
    groundColor: '#9a9268',
    ambientIntensity: 1.15,
    haze: '#e9ece0',
    fogNear: 74,
    fogFar: 190,
    skyTint: '#ffffff',
    distantTint: '#ffffff',
    practicalIntensity: 0.25,
    starOpacity: 0,
  },
  evening: {
    label: 'Evening',
    sunColor: '#ffcf95',
    sunIntensity: 2.25,
    sunPosition: [54, 17, 34],
    skyColor: '#bcd4e4',
    groundColor: '#8a7d4a',
    ambientIntensity: 0.95,
    haze: '#e6dcc4',
    fogNear: 62,
    fogFar: 165,
    skyTint: '#ffe8cd',
    distantTint: '#f2e4ca',
    practicalIntensity: 0.7,
    starOpacity: 0.12,
  },
  night: {
    label: 'Night',
    sunColor: '#aac2e6',
    sunIntensity: 0.62,
    sunPosition: [-34, 44, -22],
    skyColor: '#33465f',
    groundColor: '#222a36',
    ambientIntensity: 0.62,
    haze: '#1b273a',
    fogNear: 48,
    fogFar: 138,
    skyTint: '#46587a',
    distantTint: '#4a5b78',
    practicalIntensity: 1.5,
    starOpacity: 1,
  },
}

/** Local-clock bands. Night wraps midnight, so it is the fallthrough. */
export function autoStateFor(date: Date = new Date()): TimeOfDayId {
  const hour = date.getHours() + date.getMinutes() / 60
  if (hour >= 6 && hour < 11) return 'morning'
  if (hour >= 11 && hour < 16) return 'afternoon'
  if (hour >= 16 && hour < 19) return 'evening'
  return 'night'
}

// --- mode, the only part the UI touches ------------------------------------

let mode: TimeMode = 'auto'
const listeners = new Set<(mode: TimeMode) => void>()

export function getTimeMode() {
  return mode
}

/** A manual state overrides auto until 'auto' is selected again. */
export function setTimeMode(next: TimeMode) {
  if (next === mode) return
  mode = next
  for (const fn of listeners) fn(mode)
}

export function subscribeTimeMode(fn: (mode: TimeMode) => void) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

/** The preset the world is currently heading toward. */
export function targetState(): TimeOfDayId {
  return mode === 'auto' ? autoStateFor() : mode
}

// --- live values, eased in the frame loop ----------------------------------

/**
 * Seconds for a transition to effectively finish. Exponential, so this is the
 * time to close ~95% of the gap.
 */
export const TRANSITION_SECONDS = 1.6
const DAMPING = 3 / TRANSITION_SECONDS

const start = TIME_PRESETS[autoStateFor()]

/** Live interpolated lighting. Mutated in place every frame — never copied into React state. */
export const timeOfDay = {
  state: autoStateFor() as TimeOfDayId,
  sunColor: new Color(start.sunColor),
  sunIntensity: start.sunIntensity,
  sunPosition: { x: start.sunPosition[0], y: start.sunPosition[1], z: start.sunPosition[2] },
  skyColor: new Color(start.skyColor),
  groundColor: new Color(start.groundColor),
  ambientIntensity: start.ambientIntensity,
  haze: new Color(start.haze),
  fogNear: start.fogNear,
  fogFar: start.fogFar,
  skyTint: new Color(start.skyTint),
  distantTint: new Color(start.distantTint),
  practicalIntensity: start.practicalIntensity,
  starOpacity: start.starOpacity,
}

function approach(current: number, goal: number, t: number) {
  return current + (goal - current) * t
}

/**
 * Eases every live value toward the selected preset. Called once per frame by
 * the rig; cheap enough to be unconditional (a dozen lerps).
 */
export function advanceTimeOfDay(delta: number) {
  const id = targetState()
  timeOfDay.state = id
  const to = TIME_PRESETS[id]
  const t = 1 - Math.exp(-DAMPING * Math.min(delta, 0.1))

  timeOfDay.sunColor.lerp(SCRATCH.set(to.sunColor), t)
  timeOfDay.skyColor.lerp(SCRATCH.set(to.skyColor), t)
  timeOfDay.groundColor.lerp(SCRATCH.set(to.groundColor), t)
  timeOfDay.haze.lerp(SCRATCH.set(to.haze), t)
  timeOfDay.skyTint.lerp(SCRATCH.set(to.skyTint), t)
  timeOfDay.distantTint.lerp(SCRATCH.set(to.distantTint), t)

  timeOfDay.sunIntensity = approach(timeOfDay.sunIntensity, to.sunIntensity, t)
  timeOfDay.ambientIntensity = approach(timeOfDay.ambientIntensity, to.ambientIntensity, t)
  timeOfDay.fogNear = approach(timeOfDay.fogNear, to.fogNear, t)
  timeOfDay.fogFar = approach(timeOfDay.fogFar, to.fogFar, t)
  timeOfDay.practicalIntensity = approach(timeOfDay.practicalIntensity, to.practicalIntensity, t)
  timeOfDay.starOpacity = approach(timeOfDay.starOpacity, to.starOpacity, t)
  timeOfDay.sunPosition.x = approach(timeOfDay.sunPosition.x, to.sunPosition[0], t)
  timeOfDay.sunPosition.y = approach(timeOfDay.sunPosition.y, to.sunPosition[1], t)
  timeOfDay.sunPosition.z = approach(timeOfDay.sunPosition.z, to.sunPosition[2], t)
}

const SCRATCH = new Color()
