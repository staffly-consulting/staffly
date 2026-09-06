import { Resend } from "resend";

/**
 * Shared mail plumbing for the site's forms.
 *
 * Both the homepage booking form and the ATS+ waitlist post to a route handler
 * that calls `sendFormNotification`. Nothing is persisted, so the mail provider
 * is the system of record - which is why every failure path logs the submitted
 * values, so a lead stays recoverable from the logs.
 */

// WAITLIST_FROM must be on a domain verified in Resend. Until
// stafflyconsulting.com is verified there, Resend's shared sender works for
// testing.
const TO = process.env.WAITLIST_TO ?? "marketing@stafflyconsulting.com";
const FROM = process.env.WAITLIST_FROM ?? "Staffly <onboarding@resend.dev>";

export const MAX_EMAIL = 254; // RFC 5321
export const MAX_FIELD = 500;

// Deliberately permissive: real validation is the reply landing.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length <= MAX_EMAIL && EMAIL_RE.test(v.trim());

/** Trim and cap an optional free-text field. Non-strings become "". */
export const clean = (v: unknown, max = MAX_FIELD) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c]!,
  );

export type Row = { label: string; value: string };

export type SendResult = { ok: true } | { ok: false; status: 502 | 503 };

/** Flatten rows into one log-safe line so a failed lead is still recoverable. */
const summarize = (rows: Row[]) =>
  rows.map((r) => `${r.label}: ${r.value || "(none)"}`).join(" | ");

export async function sendFormNotification({
  kind,
  subject,
  replyTo,
  heading,
  rows,
}: {
  kind: string;
  subject: string;
  replyTo: string;
  heading: string;
  rows: Row[];
}): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey) {
    // Misconfiguration, not a user error. Log which related variable NAMES the
    // runtime can see (never their values) so this is diagnosable from logs.
    const seen = Object.keys(process.env)
      .filter((k) => /RESEND|WAITLIST/i.test(k))
      .sort();
    console.error(
      `[${kind}] RESEND_API_KEY missing at runtime; lead NOT sent: ${summarize(rows)} | ` +
        `matching env names visible: ${seen.length ? seen.join(", ") : "(none)"} | ` +
        `VERCEL_ENV=${process.env.VERCEL_ENV ?? "(unset)"}`,
    );
    return { ok: false, status: 503 };
  }

  const submittedAt = new Date().toISOString();
  const allRows: Row[] = [...rows, { label: "Submitted", value: submittedAt }];

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo, // so you can just hit reply
      subject,
      text: [
        heading,
        "",
        ...allRows.map((r) => `${r.label}: ${r.value || "(not given)"}`),
      ].join("\n"),
      html: [
        `<h2>${escapeHtml(heading)}</h2>`,
        "<table cellpadding='6' style='border-collapse:collapse;font-family:system-ui,sans-serif;font-size:14px'>",
        ...allRows.map(
          (r) =>
            `<tr><td><strong>${escapeHtml(r.label)}</strong></td><td>${
              r.value ? escapeHtml(r.value) : "<em>not given</em>"
            }</td></tr>`,
        ),
        "</table>",
      ].join(""),
    });

    if (error) {
      // from/to are the two things most likely misconfigured, so name them here
      // rather than making someone cross-reference the env panel.
      console.error(
        `[${kind}] Resend rejected the send; lead NOT delivered: ${summarize(rows)} | ` +
          `from="${FROM}" to="${TO}" | ${JSON.stringify(error)}`,
      );
      return { ok: false, status: 502 };
    }

    return { ok: true };
  } catch (err) {
    console.error(
      `[${kind}] send threw; lead NOT delivered: ${summarize(rows)} | ` +
        `from="${FROM}" to="${TO}" | ${String(err)}`,
    );
    return { ok: false, status: 502 };
  }
}
