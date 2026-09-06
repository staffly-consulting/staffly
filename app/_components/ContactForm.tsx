"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowIcon, CheckIcon } from "./ui";
import FormField, { Honeypot, FormSuccess } from "./FormField";

type Status = "idle" | "submitting" | "success" | "error";

type Fields = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
};

const EMPTY: Fields = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
};

/**
 * Homepage booking form.
 *
 * Posts to /api/contact, which mails the team inbox. The visitor never has to
 * send anything themselves.
 */
export default function ContactForm() {
  const t = useTranslations("contact");
  const [form, setForm] = useState<Fields>(EMPTY);
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");

  const submitting = status === "submitting";

  const update =
    (field: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website }),
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          id="contact-first-name"
          label={t("firstName")}
          type="text"
          required
          autoComplete="given-name"
          disabled={submitting}
          value={form.firstName}
          onChange={update("firstName")}
        />
        <FormField
          id="contact-last-name"
          label={t("lastName")}
          type="text"
          required
          autoComplete="family-name"
          disabled={submitting}
          value={form.lastName}
          onChange={update("lastName")}
        />
      </div>

      <FormField
        id="contact-email"
        label={t("email")}
        type="email"
        required
        autoComplete="email"
        disabled={submitting}
        value={form.email}
        onChange={update("email")}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          id="contact-phone"
          label={t("phone")}
          type="tel"
          required
          autoComplete="tel"
          disabled={submitting}
          value={form.phone}
          onChange={update("phone")}
        />
        <FormField
          id="contact-company"
          label={t("companyOptional")}
          type="text"
          autoComplete="organization"
          disabled={submitting}
          value={form.company}
          onChange={update("company")}
        />
      </div>

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

      {status === "error" && (
        <p role="alert" className="m-0 text-center text-[13px] text-[#FFB4B4]">
          {t("errorBody")}
        </p>
      )}
    </form>
  );
}
