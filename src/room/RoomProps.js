// RoomProps.js — exam-room backdrop + fixed scenery, ported from the design
// prototype (room-props.jsx) as ES module exports. Presentation only — no logic.
import React, { useMemo } from "react";
import { Icon } from "../ui/DesignKit";

// ── time-of-day light presets (drives wall warmth + window glow) ──
export const TOD = {
  afternoon: { wallTop: "#F6ECDA", wallBot: "#EADBC2", glow: "#FBE7C2", sky1: "#CFE2EA", sky2: "#EAD7BD", floor: "#C9A878", spill: "rgba(251,224,170,0.55)" },
  morning:   { wallTop: "#F8F1E6", wallBot: "#EEE2CF", glow: "#FCF4E2", sky1: "#DCEAF0", sky2: "#F1E8D6", floor: "#CDB084", spill: "rgba(252,246,228,0.5)"  },
  evening:   { wallTop: "#EBD9C2", wallBot: "#D8BE9F", glow: "#F4C588", sky1: "#E7B989", sky2: "#C98D63", floor: "#B68E60", spill: "rgba(244,182,120,0.55)" },
};

export function RoomBackdrop({ tod = "afternoon" }) {
  const c = TOD[tod] || TOD.afternoon;
  const floorY = 462;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: floorY,
        background: `linear-gradient(176deg, ${c.wallTop} 0%, ${c.wallBot} 100%)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: floorY - 86, height: 86,
        background: "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(120,85,50,0.06))",
        borderTop: "1px solid rgba(120,85,50,0.10)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: floorY - 4, height: 8,
        background: "linear-gradient(180deg, #B79468, #9C7A52)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: floorY, bottom: 0,
        background: `linear-gradient(180deg, ${c.floor} 0%, #9C7A52 60%, #835F3D 100%)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: floorY, bottom: 0,
        background: "radial-gradient(120% 80% at 50% 0%, rgba(255,240,210,0.35), rgba(0,0,0,0) 55%)" }} />
      <div style={{ position: "absolute", right: -40, top: -60, width: 760, height: 740,
        background: `radial-gradient(circle at 70% 35%, ${c.spill} 0%, rgba(0,0,0,0) 62%)`,
        mixBlendMode: "screen", pointerEvents: "none" }} />
      <div style={{ position: "absolute", left: -120, top: -40, width: 560, height: 640,
        background: "radial-gradient(circle at 30% 30%, rgba(150,170,190,0.16), rgba(0,0,0,0) 60%)",
        pointerEvents: "none" }} />
    </div>
  );
}

export function ClinicWindow({ tod = "afternoon" }) {
  const c = TOD[tod] || TOD.afternoon;
  return (
    <div style={{ position: "absolute", right: 46, top: 46, width: 250, height: 300 }}>
      <div style={{ position: "absolute", inset: "-14px -16px", borderRadius: 22, background: "rgba(90,60,35,0.10)", filter: "blur(8px)" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: 16, background: "linear-gradient(180deg,#FBF6EE,#E7D8C2)",
        boxShadow: "inset 0 2px 4px rgba(255,255,255,0.7), 0 8px 22px rgba(90,60,35,0.16)", padding: 12 }}>
        <div style={{ position: "absolute", inset: 12, borderRadius: 9, overflow: "hidden",
          background: `linear-gradient(180deg, ${c.sky1} 0%, ${c.sky2} 100%)` }}>
          <div style={{ position: "absolute", left: -20, right: -20, bottom: -20, height: 110, borderRadius: "50%",
            background: "rgba(120,150,110,0.45)", filter: "blur(6px)" }} />
          <div style={{ position: "absolute", left: 40, right: -60, bottom: -30, height: 100, borderRadius: "50%",
            background: "rgba(95,130,95,0.5)", filter: "blur(7px)" }} />
          <div style={{ position: "absolute", right: 22, top: 24, width: 84, height: 84, borderRadius: "50%",
            background: `radial-gradient(circle, ${c.glow} 0%, rgba(255,255,255,0) 70%)` }} />
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 70% 40%, ${c.spill}, rgba(255,255,255,0) 65%)`, mixBlendMode: "screen" }} />
        </div>
        <div style={{ position: "absolute", left: "50%", top: 12, bottom: 12, width: 9, transform: "translateX(-50%)", background: "linear-gradient(90deg,#F6EEE1,#DCC9AE)", borderRadius: 3 }} />
        <div style={{ position: "absolute", top: "50%", left: 12, right: 12, height: 9, transform: "translateY(-50%)", background: "linear-gradient(180deg,#F6EEE1,#DCC9AE)", borderRadius: 3 }} />
      </div>
      <div style={{ position: "absolute", left: -30, top: 290, width: 320, height: 320,
        background: `linear-gradient(160deg, ${c.spill} 0%, rgba(255,255,255,0) 60%)`,
        transform: "skewX(-26deg)", transformOrigin: "top", mixBlendMode: "screen", pointerEvents: "none", filter: "blur(4px)" }} />
    </div>
  );
}

export function BackCounter() {
  const topY = 360, gapL = 560, gapR = 760;
  const seg = (left, width, key) => (
    <React.Fragment key={key}>
      <div style={{ position: "absolute", left, top: topY + 14, width, height: 462 - topY - 14,
        background: "linear-gradient(180deg,#B98E5F 0%,#9E744A 100%)" }}>
        <div style={{ position: "absolute", left: width * 0.5, top: 8, bottom: 6, width: 2, background: "rgba(60,38,18,0.3)" }} />
      </div>
      <div style={{ position: "absolute", left: left - 6, top: topY, width: width + 12, height: 18,
        background: "linear-gradient(180deg,#F3ECDF,#D9C7AC)", boxShadow: "0 5px 10px rgba(60,38,18,0.22)" }} />
    </React.Fragment>
  );
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 338 }}>
      {seg(120, gapL - 120, "l")}
      {seg(gapR, 980 - gapR, "r")}
    </div>
  );
}

export function VetTechFigure() {
  return (
    <div style={{ position: "absolute", left: 1016, top: 232, width: 128, height: 262 }}>
      <svg width="128" height="262" viewBox="0 0 128 262" style={{ display: "block", overflow: "visible" }}>
        <ellipse cx="64" cy="252" rx="42" ry="10" fill="rgba(40,22,10,0.20)" />
        <rect x="46" y="170" width="16" height="82" rx="6" fill="#2F6F67" />
        <rect x="66" y="170" width="16" height="82" rx="6" fill="#2F6F67" />
        <path d="M42 248h22v6q0 5-6 5H40q-5 0-2-6Z" fill="#EDEDE8" />
        <path d="M86 248H64v6q0 5 6 5h18q5 0 2-6Z" fill="#EDEDE8" />
        <path d="M40 98q24-11 48 0l8 78q-32 12-64 0Z" fill="#3E8E84" />
        <path d="M64 98v78" stroke="rgba(0,0,0,0.10)" strokeWidth="2" />
        <path d="M40 102q-13 30-9 66l13 3q-2-36 8-64Z" fill="#3E8E84" />
        <path d="M88 102q13 30 9 66l-13 3q2-36-8-64Z" fill="#3E8E84" />
        <ellipse cx="40" cy="172" rx="7" ry="6" fill="#CDA074" />
        <ellipse cx="88" cy="172" rx="7" ry="6" fill="#CDA074" />
        <rect x="57" y="78" width="14" height="24" rx="6" fill="#CDA074" />
        <ellipse cx="64" cy="56" rx="24" ry="26" fill="#CDA074" />
        <path d="M38 60q-4-40 26-40t26 40q-3-22-9-28 4 10 3 22-8-18-20-18t-20 18q-1-12 3-22-6 6-9 28Z" fill="#2A2320" />
        <circle cx="64" cy="15" r="9" fill="#2A2320" />
        <path d="M40 56q-5 10-3 22M88 56q5 10 3 22" stroke="#2A2320" strokeWidth="5" fill="none" strokeLinecap="round" />
        <circle cx="56" cy="56" r="2.6" fill="#241E1A" />
        <circle cx="72" cy="56" r="2.6" fill="#241E1A" />
        <path d="M51 50q4-3 8-1M65 49q4-2 8 1" stroke="#2A2320" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M58 66q6 4 12 0" stroke="#241E1A" strokeWidth="2" fill="none" strokeLinecap="round" />
        <rect x="74" y="116" width="11" height="15" rx="2" fill="#EDEDE8" stroke="#2F6F67" strokeWidth="1" />
      </svg>
    </div>
  );
}

// flea/tick prevention poster (fallback art if the image asset is absent)
export function FleaPoster() {
  return (
    <div style={{ position: "absolute", inset: 0, borderRadius: 8, background: "linear-gradient(180deg,#FFFDF8,#F1E7D6)", border: "6px solid #E8D9C0", boxShadow: "0 10px 24px rgba(90,60,35,0.18)", overflow: "hidden", padding: "12px 10px" }}>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 11, fontWeight: 800, letterSpacing: "0.04em", color: "var(--ds-good)", textAlign: "center", lineHeight: 1.1 }}>PROTECT<br/>YEAR-ROUND</div>
      <div style={{ display: "grid", placeItems: "center", margin: "10px 0" }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--color-background-success)", border: "2px solid var(--ds-good)", display: "grid", placeItems: "center", color: "var(--ds-good)" }}>
          <Icon name="bug" size={26} stroke={2} />
        </div>
      </div>
      <div style={{ fontSize: 8.5, fontWeight: 700, color: "var(--color-text-secondary)", textAlign: "center", letterSpacing: "0.02em" }}>FLEA · TICK · WORM</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3, marginTop: 8 }}>
        {[70, 88, 60].map((w, i) => <div key={i} style={{ height: 3, width: `${w}%`, borderRadius: 2, background: "rgba(140,123,104,0.34)" }} />)}
      </div>
    </div>
  );
}

export function SharpsBin() {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, top: "20%", borderRadius: 3, background: "linear-gradient(180deg,#D6452F,#B3331F)", boxShadow: "0 6px 14px rgba(90,30,20,0.3)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: "16%", right: "16%", top: "24%", height: "44%", borderRadius: 2, background: "rgba(255,253,249,0.92)", display: "grid", placeItems: "center" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 6, fontWeight: 800, color: "#B3331F", letterSpacing: "0.04em" }}>SHARPS</span>
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,0.16), rgba(255,255,255,0) 40%)" }} />
      </div>
      <div style={{ position: "absolute", left: "-6%", right: "-6%", top: 0, height: "26%", borderRadius: "5px 5px 0 0", background: "linear-gradient(180deg,#E88B7A,#D6452F)" }} />
      <div style={{ position: "absolute", left: "28%", right: "28%", top: "9%", height: "7%", borderRadius: 2, background: "rgba(80,20,12,0.55)" }} />
    </div>
  );
}

export function CounterSink() {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", left: "16%", top: "38%", width: 7, height: "30%", borderRadius: 3, background: "linear-gradient(90deg,#8A9194,#C2C8CA,#8A9194)" }} />
      <div style={{ position: "absolute", left: "16%", top: "30%", width: "30%", height: 7, borderRadius: 4, background: "linear-gradient(90deg,#C2C8CA,#9AA1A4)" }} />
      <div style={{ position: "absolute", left: "44%", top: "32%", width: 7, height: "18%", borderRadius: 3, background: "linear-gradient(90deg,#9AA1A4,#8A9194)" }} />
      <div style={{ position: "absolute", left: "4%", top: "44%", width: 16, height: 6, borderRadius: 3, background: "#9AA1A4" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: "56%", bottom: 0, borderRadius: "8px 8px 11px 11px", background: "linear-gradient(180deg,#9CA3A6,#C2C8CA)", boxShadow: "inset 0 5px 9px rgba(0,0,0,0.4), inset 0 -2px 3px rgba(255,255,255,0.45)" }}>
        <div style={{ position: "absolute", left: "46%", top: "44%", width: 8, height: 6, borderRadius: "50%", background: "rgba(40,44,46,0.6)" }} />
      </div>
    </div>
  );
}

export function SoapDispenser() {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", left: "18%", right: "18%", top: 0, height: "74%", borderRadius: 5, background: "linear-gradient(180deg,#FBF6EE,#E6D9C4)", boxShadow: "0 5px 12px rgba(90,60,35,0.18)", border: "1px solid #D8C7AC" }}>
        <div style={{ position: "absolute", left: "26%", right: "26%", top: "16%", bottom: "32%", borderRadius: 2, background: "linear-gradient(180deg,rgba(207,224,234,0.55),#9FBFCB)" }} />
      </div>
      <div style={{ position: "absolute", left: "36%", right: "36%", top: "72%", height: "12%", background: "#CDBC9E", borderRadius: "0 0 2px 2px" }} />
      <div style={{ position: "absolute", left: "44%", right: "44%", top: "82%", height: "12%", borderRadius: 2, background: "#B5A284" }} />
    </div>
  );
}

export function PaperTowelDispenser() {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", left: "8%", right: "8%", top: 0, bottom: "16%", borderRadius: 5, background: "linear-gradient(180deg,#EFEFEC,#D5D5CF)", border: "1px solid #C7C7C0", boxShadow: "0 5px 12px rgba(90,60,35,0.16)" }}>
        <div style={{ position: "absolute", left: "22%", right: "22%", top: "22%", height: 3, borderRadius: 2, background: "rgba(120,120,115,0.4)" }} />
        <div style={{ position: "absolute", left: "30%", right: "30%", top: "44%", height: 2, borderRadius: 1, background: "rgba(120,120,115,0.3)" }} />
      </div>
      <div style={{ position: "absolute", left: "22%", right: "22%", bottom: "14%", height: 4, borderRadius: 2, background: "#3A3A36" }} />
      <div style={{ position: "absolute", left: "30%", right: "30%", bottom: 0, height: "15%", background: "#FFFFFF", borderRadius: "0 0 2px 2px", boxShadow: "0 2px 3px rgba(0,0,0,0.12)" }} />
    </div>
  );
}

export function WallStethoscope() {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <svg width="100%" height="100%" viewBox="0 0 44 150" preserveAspectRatio="xMidYMin meet" style={{ display: "block", overflow: "visible" }}>
        <path d="M20 3h3q5 0 5 7" stroke="#9AA1A4" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <circle cx="20" cy="3" r="2" fill="#7E8488" />
        <path d="M10 25q12 -17 24 0" stroke="#C2C8CB" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="9" cy="27" r="2.4" fill="#2A2D31" />
        <circle cx="35" cy="27" r="2.4" fill="#2A2D31" />
        <path d="M11 28q2 28 11 36" stroke="#23262A" strokeWidth="1.9" fill="none" strokeLinecap="round" />
        <path d="M33 28q-2 28 -11 36" stroke="#23262A" strokeWidth="1.9" fill="none" strokeLinecap="round" />
        <path d="M22 63q-7 30 -3 52" stroke="#23262A" strokeWidth="2.3" fill="none" strokeLinecap="round" />
        <g transform="translate(19 128)">
          <circle r="10" fill="#3C4045" stroke="#23262A" strokeWidth="1.5" />
          <circle r="6.5" fill="#AEB4B8" />
          <circle r="6.5" fill="none" stroke="#7E8488" strokeWidth="1" />
        </g>
      </svg>
    </div>
  );
}

export function DustMotes() {
  const motes = useMemo(() => Array.from({ length: 9 }, () => ({
    left: 860 + Math.random() * 320, top: 180 + Math.random() * 240,
    size: 2 + Math.random() * 3, delay: Math.random() * 6, dur: 6 + Math.random() * 5,
  })), []);
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {motes.map((m, i) => (
        <span key={i} style={{ position: "absolute", left: m.left, top: m.top, width: m.size, height: m.size, borderRadius: "50%",
          background: "rgba(255,240,200,0.9)", boxShadow: "0 0 4px rgba(255,235,190,0.8)",
          animation: `rmDust ${m.dur}s linear ${m.delay}s infinite` }} />
      ))}
    </div>
  );
}

export function Vignette() {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
      boxShadow: "inset 0 0 140px 40px rgba(40,22,10,0.32), inset 0 -40px 80px rgba(40,22,10,0.18)" }} />
  );
}
