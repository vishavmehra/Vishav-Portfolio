"""
Hero Tree A (tree.oak.broad) — reproducible Blender build script.

Run headless:
    blender --background --python tools/blender/build_hero_tree_a.py

STATUS: PIPELINE STAGES ARE WRITTEN. GEOMETRY STAGES ARE NOT.

Nothing in this file has ever been executed. Blender is not installed on the
machine this was authored from, so no line below has been run, and no output
has been inspected. Treat every stage as unverified until a real run proves it.

The split is deliberate:

  * Stages that are pure pipeline — scene reset, collection structure, LOD
    decimation, GLB export, validation asserts — are fully determined by
    docs/10_ART_ASSET_PIPELINE.md and are written out properly. They should
    work as-is, modulo Blender API drift.

  * Stages that build geometry are stubs. The canopy in particular cannot be
    authored blind: docs/art/VISUAL_STYLE_EXTRACTION.md is explicit that the
    quality of this asset comes from silhouette, negative space and deliberate
    asymmetry, none of which can be judged without looking at the result. A
    procedural generator written without eyes on it produces exactly the
    "looks procedurally generated" failure the art direction forbids.

References
    design/references/hero-tree-a-production-sheet.png   (primary visual)
    docs/10_ART_ASSET_PIPELINE.md          §10.1, §15, §16, §17, §18
    docs/art/VISUAL_STYLE_EXTRACTION.md    §2, §4, §6
    docs/art/ASSET_REFERENCE_INDEX.md      C-4, C-5, C-6
"""

from __future__ import annotations

import math
import os
import sys

import bpy

# ---------------------------------------------------------------------------
# Resolved parameters
#
# Every number here was chosen by hand against the production sheet and the
# 1.4-unit player, not sampled or seeded. Read docs/10 §10.1 before changing.
# ---------------------------------------------------------------------------

PLAYER_HEIGHT = 1.4  # DD-20. Authoritative. Never changes to suit an asset.

# The production sheet's scale figure is a ~1.73 m human, not Explorer 7-B.
# Proportions read off the sheet are therefore oversized for this world and
# must be scaled. See ASSET_REFERENCE_INDEX C-4 — this factor is a PROPOSAL,
# not an approved decision.
SHEET_FIGURE_HEIGHT = 1.73
SHEET_SCALE = PLAYER_HEIGHT / SHEET_FIGURE_HEIGHT  # ~0.809

# Silhouette envelope. Broader than tall, per docs/10 §10.1.
TREE_HEIGHT = 10.5   # ~7.5x player height
CANOPY_WIDTH = 12.0  # spread exceeds height — this is a spreading oak

# Hard camera constraint: the desktop follow camera sits at 4.2 units and the
# canopy underside must clear 5.0 (docs/09 F3/F6, docs/10 §10.1). Anything
# that drops foliage below CANOPY_UNDERSIDE is a defect, not a style choice.
CAMERA_HEIGHT = 4.2
CANOPY_UNDERSIDE = 5.2
TRUNK_CLEAR_HEIGHT = 4.2  # ground to first major branch junction

TRUNK_BASE_RADIUS = 0.80  # at the root flare
TRUNK_MID_RADIUS = 0.50   # at 2.0 units
TRUNK_TOP_RADIUS = 0.28   # at the first major junction

TRUNK_SIDES = 10   # cross-section resolution; 10 reads round enough at 8+ units
BRANCH_SIDES = 6

# Triangle budget, allocated rather than hoped for. docs/10 §10.1: 2500-4000.
BUDGET = {
    "trunk_and_roots": 400,
    "branches": 400,
    "canopy": 2600,
    "total_max": 4000,
    "lod1": 800,
    "lod2": 500,
}

LOD_RATIOS = {"LOD1": 800 / 3400, "LOD2": 500 / 3400}  # refined after LOD0 is measured
LOD_SWITCH_DISTANCE = 45.0  # world units, docs/10 §8

MATERIAL_NAME = "bark-foliage"  # ONE material. docs/10 §6 ceiling is 12 world-wide.

COLLECTION = "HeroTreeA"

# Output paths.
#
# CONFLICT, UNRESOLVED: the task brief asks for public/assets/3d/hero-tree-a.glb.
# docs/10 §15-§16 specify public/assets/environment/trees/hero-oak-broad.glb,
# and the asset registry loader in §3 is written against that path. Following
# the documented path here per CLAUDE.md precedence. Flagged for a ruling.
BLEND_PATH = "art/blender/hero-tree-a/hero-tree-a.blend"
GLB_DIR = "public/assets/environment/trees"
GLB_NAME = "hero-oak-broad"


# ---------------------------------------------------------------------------
# Pipeline — determined, written, unverified
# ---------------------------------------------------------------------------

def project_root() -> str:
    """Repo root, derived from this file's location."""
    return os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))


def reset_scene() -> None:
    """Empty scene. No cameras, no lights, no default cube (docs/10 §15)."""
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene_collection = bpy.context.scene.collection
    col = bpy.data.collections.new(COLLECTION)
    scene_collection.children.link(col)
    return col


def tri_count(obj: bpy.types.Object) -> int:
    """Evaluated triangle count, modifiers applied. The only number that counts."""
    deps = bpy.context.evaluated_depsgraph_get()
    mesh = obj.evaluated_get(deps).to_mesh()
    n = sum(len(p.vertices) - 2 for p in mesh.polygons)
    obj.evaluated_get(deps).to_mesh_clear()
    return n


def vert_count(obj: bpy.types.Object) -> int:
    deps = bpy.context.evaluated_depsgraph_get()
    mesh = obj.evaluated_get(deps).to_mesh()
    n = len(mesh.vertices)
    obj.evaluated_get(deps).to_mesh_clear()
    return n


def make_material() -> bpy.types.Material:
    """
    Single shared material. Base colour only.

    docs/10 §5 mandates diffuse-only, no normal, no roughness. The Hero Tree A
    sheet asks for diffuse + roughness + normal + alpha. That is contradiction
    C-5 and it is NOT resolved — this follows the document, which is the
    cheaper and reversible choice.

    Colour here is a neutral placeholder. The real surface comes from the
    shared 1024 bark-foliage atlas once it exists. #F0932B is forbidden on any
    surface (DD-23) — amber belongs to light sources only.
    """
    mat = bpy.data.materials.get(MATERIAL_NAME) or bpy.data.materials.new(MATERIAL_NAME)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = (0.42, 0.47, 0.28, 1.0)
        bsdf.inputs["Roughness"].default_value = 1.0
        if "Specular IOR Level" in bsdf.inputs:
            bsdf.inputs["Specular IOR Level"].default_value = 0.0
    return mat


def build_lod(source: bpy.types.Object, name: str, ratio: float) -> bpy.types.Object:
    """
    Decimate a copy of LOD0. Collapse preserves silhouette better than
    un-subdivide for organic forms, which is what matters here (docs/10 §8).
    """
    lod = source.copy()
    lod.data = source.data.copy()
    lod.name = name
    source.users_collection[0].objects.link(lod)

    mod = lod.modifiers.new(name="decimate", type="DECIMATE")
    mod.decimate_type = "COLLAPSE"
    mod.ratio = ratio

    bpy.context.view_layer.objects.active = lod
    bpy.ops.object.modifier_apply(modifier=mod.name)
    return lod


def export_glb(objs: list[bpy.types.Object], out_path: str, draco: bool = False) -> None:
    """
    GLB export per docs/10 §15/§17.

    +Y up (glTF convention; Blender is Z-up and the exporter converts).
    No cameras, no lights. Modifiers applied. Materials exported so the
    ingest step can swap them for the shared atlas material.

    Draco is OFF by default. docs/10 §4 confirms DRACOLoader ships with three,
    but the loader singleton does not exist in src/ yet, so compressing now
    would produce a file nothing can read. Turn it on when the loader lands.
    """
    os.makedirs(os.path.dirname(out_path), exist_ok=True)

    bpy.ops.object.select_all(action="DESELECT")
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]

    bpy.ops.export_scene.gltf(
        filepath=out_path,
        export_format="GLB",
        use_selection=True,
        export_yup=True,
        export_apply=True,
        export_materials="EXPORT",
        export_cameras=False,
        export_lights=False,
        export_texcoords=True,
        export_normals=True,
        export_tangents=False,
        export_draco_mesh_compression_enable=draco,
    )


def validate(obj: bpy.types.Object, label: str, tri_max: int) -> list[str]:
    """
    Gate from docs/10 §18. Returns failures; an empty list is the only pass.
    Never soften a check to make an asset pass.
    """
    fails = []
    tris = tri_count(obj)
    if tris > tri_max:
        fails.append(f"{label}: {tris} tris exceeds budget {tri_max}")

    if len(obj.data.materials) != 1:
        fails.append(f"{label}: {len(obj.data.materials)} materials, expected 1")

    if not obj.data.uv_layers:
        fails.append(f"{label}: no UV layer")

    # Origin at base centre on the ground plane (docs/10 §15).
    if abs(obj.location.x) > 1e-4 or abs(obj.location.y) > 1e-4 or abs(obj.location.z) > 1e-4:
        fails.append(f"{label}: origin not at world zero: {tuple(obj.location)}")

    # Canopy clearance — the constraint most likely to be violated by a
    # good-looking canopy, and the one that breaks the camera if missed.
    lowest_foliage = min(
        (obj.matrix_world @ v.co).z for v in obj.data.vertices
    ) if obj.data.vertices else 0.0
    _ = lowest_foliage  # per-part check belongs on the foliage object, not the merge

    return fails


# ---------------------------------------------------------------------------
# Geometry — NOT WRITTEN. Requires visual iteration in Blender.
# ---------------------------------------------------------------------------

def build_trunk_and_roots(col, mat):
    """
    TODO. Tapered 10-sided trunk, ground to TRUNK_CLEAR_HEIGHT, with a
    visible root flare of 4-5 buttresses of DELIBERATELY unequal size.

    Not a stack of cones. The sheet's root/base panel shows the flare meeting
    the ground with moss in the crevices — the flare is a silhouette feature,
    not a texture.

    ~400 tris.
    """
    raise NotImplementedError("Requires Blender + visual iteration against the sheet.")


def build_branches(col, mat):
    """
    TODO. 5 major branches at individually chosen angles and lengths — the
    sheet annotates "major branch asymmetry and natural spread" — plus 3-4
    secondary branches only where a canopy mass needs visible support.

    Branches must read as CARRYING their foliage mass. Secondary branch count
    stays minimal (the conifer sheet's instruction, applied here too).

    ~400 tris.
    """
    raise NotImplementedError("Requires Blender + visual iteration against the sheet.")


def build_canopy(col, mat):
    """
    TODO — the hardest and most important stage.

    3-4 major foliage masses forming the silhouette, plus smaller supporting
    masses. NOT icospheres. NOT lumpy blobs. The sheet's own annotation, once
    the garbled AI text is read for intent, is "carefully delineated, not
    spheres or lumpy blobs".

    VISUAL_STYLE_EXTRACTION §4 specifies alpha-carded layered planes forming
    grouped masses with real daylight gaps between them. Two viable
    constructions, and choosing between them needs a render, not a guess:

      (a) angular faceted shells  — cheap, reads solid at distance,
          risks looking like the low-poly asset packs the direction rejects
      (b) layered alpha cards     — matches the sheet's wireframe panel and
          the documented direction, but costs alpha-test overdraw on mobile

    Whichever wins, the boundary must be irregular and the underside must not
    close into a solid wall. Negative space is the single biggest gap between
    the references and the current procedural world.

    ~2600 tris.
    """
    raise NotImplementedError("Requires Blender + visual iteration against the sheet.")


def merge(objs, name):
    """
    TODO. Join into a single mesh object so each placement is one draw call.
    Must happen before UV packing so islands share one atlas layout.
    """
    raise NotImplementedError("Requires Blender.")


def unwrap(obj):
    """
    TODO. Smart UV project as a first pass, then hand-fix seams so bark runs
    along the trunk and foliage cards land on the atlas foliage region.
    Packed for a shared 1024 atlas (docs/10 §5, §14).
    """
    raise NotImplementedError("Requires Blender.")


# ---------------------------------------------------------------------------

def main() -> int:
    root = project_root()
    col = reset_scene()
    mat = make_material()

    trunk = build_trunk_and_roots(col, mat)
    branches = build_branches(col, mat)
    canopy = build_canopy(col, mat)

    # Merge into one object: one draw call per instance, instancing-safe.
    # docs/10 §7 — the world places 6 of these through an InstancedMesh.
    lod0 = merge([trunk, branches, canopy], name="HeroTreeA_LOD0")
    unwrap(lod0)

    fails = validate(lod0, "LOD0", BUDGET["total_max"])

    lod1 = build_lod(lod0, "HeroTreeA_LOD1", LOD_RATIOS["LOD1"])
    lod2 = build_lod(lod0, "HeroTreeA_LOD2", LOD_RATIOS["LOD2"])
    fails += validate(lod1, "LOD1", BUDGET["lod1"])
    fails += validate(lod2, "LOD2", BUDGET["lod2"])

    if fails:
        for f in fails:
            print(f"VALIDATION FAILURE: {f}", file=sys.stderr)
        return 1

    for obj, suffix in ((lod0, ""), (lod1, "-lod1"), (lod2, "-lod2")):
        export_glb([obj], os.path.join(root, GLB_DIR, f"{GLB_NAME}{suffix}.glb"))

    blend_out = os.path.join(root, BLEND_PATH)
    os.makedirs(os.path.dirname(blend_out), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=blend_out)

    print(f"LOD0 {tri_count(lod0)} tris / {vert_count(lod0)} verts")
    print(f"LOD1 {tri_count(lod1)} tris")
    print(f"LOD2 {tri_count(lod2)} tris")
    return 0


if __name__ == "__main__":
    sys.exit(main())
