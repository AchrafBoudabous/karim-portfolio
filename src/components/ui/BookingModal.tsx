"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  X,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Dumbbell,
  Trophy,
  Activity,
  Phone,
  MapPin,
  Video,
  Loader2,
  Check,
} from "lucide-react";
import FormField, { Honeypot, inputClasses, type FieldState } from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import {
  LIMITS,
  SERVICE_KEYS,
  validateBooking,
  type BookingField,
  type BookingInput,
  type ErrorCode,
  type ServiceKey,
  type SessionTypeKey,
} from "@/lib/validation";
import { cn } from "@/lib/utils";

type SubmitStatus = "idle" | "loading" | "success" | "error";
type ServerError = "rateLimited" | "unavailable" | "generic";

const serviceIcons: Record<ServiceKey, React.ElementType> = {
  pt: Dumbbell,
  football: Trophy,
  sc: Activity,
  discovery: Phone,
};

const EMPTY: BookingInput = {
  service: "",
  sessionType: "",
  name: "",
  email: "",
  phone: "",
  preferredDate: "",
  preferredTime: "",
  message: "",
};

const DETAIL_FIELDS: BookingField[] = [
  "name",
  "email",
  "phone",
  "preferredDate",
  "preferredTime",
  "message",
];

function localIsoDate(offsetDays = 0) {
  const d = new Date(Date.now() + offsetDays * 86_400_000);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

export default function BookingModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations("booking");
  const tv = useTranslations("validation");

  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [serverError, setServerError] = useState<ServerError>("generic");
  const [form, setForm] = useState<BookingInput>(EMPTY);
  const [honeypot, setHoneypot] = useState("");
  const [touched, setTouched] = useState<Partial<Record<BookingField, boolean>>>({});

  const errors = validateBooking(form);

  const errorText = (field: BookingField): string | undefined => {
    const code = errors[field];
    if (!touched[field] || !code) return undefined;
    return tv(`${field}.${code}` as `name.${ErrorCode}`);
  };

  const fieldState = (field: BookingField): FieldState => {
    if (!touched[field]) return "idle";
    if (errors[field]) return "invalid";
    return form[field] ? "valid" : "idle";
  };

  const reset = () => {
    setStep(1);
    setStatus("idle");
    setForm(EMPTY);
    setHoneypot("");
    setTouched({});
  };

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
    // Reset after the exit animation so the content doesn't jump.
    if (!next) setTimeout(reset, 250);
  };

  const update =
    (field: BookingField) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.value }));

  const blur = (field: BookingField) => () =>
    setTouched((p) => ({ ...p, [field]: true }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(Object.fromEntries(DETAIL_FIELDS.map((f) => [f, true])));
    if (DETAIL_FIELDS.some((f) => errors[f])) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website: honeypot }),
      });
      if (!res.ok) {
        setServerError(
          res.status === 429 ? "rateLimited" : res.status === 503 ? "unavailable" : "generic"
        );
        setStatus("error");
        return;
      }
      setStatus("success");
      setStep(4);
    } catch {
      setServerError("generic");
      setStatus("error");
    }
  };

  const serviceLabel = form.service ? t(`services.${form.service}`) : "";
  const sessionLabel = form.sessionType ? t(form.sessionType) : "";
  const msgLen = form.message.length;

  const stepAnim = {
    initial: { opacity: 0, x: 24 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -24 },
    transition: { duration: 0.2 },
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-200 bg-black/80 backdrop-blur-md"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount aria-describedby={undefined}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                transition={{ type: "spring", damping: 26, stiffness: 260 }}
                className="fixed left-1/2 top-1/2 z-201 flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 shadow-2xl shadow-black/60 outline-none"
              >
                {/* Header */}
                <div className="relative shrink-0 bg-linear-to-r from-green-500 to-emerald-600 px-6 py-5">
                  <Dialog.Title className="font-oswald text-xl font-bold tracking-wide text-black">
                    {t("title")}
                  </Dialog.Title>
                  <p className="mt-0.5 text-sm text-black/75">{t("subtitle")}</p>
                  <Dialog.Close
                    aria-label={t("closeLabel")}
                    className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/10 text-black transition-colors hover:bg-black/20 focus-visible:outline-black"
                  >
                    <X size={16} aria-hidden />
                  </Dialog.Close>
                </div>

                {/* Steps */}
                {step < 4 && (
                  <ol className="flex shrink-0 items-center gap-2 px-6 pt-5" aria-label={t("title")}>
                    {[1, 2, 3].map((s) => (
                      <li key={s} className="flex items-center gap-2" aria-current={s === step ? "step" : undefined}>
                        <span
                          className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-300",
                            s < step && "bg-green-500 text-black",
                            s === step && "border border-green-500 bg-green-500/20 text-green-400",
                            s > step && "border border-white/10 bg-white/5 text-white/40"
                          )}
                        >
                          {s < step ? <Check size={14} aria-hidden /> : s}
                        </span>
                        <span
                          className={cn(
                            "hidden text-xs transition-colors duration-300 sm:block",
                            s === step ? "text-green-400" : "text-white/45"
                          )}
                        >
                          {t(`step${s}` as "step1")}
                        </span>
                        {s < 3 && (
                          <span
                            aria-hidden
                            className={cn(
                              "h-0.5 w-6 rounded-full transition-colors duration-300",
                              s < step ? "bg-green-500" : "bg-white/10"
                            )}
                          />
                        )}
                      </li>
                    ))}
                  </ol>
                )}

                {/* Body */}
                <div className="min-h-[280px] overflow-y-auto px-6 py-5">
                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div key="step1" {...stepAnim} className="grid grid-cols-2 gap-3">
                        {SERVICE_KEYS.map((key) => {
                          const Icon = serviceIcons[key];
                          const selected = form.service === key;
                          return (
                            <button
                              key={key}
                              type="button"
                              aria-pressed={selected}
                              onClick={() => {
                                setForm((p) => ({ ...p, service: key }));
                                setStep(2);
                              }}
                              className={cn(
                                "group rounded-xl border p-4 text-left transition-all duration-200",
                                selected
                                  ? "border-green-500/60 bg-green-500/10"
                                  : "border-white/10 bg-white/3 hover:border-green-500/35 hover:bg-green-500/5"
                              )}
                            >
                              <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-green-500/20 bg-green-500/10 transition-transform duration-200 group-hover:scale-110">
                                <Icon size={18} className="text-green-400" aria-hidden />
                              </span>
                              <span className="block text-sm font-medium leading-tight text-white">
                                {t(`services.${key}`)}
                              </span>
                            </button>
                          );
                        })}
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div key="step2" {...stepAnim} className="space-y-3">
                        <p className="mb-4 text-sm text-white/60">
                          {t("selected")}{" "}
                          <span className="font-semibold text-green-400">{serviceLabel}</span>
                        </p>
                        {(
                          [
                            { key: "inPerson", sub: "inPersonSub", icon: MapPin },
                            { key: "online", sub: "onlineSub", icon: Video },
                          ] as const
                        ).map(({ key, sub, icon: Icon }) => (
                          <button
                            key={key}
                            type="button"
                            aria-pressed={form.sessionType === key}
                            onClick={() => {
                              setForm((p) => ({ ...p, sessionType: key as SessionTypeKey }));
                              setStep(3);
                            }}
                            className={cn(
                              "flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all duration-200",
                              form.sessionType === key
                                ? "border-green-500/60 bg-green-500/10"
                                : "border-white/10 bg-white/3 hover:border-green-500/35 hover:bg-green-500/5"
                            )}
                          >
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-green-500/20 bg-green-500/10">
                              <Icon size={18} className="text-green-400" aria-hidden />
                            </span>
                            <span>
                              <span className="block text-sm font-semibold text-white">{t(key)}</span>
                              <span className="mt-0.5 block text-xs text-white/55">{t(sub)}</span>
                            </span>
                            <ChevronRight size={16} className="ml-auto text-white/40" aria-hidden />
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="mt-2 inline-flex items-center gap-1 text-xs text-white/55 hover:text-white"
                        >
                          <ChevronLeft size={14} aria-hidden />
                          {t("back")}
                        </button>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.form
                        key="step3"
                        id="booking-form"
                        {...stepAnim}
                        onSubmit={handleSubmit}
                        noValidate
                        className="relative space-y-3"
                      >
                        <p className="text-xs text-white/55">
                          <span className="font-semibold text-green-400">{serviceLabel}</span> · {sessionLabel}
                        </p>
                        <Honeypot value={honeypot} onChange={setHoneypot} />

                        <FormField id="booking-name" label={t("nameLabel")} error={errorText("name")}>
                          {(aria) => (
                            <input
                              {...aria}
                              type="text"
                              name="name"
                              autoComplete="name"
                              placeholder={t("namePlaceholder")}
                              value={form.name}
                              onChange={update("name")}
                              onBlur={blur("name")}
                              maxLength={LIMITS.nameMax}
                              className={inputClasses(fieldState("name"))}
                            />
                          )}
                        </FormField>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <FormField id="booking-email" label={t("emailLabel")} error={errorText("email")}>
                            {(aria) => (
                              <input
                                {...aria}
                                type="email"
                                name="email"
                                autoComplete="email"
                                inputMode="email"
                                placeholder={t("emailPlaceholder")}
                                value={form.email}
                                onChange={update("email")}
                                onBlur={blur("email")}
                                maxLength={LIMITS.emailMax}
                                className={inputClasses(fieldState("email"))}
                              />
                            )}
                          </FormField>
                          <FormField id="booking-phone" label={t("phoneLabel")} error={errorText("phone")}>
                            {(aria) => (
                              <input
                                {...aria}
                                type="tel"
                                name="phone"
                                autoComplete="tel"
                                inputMode="tel"
                                placeholder={t("phonePlaceholder")}
                                value={form.phone}
                                onChange={update("phone")}
                                onBlur={blur("phone")}
                                maxLength={LIMITS.phoneMax}
                                className={inputClasses(fieldState("phone"))}
                              />
                            )}
                          </FormField>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <FormField id="booking-date" label={t("dateLabel")} error={errorText("preferredDate")}>
                            {(aria) => (
                              <input
                                {...aria}
                                type="date"
                                name="preferredDate"
                                min={localIsoDate()}
                                max={localIsoDate(LIMITS.bookingDaysAhead)}
                                value={form.preferredDate}
                                onChange={update("preferredDate")}
                                onBlur={blur("preferredDate")}
                                className={inputClasses(fieldState("preferredDate"), "[color-scheme:dark]")}
                              />
                            )}
                          </FormField>
                          <FormField id="booking-time" label={t("timeLabel")} error={errorText("preferredTime")}>
                            {(aria) => (
                              <input
                                {...aria}
                                type="time"
                                name="preferredTime"
                                value={form.preferredTime}
                                onChange={update("preferredTime")}
                                onBlur={blur("preferredTime")}
                                className={inputClasses(fieldState("preferredTime"), "[color-scheme:dark]")}
                              />
                            )}
                          </FormField>
                        </div>

                        <FormField
                          id="booking-message"
                          label={t("messageLabel")}
                          error={errorText("message")}
                          hint={
                            <span
                              className={cn(
                                msgLen > LIMITS.bookingMessageMax * 0.9
                                  ? "text-red-400"
                                  : msgLen > LIMITS.bookingMessageMax * 0.7
                                    ? "text-yellow-400"
                                    : "text-white/40"
                              )}
                            >
                              {msgLen}/{LIMITS.bookingMessageMax}
                            </span>
                          }
                        >
                          {(aria) => (
                            <textarea
                              {...aria}
                              name="message"
                              rows={3}
                              placeholder={t("messagePlaceholder")}
                              value={form.message}
                              onChange={update("message")}
                              onBlur={blur("message")}
                              maxLength={LIMITS.bookingMessageMax}
                              className={inputClasses(fieldState("message"), "resize-none")}
                            />
                          )}
                        </FormField>

                        <AnimatePresence>
                          {status === "error" && (
                            <motion.div
                              role="alert"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center gap-2 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                            >
                              <AlertCircle size={16} aria-hidden className="shrink-0" />
                              {serverError === "rateLimited"
                                ? t("rateLimited")
                                : serverError === "unavailable"
                                  ? t("unavailable")
                                  : t("errorMsg")}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.form>
                    )}

                    {step === 4 && (
                      <motion.div
                        key="step4"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center gap-4 py-8 text-center"
                        role="status"
                      >
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", delay: 0.1 }}
                          className="flex h-16 w-16 items-center justify-center rounded-full border border-green-500/30 bg-green-500/15"
                        >
                          <CheckCircle size={32} className="text-green-400" aria-hidden />
                        </motion.span>
                        <h3 className="font-oswald text-xl font-bold text-white">{t("successTitle")}</h3>
                        <p className="max-w-sm text-sm leading-relaxed text-white/65">{t("successText")}</p>
                        <div className="mt-2 w-full rounded-xl border border-white/10 bg-white/3 px-4 py-3 text-left">
                          <p className="mb-2 text-xs uppercase tracking-wider text-white/50">{t("summary")}</p>
                          <p className="text-sm text-white">
                            {serviceLabel} · {sessionLabel}
                          </p>
                          {form.preferredDate && (
                            <p className="mt-1 text-xs text-white/60">
                              {form.preferredDate}{" "}
                              {form.preferredTime && `${t("at")} ${form.preferredTime}`}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer */}
                {step === 3 && (
                  <div className="flex shrink-0 gap-3 px-6 pb-6">
                    <Button variant="secondary" onClick={() => setStep(2)}>
                      <ChevronLeft size={16} aria-hidden />
                      {t("back")}
                    </Button>
                    <Button
                      type="submit"
                      form="booking-form"
                      disabled={status === "loading"}
                      className="flex-1"
                      shine
                    >
                      {status === "loading" ? (
                        <>
                          <Loader2 size={16} className="animate-spin" aria-hidden />
                          {t("submitting")}
                        </>
                      ) : (
                        t("submit")
                      )}
                    </Button>
                  </div>
                )}
                {step === 4 && (
                  <div className="shrink-0 px-6 pb-6">
                    <Dialog.Close asChild>
                      <Button variant="secondary" className="w-full">
                        {t("close")}
                      </Button>
                    </Dialog.Close>
                  </div>
                )}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
