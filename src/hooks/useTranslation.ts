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

  const { translations } = context;

  const t = (key: string): string => {
    return getNestedTranslation(translations, key) || key;
  };

  return { t, locale: context.locale, setLocale: context.setLocale };
};
