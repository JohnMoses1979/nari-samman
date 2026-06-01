import { useCallback, useState } from 'react';
import useAppLanguage from './useAppLanguage';
import { formatText } from './formatText';
import { getCachedTranslation, translateText } from './translateText';

export default function useAutoTranslation() {
  const lang = useAppLanguage();
  const [, setVersion] = useState(0);

  const translate = useCallback((text, params) => {
    const formatted = formatText(text, params);
    const cached = getCachedTranslation(formatted, lang);

    if (lang !== 'en' && cached === formatted) {
      translateText(formatted, lang).then(() => setVersion((v) => v + 1));
    }

    return cached;
  }, [lang]);

  return { translate, lang };
}