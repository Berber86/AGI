import { bayer } from "../src/core/frame.js";

/** Every threshold of the 4x4 ordered dither, for the test that keeps it a real matrix. */
export const BAYER_PROBE = (): number[] => {
  const out: number[] = [];
  for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) out.push(bayer(x, y));
  return out;
};
