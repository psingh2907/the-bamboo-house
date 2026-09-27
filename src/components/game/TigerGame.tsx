"use client";

import { type CSSProperties, useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Locale } from "@/i18n";
import { t } from "@/i18n/dictionaries";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { getLenis } from "@/lib/motion";
import { Icon } from "../ui/Icon";
import { Accent } from "../ui/Accent";
import { CritterFace, type CritterKind } from "./Critters";
import { buzz, ForestAudio, readSoundPref, saveSoundPref } from "./sound";

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
 *
 * Extras: synthesised forest sound (sound.ts) with a remembered mute toggle,
 * phone vibration, a rare golden tiger (+5), combos (5 in a row ×2, 12 in a
 * row ×3) and a forest that turns from day to dusk to night as the score
 * climbs. Game over offers a WhatsApp / native share of the score.
 */

type Status = "idle" | "playing" | "over";
type Phase = "day" | "dusk" | "night";
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

const DUSK_AT = 12;
const NIGHT_AT = 25;

const phaseFor = (score: number): Phase => (score >= NIGHT_AT ? "night" : score >= DUSK_AT ? "dusk" : "day");

/** Points multiplier for the current streak of tigers. */
const multiplierFor = (streak: number) => (streak >= 12 ? 3 : streak >= 5 ? 2 : 1);

function pickKind(spawned: number, score: number): CritterKind {
  if (spawned < 3) return "tiger";
  const r = Math.random();
  if (score >= 4 && r < 0.06) return "golden";
  return r < 0.68 ? "tiger" : r < 0.88 ? "deer" : "peacock";
}

const isTiger = (kind: CritterKind) => kind === "tiger" || kind === "golden";

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
  const [streak, setStreak] = useState(0);
  const [phaseNote, setPhaseNote] = useState<{ id: number; text: string } | null>(null);
  const [soundChoice, setSoundChoice] = useState<boolean | null>(null);

  const field = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const spawned = useRef(0);
  const scoreRef = useRef(0);
  const livesRef = useRef(LIVES);
  const settled = useRef(new Set<number>());
  const streakRef = useRef(0);
  const audio = useRef<ForestAudio | null>(null);

  // Sound preference: remembered in localStorage; a toggle overrides it.
  const soundPref = useSyncExternalStore(noSubscribe, readSoundPref, () => true);
  const soundOn = soundChoice ?? soundPref;
  const phase = phaseFor(score);

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
    audio.current?.over();
    audio.current?.pause();
    buzz(90);
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
    streakRef.current = 0;
    setStreak(0);
    livesRef.current -= 1;
    setLives(livesRef.current);
    if (livesRef.current <= 0) endGame();
  }, [endGame]);

  const start = () => {
    audio.current ??= new ForestAudio();
    audio.current.muted = !soundOn;
    audio.current.start(); // inside the click: browsers only allow audio after a gesture
    streakRef.current = 0;
    setStreak(0);
    setPhaseNote(null);
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
    audio.current?.pause();
    setStatus("idle");
    setCritters([]);
    setPops([]);
    setFrozen(false);
    setMenuOpen(false);
  };

  const toggleSound = () => {
    const next = !soundOn;
    setSoundChoice(next);
    saveSoundPref(next);
    audio.current?.setMuted(!next);
  };

  // The forest only plays while a game is on screen.
  useEffect(() => {
    const a = audio.current;
    if (!a) return;
    if (status === "playing" && onScreen) a.resume();
    else if (status === "playing") a.pause();
  }, [status, onScreen]);

  useEffect(() => () => audio.current?.dispose(), []);

  const share = async () => {
    const url = window.location.origin + window.location.pathname;
    const message = text.shareText(scoreRef.current, url);
    trackEvent("game_share", { score: scoreRef.current });
    try {
      if (navigator.share) {
        await navigator.share({ text: message });
        return;
      }
    } catch {
      return; // share sheet dismissed
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
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
        kind: pickKind(spawned.current++, s),
        stalk,
        side,
        y: 26 + Math.random() * 44,
        dur: Math.max(760, 1650 - s * 40),
      };
      // Golden tigers don't wait around.
      if (critter.kind === "golden") critter.dur = Math.round(critter.dur * 0.7);
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
    audio.current?.tok();
    if (isTiger(c.kind)) {
      streakRef.current += 1;
      setStreak(streakRef.current);
      const mult = multiplierFor(streakRef.current);
      const points = (c.kind === "golden" ? 5 : 1) * mult;
      const before = phaseFor(scoreRef.current);
      scoreRef.current += points;
      setScore(scoreRef.current);
      if (c.kind === "golden") {
        audio.current?.golden();
        buzz([20, 40, 20]);
        pop(c, mult > 1 ? `${text.golden} ×${mult}` : text.golden, true);
      } else {
        audio.current?.caught(streakRef.current);
        buzz(12);
        pop(c, `+${points}`, true);
      }
      // Dusk and night arrive as the score climbs.
      const after = phaseFor(scoreRef.current);
      if (after !== before) {
        audio.current?.nightfall();
        setPhaseNote({ id: nextId.current++, text: after === "night" ? text.night : text.dusk });
      }
      setCritters((prev) => prev.map((x) => (x.id === c.id ? { ...x, outcome: "caught" } : x)));
    } else {
      audio.current?.wrong();
      buzz([40, 60, 40]);
      pop(c, c.kind === "deer" ? text.notDeer : text.notPeacock, false);
      setCritters((prev) => prev.map((x) => (x.id === c.id ? { ...x, outcome: "wrong" } : x)));
      loseLife();
    }
  };

  const finished = (c: Critter) => {
    setCritters((prev) => prev.filter((x) => x.id !== c.id));
    // A tiger that got away costs a life.
    if (!settled.current.has(c.id) && isTiger(c.kind) && status === "playing") {
      settled.current.add(c.id);
      audio.current?.missed();
      buzz(30);
      pop(c, text.missed, false);
      loseLife();
    }
  };

  return (
    <section aria-labelledby="game-title" className="relative">
      <div
        ref={field}
        data-phase={status === "playing" ? phase : "day"}
        className={cn(
          "tiger-field relative isolate h-[clamp(440px,72svh,660px)] touch-manipulation overflow-hidden select-none",
          (!onScreen || status !== "playing") && "game-paused",
        )}
        style={{ "--stalk": "clamp(20px, 2.6vw, 36px)", "--critter": "clamp(58px, 7.5vw, 92px)" } as CSSProperties}
      >
        {/* Warm grove light */}
        <div aria-hidden="true" className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_70%_60%_at_50%_55%,rgba(201,154,85,0.16),transparent_70%)]" />
        {/* Dusk and night: a darkening sky and hanging lanterns (see .tiger-field in globals.css) */}
        <div aria-hidden="true" className="game-sky pointer-events-none absolute inset-0 z-[5]" />
        <Lanterns />

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

        {/* "Dusk falls…" / "Night in the forest" */}
        {phaseNote && (
          <p
            key={phaseNote.id}
            aria-live="polite"
            onAnimationEnd={() => setPhaseNote(null)}
            className="phase-note font-hand pointer-events-none absolute inset-x-0 top-[38%] z-20 text-center text-[clamp(2rem,6vw,3.5rem)] text-bamboo-light"
          >
            {phaseNote.text}
          </p>
        )}

        {/* Controls: ••• menu, sound, Freeze scroll, and the score pill (TIGERS 04 | ●●●). */}
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
              onClick={toggleSound}
              aria-pressed={soundOn}
              aria-label={soundOn ? text.soundOn : text.soundOff}
              title={soundOn ? text.soundOn : text.soundOff}
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-cream/30 bg-smoke/70 text-cream backdrop-blur-sm transition hover:bg-cream/15 active:scale-95"
            >
              <Icon name={soundOn ? "sound" : "mute"} className="size-[1.1rem] shrink-0" />
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
              {multiplierFor(streak) > 1 && (
                <span
                  key={multiplierFor(streak)}
                  title={text.streak(streak)}
                  className="combo-chip rounded-full bg-bamboo px-2 py-0.5 font-display text-sm leading-none text-smoke"
                >
                  ×{multiplierFor(streak)}
                </span>
              )}
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
                    {text.rules} {text.rulesExtra}
                  </p>
                </>
              ) : (
                <p className="mt-4 text-sm leading-relaxed text-mist" aria-live="polite">
                  {beatBest ? text.newBest : text.yourBest(best)}
                  {text.outro}
                </p>
              )}

              {status === "over" && score > 0 && (
                <button
                  type="button"
                  onClick={share}
                  className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full bg-whatsapp px-6 text-sm font-semibold text-smoke transition hover:brightness-110 active:scale-[0.98]"
                >
                  <Icon name="whatsapp" className="size-5" />
                  {text.share}
                </button>
              )}
              <button
                type="button"
                onClick={start}
                className={cn(status === "over" && score > 0 ? "mt-3" : "mt-7", "inline-flex min-h-12 w-full items-center justify-center rounded-full bg-bamboo px-6 text-sm font-semibold tracking-wide text-smoke transition hover:bg-bamboo-light active:scale-[0.98]")}
              >
                {status === "over" ? text.again : text.play}
              </button>
              {status === "idle" && best > 0 && <p className="label mt-4 text-mist">{text.best(best)}</p>}
              <button
                type="button"
                onClick={toggleSound}
                aria-pressed={soundOn}
                className="label mt-4 inline-flex items-center gap-1.5 text-mist hover:text-bamboo-light"
              >
                <Icon name={soundOn ? "sound" : "mute"} className="size-4" />
                {soundOn ? text.soundOn : text.soundOff}
              </button>
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

/** Lanterns that light up at night. */
function Lanterns() {
  const spots = [
    { x: 14, drop: 18 },
    { x: 43, drop: 10 },
    { x: 72, drop: 22 },
  ];
  return (
    <div aria-hidden="true" className="game-lanterns pointer-events-none absolute inset-0 z-[6]">
      {spots.map((s) => (
        <svg key={s.x} viewBox="0 0 40 120" className="absolute top-0 w-7 sm:w-9" style={{ left: `${s.x}%`, height: `${s.drop + 12}%` }} preserveAspectRatio="xMidYMax meet">
          <line x1="20" y1="0" x2="20" y2="86" stroke="#6b4a22" strokeWidth="1.2" />
          <circle cx="20" cy="100" r="22" fill="#ffb347" opacity="0.28" className="lantern-glow" />
          <rect x="11" y="86" width="18" height="26" rx="7" fill="#f2a33a" />
          <rect x="13" y="84" width="14" height="4" rx="1.5" fill="#6b4a22" />
          <rect x="13" y="111" width="14" height="3" rx="1.5" fill="#6b4a22" />
        </svg>
      ))}
    </div>
  );
}
