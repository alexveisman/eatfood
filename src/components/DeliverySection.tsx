import React, { useState } from 'react';
import { MapPin, Car, CreditCard } from 'lucide-react';
import { Language } from '../types';
import { getTranslations } from '../utils/i18nHelper';

interface DeliverySectionProps {
  currentLang: Language;
}

export const DeliverySection: React.FC<DeliverySectionProps> = ({ currentLang }) => {
  const [copied, setCopied] = useState(false);
  const t = getTranslations(currentLang);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(t.pickupAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="delivery-info-section" className="my-8 sm:my-10 space-y-4">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#D97706]">
          {t.deliveryBadge}
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-[#4A3728]">
          {t.deliveryTitle}
        </h2>
        <p className="text-xs sm:text-sm text-[#6D5A4C] mt-0.5">
          {t.deliverySubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Pickup */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8E2D9] flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#FCE7D6] text-[#D97706] flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#4A3728]">
                  {t.pickupCardTitle}
                </h3>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                0 ₪
              </span>
            </div>

            <p className="text-xs text-[#6D5A4C]">
              {t.pickupCardDesc}
            </p>

            {/* Address box */}
            <div className="bg-[#FDFBF7] p-3 rounded-xl border border-[#E8E2D9] flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#4A3728]">
                <MapPin className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
                <span>{t.pickupAddress}</span>
              </div>

              <button
                onClick={handleCopyAddress}
                className="text-[11px] font-bold text-[#8B5E3C] hover:text-[#4A3728] px-2 py-1 rounded-md bg-white border border-[#E8E2D9] transition-colors cursor-pointer shrink-0"
              >
                {copied ? '✓' : (currentLang === 'he' ? 'העתק' : currentLang === 'en' ? 'Copy' : 'Копировать')}
              </button>
            </div>
          </div>

          <div className="text-[11px] text-[#8B5E3C] pt-2 border-t border-[#F0EBE4]">
            {t.pickupCardTime}
          </div>
        </div>

        {/* Card 2: Taxi */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8E2D9] flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#EFEBE9] text-[#4A3728] flex items-center justify-center">
                  <Car className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#4A3728]">
                  {t.courierCardTitle}
                </h3>
              </div>
            </div>

            <p className="text-xs text-[#6D5A4C]">
              {t.courierCardDesc}
            </p>

            <div className="flex items-center gap-1.5 text-xs text-[#5D4037] bg-[#FDFBF7] p-2.5 rounded-xl border border-[#E8E2D9]">
              <CreditCard className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
              <span>{t.orderTermsPayment}</span>
            </div>
          </div>

          <div className="text-[11px] text-[#8B5E3C] pt-2 border-t border-[#F0EBE4]">
            {t.courierCardTime}
          </div>
        </div>
      </div>
    </section>
  );
};
