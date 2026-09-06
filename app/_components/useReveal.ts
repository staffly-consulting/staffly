"use client";

import { useEffect } from "react";

/**
 * Fades `.reveal` elements in as they enter the viewport.
 * Mirrors the observer used on the homepage; the animation itself is defined
 * in `app/globals.css`. Respects `prefers-reduced-motion`.
 */
export function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll(".reveal");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach((el) => el.classList.add("visible"));
      return;
    }

    const io = new IntersectionObserver(
      (ents) => {
        ents.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    nodes.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
