import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FONT_DISPLAY, FONT_MONO, ArrowIcon } from "./ui";

/**
 * Compact product tile for the products grid.
 *
 * Drop into any grid, e.g.
 *   <div className="grid grid-cols-3 gap-5 max-[980px]:grid-cols-1">
 *     <AtsProductCard />
 *   </div>
 *
 * The whole card is one link, so it is reachable with a single tab stop.
 */
export function AtsProductCard() {
  const t = useTranslations("ats.card");

  return (
    <Link
      href="/products/ats"
      className="group flex h-full flex-col justify-between gap-6 rounded-[22px] border border-(--line) bg-white p-7 transition-all duration-300 hover:border-(--line-2) hover:-translate-y-0.5 hover:shadow-[0_24px_48px_-30px_rgba(11,42,99,0.4)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--blue)"
    >
      <div className="flex items-start justify-between gap-4">
        <span
          aria-hidden="true"
          className="grid w-10 h-10 flex-none place-items-center rounded-[10px] bg-(--bg-navy-soft) text-(--navy)"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
            <path d="M14 3v5h5" />
            <path d="M9 13.5l2 2 4-4" />
          </svg>
        </span>
        <span
          className={`${FONT_MONO} text-[10px] tracking-[0.1em] uppercase text-(--mute) border border-(--line) rounded-full py-1 px-2.5`}
        >
          {t("status")}
        </span>
      </div>

      <div>
        <h3
          className={`${FONT_DISPLAY} font-semibold text-[20px] -tracking-[0.015em] text-(--navy-900) m-0 mb-2`}
        >
          {t("name")}
        </h3>
        <p className="text-(--ink-2) text-[14.5px] leading-[1.55] m-0">
          {t("desc")}
        </p>
      </div>

      <span className="inline-flex items-center gap-2 text-[14px] font-medium text-(--navy) transition-transform duration-200 group-hover:translate-x-0.5">
        {t("cta")} <ArrowIcon />
      </span>
    </Link>
  );
}

export default AtsProductCard;
