// ============================================================================
//  ⚠️  DO NOT TOUCH THE BACKEND.
//  This file (and this whole package) is FRONT-END / UI ONLY.
//  - Do NOT add, modify, remove, or re-implement any backend logic here:
//    no game engine, scoring, diagnosis evaluation, outcome resolution,
//    case data, intents, or dialogue generation.
//  - This UI only CALLS existing endpoints (via window.safeFetch / window.API)
//    and RENDERS what they return. All clinical logic lives on the server.
// ============================================================================
// room-scene.jsx — first-person exam room as a NAVIGABLE SPACE. Every action is
// an object you click in the room; a labeled tab row mirrors them as a fallback.
const { useState: useS, useEffect: useE, useRef: useR, useMemo: useM } = React;

const CANVAS_W = 1280, CANVAS_H = 800;

// region key → label + hotspot position on the 400×260 lateral dog (head at left)
const REGIONS = [
  { key: "ears", label: "Ears", x: 72, y: 70 }, { key: "eyes", label: "Eyes", x: 58, y: 98 },
  { key: "hydration", label: "Hydration", x: 46, y: 126 }, { key: "general", label: "General", x: 210, y: 92 },
  { key: "respiratory", label: "Respiratory", x: 152, y: 116 }, { key: "cardiovascular", label: "Heart", x: 146, y: 140 },
  { key: "skin", label: "Skin & coat", x: 250, y: 100 }, { key: "abdomen", label: "Abdomen", x: 216, y: 158 },
  { key: "lymph_nodes", label: "Lymph nodes", x: 300, y: 150 }, { key: "temperature", label: "Temperature", x: 334, y: 118 },
  { key: "elbows", label: "Joints", x: 150, y: 178 }, { key: "paws", label: "Paws", x: 138, y: 232 },
];

// the eight clickable objects → actions
const NAV = [
  { id: "examine", label: "Examine", icon: "stethoscope", kind: "mode", hint: "Tap a point on the patient to examine that area." },
  { id: "ask", label: "Ask owner", icon: "chat", kind: "mode", hint: "Talk to the owner — ask about the history below." },
  { id: "history", label: "Chart", icon: "monitor", kind: "drawer", hint: "Patient chart — history, meds & intake notes." },
  { id: "tests", label: "Diagnostics", icon: "microscope", kind: "drawer", hint: "Choose a diagnostic to run at the bench." },
  { id: "diff", label: "Differentials", icon: "list", kind: "drawer", hint: "Log the diagnoses you're weighing on the clipboard." },
  { id: "treat_inj", label: "Injectables", icon: "syringe", kind: "drawer", hint: "Injectable & in-clinic treatments from the fridge." },
  { id: "treat_oral", label: "Oral meds", icon: "pill", kind: "drawer", hint: "Tablets & topicals from the pharmacy." },
  { id: "disposition", label: "Disposition", icon: "door", kind: "drawer", hint: "Decide where the patient goes next." },
];

const QUICK_Q = ["How long has this gone on?", "What does she eat?", "Flea prevention?", "Tell me about the ears", "Any past treatment?"];
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{ "light": "afternoon", "showTech": true, "hints": true, "reduceMotion": false, "patientScale": 1.25 }/*EDITMODE-END*/;

function moodFor(e) {
  if (["panicked", "frightened"].includes(e)) return "panicked";
  if (["frustrated", "angry"].includes(e)) return "frustrated";
  return "neutral";
}

// ── canvas scaler ──
function useScale() {
  const [sc, setSc] = useS(1);
  useE(() => {
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

// ── speech bubble ──
function Bubble({ side = "left", label, tone = "tech", avatar = false, children }) {
  const owner = tone === "owner";
  return (
    <div style={{ position: "relative", maxWidth: 270, padding: "11px 14px", borderRadius: 16,
      borderBottomLeftRadius: side === "left" ? 4 : 16, borderBottomRightRadius: side === "right" ? 4 : 16,
      background: owner ? "var(--color-background-info)" : "var(--color-background-primary)",
      border: `1px solid ${owner ? "var(--color-border-info)" : "var(--color-border-secondary)"}`,
      boxShadow: "var(--ds-shadow-card)" }}>
      {label && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          {avatar && <span style={{ width: 20, height: 20, borderRadius: "50%", overflow: "hidden", border: "1.5px solid var(--color-border-secondary)", flexShrink: 0 }}><window.VetTechAvatar size={20} /></span>}
          <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase",
            color: owner ? "var(--color-text-info)" : "var(--color-text-secondary)" }}>{label}</span>
        </div>
      )}
      <div style={{ fontSize: 13.5, lineHeight: 1.5, color: "var(--color-text-primary)", textWrap: "pretty" }}>{children}</div>
    </div>
  );
}

// ── generic clickable object wrapper ──
function Hotspot({ box, label, icon, active, onClick, z = 14, labelSide = "top", children }) {
  const [hov, setHov] = useS(false);
  const { x, y, w, h } = box;
  const lp = labelSide === "top"
    ? { bottom: "calc(100% + 12px)", left: "50%", transform: "translateX(-50%)" }
    : { top: "calc(100% + 12px)", left: "50%", transform: "translateX(-50%)" };
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ position: "absolute", left: x, top: y, width: w, height: h, cursor: "pointer", zIndex: z }}>
      {children}
      {/* glow ring */}
      <div style={{ position: "absolute", inset: -5, borderRadius: 16, pointerEvents: "none", transition: "box-shadow .15s",
        boxShadow: active ? "0 0 0 3px var(--ds-accent), 0 0 26px rgba(196,98,62,0.4)" : hov ? "0 0 0 3px var(--ds-accent-soft)" : "none" }} />
      {/* clickable badge */}
      <div style={{ position: "absolute", top: -11, right: -11, width: 25, height: 25, borderRadius: "50%", zIndex: 3,
        background: active ? "var(--ds-accent)" : "var(--color-background-primary)", color: active ? "#fff" : "var(--ds-accent)",
        border: "2px solid var(--ds-accent)", display: "grid", placeItems: "center", boxShadow: "var(--ds-shadow-card)",
        animation: active ? "none" : "rmBob 2.6s ease-in-out infinite" }}>
        <window.Icon name={icon} size={13} stroke={2.4} />
      </div>
      {/* hover label */}
      {hov && (
        <div style={{ position: "absolute", ...lp, whiteSpace: "nowrap", padding: "6px 12px", borderRadius: 10, zIndex: 4,
          background: "rgba(46,38,32,0.92)", color: "#FBEDE6", fontSize: 12.5, fontWeight: 700, boxShadow: "var(--ds-shadow-pop)", pointerEvents: "none" }}>
          {label}
        </div>
      )}
    </div>
  );
}

// ── interactive patient (dog + region pins) ──
function Patient({ active, examined, pending, onTap, onSelect, selected, scale = 1 }) {
  const doneKeys = examined.map(e => e.subtype);
  return (
    <div style={{ position: "absolute", left: 490, top: 384, width: 300, height: 195, zIndex: 10, transform: `scale(${scale})`, transformOrigin: "center bottom", transition: "transform .25s cubic-bezier(.2,.8,.2,1)" }}>
      <div style={{ position: "absolute", left: 52, bottom: 6, width: 200, height: 22, borderRadius: "50%", background: "rgba(40,22,10,0.32)", filter: "blur(7px)" }} />
      <div style={{ position: "absolute", inset: 0 }}>
        <window.DogLateral furTone="#C9A07B" />
      </div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(110deg, rgba(0,0,0,0) 55%, rgba(251,224,170,0.22) 100%)", pointerEvents: "none", mixBlendMode: "screen" }} />
      {REGIONS.map(r => {
        const done = doneKeys.includes(r.key), examining = pending === r.key;
        const left = `${(r.x / 400) * 100}%`, top = `${(r.y / 260) * 100}%`;
        const show = active || done || examining;
        const bg = done ? "var(--ds-good)" : examining ? "var(--ds-accent)" : "var(--color-background-primary)";
        const fg = done || examining ? "#fff" : "var(--color-text-info)";
        const bd = done ? "var(--ds-good)" : examining ? "var(--ds-accent)" : "var(--color-border-info)";
        return (
          <button key={r.key} title={r.label}
            onClick={(e) => { e.stopPropagation(); if (done) onSelect(r.key); else if (active) onTap(r.key); }}
            style={{ position: "absolute", left, top, transform: "translate(-50%,-50%)", width: 28, height: 28, borderRadius: "50%",
              background: bg, color: fg, border: `2px solid ${bd}`, cursor: done || active ? "pointer" : "default",
              display: "grid", placeItems: "center", zIndex: 5, padding: 0,
              opacity: show ? 1 : 0, pointerEvents: show ? "auto" : "none", transition: "opacity .3s",
              boxShadow: selected === r.key ? "0 0 0 4px var(--ds-accent-soft)" : "var(--ds-shadow-card)",
              animation: examining ? "rmPulse 1.1s ease-in-out infinite" : (active && !done ? "rmPulse 2.4s ease-in-out infinite" : "none") }}>
            <window.Icon name={done ? "check" : (window.REGION_ICONS[r.key] || "stethoscope")} size={15} stroke={2.4} />
          </button>
        );
      })}
    </div>
  );
}

// ── bottom labeled tab row (fallback for every object) ──
function TabBar({ navId, onNav, hud, hints }) {
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 84, zIndex: 60,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(180deg, rgba(58,40,22,0), rgba(40,26,14,0.6))" }}>
      <div style={{ position: "absolute", left: 22, bottom: 14, display: "flex", alignItems: "center", gap: 9, padding: "6px 13px 6px 7px",
        borderRadius: 13, background: "rgba(255,253,249,0.94)", border: "1px solid var(--color-border-secondary)", boxShadow: "var(--ds-shadow-card)" }}>
        <span style={{ width: 32, height: 32, borderRadius: 9, background: "var(--ds-accent)", color: "#fff", display: "grid", placeItems: "center" }}><window.Icon name="paw" size={18} stroke={2.2} /></span>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 13.5, fontWeight: 700, color: "var(--color-text-primary)", lineHeight: 1 }}>Pepper</div>
          <div style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>French Bulldog · 3 yr</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 10px", borderRadius: 17,
        background: "linear-gradient(180deg,#E8ECED,#C2C8CA)", border: "1px solid #AAB1B4",
        boxShadow: "0 10px 24px rgba(40,22,10,0.4), inset 0 2px 3px rgba(255,255,255,0.7)" }}>
        {NAV.map(n => {
          const on = navId === n.id;
          return (
            <button key={n.id} onClick={() => onNav(n)} title={n.label}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, width: 70, padding: "7px 4px 5px", borderRadius: 11, cursor: "pointer",
                background: on ? "var(--ds-accent)" : "rgba(255,255,255,0.5)", border: `1px solid ${on ? "var(--ds-accent-hover)" : "rgba(140,123,104,0.22)"}`,
                color: on ? "#fff" : "var(--color-text-secondary)", fontFamily: "var(--font-sans)", transition: "transform .12s, background .15s",
                transform: on ? "translateY(-2px)" : "none", boxShadow: on ? "0 6px 14px rgba(196,98,62,0.4)" : "none" }}>
              <window.Icon name={n.icon} size={19} stroke={2.1} />
              <span style={{ fontSize: 10, fontWeight: 700 }}>{n.label}</span>
            </button>
          );
        })}
      </div>
      {hints && (
      <div style={{ position: "absolute", right: 22, bottom: 14, display: "flex", gap: 7 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 11, background: "rgba(255,253,249,0.94)", border: "1px solid var(--color-border-secondary)", fontSize: 11.5, fontWeight: 700, color: "var(--color-text-primary)", boxShadow: "var(--ds-shadow-card)" }}>
          <span style={{ color: "var(--color-text-success)" }}><window.Icon name="check" size={13} stroke={2.4} /></span>{hud.exams}/12
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 11, background: "rgba(255,253,249,0.94)", border: "1px solid var(--color-border-secondary)", fontSize: 11.5, fontWeight: 700, color: "var(--color-text-primary)", boxShadow: "var(--ds-shadow-card)" }}>
          <span style={{ color: "var(--color-text-warning)" }}><window.Icon name="flask" size={13} stroke={2.2} /></span>{hud.spend}
        </span>
      </div>
      )}
    </div>
  );
}

// ── ask bar (history input) ──
function AskBar({ value, setValue, onSend, loading }) {
  return (
    <div style={{ position: "absolute", left: 318, right: 318, bottom: 96, zIndex: 55,
      padding: 12, borderRadius: 18, background: "rgba(247,240,229,0.95)", backdropFilter: "blur(6px)",
      border: "1px solid var(--color-border-secondary)", boxShadow: "var(--ds-shadow-pop)" }}>
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-secondary)", marginBottom: 8, paddingLeft: 2 }}>History — talk with the owner</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 9 }}>
        {QUICK_Q.map(q => (
          <button key={q} onClick={() => onSend(q)} disabled={loading}
            style={{ fontSize: 11.5, fontWeight: 600, padding: "5px 11px", borderRadius: 99, cursor: "pointer", fontFamily: "var(--font-sans)", whiteSpace: "nowrap",
              background: "var(--color-background-primary)", border: "1px dashed var(--color-border-secondary)", color: "var(--color-text-secondary)" }}>{q}</button>
        ))}
      </div>
      <form onSubmit={e => { e.preventDefault(); onSend(value); }}
        style={{ display: "flex", gap: 8, padding: 6, borderRadius: 13, background: "var(--color-background-primary)", border: "1px solid var(--color-border-secondary)" }}>
        <input autoFocus value={value} onChange={e => setValue(e.target.value)} placeholder="Ask about the patient…"
          style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 14, padding: "8px 10px", color: "var(--color-text-primary)" }} />
        <window.Btn type="submit" icon="arrow" disabled={loading || !value.trim()}>Ask</window.Btn>
      </form>
    </div>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const sc = useScale();
  const [s, setS] = useS({
    session: null, scores: { trust: 55, patient_health: 96, cost: 0 }, emotion: "frustrated",
    patient: { name: "Pepper", breed: "French Bulldog", age: 3, sex: "Female (spayed)", weight_kg: 11 },
    mode: "examine", drawer: null, examined: [], testsRun: [], reportTest: null,
    selected: null, ownerLine: null, narratorLine: null, ask: "", loading: false, pending: null,
    appliedTreat: [], diffLog: [], closing: null, nurseActive: false,
  });
  const patch = o => setS(p => ({ ...p, ...o }));

  useE(() => { window.applyTheme && window.applyTheme("warm_clinic"); }, []);
  useE(() => { document.documentElement.setAttribute("data-motion", t.reduceMotion ? "reduce" : "full"); }, [t.reduceMotion]);
  useE(() => {
    window.safeFetch(`${window.API}/session`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ caseId: "derm_001" }) })
      .then(d => patch({ session: d.sessionId, scores: d.state.scores, emotion: d.state.client.emotion, patient: d.state.case.patient }))
      .catch(() => {});
  }, []);

  async function call(body) {
    return window.safeFetch(`${window.API}/input`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, sessionId: s.session, caseId: "derm_001" }) });
  }

  async function examine(key) {
    if (s.loading) return;
    patch({ pending: key, selected: key });
    const d = await call({ text: `exam:${key}` });
    const area = (REGIONS.find(r => r.key === key) || {}).label || key;
    setS(p => ({ ...p, pending: null, selected: key, scores: d.state.scores, emotion: d.state.client.emotion, nurseActive: false,
      examined: p.examined.some(e => e.subtype === key) ? p.examined : [...p.examined, { subtype: key, finding: d.dialogue }],
      narratorLine: { label: "Maya, RVT", text: `${area} findings are noted on the chart.`, from: "nurse" } }));
  }
  async function ask(text) {
    if (!text.trim() || s.loading) return;
    patch({ loading: true, ask: "" });
    const d = await call({ text });
    setS(p => ({ ...p, loading: false, ask: "", nurseActive: false, scores: d.state.scores, emotion: d.state.client.emotion,
      ownerLine: { q: text, text: d.reaction ? d.reaction.dialogue : d.dialogue } }));
  }
  async function runTest(key) {
    if (s.loading) return;
    patch({ loading: true });
    const d = await call({ text: `test:${key}` });
    setS(p => ({ ...p, loading: false, drawer: null, scores: d.state.scores, nurseActive: false,
      testsRun: p.testsRun.includes(key) ? p.testsRun : [...p.testsRun, key],
      reportTest: d.data, narratorLine: { label: "Maya, RVT", text: `I've got the ${d.data.label} results back — tap to view the report.`, from: "nurse" } }));
  }
  async function logDiff(id) {
    if (s.loading || s.diffLog.includes(id)) { setS(p => ({ ...p, diffLog: p.diffLog.includes(id) ? p.diffLog.filter(x => x !== id) : p.diffLog })); return; }
    const d = await call({ text: `diagnose:${id}` });
    setS(p => ({ ...p, scores: d.state.scores, emotion: d.state.client.emotion, diffLog: [...p.diffLog, id] }));
  }
  async function applyTreat(ids) {
    if (!ids.length || s.loading) return;
    patch({ loading: true });
    const d = await call({ action_ids: ids });
    setS(p => ({ ...p, loading: false, scores: d.state.scores, emotion: d.state.client.emotion,
      appliedTreat: d.state.treatment_action_ids || p.appliedTreat, narratorLine: { label: "Maya, RVT", text: d.dialogue, from: "nurse" } }));
  }
  async function finalize(dispId) {
    if (s.loading) return;
    patch({ loading: true });
    const d = await call({ action_ids: [dispId], finalise: true });
    setS(p => ({ ...p, loading: false, drawer: null, scores: d.state.scores, emotion: d.state.client.emotion,
      closing: { dialogue: d.dialogue, outcome: d.state.outcome }, ownerLine: d.reaction ? { text: d.reaction.dialogue } : p.ownerLine }));
  }

  function onNav(n) {
    if (n.kind === "mode") patch({ mode: n.id, drawer: null });
    else patch({ drawer: n.id });
  }
  // Maya, the nurse — clickable hints. [PLACEHOLDER: hint text will come from the backend per case/step.]
  const NURSE_HINTS = [
    "Work methodically — a full history and exam usually point the way before any test.",
    "Don't forget her ears and skin; that's where the trouble often shows on an itchy patient.",
    "Log your differentials as you go, then let the diagnostics rule them in or out.",
    "Cytology is quick and cheap — a good early step when the skin looks involved.",
    "Keep the owner in the loop; their trust holds up better when you explain your thinking.",
  ];
  function askNurse() {
    if (s.loading) return;
    const hint = NURSE_HINTS[(s._hintIdx || 0) % NURSE_HINTS.length];
    setS(p => ({ ...p, nurseActive: true, _hintIdx: (p._hintIdx || 0) + 1,
      narratorLine: { label: "Maya, RVT", text: hint, from: "nurse" } }));
  }

  // examine a region directly from a clickable instrument (otoscope/ophthalmoscope)
  function examTool(key) {
    if (s.loading) return;
    patch({ mode: "examine", drawer: null });
    examine(key);
  }

  const examineActive = s.mode === "examine" && !s.drawer;
  const askActive = s.mode === "ask" && !s.drawer;
  const selectedFinding = s.examined.find(e => e.subtype === s.selected);
  const activeNav = s.drawer || s.mode;
  const curHint = (NAV.find(n => n.id === activeNav) || {}).hint || "";

  // object hotspot config (clickable furniture)
  const objs = [
    { id: "treat_oral", box: { x: 250, y: 72, w: 210, h: 174 }, label: "Pharmacy — oral meds", icon: "pill", art: <window.PharmacyCabinet /> },
    { id: "history", box: { x: 130, y: 244, w: 172, h: 124 }, label: "Computer — patient chart", icon: "monitor", art: <window.ComputerScreen /> },
    { id: "tests", box: { x: 360, y: 282, w: 80, h: 86 }, label: "Microscope — diagnostics", icon: "microscope", art: <window.Microscope /> },
    { id: "disposition", box: { x: 600, y: 70, w: 152, h: 392 }, label: "Door — disposition", icon: "door", art: <window.ClinicDoor />, labelSide: "bottom", z: 9 },
    { id: "diff", box: { x: 800, y: 58, w: 116, h: 132 }, label: "Clipboard — differentials", icon: "list", art: <window.WallClipboard count={s.diffLog.length} /> },
    { id: "treat_inj", box: { x: 884, y: 250, w: 88, h: 112 }, label: "Fridge — injectables", icon: "syringe", art: <window.MiniFridge /> },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, background: "radial-gradient(circle at 50% 30%, #2a1d12, #160f0a)", display: "grid", placeItems: "center", overflow: "hidden" }}>
      <div style={{ width: CANVAS_W, height: CANVAS_H, transform: `scale(${sc})`, transformOrigin: "center", position: "relative", borderRadius: 18, overflow: "hidden", boxShadow: "0 40px 120px rgba(0,0,0,0.6)" }}>

        {/* ── SET DRESSING ── */}
        <window.RoomBackdrop tod={t.light} />
        <window.BackCounter />
        {t.showTech && <window.VetTechFigure />}
        {/* scenery (non-clickable) */}
        <div style={{ position: "absolute", left: 44, top: 74, width: 110, height: 165, borderRadius: 6, overflow: "hidden", border: "5px solid #FBF6EE", boxShadow: "0 10px 22px rgba(90,60,35,0.22)" }}>
          <img src="assets/fth-poster.png" alt="Flea, tick & heartworm prevention poster" style={{ display: "block", width: "100%", height: "100%", objectFit: "contain" }} />
        </div>
        <div style={{ position: "absolute", left: 310, top: 306, width: 40, height: 56 }}><window.SharpsBin /></div>
        <div style={{ position: "absolute", left: 756, top: 312, width: 112, height: 56 }}><window.CounterSink /></div>
        <div style={{ position: "absolute", left: 762, top: 234, width: 30, height: 76 }}><window.SoapDispenser /></div>
        <div style={{ position: "absolute", left: 800, top: 238, width: 62, height: 72 }}><window.PaperTowelDispenser /></div>
        {!t.reduceMotion && <window.DustMotes />}

        {/* ── CLICKABLE OBJECTS ── */}
        {objs.map(o => (
          <Hotspot key={o.id} box={o.box} label={o.label} icon={o.icon} z={o.z} labelSide={o.labelSide}
            active={activeNav === o.id} onClick={() => onNav(NAV.find(n => n.id === o.id))}>
            {o.art}
          </Hotspot>
        ))}

        {/* ── EYES/EARS DIAGNOSTIC STATION (wall charger near the patient) ── */}
        <div style={{ position: "absolute", left: 456, top: 198, width: 104, height: 150, zIndex: 10 }}><window.InstrumentCharger /></div>
        <Hotspot box={{ x: 462, y: 156, w: 44, h: 104 }} label="Ophthalmoscope — examine eyes" icon="eye" z={12}
          active={examineActive && s.selected === "eyes"} onClick={() => examTool("eyes")}>
          <window.Ophthalmoscope />
        </Hotspot>
        <Hotspot box={{ x: 506, y: 156, w: 44, h: 104 }} label="Otoscope — examine ears" icon="ear" z={12}
          active={examineActive && s.selected === "ears"} onClick={() => examTool("ears")}>
          <window.Otoscope />
        </Hotspot>
        {/* stethoscope hanging on a wall hook beside the station — click = general exam */}
        <Hotspot box={{ x: 558, y: 162, w: 38, h: 150 }} label="Stethoscope — general exam" icon="stethoscope" z={12}
          active={examineActive && s.selected === "general"} onClick={() => examTool("general")}>
          <window.WallStethoscope />
        </Hotspot>

        {/* ── OWNER (Ask) — whole body is the click target ── */}
        <Hotspot box={{ x: 206, y: 402, w: 138, h: 338 }} label="Owner — ask questions" icon="chat" z={9}
          active={activeNav === "ask"} onClick={() => onNav(NAV[1])}>
          <div style={{ position: "absolute", inset: 0 }} />
        </Hotspot>
        <window.SeatedOwner caseId="derm_001" speaking={askActive} dimmed={!!s.drawer} mood={moodFor(s.emotion)} />

        {/* ── NURSE (Maya) — clickable for a hint [placeholder: wire to backend] ── */}
        {t.showTech && (
          <Hotspot box={{ x: 1024, y: 244, w: 112, h: 250 }} label="Maya, RVT — ask for a hint" icon="info" z={11}
            active={s.nurseActive} onClick={askNurse}>
            <div style={{ position: "absolute", inset: 0 }} />
          </Hotspot>
        )}

        {/* ── EXAM TABLE + PATIENT (Examine) ── */}
        <window.ExamTable />
        {/* vet's rolling stool at the opposite end of the table */}
        <div style={{ position: "absolute", left: 858, top: 528, width: 140, height: 182, zIndex: 7 }}><window.RollingStool /></div>
        <div onClick={() => !examineActive && patch({ mode: "examine", drawer: null })} style={{ position: "absolute", left: 462, top: 360, width: 356, height: 210, zIndex: 8, cursor: examineActive ? "default" : "pointer" }} />
        <Patient active={examineActive} examined={s.examined} pending={s.pending} selected={s.selected} scale={t.patientScale}
          onTap={examine} onSelect={key => patch({ selected: key })} />
        {/* examine badge on the table */}
        {!examineActive && (
          <div style={{ position: "absolute", left: 800, top: 470, zIndex: 11, pointerEvents: "none", width: 25, height: 25, borderRadius: "50%",
            background: "var(--color-background-primary)", color: "var(--ds-accent)", border: "2px solid var(--ds-accent)", display: "grid", placeItems: "center", boxShadow: "var(--ds-shadow-card)", animation: "rmBob 2.6s ease-in-out infinite" }}>
            <window.Icon name="stethoscope" size={13} stroke={2.4} />
          </div>
        )}

        <window.VitalsMonitor trust={s.scores.trust} health={s.scores.patient_health} cost={s.scores.cost} emotion={s.emotion} />

        {/* ── BUBBLES ── */}
        {s.ownerLine && askActive && (
          <div style={{ position: "absolute", left: 300, top: 360, zIndex: 30 }}>
            <Bubble side="left" tone="owner" label="The owner">{s.ownerLine.text}</Bubble>
          </div>
        )}
        {s.narratorLine && (
          <div style={{ position: "absolute", left: 600, top: 230, width: 268, zIndex: 30 }}>
            <Bubble side="right" tone="tech" label={s.narratorLine.label} avatar={s.narratorLine.from === "nurse"}>{s.narratorLine.text}</Bubble>
          </div>
        )}

        {/* ── EXAMINE: floating finding card ── */}
        {examineActive && (
          <div style={{ position: "absolute", left: 470, top: 596, width: 340, zIndex: 30 }}>
            {selectedFinding ? (
              <div style={{ borderRadius: "var(--border-radius-md)", overflow: "hidden", background: "var(--color-background-primary)", border: "1px solid var(--color-border-secondary)", boxShadow: "var(--ds-shadow-pop)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "var(--color-background-secondary)", borderBottom: "1px solid var(--color-border-tertiary)" }}>
                  <span style={{ width: 26, height: 26, borderRadius: 8, display: "grid", placeItems: "center", background: "var(--color-background-info)", color: "var(--color-text-info)" }}><window.Icon name={window.REGION_ICONS[s.selected] || "stethoscope"} size={15} stroke={2.2} /></span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 14.5, fontWeight: 700, textTransform: "capitalize" }}>{(REGIONS.find(r => r.key === s.selected) || {}).label}</span>
                </div>
                <div style={{ padding: "11px 13px", fontSize: 13, lineHeight: 1.55, color: "var(--color-text-primary)", textWrap: "pretty" }}>{selectedFinding.finding}</div>
              </div>
            ) : (
              <div style={{ padding: "11px 14px", borderRadius: "var(--border-radius-md)", background: "rgba(255,253,249,0.92)", border: "1px dashed var(--color-border-secondary)", fontSize: 12.5, color: "var(--color-text-secondary)", lineHeight: 1.5, textAlign: "center" }}>
                Tap a glowing point on the patient to examine that area.
              </div>
            )}
          </div>
        )}

        {/* ── orientation + hint ── */}
        <div style={{ position: "absolute", left: 22, top: 20, zIndex: 30, display: "flex", alignItems: "center", gap: 9, padding: "8px 14px 8px 9px", borderRadius: 99, background: "rgba(255,253,249,0.84)", backdropFilter: "blur(4px)", border: "1px solid var(--color-border-tertiary)", boxShadow: "var(--ds-shadow-card)" }}>
          <span style={{ width: 26, height: 26, borderRadius: 8, background: "var(--ds-accent)", color: "#fff", display: "grid", placeItems: "center" }}><window.Icon name="hospital" size={15} stroke={2.2} /></span>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700 }}>Exam Room 2</span>
          <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>· Chronic pruritus</span>
        </div>
        {t.hints && (
          <div style={{ position: "absolute", left: "50%", top: 20, transform: "translateX(-50%)", zIndex: 30, padding: "7px 16px", borderRadius: 99, background: "rgba(46,38,32,0.8)", color: "#FBEDE6", fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap", boxShadow: "var(--ds-shadow-card)" }}>
            {curHint || "Click any object in the room — or use the tabs below."}
          </div>
        )}

        {/* ── PANELS / DRAWERS ── */}
        {s.drawer === "history" && <window.HistoryPanel caseId="derm_001" patient={s.patient} onClose={() => patch({ drawer: null })} />}
        {s.drawer === "tests" && <window.TestDrawer testsRun={s.testsRun} onRun={runTest} onClose={() => patch({ drawer: null })} />}
        {s.drawer === "diff" && <window.DiffDrawer logged={s.diffLog} onLog={logDiff} onClose={() => patch({ drawer: null })} />}
        {s.drawer === "treat_inj" && <window.TreatDrawer group="inj" applied={s.appliedTreat} onApply={applyTreat} onClose={() => patch({ drawer: null })} />}
        {s.drawer === "treat_oral" && <window.TreatDrawer group="oral" applied={s.appliedTreat} onApply={applyTreat} onClose={() => patch({ drawer: null })} />}
        {s.drawer === "disposition" && <window.WrapDrawer onConfirm={finalize} onClose={() => patch({ drawer: null })} />}

        {/* ── ASK BAR ── */}
        {askActive && <AskBar value={s.ask} setValue={v => patch({ ask: v })} onSend={ask} loading={s.loading} />}

        {/* ── BOTTOM TABS ── */}
        <TabBar navId={activeNav} onNav={onNav} hud={{ exams: s.examined.length, spend: s.scores.cost }} hints={t.hints} />

        <window.Vignette />

        {/* ── CLOSING CARD ── */}
        {s.closing && (
          <div style={{ position: "absolute", inset: 0, zIndex: 90, background: "rgba(30,18,8,0.6)", display: "grid", placeItems: "center" }}>
            <div style={{ width: 460, borderRadius: "var(--border-radius-lg)", overflow: "hidden", background: "var(--color-background-primary)", boxShadow: "var(--ds-shadow-pop)" }}>
              <div style={{ padding: "26px 26px 20px", textAlign: "center", background: "var(--color-background-secondary)", borderBottom: "1px solid var(--color-border-tertiary)" }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-secondary)" }}>Consult closed</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 64, fontWeight: 800, color: "var(--ds-gold)", lineHeight: 1, margin: "6px 0" }}>{s.closing.outcome?.grade || "—"}</div>
                <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Final score {s.closing.outcome?.finalScore ?? "—"}/100</div>
              </div>
              <div style={{ padding: "18px 22px" }}>
                <div style={{ fontSize: 14, lineHeight: 1.6, color: "var(--color-text-primary)", marginBottom: 14, textWrap: "pretty" }}>{s.closing.dialogue}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                  {(s.closing.outcome?.feedback || []).slice(0, 5).map((f, i) => (
                    <div key={i} style={{ fontSize: 12.5, lineHeight: 1.5, color: "var(--color-text-secondary)" }}>{f}</div>
                  ))}
                </div>
                <window.Btn full icon="arrow" onClick={() => window.location.reload()}>See another patient</window.Btn>
              </div>
            </div>
          </div>
        )}
      </div>

      <window.ReportModal test={s.reportTest} onClose={() => patch({ reportTest: null })} />
      <Tweaks t={t} setTweak={setTweak} />
    </div>
  );
}

function Tweaks({ t, setTweak }) {
  return (
    <TweaksPanel>
      <TweakSection label="Time of day" />
      <TweakRadio value={t.light} onChange={v => setTweak("light", v)}
        options={[{ value: "morning", label: "Morning" }, { value: "afternoon", label: "Afternoon" }, { value: "evening", label: "Evening" }]} />
      <TweakSection label="Patient" />
      <TweakSlider label="Patient size" value={t.patientScale} min={0.9} max={1.7} step={0.05} onChange={v => setTweak("patientScale", v)} />
      <TweakSection label="Room" />
      <TweakToggle label="Show nurse at counter" value={t.showTech} onChange={v => setTweak("showTech", v)} />
      <TweakToggle label="On-screen hints" value={t.hints} onChange={v => setTweak("hints", v)} />
      <TweakToggle label="Reduce motion" value={t.reduceMotion} onChange={v => setTweak("reduceMotion", v)} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
