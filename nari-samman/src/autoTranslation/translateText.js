const MYMEMORY_EMAIL = 'kalyanbliss27@gmail.com';
const TRANSLATION_CACHE = new Map();
const PENDING_REQUESTS = new Map();

function hasHindiScript(text) {
  return /[\u0900-\u097F]/.test(String(text || ''));
}

function hasBengaliScript(text) {
  return /[\u0980-\u09FF]/.test(String(text || ''));
}

function isOnlySymbolsOrNumbers(text) {
  const value = String(text || '').trim();
  return value.length === 0 || /^[\d\s₹$€£.,:%+\-–—()/#*⭐❤️🤍✓✔✕×!?.|]+$/u.test(value);
}

export function normalizeLanguage(language) {
  return ['en', 'bn', 'hi'].includes(language) ? language : 'en';
}

function isValidTranslationForLanguage(text, targetLang) {
  if (!text) return false;
  const value = String(text);

  if (targetLang === 'hi') return hasHindiScript(value);
  if (targetLang === 'bn') return hasBengaliScript(value);
  return true;
}

function pickBestTranslation(data, originalText, targetLang) {
  const responseTranslation = data?.responseData?.translatedText;
  const matches = Array.isArray(data?.matches) ? data.matches : [];

  const validMatches = matches.
  filter((item) => item?.translation).
  filter((item) => isValidTranslationForLanguage(item.translation, targetLang)).
  sort((a, b) => Number(b.match || 0) - Number(a.match || 0));

  if (validMatches.length > 0) return validMatches[0].translation;
  if (isValidTranslationForLanguage(responseTranslation, targetLang)) return responseTranslation;

  return originalText;
}

export function getCachedTranslation(text, targetLang = 'en') {
  const lang = normalizeLanguage(targetLang);
  const originalText = String(text ?? '');
  if (!originalText || lang === 'en' || isOnlySymbolsOrNumbers(originalText)) return originalText;
  return TRANSLATION_CACHE.get(`${lang}:${originalText}`) || originalText;
}

export async function translateText(text, targetLang = 'en') {
  const lang = normalizeLanguage(targetLang);
  const originalText = String(text ?? '');

  if (!originalText || lang === 'en' || isOnlySymbolsOrNumbers(originalText)) return originalText;

  const cacheKey = `${lang}:${originalText}`;
  if (TRANSLATION_CACHE.has(cacheKey)) return TRANSLATION_CACHE.get(cacheKey);
  if (PENDING_REQUESTS.has(cacheKey)) return PENDING_REQUESTS.get(cacheKey);

  const request = (async () => {
    try {
      const url =
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(originalText)}` +
      `&langpair=en|${lang}` +
      `&de=${encodeURIComponent(MYMEMORY_EMAIL)}`;

      const response = await fetch(url);
      const data = await response.json();
      const translatedText = pickBestTranslation(data, originalText, lang);

      TRANSLATION_CACHE.set(cacheKey, translatedText);
      return translatedText;
    } catch (error) {
      console.log('Auto translation failed:', error?.message || error);
      TRANSLATION_CACHE.set(cacheKey, originalText);
      return originalText;
    } finally {
      PENDING_REQUESTS.delete(cacheKey);
    }
  })();

  PENDING_REQUESTS.set(cacheKey, request);
  return request;
}