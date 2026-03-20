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
  title: "Karim Boudabous | Sports Science & Elite Performance",
  description:
    "UEFA C Football Coach & Sports Scientist specializing in High Performance, S&C, and Personal Training.",
  keywords: [
    "sports science",
    "football coach",
    "UEFA C",
    "strength and conditioning",
    "high performance",
    "UCAM",
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
    <html lang={locale} className="scroll-smooth" suppressHydrationWarning>
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