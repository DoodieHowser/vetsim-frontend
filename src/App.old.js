import { useState, useRef, useEffect, useMemo } from "react";
import pepperImg from "./images/pepper.png";
import pepperVentralImg from "./images/pepper_ventral.png";
import pepperFrontalImg from "./images/pepper_frontal.png";
import pepperCaudalImg from "./images/pepper_caudal.png";
import biscuitImg from "./images/biscuit.png";
import biscuitVentralImg from "./images/biscuit_ventral.png";
import biscuitFrontalImg from "./images/biscuit_frontal.png";
import biscuitCaudalImg from "./images/biscuit_caudal.png";
import pepperSkinImg from "./images/Pepper_skin.png";
import pepperEarImg from "./images/Pepper_ear.png";
import pepperPawImg from "./images/Pepper_paw.png";
import pepperAbdomenImg from "./images/Pepper_abdomen.png";
import pepperGeneralImg from "./images/Pepper_general.png";
import pepperCardiovascularImg from "./images/Pepper_cardiovascular.png";
import pepperRespiratoryImg from "./images/Pepper_Respiratory.png";
import pepperTemperatureImg from "./images/Pepper_temperature.png";
import pepperHydrationImg from "./images/Pepper_hydration.png";
import pepperLymphNodesImg from "./images/Pepper_lymph_nodes.png";
import biscuitGeneralImg from "./images/Biscuit_general.png";
import biscuitAbdomenImg from "./images/Biscuit_abdomen.png";
import biscuitCardiovascularImg from "./images/Biscuit_cardiovascular.png";
import biscuitRespiratoryImg from "./images/Biscuit_respiratory.png";
import biscuitTemperatureImg from "./images/Biscuit_temperature.png";
import biscuitHydrationImg from "./images/Biscuit_hydration.png";
import biscuitSkinImg from "./images/Biscuit_skin.png";
import biscuitEarsImg from "./images/Biscuit_ears.png";
import biscuitPawsImg from "./images/Biscuit_paws.png";
import biscuitLymphNodesImg from "./images/Biscuit_lymph_nodes.png";

const API = "http://localhost:3000";

const CASE_OPTIONS = [
  { id: "derm_001", label: "Pepper — Chronic itching", sub: "French Bulldog · Medium", emoji: "🐾" },
  { id: "gdv_001", label: "Biscuit — Emergency GDV", sub: "Labrador mix · Hard", emoji: "🚨" },
];



// Each SVG uses the image's native pixel dimensions as its viewBox so the full image
// is always visible with no cropping. Region coordinates are in original image pixel space.
// Label font sizes are calibrated to render ~8px on screen at a ~330px panel width.
const VIEWS = [
  {
    id: "lateral", label: "Lateral",
    image: pepperImg,
    origW: 1536, origH: 1024, labelFontSize: 38,
    regions: [
      { mapKey: "lat_temperature", key: "temperature", label: "Temp",    cx: 1300, cy:  380, rx:  90, ry:  70 },
      { mapKey: "lat_general",     key: "general",     label: "General", cx:  750, cy:  470, rx: 120, ry: 100 },
      { mapKey: "lat_skin",        key: "skin",        label: "Skin",    cx:  800, cy:  600, rx: 400, ry:  50 },
      { mapKey: "lat_lymph",       key: "lymph_nodes", label: "Lymph",   cx:  460, cy:  400, rx:  60, ry:  50 },
      { mapKey: "lat_paws",        key: "paws",        label: "Paws",    cx:  440, cy:  920, rx: 100, ry:  50 },
      { mapKey: "lat_ears",        key: "ears",        label: "Ears",    cx:  265, cy:  155, rx:  58, ry:  88 },
      { mapKey: "lat_eyes",        key: "eyes",        label: "Eyes",    cx:  155, cy:  290, rx:  50, ry:  40 },
    ],
  },
  {
    id: "ventral", label: "Ventral",
    image: pepperVentralImg,
    origW: 1024, origH: 1536, labelFontSize: 26,
    regions: [
      { mapKey: "ven_hydration", key: "hydration", label: "Hydration", cx: 510, cy:  340, rx: 140, ry:  70 },
      { mapKey: "ven_abdomen",   key: "abdomen",   label: "Abdomen",   cx: 510, cy:  720, rx: 150, ry: 120 },
      { mapKey: "ven_skin",      key: "skin",      label: "Skin",      cx: 510, cy:  980, rx: 280, ry: 160 },
    ],
  },
  {
    id: "frontal", label: "Frontal",
    image: pepperFrontalImg,
    origW: 1122, origH: 1402, labelFontSize: 28,
    regions: [
      { mapKey: "frt_ears",         key: "ears",           label: "Ears",   cx:  210, cy: 175, rx: 130, ry: 115 },
      { mapKey: "frt_eyes",         key: "eyes",           label: "Eyes",   cx:  370, cy: 430, rx:  80, ry:  60 },
      { mapKey: "frt_respiratory",  key: "respiratory",    label: "Lungs",  cx:  561, cy: 700, rx: 240, ry: 155 },
      { mapKey: "frt_cardio",       key: "cardiovascular", label: "Heart",  cx:  650, cy: 660, rx: 130, ry: 110 },
      { mapKey: "frt_elbows",       key: "elbows",         label: "Elbows", cx:  195, cy: 870, rx: 120, ry:  80 },
    ],
  },
  {
    id: "caudal", label: "Caudal",
    image: pepperCaudalImg,
    origW: 1122, origH: 1402, labelFontSize: 28,
    regions: [
      { mapKey: "cau_temperature", key: "temperature", label: "Temp", cx: 560, cy:  510, rx: 100, ry:  80 },
      { mapKey: "cau_paws",        key: "paws",        label: "Paws", cx: 310, cy: 1290, rx: 120, ry:  60 },
    ],
  },
];

// GDV (Biscuit) exam views — dog faces RIGHT in lateral.
const BISCUIT_VIEWS = [
  {
    id: "lateral", label: "Lateral",
    image: biscuitImg,
    origW: 1536, origH: 1024, labelFontSize: 38,
    regions: [
      { mapKey: "lat_abdomen", key: "abdomen",        label: "Abdomen", cx:  680, cy: 640, rx: 250, ry: 140 },
      { mapKey: "lat_cardio",  key: "cardiovascular", label: "Heart",   cx: 1010, cy: 440, rx: 115, ry:  90 },
      { mapKey: "lat_general", key: "general",        label: "General", cx:  720, cy: 370, rx: 120, ry:  95 },
      { mapKey: "lat_temp",    key: "temperature",    label: "Temp",    cx:  220, cy: 340, rx:  90, ry:  70 },
      { mapKey: "lat_paws",    key: "paws",           label: "Paws",    cx: 1150, cy: 930, rx: 110, ry:  50 },
      { mapKey: "lat_eyes",    key: "eyes",           label: "Eyes",    cx: 1390, cy: 295, rx:  52, ry:  42 },
      { mapKey: "lat_ears",    key: "ears",           label: "Ears",    cx: 1345, cy: 220, rx:  65, ry:  90 },
    ],
  },
  {
    id: "ventral", label: "Ventral",
    image: biscuitVentralImg,
    origW: 1024, origH: 1536, labelFontSize: 26,
    regions: [
      { mapKey: "ven_hydration", key: "hydration", label: "Hydration", cx: 512, cy:  290, rx: 140, ry:  70 },
      { mapKey: "ven_abdomen",   key: "abdomen",   label: "Abdomen",   cx: 512, cy:  820, rx: 400, ry: 290 },
    ],
  },
  {
    id: "frontal", label: "Frontal",
    image: biscuitFrontalImg,
    origW: 1122, origH: 1402, labelFontSize: 28,
    regions: [
      { mapKey: "frt_ears",        key: "ears",           label: "Ears",    cx: 185, cy: 290, rx: 115, ry: 110 },
      { mapKey: "frt_eyes",        key: "eyes",           label: "Eyes",    cx: 385, cy: 430, rx:  85, ry:  65 },
      { mapKey: "frt_respiratory", key: "respiratory",    label: "Lungs",   cx: 561, cy: 620, rx: 250, ry: 165 },
      { mapKey: "frt_cardio",      key: "cardiovascular", label: "Heart",   cx: 650, cy: 590, rx: 155, ry: 120 },
      { mapKey: "frt_abdomen",     key: "abdomen",        label: "Abdomen", cx: 561, cy: 920, rx: 280, ry: 130 },
      { mapKey: "frt_elbows",      key: "elbows",         label: "Elbows",  cx: 195, cy: 870, rx: 120, ry:  80 },
    ],
  },
  {
    id: "caudal", label: "Caudal",
    image: biscuitCaudalImg,
    origW: 1024, origH: 1536, labelFontSize: 26,
    regions: [
      { mapKey: "cau_temperature", key: "temperature", label: "Temp", cx: 512, cy:  475, rx: 110, ry:  85 },
      { mapKey: "cau_paws",        key: "paws",        label: "Paws", cx: 290, cy: 1390, rx:  95, ry:  55 },
    ],
  },
];

const ACTION_TYPE_ORDER = ["injectable", "intervention", "oral", "topical"];
const ACTION_TYPE_LABELS = { injectable: "Injectables", intervention: "Interventions", oral: "Oral medications", topical: "Topical treatments" };

const DIAGNOSTICS_CATEGORY_ORDER = [
  "Point-of-Care",
  "Rapid / SNAP Tests",
  "Dermatology & Cytology",
  "Blood & Biochemistry",
  "Urine & Faecal",
  "Microbiology",
  "Imaging",
  "Cardiac & Neurological",
  "Biopsy & Histopathology",
  "Diet & Trials",
  "Allergy / Immunology",
];

const DIAGNOSIS_CATEGORY_ORDER = [
  "Dermatology",
  "Digestive",
  "Musculoskeletal",
  "Cardiovascular",
  "Respiratory",
  "Endocrine",
  "Urinary",
  "Neurological",
  "Infectious / Immune",
  "Oncology",
];

function getViews(caseId) { return caseId === "gdv_001" ? BISCUIT_VIEWS : VIEWS; }

const PEPPER_CLOSEUPS = {
  skin: pepperSkinImg,
  ears: pepperEarImg,
  paws: pepperPawImg,
  abdomen: pepperAbdomenImg,
  general: pepperGeneralImg,
  cardiovascular: pepperCardiovascularImg,
  respiratory: pepperRespiratoryImg,
  temperature: pepperTemperatureImg,
  hydration: pepperHydrationImg,
  lymph_nodes: pepperLymphNodesImg,
};
const BISCUIT_CLOSEUPS = {
  general: biscuitGeneralImg,
  abdomen: biscuitAbdomenImg,
  cardiovascular: biscuitCardiovascularImg,
  respiratory: biscuitRespiratoryImg,
  temperature: biscuitTemperatureImg,
  hydration: biscuitHydrationImg,
  skin: biscuitSkinImg,
  ears: biscuitEarsImg,
  paws: biscuitPawsImg,
  lymph_nodes: biscuitLymphNodesImg,
};
function getCloseups(caseId) {
  if (caseId === "derm_001") return PEPPER_CLOSEUPS;
  if (caseId === "gdv_001") return BISCUIT_CLOSEUPS;
  return {};
}

function groupActionsByType(actions) {
  const map = {};
  for (const a of actions) {
    const t = a.type || "other";
    if (!map[t]) map[t] = [];
    map[t].push(a);
  }
  return map;
}

function ScoreBar({ label, value, color }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontSize: 10, fontWeight: 500, color: "var(--color-text-secondary)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</span>
        <span style={{ fontSize: 11, fontWeight: 500, color: "var(--color-text-primary)" }}>{value}</span>
      </div>
      <div style={{ height: 3, background: "var(--color-background-tertiary)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${value}%`, background: color, borderRadius: 2, transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
}

function ChatMessage({ msg, onViewResult }) {
  if (msg.role === "test_result") return (
    <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
      <div style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--color-background-tertiary)", border: "0.5px solid var(--color-border-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 500, color: "var(--color-text-secondary)", flexShrink: 0 }}>⚕</div>
      <div style={{ maxWidth: "85%", padding: "8px 12px", borderRadius: 10, borderBottomLeftRadius: 3, fontSize: 13, lineHeight: 1.55, background: "var(--color-background-tertiary)", color: "var(--color-text-primary)" }}>
        <div style={{ fontWeight: 600, marginBottom: 2 }}>{msg.testLabel}</div>
        <div>{msg.text}</div>
        <button
          onClick={() => onViewResult && onViewResult(msg.testKey)}
          style={{ marginTop: 4, padding: 0, background: "none", border: "none", color: "var(--color-text-info)", fontSize: 12, fontWeight: 500, cursor: "pointer", textDecoration: "underline" }}
        >
          View result
        </button>
      </div>
    </div>
  );
  if (msg.role === "player") return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
      <div style={{ maxWidth: "78%", padding: "8px 12px", borderRadius: 10, borderBottomRightRadius: 3, fontSize: 13, lineHeight: 1.55, background: "var(--color-background-info)", color: "var(--color-text-info)" }}>{msg.text}</div>
    </div>
  );
  if (msg.role === "reaction") return (
    <div style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
      <div style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--color-background-warning)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>⚡</div>
      <div style={{ maxWidth: "78%", padding: "8px 12px", borderRadius: 10, borderBottomLeftRadius: 3, fontSize: 13, lineHeight: 1.55, background: "var(--color-background-warning)", color: "var(--color-text-warning)", fontStyle: "italic" }}>
        {msg.text}
        {msg.trustDelta && <span style={{ display: "block", fontSize: 11, marginTop: 3, opacity: 0.8 }}>Trust {msg.trustDelta} · {msg.newEmotion}</span>}
      </div>
    </div>
  );
  if (msg.role === "outcome") return (
    <div style={{ marginBottom: 8, padding: "10px 12px", background: "var(--color-background-success)", border: "0.5px solid var(--color-border-success)", borderRadius: 8, fontSize: 13, lineHeight: 1.55, color: "var(--color-text-success)" }}>
      <span style={{ fontSize: 10, fontWeight: 500, display: "block", marginBottom: 3, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.8 }}>Outcome</span>
      {msg.text}
    </div>
  );
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
      <div style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--color-background-tertiary)", border: "0.5px solid var(--color-border-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 500, color: "var(--color-text-secondary)", flexShrink: 0 }}>
        {msg.speaker === "owner" ? "OW" : "⚕"}
      </div>
      <div>
        <div style={{ fontSize: 10, color: "var(--color-text-secondary)", marginBottom: 2, fontWeight: 500, textTransform: "capitalize" }}>{msg.speaker === "owner" ? "Owner" : "Narrator"}</div>
        <div style={{ maxWidth: "85%", padding: "8px 12px", borderRadius: 10, borderBottomLeftRadius: 3, fontSize: 13, lineHeight: 1.55, background: msg.speaker === "owner" ? "var(--color-background-secondary)" : "var(--color-background-tertiary)", color: "var(--color-text-primary)" }}>{msg.text}</div>
        {msg.effects && msg.effects.length > 0 && (
          <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
            {msg.effects.map((e, i) => <span key={i} style={{ fontSize: 10, padding: "2px 6px", borderRadius: 99, background: "var(--color-background-tertiary)", color: "var(--color-text-secondary)", border: "0.5px solid var(--color-border-tertiary)" }}>{e}</span>)}
          </div>
        )}
      </div>
    </div>
  );
}

function DogBodyDiagram({ views, examined, examHealthImpacts, onExamine, closeupImages = {} }) {
  const [activeViewIdx, setActiveViewIdx] = useState(0);
  const [selectedArea, setSelectedArea] = useState(null);

  useEffect(() => { setActiveViewIdx(0); setSelectedArea(null); }, [views]);

  const examLookup = {};
  for (const f of examined) {
    examLookup[f.subtype] = examHealthImpacts[f.subtype] !== undefined
      ? examHealthImpacts[f.subtype]
      : { impact: 0, available: true };
  }

  // Collect unique exam areas from all views — generic for any case
  const seenKeys = new Set();
  const examAreas = [];
  for (const v of views) {
    for (const r of v.regions) {
      if (!seenKeys.has(r.key)) {
        seenKeys.add(r.key);
        examAreas.push({
          key: r.key,
          label: r.key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
        });
      }
    }
  }

  const view = views[activeViewIdx];
  const selectedFinding = selectedArea ? examined.find(e => e.subtype === selectedArea) : null;
  const selectedImpact = selectedArea && examLookup[selectedArea] ? examLookup[selectedArea] : null;

  const handleAreaTap = (key) => {
    if (examLookup[key]) return;
    setSelectedArea(key);
    onExamine(key);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>

      {/* View tabs */}
      <div style={{ display: "flex", flexShrink: 0, borderBottom: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)" }}>
        {views.map((v, i) => {
          const active = i === activeViewIdx;
          return (
            <button
              key={v.id}
              onClick={() => { setActiveViewIdx(i); setSelectedArea(null); }}
              style={{
                flex: 1, padding: "9px 4px", border: "none", cursor: "pointer",
                fontSize: 11, fontWeight: active ? 600 : 400,
                textTransform: "uppercase", letterSpacing: "0.05em",
                color: active ? "var(--color-text-info)" : "var(--color-text-secondary)",
                background: active ? "var(--color-background-primary)" : "transparent",
                borderBottom: `2px solid ${active ? "var(--color-border-info)" : "transparent"}`,
                transition: "color 0.15s, background 0.15s",
              }}
            >
              {v.label}
            </button>
          );
        })}
      </div>

      {/* Image area — relative container scopes the bottom sheet */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden", minHeight: 0 }}>

        {/* Overview image — always visible, never replaced */}
        <img
          src={view.image}
          alt={`${view.label} view`}
          style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
        />

        {/* SVG region overlay — viewBox matches native image px so coords align with objectFit:contain */}
        <svg
          viewBox={`0 0 ${view.origW} ${view.origH}`}
          preserveAspectRatio="xMidYMid meet"
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            pointerEvents: selectedArea ? "none" : "auto",
            zIndex: 5,
          }}
        >
          <defs>
            {/* Dark halo makes strokes visible on both light and dark coats */}
            <filter id="rgn-halo" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="0" stdDeviation={Math.round(view.origW * 0.007)} floodColor="rgba(0,0,0,0.9)" floodOpacity="1" />
            </filter>
          </defs>
          {view.regions.map(region => {
            const isExamined = !!examLookup[region.key];
            const isActive = selectedArea === region.key;
            const sw = Math.round(view.origW * 0.005);
            return (
              <g key={region.mapKey} onClick={() => handleAreaTap(region.key)} style={{ cursor: isExamined ? "default" : "pointer" }}>
                <ellipse
                  cx={region.cx} cy={region.cy} rx={region.rx} ry={region.ry}
                  fill={isExamined ? "rgba(34,197,94,0.18)" : isActive ? "rgba(59,130,246,0.22)" : "rgba(255,255,255,0.1)"}
                  stroke={isExamined ? "rgba(34,197,94,1)" : isActive ? "rgba(99,179,255,1)" : "rgba(255,255,255,0.95)"}
                  strokeWidth={isActive ? sw * 2 : sw * 1.4}
                  strokeDasharray={isExamined || isActive ? "none" : `${sw * 5} ${sw * 3}`}
                  filter="url(#rgn-halo)"
                />
                <text
                  x={region.cx} y={region.cy + region.ry + view.labelFontSize * 1.15}
                  textAnchor="middle" fontSize={view.labelFontSize}
                  fill="white"
                  stroke="rgba(0,0,0,0.85)"
                  strokeWidth={view.labelFontSize * 0.4}
                  paintOrder="stroke"
                  style={{ pointerEvents: "none", userSelect: "none", fontFamily: "Arial,sans-serif", fontWeight: 700 }}
                >
                  {region.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Backdrop — dims image and dismisses sheet on outside tap */}
        <div
          onClick={() => setSelectedArea(null)}
          style={{
            position: "absolute", inset: 0, zIndex: 10,
            background: selectedArea ? "rgba(0,0,0,0.28)" : "transparent",
            pointerEvents: selectedArea ? "auto" : "none",
            transition: "background 0.28s ease",
          }}
        />

        {/* Bottom sheet — slides up over image, scoped within image container */}
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            height: "62%",
            background: "var(--color-background-primary)",
            borderRadius: "14px 14px 0 0",
            boxShadow: "0 -4px 24px rgba(0,0,0,0.18)",
            zIndex: 11,
            display: "flex",
            flexDirection: "column",
            transform: selectedArea ? "translateY(0)" : "translateY(100%)",
            transition: "transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* Drag handle */}
          <div style={{ paddingTop: 10, paddingBottom: 2, display: "flex", justifyContent: "center", flexShrink: 0 }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--color-border-secondary)" }} />
          </div>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px 8px", flexShrink: 0, borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
            <div style={{ fontSize: 14, fontWeight: 600, textTransform: "capitalize", color: "var(--color-text-primary)" }}>
              {selectedArea ? selectedArea.replace(/_/g, " ") : ""}
            </div>
            <button
              onClick={() => setSelectedArea(null)}
              style={{
                width: 28, height: 28, borderRadius: "50%", border: "none", cursor: "pointer",
                background: "var(--color-background-tertiary)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1, flexShrink: 0,
              }}
            >
              ✕
            </button>
          </div>

          {/* Non-scrolling flex column — image takes remaining space, finding text pinned below */}
          <div style={{ flex: 1, overflow: "hidden", padding: "12px 16px 12px", display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }}>
            {/* Close-up image or placeholder — fills available height */}
            {closeupImages[selectedArea] ? (
              <img
                src={closeupImages[selectedArea]}
                alt={`${selectedArea} close-up`}
                style={{ flex: 1, minHeight: 0, width: "100%", objectFit: "contain", borderRadius: 8, display: "block" }}
              />
            ) : (
              <div style={{
                flex: 1, minHeight: 0,
                background: "var(--color-background-tertiary)",
                border: "0.5px solid var(--color-border-tertiary)",
                borderRadius: 8,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-border-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
                </svg>
                <span style={{ fontSize: 10, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.07em" }}>Close-up photo</span>
              </div>
            )}

            {/* Examining indicator — shown only while backend is processing */}
            {selectedArea && !selectedFinding && (
              <div style={{ flexShrink: 0, fontSize: 12, color: "var(--color-text-secondary)", fontStyle: "italic" }}>
                Examining…
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Exam area buttons — in flex flow, always outside and below the sheet */}
      <div style={{ flexShrink: 0, borderTop: "0.5px solid var(--color-border-tertiary)", padding: "6px 10px 8px", background: "var(--color-background-secondary)" }}>
        <div style={{ display: "flex", flexDirection: "row", gap: 5, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          {examAreas.map(area => {
            const isExamined = !!examLookup[area.key];
            const isExamining = selectedArea === area.key && !isExamined;
            return (
              <button
                key={area.key}
                onClick={() => handleAreaTap(area.key)}
                style={{
                  padding: "7px 10px", borderRadius: "var(--border-radius-md)", flexShrink: 0,
                  fontSize: 11, textAlign: "center", lineHeight: 1.3,
                  cursor: isExamined ? "default" : "pointer",
                  fontWeight: isExamining ? 600 : isExamined ? 500 : 400,
                  border: isExamining
                    ? "1.5px dashed var(--color-border-info)"
                    : isExamined
                      ? "1.5px solid var(--color-border-secondary)"
                      : "0.5px solid var(--color-border-tertiary)",
                  color: isExamining
                    ? "var(--color-text-info)"
                    : isExamined ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                  background: isExamining
                    ? "var(--color-background-info)"
                    : isExamined ? "var(--color-background-secondary)" : "var(--color-background-primary)",
                  opacity: isExamining ? 0.85 : 1,
                }}
              >
                {isExamined ? `✓ ${area.label}` : area.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Findings summary — fixed, never scrolls away */}
      {examined.length > 0 && (
        <div style={{ flexShrink: 0, borderTop: "0.5px solid var(--color-border-tertiary)", padding: "6px 12px 8px", maxHeight: 88, overflowY: "auto", background: "var(--color-background-primary)" }}>
          <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--color-text-secondary)", marginBottom: 4 }}>Findings</div>
          {examined.map((e, i) => (
            <div key={i} style={{ fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.55, marginBottom: 2 }}>
              <span style={{ fontWeight: 500, textTransform: "capitalize", color: "var(--color-text-primary)" }}>{e.subtype.replace(/_/g, " ")}: </span>{e.finding}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

function DiagnosticsPanel({ tests, onRun, onView, testsRun }) {
  const grouped = tests.reduce((acc, t) => {
    const cat = t.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(t);
    return acc;
  }, {});
  const orderedCats = DIAGNOSTICS_CATEGORY_ORDER.filter(c => grouped[c]);
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
      <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--color-text-secondary)", marginBottom: 12 }}>Select a test to run</div>
      {orderedCats.map(cat => (
        <div key={cat} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", fontWeight: 500, marginBottom: 6 }}>{cat}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {grouped[cat].map(t => {
              const done = testsRun.includes(t.key);
              return (
                <div key={t.key}>
                  <button onClick={() => done ? onView(t.key) : onRun(t.key)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 12px", borderRadius: "var(--border-radius-md)", border: done ? "0.5px solid var(--color-border-tertiary)" : "0.5px solid var(--color-border-secondary)", cursor: "pointer", textAlign: "left", background: done ? "var(--color-background-tertiary)" : "var(--color-background-primary)" }}>
                    <div style={{ fontSize: 13, color: "var(--color-text-primary)" }}>{t.label} {done ? "✓" : ""}</div>
                    <span style={{ fontSize: 11, color: done ? "var(--color-text-info)" : "var(--color-text-secondary)", flexShrink: 0, marginLeft: 8 }}>{done ? "View result" : (t.cost_tier === "high" ? "High cost" : t.cost_tier === "medium" ? "Medium cost" : "Low cost")}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function DiagnosisPanel({ diagnoses, onConfirm, attempted, selectedDiagnoses = [], onSelect }) {
  const [query, setQuery] = useState("");
  const [openCats, setOpenCats] = useState(new Set());

  const isSearching = query.trim().length > 0;
  const selectedIds = selectedDiagnoses.map(d => d.id);

  const filtered = isSearching
    ? diagnoses.filter(d => d.label.toLowerCase().includes(query.trim().toLowerCase()))
    : diagnoses;

  const grouped = filtered.reduce((acc, d) => {
    const cat = d.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(d);
    return acc;
  }, {});

  const orderedCats = DIAGNOSIS_CATEGORY_ORDER.filter(c => grouped[c]);

  const toggleCat = (cat) => {
    setOpenCats(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const isCatOpen = (cat) => isSearching || openCats.has(cat);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
      <div style={{ padding: "10px 1rem 6px", flexShrink: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--color-text-secondary)", marginBottom: 8 }}>Select your diagnosis</div>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search conditions…"
          style={{ width: "100%", fontSize: 13, padding: "7px 10px", borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-primary)", color: "var(--color-text-primary)", boxSizing: "border-box" }}
        />
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 1rem 1rem" }}>
        {orderedCats.length === 0 && (
          <div style={{ fontSize: 13, color: "var(--color-text-secondary)", padding: "12px 0" }}>No matching conditions.</div>
        )}
        {orderedCats.map(cat => {
          const items = grouped[cat];
          const open = isCatOpen(cat);
          const doneCount = items.filter(d => attempted.includes(d.id)).length;
          const selCount = items.filter(d => selectedIds.includes(d.id)).length;
          return (
            <div key={cat} style={{ marginBottom: 6 }}>
              <button
                onClick={() => !isSearching && toggleCat(cat)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "7px 10px",
                  background: "var(--color-background-secondary)",
                  border: "0.5px solid var(--color-border-tertiary)",
                  borderRadius: open ? "var(--border-radius-md) var(--border-radius-md) 0 0" : "var(--border-radius-md)",
                  cursor: isSearching ? "default" : "pointer",
                  textAlign: "left",
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{cat}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {selCount > 0 && <span style={{ fontSize: 10, color: "var(--color-text-info)", fontWeight: 600 }}>● {selCount}</span>}
                  {doneCount > 0 && <span style={{ fontSize: 10, color: "var(--color-text-success, #16a34a)" }}>✓ {doneCount}</span>}
                  <span style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>{items.length}</span>
                  {!isSearching && <span style={{ fontSize: 10, color: "var(--color-text-secondary)", marginLeft: 2 }}>{open ? "▲" : "▼"}</span>}
                </div>
              </button>
              {open && (
                <div style={{ border: "0.5px solid var(--color-border-tertiary)", borderTop: "none", borderRadius: "0 0 var(--border-radius-md) var(--border-radius-md)", overflow: "hidden" }}>
                  {items.map((d, i) => {
                    const done = attempted.includes(d.id);
                    const selected = selectedIds.includes(d.id);
                    return (
                      <button
                        key={d.id}
                        onClick={() => onSelect(d)}
                        style={{
                          width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                          padding: "8px 12px",
                          borderBottom: i < items.length - 1 ? "0.5px solid var(--color-border-tertiary)" : "none",
                          border: "none",
                          borderBottomWidth: i < items.length - 1 ? "0.5px" : 0,
                          borderBottomStyle: "solid",
                          borderBottomColor: "var(--color-border-tertiary)",
                          cursor: "pointer", textAlign: "left",
                          background: selected
                            ? "var(--color-background-info)"
                            : done ? "var(--color-background-success, #f0fdf4)" : "var(--color-background-primary)",
                          fontSize: 13, color: "var(--color-text-primary)", fontWeight: selected || done ? 500 : 400,
                        }}
                      >
                        <span>{d.label}</span>
                        <span style={{ fontSize: 11, color: selected ? "var(--color-text-info)" : "var(--color-text-success, #16a34a)", flexShrink: 0 }}>
                          {selected ? "✓ Selected" : done ? "✓ Confirmed" : ""}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Confirm button — active when at least one condition selected */}
      <div style={{ flexShrink: 0, padding: "10px 1rem", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        {selectedDiagnoses.length > 0 && (
          <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 6 }}>
            Selected: {selectedDiagnoses.map(d => d.label).join(", ")}
          </div>
        )}
        <button
          onClick={() => selectedDiagnoses.length > 0 && onConfirm(selectedDiagnoses)}
          disabled={selectedDiagnoses.length === 0}
          style={{
            width: "100%", padding: "10px 12px", borderRadius: "var(--border-radius-md)", border: "none",
            cursor: selectedDiagnoses.length === 0 ? "not-allowed" : "pointer",
            background: selectedDiagnoses.length === 0 ? "var(--color-background-tertiary)" : "#185FA5",
            color: selectedDiagnoses.length === 0 ? "var(--color-text-secondary)" : "#fff",
            fontSize: 13, fontWeight: 500,
          }}
        >
          {selectedDiagnoses.length === 0 ? "Select at least one diagnosis" : `Confirm Diagnosis (${selectedDiagnoses.length})`}
        </button>
      </div>
    </div>
  );
}

function TreatmentPanel({ allActions, actionsLoaded, selectedActionIds, onToggle, onSubmit, onDirectSubmit, onFinalize, pendingTreatments = [], loading, tabId }) {
  const visibleActions = tabId === "treat_clinic"
    ? allActions.filter(a => a.type === "injectable" || a.type === "intervention")
    : allActions.filter(a => a.type === "oral" || a.type === "topical");
  const grouped = groupActionsByType(visibleActions);

  // Only "both" actions can be batch-selected; "clinic" actions submit immediately on click
  const batchSelectedIds = selectedActionIds.filter(id => {
    const a = allActions.find(x => x.id === id);
    return a && a.setting === "both";
  });

  if (!actionsLoaded) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-secondary)", fontSize: 13 }}>
        Loading actions…
      </div>
    );
  }

  if (actionsLoaded && !allActions.length) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: "2rem" }}>
        <div style={{ fontSize: 13, color: "var(--color-text-secondary)", textAlign: "center" }}>Could not load actions from backend.</div>
        <div style={{ fontSize: 12, color: "var(--color-text-secondary)", textAlign: "center" }}>Make sure the server is running on port 3000 and reload the page.</div>
      </div>
    );
  }

  const hasBatchActions = visibleActions.some(a => a.setting === "both");

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
      <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--color-text-secondary)", marginBottom: 4 }}>Select treatments</div>
      <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 12 }}>Reason from mechanism, not drug name.</div>

      {ACTION_TYPE_ORDER.filter(t => grouped[t]?.length).map(type => (
        <div key={type} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", fontWeight: 500, marginBottom: 6 }}>{ACTION_TYPE_LABELS[type]}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {grouped[type].map(action => {
              if (action.setting === "clinic") {
                // Single-click adds to the treatment plan; game does not end until Finalize.
                const isApplied = pendingTreatments.includes(action.id);
                return (
                  <button
                    key={action.id}
                    onClick={() => !loading && onDirectSubmit(action.id)}
                    disabled={loading}
                    style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "9px 12px", borderRadius: "var(--border-radius-md)",
                      border: isApplied ? "0.5px solid var(--color-border-success, #6ee7b7)" : "0.5px solid var(--color-border-secondary)",
                      cursor: loading ? "not-allowed" : "pointer", textAlign: "left",
                      background: isApplied ? "var(--color-background-success, #f0fdf4)" : "var(--color-background-primary)",
                      opacity: loading ? 0.6 : 1, width: "100%",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: "var(--color-text-primary)" }}>{action.name}</div>
                      <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 2 }}>{action.cost_tier === "high" ? "High cost" : action.cost_tier === "medium" ? "Medium cost" : "Low cost"}</div>
                    </div>
                    <span style={{ fontSize: 10, color: isApplied ? "var(--color-text-success, #16a34a)" : "var(--color-text-secondary)", flexShrink: 0, marginLeft: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>{isApplied ? "✓ Applied" : "Apply"}</span>
                  </button>
                );
              } else {
                // Batch checkbox flow for "both" actions
                const selected = selectedActionIds.includes(action.id);
                return (
                  <label key={action.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "9px 12px", borderRadius: "var(--border-radius-md)", border: selected ? "0.5px solid var(--color-border-info)" : "0.5px solid var(--color-border-secondary)", cursor: "pointer", background: selected ? "var(--color-background-info)" : "var(--color-background-primary)", transition: "background 0.15s" }}>
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => onToggle(action.id)}
                      style={{ marginTop: 2, flexShrink: 0, accentColor: "var(--color-text-info)" }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: "var(--color-text-primary)", fontWeight: selected ? 500 : 400 }}>{action.name}</div>
                      <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 2 }}>{action.cost_tier === "high" ? "High cost" : action.cost_tier === "medium" ? "Medium cost" : "Low cost"}</div>
                    </div>
                  </label>
                );
              }
            })}
          </div>
        </div>
      ))}

      {tabId === "treat_clinic" && pendingTreatments.length > 0 && (
        <div style={{ paddingTop: 12, borderTop: "0.5px solid var(--color-border-tertiary)" }}>
          <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 8 }}>
            {pendingTreatments.length} treatment{pendingTreatments.length > 1 ? "s" : ""} applied. Add more or finalize.
          </div>
          <button
            onClick={onFinalize}
            disabled={loading}
            style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--border-radius-md)", border: "none", cursor: loading ? "not-allowed" : "pointer", background: "#A32D2D", color: "#fff", fontSize: 13, fontWeight: 500, opacity: loading ? 0.6 : 1 }}
          >
            Finalize Treatment Plan
          </button>
        </div>
      )}

      {hasBatchActions && (
        <div style={{ paddingTop: 12, borderTop: "0.5px solid var(--color-border-tertiary)" }}>
          {batchSelectedIds.length > 0 && (
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 8 }}>
              {batchSelectedIds.length} selected
            </div>
          )}
          <button
            onClick={onSubmit}
            disabled={loading || batchSelectedIds.length === 0}
            style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--border-radius-md)", border: "none", cursor: batchSelectedIds.length === 0 || loading ? "not-allowed" : "pointer", background: batchSelectedIds.length === 0 ? "var(--color-background-tertiary)" : "#A32D2D", color: batchSelectedIds.length === 0 ? "var(--color-text-secondary)" : "#fff", fontSize: 13, fontWeight: 500, opacity: loading ? 0.6 : 1 }}
          >
            {batchSelectedIds.length === 0 ? "Select at least one prescription" : "Complete Prescription"}
          </button>
        </div>
      )}
    </div>
  );
}

function DispositionPanel({ dispositionActions, selected, onSelect, onConfirm, loading }) {
  const [confirmPending, setConfirmPending] = useState(false);

  const handleSelect = (action) => {
    if (selected === action.id) {
      onSelect(null);
      setConfirmPending(false);
    } else {
      onSelect(action.id);
      setConfirmPending(true);
    }
  };

  const handleConfirm = () => {
    setConfirmPending(false);
    onConfirm(selected);
  };

  const handleCancel = () => {
    onSelect(null);
    setConfirmPending(false);
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
      <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--color-text-secondary)", marginBottom: 4 }}>Disposition</div>
      <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 12, padding: "8px 10px", background: "var(--color-background-warning, #fffbeb)", border: "0.5px solid var(--color-border-warning, #fcd34d)", borderRadius: "var(--border-radius-md)" }}>
        Select after completing treatment. This will end the consultation.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {dispositionActions.map(action => {
          const isSelected = selected === action.id;
          return (
            <button
              key={action.id}
              onClick={() => handleSelect(action)}
              disabled={loading}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "11px 14px", borderRadius: "var(--border-radius-md)", textAlign: "left", width: "100%",
                border: isSelected ? "1.5px solid var(--color-border-info)" : "0.5px solid var(--color-border-secondary)",
                background: isSelected ? "var(--color-background-info)" : "var(--color-background-primary)",
                cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1,
              }}
            >
              <div>
                <div style={{ fontSize: 13, color: "var(--color-text-primary)", fontWeight: isSelected ? 500 : 400 }}>{action.name}</div>
              </div>
              {isSelected && <span style={{ fontSize: 11, color: "var(--color-text-info)", flexShrink: 0, marginLeft: 8 }}>Selected</span>}
            </button>
          );
        })}
      </div>
      {confirmPending && selected && (
        <div style={{ marginTop: 16, padding: "12px 14px", background: "var(--color-background-danger, #fef2f2)", border: "0.5px solid var(--color-border-danger, #fca5a5)", borderRadius: "var(--border-radius-md)" }}>
          <div style={{ fontSize: 13, color: "var(--color-text-danger, #b91c1c)", fontWeight: 500, marginBottom: 10 }}>This will end the consultation. Are you sure?</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleCancel} style={{ flex: 1, padding: "8px 12px", fontSize: 13, borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-primary)", cursor: "pointer", color: "var(--color-text-secondary)" }}>Cancel</button>
            <button onClick={handleConfirm} disabled={loading} style={{ flex: 1, padding: "8px 12px", fontSize: 13, fontWeight: 500, borderRadius: "var(--border-radius-md)", border: "none", background: "#A32D2D", color: "#fff", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}>Confirm — End consultation</button>
          </div>
        </div>
      )}
    </div>
  );
}

const GRADE_CONFIG = {
  A: { textClass: "text-emerald-700", bgClass: "bg-emerald-50", borderClass: "border-emerald-400", glowColor: "rgba(16,185,129,0.35)", barColor: "#10B981", label: "Outstanding performance" },
  B: { textClass: "text-blue-700",    bgClass: "bg-blue-50",    borderClass: "border-blue-400",    glowColor: "rgba(59,130,246,0.35)", barColor: "#3B82F6", label: "Strong case management" },
  C: { textClass: "text-amber-700",   bgClass: "bg-amber-50",   borderClass: "border-amber-400",   glowColor: "rgba(245,158,11,0.35)", barColor: "#F59E0B", label: "Adequate — room to grow" },
  D: { textClass: "text-orange-700",  bgClass: "bg-orange-50",  borderClass: "border-orange-400",  glowColor: "rgba(249,115,22,0.35)", barColor: "#F97316", label: "Needs improvement" },
  F: { textClass: "text-red-700",     bgClass: "bg-red-50",     borderClass: "border-red-400",     glowColor: "rgba(239,68,68,0.35)",  barColor: "#EF4444", label: "Critical errors made" },
};

const BAR_COLORS = {
  accuracyScore:  "#6366F1",
  outcomeScore:   "#0EA5E9",
  efficiencyScore:"#8B5CF6",
  trustScore:     "#F59E0B",
};

function ReportCardScreen({ finalState, onRetry, onNewCase }) {
  const outcome = finalState.outcome;
  const cfg = GRADE_CONFIG[outcome.grade] || GRADE_CONFIG["F"];

  const [displayScore, setDisplayScore] = useState(0);
  const [barsActive, setBarsActive] = useState(false);

  useEffect(() => {
    const target = outcome.finalScore;
    const duration = 900;
    const step = 16;
    const increment = target / (duration / step);
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setDisplayScore(target);
        clearInterval(timer);
        setTimeout(() => setBarsActive(true), 100);
      } else {
        setDisplayScore(Math.round(current));
      }
    }, step);
    return () => clearInterval(timer);
  }, [outcome.finalScore]);

  const breakdown = [
    { key: "accuracyScore",   label: "Accuracy",   value: outcome.breakdown.accuracyScore },
    { key: "outcomeScore",    label: "Outcome",     value: outcome.breakdown.outcomeScore },
    { key: "efficiencyScore", label: "Efficiency",  value: outcome.breakdown.efficiencyScore },
    { key: "trustScore",      label: "Trust",       value: outcome.breakdown.trustScore },
  ];

  const values = breakdown.map(b => b.value);
  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);
  const allSame = values.every(v => v === values[0]);

  const sortedFeedback = [...(outcome.feedback || [])].sort((a, b) => {
    const rank = s => s.startsWith("✔") ? 0 : s.startsWith("⚠") ? 1 : 2;
    return rank(a) - rank(b);
  });

  function getAccuracyBadge(score) {
    if (score >= 80) return { label: "Strong Dx", cls: "bg-teal-100 text-teal-700" };
    if (score < 40)  return { label: "Missed Dx", cls: "bg-red-100 text-red-700" };
    return null;
  }
  function getTrustBadge(score) {
    if (score >= 80) return { label: "Trusted",   cls: "bg-emerald-100 text-emerald-700" };
    if (score < 50)  return { label: "Low Trust",  cls: "bg-amber-100 text-amber-700" };
    return null;
  }

  return (
    <div style={{ padding: "2rem 1.5rem", display: "flex", justifyContent: "center" }}>
      <div className="w-full max-w-lg bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid #E5E7EB", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-6" style={{ borderBottom: "1px solid #F3F4F6" }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#9CA3AF", letterSpacing: "0.1em" }}>Case Complete</p>
            <h2 className="text-lg font-semibold mb-1" style={{ color: "#111827" }}>{finalState.case.title}</h2>
            <p className="text-sm" style={{ color: "#6B7280" }}>{finalState.case.patient.breed} · {finalState.case.patient.age} years</p>
          </div>

          {/* Grade badge — bounce + glow */}
          <div
            className={`w-20 h-20 rounded-full border-2 flex flex-col items-center justify-center shrink-0 ${cfg.bgClass} ${cfg.borderClass} animate-grade-pop animate-grade-glow`}
            style={{ "--glow-color": cfg.glowColor }}
          >
            <span className={`text-3xl font-bold ${cfg.textClass}`}>{outcome.grade}</span>
          </div>
        </div>

        {/* Score counter */}
        <div className="flex flex-col items-center py-8" style={{ borderBottom: "1px solid #F3F4F6" }}>
          <span className="font-bold tabular-nums" style={{ fontSize: 64, lineHeight: 1, color: "#111827" }}>{displayScore}</span>
          <p className="text-sm mt-2" style={{ color: "#6B7280" }}>Final Score</p>
          <p className={`text-xs font-semibold uppercase tracking-widest mt-2 ${cfg.textClass}`} style={{ letterSpacing: "0.1em" }}>{cfg.label}</p>
        </div>

        {/* Breakdown bars */}
        <div className="p-6" style={{ borderBottom: "1px solid #F3F4F6" }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#9CA3AF", letterSpacing: "0.1em" }}>Breakdown</p>
          {breakdown.map((item, i) => {
            const isBest  = !allSame && item.value === maxVal;
            const isWorst = !allSame && item.value === minVal;
            const badge = item.key === "accuracyScore" ? getAccuracyBadge(item.value)
                        : item.key === "trustScore"    ? getTrustBadge(item.value)
                        : null;
            const barFill = isBest ? "#10B981" : isWorst ? "#EF4444" : BAR_COLORS[item.key];
            const rowBg   = isBest ? { background: "#F0FDF4", outline: "1px solid #A7F3D0" }
                          : isWorst ? { background: "#FEF2F2", outline: "1px solid #FECACA" }
                          : { background: "#F9FAFB" };
            return (
              <div key={item.key} className="mb-3 p-3 rounded-xl" style={rowBg}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{ color: "#374151" }}>{item.label}</span>
                    {isBest  && <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-700">Best</span>}
                    {isWorst && <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-red-100 text-red-700">Needs work</span>}
                    {badge   && <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${badge.cls}`}>{badge.label}</span>}
                  </div>
                  <span className="text-sm font-bold tabular-nums" style={{ color: "#111827" }}>{item.value}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "#E5E7EB" }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: barsActive ? `${item.value}%` : "0%",
                      backgroundColor: barFill,
                      transition: `width 0.65s cubic-bezier(0.4,0,0.2,1) ${i * 140}ms`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Feedback */}
        {sortedFeedback.length > 0 && (
          <div className="p-6" style={{ borderBottom: "1px solid #F3F4F6" }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#9CA3AF", letterSpacing: "0.1em" }}>Feedback</p>
            <div className="flex flex-col gap-2">
              {sortedFeedback.map((item, i) => {
                const isGood = item.startsWith("✔");
                const isWarn = item.startsWith("⚠");
                const cls = isGood ? "bg-emerald-50 text-emerald-800"
                          : isWarn ? "bg-amber-50 text-amber-800"
                          :          "bg-red-50 text-red-800";
                const icon = isGood ? "✔" : isWarn ? "⚠️" : "❌";
                const text = item.split(" ").slice(1).join(" ");
                return (
                  <div key={i} className={`flex items-start gap-3 px-3 py-2 rounded-lg text-sm ${cls}`}>
                    <span className="shrink-0 mt-px">{icon}</span>
                    <span>{text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 p-4">
          <button
            onClick={onRetry}
            className="flex-1 py-2.5 px-4 text-sm font-medium rounded-xl transition-colors"
            style={{ border: "1px solid #E5E7EB", background: "#fff", color: "#374151", cursor: "pointer" }}
            onMouseOver={e => e.currentTarget.style.background = "#F9FAFB"}
            onMouseOut={e => e.currentTarget.style.background = "#fff"}
          >
            Try again
          </button>
          <button
            onClick={onNewCase}
            className="flex-1 py-2.5 px-4 text-sm font-medium rounded-xl transition-colors"
            style={{ background: "#111827", color: "#fff", border: "none", cursor: "pointer" }}
            onMouseOver={e => e.currentTarget.style.background = "#1F2937"}
            onMouseOut={e => e.currentTarget.style.background = "#111827"}
          >
            New case
          </button>
        </div>
      </div>
    </div>
  );
}

function PatientCard({ sessionData, onBegin, onBack }) {
  const { state } = sessionData;
  const p = state.case.patient;
  return (
    <div style={{ padding: "2rem 1.5rem", maxWidth: 480, margin: "0 auto" }}>
      <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", overflow: "hidden" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "0.5px solid var(--color-border-tertiary)", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--color-background-info)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 5.5C10 4.1 8.9 3 7.5 3S5 4.1 5 5.5 6.1 8 7.5 8 10 6.9 10 5.5z"/>
              <path d="M19 5.5C19 4.1 17.9 3 16.5 3S14 4.1 14 5.5 15.1 8 16.5 8 19 6.9 19 5.5z"/>
              <path d="M5 13c0-3.3 2.7-6 6-6h2c3.3 0 6 2.7 6 6v2c0 1.1-.9 2-2 2h-1l-1 3h-4l-1-3H9c-1.1 0-2-.9-2-2v-2z"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 500, color: "var(--color-text-primary)", marginBottom: 2 }}>{p.name}</div>
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{p.breed} · {p.age} year{p.age !== 1 ? "s" : ""} old</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "var(--color-border-tertiary)", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
          {[["Species", state.case.species], ["Breed", p.breed], ["Age", `${p.age} year${p.age !== 1 ? "s" : ""}`], ["Sex", p.sex], ["Weight", `${p.weight_kg} kg`], ["Difficulty", state.case.difficulty]].map(([label, value]) => (
            <div key={label} style={{ background: "var(--color-background-primary)", padding: "12px 16px" }}>
              <div style={{ fontSize: 11, color: "var(--color-text-secondary)", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 14, color: "var(--color-text-primary)", textTransform: "capitalize" }}>{value}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: "14px 16px", borderBottom: "0.5px solid var(--color-border-tertiary)", background: "#FCEBEB" }}>
          <div style={{ fontSize: 11, color: "#A32D2D", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 5 }}>Presenting complaint</div>
          <div style={{ fontSize: 14, color: "#501313", lineHeight: 1.6, textTransform: "capitalize" }}>{state.case.presenting_complaint}</div>
        </div>
        <div style={{ padding: "1rem 1.25rem", display: "flex", gap: 8 }}>
          <button onClick={onBack} style={{ padding: "9px 14px", fontSize: 13, borderRadius: "var(--border-radius-md)", cursor: "pointer", color: "var(--color-text-secondary)" }}>Back</button>
          <button onClick={onBegin} style={{ flex: 1, padding: 9, fontSize: 13, fontWeight: 500, borderRadius: "var(--border-radius-md)", cursor: "pointer" }}>Begin consultation →</button>
        </div>
      </div>
    </div>
  );
}

// ─── Lab report renderer helpers ───────────────────────────────────────────
function getLabSectionHeader(key) {
  if (!key) return "CHEMISTRY";
  const k = key.toLowerCase();
  if (k.includes("cbc") || k.includes("pcv") || k.includes("hematol") || k === "blood_count") return "HEMATOLOGY";
  if (k.includes("urine") || k.includes("urinalys")) return "URINALYSIS";
  return "CHEMISTRY";
}

function getLabFlag(value, low, high) {
  if (value > high) return "H";
  if (value < low) return "L";
  return null;
}

function getLabTickPos(value, low, high) {
  // Bar is 60 px wide; tick is 6 px wide → usable range is 0–54 px
  if (value <= low) return 0;
  if (value >= high) return 54;
  return Math.round(((value - low) / (high - low)) * 54);
}

// ─── LabReportRenderer ──────────────────────────────────────────────────────
// Renders inside DiagnosticResultModal when display_type === "report".
// Props:
//   testKey       – e.g. "lactate", "cbc", "biochemistry_panel"
//   testData      – full test entry from case JSON (contains reference_ranges)
//   patient       – { name, breed, age, sex, weight_kg }
//   ownerName     – client name string
//   caseId        – e.g. "gdv_001"
function LabReportRenderer({ testKey, testData, patient, ownerName, caseId }) {
  const referenceRanges = testData?.reference_ranges || {};
  const entries = Object.entries(referenceRanges);
  const sectionHeader = getLabSectionHeader(testKey);

  return (
    <div style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: 12, color: "#111" }}>

      {/* Section header */}
      <div style={{ padding: "2px 0 10px", fontSize: 15, fontWeight: 700, letterSpacing: "0.04em" }}>
        {sectionHeader}
      </div>

      {/* ── RESULTS TABLE ── */}
      <div style={{ padding: 0 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #e0e0e0" }}>
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
              <th style={{ padding: "7px 10px", textAlign: "left", fontWeight: 700, fontSize: 11, textTransform: "uppercase", border: "1px solid #e0e0e0", width: "34%" }}>TEST</th>
              <th style={{ padding: "7px 10px", textAlign: "left", fontWeight: 700, fontSize: 11, textTransform: "uppercase", border: "1px solid #e0e0e0", width: "18%" }}>RESULT</th>
              <th style={{ padding: "7px 10px", textAlign: "left", fontWeight: 700, fontSize: 11, textTransform: "uppercase", border: "1px solid #e0e0e0" }}>REF. RANGE / UNITS</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([analyte, d], idx) => {
              const flag = getLabFlag(d.value, d.low, d.high);
              const isFlagged = flag !== null;
              const tickPos = getLabTickPos(d.value, d.low, d.high);
              const rowBg = idx % 2 === 0 ? "#fff" : "#f9f9f9";
              const isPCV = analyte.toLowerCase().includes("pcv");
              const pcvPct = Math.max(0, Math.min(100, Number(d.value) || 0));
              return (
                <tr key={analyte} style={{ background: rowBg }}>

                  {/* TEST — H / L prefix when flagged */}
                  <td style={{ padding: "6px 10px", border: "1px solid #e0e0e0", fontWeight: isFlagged ? 700 : 400, fontSize: 12, verticalAlign: "middle" }}>
                    {flag && <span style={{ fontWeight: 700, marginRight: 5 }}>{flag}</span>}
                    {analyte.replace(/_/g, " ")}
                  </td>

                  {/* RESULT — plain numeric, bold when flagged */}
                  <td style={{ padding: "6px 10px", border: "1px solid #e0e0e0", fontWeight: isFlagged ? 700 : 400, fontSize: 12, verticalAlign: "middle" }}>
                    {d.value}
                  </td>

                  {/* REF. RANGE / UNITS — range text + graphical bar indicator */}
                  <td style={{ padding: "6px 10px", border: "1px solid #e0e0e0", fontSize: 12, verticalAlign: "middle" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap" }}>
                      <span>({d.low} &ndash; {d.high}) {d.unit}</span>
                      {/* Graphical position bar */}
                      <div style={{
                        width: 60,
                        height: 6,
                        background: "#e0e0e0",
                        borderRadius: 2,
                        position: "relative",
                        flexShrink: 0,
                      }}>
                        {/* Tick mark — positioned proportionally within the bar */}
                        <div style={{
                          position: "absolute",
                          left: tickPos,
                          top: 0,
                          width: 6,
                          height: 6,
                          background: "#333",
                          borderRadius: 1,
                        }} />
                      </div>

                      {/* PCV haematocrit tube — only on the PCV analyte row */}
                      {isPCV && (
                        <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", marginLeft: 12, flexShrink: 0 }}>
                          <div style={{ width: 12, height: 60, border: "1px solid #000", position: "relative", background: "#fdfaf0", overflow: "hidden" }}>
                            {/* Bottom: packed red cells — height proportional to PCV% */}
                            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${pcvPct}%`, background: "#c0392b" }} />
                            {/* Buffy coat — thin pale-yellow layer sitting on the red cell column */}
                            <div style={{ position: "absolute", bottom: `${pcvPct}%`, left: 0, right: 0, height: 3, background: "#f5f0d0" }} />
                          </div>
                          <span style={{ fontSize: 10, color: "#888", marginTop: 2 }}>PCV</span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}

// ─── Report shell + renderer helpers ────────────────────────────────────────
function todayDDMMYYYY() {
  const t = new Date();
  const p = n => String(n).padStart(2, "0");
  return `${p(t.getDate())}/${p(t.getMonth() + 1)}/${t.getFullYear()}`;
}

function randDigits(n) {
  let s = "";
  for (let i = 0; i < n; i++) s += Math.floor(Math.random() * 10);
  return s;
}

function abbrSex(sex) {
  const u = (sex || "").toUpperCase();
  if (u.includes("FEMALE")) return "F";
  if (u.includes("MALE")) return "M";
  return sex || "—";
}

// Image with graceful fallback to an "Image pending" placeholder.
function DiagImage({ asset, alt }) {
  const [err, setErr] = useState(false);
  if (err || !asset) {
    return (
      <div style={{ width: "100%", height: 200, background: "#eee", border: "1px solid #d0d0d0", display: "flex", alignItems: "center", justifyContent: "center", color: "#999", fontSize: 13 }}>
        Image pending
      </div>
    );
  }
  return (
    <img
      src={`/assets/diagnostic_images/${asset}`}
      alt={alt || "diagnostic image"}
      onError={() => setErr(true)}
      style={{ maxWidth: "100%", display: "block", border: "1px solid #d0d0d0" }}
    />
  );
}

// ─── SIMLABReportShell — external lab report chrome ─────────────────────────
function SIMLABReportShell({ testKey, patient, ownerName, caseId, children }) {
  const ids = useMemo(() => ({
    patientId: `${(caseId || "CASE").toUpperCase()}-${randDigits(4)}`,
    labId: randDigits(10),
    orderId: randDigits(9),
  }), [caseId]);
  const dateStr = useMemo(() => todayDDMMYYYY(), []);
  const grey = "#777";
  const cell = { fontSize: 11, lineHeight: 1.6 };
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", background: "#fff", fontFamily: "Arial, Helvetica, sans-serif", color: "#222" }}>
      <div style={{ display: "flex", padding: "16px 18px 12px", gap: 16 }}>
        {/* Zone 1 — branding */}
        <div style={{ flex: "1 1 0", minWidth: 0 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#1a3a6b" }}>SIMLAB</div>
          <div style={{ fontSize: 10, color: grey }}>Veterinary Reference Laboratory</div>
          <div style={{ fontSize: 10, color: grey }}>www.simlab.vet</div>
        </div>
        {/* Zone 2 — patient */}
        <div style={{ flex: "1 1 0", minWidth: 0, ...cell }}>
          <div>PET NAME: {(patient?.name || "—").toUpperCase()}</div>
          <div>PATIENT ID: {ids.patientId}</div>
          <div>SPECIES: CANINE</div>
          <div>BREED: {(patient?.breed || "—").toUpperCase()}</div>
          <div>GENDER: {(patient?.sex || "—").toUpperCase()}</div>
          <div>AGE: {patient?.age != null ? `${patient.age}Y` : "—"}</div>
        </div>
        {/* Zone 3 — clinic */}
        <div style={{ flex: "1 1 0", minWidth: 0, ...cell }}>
          <div>VETSIM ANIMAL HOSPITAL</div>
          <div>123 CLINIC LANE, VETTOWN VS1 0AB</div>
          <div>TEL: 555-0100</div>
          <div>ACCOUNT #: VS-001</div>
          <div>ATTENDING VET: DR. STUDENT</div>
        </div>
        {/* Zone 4 — dates */}
        <div style={{ flex: "1 1 0", minWidth: 0, ...cell }}>
          <div>LAB ID #: <strong>{ids.labId}</strong></div>
          <div>ORDER ID #: <strong>{ids.orderId}</strong></div>
          <div>COLLECTION DATE: <strong>{dateStr}</strong></div>
          <div>DATE OF RECEIPT: <strong>{dateStr}</strong></div>
          <div>DATE OF REPORT: <strong>{dateStr}</strong></div>
          <div style={{ marginTop: 4 }}><strong>*** FINAL REPORT ***</strong></div>
        </div>
      </div>
      <div style={{ height: 2, background: "#333", margin: "0 18px" }} />
      <div style={{ padding: "6px 18px 2px", fontSize: 11, fontWeight: 700 }}>
        SIMLAB SERVICES: {(testKey || "DIAGNOSTIC").toUpperCase()}
      </div>
      <div style={{ padding: "10px 18px 16px" }}>{children}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "8px 18px 16px", borderTop: "1px solid #e0e0e0" }}>
        <div style={{ fontSize: 10, fontStyle: "italic", color: grey }}>For complete access to this patient's results, login to portal.simlab.vet</div>
        <div style={{ fontSize: 10, color: grey, marginLeft: 16, flexShrink: 0 }}>PAGE 1 OF 1</div>
      </div>
    </div>
  );
}

// ─── InHouseReportShell — point-of-care record chrome ───────────────────────
function InHouseReportShell({ testLabel, patient, children }) {
  const dateStr = useMemo(() => todayDDMMYYYY(), []);
  const recordId = useMemo(() => `IH-${randDigits(6)}`, []);
  return (
    <div style={{ maxWidth: 600, margin: "0 auto", background: "#fff", fontFamily: "Arial, Helvetica, sans-serif", color: "#222" }}>
      <div style={{ padding: "16px 18px 0" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#1a3a6b" }}>VETSIM ANIMAL HOSPITAL</div>
        <div style={{ fontSize: 12, color: "#777" }}>In-House Diagnostic Record</div>
      </div>
      <div style={{ height: 1, background: "#e0e0e0", margin: "10px 18px" }} />
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "0 18px", fontSize: 12, lineHeight: 1.6 }}>
        <div>Patient: {patient?.name || "—"} | Breed: {patient?.breed || "—"} | Age: {patient?.age != null ? `${patient.age}Y` : "—"} | Sex: {abbrSex(patient?.sex)}</div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>Date: {dateStr} | Attending: Dr. Student | Record #: {recordId}</div>
      </div>
      <div style={{ height: 2, background: "#333", margin: "10px 18px" }} />
      <div style={{ padding: "0 18px" }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>{testLabel || "Diagnostic Test"}</div>
        <div style={{ height: 1, background: "#e0e0e0", margin: "8px 0" }} />
      </div>
      <div style={{ padding: "4px 18px 14px" }}>{children}</div>
      <div style={{ padding: "8px 18px 16px", borderTop: "1px solid #e0e0e0", fontSize: 10, fontStyle: "italic", color: "#777" }}>
        Vetsim Animal Hospital — In-house clinical record
      </div>
    </div>
  );
}

// ─── ImageRenderer ──────────────────────────────────────────────────────────
const IMAGE_SUBTITLES = {
  skin_cytology: "Tape prep — Diff-Quik stain — 100x oil immersion",
  ear_cytology: "Ear swab — Diff-Quik stain — 100x oil immersion",
  xray_abdomen: "Abdominal radiograph — right lateral view",
  allergy_intradermal: "Intradermal skin test — lateral thorax",
};

function ImageRenderer({ testKey, testLabel, testData }) {
  const subtitle = IMAGE_SUBTITLES[testKey] || testLabel || "";
  const { image_asset, image_attribution, second_image_asset, second_image_attribution, result_text } = testData || {};
  return (
    <div style={{ fontFamily: "Arial, Helvetica, sans-serif", color: "#222" }}>
      {subtitle && <div style={{ fontSize: 12, color: "#777", marginBottom: 8 }}>{subtitle}</div>}
      <DiagImage asset={image_asset} alt={testLabel} />
      {second_image_asset && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Additional view</div>
          <DiagImage asset={second_image_asset} alt={`${testLabel} additional view`} />
        </div>
      )}
      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>CLINICAL FINDINGS:</div>
        <div style={{ fontSize: 13, lineHeight: 1.6 }}>{result_text}</div>
      </div>
      {image_attribution && <div style={{ fontSize: 10, fontStyle: "italic", color: "#888", marginTop: 10 }}>Image: {image_attribution}</div>}
      {second_image_attribution && <div style={{ fontSize: 10, fontStyle: "italic", color: "#888", marginTop: 2 }}>Image: {second_image_attribution}</div>}
    </div>
  );
}

// ─── ECGRenderer ──────────────────────────────────────────────────────────
function ECGRenderer({ testData }) {
  const canvasRef = useRef(null);
  const wf = testData?.waveform_data || {};
  const hr = wf.heart_rate || 120;
  const vpcPresent = !!wf.vpc_present;
  const vpcFreq = wf.vpc_frequency || 0;
  const rhythm = (wf.rhythm || "").toUpperCase() === "IRREGULAR" ? "IRREGULAR" : "REGULAR";
  const photoAsset = wf.image_asset || testData?.image_asset || null;
  const photoAttr = wf.image_attribution || testData?.image_attribution || null;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = 660, H = 160;
    ctx.clearRect(0, 0, W, H);
    // ECG paper grid
    ctx.strokeStyle = "#ffcccc"; ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += 10) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y <= H; y += 10) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.strokeStyle = "#ff9999"; ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += 50) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y <= H; y += 50) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    // Trace
    ctx.strokeStyle = "#111"; ctx.lineWidth = 1.6; ctx.lineJoin = "round";
    const base = 100;
    ctx.beginPath();
    ctx.moveTo(0, base);
    // Calibration pulse — 20px vertical step at far left
    ctx.lineTo(8, base);
    ctx.lineTo(8, base - 20);
    ctx.lineTo(18, base - 20);
    ctx.lineTo(18, base);
    let x = 42;
    ctx.lineTo(x, base);
    const dx = 70;
    const vpcEvery = vpcPresent ? Math.max(3, Math.min(5, Math.round(hr / Math.max(1, vpcFreq)))) : Infinity;
    let beat = 0;
    while (x < W - 60) {
      const isVpc = vpcPresent && beat > 0 && beat % vpcEvery === 0;
      if (isVpc) {
        // No preceding P; wide bizarre QRS (20px), tall (80px); opposite-polarity T
        ctx.lineTo(x + 5, base);
        ctx.lineTo(x + 15, base - 80);
        ctx.lineTo(x + 25, base + 30);
        ctx.lineTo(x + 30, base);
        ctx.lineTo(x + 42, base + 18);
        ctx.lineTo(x + 54, base);
        x += dx + 30; // compensatory pause
      } else {
        ctx.lineTo(x + 6, base);        // P wave
        ctx.lineTo(x + 12, base - 8);
        ctx.lineTo(x + 18, base);
        ctx.lineTo(x + 23, base + 6);   // Q
        ctx.lineTo(x + 28, base - 50);  // R
        ctx.lineTo(x + 33, base + 12);  // S
        ctx.lineTo(x + 38, base);
        ctx.lineTo(x + 48, base - 14);  // T wave
        ctx.lineTo(x + 58, base);
        x += dx;
      }
      beat++;
    }
    ctx.lineTo(W, base);
    ctx.stroke();
  }, [hr, vpcPresent, vpcFreq]);

  return (
    <div style={{ fontFamily: "Arial, Helvetica, sans-serif", color: "#222" }}>
      <div style={{ fontSize: 14, fontWeight: 700, textTransform: "uppercase" }}>Electrocardiography</div>
      <div style={{ fontSize: 12, color: "#777", marginBottom: 10 }}>Lead II — 25 mm/sec — 10 mm/mV</div>
      {photoAsset && (
        <div style={{ marginBottom: 12 }}>
          <DiagImage asset={photoAsset} alt="ECG trace" />
          {photoAttr && <div style={{ fontSize: 10, fontStyle: "italic", color: "#888", marginTop: 4 }}>{photoAttr}</div>}
        </div>
      )}
      <canvas ref={canvasRef} width={660} height={160} style={{ width: "100%", maxWidth: 660, border: "1px solid #d0d0d0", display: "block" }} />
      <div style={{ fontFamily: "monospace", background: "#1a1a1a", color: "#00cc00", padding: 12, marginTop: 12, fontSize: 13, lineHeight: 1.6 }}>
        <div style={{ whiteSpace: "pre" }}>{`HEART RATE:     ${hr} bpm\nRHYTHM:         ${rhythm}\nVPC FREQUENCY:  ${vpcFreq} per minute`}</div>
        {vpcPresent && <div style={{ color: "#ffff00", marginTop: 6 }}>*** VENTRICULAR ECTOPY DETECTED ***</div>}
      </div>
      <div style={{ fontSize: 12, marginTop: 10, lineHeight: 1.6 }}>
        Rhythm interpretation is the responsibility of the attending clinician. This trace requires evaluation before anaesthesia.
      </div>
    </div>
  );
}

// ─── TextRenderer ──────────────────────────────────────────────────────────
const EVIDENCE_LABELS = {
  confirmatory: { text: "[CONFIRMATORY]", color: "#1a7a1a" },
  supportive: { text: "[SUPPORTIVE]", color: "#1a3a8a" },
  ruling_out: { text: "[RULES OUT]", color: "#b05000" },
};

function TextRenderer({ testKey, testLabel, testData, patient }) {
  const pd = testData?.procedure_details;
  const resultText = testData?.result_text || "";
  const interpretation = testData?.interpretation;
  const findings = testData?.findings;
  const dateStr = useMemo(() => todayDDMMYYYY(), []);
  const ageSex = `${patient?.age != null ? patient.age + " yr" : "—"} | ${abbrSex(patient?.sex)}`;
  const mono = { fontFamily: "monospace", fontSize: 12, lineHeight: 1.7, color: "#222" };
  const Divider = () => <div style={{ height: 1, background: "#cccccc", margin: "10px 0" }} />;

  return (
    <div>
      {pd ? (
        <div style={mono}>
          <Divider />
          <div style={{ fontWeight: 700 }}>DIAGNOSTIC TEST RESULT</div>
          <Divider />
          <div>Patient:    {patient?.name || "—"}</div>
          <div>Species:    Canine | Breed: {patient?.breed || "—"}</div>
          <div>Age/Sex:    {ageSex}</div>
          <div>Test:       {testLabel || testKey}</div>
          <div>Sites:      {pd.sites}</div>
          <div>Method:     {pd.method}</div>
          <div>Stain:      {pd.stain}</div>
          <div>Mag:        {pd.magnification}</div>
          <Divider />
          <div style={{ fontWeight: 700 }}>FINDINGS</div>
          <div>{resultText}</div>
          <Divider />
          <div style={{ fontWeight: 700 }}>INTERPRETATION</div>
          <div>{interpretation || "—"}</div>
          <Divider />
          <div>Performed by:  Dr. Student</div>
          <div>Date:          {dateStr}</div>
          <Divider />
        </div>
      ) : (
        <div style={{ background: "#fafafa", border: "1px solid #e0e0e0", padding: 16, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 13, lineHeight: 1.6, color: "#333" }}>
          {resultText}
        </div>
      )}
      {Array.isArray(findings) && findings.length > 0 && (
        <div style={{ fontFamily: "Arial, Helvetica, sans-serif", marginTop: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>FINDINGS SUMMARY:</div>
          {findings.map((f, i) => {
            const lab = EVIDENCE_LABELS[f.evidence_type];
            return (
              <div key={i} style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 3 }}>
                • {f.observation}
                {lab && <span style={{ color: lab.color, fontWeight: 700 }}> — {lab.text}</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── DiagnosticResultModal ──────────────────────────────────────────────────
function DiagnosticResultModal({ open, testKey, testData, patient, ownerName, caseId, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !testData) return null;

  const displayType = testData.display_type || "text";
  const reportFormat = testData.report_format;
  const testLabel = testData.label || testKey;

  let inner;
  if (displayType === "report") inner = <LabReportRenderer testKey={testKey} testData={testData} patient={patient} ownerName={ownerName} caseId={caseId} />;
  else if (displayType === "image") inner = <ImageRenderer testKey={testKey} testLabel={testLabel} testData={testData} />;
  else if (displayType === "waveform") inner = <ECGRenderer testData={testData} />;
  else inner = <TextRenderer testKey={testKey} testLabel={testLabel} testData={testData} patient={patient} />;

  const shell = reportFormat === "inhouse"
    ? <InHouseReportShell testLabel={testLabel} patient={patient}>{inner}</InHouseReportShell>
    : <SIMLABReportShell testKey={testKey} patient={patient} ownerName={ownerName} caseId={caseId}>{inner}</SIMLABReportShell>;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <button onClick={onClose} style={{ position: "fixed", top: 12, right: 16, background: "transparent", border: "none", color: "#fff", fontSize: 32, cursor: "pointer", lineHeight: 1, zIndex: 1001 }}>×</button>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", maxWidth: 720, width: "100%", maxHeight: "90vh", overflowY: "auto", borderRadius: 0 }}>
        {shell}
      </div>
    </div>
  );
}

const TABS = [
  { id: "ask",          label: "Ask questions"        },
  { id: "exam",         label: "Physical exam"         },
  { id: "diag",         label: "Run diagnostics"       },
  { id: "dx",           label: "Make diagnosis"        },
  { id: "treat_clinic", label: "In-Clinic Treatments"  },
  { id: "treat_rx",     label: "Prescriptions"         },
  { id: "disposition",  label: "Disposition"           },
];

function initState() {
  return { sessionId: null, caseId: "derm_001", messages: [], input: "", loading: false, scores: { trust: 50, patient_health: 100, cost: 50 }, actions: [], screen: "select", error: null, emotion: "concerned", sessionData: null, finalState: null, activeTab: "ask", examFindings: [], testsRun: [], testResults: {}, testImageData: {}, testResultsData: {}, diagnosticModal: { open: false, testKey: null, testData: null }, examResults: {}, examHealthImpacts: {}, allActions: [], actionsLoaded: false, selectedActionIds: [], pendingTreatments: [], diagnosisAttempted: [], allDiagnostics: [], allDiagnoses: [], selectedDiagnoses: [], dispositionSelected: null, dispositionConfirmPending: false };
}

export default function App() {
  const [s, setS] = useState(initState());
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [s.messages]);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/actions`).then(r => r.json()),
      fetch(`${API}/diagnostics`).then(r => r.json()),
      fetch(`${API}/diagnoses`).then(r => r.json()),
    ]).then(([actData, diagData, dxData]) => {
      patch({
        allActions: actData.actions || [],
        actionsLoaded: true,
        allDiagnostics: diagData.diagnostics || [],
        allDiagnoses: dxData.diagnoses || [],
      });
    }).catch(err => {
      console.error("Failed to load reference data:", err);
      patch({ actionsLoaded: true });
    });
  }, []);

  function patch(obj) { setS(prev => ({ ...prev, ...obj })); }

  function openDiagnosticModal(testKey) {
    const testData = s.testResultsData[testKey];
    if (testData) patch({ diagnosticModal: { open: true, testKey, testData } });
  }
  function closeDiagnosticModal() {
    patch({ diagnosticModal: { open: false, testKey: null, testData: null } });
  }

  async function selectCase(caseId) {
    patch({ error: null, loading: true, caseId });
    try {
      const res = await fetch(`${API}/session`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ caseId }) });
      if (!res.ok) throw new Error("Failed to connect to backend");
      const data = await res.json();
      patch({ sessionId: data.sessionId, scores: data.state.scores, emotion: data.state.client.emotion, sessionData: data, screen: "patient", loading: false });
    } catch (e) { patch({ error: e.message, loading: false }); }
  }

  function beginConsultation() {
    patch({ screen: "chat", activeTab: "ask", messages: [] });
  }

  function tryInterceptDiagnosis(text) {
    const triggerRe = /(?:i think|i suspect|i believe|could (?:this|it) be|this is|this looks like|diagnose:)\s+/i;
    if (!triggerRe.test(text)) return false;
    const after = text.replace(triggerRe, "").replace(/^(?:a|an|the)\s+/i, "").replace(/[.?!,;]+$/, "").trim();
    if (after.length < 4) return false;
    const lower = after.toLowerCase();
    const match = s.allDiagnoses.find(d => {
      const dlower = d.label.toLowerCase();
      return dlower.includes(lower) || lower.includes(dlower);
    });
    if (!match) return false;
    const alreadySelected = s.selectedDiagnoses.some(d => d.id === match.id);
    const newSelected = alreadySelected ? s.selectedDiagnoses : [...s.selectedDiagnoses, match];
    const systemMsg = { id: Date.now(), role: "narrator", speaker: "narrator", text: `Found in differentials: ${match.label} — confirm in the Make diagnosis tab`, effects: [] };
    setS(prev => ({
      ...prev,
      input: "",
      messages: [...prev.messages, { id: Date.now() - 1, role: "player", text }, systemMsg],
      selectedDiagnoses: newSelected,
      activeTab: "dx",
    }));
    return true;
  }

  async function send(text) {
    if (!text || s.loading || !s.sessionId) return;
    if (tryInterceptDiagnosis(text)) return;
    patch({ input: "", loading: true, error: null });
    setS(prev => ({ ...prev, messages: [...prev.messages, { id: Date.now(), role: "player", text }] }));
    try {
      const res = await fetch(`${API}/input`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, sessionId: s.sessionId, caseId: s.caseId }) });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      const isTest = data.intent === "run_test" && data.data?.testKey;
      const newMsgs = [];
      if (data.reaction) newMsgs.push({ id: Date.now() + 1, role: "reaction", text: data.reaction.dialogue, trustDelta: data.reaction.trustDelta > 0 ? `+${data.reaction.trustDelta}` : `${data.reaction.trustDelta}`, newEmotion: data.reaction.newEmotion });
      if (isTest) {
        // Compact chat entry — test name + first sentence of raw findings only.
        // The full report is shown in the DiagnosticResultModal (Design Rule 2).
        const rt = data.data.result_text || "";
        const firstSentence = (rt.split(/(?<=[.!?])\s+/)[0] || rt).trim();
        newMsgs.push({ id: Date.now() + 2, role: "test_result", testKey: data.data.testKey, testLabel: data.data.label || data.data.testKey, text: firstSentence });
      } else {
        const role = data.speaker === "outcome" ? "outcome" : (data.speaker || "narrator");
        newMsgs.push({ id: Date.now() + 2, role, speaker: data.speaker, text: data.dialogue || data.message, effects: data.effects || [] });
      }
      const newExamFindings = data.state.knowledge.exam_findings || [];
      const newTestsRun = data.state.knowledge.tests_run || [];
      const resultText = data.dialogue || data.message;
      setS(prev => {
        const testResults       = { ...prev.testResults };
        const testResultsData    = { ...prev.testResultsData };
        const examResults        = { ...prev.examResults };
        const examHealthImpacts  = { ...prev.examHealthImpacts };
        let diagnosticModal = prev.diagnosticModal;
        if (isTest) {
          testResults[data.data.testKey] = data.data.result_text;
          testResultsData[data.data.testKey] = data.data;
          diagnosticModal = { open: true, testKey: data.data.testKey, testData: data.data };
        }
        if (data.intent === "perform_exam" && data.data?.subtype) {
          examResults[data.data.subtype] = resultText;
          if (examHealthImpacts[data.data.subtype] === undefined) {
            examHealthImpacts[data.data.subtype] = {
              impact: data.data.health_impact ?? 0,
              available: data.data.available !== false,
            };
          }
        }
        return {
          ...prev,
          messages: [...prev.messages, ...newMsgs],
          scores: data.state.scores,
          emotion: data.state.client.emotion,
          actions: data.state.actions_taken,
          examFindings: newExamFindings,
          testsRun: newTestsRun,
          testResults,
          testResultsData,
          diagnosticModal,
          examResults,
          examHealthImpacts,
          loading: false,
          ...(data.data?.finalResult ? { screen: "results", finalState: data.state } : {}),
        };
      });
    } catch (e) { patch({ error: "Could not reach backend. Is the server running on port 3000?", loading: false }); }
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  async function sendTreatment(actionIds, shouldFinalise = false) {
    if (!actionIds.length && !shouldFinalise) return;
    if (s.loading || !s.sessionId) return;
    patch({ loading: true, error: null });
    try {
      const res = await fetch(`${API}/input`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action_ids: actionIds, sessionId: s.sessionId, caseId: s.caseId, finalise: shouldFinalise }) });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      const newMsgs = [];
      if (data.reaction) newMsgs.push({ id: Date.now() + 1, role: "reaction", text: data.reaction.dialogue, trustDelta: data.reaction.trustDelta > 0 ? `+${data.reaction.trustDelta}` : `${data.reaction.trustDelta}`, newEmotion: data.reaction.newEmotion });
      const role = data.speaker === "outcome" ? "outcome" : (data.speaker || "narrator");
      newMsgs.push({ id: Date.now() + 2, role, speaker: data.speaker, text: data.dialogue || data.message, effects: data.effects || [] });
      setS(prev => ({
        ...prev,
        messages: [...prev.messages, ...newMsgs],
        scores: data.state.scores,
        emotion: data.state.client.emotion,
        actions: data.state.actions_taken,
        selectedActionIds: [],
        pendingTreatments: data.state.treatment_action_ids || [],
        loading: false,
        ...(data.data?.finalResult ? { screen: "results", finalState: data.state } : {}),
      }));
    } catch (e) { patch({ error: "Could not reach backend. Is the server running on port 3000?", loading: false }); }
  }

  const emotionColor = { concerned: "var(--color-text-secondary)", frustrated: "var(--color-text-warning)", worried_about_cost: "var(--color-text-warning)", angry: "var(--color-text-danger)" }[s.emotion] || "var(--color-text-secondary)";

  if (s.screen === "results") return <ReportCardScreen finalState={s.finalState} onRetry={() => { const caseId = s.caseId; setS({ ...initState(), allActions: s.allActions, actionsLoaded: s.actionsLoaded, allDiagnostics: s.allDiagnostics, allDiagnoses: s.allDiagnoses, caseId }); selectCase(caseId); }} onNewCase={() => setS({ ...initState(), allActions: s.allActions, actionsLoaded: s.actionsLoaded, allDiagnostics: s.allDiagnostics, allDiagnoses: s.allDiagnoses })} />;
  if (s.screen === "patient") return <PatientCard sessionData={s.sessionData} onBegin={beginConsultation} onBack={() => setS(initState())} />;

  if (s.screen === "select") return (
    <div style={{ padding: "2rem 1.5rem", maxWidth: 520, margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-secondary)", marginBottom: 8 }}>VetSim</div>
        <h2 style={{ fontSize: 22, fontWeight: 500, margin: "0 0 8px", color: "var(--color-text-primary)" }}>Veterinary simulation</h2>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>Play as a vet. Ask questions, examine the patient, run tests, and make a diagnosis. Your choices affect trust and outcomes.</p>
      </div>
      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", display: "block", marginBottom: 8, letterSpacing: "0.05em", textTransform: "uppercase" }}>Select case</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {CASE_OPTIONS.map(c => (
            <button key={c.id} onClick={() => selectCase(c.id)} disabled={s.loading} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", cursor: "pointer", textAlign: "left" }}>
              <span style={{ fontSize: 20 }}>{c.emoji}</span>
              <div>
                <div style={{ fontSize: 14, color: "var(--color-text-primary)", fontWeight: 400 }}>{c.label}</div>
                <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 1 }}>{c.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
      {s.error && <div style={{ padding: "10px 14px", background: "var(--color-background-danger)", borderRadius: "var(--border-radius-md)", fontSize: 13, color: "var(--color-text-danger)", marginBottom: "1rem" }}>{s.error}</div>}
      <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>Make sure the backend is running: <code style={{ fontFamily: "var(--font-mono)", fontSize: 11, padding: "1px 5px", background: "var(--color-background-tertiary)", borderRadius: 4 }}>npm start</code> in your vetsim-backend folder.</p>
    </div>
  );

  return (
    <div style={{ display: "flex", height: 600, maxWidth: 860, margin: "0 auto", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", overflow: "hidden", background: "var(--color-background-primary)" }}>

      <div style={{ width: 188, borderRight: "0.5px solid var(--color-border-tertiary)", padding: "10px 8px", display: "flex", flexDirection: "column", gap: 3, flexShrink: 0, background: "var(--color-background-secondary)" }}>
        <div style={{ padding: "3px 8px 8px", borderBottom: "0.5px solid var(--color-border-tertiary)", marginBottom: 6 }}>
          <ScoreBar label="Trust" value={s.scores.trust} color="#1D9E75" />
          <ScoreBar label="Health" value={s.scores.patient_health} color="#378ADD" />
          <div style={{ fontSize: 11, color: emotionColor, textTransform: "capitalize", marginTop: 4 }}>{(s.emotion || "").replace(/_/g, " ")}</div>
        </div>

        <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--color-text-secondary)", padding: "2px 8px 4px" }}>Actions</div>

        {TABS.map(tab => {
          const active = s.activeTab === tab.id;
          const count = tab.id === "treat_clinic"
            ? s.selectedActionIds.filter(id => { const a = s.allActions.find(x => x.id === id); return a && (a.type === "injectable" || a.type === "intervention"); }).length
            : tab.id === "treat_rx"
            ? s.selectedActionIds.filter(id => { const a = s.allActions.find(x => x.id === id); return a && (a.type === "oral" || a.type === "topical"); }).length
            : tab.id === "dx"
            ? s.selectedDiagnoses.length
            : 0;
          const displayLabel = count > 0 ? `${tab.label} (${count})` : tab.label;
          return (
            <button key={tab.id} onClick={() => patch({ activeTab: tab.id })} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: "var(--border-radius-md)", border: active ? "1px solid var(--color-border-info)" : "0.5px solid transparent", cursor: "pointer", textAlign: "left", background: active ? "var(--color-background-info)" : "transparent" }}>
              <span style={{ fontSize: 13, color: active ? "var(--color-text-info)" : "var(--color-text-primary)", fontWeight: active ? 500 : 400 }}>{displayLabel}</span>
            </button>
          );
        })}

        <div style={{ flex: 1 }} />

        <div style={{ padding: "8px 8px 0", borderTop: "0.5px solid var(--color-border-tertiary)", marginTop: 4 }}>
          <div style={{ fontSize: 10, color: "var(--color-text-secondary)", marginBottom: 4, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>Actions ({s.actions.length})</div>
          <div style={{ fontSize: 10, color: "var(--color-text-secondary)", lineHeight: 1.7, maxHeight: 80, overflowY: "auto" }}>
            {s.actions.length === 0 && <span style={{ opacity: 0.5 }}>None yet</span>}
            {s.actions.map((a, i) => <div key={i}>{i + 1}. {(a.intent || "").replace(/_/g, " ")}</div>)}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        <div style={{ padding: "7px 14px", borderBottom: "0.5px solid var(--color-border-tertiary)", background: "var(--color-background-secondary)", flexShrink: 0, display: "flex", gap: 12, alignItems: "baseline" }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-primary)" }}>{s.sessionData?.state.case.patient.name} — {s.sessionData?.state.case.patient.breed}</div>
          <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>Presenting: {s.sessionData?.state.case.presenting_complaint}</div>
        </div>

        {s.activeTab === "ask" && (
          <>
            <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
              {s.messages.map(msg => <ChatMessage key={msg.id} msg={msg} onViewResult={openDiagnosticModal} />)}
              {s.loading && <div style={{ display: "flex", gap: 6, padding: "8px 0", alignItems: "center" }}>{[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-border-secondary)", animation: `pulse 1.2s ease-in-out ${i*0.2}s infinite` }} />)}</div>}
              <div ref={bottomRef} />
            </div>
            {s.error && <div style={{ padding: "8px 1rem", background: "var(--color-background-danger)", fontSize: 12, color: "var(--color-text-danger)", borderTop: "0.5px solid var(--color-border-danger)" }}>{s.error}</div>}
            <div style={{ borderTop: "0.5px solid var(--color-border-tertiary)", padding: "10px 12px", display: "flex", gap: 8, alignItems: "flex-end" }}>
              <textarea ref={inputRef} value={s.input} onChange={e => patch({ input: e.target.value })} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(s.input.trim()); }}} placeholder="Ask the owner a question…" rows={2} disabled={s.loading} style={{ flex: 1, resize: "none", fontSize: 13, borderRadius: "var(--border-radius-md)", padding: "7px 10px", lineHeight: 1.5, fontFamily: "var(--font-sans)" }} />
              <button onClick={() => send(s.input.trim())} disabled={s.loading || !s.input.trim()} style={{ padding: "7px 14px", fontSize: 13, fontWeight: 500, borderRadius: "var(--border-radius-md)", cursor: s.loading || !s.input.trim() ? "not-allowed" : "pointer", opacity: s.loading || !s.input.trim() ? 0.5 : 1, flexShrink: 0, alignSelf: "stretch" }}>Send</button>
            </div>
          </>
        )}

        {s.activeTab === "exam" && <DogBodyDiagram views={getViews(s.caseId)} examined={s.examFindings} examHealthImpacts={s.examHealthImpacts} onExamine={key => send(`exam:${key}`)} closeupImages={getCloseups(s.caseId)} />}
        {s.activeTab === "diag" && <DiagnosticsPanel tests={s.allDiagnostics} onRun={(key) => send(`test:${key}`)} onView={openDiagnosticModal} testsRun={s.testsRun} />}
        {s.activeTab === "dx" && <DiagnosisPanel
          diagnoses={s.allDiagnoses}
          attempted={s.diagnosisAttempted}
          selectedDiagnoses={s.selectedDiagnoses}
          onSelect={d => {
            const alreadySelected = s.selectedDiagnoses.some(x => x.id === d.id);
            patch({ selectedDiagnoses: alreadySelected ? s.selectedDiagnoses.filter(x => x.id !== d.id) : [...s.selectedDiagnoses, d] });
          }}
          onConfirm={async (selected) => {
            const newAttempted = [...s.diagnosisAttempted];
            for (const d of selected) {
              if (!newAttempted.includes(d.id)) newAttempted.push(d.id);
              await send(`diagnose:${d.id}`);
            }
            patch({ diagnosisAttempted: newAttempted, selectedDiagnoses: [] });
          }}
        />}
        {(s.activeTab === "treat_clinic" || s.activeTab === "treat_rx") && <TreatmentPanel allActions={s.allActions.filter(a => a.type !== "disposition")} actionsLoaded={s.actionsLoaded} selectedActionIds={s.selectedActionIds} onToggle={id => patch({ selectedActionIds: s.selectedActionIds.includes(id) ? s.selectedActionIds.filter(x => x !== id) : [...s.selectedActionIds, id] })} onSubmit={() => sendTreatment(s.selectedActionIds, true)} onDirectSubmit={id => sendTreatment([id], false)} onFinalize={() => sendTreatment([], true)} pendingTreatments={s.pendingTreatments} loading={s.loading} tabId={s.activeTab} />}
        {s.activeTab === "disposition" && <DispositionPanel
          dispositionActions={s.allActions.filter(a => a.type === "disposition")}
          selected={s.dispositionSelected}
          onSelect={id => patch({ dispositionSelected: id })}
          onConfirm={id => { patch({ dispositionSelected: null }); sendTreatment([id], true); }}
          loading={s.loading}
        />}

      </div>

      <DiagnosticResultModal
        open={s.diagnosticModal.open}
        testKey={s.diagnosticModal.testKey}
        testData={s.diagnosticModal.testData}
        patient={s.sessionData?.state.case.patient}
        ownerName={s.sessionData?.state.client?.name}
        caseId={s.caseId}
        onClose={closeDiagnosticModal}
      />

      <style>{`@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }`}</style>
    </div>
  );
}