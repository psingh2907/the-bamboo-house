import { useId, type ReactNode } from "react";
import type { ArtSpec } from "@/data/types";

/**
 * Illustrated stand-ins for photography, drawn from the restaurant's own
 * palette (bamboo, smoked wood, clay). Deterministic per `seed`, so server
 * and client render identically. Pure SVG: no requests, no layout shift.
 */

function rng(seed: number) {
  let a = seed * 2654435761;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Trig results can differ in the last bit between Node and the browser, which
// breaks hydration; rounding makes server and client output identical.
const cos = (a: number) => Math.round(Math.cos(a) * 1e6) / 1e6;
const sin = (a: number) => Math.round(Math.sin(a) * 1e6) / 1e6;

const W = 400;
const H = 500;

interface ArtworkProps {
  spec: ArtSpec;
  label: string;
  className?: string;
  /** Crop to part of the 400×500 canvas, e.g. just the plate. */
  viewBox?: string;
  /** Render as a standalone .svg file (xmlns + intrinsic size, no a11y attrs — the <img> carries alt). */
  standalone?: boolean;
}

export function Artwork({ spec, label, className, viewBox = `0 0 ${W} ${H}`, standalone }: ArtworkProps) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice"
      {...(standalone
        ? { xmlns: "http://www.w3.org/2000/svg", width: W, height: H }
        : { role: "img", "aria-label": label, className })}
    >
      {render(spec, id)}
    </svg>
  );
}

function render(spec: ArtSpec, id: string): ReactNode {
  switch (spec.kind) {
    case "slats":
      return <Slats id={id} seed={spec.seed ?? 1} />;
    case "plate":
      return spec.thali ? (
        <Thali id={id} seed={spec.seed ?? 1} hue={spec.hue} />
      ) : (
        <Bowl id={id} seed={spec.seed ?? 1} hue={spec.hue} />
      );
    case "pots":
      return <Pots id={id} seed={spec.seed ?? 1} />;
    case "lamp":
      return <Lamp id={id} seed={spec.seed ?? 1} />;
    case "landscape":
      return <Landscape id={id} seed={spec.seed ?? 1} hue={spec.hue} feature={spec.feature ?? "forest"} />;
  }
}

/* ─── Bamboo wall ─────────────────────────────────────────────────────── */

function SlatWall({ id, seed, dim = 1 }: { id: string; seed: number; dim?: number }) {
  const r = rng(seed);
  const slats: ReactNode[] = [];
  let x = -8;
  let i = 0;
  while (x < W + 8) {
    const w = 15 + r() * 8;
    const shade = 0.55 + r() * 0.45;
    const nodes = [0.12 + r() * 0.2, 0.42 + r() * 0.15, 0.72 + r() * 0.18];
    slats.push(
      <g key={i} opacity={shade * dim}>
        <rect x={x} y={-10} width={w} height={H + 20} fill={`url(#${id}-culm)`} />
        {nodes.map((n, k) => (
          <g key={k}>
            <rect x={x} y={n * H} width={w} height={3.2} fill="#4a3217" />
            <rect x={x} y={n * H + 3.2} width={w} height={1.2} fill="#f0cf8f" opacity={0.35} />
          </g>
        ))}
      </g>,
    );
    x += w + 2.5;
    i++;
  }
  return (
    <>
      <defs>
        <linearGradient id={`${id}-culm`} x1="0" x2="1">
          <stop offset="0" stopColor="#6b4520" />
          <stop offset="0.35" stopColor="#d6a760" />
          <stop offset="0.6" stopColor="#c08c47" />
          <stop offset="1" stopColor="#5e3c1b" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="#140e08" />
      {slats}
    </>
  );
}

function Slats({ id, seed }: { id: string; seed: number }) {
  return (
    <>
      <SlatWall id={id} seed={seed} />
      <defs>
        <radialGradient id={`${id}-glow`} cx="0.5" cy="0.3" r="0.7">
          <stop offset="0" stopColor="#ffcf80" stopOpacity="0.5" />
          <stop offset="0.6" stopColor="#ffb050" stopOpacity="0.08" />
          <stop offset="1" stopColor="#000" stopOpacity="0.55" />
        </radialGradient>
        <linearGradient id={`${id}-table`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a2716" />
          <stop offset="1" stopColor="#0f0a06" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}-glow)`} />
      {/* Dark-wood table edge */}
      <rect x={0} y={H * 0.8} width={W} height={H * 0.2} fill={`url(#${id}-table)`} />
      <rect x={0} y={H * 0.8} width={W} height={2} fill="#e6b872" opacity={0.5} />
    </>
  );
}

/* ─── Food, top-down on dark wood ─────────────────────────────────────── */

function WoodTable({ id, seed }: { id: string; seed: number }) {
  const r = rng(seed + 100);
  const grain = Array.from({ length: 18 }, (_, i) => {
    const y = (i / 18) * H + r() * 12;
    const a = 4 + r() * 8;
    return (
      <path
        key={i}
        d={`M -10 ${y} C 120 ${y - a}, 260 ${y + a}, ${W + 10} ${y - a / 2}`}
        stroke="#2c1f13"
        strokeWidth={1 + r() * 2.5}
        fill="none"
        opacity={0.8}
      />
    );
  });
  return (
    <>
      <defs>
        <radialGradient id={`${id}-light`} cx="0.45" cy="0.4" r="0.75">
          <stop offset="0" stopColor="#3a2918" />
          <stop offset="1" stopColor="#120c07" />
        </radialGradient>
        <filter id={`${id}-shadow`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}-light)`} />
      {grain}
    </>
  );
}

function Bowl({ id, seed, hue }: { id: string; seed: number; hue: number }) {
  const r = rng(seed);
  const cx = 200;
  const cy = 250;
  const garnish = Array.from({ length: 16 }, (_, i) => {
    const a = r() * Math.PI * 2;
    const d = r() * 78;
    const green = r() > 0.45;
    return (
      <ellipse
        key={i}
        cx={cx + cos(a) * d}
        cy={cy + sin(a) * d}
        rx={green ? 3 + r() * 3 : 6 + r() * 6}
        ry={green ? 2 + r() * 2 : 4 + r() * 4}
        transform={`rotate(${r() * 180} ${cx + cos(a) * d} ${cy + sin(a) * d})`}
        fill={green ? "hsl(105 45% 34%)" : `hsl(${hue} 55% 78%)`}
        opacity={green ? 0.95 : 0.8}
      />
    );
  });
  return (
    <>
      <WoodTable id={id} seed={seed} />
      <defs>
        <radialGradient id={`${id}-curry`} cx="0.42" cy="0.38" r="0.7">
          <stop offset="0" stopColor={`hsl(${hue} 72% 50%)`} />
          <stop offset="1" stopColor={`hsl(${hue} 70% 30%)`} />
        </radialGradient>
        <radialGradient id={`${id}-bowl`} cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#fbf4e6" />
          <stop offset="1" stopColor="#cfc1a6" />
        </radialGradient>
      </defs>
      <circle cx={cx + 10} cy={cy + 16} r={146} fill="#000" opacity={0.55} filter={`url(#${id}-shadow)`} />
      <circle cx={cx} cy={cy} r={140} fill={`url(#${id}-bowl)`} />
      <circle cx={cx} cy={cy} r={112} fill={`url(#${id}-curry)`} />
      <path
        d={`M ${cx + 58} ${cy} A 58 58 0 0 1 ${cx - 58} ${cy} A 44 44 0 0 1 ${cx + 30} ${cy} A 30 30 0 0 1 ${cx - 30} ${cy} A 16 16 0 0 1 ${cx + 2} ${cy}`}
        transform={`rotate(${Math.round(r() * 360)} ${cx} ${cy})`}
        stroke={`hsl(${hue} 50% 88%)`}
        strokeWidth={5}
        strokeLinecap="round"
        fill="none"
        opacity={0.7}
      />
      {garnish}
      <ellipse cx={cx - 55} cy={cy - 70} rx={40} ry={16} fill="#fff" opacity={0.12} transform={`rotate(-35 ${cx - 55} ${cy - 70})`} />
    </>
  );
}

function Thali({ id, seed, hue }: { id: string; seed: number; hue: number }) {
  const r = rng(seed);
  const cx = 200;
  const cy = 250;
  const katoriHues = [hue, 44, 95, 24, 8];
  const katoris = katoriHues.map((h, i) => {
    const a = -Math.PI * 0.95 + (i / (katoriHues.length - 1)) * Math.PI * 0.95;
    const x = cx + cos(a) * 118;
    const y = cy + sin(a) * 118;
    const raita = i === 2;
    return (
      <g key={i}>
        <circle cx={x + 4} cy={y + 6} r={40} fill="#000" opacity={0.35} filter={`url(#${id}-shadow)`} />
        <circle cx={x} cy={y} r={38} fill={`url(#${id}-steel)`} />
        <circle cx={x} cy={y} r={30} fill={raita ? "#f1ead8" : `hsl(${h} 68% ${36 + r() * 12}%)`} />
        {raita && <circle cx={x + 6} cy={y - 4} r={4} fill="hsl(105 45% 34%)" />}
        <ellipse cx={x - 10} cy={y - 12} rx={10} ry={4} fill="#fff" opacity={0.18} />
      </g>
    );
  });
  const grains = Array.from({ length: 70 }, (_, i) => {
    const a = r() * Math.PI * 2;
    const d = Math.sqrt(r()) * 44;
    const x = cx - 20 + cos(a) * d * 1.3;
    const y = cy + 55 + sin(a) * d * 0.8;
    return <ellipse key={i} cx={x} cy={y} rx={3.4} ry={1.4} transform={`rotate(${r() * 180} ${x} ${y})`} fill="#fffaf0" opacity={0.9} />;
  });
  return (
    <>
      <WoodTable id={id} seed={seed} />
      <defs>
        <radialGradient id={`${id}-steel`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#f4f1ea" />
          <stop offset="0.55" stopColor="#b9b3a8" />
          <stop offset="1" stopColor="#7c776e" />
        </radialGradient>
      </defs>
      <circle cx={cx + 12} cy={cy + 18} r={186} fill="#000" opacity={0.6} filter={`url(#${id}-shadow)`} />
      <circle cx={cx} cy={cy} r={182} fill={`url(#${id}-steel)`} />
      <circle cx={cx} cy={cy} r={168} fill="#cfc9be" />
      {katoris}
      {/* Rice */}
      <ellipse cx={cx - 20} cy={cy + 55} rx={62} ry={40} fill="#ece4d2" />
      {grains}
      {/* Rotis */}
      {[0, 1].map((k) => (
        <g key={k}>
          <circle cx={cx + 60 + k * 14} cy={cy + 62 - k * 18} r={42} fill="hsl(34 55% 62%)" stroke="hsl(30 45% 48%)" strokeWidth={2} />
          {Array.from({ length: 7 }, (_, j) => (
            <circle key={j} cx={cx + 40 + k * 14 + r() * 44} cy={cy + 42 - k * 18 + r() * 40} r={2 + r() * 3} fill="hsl(25 55% 32%)" opacity={0.7} />
          ))}
        </g>
      ))}
      <ellipse cx={cx - 90} cy={cy - 120} rx={60} ry={14} fill="#fff" opacity={0.14} transform={`rotate(-30 ${cx - 90} ${cy - 120})`} />
    </>
  );
}

/* ─── Hanging clay pots ───────────────────────────────────────────────── */

function Pots({ id, seed }: { id: string; seed: number }) {
  const r = rng(seed);
  const pots = [70, 160, 250, 340].map((x, i) => {
    const y = 120 + r() * 170;
    const s = 0.8 + r() * 0.45;
    return (
      <g key={i}>
        <line x1={x} y1={-5} x2={x} y2={y - 38 * s} stroke="#d9b877" strokeWidth={1.4} opacity={0.7} />
        <g transform={`translate(${x} ${y}) scale(${s})`}>
          <path d="M -12 -40 L 12 -40 L 10 -30 C 38 -24 46 6 34 24 C 22 42 -22 42 -34 24 C -46 6 -38 -24 -10 -30 Z" fill={`url(#${id}-clay)`} />
          <rect x={-14} y={-44} width={28} height={6} rx={2} fill="#8a4020" />
          <path d="M -36 -2 Q 0 8 36 -2" stroke="#6d2f14" strokeWidth={2} fill="none" opacity={0.6} />
          <ellipse cx={-14} cy={-10} rx={7} ry={14} fill="#ffd3a8" opacity={0.25} />
        </g>
      </g>
    );
  });
  return (
    <>
      <SlatWall id={id} seed={seed} dim={0.45} />
      <defs>
        <radialGradient id={`${id}-clay`} cx="0.35" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#d67c4a" />
          <stop offset="0.6" stopColor="#a44b22" />
          <stop offset="1" stopColor="#5e2610" />
        </radialGradient>
        <radialGradient id={`${id}-warm`} cx="0.5" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#ffb85c" stopOpacity="0.28" />
          <stop offset="1" stopColor="#000" stopOpacity="0.6" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}-warm)`} />
      {pots}
    </>
  );
}

/* ─── Warm lamp over a table ──────────────────────────────────────────── */

function Lamp({ id, seed }: { id: string; seed: number }) {
  const r = rng(seed);
  const x = 150 + r() * 100;
  const y = 170 + r() * 50;
  return (
    <>
      <defs>
        <radialGradient id={`${id}-halo`} cx={x / W} cy={(y + 30) / H} r="0.6">
          <stop offset="0" stopColor="#ffd08a" stopOpacity="0.85" />
          <stop offset="0.25" stopColor="#e39a45" stopOpacity="0.35" />
          <stop offset="1" stopColor="#110b06" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-shade`} x1="0" x2="1">
          <stop offset="0" stopColor="#7a5223" />
          <stop offset="0.5" stopColor="#e2b46a" />
          <stop offset="1" stopColor="#6b461d" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="#110b06" />
      <rect width={W} height={H} fill={`url(#${id}-halo)`} />
      <line x1={x} y1={0} x2={x} y2={y - 40} stroke="#3a2a18" strokeWidth={2} />
      <path d={`M ${x - 22} ${y - 40} L ${x + 22} ${y - 40} L ${x + 55} ${y + 20} L ${x - 55} ${y + 20} Z`} fill={`url(#${id}-shade)`} />
      {Array.from({ length: 9 }, (_, i) => {
        const t = i / 8;
        return (
          <line
            key={i}
            x1={x - 22 + t * 44}
            y1={y - 40}
            x2={x - 55 + t * 110}
            y2={y + 20}
            stroke="#5a3a17"
            strokeWidth={1}
            opacity={0.6}
          />
        );
      })}
      <ellipse cx={x} cy={y + 24} rx={20} ry={8} fill="#fff4d6" />
      {/* Table catching the light */}
      <rect x={0} y={H * 0.78} width={W} height={H * 0.22} fill="#1d130b" />
      <ellipse cx={x} cy={H * 0.8} rx={170} ry={22} fill="#e7a95a" opacity={0.35} />
      <rect x={0} y={H * 0.78} width={W} height={1.5} fill="#e6b872" opacity={0.45} />
      {/* Glasses and a bowl, silhouetted */}
      <rect x={x - 110} y={H * 0.78 - 34} width={16} height={34} rx={3} fill="#2b1d10" />
      <rect x={x + 90} y={H * 0.78 - 28} width={14} height={28} rx={3} fill="#2b1d10" />
      <path d={`M ${x - 45} ${H * 0.78} Q ${x} ${H * 0.78 - 40} ${x + 45} ${H * 0.78} Z`} fill="#2b1d10" />
    </>
  );
}

/* ─── Panna landscapes ────────────────────────────────────────────────── */

function ridge(r: () => number, base: number, amp: number, steps = 8) {
  let d = `M 0 ${H} L 0 ${base}`;
  for (let i = 1; i <= steps; i++) {
    const x = (i / steps) * W;
    const y = base - r() * amp;
    const cx = x - W / steps / 2;
    d += ` Q ${cx} ${y - amp * 0.4} ${x} ${y}`;
  }
  return `${d} L ${W} ${H} Z`;
}

function Landscape({
  id,
  seed,
  hue,
  feature,
}: {
  id: string;
  seed: number;
  hue: number;
  feature: "river" | "falls" | "forest" | "temple" | "canyon";
}) {
  const r = rng(seed);
  const sunX = 90 + r() * 220;
  return (
    <>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={`hsl(${hue} 30% 78%)`} />
          <stop offset="0.7" stopColor="hsl(34 72% 80%)" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}-sky)`} />
      <circle cx={sunX} cy={150} r={34} fill="#fff6e0" opacity={0.9} />
      <path d={ridge(r, 250, 50)} fill={`hsl(${hue} 18% 58%)`} opacity={0.75} />
      {feature === "temple" && <Temples x={120 + r() * 60} base={300} />}
      <path d={ridge(r, 310, 45)} fill={`hsl(${hue} 22% 40%)`} />
      {feature === "canyon" && (
        <g>
          {Array.from({ length: 6 }, (_, i) => (
            <path key={i} d={ridge(r, 350 + i * 22, 18, 6)} fill={`hsl(${8 + i * 4} ${35 - i * 3}% ${62 - i * 7}%)`} />
          ))}
          <path d="M 180 360 C 200 420 190 470 210 510 L 250 510 C 230 460 240 420 215 360 Z" fill="hsl(195 35% 55%)" />
        </g>
      )}
      {feature === "falls" && (
        <g>
          <path d="M 150 300 L 250 300 L 250 390 L 150 390 Z" fill={`hsl(${hue} 20% 28%)`} />
          <path d="M 185 300 C 188 340 182 370 186 392 L 214 392 C 218 370 212 340 215 300 Z" fill="#f4fbff" opacity={0.9} />
          <ellipse cx={200} cy={420} rx={110} ry={30} fill="hsl(165 35% 42%)" />
          <ellipse cx={200} cy={410} rx={40} ry={8} fill="#f4fbff" opacity={0.6} />
        </g>
      )}
      {feature === "river" && (
        <path d="M -10 420 C 80 380 160 470 240 430 S 360 380 410 410 L 410 470 C 340 440 280 500 200 480 S 60 450 -10 480 Z" fill="hsl(195 38% 58%)" />
      )}
      <path d={ridge(r, 400, 30)} fill={`hsl(${hue} 26% 22%)`} opacity={feature === "canyon" ? 0.6 : 1} />
      {(feature === "forest" || feature === "river") &&
        Array.from({ length: 22 }, (_, i) => {
          const x = (i / 21) * W + r() * 10;
          const h = 30 + r() * 40;
          const base = 420 + r() * 20;
          return <ellipse key={i} cx={x} cy={base - h / 2} rx={10 + r() * 8} ry={h / 2} fill={`hsl(${hue} 30% ${14 + r() * 10}%)`} />;
        })}
      <rect y={H - 40} width={W} height={40} fill={`hsl(${hue} 25% 14%)`} opacity={0.6} />
    </>
  );
}

function Temples({ x, base }: { x: number; base: number }) {
  const spire = (cx: number, h: number, w: number) =>
    `M ${cx - w} ${base} C ${cx - w} ${base - h * 0.5}, ${cx - w * 0.35} ${base - h * 0.85}, ${cx} ${base - h} C ${cx + w * 0.35} ${base - h * 0.85}, ${cx + w} ${base - h * 0.5}, ${cx + w} ${base} Z`;
  return (
    <g fill="hsl(25 30% 32%)">
      <path d={spire(x, 110, 34)} />
      <path d={spire(x - 42, 80, 26)} />
      <path d={spire(x + 44, 86, 26)} />
      <path d={spire(x + 130, 70, 22)} />
      <rect x={x - 70} y={base - 10} width={230} height={14} />
    </g>
  );
}
