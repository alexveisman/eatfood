/**
 * Связывает файлы из src/assets/images/source/ с блюдами и галереей — по имени файла.
 *
 * Правило одно, и его достаточно, чтобы добавить фото без единой правки в коде:
 *
 *   <id блюда>.jpg      → фотография этого блюда (она же попадёт в галерею)
 *   gallery-<что-то>.jpg → фотография только для галереи, без привязки к блюду
 *
 * Например `pirozhki-homemade.jpg` встанет в карточку пирожков, а
 * `gallery-draniki.jpg` — просто в ленту фотографий внизу страницы.
 */
import type { ImageSource } from '../../types';
import { IMAGES } from './manifest';

/** Тот же перевод имени в ключ, что делает scripts/optimize-images.mjs. */
function toKey(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9]+(.)?/g, (_, chr: string | undefined) => (chr ? chr.toUpperCase() : ''))
    .replace(/^(.)/, (chr) => chr.toLowerCase());
}

const BY_KEY = IMAGES as Record<string, ImageSource | undefined>;

/** Фотография блюда, если файл с таким именем лежит в source/. */
export function photoForDish(dishId: string): ImageSource | undefined {
  return BY_KEY[toKey(dishId)];
}

/**
 * Подписи к фотографиям галереи. Нужны только для озвучки скринридером и
 * подсказки при увеличении, поэтому отсутствие подписи не ломает ничего —
 * фото всё равно покажется с общим текстом.
 */
const GALLERY_CAPTIONS: Record<string, string> = {
  galleryDraniki: 'Драники картофельные',
  galleryPirozhkiBox: 'Пирожки прямо из духовки',
  galleryPirozhokCherry: 'Пирожок с вишней в разрезе',
};

export interface BuiltInGalleryPhoto {
  id: string;
  title: string;
  image: ImageSource;
}

/** Фотографии из source/ с именем `gallery-*` — они идут только в ленту внизу страницы. */
export const BUILT_IN_GALLERY: BuiltInGalleryPhoto[] = Object.entries(BY_KEY)
  .filter(([key]) => key.startsWith('gallery'))
  .map(([key, image]) => ({
    id: `built-in-${key}`,
    title: GALLERY_CAPTIONS[key] ?? 'Фото нашей кухни',
    image: image as ImageSource,
  }))
  .sort((a, b) => a.id.localeCompare(b.id));
