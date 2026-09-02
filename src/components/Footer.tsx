import React from 'react';
import { MapPin, MessageCircle, Heart, Clock } from 'lucide-react';
import { Language } from '../types';
import { getTranslations } from '../utils/i18nHelper';
import { openDirectWhatsAppInquiry } from '../utils/whatsapp';

interface FooterProps {
  onScrollToDelivery: () => void;
  currentLang: Language;
}

export const Footer: React.FC<FooterProps> = ({
  onScrollToDelivery,
  currentLang,
}) => {
  const t = getTranslations(currentLang);

  return (
    <footer className="bg-[#4A3728] text-[#FDFBF7] mt-16 pt-12 pb-24 sm:pb-12 border-t border-[#382a1e]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#5D4037]">
          {/* Col 1: Brand & Description */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#D97706] flex items-center justify-center text-2xl shadow-sm">
                🥧
              </div>
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {t.footerAboutTitle}
              </span>
            </div>

            <p className="text-xs sm:text-sm opacity-80 leading-relaxed max-w-md">
              {t.footerAboutText}
            </p>
          </div>

          {/* Col 2: Navigation & Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#D97706]">
              {currentLang === 'he' ? 'ניווט מהיר' : currentLang === 'en' ? 'Quick Navigation' : 'Разделы'}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm opacity-85">
              <li>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.showAllMenu}
                </button>
              </li>
              <li>
                <button
                  onClick={onScrollToDelivery}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.deliveryTitle}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('custom-order-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.preorderSectionTitle}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contacts, Operating Hours & Address */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#D97706]">
              {t.footerContactsTitle}
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm opacity-90">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">{t.deliveryOptionPickup}:</span>
                  <span>{t.pickupAddress}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">{t.footerHoursTitle}:</span>
                  <span className="whitespace-pre-line">{t.footerHoursText}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => openDirectWhatsAppInquiry(undefined, undefined, currentLang)}
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t.whatsappBtn}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs opacity-70">
          <div>
            {t.footerCopyright}
          </div>
          <div className="flex items-center gap-1">
            <span>{t.footerHomemadeGuarantee}</span>
            <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
