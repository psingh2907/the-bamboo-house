/** Flat animal faces for "Spot the Tiger". Drawn to read clearly at ~60px. */

export type CritterKind = "tiger" | "golden" | "deer" | "peacock";

export function CritterFace({ kind }: { kind: CritterKind }) {
  switch (kind) {
    case "tiger":
      return <Tiger />;
    case "golden":
      return <Tiger golden />;
    case "deer":
      return <Deer />;
    case "peacock":
      return <Peacock />;
  }
}

/** The tiger; `golden` is the rare bonus tiger (gold coat, bronze stripes, sparkles). */
function Tiger({ golden = false }: { golden?: boolean }) {
  const coat = golden ? "#f2c14e" : "#e5862e";
  const ear = golden ? "#e0a92f" : "#d9731f";
  const stripe = golden ? "#8a5a12" : "#1d1711";
  return (
    <svg viewBox="0 0 100 100" className="size-full overflow-visible" aria-hidden="true">
      <circle cx="21" cy="24" r="14" fill={ear} />
      <circle cx="79" cy="24" r="14" fill={ear} />
      <circle cx="21" cy="24" r="7" fill="#2a1c12" />
      <circle cx="79" cy="24" r="7" fill="#2a1c12" />
      <ellipse cx="50" cy="56" rx="41" ry="37" fill={coat} />
      {/* Stripes */}
      <path d="M50 20 L44 34 L56 34 Z" fill={stripe} />
      <path d="M36 24 L34 36 L40 35 Z M64 24 L66 36 L60 35 Z" fill={stripe} />
      <path d="M9 50 L24 53 L10 58 Z M11 64 L25 64 L13 71 Z" fill={stripe} />
      <path d="M91 50 L76 53 L90 58 Z M89 64 L75 64 L87 71 Z" fill={stripe} />
      {/* Muzzle and cheeks */}
      <ellipse cx="36" cy="70" rx="17" ry="13" fill="#fbf1df" />
      <ellipse cx="64" cy="70" rx="17" ry="13" fill="#fbf1df" />
      <ellipse cx="50" cy="80" rx="12" ry="8" fill="#fbf1df" />
      {/* Eyes */}
      <ellipse cx="36" cy="50" rx="6.5" ry="5.5" fill="#f5d24b" />
      <ellipse cx="64" cy="50" rx="6.5" ry="5.5" fill="#f5d24b" />
      <ellipse cx="36" cy="50" rx="2.2" ry="4.5" fill="#1d1711" />
      <ellipse cx="64" cy="50" rx="2.2" ry="4.5" fill="#1d1711" />
      {/* Nose and mouth */}
      <path d="M43 62 L57 62 L50 70 Z" fill="#8a3b22" />
      <path d="M50 70 Q46 77 41 75 M50 70 Q54 77 59 75" stroke="#1d1711" strokeWidth="2" fill="none" strokeLinecap="round" />
      <g stroke="#1d1711" strokeWidth="1" opacity="0.5">
        <line x1="30" y1="72" x2="14" y2="70" />
        <line x1="70" y1="72" x2="86" y2="70" />
      </g>
      {golden && (
        <g fill="#fff6d8" className="golden-sparkle">
          <path d="M88 8 L91 16 L99 19 L91 22 L88 30 L85 22 L77 19 L85 16 Z" />
          <path d="M10 82 L12 87 L17 89 L12 91 L10 96 L8 91 L3 89 L8 87 Z" />
        </g>
      )}
    </svg>
  );
}

function Deer() {
  return (
    <svg viewBox="0 0 100 100" className="size-full" aria-hidden="true">
      {/* Antlers */}
      <path
        d="M36 26 L30 8 M30 18 L20 12 M64 26 L70 8 M70 18 L80 12"
        stroke="#e2cfa5"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse cx="17" cy="40" rx="15" ry="7" fill="#a0622f" transform="rotate(-20 17 40)" />
      <ellipse cx="83" cy="40" rx="15" ry="7" fill="#a0622f" transform="rotate(20 83 40)" />
      <path d="M26 36 C 26 22, 74 22, 74 36 C 74 60, 62 90, 50 92 C 38 90, 26 60, 26 36 Z" fill="#b8733a" />
      <path d="M40 72 C 40 64, 60 64, 60 72 C 60 86, 55 92, 50 92 C 45 92, 40 86, 40 72 Z" fill="#f3e3c8" />
      <circle cx="39" cy="46" r="4.5" fill="#1d1711" />
      <circle cx="61" cy="46" r="4.5" fill="#1d1711" />
      <circle cx="40.5" cy="44.5" r="1.3" fill="#fff" />
      <circle cx="62.5" cy="44.5" r="1.3" fill="#fff" />
      <ellipse cx="50" cy="84" rx="6" ry="4.5" fill="#1d1711" />
      {/* Chital spots */}
      <circle cx="33" cy="32" r="2" fill="#f3e3c8" />
      <circle cx="67" cy="32" r="2" fill="#f3e3c8" />
    </svg>
  );
}

function Peacock() {
  return (
    <svg viewBox="0 0 100 100" className="size-full" aria-hidden="true">
      {/* Crest */}
      <g stroke="#1b4f8f" strokeWidth="1.6">
        <line x1="50" y1="30" x2="40" y2="10" />
        <line x1="50" y1="30" x2="50" y2="6" />
        <line x1="50" y1="30" x2="60" y2="10" />
      </g>
      <circle cx="40" cy="9" r="4" fill="#2c8c7a" />
      <circle cx="50" cy="5" r="4" fill="#2c8c7a" />
      <circle cx="60" cy="9" r="4" fill="#2c8c7a" />
      {/* Neck and head */}
      <path d="M36 100 C 36 70, 38 58, 42 50 L58 50 C 62 58, 64 70, 64 100 Z" fill="#1f5fa8" />
      <circle cx="50" cy="42" r="17" fill="#2470bf" />
      <path d="M41 36 C 45 32, 52 32, 55 37 C 51 36, 46 37, 41 40 Z" fill="#fbf7ef" />
      <path d="M59 36 C 55 32, 48 32, 45 37 C 49 36, 54 37, 59 40 Z" fill="#fbf7ef" />
      <circle cx="45" cy="39" r="2.8" fill="#1d1711" />
      <circle cx="55" cy="39" r="2.8" fill="#1d1711" />
      <path d="M46 47 L54 47 L50 57 Z" fill="#c9b99a" />
      <circle cx="50" cy="74" r="5" fill="#2c8c7a" opacity="0.7" />
    </svg>
  );
}
