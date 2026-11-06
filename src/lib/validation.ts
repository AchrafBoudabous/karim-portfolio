/**
 * Shared form validation used by both the client forms and the API routes.
 *
 * Validators return error *codes* (not messages) so the client can show
 * translated messages and the server never has to know the UI language.
 */

export type ErrorCode =
  | "required"
  | "tooShort"
  | "tooLong"
  | "invalid"
  | "past"
  | "tooFar";

export const LIMITS = {
  nameMin: 2,
  nameMax: 100,
  emailMax: 254,
  contactMessageMin: 10,
  contactMessageMax: 2000,
  bookingMessageMax: 1000,
  phoneDigitsMin: 7,
  phoneDigitsMax: 15,
  phoneMax: 20,
  bookingDaysAhead: 365,
} as const;

/** Booking options are sent as stable keys, never as translated labels. */
export const SERVICE_KEYS = ["pt", "football", "sc", "discovery"] as const;
export const SESSION_TYPE_KEYS = ["inPerson", "online"] as const;

export type ServiceKey = (typeof SERVICE_KEYS)[number];
export type SessionTypeKey = (typeof SESSION_TYPE_KEYS)[number];

// Letters from any script (Arabic, Latin, accented…), combining marks,
// spaces, apostrophes, hyphens and dots — e.g. "Karim", "José-María", "كريم".
const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}\s.'’-]*$/u;
// Pragmatic email check: no whitespace or characters that are meaningful in
// email headers, and a TLD of at least two characters.
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:".]{2,}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

const str = (v: unknown): string => (typeof v === "string" ? v : "");

export function validateName(value: unknown): ErrorCode | undefined {
  const v = str(value).trim();
  if (!v) return "required";
  if (v.length < LIMITS.nameMin) return "tooShort";
  if (v.length > LIMITS.nameMax) return "tooLong";
  if (!NAME_RE.test(v)) return "invalid";
}

export function validateEmail(value: unknown): ErrorCode | undefined {
  const v = str(value).trim();
  if (!v) return "required";
  if (v.length > LIMITS.emailMax) return "tooLong";
  if (!EMAIL_RE.test(v)) return "invalid";
}

export function validatePhone(value: unknown): ErrorCode | undefined {
  const v = str(value).trim();
  if (!v) return; // optional
  if (v.length > LIMITS.phoneMax) return "tooLong";
  if (!/^\+?[\d\s()-]+$/.test(v)) return "invalid";
  const digits = v.replace(/\D/g, "");
  if (digits.length < LIMITS.phoneDigitsMin) return "tooShort";
  if (digits.length > LIMITS.phoneDigitsMax) return "tooLong";
}

function todayIso(): string {
  // Allow "today" in any timezone: compare against yesterday in UTC.
  const d = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return d.toISOString().slice(0, 10);
}

export function validateDate(value: unknown): ErrorCode | undefined {
  const v = str(value).trim();
  if (!v) return; // optional
  if (!DATE_RE.test(v) || Number.isNaN(Date.parse(`${v}T00:00:00Z`))) {
    return "invalid";
  }
  if (v < todayIso()) return "past";
  const max = new Date(Date.now() + LIMITS.bookingDaysAhead * 86_400_000)
    .toISOString()
    .slice(0, 10);
  if (v > max) return "tooFar";
}

export function validateTime(value: unknown): ErrorCode | undefined {
  const v = str(value).trim();
  if (!v) return; // optional
  if (!TIME_RE.test(v)) return "invalid";
}

export function validateMessage(
  value: unknown,
  { required, min = 0, max }: { required: boolean; min?: number; max: number }
): ErrorCode | undefined {
  const v = str(value).trim();
  if (!v) return required ? "required" : undefined;
  if (v.length < min) return "tooShort";
  if (v.length > max) return "tooLong";
}

function validateChoice(
  value: unknown,
  allowed: readonly string[]
): ErrorCode | undefined {
  const v = str(value);
  if (!v) return "required";
  if (!allowed.includes(v)) return "invalid";
}

type Errors<K extends string> = Partial<Record<K, ErrorCode>>;

function compact<K extends string>(errors: Errors<K>): Errors<K> {
  return Object.fromEntries(
    Object.entries(errors).filter(([, v]) => v !== undefined)
  ) as Errors<K>;
}

/* ---------- Contact form ---------- */

export interface ContactInput {
  name: string;
  email: string;
  message: string;
}
export type ContactField = keyof ContactInput;

export function validateContact(data: Partial<Record<ContactField, unknown>>) {
  return compact<ContactField>({
    name: validateName(data.name),
    email: validateEmail(data.email),
    message: validateMessage(data.message, {
      required: true,
      min: LIMITS.contactMessageMin,
      max: LIMITS.contactMessageMax,
    }),
  });
}

/* ---------- Booking form ---------- */

export interface BookingInput {
  service: ServiceKey | "";
  sessionType: SessionTypeKey | "";
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
}
export type BookingField = keyof BookingInput;

export function validateBooking(data: Partial<Record<BookingField, unknown>>) {
  return compact<BookingField>({
    service: validateChoice(data.service, SERVICE_KEYS),
    sessionType: validateChoice(data.sessionType, SESSION_TYPE_KEYS),
    name: validateName(data.name),
    email: validateEmail(data.email),
    phone: validatePhone(data.phone),
    preferredDate: validateDate(data.preferredDate),
    preferredTime: validateTime(data.preferredTime),
    message: validateMessage(data.message, {
      required: false,
      max: LIMITS.bookingMessageMax,
    }),
  });
}
