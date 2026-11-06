import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { SITE } from "@/lib/site";

let transporter: Transporter | null = null;

export function isEmailConfigured(): boolean {
  return Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);
}

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

/** Removes characters that could break or inject into email headers. */
export function headerSafe(value: string, max = 120): string {
  return value.replace(/[\r\n\t]+/g, " ").trim().slice(0, max);
}

/** Escapes and keeps the user's line breaks. */
function multiline(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, "<br/>");
}

const SIGNATURE_ROLE =
  "Football Coach (UEFA C) · Strength & Conditioning Coach · Personal Trainer";

function layout(title: string, subtitle: string, inner: string): string {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#ffffff;border-radius:12px;overflow:hidden;">
    <div style="background:linear-gradient(135deg,#22c55e,#059669);padding:32px;text-align:center;">
      <h1 style="margin:0;font-size:24px;color:#000;">${escapeHtml(title)}</h1>
      ${subtitle ? `<p style="margin:8px 0 0;color:#000;opacity:.8;">${escapeHtml(subtitle)}</p>` : ""}
    </div>
    <div style="padding:32px;">${inner}</div>
    <div style="background:#111;padding:16px;text-align:center;">
      <p style="margin:0;color:#6b7280;font-size:12px;">© ${new Date().getFullYear()} ${escapeHtml(SITE.name)}</p>
    </div>
  </div>`;
}

function table(rows: [label: string, value: string][]): string {
  const cells = rows
    .map(
      ([label, value], i) => `
      <tr>
        <td style="padding:12px 0;${i < rows.length - 1 ? "border-bottom:1px solid #1f1f1f;" : ""}color:#9ca3af;width:40%;vertical-align:top;">${escapeHtml(label)}</td>
        <td style="padding:12px 0;${i < rows.length - 1 ? "border-bottom:1px solid #1f1f1f;" : ""}color:#ffffff;">${value}</td>
      </tr>`
    )
    .join("");
  return `<table style="width:100%;border-collapse:collapse;">${cells}</table>`;
}

interface Notification {
  subject: string;
  title: string;
  rows: [label: string, rawValue: string][];
  replyTo: string;
}

/** Sends the notification to the site owner. Values are escaped here. */
export async function sendOwnerNotification(n: Notification) {
  const user = process.env.EMAIL_USER!;
  await getTransporter().sendMail({
    from: { name: `${SITE.name} — Website`, address: user },
    to: user,
    replyTo: n.replyTo,
    subject: headerSafe(n.subject, 160),
    html: layout(
      n.title,
      "From your portfolio website",
      table(n.rows.map(([label, value]) => [label, multiline(value)]))
    ),
  });
}

/**
 * Sends a short acknowledgement to the visitor.
 *
 * Security: the auto-reply deliberately does NOT echo the visitor's message
 * (or any other free text besides a short first name). Otherwise anyone could
 * use this form to send arbitrary content, from this Gmail account, to any
 * address they type in.
 */
export async function sendAutoReply(opts: {
  to: string;
  name: string;
  subject: string;
  title: string;
  body: string;
}) {
  const user = process.env.EMAIL_USER!;
  const firstName = escapeHtml(headerSafe(opts.name.split(/\s+/)[0] ?? "", 40));
  await getTransporter().sendMail({
    from: { name: SITE.name, address: user },
    to: opts.to,
    subject: headerSafe(opts.subject, 160),
    html: layout(
      opts.title,
      "",
      `
      <p style="color:#d1d5db;line-height:1.6;">Hi <strong style="color:#fff;">${firstName}</strong>,</p>
      <p style="color:#d1d5db;line-height:1.6;">${opts.body}</p>
      <p style="color:#d1d5db;line-height:1.6;">
        Best regards,<br/>
        <strong style="color:#fff;">${escapeHtml(SITE.name)}</strong><br/>
        <span style="color:#22c55e;font-size:13px;">${escapeHtml(SIGNATURE_ROLE)}</span>
      </p>`
    ),
  });
}
