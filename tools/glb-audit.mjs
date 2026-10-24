/**
 * Geometry audit for every shipped GLB.
 *
 * Answers the questions the eye asks at gameplay distance and that a triangle
 * count cannot: does this mesh occupy space, or is it a sheet? Are its faces
 * pointing in many directions, or is it a fan of coplanar triangles?
 *
 * Run: node tools/glb-audit.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.join(process.cwd(), 'public/assets/3d')

const COMPONENT = { 5120: Int8Array, 5121: Uint8Array, 5122: Int16Array, 5123: Uint16Array, 5125: Uint32Array, 5126: Float32Array }
const NUM = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT4: 16 }

function parse(file) {
  const buf = fs.readFileSync(file)
  const jsonLen = buf.readUInt32LE(12)
  const json = JSON.parse(buf.slice(20, 20 + jsonLen).toString('utf8'))
  let bin = null
  let off = 20 + jsonLen
  while (off < buf.length) {
    const len = buf.readUInt32LE(off)
    const type = buf.readUInt32LE(off + 4)
    if (type === 0x004e4942) bin = buf.slice(off + 8, off + 8 + len)
    off += 8 + len + ((4 - (len % 4)) % 4)
  }
  return { json, bin, bytes: buf.length }
}

function read(json, bin, index) {
  const acc = json.accessors[index]
  const view = json.bufferViews[acc.bufferView]
  const Type = COMPONENT[acc.componentType]
  const n = NUM[acc.type]
  const start = (view.byteOffset ?? 0) + (acc.byteOffset ?? 0)
  const stride = view.byteStride
  if (!stride || stride === n * Type.BYTES_PER_ELEMENT) {
    return new Type(bin.buffer, bin.byteOffset + start, acc.count * n)
  }
  const out = new Type(acc.count * n)
  for (let i = 0; i < acc.count; i++) {
    const src = new Type(bin.buffer, bin.byteOffset + start + i * stride, n)
    out.set(src, i * n)
  }
  return out
}

/** Volume of the mesh's convex-ish extent vs its bounding box, plus face-normal spread. */
function analyse(json, bin, mesh) {
  let tris = 0
  const min = [Infinity, Infinity, Infinity]
  const max = [-Infinity, -Infinity, -Infinity]
  // Face normals bucketed onto a coarse sphere: how many directions does this thing face?
  const buckets = new Set()
  let signedVolume = 0
  let area = 0

  for (const prim of mesh.primitives) {
    const pos = read(json, bin, prim.attributes.POSITION)
    const idx = prim.indices !== undefined ? read(json, bin, prim.indices) : null
    const count = idx ? idx.length : pos.length / 3
    for (let i = 0; i < pos.length; i += 3) {
      for (let k = 0; k < 3; k++) {
        if (pos[i + k] < min[k]) min[k] = pos[i + k]
        if (pos[i + k] > max[k]) max[k] = pos[i + k]
      }
    }
    for (let i = 0; i + 2 < count; i += 3) {
      const a = (idx ? idx[i] : i) * 3
      const b = (idx ? idx[i + 1] : i + 1) * 3
      const c = (idx ? idx[i + 2] : i + 2) * 3
      const ax = pos[a], ay = pos[a + 1], az = pos[a + 2]
      const bx = pos[b], by = pos[b + 1], bz = pos[b + 2]
      const cx = pos[c], cy = pos[c + 1], cz = pos[c + 2]
      const ux = bx - ax, uy = by - ay, uz = bz - az
      const vx = cx - ax, vy = cy - ay, vz = cz - az
      const nx = uy * vz - uz * vy
      const ny = uz * vx - ux * vz
      const nz = ux * vy - uy * vx
      const len = Math.hypot(nx, ny, nz)
      if (len > 1e-9) {
        area += len / 2
        // 8x8x8-ish direction buckets
        buckets.add(`${Math.round((nx / len) * 3)},${Math.round((ny / len) * 3)},${Math.round((nz / len) * 3)}`)
      }
      // signed volume of tetra with origin — sums to the enclosed volume if closed
      signedVolume += (ax * (by * cz - bz * cy) - ay * (bx * cz - bz * cx) + az * (bx * cy - by * cx)) / 6
      tris++
    }
  }

  const size = [max[0] - min[0], max[1] - min[1], max[2] - min[2]]
  const sorted = [...size].sort((a, b) => a - b)
  return {
    tris,
    size: size.map((v) => +v.toFixed(2)),
    /** smallest extent / largest extent. Under ~0.08 is a sheet. */
    flatness: +(sorted[0] / (sorted[2] || 1)).toFixed(3),
    /** distinct face directions. A fan of coplanar triangles has very few. */
    normalDirections: buckets.size,
    /** enclosed volume / bounding-box volume. Near 0 means the surface encloses nothing. */
    solidity: +(Math.abs(signedVolume) / (size[0] * size[1] * size[2] || 1)).toFixed(3),
    area: +area.toFixed(2),
  }
}

const files = []
;(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full)
    else if (entry.name.endsWith('.glb')) files.push(full)
  }
})(ROOT)

const rows = []
for (const file of files.sort()) {
  const { json, bin, bytes } = parse(file)
  const mats = (json.materials ?? []).map((m) => m.name)
  const doubleSided = (json.materials ?? []).some((m) => m.doubleSided)
  for (const mesh of json.meshes) {
    const a = analyse(json, bin, mesh)
    rows.push({
      file: path.relative(ROOT, file).replace(/\\/g, '/'),
      mesh: mesh.name,
      ...a,
      mats: mats.length,
      doubleSided,
      kb: +(bytes / 1024).toFixed(1),
    })
  }
}

const w = (s, n) => String(s).padEnd(n)
console.log(
  w('FILE', 44) + w('MESH', 20) + w('TRIS', 7) + w('SIZE (x,y,z)', 22) + w('FLAT', 7) + w('DIRS', 6) + w('SOLID', 7) + w('2SIDE', 7) + 'KB',
)
console.log('-'.repeat(130))
for (const r of rows) {
  console.log(
    w(r.file, 44) + w(r.mesh, 20) + w(r.tris, 7) + w(r.size.join(', '), 22) +
    w(r.flatness, 7) + w(r.normalDirections, 6) + w(r.solidity, 7) + w(r.doubleSided ? 'yes' : 'no', 7) + r.kb,
  )
}

console.log('\nSUSPECT (flatness < 0.08, or fewer than 8 face directions, or solidity < 0.02):')
for (const r of rows) {
  const why = []
  if (r.flatness < 0.08) why.push(`sheet-like (flatness ${r.flatness})`)
  if (r.normalDirections < 8) why.push(`few face directions (${r.normalDirections})`)
  if (r.solidity < 0.02) why.push(`encloses almost nothing (solidity ${r.solidity})`)
  if (why.length) console.log(`  ${r.file} :: ${r.mesh} — ${why.join('; ')}`)
}
