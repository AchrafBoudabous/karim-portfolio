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
  Link,
} from "lucide-react";
import SectionTitle from "@/components/ui/SectionTitle";

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

function validateForm(values: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Name is required";
  } else if (values.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  } else if (values.name.trim().length > 100) {
    errors.name = "Name must be less than 100 characters";
  } else if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(values.name.trim())) {
    errors.name = "Name can only contain letters, spaces, hyphens and apostrophes";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Please enter a valid email address";
  } else if (values.email.trim().length > 254) {
    errors.email = "Email address is too long";
  }

  if (!values.message.trim()) {
    errors.message = "Message is required";
  } else if (values.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters";
  } else if (values.message.trim().length > 2000) {
    errors.message = "Message must be less than 2000 characters";
  }

  return errors;
}

export default function Contact() {
  const t = useTranslations("contact");

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const newErrors = validateForm({ ...form, [name]: value });
      setErrors((prev) => ({
        ...prev,
        [name]: newErrors[name as keyof FormErrors],
      }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const newErrors = validateForm(form);
    setErrors((prev) => ({
      ...prev,
      [name]: newErrors[name as keyof FormErrors],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const allTouched = { name: true, email: true, message: true };
    setTouched(allTouched);

    const validationErrors = validateForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
      setTouched({});
      setErrors({});
    } catch {
      setStatus("error");
    }
  };

  const inputBase =
    "w-full bg-white/3 border rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-white/30 outline-none transition-all duration-200 focus:bg-white/5";

  const getInputClass = (field: keyof FormErrors) => {
    if (touched[field] && errors[field]) {
      return `${inputBase} border-red-500/50 focus:border-red-500/80 focus:ring-2 focus:ring-red-500/10`;
    }
    if (touched[field] && !errors[field] && form[field]) {
      return `${inputBase} border-green-500/40 focus:border-green-500/60 focus:ring-2 focus:ring-green-500/10`;
    }
    return `${inputBase} border-white/8 focus:border-green-500/40 focus:ring-2 focus:ring-green-500/5`;
  };

  return (
    <section
      id="contact"
      className="section-padding bg-neutral-950 relative overflow-hidden"
    >
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-green-500/4 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-emerald-600/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionTitle
          title={t("sectionTitle")}
          subtitle={t("sectionSubtitle")}
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left info panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            {/* Info card */}
            <div className="rounded-2xl border border-white/8 bg-white/3 p-6">
              <h3 className="font-oswald text-lg font-bold text-white tracking-wide mb-5">
                Get In Touch
              </h3>
              <div className="space-y-4">
                {[
                  {
                    icon: MapPin,
                    label: "Location",
                    value: "Murcia, Spain",
                  },
                  {
                    icon: Mail,
                    label: "Email",
                    value: "karimboudabous04@gmail.com",
                  },
                  {
                    icon: Phone,
                    label: "Phone",
                    value: "+34 666 850 841",
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                      <Icon size={16} className="text-green-400" />
                    </div>
                    <div>
                      <p className="text-white/30 text-xs uppercase tracking-wider">
                        {label}
                      </p>
                      <p className="text-white/80 text-sm font-medium">
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social links */}
            <div className="rounded-2xl border border-white/8 bg-white/3 p-6">
              <p className="text-white/40 text-xs uppercase tracking-widest mb-4">
                {t("follow")}
              </p>
              <div className="flex flex-col gap-3">
                {[
                  {
                    icon: Linkedin,
                    label: "LinkedIn",
                    handle: "Karim Boudabous",
                    href: "https://linkedin.com/in/karim-boudabous",
                    color: "hover:border-blue-500/40 hover:bg-blue-500/5 hover:text-blue-400",
                  },
                  {
                    icon: Instagram,
                    label: "Instagram",
                    handle: "@karim.boudabous",
                    href: "https://instagram.com/karim.boudabous",
                    color: "hover:border-pink-500/40 hover:bg-pink-500/5 hover:text-pink-400",
                  },
                  {
                    icon: Link,
                    label: "Linktree",
                    handle: "linktr.ee/Karim.boudabous",
                    href: "https://linktr.ee/Karim.boudabous",
                    color: "hover:border-green-500/40 hover:bg-green-500/5 hover:text-green-400",
                  },
                ].map(({ icon: Icon, label, handle, href, color }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 4 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border border-white/8 bg-white/3 text-white/60 transition-all duration-200 group ${color}`}
                  >
                    <Icon size={16} className="shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold">{label}</p>
                      <p className="text-xs text-white/30 truncate">{handle}</p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Availability badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5 flex items-center gap-4"
            >
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse shrink-0" />
              <div>
                <p className="text-green-400 text-sm font-semibold">
                  {t("availableTitle")}
                </p>
                <p className="text-white/40 text-xs mt-0.5">
                  {t("availableText")}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right — Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="rounded-2xl border border-white/8 bg-white/3 p-8">
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center justify-center py-16 text-center gap-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center">
                      <CheckCircle size={32} className="text-green-400" />
                    </div>
                    <h3 className="font-oswald text-xl font-bold text-white">
                      Message Sent!
                    </h3>
                    <p className="text-white/50 text-sm max-w-sm leading-relaxed">
                      {t("success")}
                    </p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="mt-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 text-sm transition-colors duration-200"
                    >
                      Send Another
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    noValidate
                    className="space-y-5"
                  >
                    {/* Name */}
                    <div>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={t("namePlaceholder")}
                        className={getInputClass("name")}
                        autoComplete="name"
                        maxLength={100}
                      />
                      <AnimatePresence>
                        {touched.name && errors.name && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="mt-1.5 text-red-400 text-xs flex items-center gap-1"
                          >
                            <AlertCircle size={11} />
                            {errors.name}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Email */}
                    <div>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={t("emailPlaceholder")}
                        className={getInputClass("email")}
                        autoComplete="email"
                        maxLength={254}
                      />
                      <AnimatePresence>
                        {touched.email && errors.email && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="mt-1.5 text-red-400 text-xs flex items-center gap-1"
                          >
                            <AlertCircle size={11} />
                            {errors.email}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Message */}
                    <div>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={t("messagePlaceholder")}
                        rows={6}
                        maxLength={2000}
                        className={`${getInputClass("message")} resize-none`}
                      />
                      <div className="flex items-center justify-between mt-1.5">
                        <AnimatePresence>
                          {touched.message && errors.message && (
                            <motion.p
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              className="text-red-400 text-xs flex items-center gap-1"
                            >
                              <AlertCircle size={11} />
                              {errors.message}
                            </motion.p>
                          )}
                        </AnimatePresence>
                        <span
                          className={`text-xs ml-auto ${
                            form.message.length > 1800
                              ? "text-red-400"
                              : form.message.length > 1500
                              ? "text-yellow-400"
                              : "text-white/20"
                          }`}
                        >
                          {form.message.length}/2000
                        </span>
                      </div>
                    </div>

                    {/* Error status */}
                    <AnimatePresence>
                      {status === "error" && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                        >
                          <AlertCircle size={16} />
                          {t("error")}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      disabled={status === "loading"}
                      whileHover={{ scale: status === "loading" ? 1 : 1.02 }}
                      whileTap={{ scale: status === "loading" ? 1 : 0.98 }}
                      className="w-full relative overflow-hidden py-4 rounded-xl bg-linear-to-r from-green-500 to-emerald-600 text-black font-bold text-sm tracking-wide disabled:opacity-70 disabled:cursor-not-allowed transition-opacity duration-200"
                    >
                      <AnimatePresence mode="wait">
                        {status === "loading" ? (
                          <motion.span
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center gap-2"
                          >
                            <svg
                              className="animate-spin w-4 h-4"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                              />
                            </svg>
                            {t("sending")}
                          </motion.span>
                        ) : (
                          <motion.span
                            key="send"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center gap-2"
                          >
                            <Send size={15} />
                            {t("send")}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}