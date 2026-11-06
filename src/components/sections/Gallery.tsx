"use client";

import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import SectionTitle from "@/components/ui/SectionTitle";
import VideoCard from "@/components/ui/VideoCard";
import {
  galleryItems,
  MAIN_CATEGORIES,
  mainCategoryOf,
  subTabsByMain,
  type GalleryItem,
  type MainCategory,
  type SubCategory,
} from "@/data/gallery";
import { cn } from "@/lib/utils";

const MAX_STAGGER = 8;

export default function Gallery() {
  const t = useTranslations("gallery");

  const [activeMain, setActiveMain] = useState<MainCategory>("all");
  const [activeSub, setActiveSub] = useState<SubCategory | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const caption = useCallback(
    (item: GalleryItem) => {
      const text = t(`captions.${item.caption}` as "captions.gym");
      return item.role ? `${t(`captions.${item.role}` as "captions.gym")} | ${text}` : text;
    },
    [t]
  );
  const categoryLabel = (c: SubCategory | MainCategory) => t(`filters.${c}` as "filters.all");

  // Deterministic "All" view (featured items) — no random order, so the
  // server and client render the same thing.
  const filtered = useMemo(() => {
    if (activeMain === "all") return galleryItems.filter((i) => i.featured);
    if (activeSub) return galleryItems.filter((i) => i.category === activeSub);
    return galleryItems.filter((i) => mainCategoryOf[i.category] === activeMain);
  }, [activeMain, activeSub]);

  const subTabs = subTabsByMain[activeMain];
  const current = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  const step = useCallback(
    (dir: 1 | -1) =>
      setLightboxIndex((i) => (i === null ? i : (i + dir + filtered.length) % filtered.length)),
    [filtered.length]
  );

  const tabClass = (active: boolean, small = false) =>
    cn(
      "relative font-medium transition-colors duration-200",
      small ? "rounded-lg px-4 py-1.5 text-xs" : "rounded-xl px-5 py-2 text-sm",
      active
        ? "text-black"
        : "border border-white/10 bg-white/3 text-white/65 hover:border-white/25 hover:text-white"
    );

  return (
    <section id="gallery" className="section-padding relative overflow-hidden bg-neutral-950">
      <div aria-hidden className="pointer-events-none absolute right-0 top-1/3 h-80 w-80 rounded-full bg-green-500/5 blur-3xl" />

      <div className="mx-auto max-w-7xl">
        <SectionTitle title={t("sectionTitle")} subtitle={t("sectionSubtitle")} />

        <div role="tablist" aria-label={t("sectionTitle")} className="mb-10 flex flex-wrap justify-center gap-2">
          {MAIN_CATEGORIES.map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={activeMain === key}
              onClick={() => {
                setActiveMain(key);
                setActiveSub(null);
              }}
              className={tabClass(activeMain === key)}
            >
              {activeMain === key && (
                <motion.span
                  layoutId="activeFilter"
                  className="absolute inset-0 rounded-xl bg-linear-to-r from-green-500 to-emerald-600"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative">{categoryLabel(key)}</span>
            </button>
          ))}
        </div>

        {subTabs && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="-mt-4 mb-10 flex flex-wrap justify-center gap-2"
          >
            {subTabs.map((sub) => (
              <button
                key={sub}
                type="button"
                aria-pressed={activeSub === sub}
                onClick={() => setActiveSub(activeSub === sub ? null : sub)}
                className={tabClass(activeSub === sub, true)}
              >
                {activeSub === sub && (
                  <motion.span
                    layoutId="activeSubFilter"
                    className="absolute inset-0 rounded-lg bg-green-500/85"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative">{categoryLabel(sub)}</span>
              </button>
            ))}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.ul
            key={`${activeMain}-${activeSub ?? "all"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3"
          >
            {filtered.map((item, i) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(i, MAX_STAGGER) * 0.05 }}
                className="break-inside-avoid"
              >
                {item.type === "video" ? (
                  <VideoCard
                    src={item.src}
                    title={caption(item)}
                    category={categoryLabel(item.category)}
                    onClick={() => setLightboxIndex(i)}
                    playLabel={t("playVideo")}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(i)}
                    className="group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 text-left transition-colors hover:border-green-500/30"
                  >
                    <span
                      className={cn(
                        "relative block w-full overflow-hidden bg-neutral-900",
                        item.tall ? "aspect-3/4" : "aspect-4/3"
                      )}
                    >
                      <Image
                        src={item.src}
                        alt={caption(item)}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <span aria-hidden className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/40">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                          <ZoomIn size={18} className="text-white" />
                        </span>
                      </span>
                    </span>
                    <span className="block border-t border-white/5 px-4 py-3">
                      <span className="block text-xs font-semibold uppercase tracking-wider text-green-400">
                        {categoryLabel(item.category)}
                      </span>
                      <span className="mt-0.5 block text-sm font-medium text-white/85">{caption(item)}</span>
                    </span>
                  </button>
                )}
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>

        {filtered.length === 0 && (
          <p className="py-20 text-center text-lg text-white/50">{t("noItems")}</p>
        )}
      </div>

      {/* Lightbox */}
      <Dialog.Root open={current !== null} onOpenChange={(o) => !o && setLightboxIndex(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-170 bg-black/95 backdrop-blur-xl" />
          <Dialog.Content
            aria-describedby={undefined}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") step(1);
              if (e.key === "ArrowLeft") step(-1);
            }}
            className="fixed inset-0 z-171 flex items-center justify-center p-4 outline-none"
            onClick={() => setLightboxIndex(null)}
          >
            <Dialog.Title className="sr-only">{t("dialogLabel")}</Dialog.Title>
            <Dialog.Close
              aria-label={t("closeLabel")}
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
            >
              <X size={18} aria-hidden />
            </Dialog.Close>

            {filtered.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                  aria-label={t("prevLabel")}
                  className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white sm:left-6"
                >
                  <ChevronLeft size={20} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                  aria-label={t("nextLabel")}
                  className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white sm:right-6"
                >
                  <ChevronRight size={20} aria-hidden />
                </button>
              </>
            )}

            {current && (
              <motion.figure
                key={current.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-neutral-950"
              >
                {current.type === "video" ? (
                  <video
                    src={encodeURI(current.src)}
                    controls
                    autoPlay
                    playsInline
                    className="max-h-[75vh] w-full bg-black object-contain"
                  />
                ) : (
                  <div className="relative h-[75vh] w-full bg-neutral-900">
                    <Image
                      src={current.src}
                      alt={caption(current)}
                      fill
                      sizes="100vw"
                      className="object-contain"
                    />
                  </div>
                )}
                <figcaption className="flex items-center justify-between gap-4 border-t border-white/5 px-5 py-4">
                  <div>
                    <p className="text-sm font-semibold text-white">{caption(current)}</p>
                    <p className="mt-0.5 text-xs text-white/55">{categoryLabel(current.category)}</p>
                  </div>
                  <span className="shrink-0 text-xs tabular-nums text-white/50">
                    {(lightboxIndex ?? 0) + 1} / {filtered.length}
                  </span>
                </figcaption>
              </motion.figure>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
