import { useTranslation } from "react-i18next";

import { normalizeLanguage } from "../i18n";

export function useAppLanguage() {
  const { i18n } = useTranslation();
  const language = normalizeLanguage(i18n.language);

  return {
    changeLanguage: i18n.changeLanguage.bind(i18n),
    language,
  };
}
