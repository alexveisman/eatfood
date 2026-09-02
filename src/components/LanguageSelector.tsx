import React from 'react';
import { Language } from '../types';

interface LanguageSelectorProps {
  currentLang: Language;
  onSelectLang?: (lang: Language) => void;
  onChangeLang?: (lang: Language) => void;
}

const LANGUAGES: { id: Language; label: string; short: string; flag: string }[] = [
  { id: 'ru', label: 'Русский', short: 'RU', flag: '🇷🇺' },
  { id: 'en', label: 'English', short: 'EN', flag: '🇬🇧' },
  { id: 'he', label: 'עברית', short: 'עב', flag: '🇮🇱' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLang,
  onSelectLang,
  onChangeLang,
}) => {
  const handleSelect = (lang: Language) => {
    if (typeof onSelectLang === 'function') {
      onSelectLang(lang);
    } else if (typeof onChangeLang === 'function') {
      onChangeLang(lang);
    }
  };

  return (
    <div className="inline-flex items-center bg-[#F3ECE4] p-0.5 rounded-full border border-[#E8E0D5] text-xs font-semibold">
      {LANGUAGES.map((lang) => {
        const isActive = currentLang === lang.id;
        return (
          <button
            key={lang.id}
            onClick={() => handleSelect(lang.id)}
            aria-label={lang.label}
            aria-pressed={isActive}
            className={`px-2 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1 text-[11px] ${
              isActive
                ? 'bg-white text-[#4A3728] shadow-2xs font-bold'
                : 'text-[#8C7665] hover:text-[#4A3728]'
            }`}
            title={lang.label}
          >
            <span aria-hidden="true">{lang.flag}</span>
            {/* Подпись прячем на узких экранах: в шапке телефона места на неё нет. */}
            <span className="font-medium hidden sm:inline">{lang.short}</span>
          </button>
        );
      })}
    </div>
  );
};
