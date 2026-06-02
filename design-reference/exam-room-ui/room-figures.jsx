// room-figures.jsx — foreground hero pieces: exam table, seated owner, bedside
// vitals monitor, atmosphere. Positioned on the same 1280×800 canvas.
const { useMemo: useMemoFig } = React;

// ════════════════════════ EXAM TABLE (brushed steel) ════════════════════════
// Pure furniture. The interactive patient is composited over it by the scene.
function ExamTable() {
  const topY = 548, topH = 58, apronH = 40, legBottom = 762;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, pointerEvents: "none" }}>
      {/* floor contact shadow */}
      <div style={{ position: "absolute", left: 640 - 290, top: legBottom - 36, width: 580, height: 56, borderRadius: "50%",
        background: "rgba(40,22,10,0.28)", filter: "blur(12px)" }} />
      {/* front legs */}
      {[430, 850].map((x, i) => (
        <div key={i} style={{ position: "absolute", left: x, top: topY + topH + apronH - 6, width: 18, height: legBottom - (topY + topH + apronH - 6),
          background: "linear-gradient(90deg,#9AA1A4,#D7DBDC 40%,#8A9194)", borderRadius: 4, boxShadow: "0 0 0 1px rgba(60,60,60,0.2)" }} />
      ))}
      {/* cross bar */}
      <div style={{ position: "absolute", left: 430, top: legBottom - 70, width: 438, height: 12, borderRadius: 6, background: "linear-gradient(180deg,#C2C8CA,#8A9194)" }} />
      {/* apron (front face of table) */}
      <div style={{ position: "absolute", left: 405, top: topY + topH - 6, width: 470, height: apronH + 8, borderRadius: "0 0 10px 10px",
        background: "linear-gradient(180deg,#AEB5B8,#7F868A)", boxShadow: "inset 0 2px 3px rgba(255,255,255,0.4)" }} />
      {/* top surface — slight trapezoid, brushed steel */}
      <div style={{ position: "absolute", left: 392, top: topY, width: 496, height: topH,
        clipPath: "polygon(5% 0, 95% 0, 100% 100%, 0% 100%)",
        background: "linear-gradient(180deg,#EEF1F2 0%,#D2D8DA 45%,#BCC3C6 100%)",
        boxShadow: "0 8px 18px rgba(60,38,18,0.22)" }}>
        {/* brushed streaks */}
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(90deg, rgba(255,255,255,0.0) 0 6px, rgba(255,255,255,0.18) 6px 7px)", opacity: 0.5 }} />
        {/* front lip highlight */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 5, background: "rgba(255,255,255,0.55)" }} />
        {/* warm light wash from window */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(110deg, rgba(0,0,0,0) 40%, rgba(251,224,170,0.4) 100%)" }} />
      </div>
    </div>
  );
}

// ════════════════════════ SEATED OWNER (full figure) ════════════════════════
function SeatedOwner({ caseId = "derm_001", speaking, dimmed, mood = "frustrated" }) {
  const look = (window.OWNER_LOOKS && window.OWNER_LOOKS[caseId]) || { skin: "#7C5638", hair: "#1E1A17", shirt: "#4F6356" };
  const { skin, hair, shirt } = look;
  const trouser = "#3A3F46", shoe = "#2A2320";
  const frus = mood === "frustrated" || mood === "panicked";
  return (
    <div style={{ position: "absolute", left: 150, top: 360, width: 250, height: 400,
      transition: "filter .3s, opacity .3s", filter: dimmed ? "saturate(0.85) brightness(0.97)" : "none", opacity: dimmed ? 0.94 : 1,
      animation: speaking ? "rmBob 2.8s ease-in-out infinite" : "none" }}>
      <svg width="250" height="400" viewBox="0 0 250 400" style={{ display: "block", overflow: "visible" }}>
        {/* floor shadow */}
        <ellipse cx="125" cy="384" rx="96" ry="16" fill="rgba(40,22,10,0.20)" />
        {/* chair back */}
        <rect x="52" y="120" width="146" height="150" rx="22" fill="#6B7480" />
        <rect x="60" y="128" width="130" height="58" rx="16" fill="#7E8AA0" />
        {/* chair legs */}
        <rect x="64" y="276" width="13" height="104" rx="4" fill="#4A3018" />
        <rect x="173" y="276" width="13" height="104" rx="4" fill="#4A3018" />
        {/* seat */}
        <rect x="52" y="258" width="146" height="34" rx="14" fill="#6B7480" />

        {/* ── PERSON ── */}
        {/* shins */}
        <rect x="86" y="300" width="22" height="74" rx="9" fill={trouser} />
        <rect x="142" y="300" width="22" height="74" rx="9" fill={trouser} />
        {/* shoes */}
        <path d="M82 368h30v8q0 6-7 6H78q-6 0-2-7Z" fill={shoe} />
        <path d="M168 368h-30v8q0 6 7 6h27q6 0 2-7Z" fill={shoe} />
        {/* thighs (seated, forward) */}
        <path d="M84 262q41-12 82 0l-3 46q-38 10-76 0Z" fill={trouser} />
        {/* torso / shirt */}
        <path d="M88 168q37-15 74 0l8 100q-45 16-90 0Z" fill={shirt} />
        <path d="M88 168q37-15 74 0l3 30q-40-12-80 0Z" fill="rgba(255,255,255,0.09)" />
        {/* arms resting in lap */}
        <path d="M90 176q-18 34-12 84l24 6q-4-50 8-84Z" fill={shirt} />
        <path d="M160 176q18 34 12 84l-24 6q4-50-8-84Z" fill={shirt} />
        {/* hands */}
        <ellipse cx="106" cy="266" rx="13" ry="10" fill={skin} />
        <ellipse cx="144" cy="266" rx="13" ry="10" fill={skin} />
        {/* neck */}
        <rect x="115" y="132" width="20" height="30" rx="9" fill={skin} />
        <rect x="115" y="132" width="20" height="9" rx="4" fill="rgba(0,0,0,0.12)" />
        {/* head */}
        <ellipse cx="125" cy="100" rx="32" ry="35" fill={skin} />
        {/* ears */}
        <circle cx="93" cy="102" r="5.5" fill={skin} />
        <circle cx="157" cy="102" r="5.5" fill={skin} />
        {/* forehead highlight */}
        <ellipse cx="113" cy="84" rx="11" ry="8" fill="#fff" opacity="0.12" />
        {/* hair */}
        <path d="M91 92q-3-44 34-44t34 44q-9-22-34-22t-34 22Z" fill={hair} />
        {/* eyes */}
        <circle cx="112" cy="100" r="3.8" fill="#241E1A" />
        <circle cx="138" cy="100" r="3.8" fill="#241E1A" />
        <circle cx="113.2" cy="98.8" r="1.2" fill="#fff" />
        <circle cx="139.2" cy="98.8" r="1.2" fill="#fff" />
        {/* brows — frustrated/exasperated, not angry (gently lowered, no harsh furrow) */}
        {frus
          ? <path d="M104 89q7 -1.5 14 0.5M132 89q7 -1.5 14 0.5" stroke={hair} strokeWidth="2.6" fill="none" strokeLinecap="round" />
          : <path d="M104 90q7-3 14 0M132 90q7-3 14 0" stroke={hair} strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.85" />}
        {/* nose */}
        <path d="M125 102v9q-3 2-6 2" stroke="rgba(0,0,0,0.16)" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* mouth — frustrated (flat, slight downturn) */}
        {mood === "frustrated"
          ? <path d="M115 116q10 1.5 22 0" stroke="#3A2A20" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          : mood === "panicked"
          ? <ellipse cx="125" cy="117" rx="6" ry="4.5" fill="#3A2A20" />
          : <path d="M114 115q11 5 23 0" stroke="#3A2A20" strokeWidth="2.6" fill="none" strokeLinecap="round" />}
        {/* speaking ring */}
        {speaking && <ellipse cx="125" cy="100" rx="40" ry="43" fill="none" stroke="var(--ds-accent)" strokeWidth="2.5" opacity="0.55" />}
      </svg>
    </div>
  );
}

// ════════════════════════ WALL STATUS METERS (Health · Trust · Cost) ════════════════════════
function VitalsMonitor({ trust = 55, health = 96, cost = 0, emotion = "frustrated" }) {
  const emo = (window.EMOTION_META[emotion]) || { label: emotion, tone: "info" };
  const moodColor = emo.tone === "danger" ? "#C0492E" : emo.tone === "warning" ? "#C07A1E" : emo.tone === "success" ? "#3E8E5A" : "#2F7E84";
  const healthColor = health < 35 ? "#C0492E" : health < 65 ? "#C07A1E" : "#3E8E5A";
  const meter = (label, value, color) => (
    <div style={{ marginBottom: 13 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-text-secondary)" }}>{label}</span>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, color }}>{value}</span>
      </div>
      <div style={{ height: 8, borderRadius: 99, background: "rgba(120,90,55,0.16)", boxShadow: "inset 0 1px 2px rgba(90,60,35,0.18)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${Math.min(100, value)}%`, borderRadius: 99, background: color, transition: "width .6s cubic-bezier(.2,.8,.2,1)" }} />
      </div>
    </div>
  );
  return (
    <div style={{ position: "absolute", left: 982, top: 66, width: 252 }}>
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 15, paddingBottom: 9, borderBottom: "1.5px solid rgba(120,90,55,0.22)" }}>
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#3E8E5A", boxShadow: "0 0 6px rgba(62,142,90,0.6)", animation: "rmFade 1.6s ease-in-out infinite alternate" }} />
        <span style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-primary)" }}>Patient Status</span>
        <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--color-text-secondary)" }}>PEPPER</span>
      </div>
      {meter("Health", health, healthColor)}
      {meter("Trust", trust, "#2F7E84")}
      {meter("Cost", cost, "#C07A1E")}
      {/* mood */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 15, paddingTop: 11, borderTop: "1.5px solid rgba(120,90,55,0.22)" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-text-secondary)" }}>Owner mood</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 800, color: moodColor }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: moodColor }} />{emo.label}
        </span>
      </div>
    </div>
  );
}

// ════════════════════════ ROLLING STOOL (vet's seat, opposite the owner) ════════════════════════
function RollingStool() {
  const casters = [-90, -34, 22, 90, 158]; // angles for the 5-star base
  const cx = 70, cy = 132, R = 50;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <svg width="100%" height="100%" viewBox="0 0 140 180" preserveAspectRatio="xMidYMax meet" style={{ display: "block", overflow: "visible" }}>
        <defs>
          <linearGradient id="stoolChrome" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#8A9094" /><stop offset="0.45" stopColor="#E4E8EA" /><stop offset="0.6" stopColor="#C2C8CB" /><stop offset="1" stopColor="#7E8488" />
          </linearGradient>
          <radialGradient id="stoolSeat" cx="42%" cy="32%" r="75%">
            <stop offset="0" stopColor="#3A3D42" /><stop offset="55%" stopColor="#1C1E22" /><stop offset="100%" stopColor="#0E0F12" />
          </radialGradient>
        </defs>
        {/* floor contact shadow — matches the 5-caster footprint ellipse */}
        <ellipse cx={cx} cy="142" rx="62" ry="23" fill="rgba(40,22,10,0.15)" />
        <ellipse cx={cx} cy="144" rx="46" ry="16" fill="rgba(40,22,10,0.30)" />
        {/* 5-star base legs */}
        {casters.map((deg, i) => {
          const a = (deg * Math.PI) / 180;
          const ex = cx + Math.cos(a) * R, ey = cy + Math.sin(a) * R * 0.42;
          return (
            <g key={i}>
              <path d={`M${cx - 6} ${cy} L${ex - 5} ${ey - 2} L${ex + 5} ${ey + 2} L${cx + 6} ${cy + 3} Z`} fill="url(#stoolChrome)" stroke="#6E7478" strokeWidth="0.6" />
              {/* caster wheel */}
              <ellipse cx={ex} cy={ey + 4} rx="7" ry="6" fill="#1A1C1F" />
              <ellipse cx={ex} cy={ey + 3} rx="4" ry="3.4" fill="#34383C" />
            </g>
          );
        })}
        {/* central hub */}
        <ellipse cx={cx} cy={cy} rx="13" ry="7" fill="url(#stoolChrome)" />
        {/* gas cylinder */}
        <rect x={cx - 7} y="74" width="14" height="56" rx="3" fill="url(#stoolChrome)" />
        <rect x={cx - 7} y="74" width="5" height="56" rx="2.5" fill="rgba(255,255,255,0.35)" />
        {/* chrome foot ring */}
        <ellipse cx={cx} cy="98" rx="30" ry="9" fill="none" stroke="#9AA1A4" strokeWidth="3.5" />
        <ellipse cx={cx} cy="98" rx="30" ry="9" fill="none" stroke="#E4E8EA" strokeWidth="1.2" />
        {/* seat cushion */}
        <ellipse cx={cx} cy="62" rx="50" ry="20" fill="#0E0F12" />
        <ellipse cx={cx} cy="55" rx="50" ry="19" fill="url(#stoolSeat)" />
        <ellipse cx={cx} cy="50" rx="40" ry="13" fill="rgba(255,255,255,0.06)" />
        {/* seam */}
        <ellipse cx={cx} cy="56" rx="44" ry="15.5" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="1.4" />
      </svg>
    </div>
  );
}

// ════════════════════════ ATMOSPHERE ════════════════════════
function DustMotes() {
  const motes = useMemoFig(() => Array.from({ length: 9 }, (_, i) => ({
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

function Vignette() {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
      boxShadow: "inset 0 0 140px 40px rgba(40,22,10,0.32), inset 0 -40px 80px rgba(40,22,10,0.18)" }} />
  );
}

Object.assign(window, { ExamTable, SeatedOwner, VitalsMonitor, RollingStool, DustMotes, Vignette });
