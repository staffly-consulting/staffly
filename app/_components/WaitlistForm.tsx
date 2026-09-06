"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowIcon, CheckIcon } from "./ui";
import FormField, { Honeypot, FormSuccess } from "./FormField";

type Status = "idle" | "submitting" | "success" | "error";

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
  const [website, setWebsite] = useState(""); // honeypot
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
        body: JSON.stringify({ email, role, website }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <FormSuccess
        title={t("successTitle")}
        body={t("successBody")}
        icon={<CheckIcon size={22} />}
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-2 flex max-w-xl flex-col gap-4 text-left"
    >
      <FormField
        id="waitlist-email"
        label={t("emailLabel")}
        type="email"
        required
        autoComplete="email"
        disabled={submitting}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <FormField
        id="waitlist-role"
        label={t("roleLabel")}
        type="text"
        autoComplete="organization-title"
        disabled={submitting}
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />

      <Honeypot value={website} onChange={setWebsite} />

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
