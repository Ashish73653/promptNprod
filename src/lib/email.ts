import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const fromEmail = process.env.RESEND_FROM_EMAIL || "Prompt N Prod <onboarding@resend.dev>";
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://promptnprod.dev";

export interface EmailNotificationPayload {
  title: string;
  category: string;
  description: string;
  url: string;
  driveUrl?: string;
  type?: "note" | "roadmap" | "announcement";
  recipientEmails: string[];
}

export function generateNotificationHtml({
  title,
  category,
  description,
  url,
  driveUrl,
  type = "note",
}: Omit<EmailNotificationPayload, "recipientEmails">): string {
  const typeLabel =
    type === "note"
      ? "New Study Note Published"
      : type === "roadmap"
      ? "New Engineering Roadmap Live"
      : "Community Update";

  const fullUrl = url.startsWith("http") ? url : `${appUrl}${url}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #07090e; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #07090e; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #0e1424; border: 1px solid #1e293b; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
          <!-- Top Accent Bar -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding: 32px 36px 20px 36px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <span style="font-size: 18px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff;">
                      PROMPT <span style="color: #06b6d4;">N</span> PROD
                    </span>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; padding: 4px 10px; background-color: rgba(6, 182, 212, 0.12); color: #22d3ee; border: 1px solid rgba(6, 182, 212, 0.25); border-radius: 100px; font-size: 11px; font-weight: 700; text-transform: uppercase;">
                      ${category}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Badge & Heading -->
          <tr>
            <td style="padding: 10px 36px 20px 36px;">
              <span style="color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px;">
                ⚡ ${typeLabel}
              </span>
              <h1 style="margin: 0; font-size: 26px; font-weight: 800; line-height: 1.3; color: #ffffff; letter-spacing: -0.5px;">
                ${title}
              </h1>
            </td>
          </tr>

          <!-- Description -->
          <tr>
            <td style="padding: 0 36px 30px 36px;">
              <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #94a3b8;">
                ${description}
              </p>
            </td>
          </tr>

          <!-- CTA Buttons Container -->
          <tr>
            <td style="padding: 0 36px 36px 36px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="left">
                    <a href="${fullUrl}" target="_blank" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #06b6d4 0%, #2563eb 100%); color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; border-radius: 12px; box-shadow: 0 4px 14px rgba(6, 182, 212, 0.35);">
                      Read Online & Download PDF →
                    </a>
                    ${
                      driveUrl
                        ? `&nbsp;&nbsp;<a href="${driveUrl}" target="_blank" style="display: inline-block; padding: 14px 20px; background-color: #1e293b; color: #cbd5e1; text-decoration: none; font-size: 13px; font-weight: 600; border-radius: 12px; margin-top: 8px;">Open Google Drive</a>`
                        : ""
                    }
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="height: 1px; background-color: #1e293b;"></td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 36px 30px 36px; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b;">
                You received this because you subscribed to the <strong>Prompt N Prod</strong> developer study vault.
              </p>
              <p style="margin: 0; font-size: 11px; color: #475569;">
                <a href="${appUrl}" style="color: #06b6d4; text-decoration: none;">Prompt N Prod</a> • From Prompt to Production • Zero Spam
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Dispatches an email notification to subscribers via Resend.
 * Falls back safely to simulation mode if RESEND_API_KEY is not configured.
 */
export async function sendSubscriberNotification(payload: EmailNotificationPayload): Promise<{
  success: boolean;
  count: number;
  simulated?: boolean;
  error?: string;
}> {
  const { title, category, description, url, driveUrl, type = "note", recipientEmails } = payload;

  if (!recipientEmails || recipientEmails.length === 0) {
    return { success: true, count: 0, message: "No subscribers to notify" } as any;
  }

  const html = generateNotificationHtml({ title, category, description, url, driveUrl, type });
  const subject = `⚡ New Drop: ${title} [${category}]`;

  // Safe fallback if Resend API Key is not yet configured in .env.local
  if (!resend) {
    console.warn(
      `[Resend Simulation] RESEND_API_KEY is not configured in .env.local. Would have sent "${subject}" to ${recipientEmails.length} subscribers:`,
      recipientEmails
    );
    return {
      success: true,
      count: recipientEmails.length,
      simulated: true,
    };
  }

  try {
    // Resend batch sending allows up to 100 emails in one request
    const batchPayload = recipientEmails.map((email) => ({
      from: fromEmail,
      to: email,
      subject,
      html,
    }));

    // Process in batches of 100 if necessary
    const batchSize = 100;
    for (let i = 0; i < batchPayload.length; i += batchSize) {
      const currentBatch = batchPayload.slice(i, i + batchSize);
      await resend.batch.send(currentBatch);
    }

    return {
      success: true,
      count: recipientEmails.length,
      simulated: false,
    };
  } catch (err: any) {
    console.error("Resend dispatch error:", err);
    return {
      success: false,
      count: 0,
      error: err?.message || "Failed to dispatch emails via Resend",
    };
  }
}
