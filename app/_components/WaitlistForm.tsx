"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FONT_MONO, FONT_DISPLAY, ArrowIcon, CheckIcon } from "./ui";

type Status = "idle" | "submitting" | "success" | "error";

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

/** Form field styled for the dark CTA panel. Matches the homepage contact form. */
const Field = ({ label, id, ...rest }: FieldProps) => (
  <div className="flex flex-col gap-1.5">
    <label
      htmlFor={id}
      className={`text-[11px] font-medium uppercase tracking-[0.08em] text-white/70 ${FONT_MONO}`}
    >
      {label}
    </label>
    <input
      id={id}
      {...rest}
      className="h-12 rounded-lg border border-white/20 bg-white/10 px-4 text-[14.5px] text-white outline-none transition-all placeholder:text-white/40 hover:border-white/35 focus:border-(--blue) focus:bg-white/15 focus:ring-4 focus:ring-(--blue)/25 disabled:opacity-50 disabled:cursor-not-allowed"
    />
  </div>
);

/**
 * Early-access request form.
 *
 * Posts to /api/waitlist, which mails the team inbox. The visitor never has to
 * send anything themselves.
 */
export default function WaitlistForm() {
  const t = useTranslations("ats.cta");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState(""); // honeypot; real people leave this empty
  const [status, setStatus] = useState<Status>("idle");

  const submitting = status === "submitting";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setStatus("submitting");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role, company }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div
        role="status"
        className="mx-auto mt-6 flex max-w-xl flex-col items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.06] px-6 py-8 text-center"
      >
        <span
          aria-hidden="true"
          className="grid h-11 w-11 place-items-center rounded-full bg-(--blue) text-white"
        >
          <CheckIcon size={22} />
        </span>
        <p
          className={`${FONT_DISPLAY} m-0 text-[20px] font-semibold -tracking-[0.015em] text-white`}
        >
          {t("successTitle")}
        </p>
        <p className="m-0 text-[14.5px] leading-[1.55] text-white/70">
          {t("successBody")}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-2 flex max-w-xl flex-col gap-4 text-left"
    >
      <Field
        id="waitlist-email"
        label={t("emailLabel")}
        type="email"
        required
        autoComplete="email"
        disabled={submitting}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Field
        id="waitlist-role"
        label={t("roleLabel")}
        type="text"
        autoComplete="organization-title"
        disabled={submitting}
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />

      {/* Honeypot. Hidden from people and assistive tech, catnip for bots. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="waitlist-company">Company</label>
        <input
          id="waitlist-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-(--blue) px-6 text-[15px] font-medium text-white transition-all hover:bg-(--blue-600) hover:-translate-y-0.5 hover:shadow-[0_8px_22px_-10px_rgba(47,125,250,0.7)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
      >
        {submitting ? (
          t("submitting")
        ) : (
          <>
            {t("submit")} <ArrowIcon size={16} />
          </>
        )}
      </button>

      <p
        role="alert"
        className={`m-0 text-center text-[13px] ${
          status === "error" ? "text-[#FFB4B4]" : "text-white/55"
        }`}
      >
        {status === "error" ? t("errorBody") : t("note")}
      </p>
    </form>
  );
}
