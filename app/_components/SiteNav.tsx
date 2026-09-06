"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { WRAP, FONT_DISPLAY, BTN, ArrowIcon } from "./ui";

export type NavLink = { href: string; label: string };

/**
 * Fixed site header. Matches the homepage nav: translucent, blurred, and
 * tightening on scroll. Section links are passed in so each page can point at
 * its own anchors.
 */
export default function SiteNav({
  links,
  ctaHref,
  ctaLabel,
  homeLabel,
}: {
  links: NavLink[];
  ctaHref: string;
  ctaLabel: string;
  homeLabel: string;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] backdrop-blur-[14px] border-b transition-all duration-300 ${
        scrolled
          ? "bg-white/[0.92] border-(--line)"
          : "bg-white/[0.72] border-transparent"
      }`}
    >
      <div
        className={`${WRAP} flex items-center justify-between transition-all duration-300 ${
          scrolled ? "h-[62px]" : "h-[72px]"
        }`}
      >
        <Link
          href="/"
          aria-label={homeLabel}
          className={`group inline-flex items-center gap-2.5 ${FONT_DISPLAY} font-semibold text-[18px] -tracking-[0.018em] text-(--navy-900) rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--blue)`}
        >
          <span className="inline-grid place-items-center transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:-rotate-6">
            <Image
              src="/logo.png"
              alt=""
              width={130}
              height={60}
              className="w-full h-full object-contain"
              priority
            />
          </span>
        </Link>

        <div className="flex items-center gap-9 max-[980px]:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-(--ink-2) text-[14.5px] font-medium transition-colors hover:text-(--navy) rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--blue)"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3.5">
          <LanguageSwitcher />
          <a className={`${BTN.primary} max-[560px]:hidden`} href={ctaHref}>
            {ctaLabel} <ArrowIcon />
          </a>
        </div>
      </div>
    </nav>
  );
}
