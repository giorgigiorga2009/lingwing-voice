import { transliterate as defaultTransliterate } from 'transliteration';

export const transliterateInput = (
  input: string,
  targetLang: string
): string => {
  return defaultTransliterate(input);
};
