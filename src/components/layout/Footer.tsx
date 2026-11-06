import { useTranslations } from "next-intl";
import { Instagram, Linkedin, Mail, ArrowUp } from "lucide-react";
import TikTokIcon from "@/components/ui/TikTokIcon";
import { NAV_KEYS } from "@/lib/nav";
import { SITE } from "@/lib/site";

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tA11y = useTranslations("a11y");

  const socials = [
    { icon: Linkedin, href: SITE.socials.linkedin, label: "LinkedIn", external: true },
    { icon: Instagram, href: SITE.socials.instagram, label: "Instagram", external: true },
    { icon: TikTokIcon, href: SITE.socials.tiktok, label: "TikTok", external: true },
    { icon: Mail, href: `mailto:${SITE.email}`, label: "Email", external: false },
  ];

  return (
    <footer className="relative border-t border-white/5 bg-neutral-950">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-green-500/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-3 md:items-start">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-green-400 to-emerald-600 font-oswald font-bold text-black">
              KB
            </span>
            <div>
              <p className="font-oswald font-bold tracking-wide text-white">KARIM BOUDABOUS</p>
              <p className="text-xs text-white/55">{t("madeWith")}</p>
            </div>
          </div>

          <nav aria-label={t("navTitle")}>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/45">{t("navTitle")}</p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {NAV_KEYS.map((key) => (
                <li key={key}>
                  <a href={`#${key}`} className="text-white/65 transition-colors hover:text-green-400">
                    {tNav(key)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:justify-self-end">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/45">{t("socialTitle")}</p>
            <ul className="flex items-center gap-3">
              {socials.map(({ icon: Icon, href, label, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition-all duration-200 hover:-translate-y-0.5 hover:border-green-500/40 hover:bg-green-500/10 hover:text-green-400"
                  >
                    <Icon size={16} aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 sm:flex-row">
          <p className="text-xs text-white/45">
            © {new Date().getFullYear()} {SITE.name}. {t("rights")}
          </p>
          <a
            href="#main"
            className="inline-flex items-center gap-1.5 text-xs text-white/50 transition-colors hover:text-green-400"
          >
            <ArrowUp size={12} aria-hidden />
            {tA11y("backToTop")}
          </a>
        </div>
      </div>
    </footer>
  );
}
