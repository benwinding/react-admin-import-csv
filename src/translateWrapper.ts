import {
  useTranslate,
  resolveBrowserLocale,
} from 'react-admin';
import * as messages from "./i18n";
import polyglotI18nProvider from "ra-i18n-polyglot";

const defaultI18nProvider = polyglotI18nProvider(
  (locale) => (messages[locale] ? messages[locale] : messages.en),
  resolveBrowserLocale()
);

type UseTranslateFn = (key: string, args?: any) => string;

export const translateWrapper = (): UseTranslateFn => {
  const translateSystem = useTranslate();
  const translate = (key: string, args?: any): string => {
    args = args || {};
    args._ = ""; // Hack to stop throwing error
    const res = translateSystem(key, args);
    if (res) {
      return res;
    }
    return defaultI18nProvider.translate(key, args);
  };
  return translate;
};

