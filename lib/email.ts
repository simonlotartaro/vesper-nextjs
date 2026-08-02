import { Resend, type CreateEmailOptions } from "resend";

/**
 * Outbound mail for the two public forms.
 *
 * Both forms send from a dedicated address and land in the shared inbox,
 * with the submitter on replyTo. Every message carries form_type and
 * record_id tags: the webhook uses them to find the row it belongs to, and
 * they exist from the moment the row is inserted — before Resend has even
 * issued an email id — so a fast webhook can never outrun them.
 */

export const FROM = "Vesper Forms <forms@vesperevent.com>";
export const PRIMARY_RECIPIENT = "info@vesperevent.com";

/** Temporary during the testing phase. Remove once tracking is trusted. */
export const BACKUP_RECIPIENT = "simonlotartaro@gmail.com";

export type FormType = "request_access" | "contact";

/** Status stored on the request row. Webhook states are added later. */
export type SendStatus = "sent" | "send_pending" | "send_failed";

export type SendOutcome =
  | { status: "sent"; emailId: string }
  | { status: "send_pending"; error: string }
  | { status: "send_failed"; error: string };

const MAX_ATTEMPTS = 3;
const BACKOFF_MS = [400, 1200];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function sendTracked(
  resend: Resend,
  formType: FormType,
  recordId: string,
  content: Pick<CreateEmailOptions, "replyTo" | "subject" | "text" | "html">
): Promise<SendOutcome> {
  const idempotencyKey = `vesper:${formType}:${recordId}`;
  let lastError = "unknown";

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const { data, error } = await resend.emails.send(
      {
        ...content,
        from: FROM,
        to: PRIMARY_RECIPIENT,
        bcc: BACKUP_RECIPIENT,
        tags: [
          { name: "form_type", value: formType },
          { name: "record_id", value: recordId },
        ],
      } as CreateEmailOptions,
      { idempotencyKey }
    );

    // An id is the only proof the email exists. Nothing else counts as sent.
    if (!error && data?.id) return { status: "sent", emailId: data.id };

    lastError = error ? `${error.name}: ${error.message}` : "no email id returned";

    // Another request holds the same key right now. We do NOT know whether it
    // succeeded. Retrying with the same key is safe and is the only way to
    // find out: if the first one landed, Resend replays its result.
    if (error?.name === "concurrent_idempotent_requests" && attempt < MAX_ATTEMPTS) {
      console.warn(`[${formType}] concurrent idempotent request, retry ${attempt}`);
      await sleep(BACKOFF_MS[attempt - 1]);
      continue;
    }

    if (error?.name !== "concurrent_idempotent_requests") {
      return { status: "send_failed", error: lastError };
    }
  }

  // Still contended after every attempt: the outcome is genuinely unknown.
  // Not sent — but not failed either, because the first request may well have
  // gone through. Telling the user to resend here is what would duplicate the
  // email, so the caller answers 202 instead. The webhook resolves the row
  // later through the record_id tag.
  return { status: "send_pending", error: lastError };
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Shared shell so both notification emails look like one system. */
export function emailShell(
  heading: string,
  rows: [string, string][],
  bodyLabel: string,
  bodyText: string,
  warning?: string
) {
  return `
<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:560px;color:#1a1a1a">
  <p style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#8a7340;margin:0 0 18px">${esc(heading)}</p>
  <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:14px">
    ${rows.map(([k, v]) => `
    <tr>
      <td style="padding:9px 0;border-bottom:1px solid #eceae4;color:#77736b;width:180px;vertical-align:top">${esc(k)}</td>
      <td style="padding:9px 0;border-bottom:1px solid #eceae4;vertical-align:top">${esc(v)}</td>
    </tr>`).join("")}
  </table>
  <p style="font-size:12px;color:#77736b;margin:24px 0 6px">${esc(bodyLabel)}</p>
  <p style="font-size:14px;line-height:1.6;white-space:pre-line;margin:0">${esc(bodyText)}</p>
  ${warning ? `<p style="margin:22px 0 0;padding:12px 14px;background:#fdf3f0;border:1px solid #e8c4b8;font-size:13px;color:#93412a">${esc(warning)}</p>` : ""}
</div>`.trim();
}
