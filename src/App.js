import { useState, useRef, useEffect } from "react";
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

const DERM_TESTS = [
  { group: "Skin & coat", tests: [
    { key: "skin_cytology", label: "Skin cytology", desc: "Tape prep of affected skin", cost: "$65" },
    { key: "skin_scrape", label: "Skin scrape", desc: "Microscopy of skin surface sample", cost: "$45" },
    { key: "ear_cytology", label: "Ear cytology", desc: "Swab of ear canal discharge", cost: "$55" },
  ]},
  { group: "Allergy", tests: [
    { key: "intradermal_allergy", label: "Intradermal allergy test", desc: "Intradermal injection panel", cost: "$280" },
    { key: "blood_allergy_panel", label: "Serum allergy panel", desc: "Blood IgE measurement", cost: "$195" },
    { key: "food_elimination_trial", label: "Food elimination trial", desc: "8-week hydrolysed diet trial", cost: "$0" },
  ]},
];

const GDV_TESTS = [
  { group: "Imaging", tests: [
    { key: "xray_abdominal", label: "Abdominal X-ray", desc: "Right lateral and VD radiographs", cost: "$180" },
    { key: "ultrasound_abdominal", label: "Abdominal ultrasound", desc: "Transabdominal sonography", cost: "$220" },
  ]},
  { group: "Blood work", tests: [
    { key: "blood_cbc", label: "CBC", desc: "Complete blood count", cost: "$95" },
    { key: "blood_chemistry", label: "Blood chemistry", desc: "Metabolic panel with lactate", cost: "$140" },
  ]},
  { group: "Cardiac", tests: [
    { key: "ecg", label: "ECG", desc: "Continuous cardiac rhythm monitoring", cost: "$75" },
  ]},
];

const DERM_DIAGNOSES = [
  { group: "Allergic & inflammatory", dx: [
    { label: "Atopic dermatitis", id: "atopic_dermatitis" },
    { label: "Malassezia / yeast dermatitis", id: "malassezia_dermatitis" },
    { label: "Contact allergy", id: "contact_allergy" },
  ]},
  { group: "Parasitic", dx: [
    { label: "Sarcoptic mange", id: "sarcoptic_mange" },
    { label: "Demodectic mange", id: "demodectic_mange" },
  ]},
  { group: "Dietary", dx: [
    { label: "Food allergy — dietary trigger", id: "food_allergy" },
  ]},
];

const GDV_DIAGNOSES = [
  { group: "Emergency", dx: [
    { label: "Gastric dilatation-volvulus (GDV)", id: "gdv" },
    { label: "Gastric bloat without volvulus", id: "gastric_bloat" },
  ]},
  { group: "Other", dx: [
    { label: "Splenic mass", id: "splenic_mass" },
    { label: "Intestinal obstruction", id: "intestinal_obstruction" },
    { label: "Pancreatitis", id: "pancreatitis" },
  ]},
];


// Each SVG uses the image's native pixel dimensions as its viewBox so the full image
// is always visible with no cropping. Region coordinates are in original image pixel space.
// Label font sizes are calibrated to render ~8px on screen at a ~330px panel width.
const VIEWS = [
  {
    id: "lateral", label: "Lateral",
    image: pepperImg,
    origW: 1536, origH: 1024, labelFontSize: 38,
    // Dog faces LEFT. Head is at left, rump/tail at right. Near ear (dog's right) faces camera.
    regions: [
      { mapKey: "lat_temperature",     key: "temperature", label: "Temp",    cx: 1300, cy:  380, rx:  90, ry:  70 },
      { mapKey: "lat_general",         key: "general",     label: "General", cx:  750, cy:  470, rx: 120, ry: 100 },
      { mapKey: "lat_skin",            key: "skin",        label: "Skin",    cx:  800, cy:  600, rx: 400, ry:  50 },
      { mapKey: "lat_lymph_prescap",   key: "lymph_nodes", label: "Lymph",   cx:  460, cy:  400, rx:  60, ry:  50 },
      { mapKey: "lat_lymph_submandib", key: "lymph_nodes", label: "Lymph",   cx:  220, cy:  470, rx:  55, ry:  42 },
      { mapKey: "lat_paws_front",      key: "paws",        label: "Paws",    cx:  440, cy:  920, rx: 100, ry:  50 },
      { mapKey: "lat_paws_back",       key: "paws",        label: "Paws",    cx: 1220, cy:  920, rx: 110, ry:  50 },
      { mapKey: "lat_ears_far",        key: "ears",        label: "Ears",    cx:  265, cy:  135, rx:  55, ry:  80 },
    ],
  },
  {
    id: "ventral", label: "Ventral",
    image: pepperVentralImg,
    origW: 1024, origH: 1536, labelFontSize: 26,
    // Belly-up, head at top. Pink erythema on inner thighs/groin. Front paws flanking chest.
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
    // Dog facing camera. Large bat ears at top. Pink patches at front of shoulder joints.
    regions: [
      { mapKey: "frt_ears_left",      key: "ears",           label: "Ears",  cx:  210, cy: 175, rx: 130, ry: 115 },
      { mapKey: "frt_ears_right",     key: "ears",           label: "Ears",  cx:  910, cy: 175, rx: 130, ry: 115 },
      { mapKey: "frt_respiratory",    key: "respiratory",    label: "Lungs", cx:  561, cy: 700, rx: 240, ry: 155 },
      { mapKey: "frt_cardiovascular", key: "cardiovascular", label: "Heart", cx:  650, cy: 660, rx: 130, ry: 110 },
    ],
  },
  {
    id: "caudal", label: "Caudal",
    image: pepperCaudalImg,
    origW: 1122, origH: 1402, labelFontSize: 28,
    // Dog's rear. Pink bilateral inner-thigh erythema. Paws at bottom. Head wrinkles visible at top.
    regions: [
      { mapKey: "cau_temperature", key: "temperature", label: "Temp", cx:  560, cy:  510, rx: 100, ry:  80 },
      { mapKey: "cau_paws_left",   key: "paws",        label: "Paws", cx:  310, cy: 1290, rx: 120, ry:  60 },
      { mapKey: "cau_paws_right",  key: "paws",        label: "Paws", cx:  810, cy: 1290, rx: 120, ry:  60 },
    ],
  },
];

// GDV (Biscuit) exam views — dog faces RIGHT in lateral.
// GDV-relevant regions: abdomen (primary), cardiovascular, respiratory, general, hydration, temperature, paws.
const BISCUIT_VIEWS = [
  {
    id: "lateral", label: "Lateral",
    image: biscuitImg,
    origW: 1536, origH: 1024, labelFontSize: 38,
    // Dog faces RIGHT. Head at right, rump/tail at left. Front legs under chest (right side).
    regions: [
      { mapKey: "lat_abdomen",    key: "abdomen",        label: "Abdomen", cx:  680, cy: 640, rx: 250, ry: 140 },
      { mapKey: "lat_cardio",     key: "cardiovascular", label: "Heart",   cx: 1010, cy: 440, rx: 115, ry:  90 },
      { mapKey: "lat_general",    key: "general",        label: "General", cx:  720, cy: 370, rx: 120, ry:  95 },
      { mapKey: "lat_temp",       key: "temperature",    label: "Temp",    cx:  220, cy: 340, rx:  90, ry:  70 },
      { mapKey: "lat_paws_front", key: "paws",           label: "Paws",    cx: 1150, cy: 930, rx: 110, ry:  50 },
      { mapKey: "lat_paws_back",  key: "paws",           label: "Paws",    cx:  360, cy: 930, rx: 110, ry:  50 },
    ],
  },
  {
    id: "ventral", label: "Ventral",
    image: biscuitVentralImg,
    origW: 1024, origH: 1536, labelFontSize: 26,
    // Massively distended abdomen dominates. Hydration checked at throat/mucosa (top).
    regions: [
      { mapKey: "ven_hydration", key: "hydration", label: "Hydration", cx: 512, cy:  290, rx: 140, ry:  70 },
      { mapKey: "ven_abdomen",   key: "abdomen",   label: "Abdomen",   cx: 512, cy:  820, rx: 400, ry: 290 },
    ],
  },
  {
    id: "frontal", label: "Frontal",
    image: biscuitFrontalImg,
    origW: 1122, origH: 1402, labelFontSize: 28,
    // Chest + slightly distended lower belly visible from front.
    regions: [
      { mapKey: "frt_respiratory",    key: "respiratory",    label: "Lungs",   cx: 561, cy: 620, rx: 250, ry: 165 },
      { mapKey: "frt_cardiovascular", key: "cardiovascular", label: "Heart",   cx: 650, cy: 590, rx: 155, ry: 120 },
      { mapKey: "frt_abdomen",        key: "abdomen",        label: "Abdomen", cx: 561, cy: 920, rx: 280, ry: 130 },
    ],
  },
  {
    id: "caudal", label: "Caudal",
    image: biscuitCaudalImg,
    origW: 1024, origH: 1536, labelFontSize: 26,
    // Rear view. Temperature (rectal) at tail base, hind paws at bottom.
    regions: [
      { mapKey: "cau_temperature", key: "temperature", label: "Temp", cx: 512, cy:  475, rx: 110, ry:  85 },
      { mapKey: "cau_paws_left",   key: "paws",        label: "Paws", cx: 290, cy: 1390, rx:  95, ry:  55 },
      { mapKey: "cau_paws_right",  key: "paws",        label: "Paws", cx: 730, cy: 1390, rx:  95, ry:  55 },
    ],
  },
];

const ACTION_TYPE_ORDER = ["injectable", "oral", "intervention", "surgery"];
const ACTION_TYPE_LABELS = { injectable: "Injectables", oral: "Oral medications", intervention: "Interventions", surgery: "Surgical" };

function getTests(caseId) { return caseId === "gdv_001" ? GDV_TESTS : DERM_TESTS; }
function getDiagnoses(caseId) { return caseId === "gdv_001" ? GDV_DIAGNOSES : DERM_DIAGNOSES; }
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

function ChatMessage({ msg }) {
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

function DiagnosticsPanel({ caseId, onRun, testsRun, testResults = {} }) {
  const groups = getTests(caseId);
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
      <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--color-text-secondary)", marginBottom: 12 }}>Select a test to run</div>
      {groups.map(g => (
        <div key={g.group} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", fontWeight: 500, marginBottom: 6 }}>{g.group}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {g.tests.map(t => {
              const done = testsRun.includes(t.key);
              const result = testResults[t.key];
              return (
                <div key={t.key}>
                  <button onClick={() => !done && onRun(t.key, t.label)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 12px", borderRadius: result ? "var(--border-radius-md) var(--border-radius-md) 0 0" : "var(--border-radius-md)", border: done ? "0.5px solid var(--color-border-tertiary)" : "0.5px solid var(--color-border-secondary)", borderBottom: result ? "none" : undefined, cursor: done ? "default" : "pointer", textAlign: "left", background: done ? "var(--color-background-tertiary)" : "var(--color-background-primary)", opacity: done ? 0.8 : 1 }}>
                    <div>
                      <div style={{ fontSize: 13, color: "var(--color-text-primary)" }}>{t.label} {done ? "✓" : ""}</div>
                      <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{t.desc}</div>
                    </div>
                    <span style={{ fontSize: 11, color: "var(--color-text-secondary)", flexShrink: 0, marginLeft: 8 }}>{t.cost}</span>
                  </button>
                  {result && (
                    <div style={{ padding: "8px 12px 10px", background: "var(--color-background-info)", border: "0.5px solid var(--color-border-tertiary)", borderTop: "none", borderRadius: "0 0 var(--border-radius-md) var(--border-radius-md)", fontSize: 12, color: "var(--color-text-primary)", lineHeight: 1.5 }}>
                      {result}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function DiagnosisPanel({ caseId, onDiagnose, attempted }) {
  const groups = getDiagnoses(caseId);
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
      <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--color-text-secondary)", marginBottom: 12 }}>Select your diagnosis</div>
      {groups.map(g => (
        <div key={g.group} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", fontWeight: 500, marginBottom: 6 }}>{g.group}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {g.dx.map(d => {
              const done = attempted.includes(d.id);
              return (
                <button key={d.id} onClick={() => onDiagnose(d)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 12px", borderRadius: "var(--border-radius-md)", border: done ? "0.5px solid var(--color-border-info)" : "0.5px solid var(--color-border-secondary)", cursor: "pointer", textAlign: "left", background: done ? "var(--color-background-info)" : "var(--color-background-primary)", fontSize: 13, color: "var(--color-text-primary)", fontWeight: done ? 500 : 400 }}>
                  <span>{d.label}</span>
                  {done && <span style={{ fontSize: 11, color: "var(--color-text-info)" }}>✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function TreatmentPanel({ allActions, actionsLoaded, selectedActionIds, onToggle, onSubmit, loading }) {
  const grouped = groupActionsByType(allActions);
  const totalCost = selectedActionIds.reduce((sum, id) => {
    const a = allActions.find(x => x.id === id);
    return sum + (a ? a.cost : 0);
  }, 0);

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

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
      <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--color-text-secondary)", marginBottom: 4 }}>Select treatments</div>
      <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 12 }}>Choose all that apply — reason from mechanism, not drug name.</div>

      {ACTION_TYPE_ORDER.filter(t => grouped[t]?.length).map(type => (
        <div key={type} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", fontWeight: 500, marginBottom: 6 }}>{ACTION_TYPE_LABELS[type]}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {grouped[type].map(action => {
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
                    <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 2 }}>
                      {action.hidden_role.replace(/_/g, " ")} · ${action.cost}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      <div style={{ paddingTop: 12, borderTop: "0.5px solid var(--color-border-tertiary)" }}>
        {selectedActionIds.length > 0 && (
          <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 8 }}>
            {selectedActionIds.length} selected · estimated cost ${totalCost}
          </div>
        )}
        <button
          onClick={onSubmit}
          disabled={loading || selectedActionIds.length === 0}
          style={{ width: "100%", padding: "10px 12px", borderRadius: "var(--border-radius-md)", border: "none", cursor: selectedActionIds.length === 0 || loading ? "not-allowed" : "pointer", background: selectedActionIds.length === 0 ? "var(--color-background-tertiary)" : "#A32D2D", color: selectedActionIds.length === 0 ? "var(--color-text-secondary)" : "#fff", fontSize: 13, fontWeight: 500, opacity: loading ? 0.6 : 1 }}
        >
          {selectedActionIds.length === 0 ? "Select at least one treatment" : "Complete Treatment"}
        </button>
      </div>
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

const TABS = [
  { id: "ask", label: "Ask questions" },
  { id: "exam", label: "Physical exam" },
  { id: "diag", label: "Run diagnostics" },
  { id: "dx", label: "Make diagnosis" },
  { id: "treat", label: "Start treatment" },
];

function initState() {
  return { sessionId: null, caseId: "derm_001", messages: [], input: "", loading: false, scores: { trust: 50, patient_health: 100, cost: 50 }, actions: [], screen: "select", error: null, emotion: "concerned", sessionData: null, finalState: null, activeTab: "ask", examFindings: [], testsRun: [], testResults: {}, examResults: {}, examHealthImpacts: {}, allActions: [], actionsLoaded: false, selectedActionIds: [], diagnosisAttempted: [] };
}

export default function App() {
  const [s, setS] = useState(initState());
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [s.messages]);

  useEffect(() => {
    fetch(`${API}/actions`)
      .then(r => r.json())
      .then(data => patch({ allActions: data.actions || [], actionsLoaded: true }))
      .catch(() => patch({ actionsLoaded: true }));
  }, []);

  function patch(obj) { setS(prev => ({ ...prev, ...obj })); }

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
    const d = s.sessionData;
    patch({
      screen: "chat", activeTab: "ask",
      messages: [{ id: Date.now(), role: "narrator", speaker: "narrator", text: `Case loaded: ${d.state.case.title}. Patient: ${d.state.case.patient.name}, ${d.state.case.patient.breed}. Presenting complaint: ${d.state.case.presenting_complaint}.`, effects: [] }]
    });
  }

  async function send(text) {
    if (!text || s.loading || !s.sessionId) return;
    patch({ input: "", loading: true, error: null });
    setS(prev => ({ ...prev, messages: [...prev.messages, { id: Date.now(), role: "player", text }] }));
    try {
      const res = await fetch(`${API}/input`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, sessionId: s.sessionId, caseId: s.caseId }) });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      const newMsgs = [];
      if (data.reaction) newMsgs.push({ id: Date.now() + 1, role: "reaction", text: data.reaction.dialogue, trustDelta: data.reaction.trustDelta > 0 ? `+${data.reaction.trustDelta}` : `${data.reaction.trustDelta}`, newEmotion: data.reaction.newEmotion });
      const role = data.speaker === "outcome" ? "outcome" : (data.speaker || "narrator");
      newMsgs.push({ id: Date.now() + 2, role, speaker: data.speaker, text: data.dialogue || data.message, effects: data.effects || [] });
      const newExamFindings = data.state.knowledge.exam_findings || [];
      const newTestsRun = data.state.knowledge.tests_run || [];
      const resultText = data.dialogue || data.message;
      setS(prev => {
        const testResults      = { ...prev.testResults };
        const examResults      = { ...prev.examResults };
        const examHealthImpacts = { ...prev.examHealthImpacts };
        if (data.intent === "run_test" && data.data?.testKey) testResults[data.data.testKey] = resultText;
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
          examResults,
          examHealthImpacts,
          loading: false,
          ...(data.data?.finalResult ? { screen: "results", finalState: data.state } : {}),
        };
      });
    } catch (e) { patch({ error: "Could not reach backend. Is the server running on port 3000?", loading: false }); }
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  async function sendTreatment(actionIds) {
    if (!actionIds.length || s.loading || !s.sessionId) return;
    patch({ loading: true, error: null });
    try {
      const res = await fetch(`${API}/input`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action_ids: actionIds, sessionId: s.sessionId, caseId: s.caseId }) });
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
        loading: false,
        ...(data.data?.finalResult ? { screen: "results", finalState: data.state } : {}),
      }));
    } catch (e) { patch({ error: "Could not reach backend. Is the server running on port 3000?", loading: false }); }
  }

  const emotionColor = { concerned: "var(--color-text-secondary)", frustrated: "var(--color-text-warning)", worried_about_cost: "var(--color-text-warning)", angry: "var(--color-text-danger)" }[s.emotion] || "var(--color-text-secondary)";

  if (s.screen === "results") return <ReportCardScreen finalState={s.finalState} onRetry={() => { const caseId = s.caseId; setS({ ...initState(), allActions: s.allActions, actionsLoaded: s.actionsLoaded, caseId }); selectCase(caseId); }} onNewCase={() => setS(initState())} />;
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

        {TABS.slice(0, 4).map(tab => {
          const active = s.activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => patch({ activeTab: tab.id })} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: "var(--border-radius-md)", border: active ? "1px solid var(--color-border-info)" : "0.5px solid transparent", cursor: "pointer", textAlign: "left", background: active ? "var(--color-background-info)" : "transparent" }}>
              <span style={{ fontSize: 13, color: active ? "var(--color-text-info)" : "var(--color-text-primary)", fontWeight: active ? 500 : 400 }}>{tab.label}</span>
            </button>
          );
        })}

        <div style={{ flex: 1 }} />

        <button onClick={() => patch({ activeTab: "treat" })} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: "var(--border-radius-md)", border: s.activeTab === "treat" ? "1px solid #F7C1C1" : "0.5px solid var(--color-border-secondary)", cursor: "pointer", textAlign: "left", background: s.activeTab === "treat" ? "#FCEBEB" : "var(--color-background-primary)", marginTop: 4 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: "#A32D2D" }}>Start treatment</span>
        </button>

        <div style={{ padding: "8px 8px 0", borderTop: "0.5px solid var(--color-border-tertiary)", marginTop: 4 }}>
          <div style={{ fontSize: 10, color: "var(--color-text-secondary)", marginBottom: 4, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>Actions ({s.actions.length})</div>
          <div style={{ fontSize: 10, color: "var(--color-text-secondary)", lineHeight: 1.7, maxHeight: 80, overflowY: "auto" }}>
            {s.actions.length === 0 && <span style={{ opacity: 0.5 }}>None yet</span>}
            {s.actions.map((a, i) => <div key={i}>{i + 1}. {(a.intent || "").replace(/_/g, " ")}</div>)}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {s.activeTab === "ask" && (
          <>
            <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
              {s.messages.map(msg => <ChatMessage key={msg.id} msg={msg} />)}
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

        {s.activeTab === "exam" && <DogBodyDiagram views={getViews(s.caseId)} examined={s.examFindings} examHealthImpacts={s.examHealthImpacts} onExamine={key => send(`Examine the ${key}`)} closeupImages={getCloseups(s.caseId)} />}
        {s.activeTab === "diag" && <DiagnosticsPanel caseId={s.caseId} onRun={(key) => send(`test:${key}`)} testsRun={s.testsRun} testResults={s.testResults} />}
        {s.activeTab === "dx" && <DiagnosisPanel caseId={s.caseId} attempted={s.diagnosisAttempted} onDiagnose={d => { patch({ diagnosisAttempted: s.diagnosisAttempted.includes(d.id) ? s.diagnosisAttempted : [...s.diagnosisAttempted, d.id] }); send(`diagnose:${d.id}`); }} />}
        {s.activeTab === "treat" && <TreatmentPanel allActions={s.allActions} actionsLoaded={s.actionsLoaded} selectedActionIds={s.selectedActionIds} onToggle={id => patch({ selectedActionIds: s.selectedActionIds.includes(id) ? s.selectedActionIds.filter(x => x !== id) : [...s.selectedActionIds, id] })} onSubmit={() => sendTreatment(s.selectedActionIds)} loading={s.loading} />}

      </div>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }`}</style>
    </div>
  );
}