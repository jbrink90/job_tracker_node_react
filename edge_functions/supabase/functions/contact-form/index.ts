import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";
import { Resend } from "resend";

const apiKey = Deno.env.get("RESEND_API_KEY");
const destination = Deno.env.get("DESTINATION_EMAIL");

if (!destination) {
  throw new Error("DESTINATION_EMAIL is not configured");
}

if (!apiKey) {
  throw new Error("RESEND_API_KEY is not configured");
}

const resend = new Resend(apiKey);

console.log(
  "Contact Function Loaded at " +
    new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
    }),
);

function escapeHtml(str: string): string {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default {
  fetch: withSupabase({ auth: ["publishable"] }, async (req) => {
    // Optional origin validation
    const origin = req.headers.get("origin") ?? req.headers.get("referer");

    const allowedOrigins = [
      "jobtrackr.online",
      "http://localhost:5173",
    ];

    if (
      !origin ||
      !allowedOrigins.some((allowed) => origin.includes(allowed))
    ) {
      console.log(`Rejected origin: ${origin}`);

      return Response.json(
        { error: "Forbidden - invalid origin" },
        { status: 403 },
      );
    }

    const { name, email, message } = await req.json();

    // Required fields
    if (name === undefined || email === undefined || message === undefined) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Type validation
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string"
    ) {
      return Response.json(
        { error: "Invalid request payload" },
        { status: 400 },
      );
    }

    // Trim whitespace
    const safeName = name.trim();
    const safeEmail = email.trim().toLowerCase();
    const safeMessage = message.trim();

    // Empty after trimming
    if (!safeName || !safeEmail || !safeMessage) {
      return Response.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // Length validation
    if (safeName.length > 100) {
      return Response.json(
        { error: "Name must be 100 characters or fewer" },
        { status: 400 },
      );
    }

    if (safeEmail.length > 320) {
      return Response.json(
        { error: "Email address is too long" },
        { status: 400 },
      );
    }

    if (safeMessage.length > 5000) {
      return Response.json(
        { error: "Message must be 5000 characters or fewer" },
        { status: 400 },
      );
    }

    // Email validation
    if (!isValidEmail(safeEmail)) {
      return Response.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }

    const { data, error } = await resend.emails.send({
      from: "JobTrackr Support <support@jobtrackr.online>",
      to: destination,
      replyTo: safeEmail,
      subject: `JobTrackr Contact: ${escapeHtml(safeName)}`,
      text: `
      New Contact Form Submission

      Name: ${escapeHtml(safeName)}
      Email: ${escapeHtml(safeEmail)}

      Message:

      ${escapeHtml(safeMessage)}

      Reply-To: ${escapeHtml(safeEmail)}
      `,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px; }
            .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px; }
            .content { padding: 40px 30px; }
            .section { margin-bottom: 30px; }
            .section-label { color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; margin-bottom: 8px; }
            .section-value { color: #333; font-size: 16px; line-height: 1.6; }
            .message-box { background-color: #f9f9f9; border-left: 4px solid #667eea; padding: 20px; border-radius: 4px; margin-top: 20px; }
            .message-content { color: #444; font-size: 15px; line-height: 1.7; white-space: pre-wrap; }
            .divider { height: 1px; background-color: #e0e0e0; margin: 30px 0; }
            .footer { background-color: #f8f9fa; padding: 25px 30px; text-align: center; border-top: 1px solid #e0e0e0; }
            .footer p { color: #666; font-size: 13px; margin: 5px 0; }
            .footer a { color: #667eea; text-decoration: none; }
            .footer a:hover { text-decoration: underline; }
            .badge { display: inline-block; background-color: #667eea; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📬 New Message Received</h1>
              <p>Someone has reached out through JobTrackr</p>
            </div>
            
            <div class="content">
              <div class="section">
                <div class="badge">Contact Form</div>
              </div>
              
              <div class="section">
                <div class="section-label">From</div>
                <div class="section-value">
                  <strong>${escapeHtml(safeName)}</strong><br>
                  <a href="mailto:${escapeHtml(safeEmail)}" style="color: #667eea; text-decoration: none;">${escapeHtml(safeEmail)}</a>
                </div>
              </div>
              
              <div class="divider"></div>
              
              <div class="section">
                <div class="section-label">Message</div>
                <div class="message-box">
                  <div class="message-content">${escapeHtml(safeMessage).replaceAll("\n", "<br>")}</div>
                </div>
              </div>
            </div>
            
            <div class="footer">
              <p>Sent from <strong>JobTrackr</strong> - Your Job Application Companion</p>
              <p><a href="https://jobtrackr.online">jobtrackr.online</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error(error);

      return Response.json(
        { error: "Failed to send email" },
        { status: 500 },
      );
    }

    console.log(`Contact form submitted by ${escapeHtml(safeEmail)}`);

    return Response.json({
      success: true,
      data,
    });
  }),
};