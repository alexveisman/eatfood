/**
 * Нормализация источников изображений.
 *
 * Владелец может задать фото четырьмя способами:
 *  - загрузить файл  → data:image/... или ссылка в Firebase Storage
 *  - вставить ссылку Google Drive / Dropbox → превращаем в прямую ссылку на файл
 *  - вставить любой прямой https-URL
 *  - оставить встроенное фото из сборки → объект ResponsiveImage со срезом вариантов
 *
 * Весь остальной код работает с результатом resolveImage() и не знает об этих различиях.
 */

import type { ImageSource, ResponsiveImage } from '../types';

/** Разобранный источник, готовый к передаче в <img>. */
export interface ResolvedImage {
  src: string;
  srcSet?: string;
  blurDataUrl?: string;
  aspectRatio?: number;
}

export function isResponsiveImage(value: unknown): value is ResponsiveImage {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as ResponsiveImage).src === 'string' &&
    typeof (value as ResponsiveImage).srcSet === 'string'
  );
}

export function extractGoogleDriveFileId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  // Порядок важен: `/file/d/ID` встречается чаще всего, а `uc?id=` — самый специфичный.
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]{10,})/,
    /google\.com\/uc\?.*id=([a-zA-Z0-9_-]{10,})/,
    /[?&]id=([a-zA-Z0-9_-]{10,})/,
    /\/d\/([a-zA-Z0-9_-]{10,})/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

/** Приводит внешнюю ссылку к виду, который браузер может показать напрямую в <img>. */
export function convertGoogleDriveUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();

  if (trimmed.startsWith('data:image/') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  if (trimmed.includes('dropbox.com')) {
    return trimmed.replace(/([?&])dl=0\b/, '$1raw=1');
  }

  // Ссылки Google Drive вида /file/d/.../view отдают HTML-страницу, а не картинку.
  const fileId = extractGoogleDriveFileId(trimmed);
  if (fileId) {
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  return trimmed;
}

/**
 * Запасной адрес, если основной не открылся.
 * lh3.googleusercontent.com иногда отдаёт 403 для файлов с ограниченным доступом —
 * старый эндпоинт drive.google.com/thumbnail в этих случаях всё ещё работает.
 */
export function getGoogleDriveThumbnailFallback(url: string): string | null {
  const fileId = extractGoogleDriveFileId(url);
  if (!fileId) return null;
  const fallback = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
  return fallback === url ? null : fallback;
}

export function isValidImageSource(src?: ImageSource): boolean {
  if (isResponsiveImage(src)) return true;
  if (!src || typeof src !== 'string') return false;

  const trimmed = src.trim();
  if (trimmed.length === 0) return false;
  return (
    trimmed.startsWith('data:image/') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('./') ||
    trimmed.startsWith('../')
  );
}

/** Единая точка входа: любой ImageSource → готовые атрибуты для <img>. */
export function resolveImage(source?: ImageSource): ResolvedImage | null {
  if (!source) return null;

  if (isResponsiveImage(source)) {
    return {
      src: source.src,
      srcSet: source.srcSet,
      blurDataUrl: source.blurDataUrl,
      aspectRatio: source.aspectRatio,
    };
  }

  if (typeof source !== 'string') return null;
  const normalized = convertGoogleDriveUrl(source);
  if (!isValidImageSource(normalized)) return null;
  return { src: normalized };
}

/** Строка для хранения в базе. Адаптивные наборы туда не пишем — они живут в сборке. */
export function toStorableImage(source?: ImageSource): string {
  if (!source) return '';
  if (isResponsiveImage(source)) return '';
  return typeof source === 'string' ? source.trim() : '';
}
