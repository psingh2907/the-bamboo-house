import { Fraunces, Kalam, Mukta, Tiro_Devanagari_Hindi } from "next/font/google";

/*
 * One font setup for both languages (declared once: when each root layout
 * declared its own, the build shipped and preloaded both sets everywhere).
 *
 *  - Fraunces   headlines (Latin). Preloaded.
 *  - Mukta      body text. Only Latin is preloaded; next/font still declares
 *               the Devanagari files, which load only when Hindi text appears.
 *  - Kalam      the handwritten voice, Latin + Devanagari, on demand.
 *  - Tiro       Devanagari Hindi headlines (Fraunces has no Devanagari), on demand.
 *
 * All share their real family names, so the browser picks the right file per
 * character. Stacks are in globals.css (--font-display / --font-sans / --font-hand).
 */
export const display = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], display: "swap" });

export const body = Mukta({ variable: "--font-mukta", subsets: ["latin"], weight: ["400", "600"], display: "swap" });


export const hand = Kalam({ variable: "--font-kalam", subsets: ["latin", "devanagari"], weight: ["400"], display: "swap", preload: false });

export const displayDevanagari = Tiro_Devanagari_Hindi({
  variable: "--font-tiro",
  subsets: ["devanagari"],
  weight: "400",
  display: "swap",
  preload: false,
});

export const fontVariables = [display, body, hand, displayDevanagari].map((f) => f.variable).join(" ");
