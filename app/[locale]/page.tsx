"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "../_components/LanguageSwitcher";
import AtsProductCard from "../_components/ProductCard";

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
    href="#"
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

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & { label: string };

const Field = ({ label, ...rest }: FieldProps) => (
  <label className="flex flex-col gap-1.5">
    <span className={`text-[11px] font-medium uppercase tracking-[0.08em] text-white/70 ${FONT_MONO}`}>
      {label}
    </span>
    <input
      {...rest}
      className="h-12 rounded-lg border border-white/20 bg-white/10 px-4 text-[14.5px] text-white outline-none transition-all placeholder:text-white/40 hover:border-white/35 focus:border-(--blue) focus:bg-white/15 focus:ring-4 focus:ring-(--blue)/25"
    />
  </label>
);

const CONTACT_EMAIL = "marketing@stafflyconsulting.com";

type ContactForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
};

export default function Home() {
  const t = useTranslations();
  const [scrolled, setScrolled] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quoteFading, setQuoteFading] = useState(false);
  const [form, setForm] = useState<ContactForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
  });

  const updateField =
    (field: keyof ContactForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fullName = `${form.firstName} ${form.lastName}`.trim();
    const subject = t("contact.emailSubject", { name: fullName });
    const body = [
      `${t("contact.firstName")}: ${form.firstName}`,
      `${t("contact.lastName")}: ${form.lastName}`,
      `${t("contact.email")}: ${form.email}`,
      `${t("contact.phone")}: ${form.phone}`,
      `${t("contact.companyOptional")}: ${form.company || "—"}`,
    ].join("\n");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

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
    const id = setInterval(() => {
      setQuoteFading(true);
      setTimeout(() => {
        setQuoteIndex((i) => (i + 1) % 3);
        setQuoteFading(false);
      }, 220);
    }, 6000);
    return () => clearInterval(id);
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

  const goToQuote = (i: number) => {
    if (i === quoteIndex) return;
    setQuoteFading(true);
    setTimeout(() => {
      setQuoteIndex(i);
      setQuoteFading(false);
    }, 220);
  };

  const quoteKey = (`q${quoteIndex + 1}`) as "q1" | "q2" | "q3";

  // Orbiter node base classes
  const NODE =
    "absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-2.5 whitespace-nowrap rounded-[14px] border border-(--line) bg-white py-2.5 px-3.5 text-[12.5px] font-medium text-(--ink) shadow-[0_14px_30px_-18px_rgba(7,27,67,0.25)]";
  const NODE_ACCENT =
    "absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-2.5 whitespace-nowrap rounded-[14px] border border-(--blue) bg-(--blue) py-2.5 px-3.5 text-[12.5px] font-medium text-white shadow-[0_14px_30px_-18px_rgba(7,27,67,0.25)]";
  const AV =
    `inline-grid w-[22px] h-[22px] place-items-center rounded-full bg-[linear-gradient(135deg,#2F7DFA,#0B2A63)] text-white text-[10px] font-semibold ${FONT_MONO}`;
  const AV_ACCENT =
    `inline-grid w-[22px] h-[22px] place-items-center rounded-full bg-white text-(--blue) text-[10px] font-semibold ${FONT_MONO}`;

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
            <a href="#features" className="text-(--ink-2) text-[14.5px] font-medium transition-colors hover:text-(--navy)">{t("nav.platform")}</a>
            <a href="#customers" className="text-(--ink-2) text-[14.5px] font-medium transition-colors hover:text-(--navy)">{t("nav.customers")}</a>
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
              <a className={BTN.outline} href="#">
                {t("hero.ctaSecondary")}
              </a>
            </div>
            <div className="flex gap-7 items-center text-[13.5px] text-(--mute)">
              <span className="inline-flex items-center gap-2"><Tick />{t("hero.trial")}</span>
              <span className="inline-flex items-center gap-2"><Tick />{t("hero.noCard")}</span>
              <span className="inline-flex items-center gap-2"><Tick />{t("hero.soc")}</span>
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
              <div className={NODE}>
                <span className={AV}>ML</span>
                <div>
                  {t("orbiters.amara.name")}
                  <div className="text-(--mute) text-[11px] font-normal">{t("orbiters.amara.role")}</div>
                </div>
              </div>
            </div>
            <div id="o2" className="absolute left-1/2 top-1/2 w-0 h-0 [transform-origin:0_0]">
              <div className={NODE_ACCENT}>
                <span className={AV_ACCENT}>AS</span>
                <div>
                  {t("orbiters.jonas.name")}
                  <div className="text-white/75 text-[11px] font-normal">{t("orbiters.jonas.role")}</div>
                </div>
              </div>
            </div>
            <div id="o3" className="absolute left-1/2 top-1/2 w-0 h-0 [transform-origin:0_0]">
              <div className={NODE}>
                <span className={AV}>LN</span>
                <div>
                  {t("orbiters.sana.name")}
                  <div className="text-(--mute) text-[11px] font-normal">{t("orbiters.sana.role")}</div>
                </div>
              </div>
            </div>
            <div id="o4" className="absolute left-1/2 top-1/2 w-0 h-0 [transform-origin:0_0]">
              <div className={NODE}>
                <span className={AV}>BS</span>
                <div>
                  {t("orbiters.mateo.name")}
                  <div className="text-(--mute) text-[11px] font-normal">{t("orbiters.mateo.role")}</div>
                </div>
              </div>
            </div>
            <div id="o5" className="absolute left-1/2 top-1/2 w-0 h-0 [transform-origin:0_0]">
              <div className={NODE}>
                <span className={AV}>PS</span>
                <div>
                  {t("orbiters.lina.name")}
                  <div className="text-(--mute) text-[11px] font-normal">{t("orbiters.lina.role")}</div>
                </div>
              </div>
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
              { num: "payrollNum", title: "payrollTitle", desc: "payrollDesc", svg: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 10h18M8 4v4" /></> },
              { num: "peopleNum", title: "peopleTitle", desc: "peopleDesc", svg: <><circle cx="12" cy="8" r="3" /><path d="M4 20c1.4-4 4.4-6 8-6s6.6 2 8 6" /></> },
              { num: "analyticsNum", title: "analyticsTitle", desc: "analyticsDesc", svg: <><path d="M3 12l4-4 4 4 4-4 6 6" /><path d="M3 20h18" /></> },
              { num: "complianceNum", title: "complianceTitle", desc: "complianceDesc", svg: <><path d="M12 3l9 4-9 4-9-4 9-4z" /><path d="M3 12l9 4 9-4M3 17l9 4 9-4" /></> },
              { num: "timeNum", title: "timeTitle", desc: "timeDesc", svg: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" /></> },
              { num: "workflowsNum", title: "workflowsTitle", desc: "workflowsDesc", svg: <path d="M6 3v18M18 3v18M3 12h18" /> },
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

      {/* SPLIT */}
      <section className="relative py-[120px]">
        <div className={`${WRAP} grid grid-cols-2 gap-20 items-center max-[980px]:grid-cols-1`}>
          <div className="reveal">
            <span className={KICKER}>{t("collab.kicker")}</span>
            <h2 className={`${H2} mb-[22px]`}>{t("collab.title")}</h2>
            <p className="text-(--ink-2) text-[17px] m-0 mb-7 max-w-[480px]">{t("collab.desc")}</p>
            <ul className="list-none p-0 m-0 mb-8 flex flex-col gap-3.5">
              {[t("collab.bullet1"), t("collab.bullet2"), t("collab.bullet3")].map((b, i) => (
                <li key={i} className="flex gap-3.5 items-start text-[15px] text-(--ink)">
                  <span className="text-(--blue) flex-none mt-0.5">
                    <CheckIcon size={18} strokeWidth={2} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
            <a href="#" className={BTN.primary}>
              {t("collab.cta")} <ArrowIcon />
            </a>
          </div>

          <div className="reveal border border-(--line) rounded-[22px] bg-white overflow-hidden shadow-[0_40px_80px_-40px_rgba(11,42,99,0.25)]">
            <div className="flex items-center gap-1.5 py-3 px-3.5 border-b border-(--line) bg-(--bg-soft)">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D9DFEC]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#D9DFEC]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#D9DFEC]" />
              <span className={`ml-3.5 ${FONT_MONO} text-[11px] text-(--mute) bg-white border border-(--line) rounded-md py-1 px-2.5`}>
                app.staffly.com/overview
              </span>
            </div>
            <div className="p-[22px] grid grid-cols-2 gap-3.5">
              <div className="border border-(--line) rounded-xl p-3.5">
                <div className={`${FONT_MONO} text-[11px] text-(--mute) uppercase tracking-[0.08em]`}>
                  {t("collab.mockupHeadcount")}
                </div>
                <div className={`${FONT_DISPLAY} text-[28px] font-semibold text-(--navy-900) -tracking-[0.02em] mt-1.5`}>1,284</div>
                <div className="text-[11px] text-[#1E9D6B] mt-1">{t("collab.mockupHeadcountDelta")}</div>
              </div>
              <div className="border border-(--line) rounded-xl p-3.5">
                <div className={`${FONT_MONO} text-[11px] text-(--mute) uppercase tracking-[0.08em]`}>
                  {t("collab.mockupRunRate")}
                </div>
                <div className={`${FONT_DISPLAY} text-[28px] font-semibold text-(--navy-900) -tracking-[0.02em] mt-1.5`}>$12.4M</div>
                <div className="text-[11px] text-[#1E9D6B] mt-1">{t("collab.mockupRunRateDelta")}</div>
              </div>
              <div className="col-span-full border border-(--line) rounded-xl p-3.5">
                <div className={`${FONT_MONO} text-[11px] text-(--mute) uppercase tracking-[0.08em]`}>
                  {t("collab.mockupNewHires")}
                </div>
                <div className="flex gap-1.5 items-end h-[70px] mt-3 [&>span]:flex-1 [&>span]:bg-(--blue) [&>span]:rounded-[3px] [&>span]:opacity-20 [&>span.mid]:opacity-60 [&>span.on]:opacity-100">
                  <span /><span className="mid" /><span /><span className="on" />
                  <span className="mid" /><span className="on" /><span className="on" />
                  <span className="mid" /><span className="on" /><span />
                  <span className="mid" /><span className="on" />
                </div>
              </div>
            </div>
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

      {/* TESTIMONIAL */}
      <section id="customers" className="relative py-[120px] bg-(--bg-soft)">
        <div className={`${WRAP} max-w-[860px] mx-auto text-center reveal`}>
          <span className={KICKER}>{t("testimonials.kicker")}</span>
          <p
            className={`${FONT_DISPLAY} font-medium text-[clamp(26px,2.6vw,36px)] leading-[1.25] -tracking-[0.02em] text-(--navy-900) m-0 mb-8 transition-opacity duration-200`}
            style={{ opacity: quoteFading ? 0 : 1 }}
          >
            {t(`testimonials.${quoteKey}Text`)}
          </p>
          <div className="inline-flex items-center gap-3.5">
            <span className={`grid w-11 h-11 place-items-center rounded-full bg-[linear-gradient(135deg,#2F7DFA,#0B2A63)] text-white font-semibold ${FONT_MONO} text-[13px]`}>
              {quoteIndex === 0 ? "EM" : quoteIndex === 1 ? "DK" : "SO"}
            </span>
            <div className="text-left">
              <b className="block text-[14px] text-(--navy-900) font-semibold">{t(`testimonials.${quoteKey}Name`)}</b>
              <span className="text-[13px] text-(--mute)">{t(`testimonials.${quoteKey}Role`)}</span>
            </div>
          </div>
          <div className="flex gap-2 justify-center mt-9">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                aria-label={`Quote ${i + 1}`}
                onClick={() => goToQuote(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === quoteIndex ? "w-[22px] bg-(--navy)" : "w-1.5 bg-(--line-2)"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="relative py-[140px] text-center">
        <div className={WRAP}>
          <div className="reveal max-w-[880px] mx-auto rounded-[28px] py-20 px-10 bg-(--navy-900) text-white relative overflow-hidden before:content-[''] before:absolute before:-inset-px before:rounded-[28px] before:pointer-events-none before:bg-[radial-gradient(circle_at_15%_20%,rgba(47,125,250,0.4),transparent_35%),radial-gradient(circle_at_85%_90%,rgba(47,125,250,0.25),transparent_40%)] [&>*]:relative">
            <span className={`${KICKER} !text-[#7FB0FF]`}>{t("ctaSection.kicker")}</span>
            <h2 className={`${H2} !text-white mb-[18px]`}>{t("ctaSection.title")}</h2>
            <p className="text-white/70 text-[17px] max-w-[520px] mx-auto m-0 mb-8">{t("ctaSection.desc")}</p>
            <form onSubmit={handleSubmit} className="mx-auto mt-2 flex max-w-xl flex-col gap-4 text-left">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label={t("contact.firstName")} type="text" required autoComplete="given-name" value={form.firstName} onChange={updateField("firstName")} />
                <Field label={t("contact.lastName")} type="text" required autoComplete="family-name" value={form.lastName} onChange={updateField("lastName")} />
              </div>
              <Field label={t("contact.email")} type="email" required autoComplete="email" value={form.email} onChange={updateField("email")} />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label={t("contact.phone")} type="tel" required autoComplete="tel" value={form.phone} onChange={updateField("phone")} />
                <Field label={t("contact.companyOptional")} type="text" autoComplete="organization" value={form.company} onChange={updateField("company")} />
              </div>
              <button
                type="submit"
                className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-(--blue) px-6 text-[15px] font-medium text-white transition-all hover:bg-(--blue-600) hover:-translate-y-0.5 hover:shadow-[0_8px_22px_-10px_rgba(47,125,250,0.7)]"
              >
                {t("contact.submit")} <ArrowIcon size={16} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 pt-16 pb-10 border-t border-(--line)">
        <div className={WRAP}>
          <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr] gap-10 max-[980px]:grid-cols-1">
            <div>
              <Brand />
              <p className="text-(--mute) text-[13.5px] mt-3.5 max-w-[280px]">{t("footer.tagline")}</p>
            </div>
            {[
              { heading: "product", links: ["productPayroll", "productPeople", "productCompliance", "productAnalytics"] },
              { heading: "company", links: ["companyAbout", "companyCareers", "companyPress", "companyContact"] },
              { heading: "resources", links: ["resourcesDocs", "resourcesChangelog", "resourcesStatus", "resourcesSecurity"] },
            ].map((col) => (
              <div key={col.heading}>
                <h4 className={`${FONT_DISPLAY} text-[13px] font-semibold uppercase tracking-[0.1em] text-(--navy-900) m-0 mb-4`}>
                  {t(`footer.${col.heading}` as never)}
                </h4>
                <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
                  {col.links.map((k) => (
                    <li key={k}>
                      <a href="#" className="text-[14px] text-(--ink-2) hover:text-(--navy)">
                        {t(`footer.${k}` as never)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-14 pt-6 border-t border-(--line) flex justify-between items-center text-[13px] text-(--mute)">
            <span>{t("footer.copyright")}</span>
            <span>{t("footer.tagline2")}</span>
          </div>
        </div>
      </footer>
    </>
  );
}
