export function resolveMovement(position, delta, colliders, limit = 90) {
  const free = (x, z) =>
    colliders.every(
      (c) => (x - c.x) ** 2 + (z - c.z) ** 2 > (c.radius + 0.6) ** 2,
    );
  let x = Math.max(-limit, Math.min(limit, position.x + delta.x));
  let z = position.z;
  if (!free(x, z)) x = position.x;
  const nz = Math.max(-limit, Math.min(limit, position.z + delta.z));
  if (free(x, nz)) z = nz;
  return { x, z };
}
