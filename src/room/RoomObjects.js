// RoomObjects.js — clickable furniture artwork (painterly div+gradient set
// pieces), ported from the design prototype (room-objects.jsx) as ES module
// exports. No interaction logic here — RoomScene wraps each in a <Hotspot>.

export function Microscope() {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", left: "18%", bottom: 0, width: "64%", height: 14, borderRadius: "8px 8px 10px 10px", background: "linear-gradient(180deg,#5C6164,#3A3E40)" }} />
      <div style={{ position: "absolute", left: "30%", bottom: 12, width: 16, height: "62%", borderRadius: 6, background: "linear-gradient(90deg,#6E7477,#9AA1A4 50%,#5C6164)" }} />
      <div style={{ position: "absolute", left: "26%", bottom: "34%", width: "44%", height: 11, borderRadius: 3, background: "linear-gradient(180deg,#C2C8CA,#878E91)" }} />
      <div style={{ position: "absolute", left: "44%", bottom: "35%", width: 12, height: 9, borderRadius: 2, background: "#2A2E30" }} />
      <div style={{ position: "absolute", left: "40%", bottom: "44%", width: 22, height: 14, borderRadius: 5, background: "linear-gradient(180deg,#5C6164,#3A3E40)" }} />
      <div style={{ position: "absolute", left: "46%", bottom: "37%", width: 8, height: 14, borderRadius: 3, background: "#3A3E40" }} />
      <div style={{ position: "absolute", left: "34%", bottom: "52%", width: 40, height: 16, borderRadius: 8, background: "linear-gradient(90deg,#4A4E50,#787E81)", transform: "rotate(-22deg)", transformOrigin: "left bottom" }} />
      <div style={{ position: "absolute", left: "27%", bottom: "62%", width: 14, height: 16, borderRadius: "6px 6px 3px 3px", background: "linear-gradient(180deg,#5C6164,#33373A)" }} />
      <div style={{ position: "absolute", left: "24%", bottom: "40%", width: 13, height: 13, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#9AA1A4,#4A4E50)" }} />
      <div style={{ position: "absolute", left: "42%", bottom: "30%", width: 16, height: 8, borderRadius: "50%", background: "radial-gradient(circle,#FFE7A8,rgba(255,231,168,0))" }} />
    </div>
  );
}

export function PharmacyCabinet() {
  const caps = ["#C4623E", "#5B8C7B", "#7C9CC4", "#D9A24C", "#B58BB0", "#6FA77C", "#D98C5F", "#8AA9C4"];
  const rows = [
    [["#FCFAF6", 0, 76], ["#FCFAF6", 1, 64], ["#E9C98E", 3, 88], ["#FCFAF6", 2, 70], ["#FCFAF6", 4, 80], ["#E9C98E", 6, 60], ["#FCFAF6", 5, 84], ["#FCFAF6", 0, 68], ["#FCFAF6", 2, 78], ["#E9C98E", 3, 58], ["#FCFAF6", 7, 86], ["#FCFAF6", 1, 72]],
    [["#FCFAF6", 2, 70], ["#E9C98E", 3, 84], ["#FCFAF6", 0, 60], ["#FCFAF6", 5, 78], ["#FCFAF6", 4, 88], ["#FCFAF6", 1, 66], ["#E9C98E", 6, 56], ["#FCFAF6", 7, 80], ["#FCFAF6", 2, 72], ["#FCFAF6", 0, 64], ["#E9C98E", 5, 86], ["#FCFAF6", 3, 74]],
    [["#FCFAF6", 1, 66], ["#FCFAF6", 4, 80], ["#E9C98E", 2, 58], ["#FCFAF6", 6, 84], ["#FCFAF6", 0, 72], ["#FCFAF6", 3, 62], ["#E9C98E", 5, 88], ["#FCFAF6", 7, 70], ["#FCFAF6", 1, 78], ["#FCFAF6", 4, 60], ["#FCFAF6", 2, 82], ["#E9C98E", 0, 68]],
  ];
  return (
    <div style={{ position: "absolute", inset: 0, borderRadius: 5, background: "#FBFAF7", border: "3px solid #ECE6DA", boxShadow: "0 10px 22px rgba(90,60,35,0.2)", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 6px 10px rgba(120,90,55,0.10)", pointerEvents: "none", borderRadius: 5 }} />
      <div style={{ position: "absolute", inset: 4, display: "flex", flexDirection: "column" }}>
        {rows.map((row, r) => (
          <div key={r} style={{ flex: 1, position: "relative", display: "flex", alignItems: "flex-end", gap: 1.5, padding: "0 3px", borderBottom: "3px solid #E3DAC9" }}>
            {row.map(([body, capI, hp], i) => (
              <div key={i} style={{ flex: 1, height: hp + "%", borderRadius: "2px 2px 1px 1px", background: body, border: "0.5px solid rgba(120,85,50,0.16)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "22%", background: caps[capI], opacity: body === "#E9C98E" ? 0.7 : 1 }} />
                <div style={{ position: "absolute", left: 1, right: 1, top: "44%", height: "26%", background: body === "#E9C98E" ? "rgba(255,253,249,0.85)" : "rgba(140,123,104,0.14)" }} />
              </div>
            ))}
          </div>
        ))}
      </div>
      {[25, 50, 75].map((x, i) => (
        <div key={i} style={{ position: "absolute", left: x + "%", top: 4, bottom: 4, width: 2.5, background: "#ECE6DA" }} />
      ))}
    </div>
  );
}

export function MiniFridge() {
  return (
    <div style={{ position: "absolute", inset: 0, borderRadius: "6px 6px 3px 3px", background: "linear-gradient(180deg,#3A3D40,#202224)", border: "1px solid #15171a", boxShadow: "0 12px 24px rgba(40,22,10,0.3), inset 0 2px 2px rgba(255,255,255,0.12)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: "22%", height: 2, background: "rgba(0,0,0,0.4)" }} />
      <div style={{ position: "absolute", right: 9, top: "30%", width: 6, height: "50%", borderRadius: 3, background: "linear-gradient(180deg,#9AA1A4,#5C6164)" }} />
      <div style={{ position: "absolute", left: 9, top: "8%", padding: "2px 6px", borderRadius: 3, background: "#0a1a24", border: "1px solid #1d3a48" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, fontWeight: 700, color: "#3Fd0c0" }}>40°F</span>
      </div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,0.14), rgba(255,255,255,0) 40%)", pointerEvents: "none" }} />
    </div>
  );
}

export function ComputerScreen() {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", left: "8%", right: "8%", bottom: 0, height: "12%", borderRadius: 3, background: "linear-gradient(180deg,#2A2E30,#16191b)", boxShadow: "0 3px 6px rgba(40,22,10,0.3)" }}>
        <div style={{ position: "absolute", inset: "22% 6%", display: "grid", gridTemplateColumns: "repeat(12,1fr)", gap: 1.5 }}>
          {Array.from({ length: 24 }).map((_, i) => <div key={i} style={{ background: "#3c4042", borderRadius: 0.5 }} />)}
        </div>
      </div>
      <div style={{ position: "absolute", left: "50%", bottom: "12%", width: 14, height: "8%", transform: "translateX(-50%)", background: "#1f2123" }} />
      <div style={{ position: "absolute", left: "50%", bottom: "11%", width: "30%", height: 6, borderRadius: 3, transform: "translateX(-50%)", background: "#15171a" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: "22%", borderRadius: 6, background: "linear-gradient(180deg,#26292b,#141618)", padding: 5, boxShadow: "0 10px 20px rgba(40,22,10,0.32)" }}>
        <div style={{ position: "absolute", inset: 5, borderRadius: 3, overflow: "hidden", background: "linear-gradient(160deg,#2b6fb0,#15467e 70%,#0e3460)" }}>
          <div style={{ position: "absolute", left: "10%", top: "12%", right: "16%", bottom: "26%", borderRadius: 3, background: "rgba(252,250,245,0.96)", boxShadow: "0 3px 8px rgba(0,0,0,0.3)", overflow: "hidden" }}>
            <div style={{ height: "22%", background: "var(--ds-accent)", display: "flex", alignItems: "center", paddingLeft: 5, gap: 3 }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.8)" }} />
              <span style={{ fontSize: 5.5, fontWeight: 800, color: "#fff", letterSpacing: "0.03em" }}>PATIENT CHART</span>
            </div>
            <div style={{ padding: "4px 6px", display: "flex", flexDirection: "column", gap: 3 }}>
              <div style={{ display: "flex", gap: 3 }}>
                <span style={{ height: 5, width: "34%", borderRadius: 1.5, background: "rgba(43,111,176,0.5)" }} />
                <span style={{ height: 5, width: "22%", borderRadius: 1.5, background: "rgba(140,123,104,0.4)" }} />
              </div>
              {[82, 70, 88, 60].map((w, i) => (
                <span key={i} style={{ height: 2.5, borderRadius: 1.5, background: "rgba(140,123,104,0.4)", width: `${w}%` }} />
              ))}
            </div>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "16%", background: "rgba(12,40,72,0.92)", display: "flex", alignItems: "center", padding: "0 4px", gap: 3 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: "linear-gradient(135deg,#6FC07E,#3f9a5a)" }} />
            <span style={{ width: 7, height: 7, borderRadius: 1.5, background: "rgba(255,255,255,0.5)" }} />
            <span style={{ width: 7, height: 7, borderRadius: 1.5, background: "rgba(255,255,255,0.35)" }} />
            <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 5.5, color: "rgba(255,255,255,0.85)" }}>09:42</span>
          </div>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(255,255,255,0.16), rgba(255,255,255,0) 38%)", pointerEvents: "none" }} />
        </div>
      </div>
    </div>
  );
}

export function ClinicDoor() {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", inset: "-6px -8px 0", borderRadius: "10px 10px 0 0", background: "linear-gradient(180deg,#D9C7AC,#C2AC8A)" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: "8px 8px 0 0", background: "linear-gradient(180deg,#B98E5F,#9E744A)", boxShadow: "inset 0 2px 4px rgba(255,255,255,0.2)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: "18%", right: "18%", top: "8%", height: "26%", borderRadius: 6, background: "linear-gradient(180deg,#CFE2EA,#A9C6D2)", border: "3px solid #87663F", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(255,255,255,0.5), rgba(255,255,255,0) 50%)" }} />
        </div>
        <div style={{ position: "absolute", left: "16%", right: "16%", top: "42%", bottom: "10%", borderRadius: 5, border: "3px solid rgba(90,60,35,0.22)" }} />
        <div style={{ position: "absolute", right: "16%", top: "52%", width: 9, height: 26, borderRadius: 5, background: "linear-gradient(180deg,#E7D9BE,#B79468)" }} />
      </div>
      <div style={{ position: "absolute", left: "50%", top: -2, transform: "translate(-50%,-100%)", padding: "3px 9px", borderRadius: 4, background: "var(--ds-good)", color: "#fff", fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", fontFamily: "var(--font-mono)", boxShadow: "0 3px 8px rgba(40,80,40,0.3)" }}>EXIT</div>
    </div>
  );
}

export function WallClipboard({ count = 0 }) {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 7, background: "linear-gradient(180deg,#B98E5F,#9E744A)", boxShadow: "0 8px 18px rgba(90,60,35,0.2)", padding: 6 }}>
        <div style={{ position: "absolute", left: "50%", top: -5, transform: "translateX(-50%)", width: "38%", height: 11, borderRadius: 4, background: "linear-gradient(180deg,#D7DBDC,#9AA1A4)", zIndex: 2 }} />
        <div style={{ position: "absolute", inset: 6, top: 9, borderRadius: 3, background: "linear-gradient(180deg,#FFFDF8,#F3ECDF)", padding: "9px 8px 6px" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 8, fontWeight: 800, color: "var(--ds-accent)", letterSpacing: "0.05em" }}>DIFFERENTIALS</div>
          <div style={{ height: 1, background: "rgba(140,123,104,0.3)", margin: "4px 0 6px" }} />
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: 1.5, border: "1px solid rgba(140,123,104,0.5)", background: i < count ? "var(--ds-good)" : "transparent", flexShrink: 0 }} />
              <span style={{ height: 3, width: `${72 - i * 9}%`, borderRadius: 2, background: "rgba(140,123,104,0.34)" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function InstrumentCharger() {
  const coil = (cx, loops) => {
    const out = [];
    for (let i = 0; i < loops; i++) {
      const cy = 54 + i * 6.6;
      out.push(<ellipse key={cx + "-" + i} cx={cx} cy={cy} rx="5" ry="3.6" fill="none" stroke="#23262A" strokeWidth="1.5" />);
      out.push(<path key={cx + "-h" + i} d={`M${cx - 4.4} ${cy} a 5 3.6 0 0 1 4.6 -3`} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="0.6" />);
    }
    return out;
  };
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <svg width="100%" height="100%" viewBox="0 0 132 168" preserveAspectRatio="xMidYMin meet" style={{ display: "block", overflow: "visible" }}>
        {coil(44, 17)}
        {coil(88, 17)}
        <rect x="4" y="0" width="124" height="56" rx="13" fill="#FCFCFB" stroke="#DAD9D3" strokeWidth="1" />
        <rect x="4" y="0" width="124" height="22" rx="11" fill="#FFFFFF" opacity="0.5" />
        <rect x="20" y="32" width="36" height="12" rx="6" fill="#BFD6E2" />
        <rect x="76" y="32" width="36" height="12" rx="6" fill="#BFD6E2" />
        <rect x="58" y="20" width="16" height="3" rx="1.5" fill="#C2C8CB" />
        <circle cx="66" cy="46" r="2.6" fill="#6FC07E" />
      </svg>
    </div>
  );
}

export function Otoscope() {
  return (
    <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "start center" }}>
      <svg width="100%" height="100%" viewBox="0 0 48 112" preserveAspectRatio="xMidYMin meet" style={{ display: "block", overflow: "visible" }}>
        <defs>
          <linearGradient id="otoHandle2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#1A1C1F" /><stop offset="0.5" stopColor="#3C4045" /><stop offset="1" stopColor="#16181B" />
          </linearGradient>
          <linearGradient id="otoChrome" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#8A9094" /><stop offset="0.5" stopColor="#E4E8EA" /><stop offset="1" stopColor="#7E8488" />
          </linearGradient>
        </defs>
        <rect x="16" y="50" width="16" height="58" rx="6" fill="url(#otoHandle2)" />
        {[58, 64, 70, 76, 82, 88, 94, 100].map((y, i) => <rect key={i} x="16" y={y} width="16" height="2" fill="rgba(0,0,0,0.4)" />)}
        <rect x="15" y="43" width="18" height="9" rx="2.5" fill="url(#otoChrome)" />
        <path d="M13 20h22l-3 24H16Z" fill="#34383D" />
        <path d="M13 20h22l-1 6H14Z" fill="#3E444A" />
        <path d="M27 4 35 20 21 20Z" fill="#E6EAEC" />
        <path d="M27 8 31 19 23 19Z" fill="#C7CDD0" />
        <circle cx="24" cy="34" r="3" fill="#15181B" stroke="#5A5F63" strokeWidth="1" />
      </svg>
    </div>
  );
}

export function Ophthalmoscope() {
  return (
    <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "start center" }}>
      <svg width="100%" height="100%" viewBox="0 0 48 112" preserveAspectRatio="xMidYMin meet" style={{ display: "block", overflow: "visible" }}>
        <defs>
          <linearGradient id="ophHandle2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#1A1C1F" /><stop offset="0.5" stopColor="#3C4045" /><stop offset="1" stopColor="#16181B" />
          </linearGradient>
          <linearGradient id="ophChrome" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#8A9094" /><stop offset="0.5" stopColor="#E4E8EA" /><stop offset="1" stopColor="#7E8488" />
          </linearGradient>
        </defs>
        <rect x="16" y="54" width="16" height="54" rx="6" fill="url(#ophHandle2)" />
        {[62, 68, 74, 80, 86, 92, 98].map((y, i) => <rect key={i} x="16" y={y} width="16" height="2" fill="rgba(0,0,0,0.4)" />)}
        <rect x="15" y="47" width="18" height="9" rx="2.5" fill="url(#ophChrome)" />
        <circle cx="24" cy="28" r="17" fill="#34383D" />
        <circle cx="24" cy="28" r="17" fill="none" stroke="#23262A" strokeWidth="1.6" />
        <ellipse cx="24" cy="12" rx="8" ry="3.4" fill="#23262A" />
        <circle cx="24" cy="27" r="6.5" fill="#11151A" stroke="#5A5F63" strokeWidth="1.4" />
        <circle cx="21.6" cy="24.6" r="1.7" fill="#9FD4DD" opacity="0.85" />
        <circle cx="39" cy="34" r="5.5" fill="#52575B" stroke="#23262A" strokeWidth="1" />
        {[0, 1, 2, 3, 4, 5].map(i => { const a = (i / 6) * Math.PI * 2; return <line key={i} x1={39 + Math.cos(a) * 3} y1={34 + Math.sin(a) * 3} x2={39 + Math.cos(a) * 5} y2={34 + Math.sin(a) * 5} stroke="#23262A" strokeWidth="1" />; })}
      </svg>
    </div>
  );
}
