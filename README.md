# Karim Boudabous — Sports Science & Elite Performance Portfolio

A multilingual portfolio for **Karim Boudabous**: Strength & Conditioning Coach, UEFA C Football Coach and Personal Trainer.

Built with **Next.js 16**, **Tailwind CSS v4**, **Framer Motion**, **Radix UI** and **next-intl**.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack, statically generated per locale)
- **Styling**: Tailwind CSS v4 (theme tokens live in `src/app/[locale]/globals.css`)
- **Animations**: Framer Motion (respects the OS "reduce motion" setting)
- **Accessible primitives**: Radix UI Dialog (booking form, gallery lightbox)
- **UI patterns**: Magic UI / Aceternity-style spotlight cards, marquee, number ticker, scroll progress, shine buttons (`src/components/ui/`)
- **i18n**: next-intl (EN / ES / FR)
- **Email**: Nodemailer (Gmail)
- **Language**: TypeScript

---

## Sections

| Section | Description |
|---------|-------------|
| Hero | Split intro with portrait, roles and key stats |
| Partners | Marquee of clubs and institutions |
| About | Academic foundation, coaching philosophy & vision |
| Services | Personal Training, Football Coaching, S&C |
| Experience | Timeline, roles grouped by company |
| Gallery | Filterable masonry grid with keyboard-friendly lightbox |
| Education | Degrees, certificates and in-progress credentials |
| Contact | Validated form + contact details and socials |

---

## Getting Started

### Prerequisites
- Node.js v20+
- npm v10+

### Installation
```bash
git clone https://github.com/AchrafBoudabous/karim-portfolio.git
cd karim-portfolio
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Purpose |
|----------|---------|
| `EMAIL_USER` | Gmail address that sends and receives form notifications |
| `EMAIL_PASS` | Gmail **App password** for that account |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (canonical/OG links, `robots.txt`, `sitemap.xml`) |

### Build for Production
```bash
npm run build
npm start
```

---

## Editing content

| What | Where |
|------|-------|
| All page text (3 languages) | `src/dictionaries/{en,es,fr}.json` — keep the same keys in every file |
| Gallery photos/videos | `src/data/gallery.ts` (captions are keys in `gallery.captions`) |
| Email, phone, social links | `src/lib/site.ts` |

Experience entries can be a single role or a company with several `roles` — see the
`CDE Fuenlabrada Atlantis` entry in the dictionaries.

Avoid `&` in media file names: Next.js' image optimizer returns 404 for them. Prefer simple names (letters, digits, hyphens).

---

## Security

- Form endpoints (`/api/contact`, `/api/booking`) enforce same-origin requests, JSON only,
  a 16 KB body limit, per-IP and global rate limits, a honeypot field, and shared server-side
  validation (`src/lib/validation.ts`).
- Auto-reply emails never echo visitor-supplied text, so the forms cannot be used to send
  arbitrary content from the Gmail account; each address receives at most 2 auto-replies/hour.
- Strict security headers (CSP without `unsafe-eval` in production, HSTS, frame denial,
  COOP, Permissions-Policy) are set in `next.config.ts`.
- Rate limiting is in-memory per server instance. For a hard global quota on serverless
  hosting, back it with a shared store (e.g. Upstash Redis).

---

## License

This project is private. All rights reserved.
