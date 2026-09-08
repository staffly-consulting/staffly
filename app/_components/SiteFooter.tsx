import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { WRAP } from "./ui";

/**
 * Site footer.
 *
 * Deliberately short: one link per destination that actually exists. Pages we
 * do not have (docs, changelog, status, careers, per-service pages) are absent
 * rather than pointing at "#". Paths are absolute so the same footer works from
 * the homepage and from product pages.
 */
const LINKS = [
  { key: "linkServices", href: "/#features" },
  { key: "linkHow", href: "/#how" },
  { key: "linkProduct", href: "/products/ats" },
  { key: "linkContact", href: "/#cta" },
] as const;

export default function SiteFooter({ homeLabel }: { homeLabel: string }) {
  const t = useTranslations("footer");

  return (
    <footer className="pt-16 pb-10 border-t border-(--line)">
      <div className={WRAP}>
        <div className="flex items-start justify-between gap-10 max-[720px]:flex-col">
          <div>
            <Link
              href="/"
              aria-label={homeLabel}
              className="group inline-flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--blue)"
            >
              <span className="inline-grid place-items-center transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:-rotate-6">
                <Image
                  src="/logo.png"
                  alt=""
                  width={130}
                  height={60}
                  className="w-full h-full object-contain"
                />
              </span>
            </Link>
            <p className="text-(--mute) text-[13.5px] mt-3.5 max-w-[320px]">
              {t("tagline")}
            </p>
          </div>

          <nav aria-label={t("linkServices")}>
            <ul className="list-none p-0 m-0 flex flex-col gap-2.5 max-[720px]:flex-row max-[720px]:flex-wrap max-[720px]:gap-x-6">
              {LINKS.map((l) => (
                <li key={l.key}>
                  <Link
                    href={l.href}
                    className="text-[14px] text-(--ink-2) hover:text-(--navy) rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--blue)"
                  >
                    {t(l.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 pt-6 border-t border-(--line) flex justify-between items-center gap-4 text-[13px] text-(--mute) max-[560px]:flex-col max-[560px]:items-start">
          <span>{t("copyright")}</span>
          <span>{t("tagline2")}</span>
        </div>
      </div>
    </footer>
  );
}
