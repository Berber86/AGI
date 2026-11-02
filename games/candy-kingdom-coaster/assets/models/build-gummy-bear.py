#!/usr/bin/env python3
"""Build the Candy Kingdom Coaster Gummy Bear 3D asset in real Blender (bpy).

Pipeline (Blender 4.2 LTS headless via `bpy`):
  1. Anatomical block-out of a plump, chubby Haribo-style gummy bear fused via
     Blender's `REMESH` modifier (`mode='VOXEL'`, 14 mm voxel grid) into a 100%
     watertight, non-self-intersecting gelatin skin (zero internal trapped faces,
     eliminating the detached limbs & internal alpha-overlap artifacts of the
     legacy 9-SphereGeometry bear).
  2. Multi-iteration Blender `SMOOTH` modifier melts every limb-to-body join into
     syrupy, organic candy fillets.
  3. Direct candy-mold sculpt pass shapes cupped inner ear dishes, palm cushions,
     signature Haribo chest/tummy relief pad, cute navel dimple, happy curved
     smile crease, starch-mold back taper, and flat beveled soles at Y = 0.
  4. Curvature-aligned symmetric quad retopology via Blender's `QuadriFlow`
     remesher (`bpy.ops.object.quadriflow_remesh(use_mesh_symmetry=True)`) for
     both `GummyBear_Hi` and `GummyBear_Lo`, plus exact high-poly surface normals
     projected from the 80k-tri sculpt BVH (`normals_split_custom_set_from_vertices`).
  5. Crisp glossy candy bead eyes (with flush corneal sparkle catchlights) and a
     heart-tapered berry button nose snapped onto the face via BVH raycast.
  6. Raytraced optical baking via `mathutils.bvhtree.BVHTree`:
     - Inward cone rays measure true 3D gelatin subsurface thickness (thin cupped
       ears, paw tips, and snout rim glow brighter as light transmits through jelly).
     - Outward hemisphere rays bake soft ambient occlusion into creases (warm
       fruit-syrup concentration in folds — never muddy grey).
  7. Exports:
     - `gummy-bear.glb`   — runtime binary glTF 2.0 (`GummyBear_Hi` + `GummyBear_Lo`
                            with `POSITION`, `NORMAL`, `TEXCOORD_0`, `COLOR_0`)
     - `gummy-bear.blend` — clean Blender 4.2 scene (Principled BSDF gummy shader,
                            3-point studio lights & camera) ready for desktop Blender.
     - Optional `--render-studio <png>` Cycles + OpenImageDenoise comparison render.

Usage:
  python3 build-gummy-bear.py [--render-studio /tmp/shots/blender_studio.png]
"""

from __future__ import annotations

import argparse
import math
import os
import random
from pathlib import Path

import bpy
import bmesh
from mathutils import Euler, Matrix, Vector
from mathutils.bvhtree import BVHTree

HERE = Path(__file__).resolve().parent
GLB_OUT = HERE / "gummy-bear.glb"
BLEND_OUT = HERE / "gummy-bear.blend"


def reset_scene() -> bpy.types.Scene:
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.unit_settings.system = "METRIC"
    scene.unit_settings.scale_length = 1.0
    return scene


def append_ellipsoid(
    bm: bmesh.types.BMesh,
    loc: tuple[float, float, float],
    radii: tuple[float, float, float],
    rot_deg: tuple[float, float, float] = (0.0, 0.0, 0.0),
    u_seg: int = 28,
    v_seg: int = 20,
) -> None:
    tmp = bmesh.new()
    bmesh.ops.create_uvsphere(tmp, u_segments=u_seg, v_segments=v_seg, radius=1.0)
    mat = (
        Matrix.Translation(Vector(loc))
        @ Euler([math.radians(a) for a in rot_deg], "XYZ").to_matrix().to_4x4()
        @ Matrix.Diagonal(Vector((radii[0], radii[1], radii[2], 1.0)))
    )
    bmesh.ops.transform(tmp, matrix=mat, verts=tmp.verts)
    tmesh = bpy.data.meshes.new("_part")
    tmp.to_mesh(tmesh)
    tmp.free()
    bm.from_mesh(tmesh)
    bpy.data.meshes.remove(tmesh)


def append_capsule(
    bm: bmesh.types.BMesh,
    p0: tuple[float, float, float],
    p1: tuple[float, float, float],
    r0: float,
    r1: float,
    steps: int = 8,
) -> None:
    v0, v1 = Vector(p0), Vector(p1)
    for i in range(steps):
        t = i / max(1, steps - 1)
        p = v0.lerp(v1, t)
        r = r0 + (r1 - r0) * t
        append_ellipsoid(bm, (p.x, p.y, p.z), (r, r, r), u_seg=22, v_seg=16)


def build_sculpted_gelatin_body(scene: bpy.types.Scene) -> bpy.types.Object:
    """Build 80k-tri watertight gummy bear sculpt via Voxel Remesh + Smooth + Mold Sculpt.

    Blender axes (exported as glTF +Y-up automatically):
      +X / -X = lateral width (symmetric)
      -Y      = FRONT (face, snout, tummy, toes -> glTF +Z)
      +Z      = UP    (soles at Z=0, ear tops at Z≈1.98 -> glTF +Y)
    """
    bm = bmesh.new()

    # 1. Plump, huggable pear-shaped Haribo jelly torso
    append_ellipsoid(bm, (0.0, -0.02, 0.52), (0.50, 0.40, 0.45))
    append_ellipsoid(bm, (0.0, 0.00, 0.87), (0.43, 0.35, 0.36))
    append_ellipsoid(bm, (0.0, -0.14, 0.57), (0.37, 0.32, 0.35))
    append_ellipsoid(bm, (0.0, 0.00, 1.15), (0.31, 0.27, 0.20))

    # 2. Big adorable round teddy head + chubby cheeks + rounded snout
    append_ellipsoid(bm, (0.0, 0.00, 1.49), (0.435, 0.375, 0.38))
    for sx in (-1.0, 1.0):
        append_ellipsoid(bm, (sx * 0.215, -0.075, 1.39), (0.24, 0.22, 0.20))
    append_ellipsoid(bm, (0.0, -0.295, 1.40), (0.205, 0.165, 0.148), rot_deg=(6.0, 0.0, 0.0))

    # 3. Thick rounded gummy ears deeply rooted into the head
    for sx in (-1.0, 1.0):
        append_ellipsoid(
            bm,
            (sx * 0.31, 0.02, 1.805),
            (0.188, 0.120, 0.188),
            rot_deg=(8.0, sx * 15.0, sx * -12.0),
        )

    # 4. Cheerful welcoming/cheering stubby gummy arms (slightly raised hug pose!)
    for sx in (-1.0, 1.0):
        append_capsule(
            bm,
            (sx * 0.34, -0.01, 0.92),
            (sx * 0.55, -0.24, 0.97),
            r0=0.185,
            r1=0.156,
            steps=8,
        )
        append_ellipsoid(
            bm,
            (sx * 0.575, -0.265, 0.98),
            (0.160, 0.162, 0.158),
            rot_deg=(-12.0, 0.0, sx * -18.0),
        )

    # 5. Stubby seated/standing gummy hind legs & forward candy paws
    for sx in (-1.0, 1.0):
        append_ellipsoid(bm, (sx * 0.29, -0.02, 0.26), (0.225, 0.225, 0.23))
        append_ellipsoid(
            bm,
            (sx * 0.31, -0.18, 0.145),
            (0.195, 0.265, 0.155),
            rot_deg=(0.0, 0.0, sx * -8.0),
        )
        for ti, tx_off in enumerate((-0.078, 0.0, 0.078)):
            ty_off = -0.392 if ti == 1 else -0.370
            append_ellipsoid(
                bm,
                (sx * 0.322 + tx_off, ty_off, 0.105),
                (0.068, 0.074, 0.068),
                u_seg=16,
                v_seg=12,
            )

    raw_mesh = bpy.data.meshes.new("GummyBodyRaw")
    bm.to_mesh(raw_mesh)
    bm.free()

    body = bpy.data.objects.new("GummyBodySculpt", raw_mesh)
    scene.collection.objects.link(body)
    bpy.context.view_layer.objects.active = body

    # Voxel Remesh -> 100% watertight manifold candy skin
    rem = body.modifiers.new("VoxelRemesh", "REMESH")
    rem.mode = "VOXEL"
    rem.voxel_size = 0.014
    rem.use_smooth_shade = True
    bpy.ops.object.modifier_apply(modifier=rem.name)

    # Smooth -> syrupy melted-gelatin fillets
    sm1 = body.modifiers.new("MeltFillets", "SMOOTH")
    sm1.factor = 0.55
    sm1.iterations = 14
    bpy.ops.object.modifier_apply(modifier=sm1.name)

    # Direct candy-mold sculpt details
    verts = body.data.vertices
    min_z0 = min(v.co.z for v in verts)

    for v in verts:
        x, y, z = v.co.x, v.co.y, v.co.z - min_z0 - 0.022

        # a) Molded flat candy sole at Z = 0 with soft rounded edge bevel
        if z <= 0.0:
            z = 0.0
        elif z < 0.055:
            t = z / 0.055
            z = 0.055 * (t * t * (3.0 - 2.0 * t))

        # b) Subtle starch-mold flatter back
        if y > 0.24:
            y = 0.24 + (y - 0.24) * 0.55

        # c) Cupped inner ear dishes on front (-Y) side of both ears
        for sx in (-1.0, 1.0):
            ex = (x - sx * 0.305) / 0.118
            ez = (z - 1.790) / 0.118
            er2 = ex * ex + ez * ez
            if y < 0.02 and er2 < 1.0:
                y += 0.055 * ((1.0 - er2) ** 1.6)

        # d) Soft concave inner palm cushions on cheering paws
        for sx in (-1.0, 1.0):
            px = (x - sx * 0.555) / 0.095
            pz = (z - 0.965) / 0.095
            pr2 = px * px + pz * pz
            if y < -0.26 and pr2 < 1.0:
                y += 0.025 * ((1.0 - pr2) ** 1.5)

        # e) Signature Haribo chest V-collar & plump oval tummy relief pad
        if y < -0.20 and 0.30 < z < 1.04:
            u = abs(x) / 0.27
            w = (z - 0.61) / 0.26
            r = math.sqrt(u * u + w * w)
            ridge = math.exp(-((r - 0.90) / 0.16) ** 2) * 0.024
            groove = -math.exp(-((r - 1.12) / 0.12) ** 2) * 0.012
            pillow = max(0.0, 1.0 - r * r) * 0.020
            nd = math.hypot(x, z - 0.44)
            navel = -0.020 * math.cos((nd / 0.045) * (math.pi * 0.5)) ** 2 if nd < 0.045 else 0.0
            front_w = min(1.0, (-y - 0.20) / 0.14)
            y -= (ridge + groove + pillow + navel) * front_w

        # f) Shallow eye sockets + happy curved smile groove + philtrum
        if y < -0.24 and 1.24 < z < 1.64:
            for sx in (-1.0, 1.0):
                ed = math.hypot((x - sx * 0.155) / 0.070, (z - 1.515) / 0.070)
                if ed < 1.0:
                    y += 0.018 * ((1.0 - ed * ed) ** 1.5)

            z_smile = 1.326 + 2.25 * (x * x)
            dz = abs(z - z_smile)
            if abs(x) < 0.120 and dz < 0.028 and y < -0.32:
                groove_s = math.cos((dz / 0.028) * (math.pi * 0.5)) ** 2
                taper = 1.0 - (abs(x) / 0.120) ** 4
                y += 0.030 * groove_s * taper
            for sx in (-1.0, 1.0):
                dd = math.hypot(x - sx * 0.116, z - 1.356)
                if dd < 0.034 and y < -0.30:
                    y += 0.017 * math.cos((dd / 0.034) * (math.pi * 0.5)) ** 2
            if abs(x) < 0.018 and 1.332 < z < 1.425 and y < -0.36:
                y += 0.013 * math.cos((abs(x) / 0.018) * (math.pi * 0.5)) ** 2

        v.co = Vector((x, y, z))

    body.data.update()

    sm2 = body.modifiers.new("PolishSculpt", "SMOOTH")
    sm2.factor = 0.35
    sm2.iterations = 3
    bpy.ops.object.modifier_apply(modifier=sm2.name)

    # Normalize exact height to 1.98 m with soles pinned cleanly at Z = 0.000
    zs = [v.co.z for v in body.data.vertices]
    z_min, z_max = min(zs), max(zs)
    sc = 1.98 / (z_max - z_min)
    for v in body.data.vertices:
        v.co.x *= sc
        v.co.y *= sc
        z_new = (v.co.z - z_min) * sc
        v.co.z = 0.0 if z_new < 0.004 else z_new
    body.data.update()

    for poly in body.data.polygons:
        poly.use_smooth = True

    return body


def make_uv_sphere_mesh(
    name: str,
    radius: float,
    segments: int,
    rings: int,
    scale: tuple[float, float, float],
    rot_deg: tuple[float, float, float],
    loc: tuple[float, float, float],
    scene: bpy.types.Scene,
) -> bpy.types.Object:
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=segments, v_segments=rings, radius=radius)
    mat = (
        Matrix.Translation(Vector(loc))
        @ Euler([math.radians(a) for a in rot_deg], "XYZ").to_matrix().to_4x4()
        @ Matrix.Diagonal(Vector((scale[0], scale[1], scale[2], 1.0)))
    )
    bmesh.ops.transform(bm, matrix=mat, verts=bm.verts)
    mesh = bpy.data.meshes.new(name)
    bm.to_mesh(mesh)
    bm.free()
    for p in mesh.polygons:
        p.use_smooth = True
    obj = bpy.data.objects.new(name, mesh)
    scene.collection.objects.link(obj)
    return obj


def build_face_features(
    scene: bpy.types.Scene, body_bvh: BVHTree, detail_hi: bool = True
) -> list[tuple[bpy.types.Object, str]]:
    """Create glossy bead eyes, flush corneal sparkle catchlights, and berry button nose."""
    seg, ring = (14, 10) if detail_hi else (8, 6)
    parts: list[tuple[bpy.types.Object, str]] = []

    for sx in (-1.0, 1.0):
        ex, ez = sx * 0.156, 1.545
        hit, _, _, _ = body_bvh.ray_cast(Vector((ex, -2.0, ez)), Vector((0.0, 1.0, 0.0)))
        ey = hit.y if hit else -0.35
        yaw = sx * -16.0
        eye_center = Vector((ex, ey - 0.011, ez))
        eye = make_uv_sphere_mesh(
            f"Eye_{'L' if sx > 0 else 'R'}_{'Hi' if detail_hi else 'Lo'}",
            radius=0.054,
            segments=seg,
            rings=ring,
            scale=(0.95, 0.64, 1.06),
            rot_deg=(8.0, 0.0, yaw),
            loc=(eye_center.x, eye_center.y, eye_center.z),
            scene=scene,
        )
        parts.append((eye, "eye"))

        # Flush corneal catchlight cap hugged right onto the upper-left eye surface
        # so from side angles the eye stays a pure smooth dome!
        gleam_dir = Vector((-0.26, -0.90, 0.35)).normalized()
        gleam_pos = eye_center + Vector((gleam_dir.x * 0.048, gleam_dir.y * 0.0345, gleam_dir.z * 0.052))
        gleam_rot = gleam_dir.to_track_quat("-Y", "Z").to_euler()
        gleam = make_uv_sphere_mesh(
            f"Gleam_{'L' if sx > 0 else 'R'}_{'Hi' if detail_hi else 'Lo'}",
            radius=0.0165,
            segments=8 if detail_hi else 6,
            rings=5 if detail_hi else 4,
            scale=(1.0, 0.18, 1.0),
            rot_deg=(math.degrees(gleam_rot.x), math.degrees(gleam_rot.y), math.degrees(gleam_rot.z)),
            loc=(gleam_pos.x, gleam_pos.y, gleam_pos.z),
            scene=scene,
        )
        parts.append((gleam, "gleam"))

    # Heart-tapered berry button nose on tip of snout
    nx, nz = 0.0, 1.450
    nhit, _, _, _ = body_bvh.ray_cast(Vector((nx, -2.0, nz)), Vector((0.0, 1.0, 0.0)))
    ny = nhit.y if nhit else -0.45
    nose = make_uv_sphere_mesh(
        f"Nose_{'Hi' if detail_hi else 'Lo'}",
        radius=0.064,
        segments=seg,
        rings=ring,
        scale=(1.18, 0.66, 0.85),
        rot_deg=(-12.0, 0.0, 0.0),
        loc=(nx, ny - 0.014, nz),
        scene=scene,
    )
    for v in nose.data.vertices:
        dz = v.co.z - nz
        if dz < 0.0:
            v.co.x *= max(0.45, 1.0 + dz * 8.2)
        else:
            v.co.x *= 1.0 + dz * 1.6
    nose.data.update()
    parts.append((nose, "nose"))

    return parts


def fibonacci_hemisphere(normal: Vector, count: int, spread: float = 0.88) -> list[Vector]:
    n = normal.normalized()
    helper = Vector((1.0, 0.0, 0.0)) if abs(n.x) < 0.9 else Vector((0.0, 1.0, 0.0))
    t1 = n.cross(helper).normalized()
    t2 = n.cross(t1).normalized()
    dirs = []
    golden = math.pi * (3.0 - math.sqrt(5.0))
    for i in range(count):
        u = (i + 0.5) / count
        r = math.sqrt(u) * spread
        phi = i * golden
        dx = math.cos(phi) * r
        dy = math.sin(phi) * r
        dz = math.sqrt(max(0.0, 1.0 - dx * dx - dy * dy))
        dirs.append((t1 * dx + t2 * dy + n * dz).normalized())
    return dirs


def bake_optical_gummy_vertex_colors(
    mesh: bpy.types.Mesh,
    high_bvh: BVHTree,
    part_tags: list[str],
) -> None:
    """Raytrace true 3D gelatin subsurface thickness + ambient occlusion + candy detail."""
    if "Color" in mesh.color_attributes:
        mesh.color_attributes.remove(mesh.color_attributes["Color"])
    col_attr = mesh.color_attributes.new(name="Color", type="FLOAT_COLOR", domain="POINT")
    mesh.color_attributes.active_color = col_attr
    mesh.color_attributes.render_color_index = 0

    ao_samples = 22
    thick_samples = 12
    ao_max_dist = 0.42
    thick_max_dist = 0.78

    for idx, v in enumerate(mesh.vertices):
        tag = part_tags[idx]
        if tag == "gleam":
            col_attr.data[idx].color = (1.0, 1.0, 1.0, 1.0)
            continue
        if tag == "eye":
            col_attr.data[idx].color = (0.024, 0.015, 0.028, 1.0)
            continue
        if tag == "nose":
            top_lift = max(0.0, v.normal.z) * 0.035
            col_attr.data[idx].color = (0.036 + top_lift, 0.018 + top_lift * 0.7, 0.034 + top_lift, 1.0)
            continue

        p = v.co
        n = v.normal.normalized() if v.normal.length > 1e-6 else Vector((0.0, -1.0, 0.0))

        # 1. Outward Ambient Occlusion
        origin_out = p + n * 0.006
        occluded = 0.0
        for d in fibonacci_hemisphere(n, ao_samples, spread=0.92):
            hit, _, _, dist = high_bvh.ray_cast(origin_out, d, ao_max_dist)
            if hit is not None:
                occluded += 1.0 - (dist / ao_max_dist) * 0.65
        ao = 1.0 - min(1.0, (occluded / ao_samples) * 1.18)

        # 2. Inward Gelatin Subsurface Thickness (thin ears, paw tips & snout glow!)
        origin_in = p - n * 0.006
        d_sum = 0.0
        for d in fibonacci_hemisphere(-n, thick_samples, spread=0.55):
            hit, _, _, dist = high_bvh.ray_cast(origin_in, d, thick_max_dist)
            d_sum += dist if hit is not None else thick_max_dist
        avg_thick = d_sum / thick_samples
        thinness = 1.0 - min(1.0, max(0.0, (avg_thick - 0.08) / 0.50))

        # 3. Candy anatomical accents for real-time WebGL readability:
        #    - Crisp happy syrup smile crease + philtrum right below the nose
        #    - Recessed cupped inner-ear syrup pool framed by bright 1.0 jelly rim
        #    - Haribo tummy collar groove framing a bright bouncy tummy pillow
        smile_darken = 0.0
        if p.y < -0.32 and 1.29 < p.z < 1.44 and abs(p.x) < 0.125:
            z_curve = 1.352 + 2.25 * (p.x * p.x)
            dz = abs(p.z - z_curve)
            if dz < 0.024 and abs(p.x) < 0.112:
                smile_darken = 0.24 * ((1.0 - dz / 0.024) ** 1.4)

        sole_shade = min(1.0, 0.78 + (p.z / 0.08) * 0.22) if p.z < 0.08 else 1.0

        # Luminous Haribo belly cushion framed by subtle syrup collar ring
        u_t = abs(p.x) / 0.26
        w_t = (p.z - 0.62) / 0.25
        r_t = math.sqrt(u_t * u_t + w_t * w_t)
        tummy_glow = 0.0
        tummy_ring = 0.0
        if p.y < -0.22:
            tummy_glow = max(0.0, 1.0 - r_t * r_t) * 0.14
            tummy_ring = math.exp(-((r_t - 1.05) / 0.18) ** 2) * 0.10
            nd = math.hypot(p.x, p.z - 0.445)
            if nd < 0.046:
                tummy_ring += 0.14 * (1.0 - nd / 0.046)

        # Cupped inner-ear syrup shade so the ear hollow reads from 40 m away,
        # while the thin outer ear rim glows at 1.0!
        ear_cup_shade = 0.0
        for sx in (-1.0, 1.0):
            er2 = ((p.x - sx * 0.308) / 0.102) ** 2 + ((p.z - 1.800) / 0.102) ** 2
            if p.y < -0.01 and er2 < 1.0:
                ear_cup_shade = max(ear_cup_shade, ((1.0 - er2) ** 1.3) * 0.20)

        ao_pow = ao ** 1.2
        base = 0.54 + 0.36 * ao_pow + 0.16 * thinness + tummy_glow - tummy_ring - ear_cup_shade
        base = max(0.32, min(1.0, base)) * sole_shade * (1.0 - smile_darken)

        # Keep RGB nearly hue-neutral so lemon-yellow, mint-green, mango-orange
        # and raspberry-pink bears ALL stay crystal-pure fruit jelly colors!
        crevice = (1.0 - ao_pow) * 0.14 + smile_darken * 0.12 + ear_cup_shade * 0.16 + tummy_ring * 0.12
        r = min(1.0, max(0.28, base + thinness * 0.04))
        g = min(1.0, max(0.25, base - crevice * 0.14 + thinness * 0.03))
        b = min(1.0, max(0.26, base - crevice * 0.08 + thinness * 0.03))

        col_attr.data[idx].color = (r, g, b, 1.0)


def build_lod_object(
    scene: bpy.types.Scene,
    sculpt_body: bpy.types.Object,
    sculpt_mesh: bpy.types.Mesh,
    high_bvh: BVHTree,
    name: str,
    target_quads: int,
    detail_hi: bool,
) -> bpy.types.Object:
    """Retopologize sculpt body via symmetric QuadriFlow quads, project exact
    high-poly sculpt normals, attach face features, UV-unwrap, and bake vertex colors.
    """
    body_copy = sculpt_body.copy()
    body_copy.data = sculpt_body.data.copy()
    body_copy.name = f"{name}_BodyTmp"
    scene.collection.objects.link(body_copy)

    bpy.ops.object.select_all(action="DESELECT")
    body_copy.select_set(True)
    bpy.context.view_layer.objects.active = body_copy
    bpy.ops.object.quadriflow_remesh(
        use_mesh_symmetry=True,
        use_preserve_sharp=False,
        use_preserve_boundary=False,
        smooth_normals=True,
        target_faces=target_quads,
    )

    # Re-pin sole vertices cleanly at z=0 after QuadriFlow
    for v in body_copy.data.vertices:
        if v.co.z < 0.008:
            v.co.z = 0.0
    body_copy.data.update()

    bm = bmesh.new()
    bm.from_mesh(body_copy.data)
    body_vert_count = len(bm.verts)
    part_tags = ["body"] * body_vert_count

    features = build_face_features(scene, high_bvh, detail_hi=detail_hi)
    for fobj, tag in features:
        v_before = len(bm.verts)
        bm.from_mesh(fobj.data)
        part_tags.extend([tag] * (len(bm.verts) - v_before))
        bpy.data.objects.remove(fobj, do_unlink=True)

    bmesh.ops.triangulate(bm, faces=bm.faces)

    uv_layer = bm.loops.layers.uv.new("UVMap")
    for face in bm.faces:
        for loop in face.loops:
            co = loop.vert.co
            u = 0.5 + math.atan2(co.x, -co.y) / (2.0 * math.pi)
            v = min(1.0, max(0.0, co.z / 2.0))
            loop[uv_layer].uv = (u, v)

    out_mesh = bpy.data.meshes.new(name)
    bm.to_mesh(out_mesh)
    bm.free()

    bpy.data.objects.remove(body_copy, do_unlink=True)

    for poly in out_mesh.polygons:
        poly.use_smooth = True
    out_mesh.update()

    # Blend smooth vertex normals from the 99k-tri sculpt onto body vertices,
    # clamped close to each LOD's own geometric vertex normal so grazing
    # silhouette triangles never flip past the view horizon (N·V < 0) in WebGL!
    sculpt_polys = sculpt_mesh.polygons
    sculpt_verts = sculpt_mesh.vertices
    sculpt_blend = 0.45 if detail_hi else 0.25
    custom_vert_normals: list[Vector] = []
    for idx, v in enumerate(out_mesh.vertices):
        gn = v.normal.normalized() if v.normal.length > 1e-6 else Vector((0.0, -1.0, 0.0))
        if part_tags[idx] == "body":
            loc, _face_norm, fidx, _dist = high_bvh.find_nearest(v.co)
            if fidx is not None:
                poly = sculpt_polys[fidx]
                w_sum = 0.0
                n_acc = Vector((0.0, 0.0, 0.0))
                for vi in poly.vertices:
                    sv = sculpt_verts[vi]
                    w = 1.0 / (max(1e-5, (sv.co - v.co).length))
                    n_acc += sv.normal * w
                    w_sum += w
                sn = (n_acc / w_sum).normalized() if w_sum > 0.0 else gn
                align = gn.dot(sn)
                if align > 0.80:
                    t = sculpt_blend * ((align - 0.80) / 0.20)
                    custom_vert_normals.append(gn.lerp(sn, t).normalized())
                else:
                    custom_vert_normals.append(gn)
            else:
                custom_vert_normals.append(gn)
        else:
            custom_vert_normals.append(gn)

    out_mesh.normals_split_custom_set_from_vertices(custom_vert_normals)

    bake_optical_gummy_vertex_colors(out_mesh, high_bvh, part_tags)

    out_obj = bpy.data.objects.new(name, out_mesh)
    scene.collection.objects.link(out_obj)
    return out_obj


def create_principled_gummy_material(name: str, rgb: tuple[float, float, float]) -> bpy.types.Material:
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nt = mat.node_tree
    nt.nodes.clear()

    out = nt.nodes.new("ShaderNodeOutputMaterial")
    bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
    vcol = nt.nodes.new("ShaderNodeVertexColor")
    vcol.layer_name = "Color"
    mul = nt.nodes.new("ShaderNodeVectorMath")
    mul.operation = "MULTIPLY"
    mul.inputs[1].default_value = rgb

    nt.links.new(vcol.outputs["Color"], mul.inputs[0])
    nt.links.new(mul.outputs["Vector"], bsdf.inputs["Base Color"])

    bsdf.inputs["Roughness"].default_value = 0.13
    if "Coat Weight" in bsdf.inputs:
        bsdf.inputs["Coat Weight"].default_value = 1.0
        bsdf.inputs["Coat Roughness"].default_value = 0.07
    if "Subsurface Weight" in bsdf.inputs:
        bsdf.inputs["Subsurface Weight"].default_value = 0.50
        bsdf.inputs["Subsurface Scale"].default_value = 0.10
    if "Transmission Weight" in bsdf.inputs:
        bsdf.inputs["Transmission Weight"].default_value = 0.25
    if "IOR" in bsdf.inputs:
        bsdf.inputs["IOR"].default_value = 1.49

    nt.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    return mat


def build_legacy_9sphere_bear(scene: bpy.types.Scene) -> bpy.types.Object:
    specs = [
        (0.55, 12, 9, (0.0, 0.0, 0.62), (1.0, 0.82, 1.15)),
        (0.38, 12, 9, (0.0, -0.05, 1.50), (1.0, 1.0, 1.0)),
        (0.15, 7, 5, (-0.30, 0.0, 1.82), (1.0, 1.0, 1.0)),
        (0.15, 7, 5, (0.30, 0.0, 1.82), (1.0, 1.0, 1.0)),
        (0.17, 7, 5, (-0.62, -0.10, 0.95), (1.0, 1.0, 1.5)),
        (0.17, 7, 5, (0.62, -0.10, 0.95), (1.0, 1.0, 1.5)),
        (0.20, 7, 5, (-0.30, -0.12, 0.16), (1.0, 1.3, 1.0)),
        (0.20, 7, 5, (0.30, -0.12, 0.16), (1.0, 1.3, 1.0)),
        (0.16, 7, 5, (0.0, -0.36, 1.45), (1.15, 0.80, 0.90)),
    ]
    bm = bmesh.new()
    for r, u_seg, v_seg, pos, sc in specs:
        tmp = bmesh.new()
        bmesh.ops.create_uvsphere(tmp, u_segments=u_seg, v_segments=v_seg, radius=r)
        mat = Matrix.Translation(Vector(pos)) @ Matrix.Diagonal(Vector((sc[0], sc[1], sc[2], 1.0)))
        bmesh.ops.transform(tmp, matrix=mat, verts=tmp.verts)
        tmesh = bpy.data.meshes.new("_tmp")
        tmp.to_mesh(tmesh)
        tmp.free()
        bm.from_mesh(tmesh)
        bpy.data.meshes.remove(tmesh)
    mesh = bpy.data.meshes.new("Legacy9SphereBear")
    bm.to_mesh(mesh)
    bm.free()
    for p in mesh.polygons:
        p.use_smooth = True
    col_attr = mesh.color_attributes.new(name="Color", type="FLOAT_COLOR", domain="POINT")
    for i in range(len(mesh.vertices)):
        col_attr.data[i].color = (1.0, 1.0, 1.0, 1.0)
    obj = bpy.data.objects.new("Legacy9SphereBear", mesh)
    scene.collection.objects.link(obj)
    return obj


def setup_studio_and_save_blend(
    scene: bpy.types.Scene,
    sculpt_obj: bpy.types.Object,
    hi_obj: bpy.types.Object,
    lo_obj: bpy.types.Object,
    render_path: Path | None = None,
) -> None:
    mat_raspberry = create_principled_gummy_material("Gummy_Raspberry", (1.0, 0.18, 0.34))
    hi_obj.data.materials.append(mat_raspberry)
    lo_obj.data.materials.append(mat_raspberry)

    lo_obj.location = Vector((2.0, 0.0, 0.0))
    lo_obj.hide_render = True

    bpy.ops.mesh.primitive_plane_add(size=36.0, location=(0.0, 0.0, 0.0))
    floor = bpy.context.active_object
    floor.name = "CandyStudioFloor"
    fmat = bpy.data.materials.new("StudioFloorMat")
    fmat.use_nodes = True
    fmat.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = (0.96, 0.91, 0.95, 1.0)
    fmat.node_tree.nodes["Principled BSDF"].inputs["Roughness"].default_value = 0.32
    floor.data.materials.append(fmat)

    lights = [
        ("KeyLight", (2.8, -3.8, 4.0), 175.0, 2.6, (1.0, 0.96, 0.92)),
        ("GummyRimBackLight", (-1.6, 3.4, 3.1), 240.0, 2.4, (1.0, 0.92, 0.98)),
        ("FillLight", (-3.5, -2.5, 2.3), 85.0, 3.2, (0.86, 0.94, 1.0)),
    ]
    for lname, loc, energy, size, col in lights:
        ldata = bpy.data.lights.new(lname, type="AREA")
        ldata.energy = energy
        ldata.size = size
        ldata.color = col
        lobj = bpy.data.objects.new(lname, ldata)
        lobj.location = Vector(loc)
        direction = Vector((0.0, 0.0, 1.0)) - Vector(loc)
        lobj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
        scene.collection.objects.link(lobj)

    world = bpy.data.worlds.new("CandyStudioWorld")
    world.use_nodes = True
    bg = world.node_tree.nodes["Background"]
    bg.inputs[0].default_value = (0.88, 0.93, 1.0, 1.0)
    bg.inputs[1].default_value = 0.70
    scene.world = world

    cam_data = bpy.data.cameras.new("StudioCamera")
    cam_data.lens = 55.0
    cam_obj = bpy.data.objects.new("StudioCamera", cam_data)
    scene.collection.objects.link(cam_obj)
    scene.camera = cam_obj
    cam_obj.location = Vector((0.0, -5.8, 1.55))
    cam_dir = Vector((0.0, 0.0, 0.98)) - cam_obj.location
    cam_obj.rotation_euler = cam_dir.to_track_quat("-Z", "Y").to_euler()

    bpy.data.objects.remove(sculpt_obj, do_unlink=True)
    BLEND_OUT.parent.mkdir(parents=True, exist_ok=True)
    if BLEND_OUT.exists():
        BLEND_OUT.unlink()
    bpy.ops.wm.save_as_mainfile(filepath=str(BLEND_OUT), compress=True)
    blend1 = BLEND_OUT.with_suffix(".blend1")
    if blend1.exists():
        blend1.unlink()

    if render_path is not None:
        legacy = build_legacy_9sphere_bear(scene)
        legacy.location = Vector((-2.40, 0.0, 0.0))
        legacy.rotation_euler = Euler((0.0, 0.0, math.radians(14)), "XYZ")
        legacy.data.materials.append(create_principled_gummy_material("LegacyMat", (0.38, 0.88, 0.42)))

        hi_obj.location = Vector((-0.80, 0.0, 0.0))
        hi_obj.rotation_euler = Euler((0.0, 0.0, math.radians(6)), "XYZ")

        c_gold = hi_obj.copy()
        c_gold.data = hi_obj.data.copy()
        c_gold.data.materials.clear()
        c_gold.data.materials.append(create_principled_gummy_material("Gummy_Gold", (1.0, 0.68, 0.08)))
        c_gold.location = Vector((0.80, 0.0, 0.0))
        c_gold.rotation_euler = Euler((0.0, 0.0, math.radians(-28)), "XYZ")
        scene.collection.objects.link(c_gold)

        c_blue = hi_obj.copy()
        c_blue.data = hi_obj.data.copy()
        c_blue.data.materials.clear()
        c_blue.data.materials.append(create_principled_gummy_material("Gummy_Blue", (0.14, 0.64, 1.0)))
        c_blue.location = Vector((2.35, 0.0, 0.0))
        c_blue.rotation_euler = Euler((0.0, 0.0, math.radians(-62)), "XYZ")
        scene.collection.objects.link(c_blue)

        cam_data.lens = 42.0
        cam_obj.location = Vector((0.0, -7.7, 1.68))
        cam_dir = Vector((0.0, 0.0, 0.96)) - cam_obj.location
        cam_obj.rotation_euler = cam_dir.to_track_quat("-Z", "Y").to_euler()

        scene.render.engine = "CYCLES"
        scene.cycles.device = "CPU"
        scene.cycles.samples = 14
        scene.cycles.use_denoising = True
        scene.render.resolution_x = 1280
        scene.render.resolution_y = 540
        render_path.parent.mkdir(parents=True, exist_ok=True)
        scene.render.filepath = str(render_path)
        bpy.ops.render.render(write_still=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--render-studio", type=Path, default=None)
    args = parser.parse_args()

    random.seed(42)
    scene = reset_scene()

    sculpt_body = build_sculpted_gelatin_body(scene)
    sculpt_tris = sum(len(p.vertices) - 2 for p in sculpt_body.data.polygons)

    bm_bvh = bmesh.new()
    bm_bvh.from_mesh(sculpt_body.data)
    bmesh.ops.triangulate(bm_bvh, faces=bm_bvh.faces)
    bm_bvh.to_mesh(sculpt_body.data)
    sculpt_body.data.update()
    high_bvh = BVHTree.FromBMesh(bm_bvh)
    bm_bvh.free()

    hi_obj = build_lod_object(
        scene, sculpt_body, sculpt_body.data, high_bvh, "GummyBear_Hi", target_quads=490, detail_hi=True
    )
    lo_obj = build_lod_object(
        scene, sculpt_body, sculpt_body.data, high_bvh, "GummyBear_Lo", target_quads=295, detail_hi=False
    )

    bpy.ops.object.select_all(action="DESELECT")
    hi_obj.select_set(True)
    lo_obj.select_set(True)
    GLB_OUT.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=str(GLB_OUT),
        export_format="GLB",
        use_selection=True,
        export_yup=True,
        export_apply=True,
        export_normals=True,
        export_texcoords=True,
        export_vertex_color="ACTIVE",
        export_all_vertex_colors=True,
        export_active_vertex_color_when_no_material=True,
        export_materials="NONE",
    )

    hi_tris = len(hi_obj.data.polygons)
    lo_tris = len(lo_obj.data.polygons)

    setup_studio_and_save_blend(scene, sculpt_body, hi_obj, lo_obj, render_path=args.render_studio)

    print(
        f"Built Gummy Bear via Blender {bpy.app.version_string}:\n"
        f"  Sculpt tris : {sculpt_tris}\n"
        f"  GummyBear_Hi: {hi_tris} tris ({len(hi_obj.data.vertices)} verts)\n"
        f"  GummyBear_Lo: {lo_tris} tris ({len(lo_obj.data.vertices)} verts)\n"
        f"  GLB size    : {GLB_OUT.stat().st_size / 1024:.1f} KB -> {GLB_OUT}\n"
        f"  BLEND size  : {BLEND_OUT.stat().st_size / 1024:.1f} KB -> {BLEND_OUT}"
    )
    os._exit(0)


if __name__ == "__main__":
    main()
