"use client";

import { useReveal } from "./useReveal";

/** Mounts the scroll-reveal observer for a page. Renders nothing. */
export default function RevealOnScroll() {
  useReveal();
  return null;
}
