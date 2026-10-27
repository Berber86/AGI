// One gaze semantics for every look source (repo VR guide §2):
//   yaw > 0  -> head turned right
//   pitch > 0 -> gaze up
// Camera application (three.js, camera looks down -Z), in ONE place (main.js):
//   rotateY(-yaw) then rotateX(pitch).
// This module is pure and unit-tested on synthetic poses.

export const clampDeg = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

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

/** Q1: -90 deg rotation around X to align device frame with camera frame. */
export const Q1 = quatFromAxisAngle(1, 0, 0, -90);

/**
 * Extract Euler angles (in radians) with YXZ order from a quaternion.
 * R = Ry(yaw) * Rx(pitch) * Roll(roll)
 */
function quatToEulerYXZ(q) {
  const [x, y, z, w] = q;
  const sx = 2 * (w * x - y * z);
  const pitch = Math.asin(Math.min(1, Math.max(-1, sx)));
  let yaw, roll;
  if (Math.abs(sx) < 0.99999) {
    yaw = Math.atan2(2 * (x * z + w * y), 1 - 2 * (x * x + y * y));
    roll = Math.atan2(2 * (x * y + w * z), 1 - 2 * (x * x + z * z));
  } else {
    yaw = 0;
    roll = 0;
  }
  return { x: pitch, y: yaw, z: roll };
}

/**
 * DeviceOrientation quaternion -> { yawDeg, pitchDeg } in the project semantics.
 * yaw > 0 = head turned right, pitch > 0 = gaze up.
 *
 * Ported from White Night gyro.js: build Euler(beta, alpha, -gamma, 'YXZ')
 * from W3C DeviceOrientation angles, convert to quaternion, apply Q1 camera
 * alignment, then extract relative Euler angles with YXZ order:
 *   yaw   = -euler.y  (device Y rotation → semantic yaw, sign flipped)
 *   pitch =  euler.x  (device X rotation → semantic pitch)
 */
export function deviceOrientationToYawPitch(alphaDeg, betaDeg, gammaDeg, screenAngleDeg = 0) {
  // Build device quaternion: R = Ry(alpha) * Rx(beta) * Rz(-gamma)  (YXZ order)
  let q = quatFromAxisAngle(0, 0, 1, (-gammaDeg || 0));
  q = quatMultiply(quatFromAxisAngle(1, 0, 0, betaDeg || 0), q);
  q = quatMultiply(quatFromAxisAngle(0, 1, 0, alphaDeg || 0), q);
  // Align device frame with camera frame (Q1 = -90 deg around X)
  q = quatMultiply(q, Q1);
  // Apply screen-orientation rotation around Z
  if (screenAngleDeg) {
    q = quatMultiply(q, quatFromAxisAngle(0, 0, 1, -screenAngleDeg));
  }
  const euler = quatToEulerYXZ(q);
  return {
    yawDeg: -euler.y * RAD_TO_DEG,
    pitchDeg: euler.x * RAD_TO_DEG,
  };
}

/** Map a marker centroid (u,v in 0..1) to raw yaw/pitch for an assumed camera FOV. */
export function centroidToYawPitch(u, v, fovHDeg = 60, fovVDeg = 45) {
  // Image u grows right; the world semantic yaw shrinks as u grows when the
  // marker pair moves left in frame (guide §2: pair left => head right).
  return { yawDeg: (0.5 - u) * fovHDeg, pitchDeg: (0.5 - v) * fovVDeg };
}
