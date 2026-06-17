// Drawer.js — interaction shell for the exam room: the canvas scaler, clickable
// Hotspot wrapper, owner/nurse speech Bubble, bottom TabBar, and the slide-up
// supply Drawer that hosts the existing consultation panels. Ported from the
// design prototype (room-scene.jsx / room-panels.jsx) to use the app's own Icon.
import { useState, useEffect } from "react";
import { Icon } from "../ui/DesignKit";

const CANVAS_W = 1280, CANVAS_H = 800;

// the eight room actions → app tab ids (id === App's activeTab value).
// "history" renders HistoryChartPanel from the case `chart` object (built).
// "stabilize" renders TreatmentPanel filtered to setting === "stabilize".
export const NAV = [
  { id: "exam",          label: "Examine",      icon: "stethoscope" },
  { id: "ask",           label: "Ask owner",    icon: "chat" },
  { id: "history",       label: "Chart",        icon: "monitor" },
  { id: "diag",          label: "Diagnostics",  icon: "microscope" },
  { id: "dx",            label: "Differentials", icon: "list" },
  { id: "treat_clinic",  label: "Injectables",  icon: "syringe" },
  { id: "treat_rx",      label: "Oral meds",    icon: "pill" },
  { id: "disposition",   label: "Disposition",  icon: "door" },
];

export function useScale() {
  const [sc, setSc] = useState(1);
  useEffect(() => {
    const f = () => {
      const w = window.innerWidth || CANVAS_W, h = window.innerHeight || CANVAS_H;
      const next = Math.min(w / CANVAS_W, h / CANVAS_H);
      if (next > 0) setSc(next);
    };
    f();
    const id = requestAnimationFrame(f);
    window.addEventListener("resize", f);
    return () => { window.removeEventListener("resize", f); cancelAnimationFrame(id); };
  }, []);
  return sc;
}

// once-injected keyframes used by the room art (bob/pulse/fade/dust)
export function RoomKeyframes() {
  return (
    <style>{`
      @keyframes rmBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
      @keyframes rmPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(196,98,62,0.4); } 50% { box-shadow: 0 0 0 6px rgba(196,98,62,0); } }
      @keyframes rmFade { from { opacity: 0.5; } to { opacity: 1; } }
      @keyframes rmDust { 0% { transform: translateY(0); opacity: 0; } 20% { opacity: 0.9; } 100% { transform: translateY(-60px); opacity: 0; } }
    `}</style>
  );
}

export function Bubble({ side = "left", label, tone = "tech", children }) {
  const owner = tone === "owner";
  return (
    <div style={{ position: "relative", maxWidth: 270, padding: "11px 14px", borderRadius: 16,
      borderBottomLeftRadius: side === "left" ? 4 : 16, borderBottomRightRadius: side === "right" ? 4 : 16,
      background: owner ? "var(--color-background-info)" : "var(--color-background-primary)",
      border: `1px solid ${owner ? "var(--color-border-info)" : "var(--color-border-secondary)"}`,
      boxShadow: "var(--ds-shadow-card)" }}>
      {label && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase",
            color: owner ? "var(--color-text-info)" : "var(--color-text-secondary)" }}>{label}</span>
        </div>
      )}
      <div style={{ fontSize: 13.5, lineHeight: 1.5, color: "var(--color-text-primary)", textWrap: "pretty" }}>{children}</div>
    </div>
  );
}

export function Hotspot({ box, label, icon, active, onClick, z = 14, labelSide = "top", children }) {
  const [hov, setHov] = useState(false);
  const { x, y, w, h } = box;
  const lp = labelSide === "top"
    ? { bottom: "calc(100% + 12px)", left: "50%", transform: "translateX(-50%)" }
    : { top: "calc(100% + 12px)", left: "50%", transform: "translateX(-50%)" };
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ position: "absolute", left: x, top: y, width: w, height: h, cursor: "pointer", zIndex: z }}>
      {children}
      <div style={{ position: "absolute", inset: -5, borderRadius: 16, pointerEvents: "none", transition: "box-shadow .15s",
        boxShadow: active ? "0 0 0 3px var(--ds-accent), 0 0 26px rgba(196,98,62,0.4)" : hov ? "0 0 0 3px var(--ds-accent-soft)" : "none" }} />
      <div style={{ position: "absolute", top: -11, right: -11, width: 25, height: 25, borderRadius: "50%", zIndex: 3,
        background: active ? "var(--ds-accent)" : "var(--color-background-primary)", color: active ? "#fff" : "var(--ds-accent)",
        border: "2px solid var(--ds-accent)", display: "grid", placeItems: "center", boxShadow: "var(--ds-shadow-card)",
        animation: active ? "none" : "rmBob 2.6s ease-in-out infinite" }}>
        <Icon name={icon} size={13} stroke={2.4} />
      </div>
      {hov && (
        <div style={{ position: "absolute", ...lp, whiteSpace: "nowrap", padding: "6px 12px", borderRadius: 10, zIndex: 4,
          background: "rgba(46,38,32,0.92)", color: "#FBEDE6", fontSize: 12.5, fontWeight: 700, boxShadow: "var(--ds-shadow-pop)", pointerEvents: "none" }}>
          {label}
        </div>
      )}
    </div>
  );
}

export function TabBar({ navId, onNav, patientName, patientSub, hud }) {
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 84, zIndex: 60,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(180deg, rgba(58,40,22,0), rgba(40,26,14,0.6))" }}>
      <div style={{ position: "absolute", left: 22, bottom: 14, display: "flex", alignItems: "center", gap: 9, padding: "6px 13px 6px 7px",
        borderRadius: 13, background: "rgba(255,253,249,0.94)", border: "1px solid var(--color-border-secondary)", boxShadow: "var(--ds-shadow-card)" }}>
        <span style={{ width: 32, height: 32, borderRadius: 9, background: "var(--ds-accent)", color: "#fff", display: "grid", placeItems: "center" }}><Icon name="paw" size={18} stroke={2.2} /></span>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 13.5, fontWeight: 700, color: "var(--color-text-primary)", lineHeight: 1 }}>{patientName || "Patient"}</div>
          <div style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>{patientSub}</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 10px", borderRadius: 17,
        background: "linear-gradient(180deg,#E8ECED,#C2C8CA)", border: "1px solid #AAB1B4",
        boxShadow: "0 10px 24px rgba(40,22,10,0.4), inset 0 2px 3px rgba(255,255,255,0.7)" }}>
        {NAV.map(n => {
          const on = navId === n.id;
          return (
            <button key={n.id} onClick={() => onNav(n.id)} title={n.label}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, width: 70, padding: "7px 4px 5px", borderRadius: 11, cursor: "pointer",
                background: on ? "var(--ds-accent)" : "rgba(255,255,255,0.5)", border: `1px solid ${on ? "var(--ds-accent-hover)" : "rgba(140,123,104,0.22)"}`,
                color: on ? "#fff" : "var(--color-text-secondary)", fontFamily: "var(--font-sans)", transition: "transform .12s, background .15s",
                transform: on ? "translateY(-2px)" : "none", boxShadow: on ? "0 6px 14px rgba(196,98,62,0.4)" : "none" }}>
              <Icon name={n.icon} size={19} stroke={2.1} />
              <span style={{ fontSize: 10, fontWeight: 700 }}>{n.label}</span>
            </button>
          );
        })}
      </div>
      {hud && (
        <div style={{ position: "absolute", right: 22, bottom: 14, display: "flex", gap: 7 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 11, background: "rgba(255,253,249,0.94)", border: "1px solid var(--color-border-secondary)", fontSize: 11.5, fontWeight: 700, color: "var(--color-text-primary)", boxShadow: "var(--ds-shadow-card)" }}>
            <span style={{ color: "var(--color-text-success)" }}><Icon name="check" size={13} stroke={2.4} /></span>{hud.exams}/12
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 11, background: "rgba(255,253,249,0.94)", border: "1px solid var(--color-border-secondary)", fontSize: 11.5, fontWeight: 700, color: "var(--color-text-primary)", boxShadow: "var(--ds-shadow-card)" }}>
            <span style={{ color: "var(--color-text-warning)" }}><Icon name="flask" size={13} stroke={2.2} /></span>{hud.spend}
          </span>
        </div>
      )}
    </div>
  );
}

// slide-up supply drawer that hosts a consultation panel as its body.
// Body is a flex column that lets the hosted panel manage its own scroll.
export function Drawer({ title, sub, icon, onClose, accent = "var(--ds-accent)", children, footer }) {
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 88, top: 232, zIndex: 40, display: "flex", flexDirection: "column" }}>
      <div onClick={onClose} style={{ position: "absolute", left: 0, right: 0, top: -232, height: 232, background: "rgba(30,18,8,0.28)", cursor: "pointer" }} />
      <div style={{ flex: 1, minHeight: 0, margin: "0 26px", borderRadius: "20px", overflow: "hidden", display: "flex", flexDirection: "column",
        background: "linear-gradient(180deg,#FFFDF9,#F7F0E5)", border: "1px solid var(--color-border-secondary)",
        boxShadow: "0 -16px 40px rgba(40,22,10,0.28)" }}>
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 8 }}>
          <div style={{ width: 44, height: 5, borderRadius: 99, background: "var(--color-border-secondary)" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 22px 12px", borderBottom: "1px solid var(--color-border-tertiary)", flexShrink: 0 }}>
          <span style={{ width: 38, height: 38, borderRadius: 11, display: "grid", placeItems: "center", background: "var(--ds-accent-soft)", color: accent }}>
            <Icon name={icon} size={21} stroke={2.2} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 700, color: "var(--color-text-primary)" }}>{title}</div>
            <div style={{ fontSize: 12.5, color: "var(--color-text-secondary)" }}>{sub}</div>
          </div>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: 10, border: "1px solid var(--color-border-secondary)", background: "var(--color-background-primary)", color: "var(--color-text-secondary)", cursor: "pointer", display: "grid", placeItems: "center" }}>
            <Icon name="close" size={18} stroke={2.2} />
          </button>
        </div>
        <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>{children}</div>
        {footer && <div style={{ padding: "12px 22px", borderTop: "1px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)", flexShrink: 0 }}>{footer}</div>}
      </div>
    </div>
  );
}
