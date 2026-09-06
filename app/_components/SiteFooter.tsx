import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { WRAP, FONT_DISPLAY } from "./ui";

const COLUMNS = [
  {
    heading: "product",
    links: [
      "productPayroll",
      "productPeople",
      "productCompliance",
      "productAnalytics",
    ],
  },
  {
    heading: "company",
    links: [
      "companyAbout",
      "companyCareers",
      "companyPress",
      "companyContact",
    ],
  },
  {
    heading: "resources",
    links: [
      "resourcesDocs",
      "resourcesChangelog",
      "resourcesStatus",
      "resourcesSecurity",
    ],
  },
] as const;

/** Site footer. Same structure and link set as the homepage footer. */
export default function SiteFooter({ homeLabel }: { homeLabel: string }) {
  const t = useTranslations("footer");

  return (
    <footer className="pt-16 pb-10 border-t border-(--line)">
      <div className={WRAP}>
        <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr] gap-10 max-[980px]:grid-cols-2 max-[560px]:grid-cols-1">
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
            <p className="text-(--mute) text-[13.5px] mt-3.5 max-w-[280px]">
              {t("tagline")}
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h2
                className={`${FONT_DISPLAY} text-[13px] font-semibold uppercase tracking-[0.1em] text-(--navy-900) m-0 mb-4`}
              >
                {t(col.heading)}
              </h2>
              <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
                {col.links.map((k) => (
                  <li key={k}>
                    <a
                      href="#"
                      className="text-[14px] text-(--ink-2) hover:text-(--navy) rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--blue)"
                    >
                      {t(k)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-(--line) flex justify-between items-center gap-4 text-[13px] text-(--mute) max-[560px]:flex-col max-[560px]:items-start">
          <span>{t("copyright")}</span>
          <span>{t("tagline2")}</span>
        </div>
      </div>
    </footer>
  );
}
