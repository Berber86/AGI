#!/usr/bin/env python3
"""
Headless Blender 4.2 generator for Lily's hero convertible "Star Racer 7"
(Candy Kingdom Coaster).

Replaces the 159k-triangle, 1.7-second JavaScript Marching-Cubes car shell and
primitive box/capsule parts with precision-modeled Blender coachwork:
  1. `CarBody`: Voxel-filleted & analytically sculpted 1950s Candy Speedster
     coachwork (muscular pontoon fenders, crisp flared wheel-arch lips, side
     scallop swage line, twin aerodynamic speedster fairing humps behind the
     seats, subtle hood & decklid shutlines, recessed smiling front oval grille
     mouth, recessed headlight sockets, recessed rear plate cove, rolled
     cockpit lip), retopologized with symmetric `QuadriFlow` and baked with
     32-ray `BVHTree` ambient occlusion + smooth multi-zone vertex colors.
  2. `CarBodyShadow`: Lightweight watertight shadow-caster proxy (~1.1k tris).
  3. `ChromeTrim`: Swept wraparound blade bumpers with bullet overriders,
     smiling grille bezel + winged bar, hood spear, flush headlight bezels +
     Beetle visor brows, sculpted teardrop taillight housings, twin rear engine
     decklid chrome louvre grilles, rear spine + T-handle + plate frame, twin
     speedster hump spears, wraparound raked windshield frame + A-pillars,
     swan-neck bullet mirrors, door handles, side rocker spears, quad beveled
     exhaust tips, gauge bezels, and chrome shifter stalk.
  4. `PlumTrim`: Contoured bumper rub strips, ribbed running-board step pads,
     padded dash top roll, padded door armrests, bucket-seat side bolsters &
     piping, buckled convertible boot straps, and inner exhaust bores.
  5. `CreamInterior`: Contoured quilted bucket seats with deep bolsters &
     sculpted headrests, plush rear parcel bench, pleated convertible soft-top
     boot cover, wraparound twin-cowl retro dashboard, inner door panels, and
     center console tunnel — with meter-scaled UVs for `carQuilt` + BVH AO.
  6. `HoodBow`: True curve-sculpted 3D satin polka-dot ribbon bow.
  7. `SteeringWheel`: Contoured two-tone vintage steering wheel + horn ring.
  8. `WheelTire`, `WheelWhitewall`, `WheelRimPink`, `WheelChrome`: Real 3D
     deep-dish artillery/steelie wheel with 8 beveled ventilation windows,
     raised whitewall ring, grooved balloon tire, chrome beauty rim & domed
     baby-moon hubcap.

Coordinate convention:
  Helper `P(x, y, z)` maps game car-space (`+X` left, `+Y` up, `+Z` forward,
  ground `y = 0`) to Blender (`X = x, Y = -z, Z = y`), which Blender's glTF 2.0
  `+Y`-up exporter maps back 1:1 to Three.js `(x, y, z)`.
"""

from __future__ import annotations

import argparse
import math
import os
import sys
from pathlib import Path

import bpy
import bmesh
from mathutils import Euler, Matrix, Quaternion, Vector
from mathutils.bvhtree import BVHTree


# Exact CAR_DIM from src/car.js
WHEEL_R = 0.47
WHEEL_Y = 0.46
WHEEL_X = 0.95
WHEEL_ZF = 1.32
WHEEL_ZR = -1.38

HEADLIGHT_P = (0.79, 0.84, 2.085)
HEADLIGHT_N = (0.06, 0.28, 0.958)


def P(x: float, y: float, z: float) -> Vector:
    """Convert Three.js car coordinates (+X left, +Y up, +Z forward) to Blender."""
    return Vector((x, -z, y))


def N_vec(nx: float, ny: float, nz: float) -> Vector:
    return Vector((nx, -nz, ny)).normalized()


def from_blender_pt(v: Vector) -> tuple[float, float, float]:
    """Convert Blender (X, Y, Z) back to Three.js car coordinates (x, y, z)."""
    return (v.x, v.z, -v.y)


def from_blender_nrm(n: Vector) -> tuple[float, float, float]:
    return (n.x, n.z, -n.y)


def sstep(e0: float, e1: float, x: float) -> float:
    if abs(e1 - e0) < 1e-9:
        return 1.0 if x >= e1 else 0.0
    t = max(0.0, min(1.0, (x - e0) / (e1 - e0)))
    return t * t * (3.0 - 2.0 * t)


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def lerp_col(
    c1: tuple[float, float, float], c2: tuple[float, float, float], t: float
) -> tuple[float, float, float]:
    k = max(0.0, min(1.0, t))
    return (
        c1[0] + (c2[0] - c1[0]) * k,
        c1[1] + (c2[1] - c1[1]) * k,
        c1[2] + (c2[2] - c1[2]) * k,
    )


def clear_scene() -> None:
    bpy.ops.wm.read_factory_settings(use_empty=True)


# ---------------------------------------------------------------------------
# Low-level bmesh primitive builders (all working in game (x, y, z) coords!)
# ---------------------------------------------------------------------------


def bm_add_ellipsoid(
    bm: bmesh.types.BMesh,
    center: tuple[float, float, float],
    radii: tuple[float, float, float],
    rot_xyz: tuple[float, float, float] = (0.0, 0.0, 0.0),
    u_seg: int = 36,
    v_seg: int = 22,
) -> None:
    """Add an outward-wound ellipsoid specified in game coordinates."""
    sub = bmesh.new()
    rx, ry, rz = radii
    ex, ey, ez = rot_xyz
    cx_e, sx_e = math.cos(ex), math.sin(ex)
    cy_e, sy_e = math.cos(ey), math.sin(ey)
    cz_e, sz_e = math.cos(ez), math.sin(ez)

    def rot_game(vx: float, vy: float, vz: float) -> tuple[float, float, float]:
        y1, z1 = vy * cx_e - vz * sx_e, vy * sx_e + vz * cx_e
        x2, z2 = vx * cy_e + z1 * sy_e, -vx * sy_e + z1 * cy_e
        x3, y3 = x2 * cz_e - y1 * sz_e, x2 * sz_e + y1 * cz_e
        return (x3 + center[0], y3 + center[1], z2 + center[2])

    grid: list[list[bmesh.types.BMVert]] = []
    v_top = sub.verts.new(P(*rot_game(0.0, ry, 0.0)))
    v_bot = sub.verts.new(P(*rot_game(0.0, -ry, 0.0)))

    for i in range(1, v_seg):
        phi = math.pi * i / v_seg
        sp, cp = math.sin(phi), math.cos(phi)
        row: list[bmesh.types.BMVert] = []
        for j in range(u_seg):
            th = 2.0 * math.pi * j / u_seg
            gx = rx * sp * math.sin(th)
            gy = ry * cp
            gz = rz * sp * math.cos(th)
            row.append(sub.verts.new(P(*rot_game(gx, gy, gz))))
        grid.append(row)

    for j in range(u_seg):
        jn = (j + 1) % u_seg
        sub.faces.new((v_top, grid[0][j], grid[0][jn]))
        sub.faces.new((v_bot, grid[-1][jn], grid[-1][j]))

    for i in range(len(grid) - 1):
        for j in range(u_seg):
            jn = (j + 1) % u_seg
            sub.faces.new((grid[i][j], grid[i + 1][j], grid[i + 1][jn], grid[i][jn]))

    bmesh.ops.recalc_face_normals(sub, faces=sub.faces)
    sub.verts.index_update()
    vmap = {v.index: bm.verts.new(v.co) for v in sub.verts}
    for f in sub.faces:
        try:
            bm.faces.new([vmap[v.index] for v in f.verts])
        except ValueError:
            pass
    sub.free()


def bm_add_rounded_box(
    bm: bmesh.types.BMesh,
    center: tuple[float, float, float],
    half_extents: tuple[float, float, float],
    bevel_r: float,
    bevel_segs: int = 4,
    rot_xyz: tuple[float, float, float] = (0.0, 0.0, 0.0),
) -> list[bmesh.types.BMVert]:
    """Add a smooth beveled box specified in game coordinates."""
    sub = bmesh.new()
    bmesh.ops.create_cube(sub, size=2.0)
    hx, hy, hz = half_extents
    # Map cube (-1..1) -> Blender scale (hx, hz, hy)
    for v in sub.verts:
        v.co.x *= hx
        v.co.y *= hz
        v.co.z *= hy
    if bevel_r > 1e-4:
        bmesh.ops.bevel(
            sub,
            geom=list(sub.edges),
            offset=bevel_r,
            offset_type="OFFSET",
            segments=bevel_segs,
            profile=0.5,
            affect="EDGES",
        )
    # Apply game rotation + translation via P(x, y, z)
    ex, ey, ez = rot_xyz
    cx_e, sx_e = math.cos(ex), math.sin(ex)
    cy_e, sy_e = math.cos(ey), math.sin(ey)
    cz_e, sz_e = math.cos(ez), math.sin(ez)
    for v in sub.verts:
        gx, gy, gz = v.co.x, v.co.z, -v.co.y
        y1, z1 = gy * cx_e - gz * sx_e, gy * sx_e + gz * cx_e
        x2, z2 = gx * cy_e + z1 * sy_e, -gx * sy_e + z1 * cy_e
        x3, y3 = x2 * cz_e - y1 * sz_e, x2 * sz_e + y1 * cz_e
        v.co = P(x3 + center[0], y3 + center[1], z2 + center[2])
    bmesh.ops.recalc_face_normals(sub, faces=sub.faces)
    sub.verts.index_update()

    vert_map: dict[int, bmesh.types.BMVert] = {}
    created: list[bmesh.types.BMVert] = []
    for v in sub.verts:
        nv = bm.verts.new(v.co)
        vert_map[v.index] = nv
        created.append(nv)
    for f in sub.faces:
        try:
            bm.faces.new([vert_map[v.index] for v in f.verts])
        except ValueError:
            pass
    sub.free()
    return created


def bm_add_swept_tube(
    bm: bmesh.types.BMesh,
    pts_game: list[tuple[float, float, float]],
    radius_fn,
    radial_segs: int = 16,
    scale_bn: tuple[float, float] = (1.0, 1.0),
    up_hint_game: tuple[float, float, float] = (0.0, 1.0, 0.0),
    cap_ends: bool = True,
    closed: bool = False,
) -> list[bmesh.types.BMVert]:
    """Sweep an elliptical cross-section along a polyline in game coordinates."""
    pts = [P(*p) for p in pts_game]
    n_pts = len(pts)
    if n_pts < 2:
        return []
    sub = bmesh.new()
    up_hint = N_vec(*up_hint_game)
    rings: list[list[bmesh.types.BMVert]] = []
    prev_n = None

    for i in range(n_pts):
        t = i / (n_pts if closed else max(1, n_pts - 1))
        if closed:
            tang = (pts[(i + 1) % n_pts] - pts[(i - 1) % n_pts]).normalized()
        elif i == 0:
            tang = (pts[1] - pts[0]).normalized()
        elif i == n_pts - 1:
            tang = (pts[-1] - pts[-2]).normalized()
        else:
            tang = (pts[i + 1] - pts[i - 1]).normalized()

        if prev_n is None:
            ref = up_hint if abs(tang.dot(up_hint)) < 0.94 else Vector((1.0, 0.0, 0.0))
            b_vec = tang.cross(ref).normalized()
            n_vec = b_vec.cross(tang).normalized()
        else:
            n_vec = (prev_n - tang * prev_n.dot(tang)).normalized()
            b_vec = tang.cross(n_vec).normalized()
        prev_n = n_vec

        r = radius_fn(t) if callable(radius_fn) else float(radius_fn)
        rb = r * scale_bn[0]
        rn = r * scale_bn[1]

        ring: list[bmesh.types.BMVert] = []
        for j in range(radial_segs):
            ang = 2.0 * math.pi * j / radial_segs
            off = b_vec * (math.cos(ang) * rb) + n_vec * (math.sin(ang) * rn)
            ring.append(sub.verts.new(pts[i] + off))
        rings.append(ring)

    ring_pairs = n_pts if closed else n_pts - 1
    for i in range(ring_pairs):
        r0 = rings[i]
        r1 = rings[(i + 1) % n_pts]
        for j in range(radial_segs):
            jn = (j + 1) % radial_segs
            try:
                sub.faces.new((r0[j], r0[jn], r1[jn], r1[j]))
            except ValueError:
                pass

    if cap_ends and not closed:
        c0 = sub.verts.new(pts[0])
        c1 = sub.verts.new(pts[-1])
        for j in range(radial_segs):
            jn = (j + 1) % radial_segs
            sub.faces.new((c0, rings[0][j], rings[0][jn]))
            sub.faces.new((c1, rings[-1][jn], rings[-1][j]))

    if cap_ends or closed:
        bmesh.ops.recalc_face_normals(sub, faces=sub.faces)
    sub.verts.index_update()

    created: list[bmesh.types.BMVert] = []
    vmap: dict[int, bmesh.types.BMVert] = {}
    for v in sub.verts:
        nv = bm.verts.new(v.co)
        vmap[v.index] = nv
        created.append(nv)
    for f in sub.faces:
        try:
            bm.faces.new([vmap[v.index] for v in f.verts])
        except ValueError:
            pass
    sub.free()
    return created


def catmull_rom_chain(
    ctrl: list[tuple[float, float, float]], samples_per_seg: int = 10, closed: bool = False
) -> list[tuple[float, float, float]]:
    """Evaluate smooth centripetal Catmull-Rom curve in game coordinates."""
    vecs = [Vector(c) for c in ctrl]
    n = len(vecs)
    if n < 2:
        return ctrl
    out: list[tuple[float, float, float]] = []
    seg_count = n if closed else n - 1
    for i in range(seg_count):
        p0 = vecs[(i - 1) % n] if closed else (vecs[0] + (vecs[0] - vecs[1]) if i == 0 else vecs[i - 1])
        p1 = vecs[i]
        p2 = vecs[(i + 1) % n]
        p3 = vecs[(i + 2) % n] if closed else (vecs[-1] + (vecs[-1] - vecs[-2]) if i + 2 >= n else vecs[i + 2])

        n_s = samples_per_seg
        end_k = n_s if (closed or i < seg_count - 1) else n_s + 1
        for k in range(end_k):
            t = k / n_s
            t2 = t * t
            t3 = t2 * t
            v = 0.5 * (
                (2.0 * p1)
                + (-p0 + p2) * t
                + (2.0 * p0 - 5.0 * p1 + 4.0 * p2 - p3) * t2
                + (-p0 + 3.0 * p1 - 3.0 * p2 + p3) * t3
            )
            out.append((v.x, v.y, v.z))
    return out


# ---------------------------------------------------------------------------
# 1. Sculpted Coachwork Shell (`CarBody` + `CarBodyShadow`)
# ---------------------------------------------------------------------------


def build_sculpted_car_body(scene: bpy.types.Scene) -> tuple[bpy.types.Object, bpy.types.Object, BVHTree]:
    """
    Build the high-poly 1950s Candy Speedster coachwork via voxel Boolean union/diff
    + smoothing + analytical automotive crease & cove sculpting, then QuadriFlow into
    clean game geometry (`CarBody`) + lightweight shadow proxy (`CarBodyShadow`).
    """
    # --- Positive volume union ---
    bm_pos = bmesh.new()

    # Main lower body tub (sleek rounded fuselage)
    bm_add_rounded_box(bm_pos, (0.0, 0.67, -0.02), (0.85, 0.30, 1.90), bevel_r=0.18, bevel_segs=5)

    # Sloping aerodynamic front hood crown & nose cone
    bm_add_ellipsoid(bm_pos, (0.0, 0.71, 1.15), (0.81, 0.36, 1.10), rot_xyz=(0.06, 0.0, 0.0), u_seg=42, v_seg=26)
    bm_add_ellipsoid(bm_pos, (0.0, 0.60, 1.82), (0.66, 0.27, 0.44), rot_xyz=(0.12, 0.0, 0.0), u_seg=36, v_seg=22)

    # Sweeping rear speedster decklid & muscular haunch tail
    bm_add_ellipsoid(bm_pos, (0.0, 0.73, -1.16), (0.85, 0.40, 1.04), rot_xyz=(-0.05, 0.0, 0.0), u_seg=42, v_seg=26)
    bm_add_ellipsoid(bm_pos, (0.0, 0.64, -1.84), (0.72, 0.30, 0.42), rot_xyz=(-0.12, 0.0, 0.0), u_seg=36, v_seg=22)

    for sx in (-1.0, 1.0):
        # Muscular pontoon front fenders sweeping gracefully back into the door
        front_fender_curve = catmull_rom_chain([
            (sx * 0.79, 0.60, 2.12),
            (sx * 0.84, 0.84, 1.78),
            (sx * 0.88, 0.95, 1.32),
            (sx * 0.88, 0.84, 0.82),
            (sx * 0.85, 0.68, 0.36),
        ], samples_per_seg=8)
        bm_add_swept_tube(
            bm_pos,
            front_fender_curve,
            radius_fn=lambda t: 0.24 - 0.05 * t,
            radial_segs=22,
            scale_bn=(1.18, 0.92),
        )
        # Headlight torpedo pod barrel extending cleanly to z = 2.24 so bezel sits 100% flush all 360 deg!
        bm_add_ellipsoid(bm_pos, (sx * 0.79, 0.825, 1.92), (0.218, 0.212, 0.34), u_seg=28, v_seg=18)
        # Compact front-fender trailing fillet leaving z = -0.60..+0.46 pure smooth door sheet-metal for "STAR RACER 7"!
        bm_add_ellipsoid(
            bm_pos,
            (sx * 0.92, 0.56, 0.65),
            (0.135, 0.20, 0.22),
            rot_xyz=(0.0, sx * 0.14, 0.0),
            u_seg=20,
            v_seg=12,
        )

        # Voluptuous rear speedster pontoon fenders & teardrop tail pods
        rear_fender_curve = catmull_rom_chain([
            (sx * 0.85, 0.70, -0.42),
            (sx * 0.89, 0.88, -0.88),
            (sx * 0.90, 0.99, -1.38),
            (sx * 0.86, 0.86, -1.82),
            (sx * 0.80, 0.60, -2.14),
        ], samples_per_seg=8)
        bm_add_swept_tube(
            bm_pos,
            rear_fender_curve,
            radius_fn=lambda t: 0.20 + 0.06 * math.sin(math.pi * t),
            radial_segs=22,
            scale_bn=(1.22, 0.95),
        )
        bm_add_ellipsoid(bm_pos, (sx * 0.81, 0.79, -1.90), (0.23, 0.24, 0.30), u_seg=28, v_seg=18)

        # Crisp raised wheel-arch flare lips (stamped metal arch collars!)
        for zc, r_arch in ((WHEEL_ZF, 0.565), (WHEEL_ZR, 0.580)):
            arch_pts = []
            for k in range(17):
                ang = -0.22 + (math.pi + 0.44) * (k / 16)
                ay = WHEEL_Y + math.sin(ang) * r_arch
                az = zc + math.cos(ang) * r_arch
                if ay < 0.33:
                    ay = 0.33
                arch_pts.append((sx * 0.99, ay, az))
            bm_add_swept_tube(
                bm_pos,
                arch_pts,
                radius_fn=0.065,
                radial_segs=14,
                scale_bn=(1.35, 1.0),
            )

        # Iconic twin aerodynamic Speedster Fairing Humps behind driver & passenger seats!
        hump_curve = catmull_rom_chain([
            (sx * 0.37, 1.04, -0.94),
            (sx * 0.37, 1.135, -1.12),
            (sx * 0.36, 1.08, -1.38),
            (sx * 0.34, 0.96, -1.68),
        ], samples_per_seg=7)
        bm_add_swept_tube(
            bm_pos,
            hump_curve,
            radius_fn=lambda t: 0.19 * (1.0 - 0.42 * t),
            radial_segs=18,
            scale_bn=(1.12, 0.78),
        )

        # Sculpted rocker sills connecting front & rear arches cleanly
        bm_add_rounded_box(bm_pos, (sx * 0.88, 0.42, -0.03), (0.12, 0.09, 0.76), bevel_r=0.045, bevel_segs=3)

    # Raised cowl scuttle lip ahead of windshield
    bm_add_ellipsoid(bm_pos, (0.0, 0.96, 0.52), (0.72, 0.11, 0.22), u_seg=32, v_seg=16)

    pos_mesh = bpy.data.meshes.new("CarPosRaw")
    bm_pos.to_mesh(pos_mesh)
    bm_pos.free()
    pos_obj = bpy.data.objects.new("CarPos", pos_mesh)
    scene.collection.objects.link(pos_obj)

    bpy.ops.object.select_all(action="DESELECT")
    pos_obj.select_set(True)
    bpy.context.view_layer.objects.active = pos_obj
    rem1 = pos_obj.modifiers.new(name="FusePos", type="REMESH")
    rem1.mode = "VOXEL"
    rem1.voxel_size = 0.026
    rem1.use_smooth_shade = True
    bpy.ops.object.modifier_apply(modifier=rem1.name)

    # --- Negative Boolean Cutters (cockpit tub, wheel wells, headlight sockets, grille & plate coves, flat floor) ---
    bm_cut = bmesh.new()

    # 1. Cockpit interior cavity (exact room for Lily, seats, dash & rear parcel bench)
    bm_add_rounded_box(bm_cut, (0.0, 1.30, -0.20), (0.68, 0.61, 0.67), bevel_r=0.22, bevel_segs=5)

    # 2. Front & rear deep wheel wells
    for sx in (-1.0, 1.0):
        for zc, wr in ((WHEEL_ZF, 0.538), (WHEEL_ZR, 0.548)):
            bm_add_swept_tube(
                bm_cut,
                [(sx * 0.62, WHEEL_Y, zc), (sx * 1.40, WHEEL_Y, zc)],
                radius_fn=wr,
                radial_segs=36,
            )

        # 3. Recessed angled headlight sockets (zero floating bezels!)
        hx, hy, hz = HEADLIGHT_P
        nx, ny, nz = HEADLIGHT_N
        nl = math.sqrt(nx * nx + ny * ny + nz * nz)
        cx = sx * (hx + (nx / nl) * 0.085)
        cy = hy + (ny / nl) * 0.085
        cz = hz + (nz / nl) * 0.085
        bm_add_ellipsoid(bm_cut, (cx, cy, cz), (0.165, 0.165, 0.165), u_seg=24, v_seg=16)

        # 4. Dual rear valance exhaust cutouts
        bm_add_ellipsoid(bm_cut, (sx * 0.51, 0.33, -2.18), (0.135, 0.085, 0.18), u_seg=18, v_seg=12)

    # 5. Recessed smiling front oval grille mouth
    bm_add_ellipsoid(bm_cut, (0.0, 0.55, 2.21), (0.43, 0.115, 0.13), u_seg=28, v_seg=16)

    # 6. Recessed rear license-plate cove
    bm_add_rounded_box(bm_cut, (0.0, 0.67, -2.23), (0.26, 0.145, 0.10), bevel_r=0.04, bevel_segs=3)

    # 7. Clean flat aero underbody plane below y = 0.305
    bm_add_rounded_box(bm_cut, (0.0, 0.05, 0.0), (1.60, 0.255, 2.60), bevel_r=0.02, bevel_segs=2)

    cut_mesh = bpy.data.meshes.new("CarCutRaw")
    bm_cut.to_mesh(cut_mesh)
    bm_cut.free()
    cut_obj = bpy.data.objects.new("CarCut", cut_mesh)
    scene.collection.objects.link(cut_obj)

    bpy.ops.object.select_all(action="DESELECT")
    cut_obj.select_set(True)
    bpy.context.view_layer.objects.active = cut_obj
    cut_rem = cut_obj.modifiers.new(name="FuseCutters", type="REMESH")
    cut_rem.mode = "VOXEL"
    cut_rem.voxel_size = 0.026
    bpy.ops.object.modifier_apply(modifier=cut_rem.name)

    print("[1/6] Evaluating positive + boolean + voxel fillet...", flush=True)
    bpy.ops.object.select_all(action="DESELECT")
    pos_obj.select_set(True)
    bpy.context.view_layer.objects.active = pos_obj

    bool_mod = pos_obj.modifiers.new(name="Carve", type="BOOLEAN")
    bool_mod.operation = "DIFFERENCE"
    bool_mod.solver = "EXACT"
    bool_mod.object = cut_obj
    bpy.ops.object.modifier_apply(modifier=bool_mod.name)

    rem2 = pos_obj.modifiers.new(name="SheetMetalFillet", type="REMESH")
    rem2.mode = "VOXEL"
    rem2.voxel_size = 0.024
    rem2.use_smooth_shade = True
    bpy.ops.object.modifier_apply(modifier=rem2.name)

    sm = pos_obj.modifiers.new(name="Polish", type="SMOOTH")
    sm.factor = 0.50
    sm.iterations = 7
    bpy.ops.object.modifier_apply(modifier=sm.name)

    sculpt_mesh = pos_obj.data.copy()
    print(f"      sculpt_mesh polys: {len(sculpt_mesh.polygons)}", flush=True)

    bpy.data.objects.remove(pos_obj, do_unlink=True)
    bpy.data.objects.remove(cut_obj, do_unlink=True)

    # --- Analytical Automotive Crease & Shutline Sculpt Pass ---
    # Carve crisp door scallop swage lines, hood shutline, and rear engine-decklid shutline!
    # Pre-cache vertex normals BEFORE mutating `v.co`! (In Blender 4.2, assigning `v.co`
    # invalidates the lazy vertex-normal cache, which would otherwise trigger O(N^2) recomputation!)
    orig_normals = [from_blender_nrm(v.normal) for v in sculpt_mesh.vertices]
    for idx_v, v in enumerate(sculpt_mesh.vertices):
        gx, gy, gz = from_blender_pt(v.co)
        ax = abs(gx)
        n_g = orig_normals[idx_v]

        # 1. Sculpted side scallop / beltline swage crease along the doors
        if ax > 0.78 and abs(n_g[0]) > 0.55 and -0.78 < gz < 0.74 and 0.50 < gy < 0.90:
            swage_y = 0.755 - 0.035 * gz
            dy = gy - swage_y
            # Subtle crisp upper character ridge + shallow scalloped lower door cove
            if abs(dy) < 0.038:
                ridge = (1.0 - abs(dy) / 0.038) ** 1.5
                gx += math.copysign(0.010 * ridge, gx)
            elif -0.22 < dy < -0.038:
                cove = math.sin(math.pi * ((-dy - 0.038) / 0.182))
                gx -= math.copysign(0.012 * cove, gx)

        # 2. Front hood stamped shutline seam (U-shaped bonnet outline)
        if gy > 0.68 and n_g[1] > 0.35 and 0.66 < gz < 1.92 and ax < 0.56:
            # U-shape: side seams at ax = 0.50 tapering to front nose at gz = 1.88
            target_ax = 0.50 * math.sqrt(max(0.0, (1.88 - gz) / 1.22))
            d_seam = abs(ax - target_ax)
            if gz < 0.70:
                d_seam = min(d_seam, abs(gz - 0.68))
            if d_seam < 0.019:
                depth = 0.0065 * (1.0 - d_seam / 0.019)
                gy -= depth * n_g[1]
                gz -= depth * n_g[2]

        # 3. Rear engine-decklid stamped shutline seam (visible in chase camera!)
        if gy > 0.62 and (n_g[1] > 0.2 or n_g[2] < -0.35) and -2.02 < gz < -1.24 and ax < 0.48:
            target_ax = 0.44 * math.sqrt(max(0.0, (gz - (-2.00)) / 0.76))
            d_seam = abs(ax - target_ax)
            if gz > -1.28:
                d_seam = min(d_seam, abs(gz - (-1.26)))
            if d_seam < 0.019:
                depth = 0.0065 * (1.0 - d_seam / 0.019)
                gy -= depth * max(0.3, n_g[1])
                gz += depth * 0.5

        v.co = P(gx, gy, gz)

    sculpt_mesh.update()

    # Triangulate high-poly sculpt so BVH polygon indices match 1:1
    bm_tri = bmesh.new()
    bm_tri.from_mesh(sculpt_mesh)
    bmesh.ops.triangulate(bm_tri, faces=bm_tri.faces)
    bm_tri.to_mesh(sculpt_mesh)
    sculpt_mesh.update()
    high_bvh = BVHTree.FromBMesh(bm_tri)
    bm_tri.free()

    sculpt_obj = bpy.data.objects.new("CarSculptHigh", sculpt_mesh)
    scene.collection.objects.link(sculpt_obj)

    # --- Retopologize `CarBody` via symmetric QuadriFlow (~4,200 quads -> ~8,400 tris) ---
    # Voxel-remesh a temporary manifold proxy at 0.042 m (~26k manifold quads) so
    # QuadriFlow gets a 100% watertight manifold input and finishes in ~4s with zero
    # warnings, while `high_bvh` retains the full 2.4 cm sculpted surface for normal projection!
    body_obj = sculpt_obj.copy()
    body_obj.data = sculpt_obj.data.copy()
    scene.collection.objects.link(body_obj)

    pre_rem = body_obj.modifiers.new(name="ManifoldQFInput", type="REMESH")
    pre_rem.mode = "VOXEL"
    pre_rem.voxel_size = 0.044
    pre_rem.use_smooth_shade = True
    pre_sm = body_obj.modifiers.new(name="SmoothQFInput", type="SMOOTH")
    pre_sm.factor = 0.45
    pre_sm.iterations = 3
    deps_qf = bpy.context.evaluated_depsgraph_get()
    qf_mesh = bpy.data.meshes.new_from_object(body_obj.evaluated_get(deps_qf))
    body_obj.modifiers.clear()
    # Keep only the largest connected manifold shell & orient normals consistently
    bm_clean = bmesh.new()
    bm_clean.from_mesh(qf_mesh)
    bmesh.ops.remove_doubles(bm_clean, verts=bm_clean.verts, dist=1e-4)
    # Delete any tiny floating voxel islands (<100 verts)
    visited: set[int] = set()
    bm_clean.verts.index_update()
    comps: list[list[bmesh.types.BMVert]] = []
    for sv in bm_clean.verts:
        if sv.index in visited:
            continue
        stack = [sv]
        visited.add(sv.index)
        comp = []
        while stack:
            cur = stack.pop()
            comp.append(cur)
            for ed in cur.link_edges:
                nb = ed.other_vert(cur)
                if nb.index not in visited:
                    visited.add(nb.index)
                    stack.append(nb)
        comps.append(comp)
    if len(comps) > 1:
        comps.sort(key=len, reverse=True)
        for small in comps[1:]:
            bmesh.ops.delete(bm_clean, geom=small, context="VERTS")
    bmesh.ops.recalc_face_normals(bm_clean, faces=bm_clean.faces)
    bm_clean.to_mesh(qf_mesh)
    bm_clean.free()
    qf_mesh.update()
    old_d = body_obj.data
    body_obj.data = qf_mesh
    bpy.data.meshes.remove(old_d)
    body_obj.name = "CarBody"
    body_obj.data.name = "CarBody"

    print(f"[2/6] Running QuadriFlow on {len(body_obj.data.polygons)} polys...", flush=True)
    bpy.ops.object.select_all(action="DESELECT")
    body_obj.select_set(True)
    bpy.context.view_layer.objects.active = body_obj
    bpy.ops.object.quadriflow_remesh(
        use_mesh_symmetry=True,
        use_preserve_sharp=False,
        use_preserve_boundary=False,
        smooth_normals=True,
        target_faces=4200,
    )
    body_obj.data.name = "CarBody"
    print(f"      QuadriFlow done: {len(body_obj.data.polygons)} quads", flush=True)

    bm_body = bmesh.new()
    bm_body.from_mesh(body_obj.data)
    bmesh.ops.triangulate(bm_body, faces=bm_body.faces)
    uv_lay = bm_body.loops.layers.uv.new("UVMap")
    for f in bm_body.faces:
        for lp in f.loops:
            gx, gy, gz = from_blender_pt(lp.vert.co)
            lp[uv_lay].uv = (gx * 0.5 + 0.5, gz * 0.22 + 0.5)
    bm_body.to_mesh(body_obj.data)
    bm_body.free()

    for poly in body_obj.data.polygons:
        poly.use_smooth = True
    body_obj.data.update()

    # Blend smooth normals from the 150k-tri sculpt onto `CarBody` (clamped safely!)
    sculpt_polys = sculpt_mesh.polygons
    sculpt_verts = sculpt_mesh.vertices
    custom_normals: list[Vector] = []
    for v in body_obj.data.vertices:
        gn = v.normal.normalized() if v.normal.length > 1e-6 else Vector((0.0, 0.0, 1.0))
        _loc, _fn, fidx, _dist = high_bvh.find_nearest(v.co)
        if fidx is not None:
            poly = sculpt_polys[fidx]
            w_sum = 0.0
            n_acc = Vector((0.0, 0.0, 0.0))
            for vi in poly.vertices:
                sv = sculpt_verts[vi]
                w = 1.0 / max(1e-5, (sv.co - v.co).length)
                n_acc += sv.normal * w
                w_sum += w
            sn = (n_acc / w_sum).normalized() if w_sum > 0.0 else gn
            align = gn.dot(sn)
            if align > 0.78:
                t = 0.65 * ((align - 0.78) / 0.22)
                custom_normals.append(gn.lerp(sn, t).normalized())
            else:
                custom_normals.append(gn)
        else:
            custom_normals.append(gn)
    body_obj.data.normals_split_custom_set_from_vertices(custom_normals)

    # --- Build lightweight `CarBodyShadow` proxy (~1,200 tris, shrunken 1.5 cm) ---
    sh_obj = sculpt_obj.copy()
    sh_obj.data = sculpt_obj.data.copy()
    scene.collection.objects.link(sh_obj)
    sh_rem = sh_obj.modifiers.new(name="ShadowVoxel", type="REMESH")
    sh_rem.mode = "VOXEL"
    sh_rem.voxel_size = 0.165
    sh_rem.use_smooth_shade = True
    deps2 = bpy.context.evaluated_depsgraph_get()
    sh_eval = sh_obj.evaluated_get(deps2)
    sh_mesh = bpy.data.meshes.new_from_object(sh_eval)
    bpy.data.objects.remove(sh_obj, do_unlink=True)
    bm_sh = bmesh.new()
    bm_sh.from_mesh(sh_mesh)
    bmesh.ops.triangulate(bm_sh, faces=bm_sh.faces)
    bm_sh.to_mesh(sh_mesh)
    bm_sh.free()
    for v in sh_mesh.vertices:
        v.co -= v.normal * 0.018
    sh_mesh.update()
    set_uniform_uv_and_color(sh_mesh, (1.0, 1.0, 1.0))
    sh_mesh.name = "CarBodyShadow"
    shadow_obj = bpy.data.objects.new("CarBodyShadow", sh_mesh)
    scene.collection.objects.link(shadow_obj)

    bpy.data.objects.remove(sculpt_obj, do_unlink=True)
    return body_obj, shadow_obj, high_bvh


# ---------------------------------------------------------------------------
# 2. Precision Trim, Cockpit, Soft-Top, Bow, Steering Wheel & 3D Wheels
# ---------------------------------------------------------------------------


def bvh_hit_game(
    bvh: BVHTree,
    orig_g: tuple[float, float, float],
    dir_g: tuple[float, float, float],
    max_dist: float = 4.0,
) -> tuple[Vector, Vector]:
    """Raycast in game coordinates against Blender-space BVH and return (point_game, normal_game)."""
    o_b = P(*orig_g)
    d_b = P(*dir_g).normalized()
    loc, nrm, _idx, _dist = bvh.ray_cast(o_b, d_b, max_dist)
    if loc is None:
        return Vector(orig_g), Vector((-dir_g[0], -dir_g[1], -dir_g[2])).normalized()
    pg = Vector(from_blender_pt(loc))
    ng = Vector(from_blender_nrm(nrm)).normalized()
    dg = Vector(dir_g).normalized()
    if ng.dot(dg) > 0:
        ng = -ng
    return pg, ng


def build_chrome_and_plum_trim(
    scene: bpy.types.Scene, high_bvh: BVHTree
) -> tuple[bpy.types.Object, bpy.types.Object]:
    """Build `ChromeTrim` and `PlumTrim` coachwork moldings raycast flush onto `CarBody`."""
    bm_chr = bmesh.new()
    bm_plm = bmesh.new()

    # 1. Contoured wraparound front & rear chrome blade bumpers + bullet overriders
    for z_sign in (1.0, -1.0):
        zc = z_sign * 2.24
        ctrl = [
            (-1.12, 0.46, zc - z_sign * 0.34),
            (-0.92, 0.46, zc - z_sign * 0.09),
            (-0.44, 0.46, zc),
            (0.0, 0.46, zc + z_sign * 0.02),
            (0.44, 0.46, zc),
            (0.92, 0.46, zc - z_sign * 0.09),
            (1.12, 0.46, zc - z_sign * 0.34),
        ]
        b_pts = catmull_rom_chain(ctrl, samples_per_seg=6)
        bm_add_swept_tube(
            bm_chr,
            b_pts,
            radius_fn=lambda t: 0.056 * (0.78 + 0.22 * math.sin(math.pi * t)),
            radial_segs=10,
            scale_bn=(0.82, 1.58),
        )
        rub_pts = [(x * 1.005, y, z + z_sign * 0.036) for (x, y, z) in b_pts[1:-1]]
        bm_add_swept_tube(bm_plm, rub_pts, radius_fn=0.022, radial_segs=8, scale_bn=(1.0, 1.15))

        for sx in (-0.45, 0.45):
            bm_add_ellipsoid(
                bm_chr,
                (sx, 0.49, zc + z_sign * 0.035),
                (0.052, 0.145, 0.068),
                rot_xyz=(z_sign * 0.10, 0.0, 0.0),
                u_seg=16,
                v_seg=10,
            )
            bm_add_rounded_box(bm_plm, (sx, 0.43, zc - z_sign * 0.10), (0.032, 0.032, 0.10), bevel_r=0.008, bevel_segs=2)

    # 2. Smiling front candy grille surround + horizontal chrome wing bar + teeth
    grille_ring = []
    for k in range(28):
        ang = 2.0 * math.pi * k / 28
        gx = 0.43 * math.cos(ang)
        gy = 0.555 + 0.112 * math.sin(ang) + 0.028 * (gx * gx) / 0.18
        gz = 2.165 - 0.06 * (gx * gx) / 0.18
        grille_ring.append((gx, gy, gz))
    bm_add_swept_tube(bm_chr, grille_ring, radius_fn=0.022, radial_segs=8, closed=True)
    wing_pts = catmull_rom_chain([
        (-0.39, 0.565, 2.13),
        (-0.18, 0.555, 2.18),
        (0.0, 0.555, 2.195),
        (0.18, 0.555, 2.18),
        (0.39, 0.565, 2.13),
    ], samples_per_seg=4)
    bm_add_swept_tube(bm_chr, wing_pts, radius_fn=0.018, radial_segs=8, scale_bn=(1.2, 0.9))
    bm_add_ellipsoid(bm_chr, (0.0, 0.555, 2.20), (0.062, 0.062, 0.024), u_seg=18, v_seg=10)
    for tx in (-0.26, -0.14, 0.14, 0.26):
        bm_add_rounded_box(bm_chr, (tx, 0.555, 2.15), (0.010, 0.075, 0.016), bevel_r=0.004, bevel_segs=2)

    # 3. Raycast split center hood chrome spears framing the "7" hood roundel cleanly!
    aft_pts = []
    for k in range(9):
        gz = 0.51 + (1.24 - 0.51) * (k / 8)
        pg, ng = bvh_hit_game(high_bvh, (0.0, 2.2, gz), (0.0, -1.0, 0.0))
        po = pg + ng * 0.008
        aft_pts.append((0.0, po.y, po.z))
    bm_add_swept_tube(
        bm_chr,
        aft_pts,
        radius_fn=lambda t: 0.014 * (1.0 - 0.22 * t),
        radial_segs=8,
        scale_bn=(1.35, 0.75),
    )
    fore_pts = []
    for k in range(7):
        gz = 1.80 + (2.06 - 1.80) * (k / 6)
        pg, ng = bvh_hit_game(high_bvh, (0.0, 2.2, gz), (0.0, -1.0, 0.0))
        po = pg + ng * 0.008
        fore_pts.append((0.0, po.y, po.z))
    bm_add_swept_tube(
        bm_chr,
        fore_pts,
        radius_fn=lambda t: 0.013 * (1.0 - 0.35 * t),
        radial_segs=8,
        scale_bn=(1.35, 0.75),
    )

    # 4. Flush Headlight Chrome Bezels + Vintage Hooded Beetle Eyelid Brows + Fender Signal Pods
    for sx in (-1.0, 1.0):
        hx, hy, hz = HEADLIGHT_P
        n_ax = Vector((sx * 0.06, 0.19, 0.980)).normalized()
        u_ax = Vector((0.0, 1.0, 0.0)).cross(n_ax).normalized()
        v_ax = n_ax.cross(u_ax).normalized()
        hl_c = Vector((sx * hx, hy - 0.008, hz - 0.032))

        bez_pts = []
        for k in range(24):
            ang = 2.0 * math.pi * k / 24
            pt = hl_c + u_ax * (math.cos(ang) * 0.148) + v_ax * (math.sin(ang) * 0.148)
            bez_pts.append((pt.x, pt.y, pt.z))
        bm_add_swept_tube(bm_chr, bez_pts, radius_fn=0.024, radial_segs=10, closed=True)

        brow_pts = []
        for k in range(13):
            ang = math.pi * (k / 12)
            fwd_jut = 0.034 * math.sin(ang)
            pt = hl_c + u_ax * (math.cos(ang) * 0.158) + v_ax * (math.sin(ang) * 0.158) + n_ax * fwd_jut
            brow_pts.append((pt.x, pt.y, pt.z))
        bm_add_swept_tube(bm_chr, brow_pts, radius_fn=0.016, radial_segs=8, scale_bn=(1.5, 0.7))

        sig_p, sig_n = bvh_hit_game(high_bvh, (sx * 0.84, 2.2, 1.56), (0.0, -1.0, 0.0))
        sig_c = sig_p + sig_n * 0.014
        bm_add_ellipsoid(bm_chr, (sig_c.x, sig_c.y, sig_c.z), (0.040, 0.028, 0.095), u_seg=16, v_seg=10)

        # 5. Sculpted Rear Teardrop Taillight Chrome Fin Bezels — RAYCAST FLUSH ON REAR FENDER!
        tl_p, tl_n = bvh_hit_game(high_bvh, (sx * 0.81, 0.78, -3.0), (0.0, 0.0, 1.0))
        tl_center = tl_p + tl_n * 0.008
        tl_u = Vector((0.0, 1.0, 0.0)).cross(tl_n).normalized()
        tl_v = tl_n.cross(tl_u).normalized()
        tl_pts = []
        for k in range(22):
            ang = 2.0 * math.pi * k / 22
            rx = 0.094 * (1.0 - 0.24 * math.sin(ang))
            ry = 0.162
            pt = tl_center + tl_u * (math.cos(ang) * rx) + tl_v * (math.sin(ang) * ry)
            tl_pts.append((pt.x, pt.y, pt.z))
        bm_add_swept_tube(bm_chr, tl_pts, radius_fn=0.022, radial_segs=10, closed=True)
        p_l = tl_center - tl_u * 0.088 + tl_n * 0.036
        p_r = tl_center + tl_u * 0.088 + tl_n * 0.036
        bm_add_swept_tube(bm_chr, [(p_l.x, p_l.y, p_l.z), (p_r.x, p_r.y, p_r.z)], radius_fn=0.009, radial_segs=8)

        # 6. Twin Speedster Fairing Chrome Spears raycast right along the crests of the humps!
        hump_spear = []
        for k in range(10):
            gz = -0.98 - 0.68 * (k / 9)
            gx_h = sx * (0.37 - 0.03 * (k / 9))
            hp, hn = bvh_hit_game(high_bvh, (gx_h, 2.2, gz), (0.0, -1.0, 0.0))
            ho = hp + hn * 0.010
            hump_spear.append((ho.x, ho.y, ho.z))
        bm_add_swept_tube(
            bm_chr,
            hump_spear,
            radius_fn=lambda t: 0.017 * (1.0 - 0.35 * t),
            radial_segs=8,
            scale_bn=(1.30, 0.80),
        )

        # 7. Twin Rear Engine-Decklid Chrome Air-Intake Louvre Grilles + Recessed Plum Backing!
        # Shoot straight down (0, -1, 0) so rays ALWAYS hit the exact decklid coordinates!
        pad_p, pad_n = bvh_hit_game(high_bvh, (sx * 0.185, 2.2, -1.56), (0.0, -1.0, 0.0))
        pad_pitch = -math.atan2(abs(pad_n.z), max(0.2, pad_n.y))
        pad_c = pad_p + pad_n * 0.004
        bm_add_rounded_box(
            bm_plm,
            (pad_c.x, pad_c.y, pad_c.z),
            (0.102, 0.006, 0.185),
            bevel_r=0.004,
            bevel_segs=2,
            rot_xyz=(pad_pitch, 0.0, 0.0),
        )
        for row in range(5):
            gz = -1.40 - row * 0.072
            lp_h, ln_h = bvh_hit_game(high_bvh, (sx * 0.185, 2.2, gz), (0.0, -1.0, 0.0))
            lc = lp_h + ln_h * 0.013
            pitch_l = -math.atan2(abs(ln_h.z), max(0.2, ln_h.y))
            bm_add_rounded_box(
                bm_chr,
                (lc.x, lc.y, lc.z),
                (0.096, 0.008, 0.018),
                bevel_r=0.004,
                bevel_segs=2,
                rot_xyz=(pitch_l - 0.15, 0.0, 0.0),
            )
        gf_corners = [
            (sx * 0.078, -1.355),
            (sx * 0.292, -1.355),
            (sx * 0.292, -1.730),
            (sx * 0.078, -1.730),
        ]
        g_frame = []
        for cx_f, cz_f in gf_corners:
            fp, fn = bvh_hit_game(high_bvh, (cx_f, 2.2, cz_f), (0.0, -1.0, 0.0))
            fo = fp + fn * 0.009
            g_frame.append((fo.x, fo.y, fo.z))
        bm_add_swept_tube(bm_chr, g_frame, radius_fn=0.0085, radial_segs=8, closed=True)

        # 8. Sculpted Ribbed Running-Board Step Pads + Chrome Rocker Spears
        bm_add_rounded_box(bm_plm, (sx * 0.945, 0.345, -0.03), (0.112, 0.028, 0.60), bevel_r=0.018, bevel_segs=2)
        for rib in (-0.038, 0.0, 0.038):
            bm_add_swept_tube(
                bm_chr,
                [(sx * (0.945 + rib), 0.375, -0.56), (sx * (0.945 + rib), 0.375, 0.50)],
                radius_fn=0.0055,
                radial_segs=6,
            )
        bm_add_swept_tube(
            bm_chr,
            [(sx * 1.058, 0.352, -0.61), (sx * 1.058, 0.352, 0.55)],
            radius_fn=0.015,
            radial_segs=8,
        )

        # 9. Sleek Swan-Neck Bullet Racing Mirrors — base raycast into fender metal!
        mb_p, mb_n = bvh_hit_game(high_bvh, (sx * 0.84, 2.0, 0.38), (0.0, -1.0, 0.0))
        mb_base = mb_p - mb_n * 0.015
        bm_add_ellipsoid(bm_chr, (mb_p.x, mb_p.y + 0.005, mb_p.z), (0.026, 0.016, 0.048), u_seg=14, v_seg=8)
        m_stalk = catmull_rom_chain([
            (mb_base.x, mb_base.y, mb_base.z),
            (sx * 0.94, mb_p.y + 0.085, 0.365),
            (sx * 1.03, 1.095, 0.355),
        ], samples_per_seg=4)
        bm_add_swept_tube(bm_chr, m_stalk, radius_fn=lambda t: 0.017 - 0.004 * t, radial_segs=8)
        bm_add_ellipsoid(bm_chr, (sx * 1.04, 1.105, 0.39), (0.070, 0.055, 0.092), u_seg=18, v_seg=10)

        # 10. Sculpted Teardrop Chrome Door Handles — raycast flush onto upper door skin!
        dh_p, dh_n = bvh_hit_game(high_bvh, (sx * 1.6, 0.83, -0.48), (-sx, 0.0, 0.0))
        dh_c = dh_p + dh_n * 0.004
        bm_add_ellipsoid(bm_chr, (dh_c.x, dh_c.y, dh_c.z), (0.014, 0.023, 0.082), u_seg=14, v_seg=8)
        door_pull = catmull_rom_chain([
            (dh_c.x + sx * 0.004, dh_c.y, dh_c.z + 0.068),
            (dh_c.x + sx * 0.038, dh_c.y, dh_c.z),
            (dh_c.x + sx * 0.004, dh_c.y, dh_c.z - 0.068),
        ], samples_per_seg=4)
        bm_add_swept_tube(bm_chr, door_pull, radius_fn=0.012, radial_segs=8)

        # 11. Quad Beveled Chrome Twin-Tip Exhausts (2 paired pipes per side!)
        for dx in (-0.052, 0.052):
            ex_x = sx * 0.51 + dx
            bm_add_swept_tube(
                bm_chr,
                [(ex_x, 0.335, -1.96), (ex_x, 0.335, -2.29)],
                radius_fn=0.044,
                radial_segs=12,
                cap_ends=False,
            )
            lip_ring = [
                (ex_x + math.cos(2 * math.pi * k / 14) * 0.044, 0.335 + math.sin(2 * math.pi * k / 14) * 0.044, -2.29)
                for k in range(14)
            ]
            bm_add_swept_tube(bm_chr, lip_ring, radius_fn=0.009, radial_segs=8, closed=True)
            bm_add_ellipsoid(bm_plm, (ex_x, 0.335, -2.25), (0.039, 0.039, 0.012), u_seg=12, v_seg=6)

    # 12. Rear Decklid Raycast Center Chrome Spine + Winged T-Handle Latch + Plate Bezel & Hood Lamp
    rear_spine = []
    for k in range(10):
        gz = -1.24 - 0.66 * (k / 9)
        sp_p, sp_n = bvh_hit_game(high_bvh, (0.0, 2.2, gz), (0.0, -1.0, 0.0))
        so = sp_p + sp_n * 0.010
        rear_spine.append((0.0, so.y, so.z))
    bm_add_swept_tube(bm_chr, rear_spine, radius_fn=0.013, radial_segs=8, scale_bn=(1.35, 0.80))

    th_p, th_n = bvh_hit_game(high_bvh, (0.0, 0.88, -3.0), (0.0, 0.0, 1.0))
    th_c = th_p + th_n * 0.018
    bm_add_ellipsoid(bm_chr, (0.0, th_c.y, th_c.z - 0.008), (0.045, 0.026, 0.018), u_seg=14, v_seg=8)
    bm_add_swept_tube(
        bm_chr,
        [(-0.095, th_c.y, th_c.z + th_n.z * 0.012), (0.095, th_c.y, th_c.z + th_n.z * 0.012)],
        radius_fn=0.014,
        radial_segs=8,
    )

    p_frame = [
        (-0.225, 0.780, -2.172),
        (0.225, 0.780, -2.172),
        (0.225, 0.562, -2.202),
        (-0.225, 0.562, -2.202),
    ]
    bm_add_swept_tube(bm_chr, p_frame, radius_fn=0.014, radial_segs=8, closed=True)
    bm_add_ellipsoid(bm_chr, (0.0, 0.812, -2.162), (0.085, 0.026, 0.032), u_seg=14, v_seg=8)

    # 13. Swept Wraparound Raked Speedster Windshield Frame + Sculpted A-Pillars + Center Mirror
    ws_w = 1.44
    ws_h = 0.49
    ws_rake = 0.50

    def ws_pt(u: float, v: float) -> tuple[float, float, float]:
        x = (u - 0.5) * ws_w
        t = x / (ws_w * 0.5)
        lx = x
        ly = v * ws_h
        lz = -0.09 * (t * t)
        cr, sr = math.cos(-ws_rake), math.sin(-ws_rake)
        ry = ly * cr - lz * sr
        rz = ly * sr + lz * cr
        return (lx, 0.985 + ry, 0.49 + rz)

    ws_loop: list[tuple[float, float, float]] = []
    for k in range(13):
        u = k / 12
        ws_loop.append(ws_pt(u, 1.0 - 0.03 * (2 * u - 1) ** 4))
    for k in range(1, 7):
        v = 1.0 - k / 6
        ws_loop.append(ws_pt(1.0, v))
    for k in range(1, 13):
        u = 1.0 - k / 12
        ws_loop.append(ws_pt(u, 0.0))
    for k in range(1, 6):
        v = k / 6
        ws_loop.append(ws_pt(0.0, v))

    bm_add_swept_tube(bm_chr, ws_loop, radius_fn=0.021, radial_segs=10, closed=True)
    for sx in (-1.0, 1.0):
        u_edge = 0.0 if sx < 0 else 1.0
        p_bot = ws_pt(u_edge, 0.0)
        p_mid = ws_pt(u_edge, 0.35)
        bm_add_swept_tube(
            bm_chr,
            [(p_bot[0] * 1.01, p_bot[1] - 0.09, p_bot[2] - 0.02), p_bot, p_mid],
            radius_fn=lambda t: 0.032 - 0.010 * t,
            radial_segs=8,
        )
    m_top = ws_pt(0.5, 0.98)
    m_box_c = (0.0, m_top[1] - 0.088, m_top[2] - 0.028)
    bm_add_swept_tube(bm_chr, [m_top, m_box_c], radius_fn=0.011, radial_segs=8)
    bm_add_rounded_box(bm_chr, m_box_c, (0.132, 0.038, 0.020), bevel_r=0.012, bevel_segs=2)

    # 14. Dashboard Gauge Chrome Bezels + Center Clock Ring + Chrome Gear Shifter Stalk
    for gx_c, gr_c in ((-0.48, 0.072), (-0.30, 0.072), (0.0, 0.048)):
        g_ring = [
            (gx_c + math.cos(2 * math.pi * k / 18) * gr_c, 0.945 + math.sin(2 * math.pi * k / 18) * gr_c, 0.256)
            for k in range(18)
        ]
        bm_add_swept_tube(bm_chr, g_ring, radius_fn=0.0085, radial_segs=8, closed=True)
    shifter_pts = catmull_rom_chain([
        (0.0, 0.75, -0.06),
        (0.0, 0.86, -0.04),
        (-0.02, 0.97, -0.09),
    ], samples_per_seg=4)
    bm_add_swept_tube(bm_chr, shifter_pts, radius_fn=lambda t: 0.013 - 0.003 * t, radial_segs=8)
    bm_add_ellipsoid(bm_plm, (-0.02, 0.995, -0.095), (0.035, 0.035, 0.035), u_seg=14, v_seg=10)

    # 15. Padded Plum Dashboard Roll, Door Top Armrests, Reclined Seat Bolster Piping & Boot Buckle Straps
    dash_roll = catmull_rom_chain([
        (-0.66, 0.99, 0.26),
        (-0.38, 1.032, 0.34),
        (0.0, 1.00, 0.32),
        (0.38, 1.032, 0.34),
        (0.66, 0.99, 0.26),
    ], samples_per_seg=5)
    bm_add_swept_tube(bm_plm, dash_roll, radius_fn=0.035, radial_segs=10, scale_bn=(1.0, 1.35))

    for sx in (-1.0, 1.0):
        bm_add_swept_tube(
            bm_plm,
            [(sx * 0.672, 0.952, 0.24), (sx * 0.680, 0.935, -0.22), (sx * 0.665, 0.952, -0.66)],
            radius_fn=0.025,
            radial_segs=8,
        )
        bm_add_rounded_box(bm_plm, (sx * 0.635, 0.83, -0.16), (0.032, 0.024, 0.17), bevel_r=0.012, bevel_segs=2)

    for seat_x in (-0.37, 0.37):
        for bs in (-1.0, 1.0):
            bolster_curve = catmull_rom_chain([
                (seat_x + bs * 0.225, 0.825, -0.07),
                (seat_x + bs * 0.232, 0.815, -0.45),
                (seat_x + bs * 0.230, 1.055, -0.555),
                (seat_x + bs * 0.205, 1.285, -0.615),
            ], samples_per_seg=5)
            bm_add_swept_tube(
                bm_plm,
                bolster_curve,
                radius_fn=lambda t: 0.044 * (1.0 - 0.22 * t),
                radial_segs=10,
                scale_bn=(0.92, 1.22),
            )
        hr_loop = catmull_rom_chain([
            (seat_x - 0.135, 1.29, -0.60),
            (seat_x - 0.125, 1.430, -0.635),
            (seat_x, 1.448, -0.645),
            (seat_x + 0.125, 1.430, -0.635),
            (seat_x + 0.135, 1.29, -0.60),
        ], samples_per_seg=4)
        bm_add_swept_tube(bm_plm, hr_loop, radius_fn=0.019, radial_segs=8)

    for sx in (-0.35, 0.35):
        strap_pts = catmull_rom_chain([
            (sx, 1.03, -0.80),
            (sx, 1.185, -0.875),
            (sx, 1.210, -0.965),
            (sx, 1.135, -1.065),
            (sx, 1.02, -1.11),
        ], samples_per_seg=5)
        bm_add_swept_tube(bm_plm, strap_pts, radius_fn=0.016, radial_segs=8, scale_bn=(1.6, 0.55))
        bm_add_rounded_box(
            bm_chr,
            (sx, 1.14, -1.062),
            (0.030, 0.022, 0.010),
            bevel_r=0.004,
            bevel_segs=2,
            rot_xyz=(-0.75, 0.0, 0.0),
        )

    chr_obj = finish_bmesh_object(scene, bm_chr, "ChromeTrim", (1.0, 1.0, 1.0), uv_scale=1.0)
    plm_obj = finish_bmesh_object(scene, bm_plm, "PlumTrim", (1.0, 1.0, 1.0), uv_scale=1.0)
    return chr_obj, plm_obj


def build_cream_interior(scene: bpy.types.Scene) -> bpy.types.Object:
    """
    Build `CreamInterior`: contoured quilted bucket seats + headrests, rear bench,
    pleated convertible soft-top boot cover, twin-cowl retro dash & door panels.
    """
    bm = bmesh.new()

    # 1. Contoured Quilted Bucket Seats (matching Lily's exact hip origin at (-0.37, 0.86, -0.30))
    for seat_x in (-0.37, 0.37):
        # Cushion pan + pleated thigh bolsters (top surface at y = 0.855 at z = -0.30)
        bm_add_rounded_box(
            bm,
            (seat_x, 0.785, -0.27),
            (0.215, 0.072, 0.24),
            bevel_r=0.045,
            bevel_segs=4,
            rot_xyz=(0.05, 0.0, 0.0),
        )
        # Contoured backrest cushion (reclined -0.20 rad so front surface is at z = -0.505)
        bm_add_rounded_box(
            bm,
            (seat_x, 1.085, -0.575),
            (0.215, 0.245, 0.072),
            bevel_r=0.048,
            bevel_segs=4,
            rot_xyz=(-0.20, 0.0, 0.0),
        )
        # Sculpted rounded vintage headrest pillow (top at y = 1.44, z = -0.64)
        bm_add_ellipsoid(
            bm,
            (seat_x, 1.355, -0.625),
            (0.142, 0.095, 0.068),
            rot_xyz=(-0.18, 0.0, 0.0),
            u_seg=24,
            v_seg=14,
        )

    # 2. Plush Rear Parcel Bench
    bm_add_rounded_box(bm, (0.0, 0.83, -0.74), (0.58, 0.068, 0.115), bevel_r=0.04, bevel_segs=3)
    bm_add_rounded_box(
        bm, (0.0, 0.98, -0.825), (0.59, 0.145, 0.052), bevel_r=0.035, bevel_segs=3, rot_xyz=(-0.15, 0.0, 0.0)
    )

    # 3. Sculpted Pleated Convertible Soft-Top Boot Cover (tucked cleanly inside rear cockpit surround!)
    fold_specs = [
        (1.080, -0.865, 0.084, 0.56),
        (1.135, -0.950, 0.090, 0.53),
        (1.090, -1.035, 0.074, 0.49),
    ]
    for fy, fz, fr, half_w in fold_specs:
        fold_curve = catmull_rom_chain([
            (-half_w, fy - 0.065, fz + 0.03),
            (-half_w * 0.52, fy + 0.010, fz),
            (0.0, fy - 0.006, fz - 0.01),
            (half_w * 0.52, fy + 0.010, fz),
            (half_w, fy - 0.065, fz + 0.03),
        ], samples_per_seg=5)
        bm_add_swept_tube(
            bm,
            fold_curve,
            radius_fn=lambda t, r0=fr: r0 * (0.68 + 0.32 * math.sin(math.pi * t)),
            radial_segs=14,
            scale_bn=(1.22, 0.88),
        )

    # 4. Wraparound Twin-Cowl Retro Dashboard Fascia + Center Console + Sculpted Door Cards
    bm_add_rounded_box(bm, (0.0, 0.92, 0.35), (0.65, 0.082, 0.095), bevel_r=0.038, bevel_segs=3)
    # Center transmission console tunnel between the two seats
    bm_add_rounded_box(bm, (0.0, 0.74, -0.14), (0.085, 0.055, 0.38), bevel_r=0.032, bevel_segs=3)
    for sx in (-1.0, 1.0):
        # Quilted inner door cards
        bm_add_rounded_box(bm, (sx * 0.665, 0.82, -0.18), (0.022, 0.125, 0.42), bevel_r=0.015, bevel_segs=2)

    return finish_bmesh_object(scene, bm, "CreamInterior", (1.0, 1.0, 1.0), uv_scale=3.2)


def build_hood_bow(scene: bpy.types.Scene, high_bvh: BVHTree) -> bpy.types.Object:
    """Build a crisp 3D sculpted satin ribbon bow (`HoodBow`) perched proudly on the right cowl."""
    bm = bmesh.new()

    bow_p, bow_n = bvh_hit_game(high_bvh, (0.34, 2.2, 0.88), (0.0, -1.0, 0.0))
    bow_origin = bow_p + bow_n * 0.036
    rot_m = Euler((-0.14, -0.24, 0.06), "XYZ").to_matrix()

    def bp(lx: float, ly: float, lz: float) -> tuple[float, float, float]:
        v = bow_origin + rot_m @ Vector((lx, ly, lz))
        return (v.x, v.y, v.z)

    # Pinched central satin knot pillow
    knot_pts = [bp(0.0, 0.026, -0.034), bp(0.0, 0.030, 0.0), bp(0.0, 0.026, 0.034)]
    bm_add_swept_tube(bm, knot_pts, radius_fn=0.052, radial_segs=14, scale_bn=(1.08, 0.88))

    for sx in (-1.0, 1.0):
        # Billowing hollow satin ribbon loop
        loop_pts = catmull_rom_chain([
            bp(sx * 0.02, 0.030, 0.018),
            bp(sx * 0.14, 0.105, 0.034),
            bp(sx * 0.245, 0.068, 0.0),
            bp(sx * 0.14, 0.012, -0.034),
            bp(sx * 0.02, 0.024, -0.018),
        ], samples_per_seg=6)
        bm_add_swept_tube(
            bm,
            loop_pts,
            radius_fn=lambda t: 0.018 + 0.032 * math.sin(math.pi * t),
            radial_segs=12,
            scale_bn=(0.45, 1.70),
        )

        # Draped satin ribbon tail resting ON the hood slope
        tail_pts = catmull_rom_chain([
            bp(sx * 0.025, 0.016, 0.015),
            bp(sx * 0.095, 0.002, 0.095),
            bp(sx * 0.165, -0.008, 0.185),
        ], samples_per_seg=5)
        bm_add_swept_tube(
            bm,
            tail_pts,
            radius_fn=lambda t: 0.036 * (0.78 + 0.34 * t),
            radial_segs=10,
            scale_bn=(1.60, 0.28),
        )

    return finish_bmesh_object(scene, bm, "HoodBow", (1.0, 1.0, 1.0), uv_scale=4.5)


def build_steering_wheel(scene: bpy.types.Scene) -> bpy.types.Object:
    """
    Build `SteeringWheel` centered at (0, 0, 0) in the X-Y plane (rotates around Z),
    with vertex colors distinguishing cream leather rim, berry grips, and chrome spokes/horn ring!
    """
    bm = bmesh.new()
    vert_colors: list[tuple[float, float, float]] = []

    def add_colored(fn, *args, col=(1.0, 1.0, 1.0), **kwargs):
        before = len(bm.verts)
        fn(bm, *args, **kwargs)
        vert_colors.extend([col] * (len(bm.verts) - before))

    # Main contoured rim (radius 0.17 so Lily's hands grip 10-and-2!)
    rim_pts = [(math.cos(2 * math.pi * k / 40) * 0.17, math.sin(2 * math.pi * k / 40) * 0.17, 0.0) for k in range(40)]
    add_colored(bm_add_swept_tube, rim_pts, radius_fn=0.025, radial_segs=14, closed=True, col=(1.0, 0.94, 0.97))

    # Two-tone berry sport grip wraps on left & right arcs
    for side_ang in (0.0, math.pi):
        grip_pts = []
        for k in range(13):
            a = side_ang - 0.62 + 1.24 * (k / 12)
            grip_pts.append((math.cos(a) * 0.17, math.sin(a) * 0.17, 0.0))
        add_colored(bm_add_swept_tube, grip_pts, radius_fn=0.0285, radial_segs=12, col=(0.72, 0.12, 0.42))

    # Vintage inner chrome horn ring (classic 1950s half-circle horn ring!)
    horn_pts = []
    for k in range(21):
        a = math.pi * 0.92 + math.pi * 1.16 * (k / 20)
        horn_pts.append((math.cos(a) * 0.112, math.sin(a) * 0.112, -0.008))
    add_colored(bm_add_swept_tube, horn_pts, radius_fn=0.0075, radial_segs=8, col=(0.98, 0.95, 0.99))

    # 3 classic dished chrome banjo spokes + central berry/chrome boss
    for i in range(3):
        a = -math.pi / 2 + i * (2.0 * math.pi / 3.0)
        sp_pts = [
            (math.cos(a) * 0.042, math.sin(a) * 0.042, 0.012),
            (math.cos(a) * 0.162, math.sin(a) * 0.162, 0.0),
        ]
        add_colored(bm_add_swept_tube, sp_pts, radius_fn=0.012, radial_segs=8, scale_bn=(1.35, 0.65), col=(0.98, 0.95, 0.99))

    add_colored(bm_add_ellipsoid, (0.0, 0.0, 0.008), (0.054, 0.054, 0.026), u_seg=24, v_seg=12, col=(0.72, 0.12, 0.42))

    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bmesh.ops.triangulate(bm, faces=bm.faces)
    uv_lay = bm.loops.layers.uv.new("UVMap")
    for f in bm.faces:
        for lp in f.loops:
            gx, gy, _gz = from_blender_pt(lp.vert.co)
            lp[uv_lay].uv = (gx * 2.5 + 0.5, gy * 2.5 + 0.5)

    mesh = bpy.data.meshes.new("SteeringWheel")
    bm.to_mesh(mesh)
    bm.free()
    for poly in mesh.polygons:
        poly.use_smooth = True
    mesh.update()

    col_attr = mesh.color_attributes.new(name="Color", type="FLOAT_COLOR", domain="POINT")
    for idx, c in enumerate(vert_colors):
        col_attr.data[idx].color = (c[0], c[1], c[2], 1.0)
    mesh.color_attributes.active_color = col_attr

    obj = bpy.data.objects.new("SteeringWheel", mesh)
    scene.collection.objects.link(obj)
    return obj


def build_3d_wheel_assembly(scene: bpy.types.Scene) -> list[bpy.types.Object]:
    """
    Build a true 3D canonical wheel centered at (0, 0, 0) around the +X axle,
    with +X pointing OUTWARD:
      - `WheelTire`: 3D balloon tire (R = 0.47, half-width = 0.155) with real 3D
        circumferential tread grooves & rounded shoulder profile
      - `WheelWhitewall`: raised 3D cream whitewall ring on the outer sidewall
      - `WheelRimPink`: watertight 3D concave deep-dish steelie rim with 8 real
        through-wall beveled vent windows (outward +X normals guaranteed!)
      - `WheelChrome`: 3D chrome beauty ring + stepped domed baby-moon hubcap
    """
    n_circ = 36

    def build_lathe_around_x(
        profile_rx: list[tuple[float, float]],
        name: str,
        closed_profile: bool = False,
        force_outward_x: bool = False,
        base_col=(1.0, 1.0, 1.0),
    ) -> bpy.types.Object:
        bm = bmesh.new()
        rings: list[list[bmesh.types.BMVert]] = []
        for r, x_ax in profile_rx:
            ring: list[bmesh.types.BMVert] = []
            for j in range(n_circ):
                ang = 2.0 * math.pi * j / n_circ
                gy = math.cos(ang) * r
                gz = math.sin(ang) * r
                ring.append(bm.verts.new(P(x_ax, gy, gz)))
            rings.append(ring)
        n_r = len(rings) if closed_profile else len(rings) - 1
        for i in range(n_r):
            inext = (i + 1) % len(rings)
            for j in range(n_circ):
                jn = (j + 1) % n_circ
                bm.faces.new((rings[i][j], rings[inext][j], rings[inext][jn], rings[i][jn]))
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
        if force_outward_x:
            for f in bm.faces:
                if from_blender_nrm(f.normal)[0] < 0.0:
                    f.normal_flip()
        bmesh.ops.triangulate(bm, faces=bm.faces)
        uv_lay = bm.loops.layers.uv.new("UVMap")
        for f in bm.faces:
            for lp in f.loops:
                gx, gy, gz = from_blender_pt(lp.vert.co)
                u = 0.5 + math.atan2(gz, gy) / (2.0 * math.pi)
                v = gx * 3.0 + 0.5
                lp[uv_lay].uv = (u, v)
        m = bpy.data.meshes.new(name)
        bm.to_mesh(m)
        bm.free()
        for poly in m.polygons:
            poly.use_smooth = True
        m.update()
        col_attr = m.color_attributes.new(name="Color", type="FLOAT_COLOR", domain="POINT")
        for idx, v in enumerate(m.vertices):
            gx, gy, gz = from_blender_pt(v.co)
            rad = math.hypot(gy, gz)
            shade = min(1.0, 0.84 + 0.16 * (rad / WHEEL_R))
            col_attr.data[idx].color = (base_col[0] * shade, base_col[1] * shade, base_col[2] * shade, 1.0)
        m.color_attributes.active_color = col_attr
        o = bpy.data.objects.new(name, m)
        scene.collection.objects.link(o)
        return o

    # 1. `WheelTire`: balloon profile with 3 real circumferential tread grooves!
    tire_prof: list[tuple[float, float]] = [(0.335, -0.140)]
    n_p = 20
    for i in range(n_p + 1):
        a = -math.pi * 0.5 + math.pi * (i / n_p)
        ca = math.cos(a)
        x_ax = math.sin(a) * 0.154 * (0.93 + 0.07 * ca)
        r = 0.352 + ca * 0.118
        if abs(x_ax) < 0.095:
            for gx_c in (-0.052, 0.0, 0.052):
                d_g = abs(x_ax - gx_c)
                if d_g < 0.013:
                    r -= 0.011 * (1.0 - d_g / 0.013)
        tire_prof.append((r, x_ax))
    tire_prof.append((0.335, 0.140))
    tire_obj = build_lathe_around_x(tire_prof, "WheelTire", closed_profile=True, base_col=(1.0, 1.0, 1.0))

    # 2. `WheelWhitewall`: raised 3D cream whitewall ring on outer sidewall (+X outward normal guaranteed!)
    ww_prof: list[tuple[float, float]] = [
        (0.344, 0.130),
        (0.354, 0.141),
        (0.388, 0.147),
        (0.420, 0.139),
        (0.428, 0.126),
    ]
    ww_obj = build_lathe_around_x(ww_prof, "WheelWhitewall", force_outward_x=True, base_col=(1.0, 1.0, 1.0))

    # 3. `WheelRimPink`: CLOSED SOLID 3D concave deep-dish steelie with 8 real 3D vent windows!
    rim_prof_closed: list[tuple[float, float]] = [
        # Outer (+X) visible scalloped dish face (inner hub -> outer lip)
        (0.185, 0.070),
        (0.215, 0.074),
        (0.252, 0.052),  # deep-dish drop center!
        (0.296, 0.058),
        (0.326, 0.094),
        (0.344, 0.126),
        # Inner (-X) backing wall closing the solid ring cleanly for watertight Boolean!
        (0.344, 0.098),
        (0.296, 0.032),
        (0.252, 0.028),
        (0.185, 0.044),
    ]
    rim_base = build_lathe_around_x(rim_prof_closed, "WheelRimBase", closed_profile=True, base_col=(1.0, 1.0, 1.0))

    # Cut 8 clean rounded artillery ventilation windows through the solid rim!
    bm_slots = bmesh.new()
    for k in range(8):
        ang = 2.0 * math.pi * k / 8
        cy = math.cos(ang) * 0.274
        cz = math.sin(ang) * 0.274
        bm_add_ellipsoid(
            bm_slots,
            (0.055, cy, cz),
            (0.065, 0.023, 0.042),
            rot_xyz=(-ang, 0.0, 0.0),
            u_seg=14,
            v_seg=8,
        )
    slot_mesh = bpy.data.meshes.new("RimSlotCut")
    bm_slots.to_mesh(slot_mesh)
    bm_slots.free()
    slot_obj = bpy.data.objects.new("RimSlotCut", slot_mesh)
    scene.collection.objects.link(slot_obj)

    bpy.ops.object.select_all(action="DESELECT")
    rim_base.select_set(True)
    bpy.context.view_layer.objects.active = rim_base
    bmod = rim_base.modifiers.new(name="CutVents", type="BOOLEAN")
    bmod.operation = "DIFFERENCE"
    bmod.solver = "EXACT"
    bmod.object = slot_obj
    bpy.ops.object.modifier_apply(modifier=bmod.name)
    bpy.data.objects.remove(slot_obj, do_unlink=True)

    rim_mesh = rim_base.data
    bm_r = bmesh.new()
    bm_r.from_mesh(rim_mesh)
    bmesh.ops.recalc_face_normals(bm_r, faces=bm_r.faces)
    bmesh.ops.triangulate(bm_r, faces=bm_r.faces)
    bm_r.to_mesh(rim_mesh)
    bm_r.free()
    for poly in rim_mesh.polygons:
        poly.use_smooth = True
    rim_mesh.update()
    # Bright luminous vertex colors with subtle deep-dish groove shading so candy-pink gleams!
    set_uniform_uv_and_color(rim_mesh, (1.0, 1.0, 1.0))
    col_r = rim_mesh.color_attributes.active_color
    for idx, v in enumerate(rim_mesh.vertices):
        gx, gy, gz = from_blender_pt(v.co)
        rad = math.hypot(gy, gz)
        groove = 0.88 + 0.12 * min(1.0, max(0.0, (gx - 0.04) / 0.08))
        col_r.data[idx].color = (groove, groove, groove, 1.0)
    rim_base.name = "WheelRimPink"
    rim_mesh.name = "WheelRimPink"
    rim_obj = rim_base

    # 4. `WheelChrome`: 3D outer chrome beauty ring + stepped domed baby-moon hubcap (+X outward normals!)
    bm_wc = bmesh.new()
    cap_rings = 10
    prev_ring = None
    for i in range(1, cap_rings + 1):
        t = i / cap_rings
        ang = t * (math.pi * 0.46)
        r = math.sin(ang) * 0.212
        step_bump = 0.008 * math.exp(-((t - 0.82) / 0.09) ** 2)
        x_ax = 0.070 + math.cos(ang) * 0.068 + step_bump
        ring = []
        for j in range(n_circ):
            th = 2.0 * math.pi * j / n_circ
            ring.append(bm_wc.verts.new(P(x_ax, math.cos(th) * r, math.sin(th) * r)))
        if i == 1:
            apex = bm_wc.verts.new(P(0.138, 0.0, 0.0))
            for j in range(n_circ):
                jn = (j + 1) % n_circ
                bm_wc.faces.new((apex, ring[j], ring[jn]))
        else:
            for j in range(n_circ):
                jn = (j + 1) % n_circ
                bm_wc.faces.new((prev_ring[j], ring[j], ring[jn], prev_ring[jn]))
        prev_ring = ring
    bm_wc.normal_update()
    for f in bm_wc.faces:
        if from_blender_nrm(f.normal)[0] < 0.0:
            f.normal_flip()

    beauty_pts = [
        (0.126, math.cos(2 * math.pi * j / n_circ) * 0.342, math.sin(2 * math.pi * j / n_circ) * 0.342)
        for j in range(n_circ)
    ]
    bm_add_swept_tube(bm_wc, beauty_pts, radius_fn=0.017, radial_segs=8, closed=True)
    wc_obj = finish_bmesh_object(scene, bm_wc, "WheelChrome", (1.0, 1.0, 1.0), uv_scale=1.5)

    return [tire_obj, ww_obj, rim_obj, wc_obj]


# ---------------------------------------------------------------------------
# Helpers: UVs, Raytraced BVH Ambient Occlusion, and Multi-Zone CarBody Paint
# ---------------------------------------------------------------------------


def set_uniform_uv_and_color(mesh: bpy.types.Mesh, rgb: tuple[float, float, float]) -> None:
    if not mesh.uv_layers:
        mesh.uv_layers.new(name="UVMap")
    while mesh.color_attributes:
        mesh.color_attributes.remove(mesh.color_attributes[0])
    col = mesh.color_attributes.new(name="Color", type="FLOAT_COLOR", domain="POINT")
    for i in range(len(mesh.vertices)):
        col.data[i].color = (rgb[0], rgb[1], rgb[2], 1.0)
    mesh.color_attributes.active_color = col


def finish_bmesh_object(
    scene: bpy.types.Scene,
    bm: bmesh.types.BMesh,
    name: str,
    base_rgb: tuple[float, float, float],
    uv_scale: float = 1.0,
) -> bpy.types.Object:
    bmesh.ops.triangulate(bm, faces=bm.faces)
    uv_lay = bm.loops.layers.uv.new("UVMap")
    for f in bm.faces:
        fn = from_blender_nrm(f.normal)
        ax, ay, az = abs(fn[0]), abs(fn[1]), abs(fn[2])
        for lp in f.loops:
            gx, gy, gz = from_blender_pt(lp.vert.co)
            if ax >= ay and ax >= az:
                u, v = gz * uv_scale, gy * uv_scale
            elif ay >= az:
                u, v = gx * uv_scale, gz * uv_scale
            else:
                u, v = gx * uv_scale, gy * uv_scale
            lp[uv_lay].uv = (u, v)

    mesh = bpy.data.meshes.new(name)
    bm.to_mesh(mesh)
    bm.free()
    for poly in mesh.polygons:
        poly.use_smooth = True
    mesh.update()
    set_uniform_uv_and_color(mesh, base_rgb)
    obj = bpy.data.objects.new(name, mesh)
    scene.collection.objects.link(obj)
    return obj


def fibonacci_hemisphere(normal: Vector, count: int, spread: float = 0.90) -> list[Vector]:
    n = normal.normalized()
    helper = Vector((1.0, 0.0, 0.0)) if abs(n.x) < 0.9 else Vector((0.0, 1.0, 0.0))
    t1 = n.cross(helper).normalized()
    t2 = n.cross(t1).normalized()
    dirs: list[Vector] = []
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


def build_combined_occluder_bvh(objs: list[bpy.types.Object]) -> BVHTree:
    """Combine CarBody + Seats + SoftTop + Bumpers + Trim into one master BVH for true contact AO!"""
    bm = bmesh.new()
    for o in objs:
        bm.from_mesh(o.data)
    bmesh.ops.triangulate(bm, faces=bm.faces)
    bvh = BVHTree.FromBMesh(bm)
    bm.free()
    return bvh


def srgb_to_linear(c: tuple[float, float, float]) -> tuple[float, float, float]:
    def ch(x: float) -> float:
        return x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4
    return (ch(c[0]), ch(c[1]), ch(c[2]))


def bake_car_body_colors_and_ao(body_mesh: bpy.types.Mesh, occluder_bvh: BVHTree) -> None:
    """
    Bake smooth multi-zone car vertex colors + 28-ray BVH contact AO into `CarBody`:
      - Exterior glossy candy-pink metallic paint (with subtle top highlight lift!)
      - Cream-blush cockpit interior lining
      - Deep plum wheel-well liners & flat underbody
      - Dark berry front grille cavity
      - Bright silver-white headlight sockets
    Note: Three.js `Float32BufferAttribute` `color` is sampled directly in linear space!
    """
    c_paint = srgb_to_linear((1.0, 0.285, 0.635))      # Vivid Star-Racer candy pink (#ff49a2)
    c_paint_crest = srgb_to_linear((1.0, 0.36, 0.68))  # Slightly brighter sun-kissed fender/hump crest
    c_interior = srgb_to_linear((1.0, 0.82, 0.90))     # Cream-rose cabin lining (#ffd1e6)
    c_under = srgb_to_linear((0.28, 0.10, 0.22))       # Deep plum wheel-well / underbody (#471a38)
    c_grille = srgb_to_linear((0.24, 0.07, 0.18))      # Recessed smiling grille mouth shadow
    c_socket = srgb_to_linear((0.98, 0.92, 0.96))      # Silver-white headlight bowl

    while body_mesh.color_attributes:
        body_mesh.color_attributes.remove(body_mesh.color_attributes[0])
    col_attr = body_mesh.color_attributes.new(name="Color", type="FLOAT_COLOR", domain="POINT")

    ao_rays = 24
    ao_dist = 0.38

    hx, hy, hz = HEADLIGHT_P
    nx_h, ny_h, nz_h = HEADLIGHT_N
    nl_h = math.sqrt(nx_h * nx_h + ny_h * ny_h + nz_h * nz_h)
    h_cx = hx + (nx_h / nl_h) * 0.085
    h_cy = hy + (ny_h / nl_h) * 0.085
    h_cz = hz + (nz_h / nl_h) * 0.085

    for idx, v in enumerate(body_mesh.vertices):
        p_b = v.co
        n_b = v.normal.normalized() if v.normal.length > 1e-6 else Vector((0.0, 0.0, 1.0))
        gx, gy, gz = from_blender_pt(p_b)
        nx, ny, nz = from_blender_nrm(n_b)
        ax = abs(gx)

        # Raytraced contact AO
        origin = p_b + n_b * 0.008
        occ = 0.0
        for d in fibonacci_hemisphere(n_b, ao_rays, spread=0.90):
            hit, _, _, dist = occluder_bvh.ray_cast(origin, d, ao_dist)
            if hit is not None:
                occ += (1.0 - dist / ao_dist) * 0.78
        ao = 1.0 - min(0.55, (occ / ao_rays) * 0.85)

        # Zone 1: Cockpit interior cavity
        dx_c = max(0.0, ax - 0.65)
        dy_c = max(0.0, abs(gy - 1.28) - 0.58)
        dz_c = max(0.0, abs(gz - (-0.20)) - 0.64)
        d_cav = math.sqrt(dx_c * dx_c + dy_c * dy_c + dz_c * dz_c)
        # Interior faces inside cockpit opening
        in_box = (ax < 0.69) and (0.64 < gy < 1.01) and (-0.87 < gz < 0.46)
        w_int = (1.0 - sstep(0.0, 0.045, d_cav)) * (1.0 if in_box else 0.0)

        # Zone 2: Wheel wells & underbody
        w_under = sstep(0.37, 0.31, gy) * sstep(-0.15, -0.55, ny)
        for zc, wr in ((WHEEL_ZF, 0.55), (WHEEL_ZR, 0.56)):
            ry = gy - WHEEL_Y
            rz = gz - zc
            rl = math.hypot(ry, rz) or 1.0
            facing_axle = -(ny * ry + nz * rz) / rl
            near_well = 1.0 - sstep(wr - 0.01, wr + 0.055, rl)
            w_under = max(w_under, sstep(0.15, 0.55, facing_axle) * near_well * sstep(0.50, 0.66, ax))

        # Zone 3: Smiling front grille mouth cavity
        g_ell = ((gx / 0.42) ** 2 + ((gy - 0.555) / 0.11) ** 2)
        w_grille = (1.0 - sstep(0.75, 1.05, g_ell)) * sstep(2.06, 2.13, gz)

        # Zone 4: Headlight socket bowls (strictly inside the 0.148 m chrome bezel so zero silver halo bleeds outside!)
        d_sock = math.sqrt((ax - h_cx) ** 2 + (gy - h_cy) ** 2 + (gz - h_cz) ** 2) - 0.132
        w_sock = 1.0 - sstep(-0.008, 0.012, d_sock)

        # Exterior paint with subtle sun-crest lift
        crest_k = max(0.0, ny) * sstep(0.78, 1.02, gy) * 0.35
        c = lerp_col(c_paint, c_paint_crest, crest_k)
        c = lerp_col(c, c_interior, w_int)
        c = lerp_col(c, c_under, w_under)
        c = lerp_col(c, c_grille, w_grille)
        c = lerp_col(c, c_socket, w_sock)

        # Apply gentle AO (stronger in interior/crevices, high-key luminous on exterior paint!)
        ao_eff = lerp(0.74 + 0.26 * ao, ao, max(w_int, w_under))
        col_attr.data[idx].color = (c[0] * ao_eff, c[1] * ao_eff, c[2] * ao_eff, 1.0)

    body_mesh.color_attributes.active_color = col_attr


def bake_soft_ao_on_mesh(
    mesh: bpy.types.Mesh, occluder_bvh: BVHTree, strength: float = 0.36
) -> None:
    """Bake soft contact AO into COLOR_0 of CreamInterior / PlumTrim / HoodBow."""
    col_attr = mesh.color_attributes.active_color
    if col_attr is None:
        set_uniform_uv_and_color(mesh, (1.0, 1.0, 1.0))
        col_attr = mesh.color_attributes.active_color

    ao_rays = 16
    ao_dist = 0.28
    for idx, v in enumerate(mesh.vertices):
        p_b = v.co
        n_b = v.normal.normalized() if v.normal.length > 1e-6 else Vector((0.0, 0.0, 1.0))
        origin = p_b + n_b * 0.006
        occ = 0.0
        for d in fibonacci_hemisphere(n_b, ao_rays, spread=0.88):
            hit, _, _, dist = occluder_bvh.ray_cast(origin, d, ao_dist)
            if hit is not None:
                occ += (1.0 - dist / ao_dist) * 0.8
        ao = 1.0 - min(strength, (occ / ao_rays) * strength * 1.45)
        c0 = col_attr.data[idx].color
        col_attr.data[idx].color = (c0[0] * ao, c0[1] * ao, c0[2] * ao, 1.0)


# ---------------------------------------------------------------------------
# Export & Optional Cycles Studio Render
# ---------------------------------------------------------------------------


def export_car_assets(
    scene: bpy.types.Scene,
    export_objs: list[bpy.types.Object],
    glb_path: Path,
    blend_path: Path,
) -> None:
    glb_path.parent.mkdir(parents=True, exist_ok=True)

    bpy.ops.object.select_all(action="DESELECT")
    for o in export_objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = export_objs[0]

    bpy.ops.export_scene.gltf(
        filepath=str(glb_path),
        export_format="GLB",
        use_selection=True,
        export_yup=True,
        export_apply=False,
        export_texcoords=True,
        export_normals=True,
        export_vertex_color="ACTIVE",
        export_all_vertex_colors=True,
        export_active_vertex_color_when_no_material=True,
        export_materials="NONE",
        export_draco_mesh_compression_enable=False,
    )

    bpy.ops.wm.save_as_mainfile(filepath=str(blend_path), compress=True)
    blend1 = Path(str(blend_path) + "1")
    if blend1.exists():
        blend1.unlink()


def main() -> None:
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else sys.argv[1:]
    parser = argparse.ArgumentParser(description="Build Star Racer 7 hero car (.glb + .blend) via Blender 4.2")
    parser.add_argument(
        "--out-dir",
        type=Path,
        default=Path(__file__).resolve().parent,
    )
    args = parser.parse_args(argv)

    clear_scene()
    scene = bpy.context.scene

    body_obj, shadow_obj, high_bvh = build_sculpted_car_body(scene)
    print("[3/6] Building trim, interior, bow, steering, 3D wheels...", flush=True)
    chr_obj, plm_obj = build_chrome_and_plum_trim(scene, high_bvh)
    cream_obj = build_cream_interior(scene)
    bow_obj = build_hood_bow(scene, high_bvh)
    steer_obj = build_steering_wheel(scene)
    wheel_objs = build_3d_wheel_assembly(scene)

    print("[4/6] Baking BVH raytraced AO & multi-zone vertex colors...", flush=True)
    # Build combined BVH of the assembled car for genuine multi-part contact AO!
    occluder_bvh = build_combined_occluder_bvh([body_obj, chr_obj, plm_obj, cream_obj, bow_obj])
    bake_car_body_colors_and_ao(body_obj.data, occluder_bvh)
    bake_soft_ao_on_mesh(cream_obj.data, occluder_bvh, strength=0.34)
    bake_soft_ao_on_mesh(plm_obj.data, occluder_bvh, strength=0.28)
    bake_soft_ao_on_mesh(bow_obj.data, occluder_bvh, strength=0.30)

    export_objs = [
        body_obj,
        shadow_obj,
        chr_obj,
        plm_obj,
        cream_obj,
        bow_obj,
        steer_obj,
        *wheel_objs,
    ]

    glb_path = args.out_dir / "star-racer-7.glb"
    blend_path = args.out_dir / "star-racer-7.blend"
    export_car_assets(scene, export_objs, glb_path, blend_path)

    total_tris = sum(len(o.data.polygons) for o in export_objs)
    print(f"Exported {glb_path.name} ({glb_path.stat().st_size // 1024} KB), total tris: {total_tris}")
    for o in export_objs:
        print(f"  {o.name:18s}: {len(o.data.vertices):6d} verts, {len(o.data.polygons):6d} tris")

    sys.stdout.flush()
    os._exit(0)


if __name__ == "__main__":
    main()
