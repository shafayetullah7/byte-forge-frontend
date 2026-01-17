import { createSignal, createContext, useContext, Accessor, createMemo, FlowProps } from "solid-js";
import * as en from "./en";
import * as bn from "./bn";
import { translator, resolveTemplate, Flatten, flatten } from "@solid-primitives/i18n";

export type Locale = "en" | "bn";
export type RawDictionary = typeof en.dict;
export type Dictionary = Flatten<RawDictionary>;

export const dictionaries = {
  en: en.dict,
  bn: bn.dict,
};

// Interface for what our context provides
export interface I18nContextInterface {
  t: (key: string, ...args: any[]) => string;
  locale: Accessor<Locale>;
  setLocale: (newLocale: Locale) => void;
  toggleLocale: () => void;
}

export const I18nContext = createContext<I18nContextInterface>();

// Helper to create the i18n implementation (state + translator)
export function createI18n(initialLocale: Locale = "en"): I18nContextInterface {
  const [locale, setLocale] = createSignal<Locale>(initialLocale);
  
  // Memoize the flattened dictionary based on locale
  const dict = createMemo(() => flatten(dictionaries[locale()]));
  
  // Create the translator function
  // @ts-ignore - types can be tricky with the potentially deep dictionary
  const t = translator(dict, resolveTemplate);

  const toggleLocale = () => {
    setLocale((prev) => (prev === "en" ? "bn" : "en"));
  };

  return {
    t: t as any, // casting for simpler usage in components
    locale,
    setLocale,
    toggleLocale,
  };
}

// Hook to use the context
export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};
