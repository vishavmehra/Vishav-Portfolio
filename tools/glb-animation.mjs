/**
 * Independent check of an exported GLB's animation, run on the file itself rather
 * than on the Blender scene it came from: the pipeline has to survive the export.
 *
 * Reports every animation clip, what it drives, its duration, whether the first and
 * last sample of each channel match (so the clip loops), the morph targets each mesh
 * carries, and the vertex-colour/material state.
 *
 * Run: node tools/glb-animation.mjs public/assets/3d/river.glb
 */
import fs from 'node:fs'

const file = process.argv[2] || 'public/assets/3d/river.glb'
const buf = fs.readFileSync(file)
const jsonLen = buf.readUInt32LE(12)
const json = JSON.parse(buf.slice(20, 20 + jsonLen).toString())
const binStart = 20 + jsonLen + 8

const TYPE_SIZE = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 }
const READ = {
  5126: (b, o) => b.readFloatLE(o),
  5123: (b, o) => b.readUInt16LE(o),
  5125: (b, o) => b.readUInt32LE(o),
  5121: (b, o) => b.readUInt8(o),
  5122: (b, o) => b.readInt16LE(o),
}
const BYTES = { 5126: 4, 5123: 2, 5125: 4, 5121: 1, 5122: 2 }

function read(accessorIndex) {
  const acc = json.accessors[accessorIndex]
  const comps = TYPE_SIZE[acc.type]
  const out = new Array(acc.count * comps).fill(0)
  if (acc.bufferView !== undefined) {
    const bv = json.bufferViews[acc.bufferView]
    const stride = bv.byteStride || comps * BYTES[acc.componentType]
    const base = binStart + (bv.byteOffset || 0) + (acc.byteOffset || 0)
    for (let i = 0; i < acc.count; i++) {
      for (let c = 0; c < comps; c++) out[i * comps + c] = READ[acc.componentType](buf, base + i * stride + c * BYTES[acc.componentType])
    }
  }
  if (acc.sparse) {
    const idxBv = json.bufferViews[acc.sparse.indices.bufferView]
    const valBv = json.bufferViews[acc.sparse.values.bufferView]
    const idxBase = binStart + (idxBv.byteOffset || 0) + (acc.sparse.indices.byteOffset || 0)
    const valBase = binStart + (valBv.byteOffset || 0) + (acc.sparse.values.byteOffset || 0)
    const idxBytes = BYTES[acc.sparse.indices.componentType]
    for (let i = 0; i < acc.sparse.count; i++) {
      const target = READ[acc.sparse.indices.componentType](buf, idxBase + i * idxBytes)
      for (let c = 0; c < comps; c++) out[target * comps + c] = READ[acc.componentType](buf, valBase + (i * comps + c) * BYTES[acc.componentType])
    }
  }
  return out
}

const report = { file, sizeKB: +(buf.length / 1024).toFixed(1), meshes: [], animations: [] }

for (const node of json.nodes) {
  if (node.mesh === undefined) continue
  const mesh = json.meshes[node.mesh]
  const prim = mesh.primitives[0]
  const pos = json.accessors[prim.attributes.POSITION]
  const mat = json.materials?.[prim.material]
  report.meshes.push({
    node: node.name,
    mesh: mesh.name,
    tris: prim.indices !== undefined ? json.accessors[prim.indices].count / 3 : pos.count / 3,
    verts: pos.count,
    morphTargets: prim.targets ? prim.targets.length : 0,
    sparseTargets: prim.targets ? prim.targets.filter((t) => json.accessors[t.POSITION].sparse).length : 0,
    vertexColours: prim.attributes.COLOR_0 !== undefined,
    material: mat?.name,
    roughness: mat?.pbrMetallicRoughness?.roughnessFactor,
    doubleSided: !!mat?.doubleSided,
    alphaMode: mat?.alphaMode || 'OPAQUE',
    translation: node.translation || null,
    min: pos.min?.map((v) => +v.toFixed(2)),
    max: pos.max?.map((v) => +v.toFixed(2)),
  })
}

for (const anim of json.animations || []) {
  const channels = []
  let duration = 0
  for (const ch of anim.channels) {
    const sampler = anim.samplers[ch.sampler]
    const times = read(sampler.input)
    const values = read(sampler.output)
    const node = json.nodes[ch.target.node]
    const stride = values.length / times.length
    const first = values.slice(0, stride)
    const last = values.slice(values.length - stride)
    const loopGap = Math.max(...first.map((v, i) => Math.abs(v - last[i])))
    duration = Math.max(duration, times[times.length - 1])
    channels.push({
      node: node.name,
      path: ch.target.path,
      interpolation: sampler.interpolation || 'LINEAR',
      keys: times.length,
      valuesPerKey: stride,
      start: +times[0].toFixed(3),
      end: +times[times.length - 1].toFixed(3),
      loopGap: +loopGap.toFixed(4),
    })
  }
  report.animations.push({ name: anim.name, durationSeconds: +duration.toFixed(3), channels })
}

console.log(JSON.stringify(report, null, 1))
