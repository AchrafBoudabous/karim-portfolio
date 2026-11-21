import type { Metadata, Viewport } from "next";
import { Inter, Oswald } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Providers from "@/components/Providers";
import { routing } from "@/i18n/routing";
import { SITE } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin", "latin-ext"],
  variable: "--font-oswald",
  display: "swap",
});

type Params = Promise<{ locale: string }>;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "meta" });

  const title = t("title");
  const description = t("description");
  const ogImage = {
    url: "/images/Coaching/Rayo%20Vallecano%20de%20Madrid/Rayo%20Vallecano%20de%20Madrid.jpeg",
    width: 1024,
    height: 1240,
    alt: SITE.name,
  };

  return {
    metadataBase: new URL(SITE.url),
    title,
    description,
    applicationName: SITE.name,
    authors: [{ name: SITE.name }],
    keywords: [
      "strength and conditioning",
      "football coach",
      "UEFA C",
      "personal trainer",
      "sports science",
      "high performance",
      "Madrid",
      "Karim Boudabous",
      "CDE Fuenlabrada Atlantis",
    ],
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `/${l}`])
      ),
    },
    openGraph: {
      type: "profile",
      locale,
      url: `/${locale}`,
      siteName: SITE.name,
      title,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Enables static rendering for every locale.
  setRequestLocale(locale);

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.name,
    url: `${SITE.url}/${locale}`,
    image: `${SITE.url}/images/Coaching/Rayo%20Vallecano%20de%20Madrid/Rayo%20Vallecano%20de%20Madrid.jpeg`,
    jobTitle: "Strength & Conditioning Coach · Football Coach (UEFA C)",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Madrid",
      addressCountry: "ES",
    },
    alumniOf: "UCAM Universidad Católica San Antonio de Murcia",
    sameAs: Object.values(SITE.socials),
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${oswald.variable} font-sans bg-neutral-950 text-white antialiased`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          // JSON.stringify output is safe here; "<" is escaped to avoid
          // breaking out of the script element.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <NextIntlClientProvider>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
