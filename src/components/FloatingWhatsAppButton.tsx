import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Language } from '../types';
import { getTranslations } from '../utils/i18nHelper';
import { openDirectWhatsAppInquiry } from '../utils/whatsapp';

interface FloatingWhatsAppButtonProps {
  currentLang: Language;
}

export const FloatingWhatsAppButton: React.FC<FloatingWhatsAppButtonProps> = ({
  currentLang,
}) => {
  const [showTooltip, setShowTooltip] = useState(true);
  const t = getTranslations(currentLang);

  const tooltipText = currentLang === 'he' 
    ? 'יש לכם שאלות? כתבו לנו בוואטסאפ!'
    : currentLang === 'en'
    ? 'Have questions? Message us on WhatsApp!'
    : 'Есть вопросы? Напишите нам в WhatsApp!';

  return (
    <div
      className={`fixed z-30 ${currentLang === 'he' ? 'left-4 sm:left-6' : 'right-4 sm:right-6'} bottom-safe transition-all duration-300`}
    >
      <div className="relative flex items-center gap-2">
        {/* Tooltip speech bubble */}
        {showTooltip && (
          <div className="hidden md:flex items-center gap-2 bg-white text-[#4A3728] text-xs font-semibold px-3.5 py-2 rounded-full shadow-lg border border-[#E8E2D9] animate-in fade-in duration-300">
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
            <span>{tooltipText}</span>
            <button
              onClick={() => setShowTooltip(false)}
              aria-label="Скрыть подсказку"
              className="text-gray-400 hover:text-[#4A3728] p-1.5 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Glowing button */}
        <button
          id="floating-whatsapp-trigger"
          onClick={() => openDirectWhatsAppInquiry(undefined, undefined, currentLang)}
          className="group relative w-14 h-14 sm:w-13 sm:h-13 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-lg hover:shadow-2xl shadow-[#25D366]/40 transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
          title={t.whatsappBtn}
        >
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25 pointer-events-none" />
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-current drop-shadow-md" />
        </button>
      </div>
    </div>
  );
};
