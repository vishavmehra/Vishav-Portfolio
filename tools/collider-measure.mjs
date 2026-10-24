/**
 * Measures each solid asset's footprint where it meets the player's body, so
 * colliders are sized from the geometry rather than guessed.
 *
 * For every GLB: the horizontal extent of its vertices in height bands from the
 * ground up to head height (y is up, asset base at y = 0, scale 1), as the max and
 * 80th-percentile distance from the asset's vertical axis, plus the plan extents.
 *
 * Run: node tools/collider-measure.mjs [file ...]   (paths relative to public/assets/3d, no .glb)
 */
import fs from 'node:fs'

const FILES = process.argv.length > 2 ? process.argv.slice(2) : [
  'rock-a', 'rock-b', 'rock-c', 'rock-d', 'rock-e',
  'bush-a', 'bush-b', 'bush-c', 'bush-d',
  'river-stones/river-stone-a', 'river-stones/river-stone-b', 'river-stones/river-stone-c', 'river-stones/river-stone-d',
  'environment-trees/tree-conifer-a', 'environment-trees/tree-conifer-b', 'environment-trees/tree-conifer-c',
  'hero-tree-a', 'hero-tree-b', 'birch',
]
const BANDS = [[0, 0.4], [0.4, 0.9], [0.9, 1.5], [1.5, 2.2]]

function positions(file) {
  const buf = fs.readFileSync(`public/assets/3d/${file}.glb`)
  const jsonLen = buf.readUInt32LE(12)
  const json = JSON.parse(buf.slice(20, 20 + jsonLen).toString())
  const bin = 20 + jsonLen + 8
  const out = []
  // node transforms are identity/translation-only in these assets; apply translation+scale if present
  for (const node of json.nodes) {
    if (node.mesh === undefined) continue
    const t = node.translation || [0, 0, 0]
    const s = node.scale || [1, 1, 1]
    for (const prim of json.meshes[node.mesh].primitives) {
      const acc = json.accessors[prim.attributes.POSITION]
      const bv = json.bufferViews[acc.bufferView]
      const stride = bv.byteStride || 12
      const off = bin + (bv.byteOffset || 0) + (acc.byteOffset || 0)
      for (let i = 0; i < acc.count; i++) {
        out.push([
          buf.readFloatLE(off + i * stride) * s[0] + t[0],
          buf.readFloatLE(off + i * stride + 4) * s[1] + t[1],
          buf.readFloatLE(off + i * stride + 8) * s[2] + t[2],
        ])
      }
    }
  }
  return out
}

const pct = (arr, q) => { if (!arr.length) return 0; const a = [...arr].sort((x, y) => x - y); return a[Math.min(a.length - 1, Math.floor(q * a.length))] }
for (const f of FILES) {
  const p = positions(f)
  const xs = p.map((v) => v[0]), ys = p.map((v) => v[1]), zs = p.map((v) => v[2])
  const bands = BANDS.map(([lo, hi]) => {
    const band = p.filter((v) => v[1] >= lo && v[1] < hi)
    const r = band.map((v) => Math.hypot(v[0], v[2]))
    if (!r.length) return `${lo}-${hi}: -`
    // plan extents too: a box collider is sized from these, a circle from the radius
    const bx = band.map((v) => v[0]), bz = band.map((v) => v[2])
    const half = `${Math.max(-Math.min(...bx), Math.max(...bx)).toFixed(2)}x${Math.max(-Math.min(...bz), Math.max(...bz)).toFixed(2)}`
    return `${lo}-${hi}: max ${Math.max(...r).toFixed(2)} p80 ${pct(r, 0.8).toFixed(2)} half ${half}`
  })
  console.log(f.padEnd(34), `x ${Math.min(...xs).toFixed(2)}..${Math.max(...xs).toFixed(2)}  z ${Math.min(...zs).toFixed(2)}..${Math.max(...zs).toFixed(2)}  h ${Math.max(...ys).toFixed(2)}`, '|', bands.join(' | '))
}
