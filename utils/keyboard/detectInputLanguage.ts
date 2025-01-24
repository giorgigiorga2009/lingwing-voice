import { languageMaps } from './languageMaps';

export const detectInputLanguage = (input: string): string => {
  const charLangCounts: Record<string, number> = {
    en: 0,
    ru: 0,
    es: 0,
    ka: 0,
    fr: 0,
    de: 0,
    it: 0,
    zh: 0,
    jp: 0,
    ko: 0,
    ar: 0,
    hi: 0,
    pt: 0,
    tr: 0,
  };

  for (const char of input) {
    for (const [lang, regex] of Object.entries(languageMaps)) {
      if ((regex as RegExp).test(char)) {
        charLangCounts[lang]++;
      }
    }
  }

  const detectedLanguage = Object.entries(charLangCounts).reduce(
    (maxLang, [lang, count]) => (count > maxLang[1] ? [lang, count] : maxLang),
    ['unknown', 0]
  )[0];

  return detectedLanguage === 'unknown' && input.length > 0
    ? 'mixed'
    : detectedLanguage;
};
