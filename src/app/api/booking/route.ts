import { NextRequest } from "next/server";
import { allowAutoReply, guardFormRequest, respond } from "@/lib/apiGuard";
import { escapeHtml, isEmailConfigured, sendAutoReply, sendOwnerNotification } from "@/lib/email";
import { validateBooking, type ServiceKey, type SessionTypeKey } from "@/lib/validation";

export const runtime = "nodejs";

// Labels are resolved on the server from stable keys, so the client can
// never inject its own text into the email subject.
const SERVICE_LABELS: Record<ServiceKey, string> = {
  pt: "Personal Training",
  football: "Football Coaching",
  sc: "Strength & Conditioning",
  discovery: "Free Discovery Call",
};

const SESSION_LABELS: Record<SessionTypeKey, string> = {
  inPerson: "In-Person",
  online: "Online",
};

export async function POST(req: NextRequest) {
  const guard = await guardFormRequest(req, "booking");
  if (!guard.ok) return guard.response;
  const { body } = guard;

  if (typeof body.website === "string" && body.website.trim() !== "") {
    return respond.ok();
  }

  const errors = validateBooking(body);
  if (Object.keys(errors).length > 0) return respond.invalid(errors);

  if (!isEmailConfigured()) {
    console.error("[booking] EMAIL_USER / EMAIL_PASS are not configured");
    return respond.unavailable();
  }

  const s = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const service = SERVICE_LABELS[body.service as ServiceKey];
  const sessionType = SESSION_LABELS[body.sessionType as SessionTypeKey];
  const name = s(body.name);
  const email = s(body.email).toLowerCase();
  const phone = s(body.phone) || "Not provided";
  const date = s(body.preferredDate) || "Flexible";
  const time = s(body.preferredTime) || "Flexible";
  const message = s(body.message) || "No message provided";

  try {
    await sendOwnerNotification({
      subject: `New booking request — ${service} (${sessionType})`,
      title: "New Booking Request",
      replyTo: email,
      rows: [
        ["Name", name],
        ["Email", email],
        ["Phone", phone],
        ["Service", service],
        ["Session Type", sessionType],
        ["Preferred Date", date],
        ["Preferred Time", time],
        ["Message", message],
      ],
    });

    if (allowAutoReply(email)) {
      await sendAutoReply({
        to: email,
        name,
        subject: `Booking request received — ${service}`,
        title: "Booking Request Received",
        body: `Thank you for your booking request! I have received your request for a <strong style="color:#22c55e;">${escapeHtml(service)}</strong> session (${escapeHtml(sessionType)}) on <strong style="color:#fff;">${escapeHtml(date)}</strong> at <strong style="color:#fff;">${escapeHtml(time)}</strong>, and I will confirm it within <strong style="color:#fff;">24 hours</strong>.`,
      }).catch((err) => console.error("[booking] auto-reply failed:", err));
    }

    return respond.ok();
  } catch (error) {
    console.error("[booking] send failed:", error);
    return respond.error();
  }
}
