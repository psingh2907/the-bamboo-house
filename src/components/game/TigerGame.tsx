"use client";

import { type CSSProperties, useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Locale } from "@/i18n";
import { t } from "@/i18n/dictionaries";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { getLenis } from "@/lib/motion";
import { Accent } from "../ui/Accent";
import { CritterFace, type CritterKind } from "./Critters";

/**
 * "Spot the Tiger" — a footer game in the spirit of Panna Tiger Reserve.
 * Animals peek out from behind bamboo stalks: tap the tigers, spare the deer
 * and peacocks. A tiger that slips away, or a wrong tap, costs a life.
 *
 * Plain DOM + CSS animations (no canvas, no physics library). Pauses
 * off-screen. Controls follow JP Pizzeria's: one score pill (TIGERS 04 | ●●●),
 * a "Freeze scroll" toggle that centres the game and locks the page — handy
 * on phones, where a thumb near the edge can scroll mid-game — and a ••• menu
 * with Restart / Quit.
 */

type Status = "idle" | "playing" | "over";
type Side = "l" | "r";

interface Critter {
  id: number;
  kind: CritterKind;
  stalk: number;
  side: Side;
  /** Top position, % of the field height. */
  y: number;
  /** How long it stays out, ms. */
  dur: number;
  outcome?: "caught" | "wrong";
}

interface Pop {
  id: number;
  x: string;
  y: number;
  text: string;
  good: boolean;
}

const LIVES = 3;
const BEST_KEY = "tbh-tiger-best";
const WIDE = [7, 21, 35, 50, 65, 79, 93];
const NARROW = [10, 30, 50, 70, 90];
const NODE_SPACING = [118, 96, 132, 104, 124, 90, 112];

function pickKind(spawned: number): CritterKind {
  if (spawned < 3) return "tiger";
  const r = Math.random();
  return r < 0.68 ? "tiger" : r < 0.88 ? "deer" : "peacock";
}

function readBest(): number {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}

function saveBest(score: number) {
  try {
    if (score > readBest()) localStorage.setItem(BEST_KEY, String(score));
  } catch {
    // Storage blocked: the best score just isn't remembered.
  }
}

const noSubscribe = () => () => {};

function subscribeWide(onChange: () => void) {
  const media = window.matchMedia("(min-width: 640px)");
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

export function TigerGame({ locale = "en" }: { locale?: Locale }) {
  const text = t(locale).game;
  const [status, setStatus] = useState<Status>("idle");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(LIVES);
  const [critters, setCritters] = useState<Critter[]>([]);
  const [pops, setPops] = useState<Pop[]>([]);
  const [rustle, setRustle] = useState<number[]>(() => WIDE.map(() => 0));
  const [onScreen, setOnScreen] = useState(false);
  const [beatBest, setBeatBest] = useState(false);
  const [frozen, setFrozen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const field = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const spawned = useRef(0);
  const scoreRef = useRef(0);
  const livesRef = useRef(LIVES);
  const settled = useRef(new Set<number>());

  // Best score lives in localStorage; re-read on every render (e.g. after a game ends).
  const best = useSyncExternalStore(noSubscribe, readBest, () => 0);

  // Fewer, wider-spaced stalks on phones.
  const wide = useSyncExternalStore(subscribeWide, () => window.matchMedia("(min-width: 640px)").matches, () => true);
  const stalks = wide ? WIDE : NARROW;
  const crittersRef = useRef<Critter[]>([]);
  useEffect(() => {
    crittersRef.current = critters;
  }, [critters]);

  // Pause when scrolled away.
  useEffect(() => {
    const el = field.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const pop = useCallback((c: Critter, text: string, good: boolean) => {
    const x = stalks[c.stalk];
    setPops((prev) => [
      ...prev,
      { id: nextId.current++, x: c.side === "r" ? `calc(${x}% + 3rem)` : `calc(${x}% - 3rem)`, y: c.y, text, good },
    ]);
  }, [stalks]);

  const endGame = useCallback(() => {
    setStatus("over");
    setCritters([]);
    setFrozen(false);
    setMenuOpen(false);
    const final = scoreRef.current;
    // Compare with the old best before saving, for the "new best" message.
    setBeatBest(final > 0 && final > readBest());
    saveBest(final);
    trackEvent("game_over", { score: final });
  }, []);

  const loseLife = useCallback(() => {
    livesRef.current -= 1;
    setLives(livesRef.current);
    if (livesRef.current <= 0) endGame();
  }, [endGame]);

  const start = () => {
    scoreRef.current = 0;
    livesRef.current = LIVES;
    spawned.current = 0;
    settled.current.clear();
    setScore(0);
    setLives(LIVES);
    setCritters([]);
    setPops([]);
    setMenuOpen(false);
    setStatus("playing");
    trackEvent("game_start");
  };

  const quit = () => {
    setStatus("idle");
    setCritters([]);
    setPops([]);
    setFrozen(false);
    setMenuOpen(false);
  };

  // Freeze scroll: bring the game to the middle of the screen and lock the page.
  useEffect(() => {
    if (!frozen) return;
    const el = field.current;
    const html = document.documentElement;
    const lenis = getLenis();
    if (el) {
      const r = el.getBoundingClientRect();
      const top = window.scrollY + r.top - Math.max(0, (window.innerHeight - r.height) / 2);
      if (lenis) lenis.scrollTo(top, { duration: 0.5, onComplete: () => lenis.stop() });
      else window.scrollTo({ top, behavior: "smooth" });
    }
    const lock = window.setTimeout(() => {
      html.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    }, 450);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFrozen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(lock);
      window.removeEventListener("keydown", onKey);
      html.style.overflow = "";
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [frozen]);

  // Spawner: faster and busier as the score climbs.
  useEffect(() => {
    if (status !== "playing" || !onScreen) return;
    let timer = 0;

    const spawn = () => {
      const s = scoreRef.current;
      const current = crittersRef.current;
      const max = 1 + (s >= 6 ? 1 : 0) + (s >= 15 ? 1 : 0);
      if (current.length >= max) return;
      const busy = new Set(current.map((c) => c.stalk));
      const free = stalks.map((_, i) => i).filter((i) => !busy.has(i));
      if (!free.length) return;
      const stalk = free[Math.floor(Math.random() * free.length)];
      const side: Side = stalk === 0 ? "r" : stalk === stalks.length - 1 ? "l" : Math.random() < 0.5 ? "l" : "r";
      const critter: Critter = {
        id: nextId.current++,
        kind: pickKind(spawned.current++),
        stalk,
        side,
        y: 26 + Math.random() * 44,
        dur: Math.max(760, 1650 - s * 40),
      };
      crittersRef.current = [...current, critter];
      setCritters(crittersRef.current);
      // The stalk sways just before the animal appears — a fair warning.
      setRustle((r) => r.map((n, i) => (i === stalk ? n + 1 : n)));
    };

    const schedule = () => {
      const interval = Math.max(420, 1050 - scoreRef.current * 28) * (0.75 + Math.random() * 0.5);
      timer = window.setTimeout(() => {
        spawn();
        schedule();
      }, interval);
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, [status, onScreen, stalks]);

  const tap = (c: Critter) => {
    if (status !== "playing" || settled.current.has(c.id)) return;
    settled.current.add(c.id);
    if (c.kind === "tiger") {
      scoreRef.current += 1;
      setScore(scoreRef.current);
      pop(c, "+1", true);
      setCritters((prev) => prev.map((x) => (x.id === c.id ? { ...x, outcome: "caught" } : x)));
    } else {
      pop(c, c.kind === "deer" ? text.notDeer : text.notPeacock, false);
      setCritters((prev) => prev.map((x) => (x.id === c.id ? { ...x, outcome: "wrong" } : x)));
      loseLife();
    }
  };

  const finished = (c: Critter) => {
    setCritters((prev) => prev.filter((x) => x.id !== c.id));
    // A tiger that got away costs a life.
    if (!settled.current.has(c.id) && c.kind === "tiger" && status === "playing") {
      settled.current.add(c.id);
      pop(c, text.missed, false);
      loseLife();
    }
  };

  return (
    <section aria-labelledby="game-title" className="relative">
      <div
        ref={field}
        className={cn(
          "relative isolate h-[clamp(440px,72svh,660px)] touch-manipulation overflow-hidden select-none",
          (!onScreen || status !== "playing") && "game-paused",
        )}
        style={{ "--stalk": "clamp(20px, 2.6vw, 36px)", "--critter": "clamp(58px, 7.5vw, 92px)" } as CSSProperties}
      >
        {/* Warm grove light */}
        <div aria-hidden="true" className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_70%_60%_at_50%_55%,rgba(201,154,85,0.16),transparent_70%)]" />

        {/* Wordmark behind the grove */}
        <p
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 flex flex-col items-center justify-center text-center font-display text-[clamp(3.6rem,15vw,13rem)] leading-[0.82] tracking-[-0.04em] text-bamboo/25"
        >
          {locale === "hi" ? (
            <>
              <span>द बैम्बू</span>
              <span className="italic">हाउस</span>
            </>
          ) : (
            <>
              <span>The Bamboo</span>
              <span className="italic">House</span>
            </>
          )}
        </p>

        {/* Critters sit between the wordmark and the stalks, so they slide out from behind them. */}
        {critters.map((c) => {
          const x = stalks[c.stalk];
          return (
            <div
              key={c.id}
              className="absolute overflow-hidden"
              style={{
                top: `${c.y}%`,
                width: "var(--critter)",
                height: "var(--critter)",
                left: c.side === "r" ? `calc(${x}% + var(--stalk) / 2)` : `calc(${x}% - var(--stalk) / 2 - var(--critter))`,
              }}
            >
              <button
                type="button"
                aria-label={text.labels[c.kind]}
                onPointerDown={() => tap(c)}
                onClick={() => tap(c)}
                onAnimationEnd={() => finished(c)}
                className={cn("critter block size-full", `critter-${c.side}`, c.outcome && `critter-${c.outcome}`)}
                style={{ "--dur": `${c.dur}ms` } as CSSProperties}
              >
                <CritterFace kind={c.kind} />
              </button>
            </div>
          );
        })}

        {/* Bamboo stalks */}
        {stalks.map((x, i) => (
          <div
            key={`${stalks.length}-${i}`}
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 -translate-x-1/2"
            style={{ left: `${x}%`, width: "var(--stalk)" }}
          >
            <div
              key={rustle[i] ?? 0}
              className={cn("culm size-full rounded-t-full", (rustle[i] ?? 0) > 0 && "rustle")}
              style={{ "--node": `${NODE_SPACING[i % NODE_SPACING.length]}px` } as CSSProperties}
            />
            <LeafSpray
              className={cn("absolute w-[5.5rem] sm:w-28", i % 2 ? "left-1/2" : "right-1/2 -scale-x-100")}
              style={{ top: `${[13, 19, 10, 16][i % 4]}%` }}
            />
          </div>
        ))}

        {/* Score pops */}
        {pops.map((p) => (
          <span
            key={p.id}
            aria-hidden="true"
            onAnimationEnd={() => setPops((prev) => prev.filter((x) => x.id !== p.id))}
            className={cn(
              "game-pop label pointer-events-none absolute z-20 -translate-x-1/2 rounded-full px-3 py-1.5 whitespace-nowrap",
              p.good ? "bg-bamboo text-smoke" : "bg-clay text-cream",
            )}
            style={{ left: p.x, top: `${p.y}%` }}
          >
            {p.text}
          </span>
        ))}

        {/* Controls: ••• menu, Freeze scroll, and the score pill (TIGERS 04 | ●●●). */}
        {status === "playing" && (
          <div className="absolute inset-x-0 bottom-0 z-20 flex flex-wrap items-center justify-end gap-2 p-3 sm:p-6">
            {menuOpen && (
              <>
                <button type="button" onClick={start} className={hudButton}>
                  {text.reset}
                </button>
                <button type="button" onClick={quit} className={hudButton}>
                  {text.quit}
                </button>
              </>
            )}
            <button
              type="button"
              aria-label={text.menu}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="min-h-10 rounded-full px-3 tracking-widest text-cream transition hover:bg-cream/15 active:scale-90"
            >
              •••
            </button>
            <button
              type="button"
              aria-pressed={frozen}
              onClick={() => setFrozen((v) => !v)}
              className={cn(hudButton, frozen && "border-bamboo bg-bamboo/15 text-bamboo-light shadow-[0_0_0_3px_rgba(201,154,85,0.25)]")}
            >
              {frozen ? text.unfreeze : text.freeze}
            </button>
            <p className="flex min-h-10 items-center gap-3 rounded-full border border-cream/25 bg-smoke/80 px-4 backdrop-blur-sm">
              <span className="label text-cream">
                {text.hud}{" "}
                <span className="ml-1 inline-block align-middle font-display text-2xl leading-none tracking-normal text-bamboo tabular-nums">
                  {String(score).padStart(2, "0")}
                </span>
              </span>
              <span aria-hidden="true" className="h-5 w-px bg-cream/25" />
              <span className="flex gap-1.5" aria-label={text.lives(lives)}>
                {Array.from({ length: LIVES }, (_, i) => (
                  <span key={i} className={cn("size-2.5 rounded-full transition-colors", i < lives ? "bg-clay" : "bg-smoke-line")} />
                ))}
              </span>
            </p>
          </div>
        )}

        {/* Start / game-over card */}
        {status !== "playing" && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-smoke/45 p-4 backdrop-blur-[2px]">
            <div className="w-full max-w-sm rounded-[1.75rem] border border-smoke-line bg-smoke/95 p-7 text-center shadow-2xl">
              <p className="label text-bamboo">[ {text.eyebrow} ]</p>
              <h2 id="game-title" className="mt-3 font-display text-4xl tracking-[-0.02em] text-cream">
                {status === "over" ? (
                  <>
                    {text.spotted(score)} <em className="text-bamboo not-italic">{text.spottedAccent}</em>
                  </>
                ) : (
                  <Accent parts={text.title} className="text-bamboo" />
                )}
              </h2>

              {status === "idle" ? (
                <>
                  <div className="mt-6 flex items-end justify-center gap-5">
                    <Legend kind="tiger" caption={text.tap} good />
                    <Legend kind="deer" caption={text.spare} />
                    <Legend kind="peacock" caption={text.spare} />
                  </div>
                  <p className="mt-5 text-sm leading-relaxed text-mist">
                    {text.rules}
                  </p>
                </>
              ) : (
                <p className="mt-4 text-sm leading-relaxed text-mist" aria-live="polite">
                  {beatBest ? text.newBest : text.yourBest(best)}
                  {text.outro}
                </p>
              )}

              <button
                type="button"
                onClick={start}
                className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-bamboo px-6 text-sm font-semibold tracking-wide text-smoke transition hover:bg-bamboo-light active:scale-[0.98]"
              >
                {status === "over" ? text.again : text.play}
              </button>
              {status === "idle" && best > 0 && <p className="label mt-4 text-mist">{text.best(best)}</p>}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

const hudButton =
  "min-h-10 rounded-full border border-cream/30 bg-smoke/70 px-4 text-sm text-cream backdrop-blur-sm transition hover:bg-cream/15 active:scale-95";

function Legend({ kind, caption, good }: { kind: CritterKind; caption: string; good?: boolean }) {
  return (
    <figure className="flex flex-col items-center gap-2">
      <span className={cn("block rounded-full p-1.5 ring-2", good ? "size-16 ring-bamboo" : "size-12 opacity-80 ring-smoke-line")}>
        <CritterFace kind={kind} />
      </span>
      <figcaption className={cn("label text-[0.6rem]", good ? "text-bamboo" : "text-mist")}>{caption}</figcaption>
    </figure>
  );
}

function LeafSpray({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 120 70" aria-hidden="true" className={className} style={style}>
      <path d="M0 40 C 30 36, 70 30, 116 14" stroke="#6b5a2c" strokeWidth="1.5" fill="none" />
      <path d="M22 38 C 34 22, 56 12, 82 10 C 62 22, 44 32, 22 38 Z" fill="#6f8a3e" />
      <path d="M44 34 C 60 34, 84 42, 104 58 C 80 54, 60 46, 44 34 Z" fill="#5a7433" />
      <path d="M70 26 C 84 16, 100 10, 118 12 C 104 20, 88 26, 70 26 Z" fill="#83a04a" />
    </svg>
  );
}
