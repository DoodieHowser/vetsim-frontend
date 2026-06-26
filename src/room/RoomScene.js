// RoomScene.js — the navigable first-person exam room. Lays out the backdrop,
// scenery and clickable objects on a responsive-scaled 1280×800 canvas, and
// hosts the existing consultation panels in a slide-up Drawer. All data and
// handlers are supplied by App — this component holds no clinical logic.
// eslint-disable-next-line no-unused-vars
import { DogAvatar, Icon } from "../ui/DesignKit";
import { VetTechFigure, DustMotes, Vignette } from "./RoomProps";
import { ExamTable, SeatedOwner, VitalsMonitor, RollingStool } from "./RoomFigures";
import { Hotspot, TabBar, Drawer, useScale, RoomKeyframes } from "./Drawer";
import pepperRoomImg from "../images/pepper_room.png";
import biscuitRoomImg from "../images/biscuit_room.png";
import roomBgImg from "../images/room_background.png";

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

function PatientDog({ breed = "frenchie", size = 210 }) {
  const src = breed === "lab" ? biscuitRoomImg : pepperRoomImg;
  return (
    <img
      src={src}
      alt=""
      style={{
        width: size,
        height: "auto",
        display: "block",
        ...(breed === "lab" ? { transform: "scaleX(-1)" } : {}),
      }}
    />
  );
}

export default function RoomScene({
  tod = "afternoon", scores, emotion, patient, caseId, presentingComplaint,
  diffCount = 0, examCount = 0, spend = 0,
  activeDrawer, drawerMeta, onNav, onNavWithZone, onClose, children,
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

        {/* background image replaces all coded backdrop and set-dressing props */}
        <img
          src={roomBgImg}
          alt=""
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        />
        <VetTechFigure mood={emotion} />
        <DustMotes />

        {/* clickable objects → workflow tabs */}
        <Hotspot box={{ x: 240, y: 60, w: 220, h: 185 }} label="Pharmacy — oral meds" icon="pill"
          active={activeDrawer === "treat_rx"} onClick={() => onNav("treat_rx")}>
          <div style={{ position: "absolute", inset: 0 }} />
        </Hotspot>
        <Hotspot box={{ x: 260, y: 265, w: 155, h: 130 }} label="Computer — patient chart" icon="monitor"
          active={activeDrawer === "history"} onClick={() => onNav("history")}>
          <div style={{ position: "absolute", inset: 0 }} />
        </Hotspot>
        <Hotspot box={{ x: 500, y: 255, w: 80, h: 145 }} label="Microscope — diagnostics" icon="microscope"
          active={activeDrawer === "diag"} onClick={() => onNav("diag")}>
          <div style={{ position: "absolute", inset: 0 }} />
        </Hotspot>
        <Hotspot box={{ x: 600, y: 65, w: 158, h: 420 }} label="Door — disposition" icon="door" labelSide="bottom" z={9}
          active={activeDrawer === "disposition"} onClick={() => onNav("disposition")}>
          <div style={{ position: "absolute", inset: 0 }} />
        </Hotspot>
        <Hotspot box={{ x: 863, y: 95, w: 148, h: 200 }} label="Clipboard — differentials" icon="list"
          active={activeDrawer === "dx"} onClick={() => onNav("dx")}>
          <div style={{ position: "absolute", inset: 0 }} />
        </Hotspot>
        <Hotspot box={{ x: 820, y: 265, w: 148, h: 170 }} label="Fridge — injectables" icon="syringe"
          active={activeDrawer === "treat_clinic"} onClick={() => onNav("treat_clinic")}>
          <div style={{ position: "absolute", inset: 0 }} />
        </Hotspot>

        {/* exam instrument station (each opens the exam panel) */}
        <Hotspot box={{ x: 488, y: 148, w: 48, h: 108 }} label="Ophthalmoscope — examine" icon="eye" z={12}
          active={examActive} onClick={() => onNavWithZone ? onNavWithZone("exam", "eyes") : onNav("exam")}>
          <div style={{ position: "absolute", inset: 0 }} />
        </Hotspot>
        <Hotspot box={{ x: 536, y: 148, w: 48, h: 108 }} label="Otoscope — examine" icon="ear" z={12}
          active={examActive} onClick={() => onNavWithZone ? onNavWithZone("exam", "ears") : onNav("exam")}>
          <div style={{ position: "absolute", inset: 0 }} />
        </Hotspot>
        <Hotspot box={{ x: 562, y: 155, w: 52, h: 158 }} label="Stethoscope — examine" icon="stethoscope" z={12}
          active={examActive} onClick={() => onNavWithZone ? onNavWithZone("exam", "auscultation") : onNav("exam")}>
          <div style={{ position: "absolute", inset: 0 }} />
        </Hotspot>

        {/* owner (ask) */}
        <Hotspot box={{ x: 230, y: 380, w: 220, h: 380 }} label="Owner — ask questions" icon="chat" z={9}
          active={activeDrawer === "ask"} onClick={() => onNav("ask")}>
          <div style={{ position: "absolute", inset: 0 }} />
        </Hotspot>
        <SeatedOwner caseId={caseId} speaking={activeDrawer === "ask"} dimmed={!!activeDrawer && activeDrawer !== "ask"} mood={emotion} />

        {/* exam table + patient (examine) — table and stool hidden; background image provides them */}
        <div style={{ display: "none" }}><ExamTable /></div>
        <div style={{ display: "none" }}><RollingStool /></div>
        <Hotspot box={{ x: 483, y: 300, w: 315, h: 220 }} label="Examine patient" icon="stethoscope" z={11}
          active={examActive} onClick={() => onNav("exam")}>
          <div style={{ position: "absolute", left: "50%", bottom: 20, transform: "translateX(-50%)", filter: "drop-shadow(0 12px 16px rgba(40,22,10,0.34))" }}>
            <PatientDog breed={breed} size={280} />
          </div>
        </Hotspot>

        {/* live patient status — hidden until wired to tech assistance panel */}
        <div style={{ display: "none" }}><VitalsMonitor trust={scores?.trust} health={scores?.patient_health} cost={scores?.cost} emotion={emotion} patientName={patientName} /></div>

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
