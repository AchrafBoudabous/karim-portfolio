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

function validateContact(data: {
  name: string;
  email: string;
  message: string;
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

  if (!data.message?.trim()) {
    errors.message = "Message is required";
  } else if (data.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters";
  } else if (data.message.trim().length > 2000) {
    errors.message = "Message must be less than 2000 characters";
  }

  return errors;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    const errors = validateContact({ name, email, message });
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 422 });
    }

    const sanitizedName = name.trim();
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedMessage = message.trim();

    await transporter.sendMail({
      from: `"Karim Portfolio" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Contact Message from ${sanitizedName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #22c55e, #059669); padding: 32px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; color: #000;">New Contact Message</h1>
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
                <td style="padding: 12px 0; color: #9ca3af; vertical-align: top;">Message</td>
                <td style="padding: 12px 0; color: #ffffff;">${sanitizedMessage}</td>
              </tr>
            </table>
          </div>
          <div style="background: #111; padding: 16px; text-align: center;">
            <p style="margin: 0; color: #4b5563; font-size: 12px;">Karim Boudabous Portfolio — Contact Form</p>
          </div>
        </div>
      `,
    });

    await transporter.sendMail({
      from: `"Karim Boudabous" <${process.env.EMAIL_USER}>`,
      to: sanitizedEmail,
      subject: "Message Received — Karim Boudabous",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #ffffff; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #22c55e, #059669); padding: 32px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; color: #000;">Message Received!</h1>
          </div>
          <div style="padding: 32px;">
            <p style="color: #d1d5db; line-height: 1.6;">Hi <strong style="color: #fff;">${sanitizedName}</strong>,</p>
            <p style="color: #d1d5db; line-height: 1.6;">
              Thank you for getting in touch! I have received your message and will get back to you as soon as possible, usually within <strong style="color: #fff;">24 hours</strong>.
            </p>
            <div style="background: #111; border: 1px solid #1a1a1a; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <h3 style="margin: 0 0 12px; color: #22c55e; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Message</h3>
              <p style="margin: 0; color: #9ca3af; line-height: 1.6;">${sanitizedMessage}</p>
            </div>
            <p style="color: #d1d5db; line-height: 1.6;">
              Best regards,<br/>
              <strong style="color: #fff;">Karim Boudabous</strong><br/>
              <span style="color: #22c55e; font-size: 13px;">Sports Scientist · Personal Trainer · UEFA C Coach Candidate</span>
            </p>
          </div>
          <div style="background: #111; padding: 16px; text-align: center;">
            <p style="margin: 0; color: #4b5563; font-size: 12px;">© ${new Date().getFullYear()} Karim Boudabous. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact email error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}