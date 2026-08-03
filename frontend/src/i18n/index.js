import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "./locales/en/common.json";
import faCommon from "./locales/fa/common.json";

export const LANGUAGE_STORAGE_KEY = "secora.language";
export const SUPPORTED_LANGUAGES = ["fa", "en"];

export const LANGUAGE_META = {
  fa: { dir: "rtl", label: "فارسی" },
  en: { dir: "ltr", label: "English" },
};

function safeStoredLanguage() {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return SUPPORTED_LANGUAGES.includes(stored) ? stored : "fa";
  } catch {
    return "fa";
  }
}

export function normalizeLanguage(language) {
  const baseLanguage = String(language || "").split("-")[0];
  return SUPPORTED_LANGUAGES.includes(baseLanguage) ? baseLanguage : "fa";
}

export function applyDocumentLanguage(language) {
  const normalizedLanguage = normalizeLanguage(language);
  const meta = LANGUAGE_META[normalizedLanguage];
  const root = document.documentElement;

  root.lang = normalizedLanguage;
  root.dir = meta.dir;
  root.dataset.language = normalizedLanguage;
}

i18n.use(initReactI18next).init({
  defaultNS: "common",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  lng: safeStoredLanguage(),
  resources: {
    en: { common: enCommon },
    fa: { common: faCommon },
  },
  supportedLngs: SUPPORTED_LANGUAGES,
});

applyDocumentLanguage(i18n.language);

i18n.on("languageChanged", (language) => {
  const normalizedLanguage = normalizeLanguage(language);

  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizedLanguage);
  } catch {
    // Ignore storage failures; document language still updates.
  }

  applyDocumentLanguage(normalizedLanguage);
});

export default i18n;
