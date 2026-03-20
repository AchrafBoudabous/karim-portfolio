"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import SectionTitle from "@/components/ui/SectionTitle";
import VideoCard from "@/components/ui/VideoCard";

type MediaType = "image" | "video";
type Category = "all" | "training" | "coaching" | "certificates";

interface GalleryItem {
  id: number;
  type: MediaType;
  category: Exclude<Category, "all">;
  src: string;
  thumbnail?: string;
  title: string;
  span?: "normal" | "wide" | "tall";
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    type: "image",
    category: "training",
    src: "/images/gallery/training-1.jpg",
    title: "Sandbag Training Session",
    span: "wide",
  },
  {
    id: 2,
    type: "image",
    category: "training",
    src: "/images/gallery/training-2.jpg",
    title: "Dumbbell Coaching",
    span: "normal",
  },
  {
    id: 3,
    type: "image",
    category: "training",
    src: "/images/gallery/training-3.jpg",
    title: "Gym Floor Session",
    span: "tall",
  },
  {
    id: 4,
    type: "image",
    category: "training",
    src: "/images/gallery/training-4.jpg",
    title: "Bench Press Supervision",
    span: "normal",
  },
  {
    id: 5,
    type: "image",
    category: "certificates",
    src: "/images/gallery/ucam-degree.jpg",
    title: "Bachelor's Degree — UCAM Graduation",
    span: "normal",
  },
  {
    id: 6,
    type: "video",
    category: "training",
    src: "/videos/session-1.mp4",
    title: "Training Session",
    span: "normal",
  },
  {
    id: 7,
    type: "video",
    category: "training",
    src: "/videos/session-2.mp4",
    title: "Training Session",
    span: "normal",
  },
];

const filterKeys: Category[] = ["all", "training", "coaching", "certificates"];

export default function Gallery() {
  const t = useTranslations("gallery");

  const [activeFilter, setActiveFilter] = useState<Category>("all");
  const [lightbox, setLightbox] = useState<{
    open: boolean;
    item: GalleryItem | null;
    index: number;
  }>({ open: false, item: null, index: 0 });

  const filtered =
    activeFilter === "all"
      ? galleryItems
      : galleryItems.filter((i) => i.category === activeFilter);

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
          {filterKeys.map((key) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`relative px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeFilter === key
                  ? "text-black"
                  : "text-white/50 border border-white/10 bg-white/3 hover:text-white hover:border-white/20"
              }`}
            >
              {activeFilter === key && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 rounded-xl bg-linear-to-r from-green-500 to-emerald-600"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative z-10">
                {t(
                  `filters.${key}` as
                    | "filters.all"
                    | "filters.training"
                    | "filters.coaching"
                    | "filters.certificates"
                )}
              </span>
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
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
                    category={item.category}
                    onClick={() => openLightbox(item, i)}
                    index={i}
                    playLabel={t("playVideo")}
                  />
                ) : (
                  <div
                    onClick={() => openLightbox(item, i)}
                    className="group relative rounded-2xl overflow-hidden border border-white/8 bg-neutral-900 cursor-pointer"
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
                        {item.category}
                      </span>
                      <p className="text-white/80 text-sm font-medium mt-0.5">
                        {item.title}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-white/30">
            <p className="text-lg">No items found.</p>
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/10 bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors z-10"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateLightbox("next");
                  }}
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
                  <p className="text-white/40 text-xs capitalize mt-0.5">
                    {lightbox.item.category}
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