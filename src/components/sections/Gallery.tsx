"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import SectionTitle from "@/components/ui/SectionTitle";
import VideoCard from "@/components/ui/VideoCard";

type MediaType = "image" | "video";

type SubCategory =
  | "trainingPhotos"
  | "trainingVideos"
  | "syriaU20"
  | "elPalmarCF"
  | "fuenlabradaAtlantis"
  | "certificates";

type MainCategory = "all" | "coaching" | "training" | "certificates";

type FilterKey =
  | "filters.all"
  | "filters.coaching"
  | "filters.training"
  | "filters.certificates"
  | "filters.trainingPhotos"
  | "filters.trainingVideos"
  | "filters.syriaU20"
  | "filters.elPalmarCF"
  | "filters.fuenlabradaAtlantis";

const mainCategoryOf: Record<SubCategory, Exclude<MainCategory, "all">> = {
  trainingPhotos: "training",
  trainingVideos: "training",
  syriaU20: "coaching",
  elPalmarCF: "coaching",
  fuenlabradaAtlantis: "coaching",
  certificates: "certificates",
};

const subTabsByMain: Partial<Record<MainCategory, SubCategory[]>> = {
  coaching: ["syriaU20", "elPalmarCF", "fuenlabradaAtlantis"],
  training: ["trainingPhotos", "trainingVideos"],
};

interface GalleryItem {
  id: number;
  type: MediaType;
  category: SubCategory;
  src: string;
  thumbnail?: string;
  title: string;
  span?: "normal" | "wide" | "tall";
}

const GYM_CAPTION = "Strength & Fitness Training";
const SYRIA_CAPTION = "Syria U20 National Team";
const EL_PALMAR_CAPTION = "El Palmar CF First Team | 3ª RFEF | 2025/26";
const FUENLABRADA_CAPTION = "CDE Fuenlabrada Atlantis | 2026/27";

const galleryItems: GalleryItem[] = [
  // Training — gym photos
  {
    id: 1,
    type: "image",
    category: "trainingPhotos",
    src: "/images/Training/Personal training pictures/WhatsApp Image 2026-08-30 at 15.10.37.jpeg",
    title: GYM_CAPTION,
    span: "normal",
  },
  {
    id: 2,
    type: "image",
    category: "trainingPhotos",
    src: "/images/Training/Personal training pictures/WhatsApp Image 2026-08-30 at 15.10.48 (1).jpeg",
    title: GYM_CAPTION,
    span: "normal",
  },
  {
    id: 3,
    type: "image",
    category: "trainingPhotos",
    src: "/images/Training/Personal training pictures/WhatsApp Image 2026-08-30 at 15.10.48 (10).jpeg",
    title: GYM_CAPTION,
    span: "normal",
  },
  {
    id: 4,
    type: "image",
    category: "trainingPhotos",
    src: "/images/Training/Personal training pictures/WhatsApp Image 2026-08-30 at 15.10.48 (11).jpeg",
    title: GYM_CAPTION,
    span: "normal",
  },
  {
    id: 5,
    type: "image",
    category: "trainingPhotos",
    src: "/images/Training/Personal training pictures/WhatsApp Image 2026-08-30 at 15.10.48 (2).jpeg",
    title: GYM_CAPTION,
    span: "normal",
  },
  {
    id: 6,
    type: "image",
    category: "trainingPhotos",
    src: "/images/Training/Personal training pictures/WhatsApp Image 2026-08-30 at 15.10.48 (3).jpeg",
    title: GYM_CAPTION,
    span: "normal",
  },
  {
    id: 7,
    type: "image",
    category: "trainingPhotos",
    src: "/images/Training/Personal training pictures/WhatsApp Image 2026-08-30 at 15.10.48 (4).jpeg",
    title: GYM_CAPTION,
    span: "normal",
  },
  {
    id: 8,
    type: "image",
    category: "trainingPhotos",
    src: "/images/Training/Personal training pictures/WhatsApp Image 2026-08-30 at 15.10.48 (5).jpeg",
    title: GYM_CAPTION,
    span: "normal",
  },
  {
    id: 9,
    type: "image",
    category: "trainingPhotos",
    src: "/images/Training/Personal training pictures/WhatsApp Image 2026-08-30 at 15.10.48 (6).jpeg",
    title: GYM_CAPTION,
    span: "normal",
  },
  {
    id: 10,
    type: "image",
    category: "trainingPhotos",
    src: "/images/Training/Personal training pictures/WhatsApp Image 2026-08-30 at 15.10.48 (7).jpeg",
    title: GYM_CAPTION,
    span: "normal",
  },
  {
    id: 11,
    type: "image",
    category: "trainingPhotos",
    src: "/images/Training/Personal training pictures/WhatsApp Image 2026-08-30 at 15.10.48 (8).jpeg",
    title: GYM_CAPTION,
    span: "normal",
  },
  {
    id: 12,
    type: "image",
    category: "trainingPhotos",
    src: "/images/Training/Personal training pictures/WhatsApp Image 2026-08-30 at 15.10.48 (9).jpeg",
    title: GYM_CAPTION,
    span: "normal",
  },
  {
    id: 13,
    type: "image",
    category: "trainingPhotos",
    src: "/images/Training/Personal training pictures/WhatsApp Image 2026-08-30 at 15.10.48.jpeg",
    title: GYM_CAPTION,
    span: "normal",
  },
  {
    id: 14,
    type: "image",
    category: "trainingPhotos",
    src: "/images/Training/Personal training pictures/WhatsApp Image 2026-08-30 at 15.10.49 (1).jpeg",
    title: GYM_CAPTION,
    span: "normal",
  },
  {
    id: 15,
    type: "image",
    category: "trainingPhotos",
    src: "/images/Training/Personal training pictures/WhatsApp Image 2026-08-30 at 15.10.49.jpeg",
    title: GYM_CAPTION,
    span: "normal",
  },
  // Training — gym videos
  {
    id: 16,
    type: "video",
    category: "trainingVideos",
    src: "/images/Training/Personal training videos/WhatsApp Video 2026-08-30 at 15.20.34.mp4",
    title: GYM_CAPTION,
    span: "normal",
  },
  {
    id: 17,
    type: "video",
    category: "trainingVideos",
    src: "/images/Training/Personal training videos/WhatsApp Video 2026-08-30 at 15.20.35 (1).mp4",
    title: GYM_CAPTION,
    span: "normal",
  },
  {
    id: 18,
    type: "video",
    category: "trainingVideos",
    src: "/images/Training/Personal training videos/WhatsApp Video 2026-08-30 at 15.20.35.mp4",
    title: GYM_CAPTION,
    span: "normal",
  },
  {
    id: 19,
    type: "video",
    category: "trainingVideos",
    src: "/images/Training/Personal training videos/WhatsApp Video 2026-08-30 at 15.20.36.mp4",
    title: GYM_CAPTION,
    span: "normal",
  },
  {
    id: 20,
    type: "video",
    category: "trainingVideos",
    src: "/images/Training/Personal training videos/WhatsApp Video 2026-08-30 at 15.20.37.mp4",
    title: GYM_CAPTION,
    span: "normal",
  },
  // Coaching — Syria U20 National Team
  {
    id: 21,
    type: "image",
    category: "syriaU20",
    src: "/images/Coaching/SYRIAN U20 NATIONAL TEAM/Syria U20 National Team  Strength & Conditioning Coach.jpeg",
    title: SYRIA_CAPTION,
    span: "tall",
  },
  {
    id: 22,
    type: "image",
    category: "syriaU20",
    src: "/images/Coaching/SYRIAN U20 NATIONAL TEAM/WhatsApp Image 2026-08-30 at 15.43.06 (1).jpeg",
    title: SYRIA_CAPTION,
    span: "normal",
  },
  {
    id: 23,
    type: "image",
    category: "syriaU20",
    src: "/images/Coaching/SYRIAN U20 NATIONAL TEAM/WhatsApp Image 2026-08-30 at 15.43.06 (2).jpeg",
    title: SYRIA_CAPTION,
    span: "normal",
  },
  {
    id: 24,
    type: "image",
    category: "syriaU20",
    src: "/images/Coaching/SYRIAN U20 NATIONAL TEAM/WhatsApp Image 2026-08-30 at 15.43.06 (3).jpeg",
    title: SYRIA_CAPTION,
    span: "normal",
  },
  {
    id: 25,
    type: "image",
    category: "syriaU20",
    src: "/images/Coaching/SYRIAN U20 NATIONAL TEAM/WhatsApp Image 2026-08-30 at 15.43.06 (4).jpeg",
    title: SYRIA_CAPTION,
    span: "normal",
  },
  {
    id: 26,
    type: "image",
    category: "syriaU20",
    src: "/images/Coaching/SYRIAN U20 NATIONAL TEAM/WhatsApp Image 2026-08-30 at 15.43.06 (5).jpeg",
    title: SYRIA_CAPTION,
    span: "normal",
  },
  {
    id: 27,
    type: "image",
    category: "syriaU20",
    src: "/images/Coaching/SYRIAN U20 NATIONAL TEAM/WhatsApp Image 2026-08-30 at 15.43.06.jpeg",
    title: SYRIA_CAPTION,
    span: "normal",
  },
  // Coaching — El Palmar CF
  {
    id: 28,
    type: "image",
    category: "elPalmarCF",
    src: "/images/Coaching/EL PALMAR CF/El Palmar CF First Team  Assistant Strength & Conditioning Coach  3ª RFEF  2025.jpeg",
    title: EL_PALMAR_CAPTION,
    span: "tall",
  },
  {
    id: 29,
    type: "image",
    category: "elPalmarCF",
    src: "/images/Coaching/EL PALMAR CF/WhatsApp Image 2026-08-30 at 15.39.23 (1).jpeg",
    title: EL_PALMAR_CAPTION,
    span: "normal",
  },
  {
    id: 30,
    type: "image",
    category: "elPalmarCF",
    src: "/images/Coaching/EL PALMAR CF/WhatsApp Image 2026-08-30 at 15.39.23 (2).jpeg",
    title: EL_PALMAR_CAPTION,
    span: "normal",
  },
  // Coaching — CDE Fuenlabrada Atlantis
  {
    id: 31,
    type: "image",
    category: "fuenlabradaAtlantis",
    src: "/images/Coaching/CDE FUENLABRADA ATLANTIS/Academy Head Coach & Strength and Conditioning Coach.jpeg",
    title: FUENLABRADA_CAPTION,
    span: "tall",
  },
  // Certificates
  {
    id: 32,
    type: "image",
    category: "certificates",
    src: "/images/Certificates/Bachelor degree.jpg",
    title: "Bachelor's Degree — UCAM",
    span: "tall",
  },
  {
    id: 33,
    type: "image",
    category: "certificates",
    src: "/images/Certificates/master-degree-graduation.jpeg",
    title: "Master's Degree — UCAM",
    span: "tall",
  },
  {
    id: 34,
    type: "image",
    category: "certificates",
    src: "/images/Certificates/uefa-c-diploma.jpeg",
    title: "UEFA C Coaching Diploma",
    span: "tall",
  },
  {
    id: 35,
    type: "image",
    category: "certificates",
    src: "/images/Certificates/FIFA DIPLOMA IN FOOTBALL MEDICINE - FIFA.jpeg",
    title: "FIFA Diploma in Football Medicine",
    span: "normal",
  },
  {
    id: 36,
    type: "image",
    category: "certificates",
    src: "/images/Certificates/barca-innovation-hub.jpeg",
    title: "Strength Training — Barça Innovation Hub",
    span: "normal",
  },
];

const RANDOM_ALL_COUNT = 6;

function pickRandomItems(items: GalleryItem[], count: number): GalleryItem[] {
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

const mainFilterKeys: MainCategory[] = ["all", "coaching", "training", "certificates"];

export default function Gallery() {
  const t = useTranslations("gallery");

  const [activeMain, setActiveMain] = useState<MainCategory>("all");
  const [activeSub, setActiveSub] = useState<SubCategory | null>(null);
  const [randomAllItems, setRandomAllItems] = useState<GalleryItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [lightbox, setLightbox] = useState<{
    open: boolean;
    item: GalleryItem | null;
    index: number;
  }>({ open: false, item: null, index: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (activeMain === "all") {
      setRandomAllItems(pickRandomItems(galleryItems, RANDOM_ALL_COUNT));
    }
  }, [activeMain]);

  const filtered =
    activeMain === "all"
      ? randomAllItems
      : activeSub
      ? galleryItems.filter((i) => i.category === activeSub)
      : galleryItems.filter((i) => mainCategoryOf[i.category] === activeMain);

  const subTabs = subTabsByMain[activeMain];

  const openLightbox = useCallback((item: GalleryItem, index: number) => {
    setLightbox({ open: true, item, index });
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox({ open: false, item: null, index: 0 });
    document.body.style.overflow = "";
  }, []);

  const navigateLightbox = useCallback(
    (dir: "prev" | "next") => {
      const newIndex =
        dir === "prev"
          ? (lightbox.index - 1 + filtered.length) % filtered.length
          : (lightbox.index + 1) % filtered.length;
      setLightbox({
        open: true,
        item: filtered[newIndex],
        index: newIndex,
      });
    },
    [lightbox.index, filtered]
  );

  return (
    <section
      id="gallery"
      className="section-padding bg-neutral-950 relative overflow-hidden"
    >
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-green-500/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title={t("sectionTitle")}
          subtitle={t("sectionSubtitle")}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {mainFilterKeys.map((key) => (
            <button
              key={key}
              onClick={() => {
                if (key === "all") {
                  setRandomAllItems(pickRandomItems(galleryItems, RANDOM_ALL_COUNT));
                }
                setActiveMain(key);
                setActiveSub(null);
              }}
              className={`relative px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeMain === key
                  ? "text-black"
                  : "text-white/50 border border-white/10 bg-white/3 hover:text-white hover:border-white/20"
              }`}
            >
              {activeMain === key && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 rounded-xl bg-linear-to-r from-green-500 to-emerald-600"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative z-10">
                {t(`filters.${key}` as FilterKey)}
              </span>
            </button>
          ))}
        </motion.div>

        {subTabs && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-wrap justify-center gap-2 mb-10 -mt-4"
          >
            {subTabs.map((sub) => (
              <button
                key={sub}
                onClick={() => setActiveSub(activeSub === sub ? null : sub)}
                className={`relative px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  activeSub === sub
                    ? "text-black"
                    : "text-white/40 border border-white/8 bg-white/3 hover:text-white hover:border-white/20"
                }`}
              >
                {activeSub === sub && (
                  <motion.div
                    layoutId="activeSubFilter"
                    className="absolute inset-0 rounded-lg bg-green-500/80"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">
                  {t(`filters.${sub}` as FilterKey)}
                </span>
              </button>
            ))}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeMain}-${activeSub ?? "all"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
          >
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="break-inside-avoid"
              >
                {item.type === "video" ? (
                  <VideoCard
                    src={item.src}
                    thumbnail={item.thumbnail}
                    title={item.title}
                    category={t(`filters.${item.category}` as FilterKey)}
                    onClick={() => openLightbox(item, i)}
                    index={i}
                    playLabel={t("playVideo")}
                  />
                ) : (
                  <button
                    onClick={() => openLightbox(item, i)}
                    aria-label={item.title}
                    className="group relative rounded-2xl overflow-hidden border border-white/8 bg-neutral-900 cursor-pointer w-full text-left"
                  >
                    <div
                      className={`relative w-full overflow-hidden bg-neutral-900 ${
                        item.span === "tall" ? "aspect-3/4" : "aspect-4/3"
                      }`}
                    >
                      <Image
                        src={item.src}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <ZoomIn size={18} className="text-white" />
                        </div>
                      </div>
                    </div>

                    <div className="px-4 py-3 border-t border-white/5">
                      <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">
                        {t(`filters.${item.category}` as FilterKey)}
                      </span>
                      <p className="text-white/80 text-sm font-medium mt-0.5">
                        {item.title}
                      </p>
                    </div>
                  </button>
                )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {mounted && filtered.length === 0 && (
          <div className="text-center py-20 text-white/30">
            <p className="text-lg">{t("noItems")}</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {lightbox.open && lightbox.item && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-100 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              aria-label={t("closeLabel")}
              className="absolute top-4 right-4 w-10 h-10 rounded-full border border-white/10 bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors z-10"
            >
              <X size={18} />
            </button>

            {filtered.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateLightbox("prev");
                  }}
                  aria-label={t("prevLabel")}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/10 bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors z-10"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateLightbox("next");
                  }}
                  aria-label={t("nextLabel")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/10 bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors z-10"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}

            <motion.div
              key={lightbox.item.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[85vh] rounded-2xl overflow-hidden border border-white/10 bg-neutral-950"
            >
              {lightbox.item.type === "video" ? (
                <video
                  src={lightbox.item.src}
                  controls
                  autoPlay
                  className="w-full max-h-[75vh] object-contain bg-black"
                />
              ) : (
                <div className="relative w-full aspect-video bg-neutral-900">
                  <Image
                    src={lightbox.item.src}
                    alt={lightbox.item.title}
                    fill
                    sizes="100vw"
                    className="object-contain"
                  />
                </div>
              )}

              <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold text-sm">
                    {lightbox.item.title}
                  </p>
                  <p className="text-white/40 text-xs mt-0.5">
                    {t(`filters.${lightbox.item.category}` as FilterKey)}
                  </p>
                </div>
                <span className="text-white/30 text-xs">
                  {lightbox.index + 1} / {filtered.length}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}