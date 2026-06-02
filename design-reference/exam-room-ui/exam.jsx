// exam.jsx — illustrated interactive physical-exam board (no photos required).
const { useState: useStateExam, useRef: useRefExam, useEffect: useEffectExam } = React;

// region key → label + hotspot position on a 400×260 lateral dog (head at left)
const EXAM_REGIONS = [
  { key: "ears", label: "Ears", x: 72, y: 70 },
  { key: "eyes", label: "Eyes", x: 58, y: 98 },
  { key: "hydration", label: "Hydration", x: 46, y: 126 },
  { key: "general", label: "General", x: 210, y: 92 },
  { key: "respiratory", label: "Respiratory", x: 152, y: 116 },
  { key: "cardiovascular", label: "Heart", x: 146, y: 140 },
  { key: "skin", label: "Skin & coat", x: 245, y: 100 },
  { key: "abdomen", label: "Abdomen", x: 216, y: 158 },
  { key: "lymph_nodes", label: "Lymph nodes", x: 300, y: 150 },
  { key: "temperature", label: "Temperature", x: 334, y: 118 },
  { key: "elbows", label: "Joints", x: 150, y: 178 },
  { key: "paws", label: "Paws", x: 138, y: 232 },
];

function DogLateral({ furTone }) {
  const fur = furTone || "#C9A07B";
  const dark = "#A87E58";
  return (
    <svg viewBox="0 0 400 260" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid meet">
      {/* tail */}
      <path d="M318 100c22-14 40-12 46 2 3 7-2 12-9 9 4 8-3 14-10 9-2 10-12 9-14 1Z" fill={dark} />
      {/* legs */}
      <g fill={dark}>
        <rect x="128" y="150" width="22" height="86" rx="11" />
        <rect x="168" y="155" width="22" height="81" rx="11" />
        <rect x="268" y="150" width="22" height="86" rx="11" />
        <rect x="300" y="155" width="22" height="81" rx="11" />
      </g>
      {/* paws */}
      <g fill="#8A6646">
        <rect x="124" y="228" width="30" height="14" rx="7" />
        <rect x="164" y="228" width="30" height="14" rx="7" />
        <rect x="264" y="228" width="30" height="14" rx="7" />
        <rect x="296" y="228" width="30" height="14" rx="7" />
      </g>
      {/* body */}
      <path d="M120 150c-8-44 18-72 70-74 66-2 118 2 134 28 12 20 8 52-16 64-30 15-92 18-150 12-22-2-34-12-38-30Z" fill={fur} />
      {/* chest/neck to head */}
      <path d="M120 150c-30-6-58-16-66-40-6-18 6-36 28-40 18-3 34 6 42 22 8 16 6 40-4 58Z" fill={fur} />
      {/* head */}
      <ellipse cx="74" cy="106" rx="40" ry="38" fill={fur} />
      {/* snout */}
      <path d="M34 110c-18 0-26 8-26 18 0 8 8 12 22 12 12 0 22-4 26-12Z" fill="#EBD7BE" />
      <circle cx="14" cy="120" r="6" fill="#3A2A1C" />
      {/* ear */}
      <path d="M86 70c4-22 22-30 30-20 6 8 0 26-14 38Z" fill={dark} />
      {/* eye */}
      <circle cx="64" cy="100" r="5" fill="#3A2A1C" />
      <circle cx="65.6" cy="98.4" r="1.6" fill="#fff" />
      {/* mouth */}
      <path d="M16 128c8 4 18 4 26 1" stroke="#3A2A1C" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function SizeControl({ size, step, onStep }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "4px 6px", borderRadius: 99, background: "var(--color-background-secondary)", border: "1px solid var(--color-border-tertiary)" }} title="Patient size">
      <Icon name="paw" size={12} stroke={2.2} style={{ color: "var(--color-text-secondary)", opacity: 0.7 }} />
      <button onClick={() => onStep(-step)} disabled={size <= 0.001} aria-label="Smaller"
        style={{ width: 22, height: 22, borderRadius: "50%", display: "grid", placeItems: "center", cursor: size <= 0.001 ? "default" : "pointer", border: "1px solid var(--color-border-secondary)", background: "var(--color-background-primary)", color: "var(--color-text-secondary)", opacity: size <= 0.001 ? 0.4 : 1, padding: 0 }}>
        <span style={{ fontSize: 16, fontWeight: 700, lineHeight: 0 }}>−</span>
      </button>
      <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
        {[0, 1, 2, 3, 4].map(i => (
          <span key={i} style={{ width: 5, height: 5 + i * 2.4, borderRadius: 2, background: size >= i * step - 0.01 ? "var(--ds-accent)" : "var(--color-border-secondary)", transition: "background .2s" }} />
        ))}
      </div>
      <button onClick={() => onStep(step)} disabled={size >= 0.999} aria-label="Bigger"
        style={{ width: 22, height: 22, borderRadius: "50%", display: "grid", placeItems: "center", cursor: size >= 0.999 ? "default" : "pointer", border: "1px solid var(--color-border-secondary)", background: "var(--color-background-primary)", color: "var(--color-text-primary)", opacity: size >= 0.999 ? 0.4 : 1, padding: 0 }}>
        <span style={{ fontSize: 15, fontWeight: 700, lineHeight: 0 }}>+</span>
      </button>
    </div>
  );
}

function Hotspot({ region, state, onTap }) {
  const left = `${(region.x / 400) * 100}%`, top = `${(region.y / 260) * 100}%`;
  const done = state === "done", examining = state === "examining";
  const bg = done ? "var(--ds-good)" : examining ? "var(--ds-accent)" : "var(--color-background-primary)";
  const fg = done || examining ? "#fff" : "var(--color-text-secondary)";
  const bd = done ? "var(--ds-good)" : examining ? "var(--ds-accent)" : "var(--color-border-secondary)";
  return (
    <button onClick={() => onTap(region.key)} title={region.label}
      style={{ position: "absolute", left, top, transform: "translate(-50%,-50%)", width: 34, height: 34, borderRadius: "50%",
        background: bg, color: fg, border: `2px solid ${bd}`, cursor: done ? "default" : "pointer", display: "grid", placeItems: "center",
        boxShadow: examining ? "0 0 0 6px var(--ds-accent-soft)" : "var(--ds-shadow-card)", transition: "all .18s", zIndex: 3,
        animation: examining ? "vpulse 1.1s ease-in-out infinite" : "none" }}>
      <Icon name={done ? "check" : (window.REGION_ICONS[region.key] || "stethoscope")} size={17} stroke={2.4} />
    </button>
  );
}

function ExamPanel({ caseId, examined, onExamine, loading }) {
  const [selected, setSelected] = useStateExam(null);
  const [pending, setPending] = useStateExam(null);
  const [size, setSize] = useStateExam(() => { const v = parseFloat(localStorage.getItem("vetsim_exam_size")); return v >= 0 && v <= 1 ? v : 0.3; });
  const furTone = caseId === "gdv_001" ? "#E2B978" : "#C9A07B";
  const doneKeys = examined.map(e => e.subtype);
  const findingFor = k => (examined.find(e => e.subtype === k) || {}).finding;
  const stepSize = (delta) => setSize(prev => Math.max(0, Math.min(1, +(prev + delta).toFixed(3))));
  useEffectExam(() => { try { localStorage.setItem("vetsim_exam_size", size); } catch (e) {} }, [size]);
  const boardFlex = 1 + size * 2.4;      // see-saw weights — board grows…
  const findingsFlex = 3 - size * 1.9;   // …findings shrinks

  useEffectExam(() => { if (pending && doneKeys.includes(pending)) { setSelected(pending); setPending(null); } }, [examined]);

  const tap = (key) => {
    if (doneKeys.includes(key)) { setSelected(key); return; }
    setPending(key); setSelected(key); onExamine(key);
  };
  const remaining = EXAM_REGIONS.filter(r => !doneKeys.includes(r.key));

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>
      <div style={{ padding: "14px 18px 6px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--color-text-secondary)" }}>Physical exam</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <SizeControl size={size} step={1 / 4} onStep={stepSize} />
            <Chip tone={doneKeys.length ? "success" : "neutral"} icon={doneKeys.length ? "check" : "stethoscope"}>{doneKeys.length}/{EXAM_REGIONS.length} examined</Chip>
          </div>
        </div>
        <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 5 }}>Tap a glowing point on {caseId === "gdv_001" ? "Biscuit" : "Pepper"} to examine that area.</div>
      </div>

      {/* anatomy board — flex see-saw region; dog wrapper fills the height via aspect-ratio, hotspots are % of it so they stay aligned at any size */}
      <div style={{ margin: "10px 16px 4px", flex: `${boardFlex} 1 0`, minHeight: 92, position: "relative", borderRadius: "var(--border-radius-lg)", overflow: "hidden",
        background: "var(--color-background-secondary)", border: "1px solid var(--color-border-tertiary)", display: "grid", placeItems: "center", transition: "flex-grow .25s cubic-bezier(.2,.8,.2,1)" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(var(--color-border-tertiary) 1px, transparent 1px)", backgroundSize: "16px 16px", opacity: 0.5 }} />
        <div style={{ position: "relative", height: "92%", maxWidth: "94%", aspectRatio: "400 / 260" }}>
          <DogLateral furTone={furTone} />
          {EXAM_REGIONS.map(r => (
            <Hotspot key={r.key} region={r} onTap={tap}
              state={doneKeys.includes(r.key) ? "done" : (pending === r.key ? "examining" : "idle")} />
          ))}
        </div>
      </div>

      {/* quick-pick remaining regions */}
      {remaining.length > 0 && (
        <div style={{ padding: "8px 16px 4px", display: "flex", gap: 7, flexWrap: "wrap", flexShrink: 0 }}>
          {remaining.map(r => (
            <button key={r.key} onClick={() => tap(r.key)} disabled={pending === r.key}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, padding: "6px 11px", borderRadius: 99,
                cursor: "pointer", background: "var(--color-background-primary)", border: "1px dashed var(--color-border-secondary)", color: "var(--color-text-secondary)", fontFamily: "var(--font-sans)" }}>
              <Icon name={window.REGION_ICONS[r.key] || "stethoscope"} size={13} stroke={2.2} />{r.label}
            </button>
          ))}
        </div>
      )}

      {/* selected finding detail — flexible scroll region (shrinks as the patient grows) */}
      <div style={{ padding: "10px 16px 16px", flex: `${findingsFlex} 1 0`, minHeight: 0, overflowY: "auto" }}>
        {selected ? (
          <div style={{ borderRadius: "var(--border-radius-md)", border: "1px solid var(--color-border-tertiary)", background: "var(--color-background-primary)", overflow: "hidden", boxShadow: "var(--ds-shadow-card)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderBottom: "1px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)" }}>
              <span style={{ width: 30, height: 30, borderRadius: 9, display: "grid", placeItems: "center", background: "var(--color-background-info)", color: "var(--color-text-info)" }}><Icon name={window.REGION_ICONS[selected] || "stethoscope"} size={17} stroke={2.2} /></span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--color-text-primary)", textTransform: "capitalize" }}>{(EXAM_REGIONS.find(r => r.key === selected) || {}).label || selected.replace(/_/g, " ")}</span>
              {findingFor(selected) && <Chip tone="success" icon="check" >Examined</Chip>}
            </div>
            <div style={{ padding: "13px 15px", fontSize: 14, lineHeight: 1.6, color: "var(--color-text-primary)", textWrap: "pretty" }}>
              {findingFor(selected) || <span style={{ color: "var(--color-text-secondary)", fontStyle: "italic" }}>Examining…</span>}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "18px 16px", color: "var(--color-text-secondary)", fontSize: 13 }}>
            Findings appear here as you examine. {examined.length > 0 && "Tap a green point to revisit it."}
          </div>
        )}

        {examined.length > 1 && (
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--color-text-secondary)", marginBottom: 8 }}>Exam chart</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {examined.map((e, i) => (
                <button key={i} onClick={() => setSelected(e.subtype)} style={{ display: "flex", gap: 9, alignItems: "flex-start", textAlign: "left", cursor: "pointer", padding: "8px 11px", borderRadius: "var(--border-radius-sm)",
                  background: selected === e.subtype ? "var(--color-background-info)" : "transparent", border: `1px solid ${selected === e.subtype ? "var(--color-border-info)" : "transparent"}`, fontFamily: "var(--font-sans)" }}>
                  <span style={{ color: "var(--ds-good)", marginTop: 1 }}><Icon name="check" size={14} stroke={2.6} /></span>
                  <span style={{ fontSize: 12.5, lineHeight: 1.5, color: "var(--color-text-secondary)" }}>
                    <strong style={{ color: "var(--color-text-primary)", textTransform: "capitalize" }}>{e.subtype.replace(/_/g, " ")}: </strong>{e.finding}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

window.ExamPanel = ExamPanel;
window.DogLateral = DogLateral;
