"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { messages } from "@/lib/i18n";

const LanguageContext = createContext(null);

function getInitialLanguage() {
  if (typeof window === "undefined") {
    return "fa";
  }

  const saved = window.localStorage.getItem("portfolio-lang");
  if (saved === "fa" || saved === "en") {
    return saved;
  }

  return "fa";
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("fa");

  useEffect(() => {
    setLanguage(getInitialLanguage());
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "fa" ? "rtl" : "ltr";
    window.localStorage.setItem("portfolio-lang", language);
  }, [language]);

  const value = useMemo(() => {
    const dict = messages[language] || messages.fa;

    const t = (key) => {
      return dict[key] || messages.fa[key] || key;
    };

    return {
      language,
      setLanguage,
      t
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider.");
  }
  return context;
}
