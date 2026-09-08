import React, { useState } from 'react';
import { Product, Language, Category, CategoryId } from '../types';
import { MessageCircle, Sparkles, Flame, ChevronDown, ChevronUp, Layers, UtensilsCrossed, Image as ImageIcon } from 'lucide-react';
import { getTranslations } from '../utils/i18nHelper';
import { openDirectWhatsAppInquiry } from '../utils/whatsapp';
import { CategoryNav } from './CategoryNav';
import { SmartImage } from './SmartImage';
import { ImageLightbox } from './ImageLightbox';

interface RestaurantMenuListProps {
  products: Product[];
  currentLang: Language;
  onSelectProduct?: (product: Product) => void;
  categories: Category[];
  activeCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onResetFilters: () => void;
}

/**
 * Цены показываем целыми шекелями — по просьбе владельца, копейки в меню
 * только мешают читать. Округляется и расчётная цена за 100 г.
 */
const formatPrice = (price: number, lang: Language): string =>
  Math.round(price).toLocaleString(lang === 'ru' ? 'ru-RU' : lang === 'he' ? 'he-IL' : 'en-US', {
    maximumFractionDigits: 0,
  });

/**
 * Подсказка вида «9 ₪ / 100г» или «~15 ₪ / шт».
 *
 * Считаем её только если в единице измерения указано чистое количество.
 * У части блюд единица — свободный текст с ценами внутри («45 ₪ / шт (сет:
 * 125 ₪ / 3 шт)»), и первое число там означает цену, а не количество: расчёт
 * принимал его за штуки и выдавал бессмысленное «~1 ₪ / шт».
 */
const getUnitPriceBreakdown = (price: number, unit: string, lang: Language): string | null => {
  if (unit.includes('₪')) return null;

  const matchPcs = unit.match(/(\d+)/);
  if (matchPcs && matchPcs[1]) {
    const count = parseInt(matchPcs[1], 10);
    if (count > 1) {
      const perUnit = formatPrice(price / count, lang);
      const pcLabel = lang === 'he' ? 'יח׳' : lang === 'en' ? 'pc' : 'шт';
      return `~${perUnit} ₪ / ${pcLabel}`;
    }
  }
  if (unit.includes('кг') || unit.includes('kg') || unit.includes('ק״ג')) {
    const per100g = formatPrice(price / 10, lang);
    const gLabel = lang === 'he' ? '100 גרם' : lang === 'en' ? '100g' : '100г';
    return `${per100g} ₪ / ${gLabel}`;
  }
  return null;
};

export const RestaurantMenuList: React.FC<RestaurantMenuListProps> = ({
  products,
  currentLang,
  onSelectProduct,
  categories,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onResetFilters,
}) => {
  const t = getTranslations(currentLang);
  const [openFillings, setOpenFillings] = useState<Record<string, boolean>>({});
  const [openPurses, setOpenPurses] = useState<Record<string, boolean>>({});
  const [zoomedProduct, setZoomedProduct] = useState<Product | null>(null);

  const toggleFillings = (id: string) => {
    setOpenFillings((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const togglePurse = (id: string) => {
    setOpenPurses((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const fillingsLabel = currentLang === 'he' 
    ? 'אפשרויות מילוי' 
    : currentLang === 'en' 
    ? 'Available fillings' 
    : 'Варианты начинок';

  return (
    <>
    <div className="bg-white rounded-2xl border border-[#E8E2D9] shadow-xs overflow-hidden">
      {/* Заголовок раздела — прокручивается вместе со страницей. */}
      <div className="bg-[#FAF7F2] px-4 sm:px-6 pt-3.5 pb-2.5 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#D97706] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.restaurantMenuTitle}</span>
            </div>
            <p className="text-xs text-[#6D5A4C] leading-relaxed">
              {t.textUsWhatsAppDesc}
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#25D366]/10 text-[#128C7E] text-xs font-semibold self-start sm:self-auto border border-[#25D366]/20">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{t.quickOrderWhatsApp}</span>
          </div>
        </div>
      </div>

      {/*
        Закреплён только поиск с категориями. Раньше вместе с ними «прилипал» и
        заголовок раздела — блок высотой 237px занимал четверть экрана телефона
        и налезал на первое блюдо.
      */}
      <div className="sticky top-12 sm:top-14 z-30 bg-[#FAF7F2]/95 backdrop-blur-md px-4 sm:px-6 pb-2.5 border-b border-[#E8E2D9]">
        <CategoryNav
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={onSelectCategory}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          currentLang={currentLang}
        />
      </div>

      {/* Itemized Restaurant Menu List or Empty State */}
      {products.length > 0 ? (
        <div className="divide-y divide-[#F0EBE4] px-4 sm:px-6">
          {products.map((product, index) => {
            const unitBreakdown = getUnitPriceBreakdown(product.price, product.unit, currentLang);
            const hasFillings = Boolean(product.availableFillings && product.availableFillings.length > 0);
            const isFillingsOpen = Boolean(openFillings[product.id]);
            const isPurseOpen = Boolean(openPurses[product.id]);

            return (
              <article
                key={`restaurant-menu-${product.id}`}
                id={`menu-item-${product.id}`}
                className="py-3.5 sm:py-4 group hover:bg-[#FAF8F5] -mx-4 px-4 sm:-mx-6 sm:px-6 transition-colors scroll-mt-32"
              >
              <div className="flex items-start gap-3 sm:gap-4">
                {/* Фото блюда: крупнее на телефоне, по тапу открывается во весь экран */}
                {product.image ? (
                  <button
                    type="button"
                    onClick={() => {
                      onSelectProduct?.(product);
                      setZoomedProduct(product);
                    }}
                    aria-label={`Открыть фото: ${product.name}`}
                    className="shrink-0 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D97706]"
                  >
                    <SmartImage
                      source={product.image}
                      alt={product.name}
                      /* Миниатюра никогда не шире 112px, поэтому браузер берёт вариант 400w, а не 1200w. */
                      sizes="(max-width: 640px) 88px, 112px"
                      priority={index < 3}
                      wrapperClassName="w-22 h-22 sm:w-28 sm:h-28 rounded-xl border border-[#E8E2D9] shadow-2xs group-hover:border-[#D97706]/60 transition-all"
                      className="group-hover:scale-105 transition-transform duration-300"
                    />
                  </button>
                ) : (
                  <div
                    className="w-22 h-22 sm:w-28 sm:h-28 rounded-xl bg-[#F5EFE6]/80 border-2 border-dashed border-[#D9CEBF] flex flex-col items-center justify-center shrink-0 text-[#A09081] transition-colors group-hover:border-[#D97706]/60 group-hover:bg-[#FDF8F0]"
                    title="Место для фото блюда"
                  >
                    <ImageIcon className="w-6 h-6 stroke-[1.5] text-[#B8A695] group-hover:text-[#D97706]" />
                    <span className="text-[9px] font-medium mt-0.5 text-[#A09081]">Фото</span>
                  </div>
                )}

                {/* Right Side: Dish Content */}
                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                  {/* Top row: Full title + badges & Price + WhatsApp Button */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-3">
                    {/* Dish title with full visibility on mobile */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h3 className="font-bold text-sm sm:text-base text-[#382A1E] tracking-tight leading-snug break-words">
                          {product.name}
                        </h3>

                        {/* Cooking Option Tags */}
                        {product.cookingOptions && product.cookingOptions.length > 0 && (
                          <div className="inline-flex items-center gap-1 shrink-0">
                            {product.cookingOptions.map((opt) => (
                              <span
                                key={opt}
                                className="inline-flex items-center gap-0.5 text-[10px] sm:text-[11px] font-semibold bg-[#F5EFE6] text-[#8B5E3C] border border-[#E3DACD] px-1.5 py-0.2 rounded-md"
                              >
                                <Flame className="w-2.5 h-2.5 text-[#D97706]" />
                                {opt}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Badge */}
                        {product.badge && (
                          <span className="text-[10px] font-bold bg-[#D97706]/10 text-[#D97706] px-1.5 py-0.2 rounded shrink-0">
                            {product.badge}
                          </span>
                        )}
                      </div>
                    </div>

                    {/*
                      Цена и кнопка заказа.
                      На телефоне строка обязана уметь сжиматься: раньше здесь стояли
                      shrink-0 и whitespace-nowrap, из-за чего длинная подпись единицы
                      («8 ₪ / шт (пак 60 ₪ / 10 шт)») распирала строку и выталкивала
                      кнопку WhatsApp за край карточки — а карточка обрезает содержимое,
                      так что кнопка просто пропадала.
                    */}
                    <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-3 min-w-0 sm:shrink-0 pt-0.5 sm:pt-0">
                      {/* На телефоне цена читается слева направо вместе с описанием;
                          выравнивание по правому краю оставляем широким экранам. */}
                      <div
                        className={`min-w-0 text-left ${
                          currentLang === 'he' ? 'sm:text-left' : 'sm:text-right'
                        }`}
                      >
                        <span className="font-extrabold text-sm sm:text-base text-[#4A3728] whitespace-nowrap">
                          {formatPrice(product.price, currentLang)}{' '}
                          <span className="text-[#D97706] text-xs sm:text-sm">{t.currency}</span>
                        </span>
                        <div className="text-[10px] sm:text-[11px] text-gray-500 font-medium sm:whitespace-nowrap">
                          <span>{product.unit}</span>
                          {unitBreakdown && (
                            <span className="text-[#8B5E3C] font-semibold ml-1 rtl:mr-1">
                              ({unitBreakdown})
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => openDirectWhatsAppInquiry(
                          `${product.name} (${product.price} ₪, ${product.unit})`,
                          undefined,
                          currentLang
                        )}
                        className="inline-flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-3.5 sm:px-3 min-h-11 sm:min-h-8 rounded-full text-xs font-bold transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer shrink-0"
                        title={t.orderDishOnWhatsApp}
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-white text-[#25D366]" />
                        {/* Длинная подпись только на широких экранах: на телефоне
                            она распирала строку и кнопка уезжала за край карточки. */}
                        <span className="hidden sm:inline">{t.orderDishOnWhatsApp}</span>
                        <span className="sm:hidden">WhatsApp</span>
                      </button>
                    </div>
                  </div>

                  {/* Short Description */}
                  {product.shortDescription && (
                    <p className="text-xs text-[#6D5A4C] leading-relaxed break-words">
                      {product.shortDescription}
                    </p>
                  )}

                  {/* Accordion Action Toggles (Fillings & Ingredients) */}
                  <div className="pt-1 flex flex-wrap items-center gap-2">
                    {/* Fillings Accordion Toggle */}
                    {hasFillings && (
                      <button
                        type="button"
                        onClick={() => toggleFillings(product.id)}
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 min-h-9 rounded-lg border transition-all cursor-pointer select-none ${
                          isFillingsOpen
                            ? 'bg-[#D97706] text-white border-[#D97706] shadow-xs'
                            : 'bg-[#FDF8F0] hover:bg-[#F5ECE0] text-[#B45309] border-[#E8D9C5]'
                        }`}
                      >
                        <Layers className="w-3.5 h-3.5 shrink-0" />
                        <span>{fillingsLabel} ({product.availableFillings?.length})</span>
                        {isFillingsOpen ? (
                          <ChevronUp className="w-3.5 h-3.5 shrink-0" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 shrink-0" />
                        )}
                      </button>
                    )}

                    {/* Additional Info / Ingredients Accordion Toggle */}
                    {(product.ingredients?.length || product.cookingInstructions || product.storageInfo || product.weight) && (
                      <button
                        type="button"
                        onClick={() => togglePurse(product.id)}
                        className="inline-flex items-center gap-1 text-[11px] text-[#8B5E3C] hover:text-[#D97706] font-semibold transition-colors cursor-pointer bg-[#F8F5F0] hover:bg-[#F2ECE3] px-3 min-h-9 rounded-md border border-[#E8E2D9]"
                      >
                        <UtensilsCrossed className="w-3 h-3 text-[#D97706]" />
                        <span>{t.ingredientsAndTips}</span>
                        {isPurseOpen ? (
                          <ChevronUp className="w-3 h-3 text-[#D97706]" />
                        ) : (
                          <ChevronDown className="w-3 h-3 text-[#8B5E3C]" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Fillings Dropdown / Accordion Body */}
                  {hasFillings && isFillingsOpen && (
                    <div className="mt-2 p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E2D9] animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="text-xs font-bold text-[#4A3728] mb-2 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                        <span>{fillingsLabel}:</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {product.availableFillings?.map((filling, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-lg border border-[#EAE3D8] text-xs text-[#4A3728] font-medium"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]/70 shrink-0" />
                            <span className="leading-snug">{filling}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Extra Info Accordion Body */}
                  {isPurseOpen && (
                    <div className="mt-2 p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E2D9] text-xs space-y-1.5 text-[#5D4A3D] animate-in fade-in slide-in-from-top-1 duration-200">
                      {product.ingredients && product.ingredients.length > 0 && (
                        <p>
                          <strong className="text-[#4A3728] font-semibold">{t.ingredientsTitle} </strong>
                          {product.ingredients.join(', ')}
                        </p>
                      )}

                      {product.cookingInstructions && (
                        <p>
                          <strong className="text-[#4A3728] font-semibold">{t.instructionsTitle} </strong>
                          {product.cookingInstructions}
                        </p>
                      )}

                      {product.storageInfo && (
                        <p>
                          <strong className="text-[#4A3728] font-semibold">{t.storageLabel} </strong>
                          {product.storageInfo}
                        </p>
                      )}

                      {product.weight && (
                        <p className="text-[11px] text-gray-500 font-medium">
                          {t.portionWeightLabel} {product.weight}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
        </div>
      ) : (
        <div className="text-center py-12 sm:py-16 px-6 sm:px-8 space-y-3">
          <div className="text-3xl sm:text-4xl">🔍</div>
          <h3 className="text-base sm:text-lg font-bold text-[#4A3728]">
            {t.noProductsFound}
          </h3>
          <p className="text-xs sm:text-sm text-[#5D4037]">
            {t.noProductsFoundDesc}
          </p>
          <button
            onClick={onResetFilters}
            className="px-5 py-2.5 rounded-full bg-[#4A3728] text-white text-xs font-bold shadow-sm cursor-pointer hover:bg-[#382a1e] transition-colors"
          >
            {t.showAllMenu}
          </button>
        </div>
      )}

      {/* Bottom info banner */}
      <div className="bg-[#FAF7F2] px-4 sm:px-6 py-2.5 border-t border-[#E8E2D9] text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-1 text-xs">
        <span className="text-[#6D5A4C]">
          {t.pickupAndDeliveryFooter}
        </span>
        <span className="font-semibold text-[#D97706]">
          {t.sweetComplimentFooter}
        </span>
      </div>
    </div>

    {zoomedProduct && (
      <ImageLightbox
        source={zoomedProduct.image}
        title={zoomedProduct.name}
        onClose={() => setZoomedProduct(null)}
      />
    )}
    </>
  );
};
