// Deform a whole assembled object, including its labels/rims: no floating dents.
export function agePoint(id, x, y, z) {
  if (id === 'book') {
    const corner = Math.max(0, (x - .25) / .4) * Math.max(0, (y - .40) / .45);
    z += .07 * corner;
    x -= .018 * corner;
    y -= .025 * corner;
  } else if (id === 'box') {
    const wet = Math.exp(-((x - .5) ** 2 * 13 + (y + .38) ** 2 * 12 + (z - .35) ** 2 * 8));
    x -= .055 * wet; y += .034 * wet; z -= .05 * wet;
  } else if (id === 'can') {
    const a = Math.atan2(z, x);
    const dent = .14 * Math.exp(-(((y + .05) * 4) ** 2) - ((a - 1.2) * 2) ** 2);
    x *= 1 - dent; z *= 1 - dent;
  } else if (id === 'cup') {
    const a = Math.atan2(z, x);
    const lip = Math.max(0, (y - .26) / .2) * Math.exp(-(((a - 1.25) * 2) ** 2));
    x *= 1 - .12 * lip; z *= 1 - .12 * lip; y -= .018 * lip;
  } else if (id === 'paper') {
    const fold = (Math.abs(x + .08) - .08) * .21;
    const corner = Math.max(0, (x - .32) / .3) * Math.max(0, (y - .43) / .32);
    z += fold + .085 * corner + .006 * Math.sin(y * 13);
    x -= .05 * corner; y -= .036 * corner;
  }
  return [x, y, z];
}
