/** Single source of truth for public contact details and links. */
export const SITE = {
  name: "Karim Boudabous",
  email: "karimboudabous04@gmail.com",
  phone: "+34 666 850 841",
  phoneHref: "+34666850841",
  /**
   * Public URL of the deployed site (used for canonical/OG/sitemap URLs).
   * Set NEXT_PUBLIC_SITE_URL in the hosting environment.
   */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/$/,
    ""
  ),
  socials: {
    linkedin: "https://www.linkedin.com/in/karim-boudabous-a389902b3",
    instagram: "https://www.instagram.com/karimboudabous.coach/",
    tiktok: "https://www.tiktok.com/@karimboudabous.coach",
  },
} as const;
