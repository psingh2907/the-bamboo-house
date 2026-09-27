/**
 * How sure we are about a value.
 *
 *  verified    — seen first-hand (for example on the Google listing) and current.
 *  reported    — from a public listing or the client brief; confirm with the owner.
 *  unconfirmed — a reasonable assumption; must be confirmed before launch.
 *  demo        — sample content written for the prototype; replace before launch.
 */
export type DataStatus = "verified" | "reported" | "unconfirmed" | "demo";

/** A real photograph, stored under /public/images. */
export interface Photo {
  src: string;
  width: number;
  height: number;
}

/**
 * Illustrated stand-in used until the owner's photography arrives.
 * `seed` varies the composition so repeated variants don't look identical.
 */
export type ArtSpec =
  | { kind: "slats"; seed?: number }
  | { kind: "plate"; hue: number; seed?: number; thali?: boolean }
  | { kind: "pots"; seed?: number }
  | { kind: "lamp"; seed?: number }
  | { kind: "landscape"; hue: number; seed?: number; feature?: "river" | "falls" | "forest" | "temple" | "canyon" };

/**
 * Any image slot on the site. When `photo` is set it is shown; otherwise the
 * illustration is drawn. `shot` doubles as the photographer's shot list.
 */
export interface Visual {
  photo?: Photo;
  art: ArtSpec;
  alt: string;
  shot: string;
}

export interface MenuItem {
  name: string;
  description?: string;
  price: number;
  veg: boolean;
  /** Shown in "Signature dishes" on the home page. */
  signature?: boolean;
  visual?: Visual;
}

export interface MenuCategory {
  id: string;
  title: string;
  note?: string;
  items: MenuItem[];
}

export interface Review {
  author: string;
  rating: number;
  text: string;
  /** Month and year, e.g. "2026-08". */
  date: string;
}
