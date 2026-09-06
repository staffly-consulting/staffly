import { Resend } from "resend";

/**
 * Early-access waitlist endpoint.
 *
 * Sends the request straight to the team inbox. Nothing is persisted yet, so
 * the mail provider is the system of record for now.
 */

// Where the notification lands, and who it comes from.
// WAITLIST_FROM must be on a domain verified in Resend. Until
// stafflyconsulting.com is verified there, Resend's shared sender works for
// testing.
const TO = process.env.WAITLIST_TO ?? "marketing@stafflyconsulting.com";
const FROM = process.env.WAITLIST_FROM ?? "Staffly ATS+ <onboarding@resend.dev>";

const MAX_EMAIL = 254; // RFC 5321
const MAX_ROLE = 500;

// Deliberately permissive: real validation is the confirmation reply landing.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeHtml = (s: string) =>
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

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_body" }, { status: 400 });
  }

  const { email, role, company } = (body ?? {}) as Record<string, unknown>;

  // Honeypot: a real person never sees this field, so anything in it is a bot.
  // Answer 200 so the bot has no signal that it was rejected.
  if (typeof company === "string" && company.trim() !== "") {
    return Response.json({ ok: true });
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email.trim()) || email.length > MAX_EMAIL) {
    return Response.json({ error: "invalid_email" }, { status: 400 });
  }

  const cleanEmail = email.trim();
  const cleanRole =
    typeof role === "string" ? role.trim().slice(0, MAX_ROLE) : "";

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Misconfiguration, not a user error. Make it loud in the logs so a silently
    // dropped lead is impossible to miss.
    console.error(
      `[waitlist] RESEND_API_KEY is not set; lead NOT sent: ${cleanEmail} | role: ${cleanRole || "(none)"}`,
    );
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  const submittedAt = new Date().toISOString();

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: cleanEmail, // so you can just hit reply
      subject: `Staffly ATS+ early access - ${cleanEmail}`,
      text: [
        "New early-access request for Staffly ATS+.",
        "",
        `Email:          ${cleanEmail}`,
        `What they hire: ${cleanRole || "(not given)"}`,
        `Submitted:      ${submittedAt}`,
      ].join("\n"),
      html: [
        "<h2>New early-access request for Staffly ATS+</h2>",
        "<table cellpadding='6' style='border-collapse:collapse;font-family:system-ui,sans-serif;font-size:14px'>",
        `<tr><td><strong>Email</strong></td><td><a href="mailto:${escapeHtml(cleanEmail)}">${escapeHtml(cleanEmail)}</a></td></tr>`,
        `<tr><td><strong>What they hire for</strong></td><td>${cleanRole ? escapeHtml(cleanRole) : "<em>not given</em>"}</td></tr>`,
        `<tr><td><strong>Submitted</strong></td><td>${escapeHtml(submittedAt)}</td></tr>`,
        "</table>",
      ].join(""),
    });

    if (error) {
      console.error(
        `[waitlist] Resend rejected the send; lead NOT delivered: ${cleanEmail} | role: ${cleanRole || "(none)"} | ${JSON.stringify(error)}`,
      );
      return Response.json({ error: "send_failed" }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch (err) {
    // Log the address so the lead is recoverable from logs even when mail fails.
    console.error(
      `[waitlist] send threw; lead NOT delivered: ${cleanEmail} | role: ${cleanRole || "(none)"} | ${String(err)}`,
    );
    return Response.json({ error: "send_failed" }, { status: 502 });
  }
}
