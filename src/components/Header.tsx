import React from 'react';
import { MessageCircle, MapPin } from 'lucide-react';
import { Language } from '../types';
import { getTranslations } from '../utils/i18nHelper';
import { openDirectWhatsAppInquiry } from '../utils/whatsapp';
import { LanguageSelector } from './LanguageSelector';

interface HeaderProps {
  onOpenDeliveryInfo: () => void;
  currentLang: Language;
  onSelectLang?: (lang: Language) => void;
  onChangeLang?: (lang: Language) => void;
  isAdminLoggedIn?: boolean;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDeliveryInfo,
  currentLang,
  onSelectLang,
  onChangeLang,
  isAdminLoggedIn,
  onOpenAdmin,
}) => {
  const t = getTranslations(currentLang);
  const handleLangChange = onSelectLang || onChangeLang || (() => {});

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#E8E2D9]">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-12 sm:h-14 flex items-center justify-between gap-2">
        {/* Left Side: Address / Pickup info */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs text-[#6D5A4C] min-w-0 flex-1">
          <button
            onClick={onOpenDeliveryInfo}
            className="flex items-center gap-1.5 hover:text-[#D97706] transition-colors cursor-pointer text-left shrink-0"
          >
            <MapPin className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
            <span className="font-medium truncate max-w-[180px] sm:max-w-[260px] md:max-w-none">
              {t.pickupAddress}
            </span>
          </button>
        </div>

        {/* Right Actions: Language Selector + Admin Badge (only when logged in) + WhatsApp Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Admin badge - only visible for logged in owner */}
          {isAdminLoggedIn && onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="min-h-10 sm:h-9 px-2.5 sm:px-3 rounded-full bg-amber-800 text-white flex items-center gap-1.5 font-bold text-xs transition-all active:scale-95 cursor-pointer shadow-xs"
              title="Панель владельца"
            >
              <span>⚙️ Меню</span>
            </button>
          )}

          {/* Language Switcher */}
          <LanguageSelector
            currentLang={currentLang}
            onSelectLang={handleLangChange}
          />

          {/* WhatsApp Button */}
          <button
            id="header-whatsapp-btn"
            onClick={() => openDirectWhatsAppInquiry(undefined, undefined, currentLang)}
            className="min-h-10 sm:h-9 px-3 sm:px-4 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center gap-1.5 font-bold text-xs transition-all active:scale-95 cursor-pointer shadow-xs"
            title={t.whatsappBtn}
            aria-label={t.whatsappBtn}
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            {/* На самых узких экранах остаётся только иконка — иначе шапка не помещается. */}
            <span className="hidden sm:inline">{t.whatsappBtn}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
