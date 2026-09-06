/**
 * Shared design primitives.
 *
 * These are the exact tokens and class strings used by the marketing site so
 * every page renders with one typographic scale, one button set and one
 * container width. Values mirror the constants at the top of
 * `app/[locale]/page.tsx`; new pages should import from here rather than
 * redeclaring them.
 */

export const WRAP = "mx-auto w-full max-w-[1200px] px-8";

export const FONT_DISPLAY = "font-display";
export const FONT_MONO = "font-mono";

export const KICKER =
  "inline-block mb-3.5 font-mono text-[12px] tracking-[0.12em] uppercase text-(--blue)";

export const LEDE = "m-0 text-[17px] text-(--ink-2)";

export const H2 =
  "font-display font-semibold text-[clamp(34px,3.6vw,48px)] leading-[1.05] -tracking-[0.03em] text-(--navy-900) m-0 mb-[18px]";

export const H3 =
  "font-display font-semibold text-[20px] -tracking-[0.015em] text-(--navy-900) m-0";

export const SECTION_HEAD = "max-w-[720px] mx-auto mb-14 text-center";

const BTN_BASE =
  "inline-flex items-center gap-2 h-[42px] px-[18px] rounded-full text-[14px] font-medium -tracking-[0.005em] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--blue)";

export const BTN = {
  ghost: `${BTN_BASE} text-(--ink) hover:text-(--navy)`,
  primary: `${BTN_BASE} bg-(--navy) text-white hover:bg-(--navy-900) hover:-translate-y-px hover:shadow-[0_8px_22px_-10px_rgba(11,42,99,0.55)]`,
  accent: `${BTN_BASE} bg-(--blue) text-white hover:bg-(--blue-600) hover:-translate-y-px hover:shadow-[0_8px_22px_-10px_rgba(47,125,250,0.7)]`,
  outline: `${BTN_BASE} border border-(--line-2) text-(--ink) hover:border-(--navy) hover:text-(--navy)`,
};

export const ArrowIcon = ({ size = 14 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

export const CheckIcon = ({
  size = 16,
  strokeWidth = 2.2,
}: {
  size?: number;
  strokeWidth?: number;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    aria-hidden="true"
  >
    <path d="M5 12l5 5L20 7" />
  </svg>
);

export const Tick = () => (
  <span
    aria-hidden="true"
    className="inline-grid w-3.5 h-3.5 rounded-full bg-(--navy) place-items-center flex-none after:content-[''] after:w-1.5 after:h-[3px] after:border-l-[1.5px] after:border-b-[1.5px] after:border-white after:-rotate-45 after:-mt-0.5"
  />
);
