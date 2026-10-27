// One gaze semantics for every look source (repo VR guide §2):
//   yaw > 0  -> head turned right
//   pitch > 0 -> gaze up
// Camera application (three.js, camera looks down -Z), in ONE place (main.js):
//   rotateY(-yaw) then rotateX(pitch).
// This module is pure and unit-tested on synthetic poses.

export const clampDeg = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/** Shortest signed angular difference a-b in degrees, wrapped to [-180, 180]. */
export function angDiffDeg(a, b) {
  let d = (a - b) % 360;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return d;
}

// --- minimal quaternion helpers, [x, y, z, w] ---
export function quatFromAxisAngle(ax, ay, az, deg) {
  const half = (deg * Math.PI) / 360;
  const s = Math.sin(half);
  const len = Math.hypot(ax, ay, az) || 1;
  return [(ax / len) * s, (ay / len) * s, (az / len) * s, Math.cos(half)];
}
export function quatMultiply(a, b) {
  const [ax, ay, az, aw] = a; const [bx, by, bz, bw] = b;
  return [
    aw * bx + ax * bw + ay * bz - az * by,
    aw * by - ax * bz + ay * bw + az * bx,
    aw * bz + ax * by - ay * bx + az * bw,
    aw * bw - ax * bx - ay * by - az * bz,
  ];
}
export function quatRotateVec(q, v) {
  const [x, y, z, w] = q;
  // v' = v + 2 * cross(q.xyz, cross(q.xyz, v) + w*v)
  const cx = y * v[2] - z * v[1];
  const cy = z * v[0] - x * v[2];
  const cz = x * v[1] - y * v[0];
  const tx = cx + w * v[0]; const ty = cy + w * v[1]; const tz = cz + w * v[2];
  return [
    v[0] + 2 * (y * tz - z * ty),
    v[1] + 2 * (z * tx - x * tz),
    v[2] + 2 * (x * ty - y * tx),
  ];
}

/**
 * DeviceOrientation quaternion -> { yawDeg, pitchDeg } in the project semantics.
 * Proven pair from the guide: yaw = -euler.y, pitch = +euler.x (three.js ZXY
 * extraction). Here we use the equivalent forward-vector form so it can be
 * unit-tested without three.js: build the device quaternion from
 * alpha/beta/gamma (intrinsic Z-X-Y, W3C) plus the screen-orientation rotation,
 * take the camera forward (-Z of the device) and read yaw/pitch off it.
 */
export function deviceOrientationToYawPitch(alphaDeg, betaDeg, gammaDeg, screenAngleDeg = 0) {
  let q = quatFromAxisAngle(0, 0, 1, alphaDeg || 0);
  q = quatMultiply(q, quatFromAxisAngle(1, 0, 0, betaDeg || 0));
  q = quatMultiply(q, quatFromAxisAngle(0, 1, 0, gammaDeg || 0));
  // Rotate into the screen frame and align device -Z with camera forward.
  q = quatMultiply(q, quatFromAxisAngle(1, 0, 0, -90));
  q = quatMultiply(q, quatFromAxisAngle(0, 0, 1, -(screenAngleDeg || 0)));
  const f = quatRotateVec(q, [0, 0, -1]);
  const yawDeg = (Math.atan2(f[0], -f[2]) * 180) / Math.PI;
  const pitchDeg = (Math.asin(Math.min(1, Math.max(-1, f[1]))) * 180) / Math.PI;
  return { yawDeg, pitchDeg };
}

/** Map a marker centroid (u,v in 0..1) to raw yaw/pitch for an assumed camera FOV. */
export function centroidToYawPitch(u, v, fovHDeg = 60, fovVDeg = 45) {
  // Image u grows right; the world semantic yaw shrinks as u grows when the
  // marker pair moves left in frame (guide §2: pair left => head right).
  return { yawDeg: (0.5 - u) * fovHDeg, pitchDeg: (0.5 - v) * fovVDeg };
}
