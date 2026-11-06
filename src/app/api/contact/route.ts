import { NextRequest } from "next/server";
import { allowAutoReply, guardFormRequest, respond } from "@/lib/apiGuard";
import { isEmailConfigured, sendAutoReply, sendOwnerNotification } from "@/lib/email";
import { validateContact } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const guard = await guardFormRequest(req, "contact");
  if (!guard.ok) return guard.response;
  const { body } = guard;

  // Honeypot: real users never see or fill this field. Pretend success so
  // bots get no signal.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return respond.ok();
  }

  const errors = validateContact(body);
  if (Object.keys(errors).length > 0) return respond.invalid(errors);

  if (!isEmailConfigured()) {
    console.error("[contact] EMAIL_USER / EMAIL_PASS are not configured");
    return respond.unavailable();
  }

  const name = String(body.name).trim();
  const email = String(body.email).trim().toLowerCase();
  const message = String(body.message).trim();

  try {
    await sendOwnerNotification({
      subject: `New contact message from ${name}`,
      title: "New Contact Message",
      replyTo: email,
      rows: [
        ["Name", name],
        ["Email", email],
        ["Message", message],
      ],
    });

    if (allowAutoReply(email)) {
      await sendAutoReply({
        to: email,
        name,
        subject: "Message received — Karim Boudabous",
        title: "Message Received",
        body: "Thank you for getting in touch! I have received your message and will get back to you as soon as possible, usually within <strong style=\"color:#fff;\">24 hours</strong>.",
      }).catch((err) => console.error("[contact] auto-reply failed:", err));
    }

    return respond.ok();
  } catch (error) {
    console.error("[contact] send failed:", error);
    return respond.error();
  }
}
