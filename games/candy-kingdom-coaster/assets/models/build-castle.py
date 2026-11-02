#!/usr/bin/env python3
"""Build the Candy Kingdom Coaster Sugar Castle 3D asset in real Blender (bpy).

Pipeline (Blender 4.2 LTS headless via `bpy`), mirroring build-car.py /
build-gummy-bear.py:
  1. Architectural block-out of the Sugar Castle in game coordinates: candy-rock
     platform + terraces + front stairs, a 10-segment curtain wall with sugar-cube
     crenellations, 13 towers (wall-joint, gate, keep + side turrets) with gold
     trim rings, parapet teeth and tiered witch-hat roofs, a grand 3-tier keep
     with crown spire + gold orb, a gatehouse with gold arch / doors / portcullis,
     a rainbow over the gate and balloon bunches at the gate corners.
  2. Every mass is a beveled "sugar" solid (bmesh bevel, smooth-by-angle normals)
     instead of the faceted 14-segment THREE primitives it replaces.
  3. Raytraced optical baking via `mathutils.bvhtree.BVHTree`: outward hemisphere
     rays bake soft contact ambient occlusion into COLOR_0 (warm creases at wall
     joints, under parapets and roof eaves — never muddy grey), multiplied into
     the per-part candy palette.
  4. Meter-normalised UVs on the wafer walls so the runtime `wall.webp` brick map
     tiles exactly like the procedural castle.
  5. Exports:
     - `sugar-castle.glb`   — runtime binary glTF 2.0, one named mesh per material
                              group (POSITION, NORMAL, TEXCOORD_0, COLOR_0).
     - `sugar-castle.blend` — clean Blender 4.2 scene (Principled candy shaders,
                              3-point studio lights & camera) ready for desktop.
     - Optional `--render-studio <png>` Cycles + OpenImageDenoise preview render.

Coordinate convention (identical to build-car.py):
  Helper `P(x, y, z)` maps game castle-space (`+X` right, `+Y` up, `+Z` toward the
  gate/front, ground `y = 0`) to Blender (`X = x, Y = -z, Z = y`), which Blender's
  glTF 2.0 `+Y`-up exporter maps back 1:1 to Three.js `(x, y, z)`.

Usage:
  python3 build-castle.py [--render-studio /tmp/shots/castle_studio.png]
"""

from __future__ import annotations

import argparse
import math
import os
import sys
from pathlib import Path

import bpy
import bmesh
from mathutils import Euler, Matrix, Vector
from mathutils.bvhtree import BVHTree

HERE = Path(__file__).resolve().parent
GLB_OUT = HERE / "sugar-castle.glb"
BLEND_OUT = HERE / "sugar-castle.blend"

# ---------------------------------------------------------------------------
# Small math / color helpers
# ---------------------------------------------------------------------------


def P(x: float, y: float, z: float) -> Vector:
    """Game castle coords (+X right, +Y up, +Z front) -> Blender (X, -Z, Y)."""
    return Vector((x, -z, y))


def P_dir(x: float, y: float, z: float) -> Vector:
    """Game direction -> Blender direction (no translation)."""
    return Vector((x, -z, y))


# Change-of-basis game -> Blender; used to conjugate game-space rotations.
_C = Matrix(((1, 0, 0), (0, 0, -1), (0, 1, 0)))


def game_rot(rx: float, ry: float, rz: float) -> Matrix:
    """A rotation given as game-space Euler XYZ, expressed in Blender space."""
    r_game = Euler((rx, ry, rz), "XYZ").to_matrix()
    return (_C @ r_game @ _C.transposed()).to_4x4()


def srgb_to_linear(c):
    def ch(x):
        return x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4
    return (ch(c[0]), ch(c[1]), ch(c[2]))


def hexcol(h):
    h = h.lstrip("#")
    return srgb_to_linear(tuple(int(h[i:i + 2], 16) / 255.0 for i in (0, 2, 4)))


def lerp(a, b, t):
    return a + (b - a) * t


def lerp_col(c1, c2, t):
    k = max(0.0, min(1.0, t))
    return (c1[0] + (c2[0] - c1[0]) * k, c1[1] + (c2[1] - c1[1]) * k, c1[2] + (c2[2] - c1[2]) * k)


def sstep(e0, e1, x):
    if abs(e1 - e0) < 1e-9:
        return 1.0 if x >= e1 else 0.0
    t = max(0.0, min(1.0, (x - e0) / (e1 - e0)))
    return t * t * (3.0 - 2.0 * t)


# Candy palette (linear). Walls keep their pink tint in COLOR_0 and are multiplied
# by the runtime wafer map; everything else is pure vertex color.
C_WALL = hexcol("#ffb7d9")
C_WALL_B = hexcol("#ff8fc6")
C_CREAM = hexcol("#ffd7ea")
C_ROOF_PINK = hexcol("#ff4f96")
C_ROOF_PURPLE = hexcol("#8f6bff")
C_ROOF_BLUE = hexcol("#56c8ff")
C_GOLD = hexcol("#ffd45e")
C_WINDOW = hexcol("#ffb347")
C_DOOR = hexcol("#a3562e")
C_FLAG = [hexcol("#ff4f96"), hexcol("#ffd45e"), hexcol("#56c8ff")]
C_RAINBOW = [hexcol(c) for c in ("#ff6b81", "#ffb14e", "#ffe66d", "#6bd96b", "#56c8ff", "#a06bff")]
C_BALLOON = [hexcol(c) for c in ("#ff5f7a", "#56c8ff", "#ffd45e", "#8ef07e", "#b18aff")]

# Material-group names exported to the GLB (one draw call each in-game).
G_WALLS = "CastleWalls"
G_TRIM = "CastleTrim"
G_ROOF_PINK = "CastleRoofPink"
G_ROOF_PURPLE = "CastleRoofPurple"
G_ROOF_BLUE = "CastleRoofBlue"
G_GOLD = "CastleGold"
G_WINDOWS = "CastleWindows"
G_DOORS = "CastleDoors"
G_FLAGS = "CastleFlags"
G_RAINBOW = "CastleRainbow"
G_BALLOONS = "CastleBalloons"

# Tessellation (tuned for a smooth candy silhouette well under the procedural
# castle's ~55k triangles).
SEG_TOWER = 28
SEG_CONE = 28
SEG_RING = 22
SEG_RING_MINOR = 9
SEG_SPHERE = 18
BEVEL_SEG = 2

# Accumulated geometry: group name -> list of (mesh, base_color_rgb).
_PARTS: dict[str, list] = {}


def reset_scene() -> bpy.types.Scene:
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.unit_settings.system = "METRIC"
    scene.unit_settings.scale_length = 1.0
    return scene


def _register(group: str, mesh: bpy.types.Mesh, color, uv: bool):
    # Per-vertex base color (linear); AO is multiplied in later.
    while mesh.color_attributes:
        mesh.color_attributes.remove(mesh.color_attributes[0])
    ca = mesh.color_attributes.new(name="Color", type="FLOAT_COLOR", domain="POINT")
    for i in range(len(mesh.vertices)):
        ca.data[i].color = (color[0], color[1], color[2], 1.0)
    mesh.color_attributes.active_color = ca
    if not uv:
        while mesh.uv_layers:
            mesh.uv_layers.remove(mesh.uv_layers[0])
    obj = bpy.data.objects.new("_part", mesh)
    bpy.context.collection.objects.link(obj)
    _PARTS.setdefault(group, []).append(obj)
    return obj


def _uv_box(bm: bmesh.types.BMesh):
    """Three.js-style per-face 0..1 UVs normalised to the primitive's bbox, so the
    runtime wall.webp (repeat 4x2, mirror) tiles like RoundedBoxGeometry did."""
    xs = [v.co.x for v in bm.verts]; ys = [v.co.y for v in bm.verts]; zs = [v.co.z for v in bm.verts]
    mn = Vector((min(xs), min(ys), min(zs))); mx = Vector((max(xs), max(ys), max(zs)))
    ext = mx - mn
    uv_lay = bm.loops.layers.uv.new("UVMap")
    for f in bm.faces:
        n = f.normal
        ax, ay, az = abs(n.x), abs(n.y), abs(n.z)
        for lp in f.loops:
            co = lp.vert.co
            if ax >= ay and ax >= az:
                u = (co.y - mn.y) / (ext.y or 1); v = (co.z - mn.z) / (ext.z or 1)
            elif ay >= az:
                u = (co.x - mn.x) / (ext.x or 1); v = (co.z - mn.z) / (ext.z or 1)
            else:
                u = (co.x - mn.x) / (ext.x or 1); v = (co.y - mn.y) / (ext.y or 1)
            lp[uv_lay].uv = (u, v)


def _uv_cyl(bm: bmesh.types.BMesh, height: float):
    uv_lay = bm.loops.layers.uv.new("UVMap")
    zs = [v.co.z for v in bm.verts]
    zmn, zmx = min(zs), max(zs)
    for f in bm.faces:
        nz = abs(f.normal.z)
        for lp in f.loops:
            co = lp.vert.co
            if nz > 0.7:  # cap -> planar
                lp[uv_lay].uv = (co.x * 0.5 + 0.5, co.y * 0.5 + 0.5)
            else:  # side -> wrap
                u = (math.atan2(co.y, co.x) / (2 * math.pi)) + 0.5
                v = (co.z - zmn) / ((zmx - zmn) or 1)
                lp[uv_lay].uv = (u, v)


def add_box(group, center, size, color, bevel=0.35, uv=False, rot=None):
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    # game size (sx, sy, sz) -> Blender (sx, sz, sy): game Y-up becomes Blender Z-up
    bmesh.ops.scale(bm, vec=Vector((size[0], size[2], size[1])), verts=bm.verts)
    if bevel > 0:
        bmesh.ops.bevel(bm, geom=list(bm.edges), offset=bevel,
                        segments=BEVEL_SEG, profile=0.72, affect="EDGES", clamp_overlap=True)
    bmesh.ops.triangulate(bm, faces=bm.faces)
    if uv:
        _uv_box(bm)
    m = bpy.data.meshes.new("_p"); bm.to_mesh(m); bm.free()
    obj = _register(group, m, color, uv)
    mat = Matrix.Translation(P(*center))
    if rot is not None:
        mat = mat @ game_rot(*rot)
    obj.matrix_world = mat
    return obj


def add_cylinder(group, center, r_bottom, r_top, height, color, seg=SEG_TOWER, uv=False, rot=None, axis=None):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=seg,
                          radius1=r_bottom, radius2=r_top, depth=height)
    # light bevel on the rim for a soft candy edge
    rim = [e for e in bm.edges if abs(e.verts[0].co.z - e.verts[1].co.z) < 1e-5]
    if rim and r_top > 0.01:
        bmesh.ops.bevel(bm, geom=rim, offset=min(0.18, height * 0.06), segments=1,
                        profile=0.7, affect="EDGES", clamp_overlap=True)
    bmesh.ops.triangulate(bm, faces=bm.faces)
    if uv:
        _uv_cyl(bm, height)
    m = bpy.data.meshes.new("_p"); bm.to_mesh(m); bm.free()
    obj = _register(group, m, color, uv)
    mat = Matrix.Translation(P(*center))
    if axis is not None:
        # point the cylinder's local +Z (Blender up) along a game-space direction
        d = P_dir(*axis).normalized()
        mat = mat @ d.to_track_quat("Z", "Y").to_matrix().to_4x4()
    elif rot is not None:
        mat = mat @ game_rot(*rot)
    obj.matrix_world = mat
    return obj


def add_cone(group, center, r, height, color, seg=SEG_CONE):
    return add_cylinder(group, center, r, 0.0, height, color, seg=seg, uv=False)


def add_sphere(group, center, r, color, seg=SEG_SPHERE):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=seg, v_segments=max(8, seg // 2), radius=r)
    bmesh.ops.triangulate(bm, faces=bm.faces)
    m = bpy.data.meshes.new("_p"); bm.to_mesh(m); bm.free()
    obj = _register(group, m, color, False)
    obj.matrix_world = Matrix.Translation(P(*center))
    return obj


def add_torus(group, center, major_r, minor_r, color, arc=2 * math.pi,
              seg=SEG_RING, minor_seg=SEG_RING_MINOR, arch=False):
    """Torus in the local XY plane (around Z). `arch=True` rotates it into the XZ
    plane (around Y) so a half-arc reads as a gate arch / rainbow facing +Z game."""
    bm = bmesh.new()
    verts = []
    n_major = max(3, int(seg * (arc / (2 * math.pi)))) if arc < 2 * math.pi - 1e-6 else seg
    closed = arc >= 2 * math.pi - 1e-6
    rings = n_major if closed else n_major + 1
    for i in range(rings):
        th = arc * (i / n_major)
        cx, cy = major_r * math.cos(th), major_r * math.sin(th)
        radial = Vector((math.cos(th), math.sin(th), 0))
        ring = []
        for j in range(minor_seg):
            ph = 2 * math.pi * j / minor_seg
            p = Vector((cx, cy, 0)) + radial * (minor_r * math.cos(ph)) + Vector((0, 0, minor_r * math.sin(ph)))
            ring.append(bm.verts.new(p))
        verts.append(ring)
    bm.verts.ensure_lookup_table()
    for i in range(n_major):
        a = verts[i]; b = verts[(i + 1) % rings]
        for j in range(minor_seg):
            k = (j + 1) % minor_seg
            bm.faces.new((a[j], a[k], b[k], b[j]))
    if not closed:
        # cap the two open ends of a half-arc
        for ring in (verts[0], verts[-1]):
            bm.faces.new(ring)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bmesh.ops.triangulate(bm, faces=bm.faces)
    m = bpy.data.meshes.new("_p"); bm.to_mesh(m); bm.free()
    obj = _register(group, m, color, False)
    mat = Matrix.Translation(P(*center))
    if arch:
        mat = mat @ Euler((math.pi / 2, 0, 0), "XYZ").to_matrix().to_4x4()
    obj.matrix_world = mat
    return obj


def add_flag(group, center, w, h, color):
    bm = bmesh.new()
    # gentle two-segment wave for a cloth feel
    nx = 3
    rows = []
    for iy in range(2):
        row = []
        for ix in range(nx + 1):
            x = w * ix / nx
            y = h * iy
            z = 0.12 * math.sin(ix / nx * math.pi * 1.5) * (ix / nx)
            row.append(bm.verts.new((x, y, z)))
        rows.append(row)
    for ix in range(nx):
        bm.faces.new((rows[0][ix], rows[0][ix + 1], rows[1][ix + 1], rows[1][ix]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bmesh.ops.triangulate(bm, faces=bm.faces)
    m = bpy.data.meshes.new("_p"); bm.to_mesh(m); bm.free()
    obj = _register(group, m, color, False)
    # flag plane faces +Z game (Blender XZ after a +90deg X rotation), hangs from pole
    mat = Matrix.Translation(P(*center)) @ Euler((math.pi / 2, 0, 0), "XYZ").to_matrix().to_4x4()
    obj.matrix_world = mat
    return obj


# ---------------------------------------------------------------------------
# Castle assembly (game coordinates; matches src/world.js buildCastle layout)
# ---------------------------------------------------------------------------

WRX, WRZ = 19.5, 11.5


def tower(x, z, r, h, wall_color, roof_group, roof_color, tiers=1, flag=True):
    """One candy tower: tapered body, gold ring, parapet + teeth, tiered roofs,
    glowing windows and a pennant flag. `roof_group`/`roof_color` pick the first
    tier's material; higher tiers alternate purple/blue like the procedural one."""
    # body (tapered) + gold trim ring + crown parapet
    add_cylinder(G_WALLS, (x, h / 2, z), r * 1.12, r, h, wall_color, uv=True)
    add_torus(G_GOLD, (x, h - 0.4, z), r * 1.12, 0.32, C_GOLD)
    add_cylinder(G_WALLS, (x, h + 0.35, z), r * 1.24, r * 1.24, 1.3, C_WALL_B, uv=True)
    # parapet teeth (sugar cubes)
    for k in range(7):
        aa = k / 7 * 2 * math.pi
        add_box(G_TRIM, (x + math.cos(aa) * r * 1.1, h + 1.45, z + math.sin(aa) * r * 1.1),
                (r * 0.42, 1.15, r * 0.42), C_CREAM, bevel=0.18)
    # tiered witch-hat roofs + gold finial balls
    y_top = h + 1.2
    for tt in range(tiers):
        rr = r * (1.32 - tt * 0.26)
        ch = r * (2.5 - tt * 0.35)
        if tt == 0:
            grp, col = roof_group, roof_color
        elif tt % 2 == 1:
            grp, col = G_ROOF_PURPLE, C_ROOF_PURPLE
        else:
            grp, col = G_ROOF_BLUE, C_ROOF_BLUE
        add_cone(grp, (x, y_top + r * (1.25 - tt * 0.17), z), rr, ch, col)
        add_sphere(G_GOLD, (x, y_top + ch + r * (1.25 - tt * 0.17) - r * 0.15, z), rr * 0.22, C_GOLD, seg=12)
        y_top += r * (1.55 - tt * 0.1)
    # glowing window rows on 4 outward faces
    for k in range(3):
        for side in range(4):
            aa = side / 4 * 2 * math.pi + math.pi / 4
            wx = x + math.cos(aa) * r * 0.98
            wz = z + math.sin(aa) * r * 0.98
            wy = h * (0.32 + k * 0.2)
            # short cylinder pointing radially outward (axis in game XZ plane)
            add_cylinder(G_WINDOWS, (wx, wy, wz), r * 0.24, r * 0.24, 0.7, C_WINDOW, seg=10,
                         axis=(math.cos(aa), 0, math.sin(aa)))
    # pennant flag on a gold pole
    if flag:
        add_cylinder(G_GOLD, (x, y_top + r * 2.2, z), 0.12, 0.12, 4.6, C_GOLD, seg=8)
        fc = C_FLAG[int(abs(x)) % 3]
        add_flag(G_FLAGS, (x + 0.05, y_top + r * 2.2 + 1.9, z), 2.8, 1.4, fc)


def build_castle_geometry():
    # ---- candy-rock platform + terraces + front stairs ----
    add_box(G_TRIM, (0, 2.5, 0), (54, 5, 38), C_CREAM, bevel=1.6)
    add_box(G_WALLS, (0, 6.4, 0), (46, 3.4, 30), C_WALL, bevel=1.3, uv=True)
    for i in range(3):
        add_box(G_TRIM, (0, 6.9 - i * 1.15, 16.2 + i * 1.35),
                (14 - i * 1.2, 1.15, 2.4), C_CREAM, bevel=0.35)

    # ---- curtain wall ring (10 segments) + crenellations + banner poles ----
    for i in range(10):
        a = i / 10 * 2 * math.pi
        a2 = (i + 1) / 10 * 2 * math.pi
        x1, z1 = math.cos(a) * WRX, math.sin(a) * WRZ
        x2, z2 = math.cos(a2) * WRX, math.sin(a2) * WRZ
        mx, mz = (x1 + x2) / 2, (z1 + z2) / 2
        seg_len = math.hypot(x2 - x1, z2 - z1) + 1.2
        ry = -math.atan2(z2 - z1, x2 - x1)
        wc = C_WALL if i % 2 else C_WALL_B
        add_box(G_WALLS, (mx, 12.2, mz), (seg_len, 8.2, 2.3), wc, bevel=0.5,
                uv=True, rot=(0, ry, 0))
        for k in range(4):
            t = (k + 0.5) / 4
            cx = x1 + (x2 - x1) * t; cz = z1 + (z2 - z1) * t
            add_box(G_TRIM, (cx, 17.05, cz), (seg_len / 7.2, 1.5, 2.9), C_CREAM,
                    bevel=0.3, rot=(0, ry, 0))
        if i % 2 == 1:
            add_cylinder(G_GOLD, (mx, 20.2, mz), 0.12, 0.12, 5.4, C_GOLD, seg=8)
            pc = C_ROOF_PINK if i % 4 == 1 else C_ROOF_BLUE
            pg = G_ROOF_PINK if i % 4 == 1 else G_ROOF_BLUE
            add_cone(pg, (mx + 1.15, 21.6, mz), 0.85, 2.4, pc, seg=10)

    # ---- wall-joint towers ----
    for i in range(0, 10, 2):
        a = i / 10 * 2 * math.pi + 0.314
        wc = C_WALL if i % 4 else C_WALL_B
        rg, rc = (G_ROOF_PINK, C_ROOF_PINK) if i % 4 else (G_ROOF_PURPLE, C_ROOF_PURPLE)
        tower(math.cos(a) * WRX, math.sin(a) * WRZ, 2.7, 13.5 + (i % 4) * 1.3, wc, rg, rc, tiers=1)
    # ---- gate towers (front, taller) ----
    tower(-7.6, 10.2, 3.2, 16.5, C_WALL, G_ROOF_PINK, C_ROOF_PINK, tiers=1)
    tower(7.6, 10.2, 3.2, 16.5, C_WALL, G_ROOF_PINK, C_ROOF_PINK, tiers=1)

    # ---- grand keep (3 tiers + crown spire + gold orb) ----
    tower(0, -2.2, 5.2, 25, C_WALL, G_ROOF_PINK, C_ROOF_PINK, tiers=2)
    add_cylinder(G_WALLS, (0, 30.2, -2.2), 3.9, 3.3, 6.4, C_WALL_B, uv=True)
    add_cone(G_ROOF_PURPLE, (0, 38.1, -2.2), 3.7, 9.5, C_ROOF_PURPLE)
    add_sphere(G_GOLD, (0, 43.6, -2.2), 1.15, C_GOLD)
    for row in range(4):
        for s2 in range(4):
            aa = s2 / 4 * 2 * math.pi + math.pi / 4
            rot = (math.pi / 2, 0, -aa + math.pi / 2)
            add_cylinder(G_WINDOWS, (math.sin(aa) * 5.15, 9.5 + row * 4.1, -2.2 + math.cos(aa) * 5.15),
                         0.62, 0.62, 0.75, C_WINDOW, seg=10, rot=rot)
    # keep side turrets
    tower(-6.8, -6.2, 2.2, 19, C_WALL_B, G_ROOF_BLUE, C_ROOF_BLUE, tiers=1)
    tower(6.8, -6.2, 2.2, 19, C_WALL_B, G_ROOF_BLUE, C_ROOF_BLUE, tiers=1)

    # ---- gatehouse: arch + gold doors + portcullis ----
    add_box(G_WALLS, (0, 13.3, 11.6), (15, 10.5, 3.4), C_WALL_B, bevel=0.9, uv=True)
    add_torus(G_GOLD, (0, 10.6, 13.35), 3.6, 1.15, C_GOLD, arc=math.pi, seg=22, minor_seg=10, arch=True)
    for sx in (-1.72, 1.72):
        add_box(G_DOORS, (sx, 8.4, 13.15), (3.35, 6.6, 0.55), C_DOOR, bevel=0.12)
        for k in range(3):
            add_sphere(G_GOLD, (sx, 6.4 + k * 2.1, 13.5), 0.28, C_GOLD, seg=10)
    for k in range(5):
        add_cylinder(G_GOLD, (-2.55 + k * 1.28, 8.6, 13.48), 0.11, 0.11, 6.2, C_GOLD, seg=8)

    # ---- rainbow over the gate ----
    # Set just in front of the gatehouse so the arch reads over the entrance
    # (the procedural castle buried it inside the gate box at z=11.2).
    for i, c in enumerate(C_RAINBOW):
        add_torus(G_RAINBOW, (0, 2.0, 14.8), 8.2 - i * 0.95, 0.55, c, arc=math.pi, seg=26, minor_seg=8, arch=True)

    # ---- balloon bunches at the gate corners ----
    for sx in (-11.5, 11.5):
        for k in range(5):
            add_sphere(G_BALLOONS, (sx + math.sin(k * 2.1) * 1.5, 20.2 + k * 1.35, 12.4 + math.cos(k * 2.1) * 1.5),
                       1.15 - k * 0.09, C_BALLOON[k], seg=16)


# ---------------------------------------------------------------------------
# Join parts per material group, bake BVH AO, finalise
# ---------------------------------------------------------------------------


def fibonacci_hemisphere(normal: Vector, count: int, spread: float = 0.90):
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
        dx = math.cos(phi) * r; dy = math.sin(phi) * r
        dz = math.sqrt(max(0.0, 1.0 - dx * dx - dy * dy))
        dirs.append((t1 * dx + t2 * dy + n * dz).normalized())
    return dirs


def join_groups(scene) -> list:
    """Join each material group's parts into a single named object."""
    joined = []
    for group, objs in _PARTS.items():
        bpy.ops.object.select_all(action="DESELECT")
        for o in objs:
            o.select_set(True)
        bpy.context.view_layer.objects.active = objs[0]
        if len(objs) > 1:
            bpy.ops.object.join()
        obj = bpy.context.view_layer.objects.active
        obj.name = group
        obj.data.name = group
        # apply the world transforms into the mesh so the GLB node is identity
        bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
        joined.append(obj)
    return joined


def shade_and_weld(objs):
    for o in objs:
        bpy.ops.object.select_all(action="DESELECT")
        o.select_set(True)
        bpy.context.view_layer.objects.active = o
        bpy.ops.object.shade_smooth()
        # mark hard edges sharp so flat candy faces keep a crisp silhouette while
        # curved surfaces stay smooth (Blender 4.2 smooth-by-angle).
        try:
            bpy.ops.object.shade_auto_smooth(angle=math.radians(38))
        except Exception:
            pass


def build_occluder_bvh(objs) -> BVHTree:
    bm = bmesh.new()
    for o in objs:
        bm.from_mesh(o.data)
    bmesh.ops.triangulate(bm, faces=bm.faces)
    bvh = BVHTree.FromBMesh(bm)
    bm.free()
    return bvh


def bake_ao(objs, bvh: BVHTree):
    ao_rays = 18
    ao_dist = 1.35
    for o in objs:
        mesh = o.data
        ca = mesh.color_attributes.active_color
        # windows / rainbow / balloons are emissive-bright: keep them luminous.
        gentle = o.name in (G_WINDOWS, G_RAINBOW, G_BALLOONS, G_GOLD, G_FLAGS)
        strength = 0.30 if gentle else 0.52
        for idx, v in enumerate(mesh.vertices):
            n = v.normal.normalized() if v.normal.length > 1e-6 else Vector((0, 0, 1))
            origin = v.co + n * 0.03
            occ = 0.0
            for d in fibonacci_hemisphere(n, ao_rays, spread=0.9):
                hit, _, _, dist = bvh.ray_cast(origin, d, ao_dist)
                if hit is not None:
                    occ += (1.0 - dist / ao_dist) * 0.8
            ao = 1.0 - min(strength, (occ / ao_rays) * strength * 1.5)
            c0 = ca.data[idx].color
            ca.data[idx].color = (c0[0] * ao, c0[1] * ao, c0[2] * ao, 1.0)
        mesh.update()


# ---------------------------------------------------------------------------
# Materials + studio scene (for the .blend and optional Cycles preview)
# ---------------------------------------------------------------------------


def _principled(name, base, rough=0.5, metal=0.0, emit=None, emit_str=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*base, 1.0)
    bsdf.inputs["Roughness"].default_value = rough
    bsdf.inputs["Metallic"].default_value = metal
    if emit is not None:
        bsdf.inputs["Emission Color"].default_value = (*emit, 1.0)
        bsdf.inputs["Emission Strength"].default_value = emit_str
    # vertex colors drive the candy tint + baked AO
    vc = mat.node_tree.nodes.new("ShaderNodeVertexColor")
    vc.layer_name = "Color"
    mat.node_tree.links.new(vc.outputs["Color"], bsdf.inputs["Base Color"])
    return mat


def assign_studio_materials(objs):
    srgb = lambda h: tuple(int(h.lstrip('#')[i:i+2], 16) / 255 for i in (0, 2, 4))
    mats = {
        G_WALLS: _principled("WaferWalls", srgb("#ffb7d9"), 0.55, 0.05),
        G_TRIM: _principled("CreamIcing", srgb("#ffd7ea"), 0.5),
        G_ROOF_PINK: _principled("RoofPink", srgb("#ff4f96"), 0.4, 0.12, srgb("#7a1044"), 0.22),
        G_ROOF_PURPLE: _principled("RoofPurple", srgb("#8f6bff"), 0.4, 0.12, srgb("#2c1270"), 0.22),
        G_ROOF_BLUE: _principled("RoofBlue", srgb("#56c8ff"), 0.4, 0.12, srgb("#0d3a66"), 0.22),
        G_GOLD: _principled("Gold", srgb("#ffd45e"), 0.3, 0.85, srgb("#7a5c10"), 0.35),
        G_WINDOWS: _principled("Windows", srgb("#6a2c8c"), 0.3, 0.0, srgb("#ffb347"), 0.85),
        G_DOORS: _principled("Doors", srgb("#a3562e"), 0.55, 0.15),
        G_FLAGS: _principled("Flags", srgb("#ff4f96"), 0.5),
        G_RAINBOW: _principled("Rainbow", srgb("#ffffff"), 0.45),
        G_BALLOONS: _principled("Balloons", srgb("#ff5f7a"), 0.3),
    }
    for o in objs:
        o.data.materials.clear()
        o.data.materials.append(mats[o.name])


def setup_studio(scene):
    # ground
    bpy.ops.mesh.primitive_plane_add(size=400, location=(0, 0, 0))
    ground = bpy.context.active_object
    gm = bpy.data.materials.new("Ground"); gm.use_nodes = True
    gm.node_tree.nodes["Principled BSDF"].inputs["Base Color"].default_value = (0.55, 0.75, 0.5, 1)
    gm.node_tree.nodes["Principled BSDF"].inputs["Roughness"].default_value = 0.9
    ground.data.materials.append(gm)
    # sun + fill
    bpy.ops.object.light_add(type="SUN", location=(60, -80, 120))
    sun = bpy.context.active_object; sun.data.energy = 3.0; sun.data.angle = math.radians(8)
    sun.rotation_euler = (math.radians(50), 0, math.radians(35))
    bpy.ops.object.light_add(type="AREA", location=(-90, 60, 60))
    fill = bpy.context.active_object; fill.data.energy = 8000; fill.data.size = 80
    fill.rotation_euler = (math.radians(55), 0, math.radians(-120))
    # world sky
    world = bpy.data.worlds.new("Sky"); world.use_nodes = True
    bg = world.node_tree.nodes["Background"]
    bg.inputs[0].default_value = (0.55, 0.75, 0.95, 1); bg.inputs[1].default_value = 0.7
    scene.world = world
    # camera framing the gate (+Z game = -Y blender) from front-right
    bpy.ops.object.camera_add(location=(70, -95, 42))
    cam = bpy.context.active_object
    cam.data.lens = 42
    direction = Vector((0, 0, 20)) - cam.location
    cam.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    scene.camera = cam


def render_studio(scene, path: Path):
    scene.render.engine = "CYCLES"
    scene.cycles.device = "CPU"
    scene.cycles.samples = 48
    scene.cycles.use_denoising = True
    scene.render.resolution_x = 960
    scene.render.resolution_y = 540
    scene.render.filepath = str(path)
    scene.render.image_settings.file_format = "PNG"
    path.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.render.render(write_still=True)


# ---------------------------------------------------------------------------
# Export
# ---------------------------------------------------------------------------


def export_assets(scene, objs, glb_path: Path, blend_path: Path):
    glb_path.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.object.select_all(action="DESELECT")
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.export_scene.gltf(
        filepath=str(glb_path), export_format="GLB", use_selection=True,
        export_yup=True, export_apply=False, export_texcoords=True, export_normals=True,
        export_vertex_color="ACTIVE", export_all_vertex_colors=True,
        export_active_vertex_color_when_no_material=True, export_materials="NONE",
        export_draco_mesh_compression_enable=False,
    )
    bpy.ops.wm.save_as_mainfile(filepath=str(blend_path), compress=True)
    b1 = Path(str(blend_path) + "1")
    if b1.exists():
        b1.unlink()


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else sys.argv[1:]
    parser = argparse.ArgumentParser(description="Build Sugar Castle (.glb + .blend) via Blender 4.2")
    parser.add_argument("--out-dir", type=Path, default=HERE)
    parser.add_argument("--render-studio", type=Path, default=None)
    args = parser.parse_args(argv)

    scene = reset_scene()
    print("[1/4] Blocking out the Sugar Castle...", flush=True)
    build_castle_geometry()
    print("[2/4] Joining material groups + smoothing...", flush=True)
    objs = join_groups(scene)
    shade_and_weld(objs)
    print("[3/4] Baking BVH raytraced AO into COLOR_0...", flush=True)
    bvh = build_occluder_bvh(objs)
    bake_ao(objs, bvh)

    total_tris = sum(len(o.data.polygons) for o in objs)
    print(f"  groups: {len(objs)}, total tris: {total_tris}", flush=True)
    for o in objs:
        print(f"    {o.name:18s}: {len(o.data.vertices):6d} verts, {len(o.data.polygons):6d} tris", flush=True)

    # Dress a clean studio scene (candy shaders + 3-point lights + camera) so the
    # saved .blend opens ready to view in desktop Blender. The GLB export below
    # selects only the castle meshes, so none of these helpers leak into the game.
    assign_studio_materials(objs)
    setup_studio(scene)
    if args.render_studio:
        print("[4/4] Studio Cycles render...", flush=True)
        render_studio(scene, args.render_studio)
    else:
        print("[4/4] Exporting GLB + BLEND...", flush=True)

    glb_path = args.out_dir / "sugar-castle.glb"
    blend_path = args.out_dir / "sugar-castle.blend"
    export_assets(scene, objs, glb_path, blend_path)
    print(f"Exported {glb_path.name} ({glb_path.stat().st_size // 1024} KB) + {blend_path.name}", flush=True)
    sys.stdout.flush()
    os._exit(0)


if __name__ == "__main__":
    main()
