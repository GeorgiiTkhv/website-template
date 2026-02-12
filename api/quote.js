const nodemailer = require("nodemailer");

function must(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function createTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error("Missing GMAIL_USER or GMAIL_APP_PASSWORD in env.");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

function getAllowedOrigins() {
  return (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

module.exports = async (req, res) => {
  const origin = req.headers.origin;
  const allowed = getAllowedOrigins();

  // CORS headers (basic)
  if (allowed.length === 0) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  } else if (origin && allowed.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  // If you configured ALLOWED_ORIGINS, block others
  if (allowed.length > 0 && origin && !allowed.includes(origin)) {
    return res.status(403).json({ ok: false, error: "CORS blocked origin: " + origin });
  }

  try {
    const { formType, name, email, phone, zip, service, message } = req.body || {};

    if (!must(name) || !must(phone) || !must(zip)) {
      return res.status(400).json({ ok: false, error: "Missing required fields: name, phone, zip." });
    }

    const toEmail = process.env.TO_EMAIL || process.env.GMAIL_USER;
    const fromLabel = process.env.FROM_LABEL || "Website Quotes";
    const subjectPrefix = process.env.SUBJECT_PREFIX || "New Quote";
    const subject = `${subjectPrefix} — ${name}${formType ? ` (${formType})` : ""}`;

    const text = [
      `New quote submission`,
      ``,
      `Form: ${formType || "unknown"}`,
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Zip: ${zip}`,
      email ? `Email: ${email}` : null,
      service ? `Service: ${service}` : null,
      message ? `` : null,
      message ? `Message:` : null,
      message ? message : null,
      ``,
      `Sent from: ${req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown"}`,
    ]
      .filter(Boolean)
      .join("\n");

    await createTransporter().sendMail({
      from: `"${fromLabel}" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject,
      text,
      replyTo: email || undefined,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Send failed:", err?.message || err);
    return res.status(500).json({ ok: false, error: "Failed to send email." });
  }
};
