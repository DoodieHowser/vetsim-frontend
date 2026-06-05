// DesignKit.js — Warm Clinic shared UI primitives, ported from the design
// prototype (ui-bits.jsx / avatars.jsx) as ES module exports. Presentation only.
import { useState } from "react";

// ── Icon set (24×24 stroke, inherits currentColor) ──
const ICON_PATHS = {
  paw: '<path d="M11 14.5c-2 0-3.5 1.3-3.9 3-.2 1 .6 1.9 1.6 1.9h4.6c1 0 1.8-.9 1.6-1.9-.4-1.7-1.9-3-3.9-3Z"/><circle cx="6.5" cy="11" r="1.6"/><circle cx="15.5" cy="11" r="1.6"/><circle cx="9" cy="7.5" r="1.6"/><circle cx="13" cy="7.5" r="1.6"/>',
  stethoscope: '<path d="M6 3v5a4 4 0 0 0 8 0V3"/><path d="M6 3H4m10 0h-2"/><path d="M10 16v1a4 4 0 0 0 8 0v-2"/><circle cx="18" cy="13" r="2"/>',
  flask: '<path d="M9 3h6M10 3v6l-5 8.5A2 2 0 0 0 6.7 21h10.6a2 2 0 0 0 1.7-3.5L14 9V3"/><path d="M7.5 15h9"/>',
  heart: '<path d="M12 20s-7-4.5-9.3-9C1 7.5 3 4.5 6.2 4.5c2 0 3.2 1.2 3.8 2.3.6-1.1 1.8-2.3 3.8-2.3 3.2 0 5.2 3 3.5 6.5C19 15.5 12 20 12 20Z"/>',
  microscope: '<path d="M6 18h10M9 18l-1-3m6 0a4 4 0 0 1-5 0"/><path d="M11 7l2-2 3 3-2 2zM9.5 8.5 13 12"/><path d="M5 21h14"/>',
  xray: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 3v18M16 3v18M4 9h16M4 15h16"/>',
  ear: '<path d="M8 18c0 1.5-1 3-3 3M9 9a3 3 0 0 1 6 0c0 2-2 2.5-2.5 4S12.5 18 11 18s-2-1.2-2-2"/><path d="M7 9a5 5 0 0 1 10 0c0 1.2-.3 2-1 3"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/>',
  lungs: '<path d="M12 4v8M9 8c0 3-2 3-2 6 0 2-1 4-2 4s-1-2-1-4 1-7 2-8 3-1 3 2ZM15 8c0 3 2 3 2 6 0 2 1 4 2 4s1-2 1-4-1-7-2-8-3-1-3 2Z"/>',
  thermometer: '<path d="M14 14V5a2 2 0 1 0-4 0v9a4 4 0 1 0 4 0Z"/><path d="M12 16v-3"/>',
  droplet: '<path d="M12 3s6 6.5 6 10.5a6 6 0 0 1-12 0C6 9.5 12 3 12 3Z"/>',
  node: '<circle cx="12" cy="12" r="3"/><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 8l2.5 2.5M16 8l-2.5 2.5"/>',
  bone: '<path d="M7 14l-1 1a2 2 0 1 1-2-2 2 2 0 1 1 2-2l1 1 6-6-1-1a2 2 0 1 1 2-2 2 2 0 1 1 2 2l-1 1-7 7Z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  check: '<path d="M5 12.5 10 17l9-10"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  syringe: '<path d="m18 2 4 4M19 5l-9 9M2 22l4-1 9-9-3-3-9 9-1 4ZM14 8l2 2"/>',
  pill: '<rect x="3" y="9" width="18" height="6" rx="3" transform="rotate(-45 12 12)"/><path d="M9 9 15 15"/>',
  pulse: '<path d="M2 12h4l2-6 4 12 2-6h8"/>',
  clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1H9V4ZM8 10h8M8 14h8M8 18h5"/>',
  alert: '<path d="M12 3 2 20h20L12 3Z"/><path d="M12 9v5M12 17h.01"/>',
  sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><path d="M12 8a4 4 0 0 0 4 4 4 4 0 0 0-4 4 4 4 0 0 0-4-4 4 4 0 0 0 4-4Z"/>',
  dog: '<path d="M10 5 7 3v3L4 8v4c0 4 3 7 8 7s8-3 8-7V8l-3-2V3l-3 2"/><path d="M9 12h.01M15 12h.01M12 15c-1 0-1.5.6-1.5 1"/>',
  scissors: '<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><path d="M8 8l12 8M8 16 20 8"/>',
  hospital: '<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M9 8V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3M12 12v4M10 14h4"/>',
  bandage: '<rect x="2" y="7" width="20" height="10" rx="5" transform="rotate(-45 12 12)"/><path d="M10 10h.01M14 14h.01M14 10h.01M10 14h.01"/>',
  shield: '<path d="M12 3 5 6v5c0 4 3 7 7 9 4-2 7-5 7-9V6l-7-3Z"/>',
  drop2: '<path d="M12 3s6 6.5 6 10.5a6 6 0 0 1-12 0C6 9.5 12 3 12 3Z"/><path d="M9 13a3 3 0 0 0 3 3"/>',
  vial: '<path d="M8 3h8M9 3v15a3 3 0 0 0 6 0V3M9 11h6"/>',
  bug: '<path d="M8 9a4 4 0 0 1 8 0v3a4 4 0 0 1-8 0V9Z"/><path d="M12 5V3M9 6 7 4m8 2 2-2M5 11H3m18 0h-2M6 16l-2 1m16-1 2 1M8 13H4m16 0h-4"/>',
  chat: '<path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-4 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"/><path d="M8 10h8M8 13h5"/>',
  monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  door: '<path d="M5 21V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v17M4 21h14M13.5 12h.01"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
};

export const CATEGORY_ICONS = {
  // In-House
  "Analyzers": "flask", "Refractometer & Centrifuge": "droplet", "Cytology & Microscopy": "microscope",
  "Rapid Tests": "vial", "Imaging": "xray", "Point of Care Monitoring": "pulse",
  "Point of Care Screening": "search", "Management Trials": "bone",
  // Send-Out
  "Cultures": "bug", "Histopathology": "scissors", "Reference Lab Panels": "clipboard",
  "Serology": "shield", "Advanced Imaging/Referral": "hospital",
};
export const REGION_ICONS = {
  temperature: "thermometer", general: "stethoscope", skin: "bandage", lymph_nodes: "node",
  paws: "paw", ears: "ear", eyes: "eye", hydration: "droplet", abdomen: "drop2",
  respiratory: "lungs", cardiovascular: "heart", elbows: "bone",
};

export function Icon({ name, size = 20, stroke = 2, style = {} }) {
  const d = ICON_PATHS[name] || ICON_PATHS.paw;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, ...style }} dangerouslySetInnerHTML={{ __html: d }} />
  );
}

// ── Vitals meter ──
export function Meter({ label, value, tone = "accent", icon, big = false }) {
  const toneColor = {
    accent: "var(--ds-accent)", trust: "var(--ds-good)", health: "var(--ds-accent)",
    good: "var(--ds-good)", warn: "var(--color-text-warning)", danger: "var(--ds-danger)",
  }[tone] || "var(--ds-accent)";
  const col = tone === "health" ? (value < 35 ? "var(--ds-danger)" : value < 65 ? "var(--color-text-warning)" : "var(--ds-good)") : toneColor;
  return (
    <div style={{ marginBottom: big ? 0 : 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, color: "var(--color-text-secondary)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          {icon && <span style={{ color: col }}><Icon name={icon} size={14} stroke={2.2} /></span>}{label}
        </span>
        <span style={{ fontSize: big ? 15 : 12, fontWeight: 700, color: "var(--color-text-primary)", fontVariantNumeric: "tabular-nums" }}>{value}</span>
      </div>
      <div style={{ height: big ? 8 : 6, background: "var(--color-background-tertiary)", borderRadius: 99, overflow: "hidden", position: "relative" }}>
        <div style={{ height: "100%", width: `${value}%`, background: col, borderRadius: 99, transition: "width 0.6s cubic-bezier(.2,.8,.2,1)",
          boxShadow: `0 0 10px ${col}55` }} />
      </div>
    </div>
  );
}

export function Chip({ children, tone = "neutral", icon }) {
  const map = {
    neutral: ["var(--color-background-tertiary)", "var(--color-text-secondary)", "var(--color-border-tertiary)"],
    info: ["var(--color-background-info)", "var(--color-text-info)", "var(--color-border-info)"],
    success: ["var(--color-background-success)", "var(--color-text-success)", "var(--color-border-success)"],
    warning: ["var(--color-background-warning)", "var(--color-text-warning)", "var(--color-border-warning)"],
    danger: ["var(--color-background-danger)", "var(--color-text-danger)", "var(--color-border-danger)"],
  };
  const [bg, fg, bd] = map[tone] || map.neutral;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600,
      padding: "3px 9px", borderRadius: 99, background: bg, color: fg, border: `1px solid ${bd}`, letterSpacing: "0.02em" }}>
      {icon && <Icon name={icon} size={12} stroke={2.4} />}{children}
    </span>
  );
}

// ── Primary / ghost buttons ──
export function Btn({ children, onClick, disabled, variant = "primary", icon, iconRight, full, style = {}, type }) {
  const [hover, setHover] = useState(false);
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    padding: "11px 18px", borderRadius: "var(--border-radius-md)", fontSize: 14, fontWeight: 600,
    fontFamily: "var(--font-sans)", cursor: disabled ? "not-allowed" : "pointer", border: "1px solid transparent",
    width: full ? "100%" : "auto", transition: "transform .12s, background .15s, box-shadow .15s",
    opacity: disabled ? 0.5 : 1, transform: hover && !disabled ? "translateY(-1px)" : "none", whiteSpace: "nowrap",
  };
  const variants = {
    primary: { background: hover && !disabled ? "var(--ds-accent-hover)" : "var(--ds-accent)", color: "var(--ds-accent-contrast)", boxShadow: hover && !disabled ? "var(--ds-shadow-card)" : "none" },
    danger: { background: "var(--ds-danger)", color: "#fff" },
    ghost: { background: hover && !disabled ? "var(--color-background-tertiary)" : "transparent", color: "var(--color-text-secondary)", border: "1px solid var(--color-border-secondary)" },
    soft: { background: "var(--ds-accent-soft)", color: "var(--color-text-info)", border: "1px solid var(--color-border-info)" },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...base, ...(variants[variant] || variants.primary), ...style }}>
      {icon && <Icon name={icon} size={17} stroke={2.2} />}{children}
      {iconRight && <Icon name={iconRight} size={17} stroke={2.2} />}
    </button>
  );
}

export const EMOTION_META = {
  concerned: { label: "Concerned", tone: "info" },
  frustrated: { label: "Frustrated", tone: "warning" },
  worried_about_cost: { label: "Worried", tone: "warning" },
  cooperative: { label: "Cooperative", tone: "success" },
  panicked: { label: "Panicked", tone: "danger" },
  frightened: { label: "Frightened", tone: "warning" },
  angry: { label: "Upset", tone: "danger" },
};

// ── Geometric dog avatar (no photos). breed: "frenchie" | "lab" ──
export function DogAvatar({ breed = "frenchie", size = 92 }) {
  const fur = breed === "frenchie" ? "#C9A07B" : "#E2B978";
  const furDark = breed === "frenchie" ? "#A87E58" : "#C99A52";
  const muzzle = breed === "frenchie" ? "#EBD7BE" : "#F3E4C4";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block" }}>
      <defs>
        <radialGradient id={`bg-${breed}`} cx="50%" cy="35%" r="75%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      {breed === "frenchie" ? (
        <g>
          <path d="M22 40C18 22 26 14 33 18c4 2 7 9 8 17Z" fill={furDark} />
          <path d="M78 40C82 22 74 14 67 18c-4 2-7 9-8 17Z" fill={furDark} />
          <path d="M26 38c-2-11 2-16 7-14 3 1 5 7 6 13Z" fill={muzzle} opacity="0.6" />
          <path d="M74 38c2-11-2-16-7-14-3 1-5 7-6 13Z" fill={muzzle} opacity="0.6" />
          <rect x="24" y="30" width="52" height="50" rx="24" fill={fur} />
          <rect x="24" y="30" width="52" height="50" rx="24" fill={`url(#bg-${breed})`} />
          <ellipse cx="50" cy="64" rx="19" ry="15" fill={muzzle} />
          <circle cx="39" cy="50" r="4.6" fill="#3A2A1C" />
          <circle cx="61" cy="50" r="4.6" fill="#3A2A1C" />
          <circle cx="40.4" cy="48.6" r="1.5" fill="#fff" />
          <circle cx="62.4" cy="48.6" r="1.5" fill="#fff" />
          <ellipse cx="50" cy="60" rx="5" ry="3.6" fill="#3A2A1C" />
          <path d="M50 63.5v5M50 68.5c-3 0-5-1.5-5.5-3M50 68.5c3 0 5-1.5 5.5-3" stroke="#3A2A1C" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <ellipse cx="50" cy="50" rx="28" ry="29" fill={fur} />
          <path d="M22 38c-9 2-12 16-7 30 6 4 12 1 13-6 1-9-1-20-6-24Z" fill={furDark} />
          <path d="M78 38c9 2 12 16 7 30-6 4-12 1-13-6-1-9 1-20 6-24Z" fill={furDark} />
          <ellipse cx="50" cy="50" rx="28" ry="29" fill={`url(#bg-${breed})`} />
          <ellipse cx="50" cy="63" rx="16" ry="14" fill={muzzle} />
          <circle cx="40" cy="48" r="4.4" fill="#3A2A1C" />
          <circle cx="60" cy="48" r="4.4" fill="#3A2A1C" />
          <circle cx="41.3" cy="46.7" r="1.4" fill="#fff" />
          <circle cx="61.3" cy="46.7" r="1.4" fill="#fff" />
          <ellipse cx="50" cy="58" rx="5" ry="3.6" fill="#3A2A1C" />
          <path d="M50 61.5v4.5M50 66c-3 0-5-1.5-5.5-3M50 66c3 0 5-1.5 5.5-3" stroke="#3A2A1C" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}
