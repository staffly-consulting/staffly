"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "../_components/LanguageSwitcher";
import AtsProductCard from "../_components/ProductCard";
import ContactForm from "../_components/ContactForm";
import SiteFooter from "../_components/SiteFooter";

const WRAP = "mx-auto w-full max-w-[1200px] px-8";

const FONT_DISPLAY = "font-display";
const FONT_MONO = "font-mono";

const KICKER =
  "inline-block mb-3.5 font-mono text-[12px] tracking-[0.12em] uppercase text-(--blue)";

const LEDE = "m-0 text-[17px] text-(--ink-2)";

const H2 =
  "font-display font-semibold text-[clamp(34px,3.6vw,48px)] leading-[1.05] -tracking-[0.03em] text-(--navy-900) m-0 mb-[18px]";

const SECTION_HEAD = "max-w-[720px] mx-auto mb-14 text-center";

const BTN_BASE =
  "inline-flex items-center gap-2 h-[42px] px-[18px] rounded-full text-[14px] font-medium -tracking-[0.005em] transition-all duration-200";

const BTN = {
  ghost: `${BTN_BASE} text-(--ink) hover:text-(--navy)`,
  primary: `${BTN_BASE} bg-(--navy) text-white hover:bg-(--navy-900) hover:-translate-y-px hover:shadow-[0_8px_22px_-10px_rgba(11,42,99,0.55)]`,
  accent: `${BTN_BASE} bg-(--blue) text-white hover:bg-(--blue-600) hover:-translate-y-px hover:shadow-[0_8px_22px_-10px_rgba(47,125,250,0.7)]`,
  outline: `${BTN_BASE} border border-(--line-2) text-(--ink) hover:border-(--navy) hover:text-(--navy)`,
};

const BrandMark = () => (
  <span
    aria-hidden="true"
    className="inline-grid place-items-center transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:-rotate-6"
  >
    <Image
      src="/logo.png"
      alt=""
      width={130}
      height={60}
      className="w-full h-full object-contain"
      priority
    />
  </span>
);

const Brand = () => (
  <a
    href="#nav"
    className={`group inline-flex items-center gap-2.5 ${FONT_DISPLAY} font-semibold text-[18px] -tracking-[0.018em] text-(--navy-900)`}
  >
    <BrandMark />
  </a>
);

const ArrowIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

const CheckIcon = ({ size = 16, strokeWidth = 2.2 }: { size?: number; strokeWidth?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
    <path d="M5 12l5 5L20 7" />
  </svg>
);

const Tick = () => (
  <span className="inline-grid w-3.5 h-3.5 rounded-full bg-(--navy) place-items-center flex-none after:content-[''] after:w-1.5 after:h-[3px] after:border-l-[1.5px] after:border-b-[1.5px] after:border-white after:-rotate-45 after:-mt-0.5" />
);

export default function Home() {
  const t = useTranslations();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
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
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const viz = document.getElementById("viz");
    if (!viz) return;
    const orbiters = [
      { id: "o1", r: 0.46, speed: 0.12, phase: 0 },
      { id: "o2", r: 0.38, speed: -0.18, phase: 1.1 },
      { id: "o3", r: 0.48, speed: 0.1, phase: 2.3 },
      { id: "o4", r: 0.4, speed: -0.14, phase: 3.6 },
      { id: "o5", r: 0.34, speed: 0.2, phase: 4.8 },
    ];
    const sigs = [
      { id: "sig1", r: 0.46, speed: 0.5, phase: 0, loop: 3.2 },
      { id: "sig2", r: 0.4, speed: 0.6, phase: 1.5, loop: 2.8 },
      { id: "sig3", r: 0.48, speed: 0.55, phase: 3.2, loop: 3.5 },
    ];
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const tt = (now - t0) / 1000;
      const size = viz.clientWidth;
      const half = size / 2;
      orbiters.forEach((o) => {
        const el = document.getElementById(o.id);
        if (!el) return;
        const angle = o.phase + tt * o.speed;
        const x = Math.cos(angle) * half * o.r;
        const y = Math.sin(angle) * half * o.r;
        el.style.transform = `translate(${x}px,${y}px)`;
      });
      sigs.forEach((s) => {
        const el = document.getElementById(s.id);
        if (!el) return;
        const phase = (tt * s.speed + s.phase) % s.loop;
        const p = phase / s.loop;
        const angle = s.phase * 1.7;
        const dist = p * half * s.r;
        const x = Math.cos(angle) * dist;
        const y = Math.sin(angle) * dist;
        el.style.opacity = String(Math.max(0, 1 - p));
        el.style.transform = `translate(${x}px,${y}px) scale(${1 - p * 0.4})`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Orbiter node base classes
  const NODE =
    "absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-[14px] border border-(--line) bg-white py-2.5 px-3.5 text-[12.5px] font-medium text-(--ink) shadow-[0_14px_30px_-18px_rgba(7,27,67,0.25)]";
  const NODE_ACCENT =
    "absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-[14px] border border-(--blue) bg-(--blue) py-2.5 px-3.5 text-[12.5px] font-medium text-white shadow-[0_14px_30px_-18px_rgba(7,27,67,0.25)]";

  return (
    <>
      {/* NAV */}
      <nav
        id="nav"
        className={`fixed top-0 left-0 right-0 z-[100] backdrop-blur-[14px] border-b transition-all duration-300 ${
          scrolled ? "bg-white/[0.92] border-(--line)" : "bg-white/[0.72] border-transparent"
        }`}
      >
        <div className={`${WRAP} flex items-center justify-between transition-all duration-300 ${scrolled ? "h-[62px]" : "h-[72px]"}`}>
          <Brand />
          <div className="flex items-center gap-9 max-[980px]:hidden">
            <a href="#features" className="text-(--ink-2) text-[14.5px] font-medium transition-colors hover:text-(--navy)">{t("nav.services")}</a>
            <a href="#how" className="text-(--ink-2) text-[14.5px] font-medium transition-colors hover:text-(--navy)">{t("nav.how")}</a>
            <Link href="/products/ats" className="text-(--ink-2) text-[14.5px] font-medium transition-colors hover:text-(--navy)">{t("nav.product")}</Link>
          </div>
          <div className="flex items-center gap-3.5">
            <LanguageSwitcher />
            <a className={`${BTN.primary} max-[560px]:hidden`} href="#cta">
              {t("nav.startFree")} <ArrowIcon />
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="relative pt-[140px] pb-[90px] overflow-hidden max-[980px]:pt-[110px]">
        <div className={`${WRAP} grid grid-cols-[1.05fr_1fr] gap-[72px] items-center max-[980px]:grid-cols-1`}>
          <div>
            <span className={`inline-flex items-center gap-2.5 ${FONT_MONO} text-[12px] tracking-[0.08em] uppercase text-(--ink-2) py-1.5 px-3 border border-(--line) rounded-full bg-white`}>
              <span className="w-1.5 h-1.5 rounded-full bg-(--blue) shadow-[0_0_0_4px_rgba(47,125,250,0.18)]" />
              {t("hero.eyebrow")}
            </span>
            <h1 className={`${FONT_DISPLAY} font-semibold text-[clamp(44px,5.2vw,72px)] leading-[1.02] -tracking-[0.035em] my-[22px] text-(--navy-900) [&_em]:not-italic [&_em]:text-(--blue) [&_em]:relative`}>
              {t.rich("hero.title", { em: (chunks) => <em>{chunks}</em> })}
            </h1>
            <p className="text-[18px] leading-[1.55] text-(--ink-2) max-w-[520px] m-0 mb-8">{t("hero.subtitle")}</p>
            <div className="flex gap-3 items-center mb-[42px]">
              <a className={BTN.accent} href="#cta">
                {t("hero.ctaPrimary")} <ArrowIcon />
              </a>
              <a className={BTN.outline} href="#features">
                {t("hero.ctaSecondary")}
              </a>
            </div>
            <div className="flex gap-7 items-center text-[13.5px] text-(--mute)">
              <span className="inline-flex items-center gap-2"><Tick />{t("hero.point1")}</span>
              <span className="inline-flex items-center gap-2"><Tick />{t("hero.point2")}</span>
              <span className="inline-flex items-center gap-2"><Tick />{t("hero.point3")}</span>
            </div>
          </div>

          <div id="viz" className="relative aspect-square grid place-items-center max-[980px]:w-full max-[980px]:max-w-[460px] max-[980px]:mx-auto">
            <div className="absolute inset-0 rounded-full border border-dashed border-[rgba(11,42,99,0.16)]" />
            <div className="absolute inset-[12%] rounded-full border border-solid border-[rgba(11,42,99,0.08)]" />
            <div className="absolute inset-[28%] rounded-full border border-dashed border-[rgba(47,125,250,0.22)]" />

            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-[1] [&>path]:fill-none [&>path]:stroke-[rgba(47,125,250,0.35)] [&>path]:[stroke-width:1] [&>path]:[stroke-dasharray:4_6] [&>path]:animate-[line-dash_8s_linear_infinite]"
              viewBox="0 0 500 500"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M250 250 L 90 120" />
              <path d="M250 250 L 410 120" />
              <path d="M250 250 L 420 300" />
              <path d="M250 250 L 80 320" />
              <path d="M250 250 L 250 80" />
              <path d="M250 250 L 190 430" />
              <path d="M250 250 L 330 430" />
            </svg>

            <div
              aria-hidden="true"
              className="absolute w-[22%] aspect-square rounded-full bg-(--navy) text-white grid place-items-center z-[3] shadow-[0_30px_60px_-25px_rgba(11,42,99,0.55),inset_0_0_0_6px_rgba(255,255,255,0.06)] before:content-[''] before:absolute before:-inset-3 before:rounded-full before:border before:border-[rgba(47,125,250,0.35)] before:animate-[pulse-ring_3s_ease-out_infinite] after:content-[''] after:absolute after:-inset-6 after:rounded-full after:border after:border-[rgba(47,125,250,0.18)] after:animate-[pulse-ring_3s_ease-out_1.5s_infinite] [&>svg]:w-[44%] [&>svg]:h-[44%]"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <circle cx="12" cy="8" r="3.2" />
                <path d="M5 20c1.2-3.4 4-5 7-5s5.8 1.6 7 5" />
              </svg>
            </div>

            <div id="o1" className="absolute left-1/2 top-1/2 w-0 h-0 [transform-origin:0_0]">
              <div className={NODE}>{t("nodes.n1")}</div>
            </div>
            <div id="o2" className="absolute left-1/2 top-1/2 w-0 h-0 [transform-origin:0_0]">
              <div className={NODE_ACCENT}>{t("nodes.n2")}</div>
            </div>
            <div id="o3" className="absolute left-1/2 top-1/2 w-0 h-0 [transform-origin:0_0]">
              <div className={NODE}>{t("nodes.n3")}</div>
            </div>
            <div id="o4" className="absolute left-1/2 top-1/2 w-0 h-0 [transform-origin:0_0]">
              <div className={NODE}>{t("nodes.n4")}</div>
            </div>
            <div id="o5" className="absolute left-1/2 top-1/2 w-0 h-0 [transform-origin:0_0]">
              <div className={NODE}>{t("nodes.n5")}</div>
            </div>
            <div id="sig1" className="absolute left-1/2 top-1/2 w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-(--blue) shadow-[0_0_12px_var(--blue)] z-[2]" />
            <div id="sig2" className="absolute left-1/2 top-1/2 w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-(--blue) shadow-[0_0_12px_var(--blue)] z-[2]" />
            <div id="sig3" className="absolute left-1/2 top-1/2 w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-(--blue) shadow-[0_0_12px_var(--blue)] z-[2]" />
          </div>
        </div>
      </header>

      {/* FEATURES */}
      <section id="features" className="relative py-[110px] bg-(--bg-soft)">
        <div className={WRAP}>
          <div className={`${SECTION_HEAD} reveal`}>
            <span className={KICKER}>{t("features.kicker")}</span>
            <h2 className={H2}>{t("features.title")}</h2>
            <p className={LEDE}>{t("features.lede")}</p>
          </div>

          <div className="grid grid-cols-3 gap-px bg-(--line) border border-(--line) rounded-[22px] overflow-hidden reveal max-[980px]:grid-cols-1">
            {[
              { num: "corporateNum", title: "corporateTitle", desc: "corporateDesc", svg: <><path d="M3 21h18" /><path d="M5 21V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v16" /><path d="M13 9h5a1 1 0 0 1 1 1v11" /><path d="M8 8h2M8 12h2M8 16h2M16 13h1M16 17h1" /></> },
              { num: "boiNum", title: "boiTitle", desc: "boiDesc", svg: <><circle cx="12" cy="9" r="5" /><path d="M9 13.4 8 21l4-2 4 2-1-7.6" /></> },
              { num: "immigrationNum", title: "immigrationTitle", desc: "immigrationDesc", svg: <><rect x="5" y="3" width="14" height="18" rx="2" /><circle cx="12" cy="9" r="2.5" /><path d="M8.5 15.5h7" /></> },
              { num: "hrNum", title: "hrTitle", desc: "hrDesc", svg: <><circle cx="9" cy="8" r="3" /><path d="M2 20c1.2-3.4 3.7-5 7-5s5.8 1.6 7 5" /><path d="M16 5.2a3 3 0 0 1 0 5.6" /></> },
              { num: "payrollNum", title: "payrollTitle", desc: "payrollDesc", svg: <><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /><path d="M6 10v4M18 10v4" /></> },
              { num: "adminNum", title: "adminTitle", desc: "adminDesc", svg: <><rect x="6" y="4" width="12" height="17" rx="2" /><path d="M9 4V3h6v1" /><path d="M9.5 10h5M9.5 14h5" /></> },
            ].map((c) => (
              <div
                key={c.num}
                className="bg-white py-9 px-8 min-h-[260px] flex flex-col justify-between transition-colors duration-300 hover:bg-[#FAFBFE]"
              >
                <div className="grid w-10 h-10 place-items-center rounded-[10px] bg-(--bg-navy-soft) text-(--navy)">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    {c.svg}
                  </svg>
                </div>
                <div className={`${FONT_MONO} text-[11px] text-(--mute) m-0`}>{t(`features.${c.num}` as never)}</div>
                <h3 className={`${FONT_DISPLAY} font-semibold text-[20px] -tracking-[0.015em] mt-6 mb-2 text-(--navy-900)`}>
                  {t(`features.${c.title}` as never)}
                </h3>
                <p className="text-(--ink-2) text-[14.5px] leading-[1.55] m-0">{t(`features.${c.desc}` as never)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section id="how" className="relative py-[120px] scroll-mt-[72px]">
        <div className={`${WRAP} grid grid-cols-2 gap-20 items-center max-[980px]:grid-cols-1`}>
          <div className="reveal">
            <span className={KICKER}>{t("how.kicker")}</span>
            <h2 className={`${H2} mb-[22px]`}>{t("how.title")}</h2>
            <p className="text-(--ink-2) text-[17px] m-0 mb-7 max-w-[480px]">{t("how.desc")}</p>
            <ul className="list-none p-0 m-0 mb-8 flex flex-col gap-3.5">
              {[t("how.bullet1"), t("how.bullet2"), t("how.bullet3")].map((b, i) => (
                <li key={i} className="flex gap-3.5 items-start text-[15px] text-(--ink)">
                  <span className="text-(--blue) flex-none mt-0.5">
                    <CheckIcon size={18} strokeWidth={2} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
            <a href="#cta" className={BTN.primary}>
              {t("how.cta")} <ArrowIcon />
            </a>
          </div>

          <div className="reveal border border-(--line) rounded-[22px] bg-white overflow-hidden shadow-[0_40px_80px_-40px_rgba(11,42,99,0.25)]">
            <div className="border-b border-(--line) bg-(--bg-soft) py-4 px-6">
              <span className={`${FONT_MONO} text-[11px] uppercase tracking-[0.1em] text-(--mute)`}>
                {t("how.panelTitle")}
              </span>
            </div>
            <ul className="list-none m-0 p-6 flex flex-col gap-4">
              {(["p1", "p2", "p3", "p4", "p5", "p6"] as const).map((k) => (
                <li key={k} className="flex gap-3 items-start text-[14.5px] text-(--ink)">
                  <span className="text-(--blue) flex-none mt-0.5">
                    <CheckIcon size={17} strokeWidth={2} />
                  </span>
                  {t(`how.${k}` as never)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="relative py-[110px] text-center">
        <div className={WRAP}>
          <div className={`${SECTION_HEAD} reveal`}>
            <span className={KICKER}>{t("products.kicker")}</span>
            <h2 className={H2}>{t("products.title")}</h2>
            <p className={LEDE}>{t("products.lede")}</p>
          </div>
          {/* One product for now. Widen to a grid as more ship. */}
          <ul className="list-none p-0 m-0 mx-auto grid max-w-[420px] gap-5 text-left reveal">
            <li>
              <AtsProductCard />
            </li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="relative py-[140px] text-center">
        <div className={WRAP}>
          <div className="reveal max-w-[880px] mx-auto rounded-[28px] py-20 px-10 bg-(--navy-900) text-white relative overflow-hidden before:content-[''] before:absolute before:-inset-px before:rounded-[28px] before:pointer-events-none before:bg-[radial-gradient(circle_at_15%_20%,rgba(47,125,250,0.4),transparent_35%),radial-gradient(circle_at_85%_90%,rgba(47,125,250,0.25),transparent_40%)] [&>*]:relative">
            <span className={`${KICKER} !text-[#7FB0FF]`}>{t("ctaSection.kicker")}</span>
            <h2 className={`${H2} !text-white mb-[18px]`}>{t("ctaSection.title")}</h2>
            <p className="text-white/70 text-[17px] max-w-[520px] mx-auto m-0 mb-8">{t("ctaSection.desc")}</p>
            <ContactForm />
          </div>
        </div>
      </section>

      <SiteFooter homeLabel={t("nav.home")} />

    </>
  );
}
