"use client";

import { useContext } from 'react';
import { LanguageContext } from '@/context/LanguageContext';

function getNestedTranslation(obj: any, key: string): string | undefined {
  return key.split('.').reduce((o, i) => (o ? o[i] : undefined), obj);
}

export const useTranslation = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }

  const { translations, locale, setLocale } = context;

  const t = (key: string, params?: Record<string, string | number>): string => {
    let translation = getNestedTranslation(translations, key) || key;
    if (params) {
      Object.keys(params).forEach(paramKey => {
        translation = translation.replace(`{${paramKey}}`, String(params[paramKey]));
      });
    }
    return translation;
  };

  return { t, locale, setLocale };
};
