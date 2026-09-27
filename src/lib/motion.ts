/**
 * Shared access to the smooth-scroll instance, so non-motion code (for
 * example the menu's category tabs) can scroll smoothly without importing Lenis.
 */
import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null): void {
  instance = lenis;
}

export function getLenis(): Lenis | null {
  return instance;
}

/** Scrolls to an element, smoothly when Lenis is running. */
export function scrollToElement(target: HTMLElement, offset = -96): void {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target, { offset });
  } else {
    const top = target.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: "auto" });
  }
}
