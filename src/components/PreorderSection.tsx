import React from 'react';
import { MessageCircle, Cake, Sparkles, ChefHat, HeartHandshake } from 'lucide-react';
import { Language } from '../types';
import { getTranslations } from '../utils/i18nHelper';
import { openDirectWhatsAppInquiry } from '../utils/whatsapp';

interface PreorderSectionProps {
  currentLang: Language;
}

export const PreorderSection: React.FC<PreorderSectionProps> = ({ currentLang }) => {
  const t = getTranslations(currentLang);

  const customOrderFeatures = currentLang === 'he' ? [
    { icon: Cake, text: 'עוגות מעוצבות ודקורציה מורכבת' },
    { icon: Sparkles, text: 'מאפים וקינוחים לפי מתכון אישי' },
    { icon: ChefHat, text: 'הזמנות מיוחדות לחגים ואירועים' },
    { icon: HeartHandshake, text: 'התאמה מלאה להעדפות והגבלות תזונתיות' }
  ] : currentLang === 'en' ? [
    { icon: Cake, text: 'Custom themed cakes & intricate decor' },
    { icon: Sparkles, text: 'Custom bakes & individual family recipes' },
    { icon: ChefHat, text: 'Special catering for holidays & parties' },
    { icon: HeartHandshake, text: 'Dietary adjustments & tailored portions' }
  ] : [
    { icon: Cake, text: 'Торты со сложным декором на любой праздник' },
    { icon: Sparkles, text: 'Любая выпечка и десерты по вашему вкусу' },
    { icon: ChefHat, text: 'Праздничные наборы и банкетные блюда' },
    { icon: HeartHandshake, text: 'Индивидуальный подбор состава и порций' }
  ];

  return (
    <section 
      id="custom-order-section"
      className="my-8 sm:my-10 rounded-2xl bg-gradient-to-br from-[#FFFDF9] via-white to-[#FDF8F3] border border-[#E8E2D9] p-5 sm:p-8 shadow-xs relative overflow-hidden"
    >
      {/* Decorative background circle */}
      <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-[#D97706]/5 rounded-full pointer-events-none blur-xl" />

      <div className="relative z-10 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#F0EBE4] pb-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#D97706]/10 text-[#D97706] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.preorderSectionBadge}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#4A3728] tracking-tight">
              {t.preorderSectionTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#6D5A4C] leading-relaxed">
              {t.preorderSectionSubtitle}
            </p>
          </div>

          <button
            onClick={() => openDirectWhatsAppInquiry(t.preorderSectionTitle, undefined, currentLang)}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t.askOnWhatsApp}</span>
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {customOrderFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl p-4 border border-[#E8E2D9] flex items-center gap-3 shadow-2xs hover:border-[#D97706]/40 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-[#FCE7D6] text-[#D97706] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-[#4A3728] leading-snug">
                  {feat.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
