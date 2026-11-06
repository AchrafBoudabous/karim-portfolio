"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  CheckCircle,
  AlertCircle,
  Linkedin,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Loader2,
  ArrowUpRight,
} from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";
import TikTokIcon from "@/components/ui/TikTokIcon";
import SpotlightCard from "@/components/ui/SpotlightCard";
import Button from "@/components/ui/Button";
import FormField, { Honeypot, inputClasses, type FieldState } from "@/components/ui/FormField";
import {
  LIMITS,
  validateContact,
  type ContactField,
  type ContactInput,
  type ErrorCode,
} from "@/lib/validation";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

type SubmitStatus = "idle" | "loading" | "success" | "error";
type ServerError = "rateLimited" | "unavailable" | "generic";

const EMPTY: ContactInput = { name: "", email: "", message: "" };
const FIELDS: ContactField[] = ["name", "email", "message"];

export default function Contact() {
  const t = useTranslations("contact");
  const tv = useTranslations("validation");

  const [form, setForm] = useState<ContactInput>(EMPTY);
  const [honeypot, setHoneypot] = useState("");
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [serverError, setServerError] = useState<ServerError>("generic");

  const errors = validateContact(form);

  const errorText = (field: ContactField) => {
    const code = errors[field];
    if (!touched[field] || !code) return undefined;
    return tv(`${field}.${code}` as `name.${ErrorCode}`);
  };

  const fieldState = (field: ContactField): FieldState => {
    if (!touched[field]) return "idle";
    if (errors[field]) return "invalid";
    return form[field] ? "valid" : "idle";
  };

  const update =
    (field: ContactField) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [field]: e.target.value }));

  const blur = (field: ContactField) => () =>
    setTouched((p) => ({ ...p, [field]: true }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    if (FIELDS.some((f) => errors[f])) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
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
      setForm(EMPTY);
      setTouched({});
    } catch {
      setServerError("generic");
      setStatus("error");
    }
  };

  const contactItems = [
    { icon: MapPin, label: t("locationLabel"), value: "Madrid, Spain", href: undefined },
    { icon: Mail, label: t("emailLabel"), value: SITE.email, href: `mailto:${SITE.email}` },
    { icon: Phone, label: t("phoneLabel"), value: SITE.phone, href: `tel:${SITE.phoneHref}` },
  ];

  const socials = [
    {
      icon: Linkedin,
      label: "LinkedIn",
      handle: SITE.name,
      href: SITE.socials.linkedin,
      color: "hover:border-blue-500/40 hover:bg-blue-500/5 hover:text-blue-300",
    },
    {
      icon: Instagram,
      label: "Instagram",
      handle: "@karimboudabous.coach",
      href: SITE.socials.instagram,
      color: "hover:border-pink-500/40 hover:bg-pink-500/5 hover:text-pink-300",
    },
    {
      icon: TikTokIcon,
      label: "TikTok",
      handle: "@karimboudabous.coach",
      href: SITE.socials.tiktok,
      color: "hover:border-cyan-500/40 hover:bg-cyan-500/5 hover:text-cyan-300",
    },
  ];

  const msgLen = form.message.length;

  return (
    <section id="contact" className="section-padding relative overflow-hidden bg-neutral-950">
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-green-500/5 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute right-0 top-1/4 h-64 w-64 rounded-full bg-emerald-600/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionTitle title={t("sectionTitle")} subtitle={t("sectionSubtitle")} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6 lg:col-span-2"
          >
            <SpotlightCard className="p-6">
              <h3 className="mb-5 font-oswald text-lg font-bold tracking-wide text-white">
                {t("infoTitle")}
              </h3>
              <ul className="space-y-4">
                {contactItems.map(({ icon: Icon, label, value, href }) => {
                  const content = (
                    <>
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-green-500/20 bg-green-500/10">
                        <Icon size={16} className="text-green-400" aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs uppercase tracking-wider text-white/50">{label}</span>
                        <span className="block truncate text-sm font-medium text-white/85">{value}</span>
                      </span>
                    </>
                  );
                  return (
                    <li key={label}>
                      {href ? (
                        <a
                          href={href}
                          className="group flex items-center gap-4 rounded-xl transition-opacity hover:opacity-80"
                        >
                          {content}
                        </a>
                      ) : (
                        <div className="flex items-center gap-4">{content}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </SpotlightCard>

            <SpotlightCard className="p-6">
              <p className="mb-4 text-xs uppercase tracking-widest text-white/55">{t("follow")}</p>
              <ul className="flex flex-col gap-3">
                {socials.map(({ icon: Icon, label, handle, href, color }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "group flex items-center gap-3 rounded-xl border border-white/10 bg-white/3 px-4 py-3 text-white/70 transition-all duration-200 hover:translate-x-1",
                        color
                      )}
                    >
                      <Icon size={16} className="shrink-0" aria-hidden />
                      <span className="min-w-0">
                        <span className="block text-xs font-semibold">{label}</span>
                        <span className="block truncate text-xs text-white/45">{handle}</span>
                      </span>
                      <ArrowUpRight size={14} className="ml-auto opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </SpotlightCard>

            <div className="flex items-center gap-4 rounded-2xl border border-green-500/25 bg-green-500/5 p-5">
              <span className="relative flex h-3 w-3 shrink-0" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-400" />
              </span>
              <div>
                <p className="text-sm font-semibold text-green-400">{t("availableTitle")}</p>
                <p className="mt-0.5 text-xs text-white/60">{t("availableText")}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <SpotlightCard className="p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    role="status"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center gap-4 py-16 text-center"
                  >
                    <span className="flex h-16 w-16 items-center justify-center rounded-full border border-green-500/30 bg-green-500/15">
                      <CheckCircle size={32} className="text-green-400" aria-hidden />
                    </span>
                    <h3 className="font-oswald text-xl font-bold text-white">{t("successTitle")}</h3>
                    <p className="max-w-sm text-sm leading-relaxed text-white/65">{t("success")}</p>
                    <Button variant="secondary" size="sm" className="mt-2" onClick={() => setStatus("idle")}>
                      {t("sendAnother")}
                    </Button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    noValidate
                    className="relative space-y-4"
                  >
                    <Honeypot value={honeypot} onChange={setHoneypot} />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField id="contact-name" label={t("nameLabel")} error={errorText("name")}>
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
                            className={inputClasses(fieldState("name"), "py-3.5")}
                          />
                        )}
                      </FormField>
                      <FormField id="contact-email" label={t("emailLabel2")} error={errorText("email")}>
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
                            className={inputClasses(fieldState("email"), "py-3.5")}
                          />
                        )}
                      </FormField>
                    </div>

                    <FormField
                      id="contact-message"
                      label={t("messageLabel")}
                      error={errorText("message")}
                      hint={
                        <span
                          className={cn(
                            msgLen > LIMITS.contactMessageMax * 0.9
                              ? "text-red-400"
                              : msgLen > LIMITS.contactMessageMax * 0.75
                                ? "text-yellow-400"
                                : "text-white/40"
                          )}
                        >
                          {msgLen}/{LIMITS.contactMessageMax}
                        </span>
                      }
                    >
                      {(aria) => (
                        <textarea
                          {...aria}
                          name="message"
                          rows={6}
                          placeholder={t("messagePlaceholder")}
                          value={form.message}
                          onChange={update("message")}
                          onBlur={blur("message")}
                          maxLength={LIMITS.contactMessageMax}
                          className={inputClasses(fieldState("message"), "resize-none py-3.5")}
                        />
                      )}
                    </FormField>

                    <AnimatePresence>
                      {status === "error" && (
                        <motion.div
                          role="alert"
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                        >
                          <AlertCircle size={16} aria-hidden className="shrink-0" />
                          {serverError === "rateLimited"
                            ? t("rateLimited")
                            : serverError === "unavailable"
                              ? t("unavailable")
                              : t("error")}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Button type="submit" size="lg" className="w-full" disabled={status === "loading"} shine>
                      {status === "loading" ? (
                        <>
                          <Loader2 size={16} className="animate-spin" aria-hidden />
                          {t("sending")}
                        </>
                      ) : (
                        <>
                          <Send size={15} aria-hidden />
                          {t("send")}
                        </>
                      )}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </SpotlightCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
