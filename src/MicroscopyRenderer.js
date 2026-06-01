import { useEffect, useRef } from "react";

const SIZE = 500;
const R = SIZE / 2;

function seededRng(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function drawNoise(ctx, r, rng) {
  const imgData = ctx.getImageData(0, 0, SIZE, SIZE);
  const d = imgData.data;
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const dx = x - R, dy = y - R;
      if (dx * dx + dy * dy > R * R) continue;
      const i = (y * SIZE + x) * 4;
      const n = (rng() - 0.5) * 28;
      d[i]     = Math.min(255, Math.max(0, d[i]     + n));
      d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + n * 0.85));
      d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + n * 0.9));
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

function drawVignette(ctx) {
  const grad = ctx.createRadialGradient(R, R, R * 0.55, R, R, R);
  grad.addColorStop(0, "rgba(0,0,0,0)");
  grad.addColorStop(0.75, "rgba(0,0,0,0.12)");
  grad.addColorStop(1, "rgba(0,0,0,0.52)");
  ctx.save();
  ctx.beginPath();
  ctx.arc(R, R, R, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.restore();
}

function makeIrregularPolygon(cx, cy, rx, ry, sides, rng) {
  const pts = [];
  for (let i = 0; i < sides; i++) {
    const baseAngle = (i / sides) * Math.PI * 2;
    const angleJitter = (rng() - 0.5) * ((Math.PI * 2) / sides) * 0.5;
    const radJitter = 0.75 + rng() * 0.5;
    pts.push({
      x: cx + Math.cos(baseAngle + angleJitter) * rx * radJitter,
      y: cy + Math.sin(baseAngle + angleJitter) * ry * radJitter,
    });
  }
  return pts;
}

function drawSquames(ctx, rng) {
  const cells = [
    { cx: 155, cy: 175, rx: 72, ry: 58, sides: 7 },
    { cx: 340, cy: 140, rx: 68, ry: 60, sides: 6 },
    { cx: 255, cy: 290, rx: 78, ry: 65, sides: 8 },
    { cx: 130, cy: 355, rx: 60, ry: 55, sides: 6 },
    { cx: 380, cy: 310, rx: 70, ry: 62, sides: 7 },
    { cx: 310, cy: 420, rx: 64, ry: 56, sides: 9 },
  ];
  cells.forEach(({ cx, cy, rx, ry, sides }) => {
    const pts = makeIrregularPolygon(cx, cy, rx, ry, sides, rng);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.closePath();
    ctx.fillStyle = "rgba(203,184,200,0.55)";
    ctx.fill();
    ctx.strokeStyle = "#a899a6";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  });
}

// Draw a peanut/footprint: two ovals connected with a constricted waist
function drawYeast(ctx, cx, cy, angleDeg, scale) {
  const angle = (angleDeg * Math.PI) / 180;
  const mW = (10 + 2 * scale) * scale;   // mother half-width
  const mH = (6 + 1.5 * scale) * scale;  // mother half-height
  const bW = (7 + scale) * scale;         // bud half-width
  const bH = (4.5 + scale) * scale;       // bud half-height
  const dist = mW + bW * 0.72;            // centre-to-centre

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);

  // Build path: mother cell + constricted neck + bud as single shape
  // We approximate with two ellipses merged by a bezier waist
  const waist = 2.8 * scale;

  ctx.beginPath();
  // Mother cell (right/positive-x side)
  ctx.ellipse(0, 0, mW, mH, 0, 0, Math.PI * 2);
  ctx.restore();

  // Draw as layered shapes for the peanut look
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);

  // Shadow / outer shape
  ctx.beginPath();
  // Mother
  ctx.ellipse(0, 0, mW + 1, mH + 1, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#281850";
  ctx.fill();

  // Bud (at negative-x pole — monopolar budding from one end)
  ctx.beginPath();
  ctx.ellipse(-dist, 0, bW + 1, bH + 1, 0, 0, Math.PI * 2);
  ctx.fill();

  // Waist connector shadow
  ctx.beginPath();
  ctx.rect(-(dist - bW * 0.3), -(waist + 1), dist - mW * 0.65 + bW * 0.3 + 1, (waist + 1) * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);

  // Main fill — mother
  ctx.beginPath();
  ctx.ellipse(0, 0, mW, mH, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#3a2868";
  ctx.fill();

  // Main fill — bud
  ctx.beginPath();
  ctx.ellipse(-dist, 0, bW, bH, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#3a2868";
  ctx.fill();

  // Waist fill (cover outline gap)
  ctx.beginPath();
  ctx.rect(-(dist - bW * 0.3), -waist, dist - mW * 0.65 + bW * 0.3, waist * 2);
  ctx.fillStyle = "#3a2868";
  ctx.fill();

  // Highlight on mother cell
  ctx.beginPath();
  ctx.ellipse(-mW * 0.25, -mH * 0.3, mW * 0.45, mH * 0.35, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(80,64,160,0.55)";
  ctx.fill();

  // Highlight on bud
  ctx.beginPath();
  ctx.ellipse(-dist - bW * 0.15, -bH * 0.28, bW * 0.38, bH * 0.3, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(80,64,160,0.45)";
  ctx.fill();

  ctx.restore();
}

// Squame cluster centres (to seed yeast placement near them)
const SQUAME_CENTRES = [
  { cx: 155, cy: 175 },
  { cx: 340, cy: 140 },
  { cx: 255, cy: 290 },
  { cx: 130, cy: 355 },
  { cx: 380, cy: 310 },
  { cx: 310, cy: 420 },
];

function inCircle(x, y, pad = 18) {
  const dx = x - R, dy = y - R;
  return dx * dx + dy * dy <= (R - pad) * (R - pad);
}

function drawYeastLayer(ctx, rng) {
  const organisms = [];

  // 60% clustered near squames
  const clusterCount = 28;
  SQUAME_CENTRES.forEach(({ cx, cy }) => {
    const n = 3 + Math.floor(rng() * 5); // 3–7 per squame
    for (let i = 0; i < n && organisms.length < clusterCount; i++) {
      const r = 25 + rng() * 55;
      const a = rng() * Math.PI * 2;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      if (inCircle(x, y)) {
        organisms.push({ x, y, angle: rng() * 360, scale: 0.82 + rng() * 0.38 });
      }
    }
  });

  // 40% scattered
  let attempts = 0;
  while (organisms.length < 48 && attempts < 600) {
    attempts++;
    const x = 30 + rng() * (SIZE - 60);
    const y = 30 + rng() * (SIZE - 60);
    if (inCircle(x, y)) {
      organisms.push({ x, y, angle: rng() * 360, scale: 0.78 + rng() * 0.42 });
    }
  }

  organisms.forEach(({ x, y, angle, scale }) => drawYeast(ctx, x, y, angle, scale));
}

function drawCocci(ctx, rng) {
  // Sparse bacterial cocci
  const yeastZones = SQUAME_CENTRES.slice(0, 4);
  let count = 0;
  let attempts = 0;

  while (count < 13 && attempts < 400) {
    attempts++;
    const nearYeast = rng() < 0.7;
    let x, y;
    if (nearYeast) {
      const z = yeastZones[Math.floor(rng() * yeastZones.length)];
      const r = 10 + rng() * 70;
      const a = rng() * Math.PI * 2;
      x = z.cx + Math.cos(a) * r;
      y = z.cy + Math.sin(a) * r;
    } else {
      x = 40 + rng() * (SIZE - 80);
      y = 40 + rng() * (SIZE - 80);
    }
    if (!inCircle(x, y, 22)) continue;

    const paired = count < 4 && rng() < 0.5;
    const radius = 1.5 + rng() * 1;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#180f38";
    ctx.fill();

    if (paired) {
      const pa = rng() * Math.PI * 2;
      const px = x + Math.cos(pa) * (radius * 2.1);
      const py = y + Math.sin(pa) * (radius * 2.1);
      if (inCircle(px, py, 22)) {
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
        count++;
      }
    }
    count++;
  }
}

function drawLabels(ctx) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(R, R, R, 0, Math.PI * 2);
  ctx.clip();

  ctx.font = "bold 11px 'Courier New', monospace";
  ctx.fillStyle = "rgba(255,255,255,0.88)";

  // Top left: magnification
  ctx.fillText("×50 oil", 16, 22);

  // Top right: stain
  const stainW = ctx.measureText("Diff-Quik").width;
  ctx.fillText("Diff-Quik", SIZE - stainW - 14, 22);

  // Scale bar bottom right — represents 10 µm at ×50
  // At ×50, 10 µm ≈ 28px (realistic approximation)
  const barLen = 28;
  const barX = SIZE - 20 - barLen;
  const barY = SIZE - 22;
  ctx.beginPath();
  ctx.moveTo(barX, barY);
  ctx.lineTo(barX + barLen, barY);
  ctx.strokeStyle = "rgba(255,255,255,0.88)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(barX, barY - 4);
  ctx.lineTo(barX, barY + 4);
  ctx.moveTo(barX + barLen, barY - 4);
  ctx.lineTo(barX + barLen, barY + 4);
  ctx.stroke();

  ctx.font = "10px 'Courier New', monospace";
  const labelW = ctx.measureText("10 μm").width;
  ctx.fillStyle = "rgba(255,255,255,0.88)";
  ctx.fillText("10 μm", barX + barLen / 2 - labelW / 2, barY - 6);

  ctx.restore();
}

export default function MicroscopyRenderer() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rng = seededRng(0xdeadbeef);

    // Clear
    ctx.clearRect(0, 0, SIZE, SIZE);

    // Black surround (entire canvas)
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Clip to circle for all slide content
    ctx.save();
    ctx.beginPath();
    ctx.arc(R, R, R - 1, 0, Math.PI * 2);
    ctx.clip();

    // Base background — pale pink-purple
    ctx.fillStyle = "#e0ccda";
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Noise texture (before squames)
    drawNoise(ctx, R, rng);

    // Squames (background layer)
    drawSquames(ctx, rng);

    // Yeast organisms (on top of squames)
    drawYeastLayer(ctx, rng);

    // Cocci (bacteria)
    drawCocci(ctx, rng);

    ctx.restore(); // end circle clip

    // Vignette overlay (inside circle only)
    drawVignette(ctx);

    // Labels (inside circle clip, drawn last)
    drawLabels(ctx);

  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, margin: "10px 0 4px" }}>
      <canvas
        ref={canvasRef}
        width={SIZE}
        height={SIZE}
        style={{
          width: SIZE,
          height: SIZE,
          borderRadius: "50%",
          display: "block",
          boxShadow: "0 0 0 6px #000, 0 4px 24px rgba(0,0,0,0.55)",
        }}
      />
      <p style={{
        fontSize: 11,
        color: "var(--color-text-secondary)",
        textAlign: "center",
        maxWidth: 420,
        lineHeight: 1.55,
        margin: 0,
        fontStyle: "italic",
      }}>
        Abundant yeast organisms with broad-based monopolar budding. Cells visible in clusters and adhered to squamous epithelium.
      </p>
    </div>
  );
}
