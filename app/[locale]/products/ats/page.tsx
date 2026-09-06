import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale, useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import atsShot from "@/public/ats.jpg";
import scoreShot from "@/public/score.png";
import SiteNav from "@/app/_components/SiteNav";
import SiteFooter from "@/app/_components/SiteFooter";
import RevealOnScroll from "@/app/_components/RevealOnScroll";
import WaitlistForm from "@/app/_components/WaitlistForm";
import {
  WRAP,
  FONT_DISPLAY,
  FONT_MONO,
  KICKER,
  LEDE,
  H2,
  H3,
  SECTION_HEAD,
  BTN,
  ArrowIcon,
  CheckIcon,
  Tick,
} from "@/app/_components/ui";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ats.meta" });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      type: "website",
      title: t("title"),
      description: t("description"),
      images: [{ url: "/thumbnail.png", alt: "Staffly ATS+" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/thumbnail.png"],
    },
  };
}

/* ---------------------------------------------------------------- helpers */

/**
 * Product screenshot in a framed figure.
 *
 * `src` is a static import so Next infers intrinsic width/height (no layout
 * shift) and can generate the blur placeholder.
 */
function Shot({
  src,
  alt,
  caption,
  sizes,
  priority = false,
}: {
  src: StaticImageData;
  alt: string;
  caption: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <figure className="m-0">
      <div className="overflow-hidden rounded-[22px] border border-(--line) bg-white shadow-[0_40px_80px_-40px_rgba(11,42,99,0.25)]">
        <Image
          src={src}
          alt={alt}
          sizes={sizes}
          placeholder="blur"
          priority={priority}
          className="block w-full h-auto"
        />
      </div>
      <figcaption
        className={`${FONT_MONO} mt-4 text-center text-[12px] tracking-[0.08em] uppercase text-(--mute)`}
      >
        {caption}
      </figcaption>
    </figure>
  );
}

const STEP_ICONS = [
  // 01 forward
  <>
    <path d="M3 6.5h18v11H3z" />
    <path d="M3 7l9 6 9-6" />
  </>,
  // 02 read
  <>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5" />
    <path d="M8.5 13h7M8.5 16.5h4" />
  </>,
  // 03 score
  <>
    <path d="M12 3a9 9 0 1 1-9 9" />
    <path d="M12 3v9l6 4" />
  </>,
  // 04 shortlist
  <>
    <path d="M4 6h10M4 12h13M4 18h7" />
    <path d="M17 18l2 2 3-4" />
  </>,
];

const WHY_ICONS: Record<string, React.ReactNode> = {
  invent: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M8.5 12h7" />
    </>
  ),
  fair: (
    <>
      <path d="M12 4v16M6 8h12" />
      <path d="M6 8l-2.5 6a3 3 0 0 0 5 0z" />
      <path d="M18 8l2.5 6a3 3 0 0 1-5 0z" />
    </>
  ),
  harden: (
    <>
      <path d="M12 3l8 3.5v5c0 4.5-3.2 8.4-8 9.5-4.8-1.1-8-5-8-9.5v-5z" />
      <path d="M9.5 12l1.8 1.8L15 10" />
    </>
  ),
  flag: (
    <>
      <path d="M12 3v13" />
      <path d="M12 4h8l-2.5 3.5L20 11h-8" />
      <circle cx="12" cy="20" r="1" />
    </>
  ),
  tenant: (
    <>
      <rect x="3" y="4" width="18" height="6" rx="2" />
      <rect x="3" y="14" width="18" height="6" rx="2" />
      <path d="M7 7h.01M7 17h.01" />
    </>
  ),
};

function Glyph({ children }: { children: React.ReactNode }) {
  return (
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
        {children}
      </svg>
    </span>
  );
}

/* ------------------------------------------------------------------- page */

export default async function AtsProductPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return <AtsProductPageContent />;
}

function AtsProductPageContent() {
  const t = useTranslations("ats");

  const steps = [1, 2, 3, 4] as const;
  const whyCards = ["invent", "fair", "harden", "flag", "tenant"] as const;
  const moreItems = ["i1", "i2", "i3", "i4", "i5", "i6", "i7", "i8"] as const;
  const builtLines = ["l1", "l2", "l3", "l4"] as const;
  const faqs = [1, 2, 3, 4, 5, 6, 7] as const;

  const tiers = [
    {
      key: "t1",
      featured: false,
      rows: [
        { value: t("pricing.t1Included"), label: t("pricing.included") },
        { value: t("pricing.t1Extra"), label: t("pricing.extra") },
        { value: t("pricing.t1Posts"), label: t("pricing.posts") },
        { value: t("pricing.t1Inbox"), label: t("pricing.inbox") },
        { value: t("pricing.seatsValue"), label: t("pricing.seats") },
      ],
    },
    {
      key: "t2",
      featured: true,
      rows: [
        { value: t("pricing.t2Included"), label: t("pricing.included") },
        { value: t("pricing.t2Extra"), label: t("pricing.extra") },
        { value: t("pricing.t2Posts"), label: t("pricing.posts") },
        { value: t("pricing.t2Inbox"), label: t("pricing.inboxes") },
        { value: t("pricing.seatsValue"), label: t("pricing.seats") },
      ],
    },
    {
      key: "t3",
      featured: false,
      rows: [
        { value: t("pricing.t3Included"), label: t("pricing.included") },
        { value: t("pricing.t3Extra"), label: t("pricing.extra") },
        { value: t("pricing.t3Posts"), label: t("pricing.posts") },
        { value: t("pricing.t3Inbox"), label: t("pricing.inboxes") },
        { value: t("pricing.seatsValue"), label: t("pricing.seats") },
      ],
    },
  ] as const;

  return (
    <>
      <RevealOnScroll />

      <SiteNav
        homeLabel={t("nav.home")}
        ctaHref="#early-access"
        ctaLabel={t("nav.cta")}
        links={[
          { href: "#how", label: t("nav.how") },
          { href: "#why", label: t("nav.why") },
          { href: "#pricing", label: t("nav.pricing") },
          { href: "#faq", label: t("nav.faq") },
        ]}
      />

      <main id="main">
        {/* ---------------------------------------------------------- HERO */}
        <header className="relative pt-[140px] pb-[70px] max-[980px]:pt-[110px]">
          <div className={`${WRAP} text-center`}>
            <span
              className={`inline-flex items-center gap-2.5 ${FONT_MONO} text-[12px] tracking-[0.08em] uppercase text-(--ink-2) py-1.5 px-3 border border-(--line) rounded-full bg-white`}
            >
              <span
                aria-hidden="true"
                className="w-1.5 h-1.5 rounded-full bg-(--blue) shadow-[0_0_0_4px_rgba(47,125,250,0.18)]"
              />
              {t("hero.product")} · {t("hero.status")}
            </span>

            <h1
              className={`${FONT_DISPLAY} font-semibold text-[clamp(34px,4.2vw,48px)] text-balance leading-[1.06] -tracking-[0.035em] my-[22px] text-(--navy-900) [&_em]:not-italic [&_em]:text-(--blue)`}
            >
              {t.rich("hero.title", { em: (chunks) => <em>{chunks}</em> })}
            </h1>

            <p className="text-[18px] leading-[1.55] text-(--ink-2) max-w-[640px] mx-auto m-0 mb-8">
              {t("hero.subtitle")}
            </p>

            <div className="flex justify-center mb-9">
              <a className={BTN.accent} href="#early-access">
                {t("hero.cta")} <ArrowIcon />
              </a>
            </div>

            <ul className="list-none p-0 m-0 flex flex-wrap gap-x-7 gap-y-3 justify-center items-center text-[13.5px] text-(--mute)">
              {(["note1", "note2", "note3", "note4"] as const).map((k) => (
                <li key={k} className="inline-flex items-center gap-2">
                  <Tick />
                  {t(`hero.${k}`)}
                </li>
              ))}
            </ul>
          </div>

          <div className={`${WRAP} mt-16 reveal`}>
            <Shot
              src={atsShot}
              alt={t("hero.shotAlt")}
              caption={t("hero.shotDesc")}
              sizes="(max-width: 1264px) 100vw, 1136px"
              priority
            />
          </div>
        </header>

        {/* ------------------------------------------------------- PROBLEM */}
        <section
          aria-labelledby="problem-title"
          className="relative pt-[60px] pb-[90px]"
        >
          <div className="mx-auto w-full max-w-[820px] px-8 reveal">
            <div className="border-l-2 border-(--blue) pl-7 max-[560px]:pl-5">
              <span className={KICKER}>{t("problem.kicker")}</span>
              <h2
                id="problem-title"
                className={`${FONT_DISPLAY} font-semibold text-[clamp(26px,2.8vw,36px)] leading-[1.15] -tracking-[0.025em] text-(--navy-900) m-0 mb-4`}
              >
                {t("problem.title")}
              </h2>
              <p className="text-[17px] leading-[1.6] text-(--ink-2) m-0">
                {t("problem.body")}
              </p>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------- HOW IT WORKS */}
        <section
          id="how"
          aria-labelledby="how-title"
          className="relative py-[110px] bg-(--bg-soft) scroll-mt-[72px]"
        >
          <div className={WRAP}>
            <div className={`${SECTION_HEAD} reveal`}>
              <span className={KICKER}>{t("how.kicker")}</span>
              <h2 id="how-title" className={H2}>
                {t("how.title")}
              </h2>
              <p className={LEDE}>{t("how.lede")}</p>
            </div>

            <ol className="list-none p-0 m-0 grid grid-cols-4 gap-px bg-(--line) border border-(--line) rounded-[22px] overflow-hidden reveal max-[980px]:grid-cols-2 max-[620px]:grid-cols-1">
              {steps.map((n, i) => (
                <li
                  key={n}
                  className="bg-white py-9 px-7 flex flex-col gap-5 transition-colors duration-300 hover:bg-[#FAFBFE]"
                >
                  <Glyph>{STEP_ICONS[i]}</Glyph>
                  <div>
                    <div
                      className={`${FONT_MONO} text-[11px] tracking-[0.08em] uppercase text-(--mute) mb-2.5`}
                    >
                      {t(`how.s${n}Num`)}
                    </div>
                    <h3 className={`${H3} mb-2`}>{t(`how.s${n}Title`)}</h3>
                    <p className="text-(--ink-2) text-[14.5px] leading-[1.55] m-0">
                      {t(`how.s${n}Body`)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-12 max-w-[1040px] mx-auto reveal">
              <Shot
                src={scoreShot}
                alt={t("how.shotAlt")}
                caption={t("how.shotDesc")}
                sizes="(max-width: 1104px) 100vw, 1040px"
              />
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ DIFFERENTIATORS */}
        <section
          id="why"
          aria-labelledby="why-title"
          className="relative py-[120px] scroll-mt-[72px]"
        >
          <div className={WRAP}>
            <div className={`${SECTION_HEAD} reveal`}>
              <span className={KICKER}>{t("why.kicker")}</span>
              <h2 id="why-title" className={H2}>
                {t("why.title")}
              </h2>
              <p className={LEDE}>{t("why.lede")}</p>
            </div>

            {/* Lead differentiator: explainability, with a worked example */}
            <div className="reveal grid grid-cols-[1fr_minmax(0,420px)] gap-14 items-center border border-(--line) rounded-[22px] bg-white p-10 shadow-[0_40px_80px_-56px_rgba(11,42,99,0.4)] max-[980px]:grid-cols-1 max-[980px]:gap-10 max-[560px]:p-7">
              <div>
                <Glyph>
                  <>
                    <path d="M4 19V5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
                    <path d="M15 3v5h5" />
                    <path d="M8.5 12.5h7M8.5 16h4.5" />
                  </>
                </Glyph>
                <h3
                  className={`${FONT_DISPLAY} font-semibold text-[26px] -tracking-[0.02em] text-(--navy-900) mt-6 mb-3`}
                >
                  {t("why.explainTitle")}
                </h3>
                <p className="text-(--ink-2) text-[16px] leading-[1.6] m-0 mb-4">
                  {t("why.explainBody")}
                </p>
                <p className="text-(--ink) text-[15px] leading-[1.6] m-0 font-medium">
                  {t("why.explainCaption")}
                </p>
              </div>

              <figure className="m-0 rounded-[18px] border border-(--line) bg-(--bg-soft) p-6">
                <figcaption
                  className={`${FONT_MONO} text-[11px] tracking-[0.1em] uppercase text-(--mute) mb-4`}
                >
                  {t("why.exLabel")}
                </figcaption>
                <div className="flex items-baseline gap-2 pb-5 mb-5 border-b border-(--line-2)">
                  <span
                    className={`${FONT_DISPLAY} text-[52px] font-semibold leading-none -tracking-[0.035em] text-(--navy-900)`}
                  >
                    {t("why.exScore")}
                  </span>
                  <span className={`${FONT_MONO} text-[14px] text-(--mute)`}>
                    {t("why.exScoreOf")}
                  </span>
                </div>
                <dl className="m-0 grid grid-cols-1 gap-4">
                  {([1, 2, 3] as const).map((r) => (
                    <div key={r}>
                      <dt className="text-[13px] font-medium text-(--navy-900)">
                        {t(`why.exRow${r}`)}
                      </dt>
                      <dd
                        className={`${FONT_MONO} text-[12.5px] text-(--ink-2) m-0 mt-1`}
                      >
                        {t(`why.exRow${r}Val`)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </figure>
            </div>

            {/* Remaining differentiators */}
            <ul className="list-none p-0 m-0 mt-5 grid grid-cols-3 gap-5 reveal max-[980px]:grid-cols-2 max-[620px]:grid-cols-1">
              {whyCards.map((k) => (
                <li
                  key={k}
                  className="border border-(--line) rounded-[22px] bg-white p-8 transition-colors duration-300 hover:bg-[#FAFBFE]"
                >
                  <Glyph>{WHY_ICONS[k]}</Glyph>
                  <h3 className={`${H3} mt-6 mb-2.5`}>{t(`why.${k}Title`)}</h3>
                  <p className="text-(--ink-2) text-[14.5px] leading-[1.6] m-0">
                    {t(`why.${k}Body`)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------------------------------------- SECONDARY FEATURES */}
        <section
          aria-labelledby="more-title"
          className="relative py-[110px] bg-(--bg-soft)"
        >
          <div className={WRAP}>
            <div className={`${SECTION_HEAD} reveal`}>
              <span className={KICKER}>{t("more.kicker")}</span>
              <h2 id="more-title" className={H2}>
                {t("more.title")}
              </h2>
            </div>

            <ul className="list-none p-0 m-0 grid grid-cols-2 gap-x-10 gap-y-5 max-w-[940px] mx-auto reveal max-[720px]:grid-cols-1">
              {moreItems.map((k) => (
                <li
                  key={k}
                  className="flex gap-3.5 items-start text-[15px] leading-[1.55] text-(--ink) border-b border-(--line-2) pb-5"
                >
                  <span className="text-(--blue) flex-none mt-0.5">
                    <CheckIcon size={18} strokeWidth={2} />
                  </span>
                  {t(`more.${k}`)}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ------------------------------------------------------- PRICING */}
        <section
          id="pricing"
          aria-labelledby="pricing-title"
          className="relative py-[120px] bg-(--navy-900) text-white overflow-hidden scroll-mt-[72px] before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_20%_0%,rgba(47,125,250,0.2),transparent_40%),radial-gradient(circle_at_80%_100%,rgba(47,125,250,0.12),transparent_40%)] before:pointer-events-none"
        >
          <div className={`${WRAP} relative`}>
            <div className={`${SECTION_HEAD} reveal`}>
              <span className={`${KICKER} !text-[#7FB0FF]`}>
                {t("pricing.kicker")}
              </span>
              <h2 id="pricing-title" className={`${H2} !text-white`}>
                {t("pricing.title")}
              </h2>
              <p className="m-0 text-[17px] text-white/70">
                {t("pricing.lede")}
              </p>
              <p
                className={`${FONT_MONO} m-0 mt-4 text-[12.5px] tracking-[0.06em] uppercase text-[#7FB0FF]`}
              >
                {t("pricing.annualNote")}
              </p>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-14 reveal max-[1100px]:grid-cols-2 max-[620px]:grid-cols-1">
              {tiers.map((tier) => (
                <div
                  key={tier.key}
                  className={`rounded-[22px] p-7 flex flex-col border ${
                    tier.featured
                      ? "border-white bg-white text-(--navy-900)"
                      : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <h3
                    className={`${FONT_DISPLAY} text-[16px] font-semibold -tracking-[0.01em] m-0 mb-1.5`}
                  >
                    {t(`pricing.${tier.key}Name`)}
                  </h3>
                  <p
                    className={`text-[13.5px] m-0 mb-6 min-h-[40px] ${
                      tier.featured ? "text-(--mute)" : "text-white/60"
                    }`}
                  >
                    {t(`pricing.${tier.key}Desc`)}
                  </p>

                  <p
                    className={`${FONT_DISPLAY} text-[42px] font-semibold -tracking-[0.035em] leading-none m-0`}
                  >
                    {t(`pricing.${tier.key}Price`)}
                    <small
                      className={`text-[13px] font-normal font-sans ml-1.5 ${
                        tier.featured ? "text-(--mute)" : "text-white/55"
                      }`}
                    >
                      {t("pricing.perMonth")}
                    </small>
                  </p>

                  <dl
                    className={`m-0 my-7 flex flex-col gap-3.5 flex-1 border-t pt-6 ${
                      tier.featured ? "border-(--line)" : "border-white/10"
                    }`}
                  >
                    {tier.rows.map((row) => (
                      <div key={row.label} className="flex flex-col">
                        <dt
                          className={`${FONT_DISPLAY} text-[17px] font-semibold -tracking-[0.015em] ${
                            tier.featured ? "text-(--navy-900)" : "text-white"
                          }`}
                        >
                          {row.value}
                        </dt>
                        <dd
                          className={`text-[13px] m-0 ${
                            tier.featured ? "text-(--mute)" : "text-white/60"
                          }`}
                        >
                          {row.label}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <a
                    href="#early-access"
                    className={
                      tier.featured
                        ? `${BTN.primary} w-full justify-center`
                        : `${BTN.outline} w-full justify-center !border-white/20 !text-white hover:!border-white hover:!text-white`
                    }
                  >
                    {t("pricing.cta")}
                  </a>
                </div>
              ))}

              {/* Enterprise */}
              <div className="rounded-[22px] p-7 flex flex-col border border-white/10 bg-white/[0.03]">
                <h3
                  className={`${FONT_DISPLAY} text-[16px] font-semibold -tracking-[0.01em] m-0 mb-1.5`}
                >
                  {t("pricing.t4Name")}
                </h3>
                <p className="text-[13.5px] text-white/60 m-0 mb-6 min-h-[40px]">
                  {t("pricing.t4Desc")}
                </p>
                <p
                  className={`${FONT_DISPLAY} text-[42px] font-semibold -tracking-[0.035em] leading-none m-0`}
                >
                  {t("pricing.t4Price")}
                </p>
                <ul className="list-none p-0 m-0 my-7 flex flex-col gap-3 flex-1 border-t border-white/10 pt-6">
                  {(["t4F1", "t4F2", "t4F3", "t4F4"] as const).map((k) => (
                    <li
                      key={k}
                      className="text-[14px] flex gap-2.5 items-start text-white/85"
                    >
                      <span className="text-[#7FB0FF] flex-none mt-[3px]">
                        <CheckIcon />
                      </span>
                      {t(`pricing.${k}`)}
                    </li>
                  ))}
                </ul>
                <a
                  href="#early-access"
                  className={`${BTN.outline} w-full justify-center !border-white/20 !text-white hover:!border-white hover:!text-white`}
                >
                  {t("pricing.t4Cta")}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------- HOW IT'S BUILT */}
        <section
          aria-labelledby="built-title"
          className="relative py-[110px]"
        >
          <div className="mx-auto w-full max-w-[900px] px-8 reveal">
            <span className={KICKER}>{t("built.kicker")}</span>
            <h2
              id="built-title"
              className={`${FONT_DISPLAY} font-semibold text-[clamp(26px,2.8vw,36px)] leading-[1.15] -tracking-[0.025em] text-(--navy-900) m-0 mb-8 max-w-[720px]`}
            >
              {t("built.title")}
            </h2>
            <ul className="list-none p-0 m-0 grid grid-cols-2 gap-x-10 gap-y-6 max-[720px]:grid-cols-1">
              {builtLines.map((k, i) => (
                <li key={k} className="flex gap-4 items-start">
                  <span
                    aria-hidden="true"
                    className={`${FONT_MONO} text-[12px] text-(--blue) mt-1 flex-none`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[15px] leading-[1.6] text-(--ink-2) m-0">
                    {t(`built.${k}`)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ----------------------------------------------------------- FAQ */}
        <section
          id="faq"
          aria-labelledby="faq-title"
          className="relative py-[110px] bg-(--bg-soft) scroll-mt-[72px]"
        >
          <div className={WRAP}>
            <div className={`${SECTION_HEAD} reveal`}>
              <span className={KICKER}>{t("faq.kicker")}</span>
              <h2 id="faq-title" className={H2}>
                {t("faq.title")}
              </h2>
            </div>

            <div className="max-w-[820px] mx-auto reveal border-t border-(--line-2)">
              {faqs.map((n) => (
                <details
                  key={n}
                  className="group border-b border-(--line-2) [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[17px] font-medium -tracking-[0.01em] text-(--navy-900) transition-colors hover:text-(--blue) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--blue)">
                    {t(`faq.q${n}`)}
                    <span
                      aria-hidden="true"
                      className="grid w-7 h-7 flex-none place-items-center rounded-full border border-(--line-2) text-(--navy) transition-transform duration-300 group-open:rotate-45"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </summary>
                  <p className="text-[15.5px] leading-[1.65] text-(--ink-2) m-0 pb-7 pr-12 max-[560px]:pr-0">
                    {t(`faq.a${n}`)}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------------------------------- CLOSING CTA */}
        <section
          id="early-access"
          aria-labelledby="cta-title"
          className="relative py-[140px] text-center scroll-mt-[72px]"
        >
          <div className={WRAP}>
            <div className="reveal max-w-[880px] mx-auto rounded-[28px] py-20 px-10 bg-(--navy-900) text-white relative overflow-hidden max-[560px]:px-6 max-[560px]:py-14 before:content-[''] before:absolute before:-inset-px before:rounded-[28px] before:pointer-events-none before:bg-[radial-gradient(circle_at_15%_20%,rgba(47,125,250,0.4),transparent_35%),radial-gradient(circle_at_85%_90%,rgba(47,125,250,0.25),transparent_40%)] [&>*]:relative">
              <span className={`${KICKER} !text-[#7FB0FF]`}>
                {t("cta.kicker")}
              </span>
              <h2 id="cta-title" className={`${H2} !text-white mb-[18px]`}>
                {t("cta.title")}
              </h2>
              <p className="text-white/75 text-[17px] max-w-[520px] mx-auto m-0 mb-8">
                {t("cta.body")}
              </p>
              <WaitlistForm />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter homeLabel={t("nav.home")} />
    </>
  );
}
