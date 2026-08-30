import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Karim Boudabous | NSCA CSCS® · Football Coach (UEFA B) · MSc S&C",
  description:
    "NSCA CSCS® certified strength and conditioning coach, Football Coach (UEFA B), and Personal Trainer based in Madrid, Spain. Specializing in high performance S&C, football coaching, and personal training.",
  keywords: [
    "NSCA CSCS",
    "strength and conditioning",
    "football coach",
    "UEFA B",
    "personal trainer",
    "sports science",
    "high performance",
    "UCAM",
    "Madrid",
    "Karim Boudabous",
    "El Palmar CF",
    "Barça Innovation Hub",
  ],
  openGraph: {
    type: "website",
    title: "Karim Boudabous | NSCA CSCS® · Football Coach (UEFA B) · MSc S&C",
    description:
      "NSCA CSCS® certified strength and conditioning coach, Football Coach (UEFA B), and Personal Trainer based in Madrid, Spain.",
    images: [
      {
        url: "/images/Wallpaper.jpeg",
        width: 1536,
        height: 2048,
        alt: "Karim Boudabous — Sports Science & Elite Performance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Karim Boudabous | NSCA CSCS® · Football Coach (UEFA B) · MSc S&C",
    description:
      "NSCA CSCS® certified strength and conditioning coach, Football Coach (UEFA B), and Personal Trainer based in Madrid, Spain.",
    images: ["/images/Wallpaper.jpeg"],
  },
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
