import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
});

const locales = ["en", "es", "fr"];

export const metadata: Metadata = {
  title: "Karim Boudabous | NSCA CSCS® · Football Coach (UEFA C) · MSc S&C",
  description:
    "NSCA CSCS® certified strength and conditioning coach, Football Coach (UEFA C), and Personal Trainer based in Murcia, Spain. Specializing in high performance S&C, football coaching, and personal training.",
  keywords: [
    "NSCA CSCS",
    "strength and conditioning",
    "football coach",
    "UEFA C",
    "personal trainer",
    "sports science",
    "high performance",
    "UCAM",
    "Murcia",
    "Karim Boudabous",
    "El Palmar CF",
    "Barça Innovation Hub",
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${oswald.variable} font-sans bg-neutral-950 text-white antialiased`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}