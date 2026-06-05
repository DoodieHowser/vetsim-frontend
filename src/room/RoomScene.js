// RoomScene.js — the navigable first-person exam room. Lays out the backdrop,
// scenery and clickable objects on a responsive-scaled 1280×800 canvas, and
// hosts the existing consultation panels in a slide-up Drawer. All data and
// handlers are supplied by App — this component holds no clinical logic.
import { DogAvatar, Icon } from "../ui/DesignKit";
import {
  RoomBackdrop, BackCounter, VetTechFigure, SharpsBin, CounterSink,
  SoapDispenser, PaperTowelDispenser, WallStethoscope, DustMotes, Vignette,
} from "./RoomProps";
import {
  Microscope, PharmacyCabinet, MiniFridge, ComputerScreen, ClinicDoor,
  WallClipboard, InstrumentCharger, Otoscope, Ophthalmoscope,
} from "./RoomObjects";
import { ExamTable, SeatedOwner, VitalsMonitor, RollingStool } from "./RoomFigures";
import { Hotspot, TabBar, Drawer, useScale, RoomKeyframes } from "./Drawer";
import posterImg from "./assets/fth-poster.png";

const CANVAS_W = 1280, CANVAS_H = 800;

// Static placeholder patient chart — visible but not wired to any backend
// (design rule: History is a visual placeholder only). Signalment uses the
// live patient record; the rest is intentionally inert preview content.
export function HistoryPanelBody({ patient }) {
  const p = patient || {};
  const facts = [
    ["Breed", p.breed], ["Age", p.age != null ? `${p.age} yr` : "—"],
    ["Sex", p.sex], ["Weight", p.weight_kg != null ? `${p.weight_kg} kg` : "—"],
  ];
  const sections = [
    { label: "Nurse intake report", icon: "clipboard" },
    { label: "Current / recent medication", icon: "pill" },
    { label: "Presenting history", icon: "list" },
    { label: "Prior visits", icon: "chat" },
  ];
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "16px 22px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
          {facts.map(([k, v]) => (
            <div key={k} style={{ padding: "9px 12px", borderRadius: "var(--border-radius-sm)", background: "var(--color-background-secondary)", border: "1px solid var(--color-border-tertiary)" }}>
              <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-text-secondary)" }}>{k}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text-primary)", marginTop: 2 }}>{v || "—"}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {sections.map(s => (
            <div key={s.label} style={{ padding: "14px 15px", borderRadius: "var(--border-radius-md)", background: "var(--color-background-primary)", border: "1.5px dashed var(--color-border-secondary)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
                <span style={{ color: "var(--color-text-secondary)" }}><Icon name={s.icon} size={15} stroke={2.2} /></span>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--color-text-secondary)" }}>{s.label}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[88, 72, 60].map((w, i) => <div key={i} style={{ height: 6, width: `${w}%`, borderRadius: 3, background: "var(--color-background-tertiary)" }} />)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "11px 14px", borderRadius: "var(--border-radius-md)", background: "var(--color-background-info)", border: "1px solid var(--color-border-info)" }}>
          <span style={{ color: "var(--color-text-info)" }}><Icon name="info" size={16} stroke={2.2} /></span>
          <span style={{ fontSize: 13, lineHeight: 1.5, color: "var(--color-text-primary)" }}>Patient chart — placeholder preview. This panel is not yet connected to the case record.</span>
        </div>
      </div>
    </div>
  );
}

// Patient on the exam table: a standing dog in side profile with its body
// pointing toward the owner (left), and the existing generic front-facing
// DogAvatar head turned to the viewer (like the seated human). The body is
// drawn here (room-local); the shared DogAvatar in DesignKit is left untouched.
// Body fur matches the head's existing breed tint purely for coherence — no new
// case-specific patient art (that's a later task).
function PatientDog({ breed = "frenchie", size = 210 }) {
  const fur = breed === "frenchie" ? "#C9A07B" : "#E2B978";
  const furDark = breed === "frenchie" ? "#A87E58" : "#C99A52";
  const muzzle = breed === "frenchie" ? "#EBD7BE" : "#F3E4C4";
  const headSize = size * 0.46;
  const bodyW = size, bodyH = size * (100 / 150);
  return (
    <div style={{ position: "relative", width: size, height: size * 0.72 }}>
      <svg width={bodyW} height={bodyH} viewBox="0 0 150 100"
        style={{ position: "absolute", left: 0, bottom: 0, display: "block" }}>
        <ellipse cx="80" cy="95" rx="66" ry="5.5" fill="rgba(40,22,10,0.18)" />
        {/* far legs (behind torso) */}
        <rect x="50" y="58" width="11" height="35" rx="5.5" fill={furDark} />
        <rect x="106" y="56" width="11" height="37" rx="5.5" fill={furDark} />
        {/* torso, rear haunch, front chest */}
        <ellipse cx="124" cy="52" rx="23" ry="25" fill={fur} />
        <rect x="34" y="30" width="104" height="44" rx="22" fill={fur} />
        <ellipse cx="44" cy="55" rx="18" ry="21" fill={fur} />
        {/* tail */}
        <path d="M134 40 q18 -4 15 -25 q-2 13 -14 17 z" fill={fur} />
        {/* near legs + paws */}
        <rect x="60" y="60" width="12" height="34" rx="6" fill={fur} />
        <rect x="99" y="58" width="13" height="36" rx="6" fill={fur} />
        <ellipse cx="66" cy="92" rx="7.5" ry="4" fill={muzzle} />
        <ellipse cx="105.5" cy="92" rx="8" ry="4" fill={muzzle} />
        {/* neck rising to the head */}
        <path d="M34 52 q-3 -28 11 -36 l14 2 q7 16 3 34 z" fill={fur} />
        <ellipse cx="74" cy="40" rx="34" ry="14" fill="rgba(255,255,255,0.14)" />
      </svg>
      {/* front-facing head (reused existing avatar), turned to the viewer */}
      <div style={{ position: "absolute", top: 0, left: "2%" }}>
        <DogAvatar breed={breed} size={headSize} />
      </div>
    </div>
  );
}

export default function RoomScene({
  tod = "afternoon", scores, emotion, patient, caseId, presentingComplaint,
  diffCount = 0, examCount = 0, spend = 0,
  activeDrawer, drawerMeta, onNav, onClose, children,
}) {
  const sc = useScale();
  const examActive = activeDrawer === "exam";
  const breed = caseId === "gdv_001" ? "lab" : "frenchie";
  const patientName = patient?.name || "Patient";
  const patientSub = [patient?.breed, patient?.age != null ? `${patient.age} yr` : null].filter(Boolean).join(" · ");

  return (
    <div style={{ position: "fixed", inset: 0, background: "radial-gradient(circle at 50% 30%, #2a1d12, #160f0a)", display: "grid", placeItems: "center", overflow: "hidden" }}>
      <RoomKeyframes />
      <div style={{ width: CANVAS_W, height: CANVAS_H, transform: `scale(${sc})`, transformOrigin: "center", position: "relative", borderRadius: 18, overflow: "hidden", boxShadow: "0 40px 120px rgba(0,0,0,0.6)" }}>

        {/* set dressing */}
        <RoomBackdrop tod={tod} />
        <BackCounter />
        <VetTechFigure />
        <div style={{ position: "absolute", left: 44, top: 74, width: 110, height: 165, borderRadius: 6, overflow: "hidden", border: "5px solid #FBF6EE", boxShadow: "0 10px 22px rgba(90,60,35,0.22)" }}>
          <img src={posterImg} alt="Flea, tick & heartworm prevention poster" style={{ display: "block", width: "100%", height: "100%", objectFit: "contain" }} />
        </div>
        <div style={{ position: "absolute", left: 310, top: 306, width: 40, height: 56 }}><SharpsBin /></div>
        <div style={{ position: "absolute", left: 756, top: 312, width: 112, height: 56 }}><CounterSink /></div>
        <div style={{ position: "absolute", left: 762, top: 234, width: 30, height: 76 }}><SoapDispenser /></div>
        <div style={{ position: "absolute", left: 800, top: 238, width: 62, height: 72 }}><PaperTowelDispenser /></div>
        <DustMotes />

        {/* clickable objects → workflow tabs */}
        <Hotspot box={{ x: 250, y: 72, w: 210, h: 174 }} label="Pharmacy — oral meds" icon="pill"
          active={activeDrawer === "treat_rx"} onClick={() => onNav("treat_rx")}><PharmacyCabinet /></Hotspot>
        <Hotspot box={{ x: 130, y: 244, w: 172, h: 124 }} label="Computer — patient chart" icon="monitor"
          active={activeDrawer === "history"} onClick={() => onNav("history")}><ComputerScreen /></Hotspot>
        <Hotspot box={{ x: 360, y: 282, w: 80, h: 86 }} label="Microscope — diagnostics" icon="microscope"
          active={activeDrawer === "diag"} onClick={() => onNav("diag")}><Microscope /></Hotspot>
        <Hotspot box={{ x: 600, y: 70, w: 152, h: 392 }} label="Door — disposition" icon="door" labelSide="bottom" z={9}
          active={activeDrawer === "disposition"} onClick={() => onNav("disposition")}><ClinicDoor /></Hotspot>
        <Hotspot box={{ x: 800, y: 58, w: 116, h: 132 }} label="Clipboard — differentials" icon="list"
          active={activeDrawer === "dx"} onClick={() => onNav("dx")}><WallClipboard count={diffCount} /></Hotspot>
        <Hotspot box={{ x: 884, y: 250, w: 88, h: 112 }} label="Fridge — injectables" icon="syringe"
          active={activeDrawer === "treat_clinic"} onClick={() => onNav("treat_clinic")}><MiniFridge /></Hotspot>

        {/* exam instrument station (each opens the exam panel) */}
        <div style={{ position: "absolute", left: 456, top: 198, width: 104, height: 150, zIndex: 10 }}><InstrumentCharger /></div>
        <Hotspot box={{ x: 462, y: 156, w: 44, h: 104 }} label="Ophthalmoscope — examine" icon="eye" z={12}
          active={examActive} onClick={() => onNav("exam")}><Ophthalmoscope /></Hotspot>
        <Hotspot box={{ x: 506, y: 156, w: 44, h: 104 }} label="Otoscope — examine" icon="ear" z={12}
          active={examActive} onClick={() => onNav("exam")}><Otoscope /></Hotspot>
        <Hotspot box={{ x: 558, y: 162, w: 38, h: 150 }} label="Stethoscope — examine" icon="stethoscope" z={12}
          active={examActive} onClick={() => onNav("exam")}><WallStethoscope /></Hotspot>

        {/* owner (ask) */}
        <Hotspot box={{ x: 206, y: 402, w: 138, h: 338 }} label="Owner — ask questions" icon="chat" z={9}
          active={activeDrawer === "ask"} onClick={() => onNav("ask")}>
          <div style={{ position: "absolute", inset: 0 }} />
        </Hotspot>
        <SeatedOwner caseId={caseId} speaking={activeDrawer === "ask"} dimmed={!!activeDrawer && activeDrawer !== "ask"} mood="frustrated" />

        {/* exam table + patient (examine) */}
        <ExamTable />
        <div style={{ position: "absolute", left: 858, top: 528, width: 140, height: 182, zIndex: 7 }}><RollingStool /></div>
        <Hotspot box={{ x: 483, y: 374, w: 315, h: 227 }} label="Examine patient" icon="stethoscope" z={11}
          active={examActive} onClick={() => onNav("exam")}>
          <div style={{ position: "absolute", left: "50%", bottom: 0, transform: "translateX(-50%)", filter: "drop-shadow(0 12px 16px rgba(40,22,10,0.34))" }}>
            <PatientDog breed={breed} size={315} />
          </div>
        </Hotspot>

        {/* live patient status (scores + owner-mood chip) */}
        <VitalsMonitor trust={scores?.trust} health={scores?.patient_health} cost={scores?.cost} emotion={emotion} patientName={patientName} />

        {/* orientation */}
        <div style={{ position: "absolute", left: 22, top: 20, zIndex: 30, display: "flex", alignItems: "center", gap: 9, padding: "8px 14px 8px 9px", borderRadius: 99, background: "rgba(255,253,249,0.84)", backdropFilter: "blur(4px)", border: "1px solid var(--color-border-tertiary)", boxShadow: "var(--ds-shadow-card)" }}>
          <span style={{ width: 26, height: 26, borderRadius: 8, background: "var(--ds-accent)", color: "#fff", display: "grid", placeItems: "center" }}><Icon name="hospital" size={15} stroke={2.2} /></span>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700 }}>Exam Room</span>
          {presentingComplaint && <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>· {presentingComplaint}</span>}
        </div>

        {/* hosted consultation panel */}
        {activeDrawer && drawerMeta && (
          <Drawer title={drawerMeta.title} sub={drawerMeta.sub} icon={drawerMeta.icon} onClose={onClose}>
            {children}
          </Drawer>
        )}

        {/* bottom labeled tab row (fallback for every object) */}
        <TabBar navId={activeDrawer} onNav={onNav} patientName={patientName} patientSub={patientSub} hud={{ exams: examCount, spend }} />

        <Vignette />
      </div>
    </div>
  );
}
