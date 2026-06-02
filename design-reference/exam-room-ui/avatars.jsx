// avatars.jsx — simple, charming geometric dog avatars (no photos needed).
const { useState: useStateAv, useEffect: useEffectAv } = React;

// breed: "frenchie" | "lab". Colors are warm, theme-agnostic fur tones.
function DogAvatar({ breed = "frenchie", size = 92, mood = "calm" }) {
  const fur = breed === "frenchie" ? "#C9A07B" : "#E2B978";
  const furDark = breed === "frenchie" ? "#A87E58" : "#C99A52";
  const muzzle = breed === "frenchie" ? "#EBD7BE" : "#F3E4C4";
  const eyeY = mood === "sick" ? 0 : 0;
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
          {/* bat ears */}
          <path d="M22 40C18 22 26 14 33 18c4 2 7 9 8 17Z" fill={furDark} />
          <path d="M78 40C82 22 74 14 67 18c-4 2-7 9-8 17Z" fill={furDark} />
          <path d="M26 38c-2-11 2-16 7-14 3 1 5 7 6 13Z" fill={muzzle} opacity="0.6" />
          <path d="M74 38c2-11-2-16-7-14-3 1-5 7-6 13Z" fill={muzzle} opacity="0.6" />
          {/* head */}
          <rect x="24" y="30" width="52" height="50" rx="24" fill={fur} />
          <rect x="24" y="30" width="52" height="50" rx="24" fill={`url(#bg-${breed})`} />
          {/* muzzle */}
          <ellipse cx="50" cy="64" rx="19" ry="15" fill={muzzle} />
          {/* eyes */}
          <circle cx="39" cy="50" r="4.6" fill="#3A2A1C" />
          <circle cx="61" cy="50" r="4.6" fill="#3A2A1C" />
          <circle cx="40.4" cy="48.6" r="1.5" fill="#fff" />
          <circle cx="62.4" cy="48.6" r="1.5" fill="#fff" />
          {/* nose + mouth */}
          <ellipse cx="50" cy="60" rx="5" ry="3.6" fill="#3A2A1C" />
          <path d="M50 63.5v5M50 68.5c-3 0-5-1.5-5.5-3M50 68.5c3 0 5-1.5 5.5-3" stroke="#3A2A1C" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          {/* head */}
          <ellipse cx="50" cy="50" rx="28" ry="29" fill={fur} />
          {/* floppy ears */}
          <path d="M22 38c-9 2-12 16-7 30 6 4 12 1 13-6 1-9-1-20-6-24Z" fill={furDark} />
          <path d="M78 38c9 2 12 16 7 30-6 4-12 1-13-6-1-9 1-20 6-24Z" fill={furDark} />
          <ellipse cx="50" cy="50" rx="28" ry="29" fill={`url(#bg-${breed})`} />
          {/* muzzle */}
          <ellipse cx="50" cy="63" rx="16" ry="14" fill={muzzle} />
          {/* eyes */}
          <circle cx="40" cy="48" r="4.4" fill="#3A2A1C" />
          <circle cx="60" cy="48" r="4.4" fill="#3A2A1C" />
          <circle cx="41.3" cy="46.7" r="1.4" fill="#fff" />
          <circle cx="61.3" cy="46.7" r="1.4" fill="#fff" />
          {/* nose + mouth */}
          <ellipse cx="50" cy="58" rx="5" ry="3.6" fill="#3A2A1C" />
          <path d="M50 61.5v4.5M50 66c-3 0-5-1.5-5.5-3M50 66c3 0 5-1.5 5.5-3" stroke="#3A2A1C" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}

// ── People: charming geometric person avatars (same flat style as the dog) ──
// hairStyle: "buzz" | "short" | "bun" | "long"; accessory: "stethoscope" | null
function PersonAvatar({ skin = "#D9A77B", hair = "#241E1A", shirt = "#C4623E", hairStyle = "short", accessory = null, mood = "neutral", size = 56 }) {
  const cap = {
    buzz:  "M30 41c0-14 9-21 20-21s20 7 20 21c-4-6-10-9-20-9s-16 3-20 9Z",
    short: "M27 44c-1-17 9-26 23-26s24 9 23 26c-4-10-11-15-23-15s-19 5-23 15Z",
    bun:   "M27 44c-1-17 9-26 23-26s24 9 23 26c-4-10-11-15-23-15s-19 5-23 15Z",
    long:  "M27 44c-1-17 9-26 23-26s24 9 23 26c-4-10-11-15-23-15s-19 5-23 15Z",
  }[hairStyle] || "M27 44c-1-17 9-26 23-26s24 9 23 26c-4-10-11-15-23-15s-19 5-23 15Z";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block" }}>
      {/* backdrop */}
      <rect width="100" height="100" fill="var(--color-background-tertiary)" />
      {/* shoulders / top */}
      <path d="M11 95c0-18 17-28 39-28s39 10 39 28Z" fill={shirt} />
      {/* collar notch */}
      <path d="M44 67c2 5 10 5 12 0l-6 6Z" fill="rgba(0,0,0,0.10)" />
      {/* long hair behind head */}
      {hairStyle === "long" && <g fill={hair}>
        <rect x="22" y="34" width="11" height="38" rx="5.5" />
        <rect x="67" y="34" width="11" height="38" rx="5.5" />
      </g>}
      {/* neck */}
      <rect x="43" y="57" width="14" height="15" rx="6" fill={skin} />
      <rect x="43" y="57" width="14" height="6" rx="3" fill="rgba(0,0,0,0.07)" />
      {/* head */}
      <ellipse cx="50" cy="44" rx="22" ry="24" fill={skin} />
      {/* ears */}
      <circle cx="28.5" cy="46" r="3.4" fill={skin} />
      <circle cx="71.5" cy="46" r="3.4" fill={skin} />
      {/* forehead highlight */}
      <ellipse cx="43" cy="35" rx="9" ry="6.5" fill="#fff" opacity="0.16" />
      {/* hair cap */}
      <path d={cap} fill={hair} />
      {/* bun */}
      {hairStyle === "bun" && <circle cx="50" cy="17" r="7.5" fill={hair} />}
      {/* eyes */}
      <circle cx="42" cy="45" r="2.7" fill="#241E1A" />
      <circle cx="58" cy="45" r="2.7" fill="#241E1A" />
      <circle cx="42.9" cy="44.1" r="0.9" fill="#fff" />
      <circle cx="58.9" cy="44.1" r="0.9" fill="#fff" />
      {/* brows */}
      {mood === "frustrated" || mood === "panicked" ? (
        <path d="M38 41c2.4 1.2 5.6 1.8 8 2.6M62 41c-2.4 1.2-5.6 1.8-8 2.6" stroke={hair} strokeWidth="2" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M38 39.5c2-1.4 6-1.4 8 0M54 39.5c2-1.4 6-1.4 8 0" stroke={hair} strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.8" />
      )}
      {/* mouth */}
      {mood === "frustrated" ? (
        <path d="M44 55c2.2-2.4 9.8-2.4 12 0" stroke="#241E1A" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      ) : mood === "panicked" ? (
        <ellipse cx="50" cy="55" rx="4" ry="3" fill="#241E1A" />
      ) : (
        <path d="M44 53c2.2 2.6 9.8 2.6 12 0" stroke="#241E1A" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      )}
      {/* stethoscope draped over scrubs */}
      {accessory === "stethoscope" && <g fill="none" strokeLinecap="round">
        <path d="M41 65c3-5 15-5 18 0" stroke="#39424A" strokeWidth="2.6" />
        <path d="M41 65c-3 11-4 20-3 28" stroke="#39424A" strokeWidth="2.6" />
        <path d="M59 65c4 9 7 15 9 19" stroke="#39424A" strokeWidth="2.6" />
        <circle cx="69" cy="86" r="4.6" fill="#9AA3A8" stroke="#39424A" strokeWidth="1.4" />
        <circle cx="38" cy="93" r="2.4" fill="#39424A" />
      </g>}
    </svg>
  );
}

// Owner look varies per case; vet tech is constant across cases.
const OWNER_LOOKS = {
  gdv_001:  { skin: "#ECC8A2", hair: "#241E1A", hairStyle: "long",  shirt: "#5B7C9E" }, // Sarah Chen
  derm_001: { skin: "#7C5638", hair: "#1E1A17", hairStyle: "buzz",  shirt: "#4F6356" }, // James Okafor
};
// ── Avatar image wiring points ────────────────────────────────────
// Owner + vet-tech avatars show a real headshot when these resolvers return a URL,
// otherwise they fall back to the geometric portrait. Wire them up once in App.js:
//
//     window.getOwnerImage = (caseId) => caseId === "gdv_001" ? sarahImg : jamesImg;
//     window.getTechImage  = () => mayaImg;
//
// (Same pattern as window.getPatientImage.) Leave unset to keep the vector portraits.
if (typeof window.getOwnerImage !== "function") window.getOwnerImage = () => null;
if (typeof window.getTechImage !== "function") window.getTechImage = () => null;

// Renders a circular photo when src loads, else the fallback portrait (on error too).
function AvatarImg({ src, size, children }) {
  const [ok, setOk] = useStateAv(true);
  useEffectAv(() => { setOk(true); }, [src]);
  if (src && ok) return <img src={src} alt="" width={size} height={size} onError={() => setOk(false)}
    style={{ display: "block", width: size, height: size, objectFit: "cover" }} />;
  return children;
}

function OwnerAvatar({ caseId = "derm_001", size = 56, mood = "neutral" }) {
  const look = OWNER_LOOKS[caseId] || OWNER_LOOKS.derm_001;
  return <AvatarImg src={window.getOwnerImage(caseId)} size={size}><PersonAvatar {...look} mood={mood} size={size} /></AvatarImg>;
}
function VetTechAvatar({ size = 56 }) {
  return <AvatarImg src={window.getTechImage()} size={size}><PersonAvatar skin="#CDA074" hair="#2A2320" hairStyle="bun" shirt="#3E8E84" accessory="stethoscope" size={size} /></AvatarImg>;
}

window.VET_TECH = { name: "Maya Torres", first: "Maya", role: "RVT" };
window.OWNER_LOOKS = OWNER_LOOKS;
Object.assign(window, { DogAvatar, PersonAvatar, OwnerAvatar, VetTechAvatar, AvatarImg });
