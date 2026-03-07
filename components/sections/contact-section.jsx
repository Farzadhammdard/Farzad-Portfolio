"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import toast from "react-hot-toast";
import { socialLinks } from "@/lib/site-data";
import { SectionTitle } from "@/components/ui/section-title";
import { SectionReveal } from "@/components/ui/section-reveal";
import { useLanguage } from "@/components/ui/language-provider";

const initialForm = {
  name: "",
  email: "",
  message: ""
};

export function ContactSection() {
  const { t } = useLanguage();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      toast.success(t("form_success"));
      setForm(initialForm);
    } catch (error) {
      console.error(error);
      toast.error(t("form_error"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="contact" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-20 pt-16 sm:px-6 lg:px-8">
      <SectionReveal>
        <SectionTitle title={t("contact_title")} description={t("contact_desc")} />
      </SectionReveal>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <SectionReveal as="article" type="left" className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <form onSubmit={onSubmit} className="space-y-4">
            <label className="block space-y-2 text-sm">
              <span className="text-slate-200">{t("form_name")}</span>
              <input
                required
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                className="h-11 w-full rounded-xl border border-white/15 bg-[var(--ui-surface-muted)] px-3 text-[var(--ui-text-primary)] outline-none transition focus:border-sky-300/60"
              />
            </label>

            <label className="block space-y-2 text-sm">
              <span className="text-slate-200">{t("form_email")}</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                className="h-11 w-full rounded-xl border border-white/15 bg-[var(--ui-surface-muted)] px-3 text-[var(--ui-text-primary)] outline-none transition focus:border-sky-300/60"
              />
            </label>

            <label className="block space-y-2 text-sm">
              <span className="text-slate-200">{t("form_message")}</span>
              <textarea
                required
                rows={6}
                value={form.message}
                onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
                className="w-full rounded-xl border border-white/15 bg-[var(--ui-surface-muted)] px-3 py-3 text-[var(--ui-text-primary)] outline-none transition focus:border-sky-300/60"
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              {submitting ? t("form_sending") : t("form_submit")}
            </button>
          </form>
        </SectionReveal>

        <SectionReveal as="article" type="right" className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold text-white">{t("contact_title")}</h3>
          <div className="mt-4 space-y-3">
            {socialLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target={item.href.startsWith("mailto") || item.href.startsWith("tel") ? undefined : "_blank"}
                rel={item.href.startsWith("mailto") || item.href.startsWith("tel") ? undefined : "noreferrer"}
                className="block rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-200 transition hover:border-sky-300/40"
              >
                <div className="font-semibold">{item.labelKey ? t(item.labelKey) : item.label || ""}</div>
                <div className="text-slate-300">{item.value}</div>
              </a>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
