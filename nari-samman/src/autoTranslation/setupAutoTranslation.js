import { Alert } from 'react-native';
import useStore from '../store/useStore';
import { translateText } from './translateText';

let isPatched = false;

async function translateValue(value, lang) {
  if (typeof value !== 'string') return value;
  return translateText(value, lang);
}

export function setupAutoTranslation() {
  if (isPatched) return;
  isPatched = true;

  const originalAlert = Alert.alert.bind(Alert);

  Alert.alert = (title, message, buttons, options, type) => {
    const lang = useStore.getState().language || 'en';

    Promise.all([
    translateValue(title, lang),
    translateValue(message, lang),
    Promise.all((buttons || []).map(async (button) => ({
      ...button,
      text: await translateValue(button?.text, lang)
    })))]
    ).then(([translatedTitle, translatedMessage, translatedButtons]) => {
      originalAlert(translatedTitle, translatedMessage, buttons ? translatedButtons : buttons, options, type);
    });
  };
}