// room-panels.jsx — slide-up "supply drawer" panels for tests, treatments,
// disposition, plus the diagnostic report modal. Styled as warm paper on a tray.
const { useState: useStatePanel } = React;

// generic drawer shell that slides up from the bottom of the canvas
function Drawer({ title, sub, icon, onClose, accent = "var(--ds-accent)", children, footer }) {
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 88, top: 232, zIndex: 40, display: "flex", flexDirection: "column" }}>
      {/* scrim above drawer */}
      <div onClick={onClose} style={{ position: "absolute", left: 0, right: 0, top: -232, height: 232, background: "rgba(30,18,8,0.28)", cursor: "pointer" }} />
      <div style={{ flex: 1, margin: "0 26px", borderRadius: "20px", overflow: "hidden", display: "flex", flexDirection: "column",
        background: "linear-gradient(180deg,#FFFDF9,#F7F0E5)", border: "1px solid var(--color-border-secondary)",
        boxShadow: "0 -16px 40px rgba(40,22,10,0.28)" }}>
        {/* handle */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 8 }}>
          <div style={{ width: 44, height: 5, borderRadius: 99, background: "var(--color-border-secondary)" }} />
        </div>
        {/* header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 22px 12px", borderBottom: "1px solid var(--color-border-tertiary)" }}>
          <span style={{ width: 38, height: 38, borderRadius: 11, display: "grid", placeItems: "center", background: "var(--ds-accent-soft)", color: accent }}>
            <window.Icon name={icon} size={21} stroke={2.2} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 700, color: "var(--color-text-primary)" }}>{title}</div>
            <div style={{ fontSize: 12.5, color: "var(--color-text-secondary)" }}>{sub}</div>
          </div>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: 10, border: "1px solid var(--color-border-secondary)", background: "var(--color-background-primary)", color: "var(--color-text-secondary)", cursor: "pointer", display: "grid", placeItems: "center" }}>
            <window.Icon name="close" size={18} stroke={2.2} />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 22px" }}>{children}</div>
        {footer && <div style={{ padding: "12px 22px", borderTop: "1px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)" }}>{footer}</div>}
      </div>
    </div>
  );
}

const TIER_LABEL = { low: "$", medium: "$$", high: "$$$" };

// ── Tests drawer (run diagnostics) ──
function TestDrawer({ testsRun, onRun, onClose }) {
  const cats = {};
  window.DIAGNOSTICS.forEach(d => { (cats[d.category] = cats[d.category] || []).push(d); });
  return (
    <Drawer title="Diagnostics bench" sub="Pick a sample or scan — the lab terminal reads the result back." icon="microscope" onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {Object.entries(cats).map(([cat, items]) => (
          <div key={cat}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 9 }}>
              <span style={{ color: "var(--color-text-info)" }}><window.Icon name={window.CATEGORY_ICONS[cat] || "flask"} size={15} stroke={2.2} /></span>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--color-text-secondary)" }}>{cat}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: 8 }}>
              {items.map(t => {
                const done = testsRun.includes(t.key);
                return (
                  <button key={t.key} onClick={() => onRun(t.key)} disabled={done}
                    style={{ display: "flex", alignItems: "center", gap: 9, textAlign: "left", padding: "9px 12px", borderRadius: "var(--border-radius-md)", cursor: done ? "default" : "pointer", fontFamily: "var(--font-sans)",
                      background: done ? "var(--color-background-success)" : "var(--color-background-primary)", border: `1px solid ${done ? "var(--color-border-success)" : "var(--color-border-secondary)"}` }}>
                    <span style={{ color: done ? "var(--color-text-success)" : "var(--color-text-info)" }}><window.Icon name={done ? "check" : (window.CATEGORY_ICONS[t.category] || "flask")} size={16} stroke={2.2} /></span>
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)", lineHeight: 1.2 }}>{t.label}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-text-secondary)" }}>{TIER_LABEL[t.cost_tier]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Drawer>
  );
}

// ── Treatment drawer — grouped by route. group: "inj" (fridge) | "oral" (cabinet) ──
function TreatDrawer({ group, applied, onApply, onClose }) {
  const [sel, setSel] = useStatePanel([]);
  const injTypes = ["injectable", "intervention", "surgery"];
  const oralTypes = ["oral", "topical"];
  const want = group === "inj" ? injTypes : oralTypes;
  const items = window.ACTIONS.filter(a => want.includes(a.type));
  const title = group === "inj" ? "Refrigerated & injectable treatments" : "Oral & topical medications";
  const sub = group === "inj" ? "Injectables and in-clinic procedures from the fridge & trolley. Build a plan, then administer." : "Take-home tablets and topical preparations from the pharmacy. Build the script, then dispense.";
  const icon = group === "inj" ? "syringe" : "pill";
  const toggle = id => setSel(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const fresh = sel.filter(id => !applied.includes(id));
  return (
    <Drawer title={title} sub={sub} icon={icon} onClose={onClose}
      footer={
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <span style={{ fontSize: 12.5, color: "var(--color-text-secondary)" }}>{fresh.length ? `${fresh.length} selected` : "Select one or more items"}</span>
          <window.Btn icon={icon} disabled={!fresh.length} onClick={() => { onApply(fresh); setSel([]); }}>{group === "inj" ? "Administer" : "Dispense"}</window.Btn>
        </div>
      }>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px,1fr))", gap: 8 }}>
        {items.map(a => {
          const isApplied = applied.includes(a.id);
          const on = sel.includes(a.id) || isApplied;
          return (
            <button key={a.id} onClick={() => !isApplied && toggle(a.id)} disabled={isApplied}
              style={{ display: "flex", alignItems: "center", gap: 10, textAlign: "left", padding: "10px 12px", borderRadius: "var(--border-radius-md)", cursor: isApplied ? "default" : "pointer", fontFamily: "var(--font-sans)",
                background: isApplied ? "var(--color-background-success)" : on ? "var(--ds-accent-soft)" : "var(--color-background-primary)",
                border: `1.5px solid ${isApplied ? "var(--color-border-success)" : on ? "var(--ds-accent)" : "var(--color-border-secondary)"}` }}>
              <span style={{ width: 22, height: 22, borderRadius: 7, flexShrink: 0, display: "grid", placeItems: "center",
                background: isApplied ? "var(--ds-good)" : on ? "var(--ds-accent)" : "var(--color-background-tertiary)", color: isApplied || on ? "#fff" : "var(--color-text-secondary)" }}>
                <window.Icon name={isApplied ? "check" : (a.type === "oral" ? "pill" : a.type === "topical" ? "drop2" : a.type === "intervention" ? "stethoscope" : "syringe")} size={13} stroke={2.4} />
              </span>
              <span style={{ flex: 1, fontSize: 12.5, fontWeight: 600, color: "var(--color-text-primary)", lineHeight: 1.25 }}>{a.name}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-text-secondary)" }}>{TIER_LABEL[a.cost_tier]}</span>
            </button>
          );
        })}
      </div>
    </Drawer>
  );
}

// ── Differentials drawer (reasoning log) ──
function DiffDrawer({ logged, onLog, onClose }) {
  const [q, setQ] = useStatePanel("");
  const cats = {};
  window.DIAGNOSES.forEach(d => { (cats[d.category] = cats[d.category] || []).push(d); });
  const ql = q.trim().toLowerCase();
  return (
    <Drawer title="Differential list" sub="Log every diagnosis you're weighing. This is reasoning — not your final answer." icon="list" onClose={onClose}
      footer={<div style={{ fontSize: 12.5, color: "var(--color-text-secondary)" }}>{logged.length} logged · revisit and rule out as evidence comes in</div>}>
      <div style={{ position: "sticky", top: -16, zIndex: 2, paddingBottom: 10, background: "linear-gradient(180deg,#FFFDF9 70%,rgba(255,253,249,0))" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 11, background: "var(--color-background-primary)", border: "1px solid var(--color-border-secondary)" }}>
          <window.Icon name="search" size={16} stroke={2.2} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search diagnoses…"
            style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 13.5, color: "var(--color-text-primary)" }} />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {Object.entries(cats).map(([cat, items]) => {
          const vis = items.filter(d => !ql || d.label.toLowerCase().includes(ql) || cat.toLowerCase().includes(ql));
          if (!vis.length) return null;
          return (
            <div key={cat}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-text-secondary)", marginBottom: 8 }}>{cat}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: 8 }}>
                {vis.map(d => {
                  const on = logged.includes(d.id);
                  return (
                    <button key={d.id} onClick={() => onLog(d.id)}
                      style={{ display: "flex", alignItems: "center", gap: 9, textAlign: "left", padding: "9px 12px", borderRadius: "var(--border-radius-md)", cursor: "pointer", fontFamily: "var(--font-sans)",
                        background: on ? "var(--ds-accent-soft)" : "var(--color-background-primary)", border: `1.5px solid ${on ? "var(--ds-accent)" : "var(--color-border-secondary)"}` }}>
                      <span style={{ width: 18, height: 18, borderRadius: 6, flexShrink: 0, display: "grid", placeItems: "center", background: on ? "var(--ds-accent)" : "var(--color-background-tertiary)", color: on ? "#fff" : "var(--color-text-secondary)" }}>
                        <window.Icon name={on ? "check" : "chevron"} size={12} stroke={2.6} />
                      </span>
                      <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)", lineHeight: 1.2 }}>{d.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Drawer>
  );
}

// ── History / patient chart ──

function HistoryPanel({ caseId, patient, onClose }) {
  const p = patient || {};
  const facts = [
    ["Breed", p.breed], ["Age", p.age != null ? `${p.age} yr` : "—"], ["Sex", p.sex], ["Weight", p.weight_kg != null ? `${p.weight_kg} kg` : "—"],
  ];
  return (
    <Drawer title={`${p.name || "Patient"} — patient chart`} sub="Signalment, history, current medication & intake notes." icon="clipboard" onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* signalment (live patient data) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
          {facts.map(([k, v]) => (
            <div key={k} style={{ padding: "9px 12px", borderRadius: "var(--border-radius-sm)", background: "var(--color-background-secondary)", border: "1px solid var(--color-border-tertiary)" }}>
              <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-text-secondary)" }}>{k}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text-primary)", marginTop: 2 }}>{v || "—"}</div>
            </div>
          ))}
        </div>
        {/* placeholder for backend-supplied chart content */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { label: "Nurse intake report", icon: "clipboard" },
            { label: "Current / recent medication", icon: "pill" },
            { label: "Presenting history", icon: "list" },
            { label: "Prior visits", icon: "chat" },
          ].map(s => (
            <div key={s.label} style={{ padding: "14px 15px", borderRadius: "var(--border-radius-md)", background: "var(--color-background-primary)", border: "1.5px dashed var(--color-border-secondary)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
                <span style={{ color: "var(--color-text-secondary)" }}><window.Icon name={s.icon} size={15} stroke={2.2} /></span>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--color-text-secondary)" }}>{s.label}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[88, 72, 60].map((w, i) => <div key={i} style={{ height: 6, width: `${w}%`, borderRadius: 3, background: "var(--color-background-tertiary)" }} />)}
              </div>
            </div>
          ))}
        </div>
        {/* note */}
        <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "11px 14px", borderRadius: "var(--border-radius-md)", background: "var(--color-background-info)", border: "1px solid var(--color-border-info)" }}>
          <span style={{ color: "var(--color-text-info)" }}><window.Icon name="info" size={16} stroke={2.2} /></span>
          <span style={{ fontSize: 13, lineHeight: 1.5, color: "var(--color-text-primary)" }}>Chart content is populated from the case record — placeholder shown in this UI preview.</span>
        </div>
      </div>
    </Drawer>
  );
}

// ── Disposition / wrap-up drawer ──
function WrapDrawer({ onConfirm, onClose }) {
  const [pick, setPick] = useStatePanel(null);
  const items = window.ACTIONS.filter(a => a.type === "disposition");
  return (
    <Drawer title="Close the consult" sub="Decide where Pepper goes from here. This ends the visit and scores your work." icon="hospital" onClose={onClose}
      footer={
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <span style={{ fontSize: 12.5, color: "var(--color-text-secondary)" }}>{pick ? items.find(i => i.id === pick).name : "Choose a disposition"}</span>
          <window.Btn icon="arrow" iconRight="check" disabled={!pick} onClick={() => onConfirm(pick)}>Finish & grade</window.Btn>
        </div>
      }>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {items.map(a => {
          const on = pick === a.id;
          return (
            <button key={a.id} onClick={() => setPick(a.id)}
              style={{ display: "flex", alignItems: "center", gap: 12, textAlign: "left", padding: "13px 15px", borderRadius: "var(--border-radius-md)", cursor: "pointer", fontFamily: "var(--font-sans)",
                background: on ? "var(--ds-accent-soft)" : "var(--color-background-primary)", border: `1.5px solid ${on ? "var(--ds-accent)" : "var(--color-border-secondary)"}` }}>
              <span style={{ width: 28, height: 28, borderRadius: 9, flexShrink: 0, display: "grid", placeItems: "center", background: on ? "var(--ds-accent)" : "var(--color-background-tertiary)", color: on ? "#fff" : "var(--color-text-secondary)" }}>
                <window.Icon name="hospital" size={16} stroke={2.2} />
              </span>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)" }}>{a.name}</span>
              {on && <span style={{ color: "var(--ds-accent)" }}><window.Icon name="check" size={18} stroke={2.6} /></span>}
            </button>
          );
        })}
      </div>
    </Drawer>
  );
}

// ── Diagnostic report modal (lab read-out) ──
function ReportModal({ test, onClose }) {
  if (!test) return null;
  const simlab = test.report_format === "simlab";
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 80, background: "rgba(30,18,8,0.55)", display: "grid", placeItems: "center", padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "min(540px,94vw)", maxHeight: "86vh", overflowY: "auto", borderRadius: "var(--border-radius-lg)", background: "var(--color-background-primary)", boxShadow: "var(--ds-shadow-pop)" }}>
        {/* report header */}
        <div style={{ padding: "16px 20px", background: simlab ? "#243042" : "var(--color-background-secondary)", color: simlab ? "#EAF1F6" : "var(--color-text-primary)", display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: "var(--border-radius-lg) var(--border-radius-lg) 0 0" }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700 }}>{simlab ? "SimLab Diagnostics" : "Vetsim Animal Hospital"}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, opacity: 0.8 }}>{test.label} · Patient: Pepper</div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, border: "none", background: simlab ? "rgba(255,255,255,0.14)" : "var(--color-background-tertiary)", color: "inherit", cursor: "pointer", display: "grid", placeItems: "center" }}>
            <window.Icon name="close" size={17} stroke={2.2} />
          </button>
        </div>
        <div style={{ padding: "18px 20px" }}>
          {test.procedure_details && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 14, padding: "10px 12px", borderRadius: "var(--border-radius-sm)", background: "var(--color-background-secondary)", fontSize: 12 }}>
              {Object.entries(test.procedure_details).map(([k, v]) => (
                <div key={k}><span style={{ color: "var(--color-text-secondary)", textTransform: "capitalize" }}>{k}: </span><span style={{ fontWeight: 600 }}>{v}</span></div>
              ))}
            </div>
          )}
          {test.reference_ranges && (
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-mono)", fontSize: 12.5, marginBottom: 14 }}>
              <thead><tr style={{ textAlign: "left", color: "var(--color-text-secondary)", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                <th style={{ padding: "5px 4px" }}>Analyte</th><th>Result</th><th>Reference</th></tr></thead>
              <tbody>
                {Object.entries(test.reference_ranges).map(([k, r]) => {
                  const out = r.value < r.low || r.value > r.high;
                  return (
                    <tr key={k} style={{ borderTop: "1px solid var(--color-border-tertiary)" }}>
                      <td style={{ padding: "6px 4px", color: "var(--color-text-primary)" }}>{k}</td>
                      <td style={{ fontWeight: 700, color: out ? "var(--color-text-danger)" : "var(--color-text-primary)" }}>{r.value} {r.unit}{out ? (r.value > r.high ? " ↑" : " ↓") : ""}</td>
                      <td style={{ color: "var(--color-text-secondary)" }}>{r.low}–{r.high}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-secondary)", marginBottom: 6 }}>Findings</div>
          <div style={{ fontSize: 14, lineHeight: 1.6, color: "var(--color-text-primary)", textWrap: "pretty" }}>{test.result_text}</div>
          {test.interpretation && (
            <div style={{ marginTop: 14, padding: "11px 13px", borderRadius: "var(--border-radius-sm)", background: "var(--color-background-info)", border: "1px solid var(--color-border-info)" }}>
              <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-text-info)", marginBottom: 4 }}>Interpretation</div>
              <div style={{ fontSize: 13, lineHeight: 1.55, color: "var(--color-text-primary)" }}>{test.interpretation}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { RoomDrawer: Drawer, TestDrawer, TreatDrawer, DiffDrawer, HistoryPanel, WrapDrawer, ReportModal });
