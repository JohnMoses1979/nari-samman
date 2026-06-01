import React, { forwardRef, useEffect, useState } from 'react';
import { TextInput as RNTextInput } from 'react-native';
import useAppLanguage from './useAppLanguage';
import { getCachedTranslation, translateText } from './translateText';

const AutoTextInput = forwardRef(({ placeholder, ...props }, ref) => {
  const lang = useAppLanguage();
  const [translatedPlaceholder, setTranslatedPlaceholder] = useState(placeholder);

  useEffect(() => {
    let active = true;

    if (!placeholder) {
      setTranslatedPlaceholder(placeholder);
      return () => {active = false;};
    }

    const text = String(placeholder);
    setTranslatedPlaceholder(getCachedTranslation(text, lang));

    translateText(text, lang).then((result) => {
      if (active) setTranslatedPlaceholder(result);
    });

    return () => {active = false;};
  }, [placeholder, lang]);

  return <RNTextInput ref={ref} placeholder={translatedPlaceholder} {...props} />;
});

export default AutoTextInput;