import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

function validateBooking(data: {
  name: string;
  email: string;
  phone?: string;
  service: string;
  sessionType: string;
  preferredDate?: string;
  preferredTime?: string;
  message?: string;
}) {
  const errors: Record<string, string> = {};

  if (!data.name?.trim()) {
    errors.name = "Name is required";
  } else if (data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  } else if (data.name.trim().length > 100) {
    errors.name = "Name must be less than 100 characters";
  } else if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(data.name.trim())) {
    errors.name = "Name contains invalid characters";
  }

  if (!data.email?.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = "Please enter a valid email address";
  } else if (data.email.trim().length > 254) {
    errors.email = "Email address is too long";
  }

  if (data.phone?.trim()) {
    const phoneDigits = data.phone.replace(/[\s\-\+\(\)]/g, "");
    if (!/^\d+$/.test(phoneDigits)) {
      errors.phone = "Phone number contains invalid characters";
    } else if (phoneDigits.length < 7) {
      errors.phone = "Phone number is too short";
    } else if (phoneDigits.length > 15) {
      errors.phone = "Phone number is too long";
    }
  }

  if (!data.service?.trim()) {
    errors.service = "Please select a service";
  }

  if (!data.sessionType?.trim()) {
    errors.sessionType = "Please select a session type";
  }

  if (data.preferredDate?.trim()) {
    const date = new Date(data.preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(date.getTime())) {
      errors.preferredDate = "Please enter a valid date";
    } else if (date < today) {
      errors.preferredDate = "Date cannot be in the past";
    }
  }

  if (data.message?.trim() && data.message.trim().length > 1000) {
    errors.message = "Message must be less than 1000 characters";
  }

  return errors;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      service,
      sessionType,
      preferredDate,
      preferredTime,
      message,
    } = body;

    const errors = validateBooking({
      name,
      email,
      phone,
      service,
      sessionType,
      preferredDate,
      preferredTime,
      message,
    });

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 422 });
    }

    const sanitizedName = name.trim();
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedPhone = phone?.trim() || "Not provided";
    const sanitizedMessage = message?.trim() || "No message provided";

    await transporter.sendMail({
      from: `"Karim Portfolio" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Booking Request — ${service} (${sessionType})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #22c55e, #059669); padding: 32px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; color: #000;">New Booking Request</h1>
            <p style="margin: 8px 0 0; color: #000; opacity: 0.8;">From your portfolio website</p>
          </div>
          <div style="padding: 32px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; color: #9ca3af; width: 40%;">Name</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; color: #ffffff; font-weight: bold;">${sanitizedName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; color: #9ca3af;">Email</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; color: #22c55e;">${sanitizedEmail}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; color: #9ca3af;">Phone</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; color: #ffffff;">${sanitizedPhone}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; color: #9ca3af;">Service</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; color: #ffffff;">${service}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; color: #9ca3af;">Session Type</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; color: #ffffff;">${sessionType}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; color: #9ca3af;">Preferred Date</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; color: #ffffff;">${preferredDate || "Flexible"}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; color: #9ca3af;">Preferred Time</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #1a1a1a; color: #ffffff;">${preferredTime || "Flexible"}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #9ca3af; vertical-align: top;">Message</td>
                <td style="padding: 12px 0; color: #ffffff;">${sanitizedMessage}</td>
              </tr>
            </table>
          </div>
          <div style="background: #111; padding: 16px; text-align: center;">
            <p style="margin: 0; color: #4b5563; font-size: 12px;">Karim Boudabous Portfolio — Booking System</p>
          </div>
        </div>
      `,
    });

    await transporter.sendMail({
      from: `"Karim Boudabous" <${process.env.EMAIL_USER}>`,
      to: sanitizedEmail,
      subject: `Booking Request Received — ${service}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #22c55e, #059669); padding: 32px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; color: #000;">Booking Request Received!</h1>
            <p style="margin: 8px 0 0; color: #000; opacity: 0.8;">Thank you for reaching out</p>
          </div>
          <div style="padding: 32px;">
            <p style="color: #d1d5db; line-height: 1.6;">Hi <strong style="color: #fff;">${sanitizedName}</strong>,</p>
            <p style="color: #d1d5db; line-height: 1.6;">
              Thank you for your booking request! I have received your request for a
              <strong style="color: #22c55e;">${service}</strong> session
              (${sessionType}) and will confirm your booking within
              <strong style="color: #fff;">24 hours</strong>.
            </p>
            <div style="background: #111; border: 1px solid #1a1a1a; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <h3 style="margin: 0 0 16px; color: #22c55e; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Booking Summary</h3>
              <p style="margin: 8px 0; color: #9ca3af;">Service: <span style="color: #fff;">${service}</span></p>
              <p style="margin: 8px 0; color: #9ca3af;">Type: <span style="color: #fff;">${sessionType}</span></p>
              <p style="margin: 8px 0; color: #9ca3af;">Date: <span style="color: #fff;">${preferredDate || "To be confirmed"}</span></p>
              <p style="margin: 8px 0; color: #9ca3af;">Time: <span style="color: #fff;">${preferredTime || "To be confirmed"}</span></p>
            </div>
            <p style="color: #d1d5db; line-height: 1.6;">
              If you have any questions in the meantime, feel free to reply to this email.
            </p>
            <p style="color: #d1d5db; line-height: 1.6;">
              Looking forward to working with you!<br/>
              <strong style="color: #fff;">Karim Boudabous</strong><br/>
              <span style="color: #22c55e; font-size: 13px;">NSCA CSCS® · Football Coach (UEFA C) · Personal Trainer · MSc S&C</span>
            </p>
          </div>
          <div style="background: #111; padding: 16px; text-align: center;">
            <p style="margin: 0; color: #4b5563; font-size: 12px;">© ${new Date().getFullYear()} Karim Boudabous. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json(
      { message: "Booking request sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Booking email error:", error);
    return NextResponse.json(
      { error: "Failed to send booking request" },
      { status: 500 }
    );
  }
}