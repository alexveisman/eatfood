import React, { useMemo, useState } from 'react';
import { Camera, Plus, Sparkles } from 'lucide-react';
import type { ImageSource, Language, Product } from '../types';
import { getTranslations } from '../utils/i18nHelper';
import type { GalleryPhotoItem } from '../services/productService';
import { isValidImageSource } from '../utils/imageUrlHelper';
import { BUILT_IN_GALLERY } from '../assets/images/builtInPhotos';
import { SmartImage } from './SmartImage';
import { ImageLightbox } from './ImageLightbox';

interface HorizontalFoodGalleryProps {
  products: Product[];
  currentLang: Language;
  galleryPhotos: GalleryPhotoItem[];
  isAdminLoggedIn?: boolean;
  onOpenAdmin?: () => void;
}

interface GalleryEntry {
  id: string;
  title: string;
  image: ImageSource;
}

/** Ключ для сравнения: у адаптивных наборов сравниваем основной файл, у строк — саму строку. */
function imageKey(image: ImageSource): string {
  return typeof image === 'string' ? image : image.src;
}

export const HorizontalFoodGallery: React.FC<HorizontalFoodGalleryProps> = ({
  products,
  currentLang,
  galleryPhotos,
  isAdminLoggedIn,
  onOpenAdmin,
}) => {
  const t = getTranslations(currentLang);
  const [zoomed, setZoomed] = useState<GalleryEntry | null>(null);

  const displayPhotos = useMemo<GalleryEntry[]>(() => {
    const entries: GalleryEntry[] = [];
    const seen = new Set<string>();

    for (const photo of galleryPhotos) {
      if (!isValidImageSource(photo.image)) continue;
      const key = imageKey(photo.image);
      if (seen.has(key)) continue;
      seen.add(key);
      entries.push({ id: photo.id, title: photo.title, image: photo.image });
    }

    for (const product of products) {
      if (!isValidImageSource(product.image)) continue;
      const key = imageKey(product.image);
      if (seen.has(key)) continue;
      seen.add(key);
      entries.push({ id: product.id, title: product.name, image: product.image });
    }

    // Снимки из репозитория с именем `gallery-*` — они не привязаны к блюду,
    // поэтому попадают в ленту только здесь.
    for (const photo of BUILT_IN_GALLERY) {
      const key = imageKey(photo.image);
      if (seen.has(key)) continue;
      seen.add(key);
      entries.push(photo);
    }

    return entries;
  }, [galleryPhotos, products]);

  if (displayPhotos.length === 0) {
    if (!isAdminLoggedIn) return null;
    return (
      <section
        id="food-photo-gallery-empty"
        className="mt-6 p-4 rounded-2xl bg-amber-50/60 border border-dashed border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-700"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-stone-900">Галерея готова для ваших фотографий</h3>
            <p className="text-xs text-stone-600">Загрузите фото блюд прямо с телефона или компьютера</p>
          </div>
        </div>
        {onOpenAdmin && (
          <button
            onClick={onOpenAdmin}
            className="px-4 min-h-11 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            Загрузить фото
          </button>
        )}
      </section>
    );
  }

  /**
   * Лента дублируется, чтобы прокрутка выглядела бесконечной: анимация сдвигает
   * трек ровно на половину его ширины, поэтому копий всегда чётное число.
   */
  const repeats = displayPhotos.length < 5 ? 4 : 2;
  const infinitePhotos = Array.from({ length: repeats }, () => displayPhotos).flat();

  return (
    <>
      <section
        id="food-photo-gallery"
        className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-[#E8E2D9] space-y-4 overflow-hidden"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D97706]/10 text-[#D97706] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.photoGalleryTitle}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#4A3728] tracking-tight">
              {t.photoGalleryTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#6D5A4C]">{t.photoGallerySubtitle}</p>
          </div>

          {/* Кнопка загрузки — только владельцу: посетителю она недоступна и раньше показывалась зря. */}
          {isAdminLoggedIn && onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3 min-h-11 sm:min-h-9 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-semibold border border-amber-200 transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Добавить фото</span>
            </button>
          )}
        </div>

        <div className="relative w-full overflow-hidden py-2">
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#FDFBF7] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#FDFBF7] to-transparent z-10 pointer-events-none" />

          <div className="animate-scroll-right flex gap-3 sm:gap-4.5">
            {infinitePhotos.map((item, idx) => (
              <button
                type="button"
                key={`food-photo-${item.id}-${idx}`}
                onClick={() => setZoomed(item)}
                aria-label={`Открыть фото: ${item.title}`}
                className="flex-none rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D97706]"
              >
                <SmartImage
                  source={item.image}
                  alt={item.title || 'Фото блюда'}
                  sizes="(max-width: 640px) 200px, 250px"
                  /* Первый экран ленты грузим сразу — остальное подтянется при прокрутке. */
                  priority={idx < 3}
                  wrapperClassName="w-[200px] sm:w-[250px] h-[140px] sm:h-[170px] rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 border border-[#E8E2D9]"
                  className="hover:scale-105 transition-transform duration-500 ease-out"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {zoomed && (
        <ImageLightbox source={zoomed.image} title={zoomed.title} onClose={() => setZoomed(null)} />
      )}
    </>
  );
};
