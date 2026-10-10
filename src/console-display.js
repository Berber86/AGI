import * as THREE from "three";

export function createConsoleDisplay() {
  const canvas = document.createElement("canvas");
  canvas.width = 768;
  canvas.height = 432;
  const ctx = canvas.getContext("2d");
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    toneMapped: false,
  });
  let previous;
  function update(base) {
    const delivered = base.deposited.filter(Boolean).length,
      reports = base.researched.filter(Boolean).length;
    const key = [
      delivered,
      reports,
      base.upgrades.length,
      base.transmitted,
    ].join("/");
    if (key === previous) return;
    previous = key;
    ctx.fillStyle = "#071b25";
    ctx.fillRect(0, 0, 768, 432);
    ctx.strokeStyle = "#284c55";
    ctx.lineWidth = 1;
    for (let x = 24; x < 768; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 100);
      ctx.lineTo(x, 397);
      ctx.stroke();
    }
    for (let y = 109; y < 405; y += 32) {
      ctx.beginPath();
      ctx.moveTo(24, y);
      ctx.lineTo(744, y);
      ctx.stroke();
    }
    ctx.fillStyle = "#b6e5dd";
    ctx.font = "24px sans-serif";
    ctx.fillText("STRANNIK / ORBITAL UPLINK", 30, 45);
    ctx.font = "12px monospace";
    ctx.fillStyle = "#8aa9ab";
    ctx.fillText(
      base.transmitted
        ? "ARCHIVE RECEIVED • TRANSMISSION COMPLETE"
        : "LOCAL RESEARCH NETWORK • STANDBY",
      30,
      76,
    );
    ctx.strokeStyle = "#a7c9b2";
    ctx.lineWidth = 2;
    for (const r of [52, 74, 92]) {
      ctx.beginPath();
      ctx.arc(169, 230, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.strokeStyle = "#d5b980";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(
      169,
      230,
      92,
      -Math.PI / 2,
      -Math.PI / 2 + Math.PI * 2 * Math.max(0.015, reports / 3),
    );
    ctx.stroke();
    ctx.fillStyle = "#d9e6cd";
    ctx.font = "44px monospace";
    ctx.fillText(`${reports}/3`, 129, 244);
    ctx.font = "12px monospace";
    ctx.fillStyle = "#8aa9ab";
    ctx.fillText("VERIFIED REPORTS", 113, 359);
    const rows = [
      ["SAMPLE STORAGE", delivered, "/ 3"],
      ["RESEARCH REPORTS", reports, "/ 3"],
      ["EQUIPMENT MK II", base.upgrades.length, "/ 2"],
    ];
    rows.forEach(([title, value, total], i) => {
      const y = 141 + i * 78;
      ctx.fillStyle = "#9abebc";
      ctx.font = "13px monospace";
      ctx.fillText(title, 330, y);
      ctx.font = "23px monospace";
      ctx.fillStyle = "#dfd0a8";
      ctx.fillText(`${value} ${total}`, 621, y + 1);
      ctx.fillStyle = "#29454c";
      ctx.fillRect(330, y + 20, 370, 6);
      ctx.fillStyle = "#a7c9b2";
      ctx.fillRect(330, y + 20, (370 * value) / (i === 2 ? 2 : 3), 6);
    });
    ctx.fillStyle = "#0b222b";
    ctx.fillRect(0, 397, 768, 35);
    ctx.fillStyle = "#b0c4b8";
    ctx.font = "12px monospace";
    ctx.fillText(
      "E–07    /    SCIENCE DIVISION                     PALIMPSEST",
      30,
      419,
    );
    texture.needsUpdate = true;
  }
  update({ deposited: [], researched: [], upgrades: [], transmitted: false });
  return { material, update };
}
