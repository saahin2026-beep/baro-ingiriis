import { useState, useCallback } from 'react';
import { storage } from './storage';
import translations from './translations';

export function useLanguage() {
  const [lang, setLangState] = useState(() => {
    const state = storage.get();
    return state.language || 'so';
  });

  const setLang = useCallback((newLang) => {
    setLangState(newLang);
    storage.update({ language: newLang });
  }, []);

  const t = useCallback((key) => {
    return translations[lang]?.[key] || translations['so']?.[key] || key;
  }, [lang]);

  return { lang, setLang, t };
}
