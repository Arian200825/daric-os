import { formatMoney } from "./utils";

/**
 * Transactional email templates + sender for Daric OS events.
 *
 * ⚠️  Runs SERVER-SIDE only (route handler / Edge Function) so keys stay secret.
 * Env: RESEND_API_KEY, EMAIL_FROM (e.g. "Daric <daricone.web@gmail.com>"),
 * CONTACT_EMAIL (defaults the from-address; set once, change without code).
 *
 * Together with the agency's contact/lead emails, this completes the five-email
 * transactional set: contact confirmation, new lead, proposal sent,
 * project started, project completed.
 */

const BRAND = "Daric";

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

function shell(heading: string, bodyHtml: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f5f5f6;font-family:Inter,Arial,sans-serif;color:#0a0a0a">
  <div style="max-width:520px;margin:0 auto;padding:32px 24px">
    <div style="font-weight:700;font-size:18px;letter-spacing:-0.02em">${BRAND}</div>
    <div style="background:#fff;border:1px solid rgba(0,0,0,.08);border-radius:12px;padding:28px;margin-top:16px">
      <h1 style="font-size:20px;margin:0 0 12px">${heading}</h1>${bodyHtml}
    </div>
  </div></body></html>`;
}

function p(text: string): string {
  return `<p style="line-height:1.6;color:#3a3a3a">${text}</p>`;
}

/** Sent to a client when their proposal is issued. */
export function proposalSent(args: { client: string; number: string; total: number }): EmailTemplate {
  const body = `Your proposal ${args.number} is ready — a total of ${formatMoney(args.total)}. Reply to this email to accept, or with any questions. We're excited to work with you.`;
  return {
    subject: `Your proposal ${args.number} from ${BRAND}`,
    html: shell(`Proposal for ${args.client}`, p(body)),
    text: `Hi ${args.client},\n\n${body}\n\n— ${BRAND}`,
  };
}

/** Sent to a client when their project kicks off. */
export function projectStarted(args: { client: string; projectName: string }): EmailTemplate {
  const body = `Great news — "${args.projectName}" is officially underway. We'll share progress at each milestone and reach out if we need anything from you.`;
  return {
    subject: `Your project has started — ${args.projectName}`,
    html: shell("We've started building 🚀", p(body)),
    text: `Hi ${args.client},\n\n${body}\n\n— ${BRAND}`,
  };
}

/** Sent to a client when their project launches. */
export function projectCompleted(args: { client: string; projectName: string }): EmailTemplate {
  const body = `"${args.projectName}" is complete and live. Thank you for trusting ${BRAND} — it's been a pleasure. We'd love a quick review, and we're here whenever you need us.`;
  return {
    subject: `Your project is live — ${args.projectName} 🎉`,
    html: shell("You're live!", p(body)),
    text: `Hi ${args.client},\n\n${body}\n\n— ${BRAND}`,
  };
}

/** Send via Resend. No-ops (returns false) until RESEND_API_KEY is set. */
export async function sendEmail(to: string, template: EmailTemplate): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const contact = process.env.CONTACT_EMAIL || "daricone.web@gmail.com";
  const from = process.env.EMAIL_FROM || `${BRAND} <${contact}>`;
  if (!key) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject: template.subject, html: template.html, text: template.text }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
