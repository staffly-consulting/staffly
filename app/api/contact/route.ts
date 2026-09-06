import { clean, isValidEmail, sendFormNotification } from "@/lib/mail";

/** Booking / contact form in the homepage CTA section. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_body" }, { status: 400 });
  }

  const { firstName, lastName, email, phone, company, website } = (body ??
    {}) as Record<string, unknown>;

  // Honeypot. Named `website` rather than `company` because this form has a
  // real company field.
  if (typeof website === "string" && website.trim() !== "") {
    return Response.json({ ok: true });
  }

  if (!isValidEmail(email)) {
    return Response.json({ error: "invalid_email" }, { status: 400 });
  }

  const first = clean(firstName, 100);
  const last = clean(lastName, 100);
  const phoneNumber = clean(phone, 50);

  if (!first || !last || !phoneNumber) {
    return Response.json({ error: "missing_fields" }, { status: 400 });
  }

  const cleanEmail = email.trim();
  const fullName = `${first} ${last}`.trim();

  const result = await sendFormNotification({
    kind: "contact",
    subject: `Staffly booking request - ${fullName}`,
    replyTo: cleanEmail,
    heading: "New booking request from the Staffly site",
    rows: [
      { label: "Name", value: fullName },
      { label: "Email", value: cleanEmail },
      { label: "Phone", value: phoneNumber },
      { label: "Company", value: clean(company, 200) },
    ],
  });

  return result.ok
    ? Response.json({ ok: true })
    : Response.json(
        { error: result.status === 503 ? "not_configured" : "send_failed" },
        { status: result.status },
      );
}
