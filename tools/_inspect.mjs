import fs from 'node:fs'
const file = process.argv[2]
const buf = fs.readFileSync(file)
const magic = buf.slice(0, 4).toString()
const jsonLen = buf.readUInt32LE(12)
const json = JSON.parse(buf.slice(20, 20 + jsonLen).toString())
const bin = 20 + jsonLen + 8
let tris = 0, verts = 0
const prims = []
for (const m of json.meshes || []) for (const p of m.primitives) {
  const t = p.indices !== undefined ? json.accessors[p.indices].count / 3 : json.accessors[p.attributes.POSITION].count / 3
  tris += t
  verts += json.accessors[p.attributes.POSITION].count
  prims.push({ mesh: m.name, tris: t, mat: json.materials?.[p.material]?.name, attrs: Object.keys(p.attributes).join(',') })
}
// world bounds from node transforms (translation/scale only, which is all these assets use)
let min = [1e9, 1e9, 1e9], max = [-1e9, -1e9, -1e9]
const walk = (idx, t = [0, 0, 0], s = [1, 1, 1]) => {
  const n = json.nodes[idx]
  const nt = n.translation || [0, 0, 0], ns = n.scale || [1, 1, 1]
  const T = [t[0] + nt[0] * s[0], t[1] + nt[1] * s[1], t[2] + nt[2] * s[2]]
  const S = [s[0] * ns[0], s[1] * ns[1], s[2] * ns[2]]
  if (n.mesh !== undefined) for (const p of json.meshes[n.mesh].primitives) {
    const a = json.accessors[p.attributes.POSITION]
    for (let i = 0; i < 3; i++) {
      min[i] = Math.min(min[i], T[i] + a.min[i] * S[i], T[i] + a.max[i] * S[i])
      max[i] = Math.max(max[i], T[i] + a.min[i] * S[i], T[i] + a.max[i] * S[i])
    }
  }
  for (const c of n.children || []) walk(c, T, S)
}
for (const sc of json.scenes) for (const r of sc.nodes) walk(r)
console.log(JSON.stringify({
  file, magic, sizeMB: +(buf.length / 1048576).toFixed(2), generator: json.asset?.generator, version: json.asset?.version,
  nodes: json.nodes.length, meshes: json.meshes?.length, primitives: prims.length, tris, verts,
  materials: json.materials?.map((m) => ({ name: m.name, tex: !!m.pbrMetallicRoughness?.baseColorTexture, alpha: m.alphaMode || 'OPAQUE', double: !!m.doubleSided, rough: m.pbrMetallicRoughness?.roughnessFactor, metal: m.pbrMetallicRoughness?.metallicFactor })),
  images: json.images?.map((im, i) => ({ mime: im.mimeType, name: im.name, bytes: im.bufferView !== undefined ? json.bufferViews[im.bufferView].byteLength : null })),
  animations: json.animations?.length || 0,
  extensionsUsed: json.extensionsUsed,
  sizeMetres: max.map((v, i) => +(v - min[i]).toFixed(3)),
  min: min.map((v) => +v.toFixed(3)), max: max.map((v) => +v.toFixed(3)),
  topPrims: prims.sort((a, b) => b.tris - a.tris).slice(0, 8),
}, null, 1))
