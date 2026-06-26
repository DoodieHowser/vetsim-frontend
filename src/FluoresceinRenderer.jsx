import { useEffect, useRef } from "react";

const SIZE = 400;
const CX = 200;
const CY = 200;

export default function FluoresceinRenderer({ result = "negative" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, SIZE, SIZE);

    // Black surround (entire canvas — circular clip will reveal eye content)
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, SIZE, SIZE);

    // Clip to circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(CX, CY, SIZE / 2 - 1, 0, Math.PI * 2);
    ctx.clip();

    // Background — dark cobalt blue simulating UV/cobalt-blue illumination
    ctx.fillStyle = "rgb(10, 20, 80)";
    ctx.fillRect(0, 0, SIZE, SIZE);

    // --- 1. EYELID MARGINS (drawn first, behind all eye contents) ---
    const eyelidColor = "rgb(60, 30, 25)";
    // Upper eyelid: fill region above arc (20,170)→peak(200,60)→(380,170)
    ctx.beginPath();
    ctx.moveTo(20, 170);
    ctx.bezierCurveTo(20, 60, 380, 60, 380, 170);
    ctx.lineTo(400, 170);
    ctx.lineTo(400, 0);
    ctx.lineTo(0, 0);
    ctx.lineTo(0, 170);
    ctx.closePath();
    ctx.fillStyle = eyelidColor;
    ctx.fill();
    // Lower eyelid: fill region below arc (20,240)→dip(200,310)→(380,240)
    ctx.beginPath();
    ctx.moveTo(20, 240);
    ctx.bezierCurveTo(20, 310, 380, 310, 380, 240);
    ctx.lineTo(400, 240);
    ctx.lineTo(400, 400);
    ctx.lineTo(0, 400);
    ctx.lineTo(0, 240);
    ctx.closePath();
    ctx.fillStyle = eyelidColor;
    ctx.fill();
    // Eyelid margin lines
    ctx.strokeStyle = "rgba(90, 45, 35, 0.7)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(20, 170);
    ctx.bezierCurveTo(20, 60, 380, 60, 380, 170);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(20, 240);
    ctx.bezierCurveTo(20, 310, 380, 310, 380, 240);
    ctx.stroke();

    // Sclera — large, slightly off-white/pale bluish ellipse
    ctx.beginPath();
    ctx.ellipse(CX, CY, 180, 150, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgb(218, 222, 238)";
    ctx.fill();

    // --- 2. CONJUNCTIVA — thin pink-tinted rim just outside sclera ---
    ctx.beginPath();
    ctx.ellipse(CX, CY, 188, 158, 0, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(210, 170, 170, 0.4)";
    ctx.lineWidth = 8;
    ctx.stroke();

    // Iris — dark brown ellipse
    ctx.beginPath();
    ctx.ellipse(CX, CY, 100, 100, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#3d2008";
    ctx.fill();

    // Iris radial texture — thin lines from inner to outer edge
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(CX + Math.cos(angle) * 22, CY + Math.sin(angle) * 22);
      ctx.lineTo(CX + Math.cos(angle) * 98, CY + Math.sin(angle) * 98);
      ctx.strokeStyle = "rgba(90, 45, 8, 0.45)";
      ctx.lineWidth = 0.7;
      ctx.stroke();
    }

    // --- 4a. Collarette ring at radius ~60 ---
    ctx.beginPath();
    ctx.arc(CX, CY, 60, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(110, 65, 20, 0.5)";
    ctx.lineWidth = 3;
    ctx.stroke();

    // --- 4b. 12 shorter outer-iris radial lines (radius 65–96), offset between existing ---
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + Math.PI / 24;
      ctx.beginPath();
      ctx.moveTo(CX + Math.cos(angle) * 65, CY + Math.sin(angle) * 65);
      ctx.lineTo(CX + Math.cos(angle) * 96, CY + Math.sin(angle) * 96);
      ctx.strokeStyle = "rgba(120, 70, 15, 0.3)";
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // --- 4c. Subtle iris color variation blobs ---
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const blobR = 45 + (i % 3) * 20;
      const bx = CX + Math.cos(angle) * blobR;
      const by = CY + Math.sin(angle) * blobR;
      const blobGrad = ctx.createRadialGradient(bx, by, 0, bx, by, 18);
      blobGrad.addColorStop(0, "rgba(90, 50, 10, 0.15)");
      blobGrad.addColorStop(1, "rgba(90, 50, 10, 0)");
      ctx.fillStyle = blobGrad;
      ctx.beginPath();
      ctx.arc(bx, by, 18, 0, Math.PI * 2);
      ctx.fill();
    }

    // Pupil — black
    ctx.beginPath();
    ctx.ellipse(CX, CY, 45, 45, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#000";
    ctx.fill();

    // --- 3. CORNEAL SURFACE SHEEN — subtle blue-white overlay on iris/cornea ---
    const sheenGrad = ctx.createRadialGradient(CX, CY, 0, CX, CY, 100);
    sheenGrad.addColorStop(0, "rgba(180, 210, 255, 0.12)");
    sheenGrad.addColorStop(1, "rgba(180, 210, 255, 0)");
    ctx.fillStyle = sheenGrad;
    ctx.beginPath();
    ctx.ellipse(CX, CY, 100, 100, 0, 0, Math.PI * 2);
    ctx.fill();

    // Corneal highlight — soft white-blue, upper-left quadrant, always present
    const hlX = CX - 42, hlY = CY - 42;
    const hlGrad = ctx.createRadialGradient(hlX, hlY, 1, hlX, hlY, 28);
    hlGrad.addColorStop(0, "rgba(215, 235, 255, 0.9)");
    hlGrad.addColorStop(0.55, "rgba(200, 220, 255, 0.4)");
    hlGrad.addColorStop(1, "rgba(200, 220, 255, 0)");
    ctx.fillStyle = hlGrad;
    ctx.beginPath();
    ctx.ellipse(hlX, hlY, 25, 15, -0.4, 0, Math.PI * 2);
    ctx.fill();

    // --- 7. SECOND SPECULAR POINT — sharper primary reflection ---
    const sp2Grad = ctx.createRadialGradient(CX - 38, CY - 38, 0, CX - 38, CY - 38, 10);
    sp2Grad.addColorStop(0, "rgba(255, 255, 255, 0.7)");
    sp2Grad.addColorStop(0.6, "rgba(255, 255, 255, 0.7)");
    sp2Grad.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = sp2Grad;
    ctx.beginPath();
    ctx.arc(CX - 38, CY - 38, 10, 0, Math.PI * 2);
    ctx.fill();

    // --- 5. LIMBAL RING — always drawn, style varies by result ---
    ctx.beginPath();
    ctx.ellipse(CX, CY, 103, 103, 0, 0, Math.PI * 2);
    ctx.strokeStyle = result === "negative" ? "rgba(180, 200, 240, 0.3)" : "rgba(180, 200, 240, 0.15)";
    ctx.lineWidth = result === "negative" ? 5 : 4;
    ctx.stroke();

    // --- 6. NEGATIVE RESULT ENHANCEMENT — faint cobalt-blue corneal sheen ---
    if (result === "negative") {
      ctx.beginPath();
      ctx.ellipse(CX, CY, 98, 98, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(100, 140, 255, 0.08)";
      ctx.fill();
    }

    if (result === "positive") {
      // Green fluorescent uptake — inferior temporal cornea (lower-right of iris)
      const fx = CX + 52, fy = CY + 52;

      // Outer diffuse glow via radial gradient
      const grd = ctx.createRadialGradient(fx, fy, 0, fx, fy, 42);
      grd.addColorStop(0, "rgba(80, 255, 60, 0.6)");
      grd.addColorStop(0.55, "rgba(80, 255, 60, 0.2)");
      grd.addColorStop(1, "rgba(80, 255, 60, 0)");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.ellipse(fx, fy, 42, 30, 0.35, 0, Math.PI * 2);
      ctx.fill();

      // Inner bright irregular blob — not a perfect ellipse, using bezier curves
      ctx.save();
      ctx.shadowBlur = 22;
      ctx.shadowColor = "rgba(80, 255, 60, 1)";
      ctx.fillStyle = "rgba(80, 255, 60, 0.88)";
      ctx.beginPath();
      ctx.moveTo(fx + 27, fy - 4);
      ctx.bezierCurveTo(fx + 32, fy - 18, fx + 14, fy - 24, fx - 2, fy - 20);
      ctx.bezierCurveTo(fx - 20, fy - 16, fx - 28, fy - 5, fx - 25, fy + 10);
      ctx.bezierCurveTo(fx - 22, fy + 22, fx - 8, fy + 28, fx + 10, fy + 22);
      ctx.bezierCurveTo(fx + 26, fy + 15, fx + 32, fy + 8, fx + 27, fy - 4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Bright inner core
      const grd2 = ctx.createRadialGradient(fx, fy, 0, fx, fy, 18);
      grd2.addColorStop(0, "rgba(180, 255, 130, 0.95)");
      grd2.addColorStop(1, "rgba(80, 255, 60, 0)");
      ctx.fillStyle = grd2;
      ctx.beginPath();
      ctx.ellipse(fx, fy, 16, 12, 0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore(); // end circular clip

    // Vignette overlay
    const vig = ctx.createRadialGradient(CX, CY, SIZE * 0.28, CX, CY, SIZE / 2);
    vig.addColorStop(0, "rgba(0,0,0,0)");
    vig.addColorStop(1, "rgba(0,0,0,0.65)");
    ctx.fillStyle = vig;
    ctx.beginPath();
    ctx.arc(CX, CY, SIZE / 2, 0, Math.PI * 2);
    ctx.fill();

  }, [result]);

  const caption = result === "positive"
    ? "Focal area of green fluorescein uptake visible — inferior temporal cornea."
    : "No green fluorescein uptake visible.";

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      width: "100%",
      height: "100%",
      minHeight: 0,
    }}>
      <canvas
        ref={canvasRef}
        width={SIZE}
        height={SIZE}
        style={{
          flex: "1 1 0",
          minHeight: 0,
          maxHeight: SIZE,
          width: "auto",
          maxWidth: "100%",
          aspectRatio: "1 / 1",
          borderRadius: "50%",
          display: "block",
          boxShadow: "0 0 0 6px #000, 0 4px 24px rgba(0,0,0,0.55)",
        }}
      />
      <p style={{
        flexShrink: 0,
        fontSize: 11,
        color: "var(--color-text-secondary)",
        textAlign: "center",
        maxWidth: 380,
        lineHeight: 1.5,
        margin: 0,
        fontStyle: "italic",
        padding: "0 12px",
      }}>
        {caption}
      </p>
    </div>
  );
}
