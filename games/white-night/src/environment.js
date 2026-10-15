// Deliberate, reproducible clusters rather than uniform random decoration.
export const RUBBISH = [
  { x: -2.45, z: .45, scale: .53 },
  { x: -3.04, z: -.42, scale: .36 },
  { x: 2.85, z: -2.7, scale: .43 },
];
export function windowTreatment(column, row, facade) {
  const index = (column * 7 + row * 3 + facade * 5) % 11;
  // A white night is read through warm windows against cold stone, so keep a few
  // apartments awake. The set is still deterministic and reproducible.
  return index === 0 || index === 7 ? 'lit' : index === 4 ? 'open' : index === 8 ? 'blind' : index === 3 || index === 6 ? 'curtain' : 'reflection';
}
