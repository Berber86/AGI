// Vector inscriptions remain legible when a device lacks the rare Unicode glyphs.
export const GLYPH_NAMES = ["волна", "связь", "ромб", "триада"];
const paths = [
  "M3 15Q7 5 12 12T21 9M3 20Q7 10 12 17T21 14",
  "M4 5L20 19V5L4 19ZM12 5V19",
  "M12 2L22 12 12 22 2 12ZM12 8L16 12 12 16 8 12Z",
  "M12 2L23 21H1ZM12 9L17 18H7Z",
];
export function glyphSVG(index) {
  return `<svg class="inscription-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><path d="${paths[index] ?? paths[0]}"/></svg>`;
}
