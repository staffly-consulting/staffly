"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

const LOCALES = [
  { code: "en" as const, key: "english" as const },
  { code: "th" as const, key: "thai" as const },
];

const GlobeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
  </svg>
);

const ChevronIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}>
    <path d="M5 12l5 5L20 7" />
  </svg>
);

export default function LanguageSwitcher() {
  const t = useTranslations("localeSwitch");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const select = (next: "en" | "th") => {
    setOpen(false);
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  return (
    <div ref={wrapRef} className="relative inline-block">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("label")}
        disabled={isPending}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 h-[38px] px-3 rounded-full border border-(--line-2) text-[13px] font-medium text-(--ink) transition-all hover:border-(--navy) hover:text-(--navy) hover:bg-white disabled:opacity-60 disabled:cursor-wait"
      >
        <GlobeIcon />
        <span className="font-mono text-[12px] tracking-wide">
          {locale.toUpperCase()}
        </span>
        <ChevronIcon />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute top-[calc(100%+8px)] right-0 list-none p-1.5 m-0 bg-white border border-(--line) rounded-xl shadow-[0_18px_40px_-18px_rgba(7,27,67,0.25)] min-w-[180px] z-[200]"
        >
          {LOCALES.map((l) => {
            const selected = l.code === locale;
            return (
              <li key={l.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => select(l.code)}
                  className={`w-full flex items-center gap-2.5 py-2 px-2.5 rounded-lg text-[13.5px] text-left transition-colors ${
                    selected
                      ? "text-(--navy) bg-(--bg-navy-soft)"
                      : "text-(--ink) hover:bg-(--bg-soft)"
                  }`}
                >
                  <span
                    className={`font-mono text-[11px] tracking-wider min-w-[22px] ${
                      selected ? "text-(--navy)" : "text-(--mute)"
                    }`}
                  >
                    {l.code.toUpperCase()}
                  </span>
                  <span className="flex-1 font-medium">{t(l.key)}</span>
                  {selected && (
                    <span className="inline-flex text-(--blue)">
                      <CheckIcon />
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
