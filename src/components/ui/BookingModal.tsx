"use client";

import { useState } from "react";
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
} from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  service: string;
  sessionType: string;
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  preferredDate?: string;
  message?: string;
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

const serviceIcons: Record<string, React.ElementType> = {
  pt: Dumbbell,
  football: Trophy,
  sc: Activity,
  discovery: Phone,
};

function validateStep3(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.name.trim()) {
    errors.name = "Name is required";
  } else if (data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  } else if (data.name.trim().length > 100) {
    errors.name = "Name must be less than 100 characters";
  } else if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(data.name.trim())) {
    errors.name = "Name can only contain letters, spaces, hyphens and apostrophes";
  }

  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = "Please enter a valid email address";
  } else if (data.email.trim().length > 254) {
    errors.email = "Email address is too long";
  }

  if (data.phone.trim()) {
    const phoneDigits = data.phone.replace(/[\s\-\+\(\)]/g, "");
    if (!/^\d+$/.test(phoneDigits)) {
      errors.phone = "Phone number contains invalid characters";
    } else if (phoneDigits.length < 7) {
      errors.phone = "Phone number is too short";
    } else if (phoneDigits.length > 15) {
      errors.phone = "Phone number is too long";
    }
  }

  if (data.preferredDate.trim()) {
    const date = new Date(data.preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(date.getTime())) {
      errors.preferredDate = "Please enter a valid date";
    } else if (date < today) {
      errors.preferredDate = "Date cannot be in the past";
    }
  }

  if (data.message.trim().length > 1000) {
    errors.message = "Message must be less than 1000 characters";
  }

  return errors;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const t = useTranslations("booking");
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState<FormData>({
    service: "",
    sessionType: "",
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });

  const serviceKeys = ["pt", "football", "sc", "discovery"] as const;

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setStatus("idle");
      setFieldErrors({});
      setTouched({});
      setForm({
        service: "",
        sessionType: "",
        name: "",
        email: "",
        phone: "",
        preferredDate: "",
        preferredTime: "",
        message: "",
      });
    }, 300);
  };

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (touched[name]) {
      const errors = validateStep3({ ...form, [name]: value });
      setFieldErrors((prev) => ({ ...prev, [name]: errors[name as keyof FormErrors] }));
    }
  };

  const handleFieldBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errors = validateStep3(form);
    setFieldErrors((prev) => ({ ...prev, [name]: errors[name as keyof FormErrors] }));
  };

  const handleSubmit = async () => {
    const allTouched = { name: true, email: true, phone: true, preferredDate: true, message: true };
    setTouched(allTouched);

    const errors = validateStep3(form);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setStep(4);
    } catch {
      setStatus("error");
    }
  };

  const inputBase =
    "w-full bg-white/5 border rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 outline-none transition-all duration-200 focus:bg-white/8";

  const getInputClass = (field: keyof FormErrors) => {
    if (touched[field] && fieldErrors[field]) {
      return `${inputBase} border-red-500/50 focus:border-red-500/60 focus:ring-2 focus:ring-red-500/10`;
    }
    if (touched[field] && !fieldErrors[field] && form[field as keyof FormData]) {
      return `${inputBase} border-green-500/40 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/10`;
    }
    return `${inputBase} border-white/10 focus:border-green-500/40 focus:ring-2 focus:ring-green-500/5`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-neutral-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="relative bg-linear-to-r from-green-500 to-emerald-600 px-6 py-5">
              <h2 className="font-oswald text-xl font-bold text-black tracking-wide">
                {t("title")}
              </h2>
              <p className="text-black/70 text-sm mt-0.5">{t("subtitle")}</p>
              <button
                onClick={handleClose}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors"
              >
                <X size={16} className="text-black" />
              </button>
            </div>

            {/* Step indicator */}
            {step < 4 && (
              <div className="px-6 pt-5 flex items-center gap-2">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        s < step
                          ? "bg-green-500 text-black"
                          : s === step
                          ? "bg-green-500/20 border border-green-500 text-green-400"
                          : "bg-white/5 border border-white/10 text-white/30"
                      }`}
                    >
                      {s < step ? "✓" : s}
                    </div>
                    <span
                      className={`text-xs hidden sm:block transition-colors duration-300 ${
                        s === step ? "text-green-400" : "text-white/30"
                      }`}
                    >
                      {t(`step${s}` as "step1" | "step2" | "step3")}
                    </span>
                    {s < 3 && (
                      <div
                        className={`h-0.5 w-6 rounded-full transition-colors duration-300 ${
                          s < step ? "bg-green-500" : "bg-white/10"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Content */}
            <div className="px-6 py-5 min-h-[280px]">
              <AnimatePresence mode="wait">

                {/* Step 1 — Choose Service */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-2 gap-3"
                  >
                    {serviceKeys.map((key) => {
                      const Icon = serviceIcons[key];
                      const serviceLabel = t(`services.${key}` as "services.pt" | "services.football" | "services.sc" | "services.discovery");
                      return (
                        <button
                          key={key}
                          onClick={() => {
                            setForm((p) => ({ ...p, service: serviceLabel }));
                            setStep(2);
                          }}
                          className={`group relative p-4 rounded-xl border text-left transition-all duration-200 ${
                            form.service === serviceLabel
                              ? "border-green-500/50 bg-green-500/10"
                              : "border-white/10 bg-white/3 hover:border-green-500/30 hover:bg-green-500/5"
                          }`}
                        >
                          <div className="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                            <Icon size={18} className="text-green-400" />
                          </div>
                          <p className="text-white text-sm font-medium leading-tight">
                            {serviceLabel}
                          </p>
                        </button>
                      );
                    })}
                  </motion.div>
                )}

                {/* Step 2 — Session Type */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                  >
                    <p className="text-white/50 text-sm mb-4">
                      Selected:{" "}
                      <span className="text-green-400 font-semibold">
                        {form.service}
                      </span>
                    </p>
                    {[
                      { key: "inPerson", sub: "inPersonSub", icon: MapPin },
                      { key: "online", sub: "onlineSub", icon: Video },
                    ].map(({ key, sub, icon: Icon }) => (
                      <button
                        key={key}
                        onClick={() => {
                          setForm((p) => ({
                            ...p,
                            sessionType: t(key as "inPerson" | "online"),
                          }));
                          setStep(3);
                        }}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200 ${
                          form.sessionType === t(key as "inPerson" | "online")
                            ? "border-green-500/50 bg-green-500/10"
                            : "border-white/10 bg-white/3 hover:border-green-500/30 hover:bg-green-500/5"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                          <Icon size={18} className="text-green-400" />
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">
                            {t(key as "inPerson" | "online")}
                          </p>
                          <p className="text-white/40 text-xs mt-0.5">
                            {t(sub as "inPersonSub" | "onlineSub")}
                          </p>
                        </div>
                        <ChevronRight size={16} className="text-white/30 ml-auto" />
                      </button>
                    ))}
                  </motion.div>
                )}

                {/* Step 3 — Details */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                  >
                    {/* Name */}
                    <div>
                      <input
                        type="text"
                        name="name"
                        placeholder={t("namePlaceholder")}
                        value={form.name}
                        onChange={handleFieldChange}
                        onBlur={handleFieldBlur}
                        maxLength={100}
                        className={getInputClass("name")}
                      />
                      <AnimatePresence>
                        {touched.name && fieldErrors.name && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="mt-1 text-red-400 text-xs flex items-center gap-1"
                          >
                            <AlertCircle size={11} />
                            {fieldErrors.name}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Email */}
                    <div>
                      <input
                        type="email"
                        name="email"
                        placeholder={t("emailPlaceholder")}
                        value={form.email}
                        onChange={handleFieldChange}
                        onBlur={handleFieldBlur}
                        maxLength={254}
                        className={getInputClass("email")}
                      />
                      <AnimatePresence>
                        {touched.email && fieldErrors.email && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="mt-1 text-red-400 text-xs flex items-center gap-1"
                          >
                            <AlertCircle size={11} />
                            {fieldErrors.email}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Phone */}
                    <div>
                      <input
                        type="tel"
                        name="phone"
                        placeholder={t("phonePlaceholder")}
                        value={form.phone}
                        onChange={handleFieldChange}
                        onBlur={handleFieldBlur}
                        maxLength={20}
                        className={getInputClass("phone")}
                      />
                      <AnimatePresence>
                        {touched.phone && fieldErrors.phone && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="mt-1 text-red-400 text-xs flex items-center gap-1"
                          >
                            <AlertCircle size={11} />
                            {fieldErrors.phone}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="date"
                          name="preferredDate"
                          value={form.preferredDate}
                          onChange={handleFieldChange}
                          onBlur={handleFieldBlur}
                          className={`${getInputClass("preferredDate")} [color-scheme:dark]`}
                        />
                        <AnimatePresence>
                          {touched.preferredDate && fieldErrors.preferredDate && (
                            <motion.p
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              className="mt-1 text-red-400 text-xs flex items-center gap-1"
                            >
                              <AlertCircle size={11} />
                              {fieldErrors.preferredDate}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                      <input
                        type="time"
                        name="preferredTime"
                        value={form.preferredTime}
                        onChange={handleFieldChange}
                        className={`${inputBase} border-white/10 focus:border-green-500/40 [color-scheme:dark]`}
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <textarea
                        name="message"
                        placeholder={t("messagePlaceholder")}
                        value={form.message}
                        onChange={handleFieldChange}
                        onBlur={handleFieldBlur}
                        rows={3}
                        maxLength={1000}
                        className={`${getInputClass("message")} resize-none`}
                      />
                      <div className="flex items-center justify-between mt-1">
                        <AnimatePresence>
                          {touched.message && fieldErrors.message && (
                            <motion.p
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              className="text-red-400 text-xs flex items-center gap-1"
                            >
                              <AlertCircle size={11} />
                              {fieldErrors.message}
                            </motion.p>
                          )}
                        </AnimatePresence>
                        <span
                          className={`text-xs ml-auto ${
                            form.message.length > 900
                              ? "text-red-400"
                              : form.message.length > 700
                              ? "text-yellow-400"
                              : "text-white/20"
                          }`}
                        >
                          {form.message.length}/1000
                        </span>
                      </div>
                    </div>

                    {/* API error */}
                    <AnimatePresence>
                      {status === "error" && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                        >
                          <AlertCircle size={16} />
                          Something went wrong. Please try again.
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* Step 4 — Success */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-8 text-center gap-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.1 }}
                      className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center"
                    >
                      <CheckCircle size={32} className="text-green-400" />
                    </motion.div>
                    <h3 className="font-oswald text-xl font-bold text-white">
                      {t("successTitle")}
                    </h3>
                    <p className="text-white/50 text-sm max-w-sm leading-relaxed">
                      {t("successText")}
                    </p>
                    <div className="mt-2 px-4 py-3 rounded-xl bg-white/3 border border-white/8 text-left w-full">
                      <p className="text-white/40 text-xs mb-2 uppercase tracking-wider">
                        Summary
                      </p>
                      <p className="text-white text-sm">
                        {form.service} · {form.sessionType}
                      </p>
                      {form.preferredDate && (
                        <p className="text-white/50 text-xs mt-1">
                          {form.preferredDate}{" "}
                          {form.preferredTime && `at ${form.preferredTime}`}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer buttons */}
            {step === 3 && (
              <div className="px-6 pb-6 flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 text-sm transition-colors duration-200"
                >
                  <ChevronLeft size={16} />
                  {t("back")}
                </button>
                <motion.button
                  onClick={handleSubmit}
                  disabled={status === "loading"}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 rounded-xl bg-linear-to-r from-green-500 to-emerald-600 text-black font-bold text-sm tracking-wide disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
                >
                  {status === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      {t("submitting")}
                    </span>
                  ) : (
                    t("submit")
                  )}
                </motion.button>
              </div>
            )}

            {step === 4 && (
              <div className="px-6 pb-6">
                <button
                  onClick={handleClose}
                  className="w-full py-3 rounded-xl border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors duration-200"
                >
                  {t("close")}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}