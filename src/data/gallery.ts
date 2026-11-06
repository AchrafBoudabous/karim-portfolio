export type MediaType = "image" | "video";

export type SubCategory =
  | "trainingPhotos"
  | "trainingVideos"
  | "syriaU20"
  | "elPalmarCF"
  | "fuenlabradaAtlantis"
  | "certificates";

export type MainCategory = "all" | "coaching" | "training" | "certificates";

export const MAIN_CATEGORIES: MainCategory[] = ["all", "coaching", "training", "certificates"];

export const mainCategoryOf: Record<SubCategory, Exclude<MainCategory, "all">> = {
  trainingPhotos: "training",
  trainingVideos: "training",
  syriaU20: "coaching",
  elPalmarCF: "coaching",
  fuenlabradaAtlantis: "coaching",
  certificates: "certificates",
};

export const subTabsByMain: Partial<Record<MainCategory, SubCategory[]>> = {
  coaching: ["fuenlabradaAtlantis", "syriaU20", "elPalmarCF"],
  training: ["trainingPhotos", "trainingVideos"],
};

/**
 * Caption = optional role prefix + description, both keys of
 * `gallery.captions` in the dictionaries.
 */
export interface GalleryItem {
  id: string;
  type: MediaType;
  category: SubCategory;
  src: string;
  caption: string;
  role?: string;
  tall?: boolean;
  /** Shown on the "All" tab. */
  featured?: boolean;
}

const TRAINING = "/images/Training/Personal training pictures";
const VIDEOS = "/images/Training/Personal training videos";
const SYRIA = "/images/Coaching/SYRIAN U20 NATIONAL TEAM";
const PALMAR = "/images/Coaching/EL PALMAR CF";
const FUEN = "/images/Coaching/CDE FUENLABRADA ATLANTIS";
const CERTS = "/images/Certificates";

const gym = (file: string, featured = false): GalleryItem => ({
  id: `gym-${file}`,
  type: "image",
  category: "trainingPhotos",
  src: `${TRAINING}/${file}`,
  caption: "gym",
  featured,
});

const video = (file: string, featured = false): GalleryItem => ({
  id: `video-${file}`,
  type: "video",
  category: "trainingVideos",
  src: `${VIDEOS}/${file}`,
  caption: "gym",
  featured,
});

export const galleryItems: GalleryItem[] = [
  // Coaching — CDE Fuenlabrada Atlantis
  { id: "fuen-main", type: "image", category: "fuenlabradaAtlantis", src: `${FUEN}/Academy Head Coach & Strength and Conditioning Coach.jpeg`, caption: "fuenlabrada", tall: true },
  { id: "u15-win", type: "image", category: "fuenlabradaAtlantis", src: `${FUEN}/Under 15/WhatsApp Image 2026-11-06 at 10.44.44 (3).jpeg`, role: "u15Role", caption: "u15Win", featured: true },
  { id: "u15-instructions", type: "image", category: "fuenlabradaAtlantis", src: `${FUEN}/Under 15/WhatsApp Image 2026-11-06 at 10.44.44 (1).jpeg`, role: "u15Role", caption: "u15Instructions", featured: true },
  { id: "u15-area", type: "image", category: "fuenlabradaAtlantis", src: `${FUEN}/Under 15/WhatsApp Image 2026-11-06 at 10.44.44.jpeg`, role: "u15Role", caption: "u15TechnicalArea" },
  { id: "u15-talk", type: "image", category: "fuenlabradaAtlantis", src: `${FUEN}/Under 15/WhatsApp Image 2026-11-06 at 10.44.44 (2).jpeg`, role: "u15Role", caption: "u15TeamTalk" },
  { id: "u19-celebration", type: "image", category: "fuenlabradaAtlantis", src: `${FUEN}/Under 19/WhatsApp Image 2026-11-06 at 10.45.04.jpeg`, role: "u19Role", caption: "u19Celebration", featured: true },
  { id: "u19-coaching", type: "image", category: "fuenlabradaAtlantis", src: `${FUEN}/Under 19/WhatsApp Image 2026-11-06 at 10.45.04 (2).jpeg`, role: "u19Role", caption: "u19Coaching", tall: true, featured: true },
  { id: "u19-feedback", type: "image", category: "fuenlabradaAtlantis", src: `${FUEN}/Under 19/WhatsApp Image 2026-11-06 at 10.45.04 (4).jpeg`, role: "u19Role", caption: "u19Feedback" },
  { id: "u19-staff", type: "image", category: "fuenlabradaAtlantis", src: `${FUEN}/Under 19/WhatsApp Image 2026-11-06 at 10.45.04 (1).jpeg`, role: "u19Role", caption: "u19Staff" },
  { id: "u19-focus", type: "image", category: "fuenlabradaAtlantis", src: `${FUEN}/Under 19/WhatsApp Image 2026-11-06 at 10.45.04 (3).jpeg`, role: "u19Role", caption: "u19Focus" },
  { id: "u12-encourage", type: "image", category: "fuenlabradaAtlantis", src: `${FUEN}/Under 12/WhatsApp Image 2026-11-06 at 10.46.33 (3).jpeg`, role: "u12Role", caption: "u12Encourage", tall: true, featured: true },
  { id: "u12-lineup", type: "image", category: "fuenlabradaAtlantis", src: `${FUEN}/Under 12/WhatsApp Image 2026-11-06 at 10.46.33 (2).jpeg`, role: "u12Role", caption: "u12Lineup" },
  { id: "u12-training", type: "image", category: "fuenlabradaAtlantis", src: `${FUEN}/Under 12/WhatsApp Image 2026-11-06 at 10.46.33.jpeg`, role: "u12Role", caption: "u12Training", tall: true },
  { id: "u12-matchday", type: "image", category: "fuenlabradaAtlantis", src: `${FUEN}/Under 12/WhatsApp Image 2026-11-06 at 10.46.34.jpeg`, role: "u12Role", caption: "u12MatchDay" },
  { id: "u12-drill", type: "image", category: "fuenlabradaAtlantis", src: `${FUEN}/Under 12/WhatsApp Image 2026-11-06 at 10.46.33 (1).jpeg`, role: "u12Role", caption: "u12Drill", tall: true },

  // Coaching — Syria U20
  { id: "syria-main", type: "image", category: "syriaU20", src: `${SYRIA}/syria-u20-strength-conditioning-coach.jpeg`, caption: "syria", tall: true, featured: true },
  ...["(1)", "(2)", "(3)", "(4)", "(5)", ""].map(
    (n): GalleryItem => ({
      id: `syria-${n || "0"}`,
      type: "image",
      category: "syriaU20",
      src: `${SYRIA}/WhatsApp Image 2026-08-30 at 15.43.06${n ? ` ${n}` : ""}.jpeg`,
      caption: "syriaShort",
    })
  ),

  // Coaching — El Palmar CF
  { id: "palmar-main", type: "image", category: "elPalmarCF", src: `${PALMAR}/el-palmar-cf-first-team-assistant-sc-coach.jpeg`, caption: "elPalmar", tall: true, featured: true },
  { id: "palmar-1", type: "image", category: "elPalmarCF", src: `${PALMAR}/WhatsApp Image 2026-08-30 at 15.39.23 (1).jpeg`, caption: "elPalmarShort" },
  { id: "palmar-2", type: "image", category: "elPalmarCF", src: `${PALMAR}/WhatsApp Image 2026-08-30 at 15.39.23 (2).jpeg`, caption: "elPalmarShort" },

  // Training — photos
  gym("WhatsApp Image 2026-08-30 at 15.10.37.jpeg", true),
  ...[
    "15.10.48 (1)", "15.10.48 (10)", "15.10.48 (11)", "15.10.48 (2)", "15.10.48 (3)",
    "15.10.48 (4)", "15.10.48 (5)", "15.10.48 (6)", "15.10.48 (7)", "15.10.48 (8)",
    "15.10.48 (9)", "15.10.48", "15.10.49 (1)", "15.10.49",
  ].map((s) => gym(`WhatsApp Image 2026-08-30 at ${s}.jpeg`)),

  // Training — videos
  video("WhatsApp Video 2026-08-30 at 15.20.34.mp4", true),
  video("WhatsApp Video 2026-08-30 at 15.20.35 (1).mp4"),
  video("WhatsApp Video 2026-08-30 at 15.20.35.mp4"),
  video("WhatsApp Video 2026-08-30 at 15.20.36.mp4"),
  video("WhatsApp Video 2026-08-30 at 15.20.37.mp4"),

  // Certificates
  { id: "cert-bachelor", type: "image", category: "certificates", src: `${CERTS}/Bachelor degree.jpg`, caption: "bachelor", tall: true },
  { id: "cert-master", type: "image", category: "certificates", src: `${CERTS}/master-degree-graduation.jpeg`, caption: "master", tall: true, featured: true },
  { id: "cert-uefa", type: "image", category: "certificates", src: `${CERTS}/uefa-c-diploma.jpeg`, caption: "uefaC", tall: true },
  { id: "cert-fifa", type: "image", category: "certificates", src: `${CERTS}/FIFA DIPLOMA IN FOOTBALL MEDICINE - FIFA.jpeg`, caption: "fifa" },
  { id: "cert-barca", type: "image", category: "certificates", src: `${CERTS}/barca-innovation-hub.jpeg`, caption: "barcaStrength" },
];
