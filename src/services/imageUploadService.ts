/**
 * Загрузка фотографий блюд.
 *
 * Основной путь — Firebase Storage: фото лежит отдельным файлом, отдаётся через CDN,
 * кешируется браузером и не раздувает документы Firestore.
 *
 * Запасной путь — встроить фото прямо в документ строкой data:base64. Так работал
 * прежний код; он остаётся на случай, если Storage не настроен, но у него есть предел:
 * документ Firestore не может быть больше 1 МБ, поэтому картинка ужимается до 320 КБ.
 */

import { getStorageLazy, hasStorageBucket } from '../lib/firebase';
import { compressImage, MAX_INLINE_IMAGE_BYTES } from '../utils/imageCompressor';

export type UploadMode = 'storage' | 'inline';

export interface UploadedImage {
  /** Значение для поля product.image: ссылка https://... или строка data:. */
  url: string;
  mode: UploadMode;
  bytes: number;
  /** Заполняется, если Storage недоступен и пришлось встроить фото в документ. */
  warning?: string;
}

function storagePathFor(scope: string, id: string, fileName: string): string {
  const extension = (fileName.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
  const safeId = id.replace(/[^a-zA-Z0-9_-]/g, '-');
  // Уникальный суффикс не даёт браузеру показать старое фото из кеша после замены.
  return `${scope}/${safeId}-${Date.now()}.${extension || 'jpg'}`;
}

/**
 * Сжимает файл и кладёт его туда, где он будет доступен всем посетителям.
 * Никогда не выбрасывает ошибку из-за недоступного Storage — вместо этого
 * возвращает встроенный вариант с предупреждением, чтобы владелец не потерял работу.
 */
export async function uploadImage(
  file: File,
  options: { scope?: string; id?: string } = {}
): Promise<UploadedImage> {
  const { scope = 'products', id = 'photo' } = options;

  if (!file.type.startsWith('image/')) {
    throw new Error('Это не изображение. Подойдёт JPG, PNG, WebP или HEIC.');
  }

  // Для Storage можно оставить картинку крупнее: лимита документа там нет.
  const compressed = await compressImage(file, {
    maxWidth: 1400,
    maxHeight: 1400,
    maxBytes: hasStorageBucket ? 900 * 1024 : MAX_INLINE_IMAGE_BYTES,
  });

  if (hasStorageBucket) {
    try {
      const [storage, { getDownloadURL, ref, uploadBytes }] = await Promise.all([
        getStorageLazy(),
        import('firebase/storage'),
      ]);

      const objectRef = ref(storage, storagePathFor(scope, id, file.name));
      await uploadBytes(objectRef, compressed.blob, {
        contentType: 'image/jpeg',
        cacheControl: 'public, max-age=31536000, immutable',
      });
      const url = await getDownloadURL(objectRef);
      return { url, mode: 'storage', bytes: compressed.bytes };
    } catch (error) {
      console.warn('Firebase Storage недоступен, встраиваем фото в документ:', error);
    }
  }

  // Запасной режим: фото поедет внутрь документа Firestore, поэтому пережимаем строже.
  const inline =
    compressed.bytes <= MAX_INLINE_IMAGE_BYTES
      ? compressed
      : await compressImage(file, { maxWidth: 1000, maxHeight: 1000, maxBytes: MAX_INLINE_IMAGE_BYTES });

  return {
    url: inline.dataUrl,
    mode: 'inline',
    bytes: inline.bytes,
    warning: hasStorageBucket
      ? 'Фото сохранено внутри карточки: облачное хранилище Firebase Storage недоступно (проверьте правила доступа). Так фото грузится медленнее.'
      : 'Фото сохранено внутри карточки: хранилище Firebase Storage не подключено. Так фото грузится медленнее.',
  };
}

/** Удаляет файл из Storage. Для встроенных data:-картинок удалять нечего. */
export async function deleteUploadedImage(url: string): Promise<void> {
  if (!url || !url.startsWith('https://') || !url.includes('firebasestorage')) return;
  try {
    const [storage, { deleteObject, ref }] = await Promise.all([
      getStorageLazy(),
      import('firebase/storage'),
    ]);
    await deleteObject(ref(storage, url));
  } catch (error) {
    // Файл мог быть уже удалён или ссылка ведёт в другой проект — это не повод падать.
    console.warn('Не удалось удалить файл из Storage:', error);
  }
}
