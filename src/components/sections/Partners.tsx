import { useTranslations } from "next-intl";
import Marquee from "@/components/ui/Marquee";

// Proper names — identical in every language.
const PARTNERS = [
  "Rayo Vallecano",
  "CDE Fuenlabrada Atlantis",
  "Syrian Football Association",
  "El Palmar CF",
  "Asociación Deportiva Vistalegre",
  "Club Sportif Sfaxien",
  "Funziona Entrenamiento Personal",
  "UCAM",
  "Barça Innovation Hub",
  "FIFA",
  "RFEF",
];

export default function Partners() {
  const t = useTranslations("partners");

  return (
    <section aria-label={t("title")} className="relative border-y border-white/5 bg-neutral-950 py-8">
      <p className="mb-5 px-4 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-white/45">
        {t("title")}
      </p>
      <Marquee duration="45s" gap="0.75rem">
        {PARTNERS.map((name) => (
          <span
            key={name}
            className="flex items-center gap-3 whitespace-nowrap rounded-full border border-white/10 bg-white/3 px-5 py-2.5 font-oswald text-sm font-semibold uppercase tracking-wider text-white/70"
          >
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-green-500" />
            {name}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
