import React, { useEffect, useMemo, useState } from 'react';
import { Text as RNText } from 'react-native';
import useAppLanguage from './useAppLanguage';
import { getCachedTranslation, translateText } from './translateText';

function flattenSimpleText(children) {
  if (typeof children === 'string' || typeof children === 'number') return String(children);
  if (Array.isArray(children) && children.every((child) => typeof child === 'string' || typeof child === 'number')) {
    return children.map((child) => String(child)).join('');
  }
  return null;
}

export default function AutoText({ children, ...props }) {
  const lang = useAppLanguage();
  const simpleText = useMemo(() => flattenSimpleText(children), [children]);
  const [translatedText, setTranslatedText] = useState(() => simpleText !== null ? getCachedTranslation(simpleText, lang) : null);

  useEffect(() => {
    let active = true;

    if (simpleText === null) {
      setTranslatedText(null);
      return () => {active = false;};
    }

    const cached = getCachedTranslation(simpleText, lang);
    setTranslatedText(cached);

    translateText(simpleText, lang).then((result) => {
      if (active) setTranslatedText(result);
    });

    return () => {active = false;};
  }, [simpleText, lang]);

  return <RNText {...props}>{simpleText === null ? children : translatedText}</RNText>;
}