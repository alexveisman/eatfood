/**
 * Сжатие фотографий перед загрузкой.
 *
 * Фото с телефона весит 3–8 МБ и имеет размер 4000px — показывать такое в карточке
 * 400px бессмысленно, а класть в базу нельзя (лимит документа Firestore — 1 МБ).
 * Здесь фото уменьшается до разумного размера и ужимается до заданного веса.
 */

/** Жёсткий потолок для data:-строки. Оставляем запас под остальные поля документа. */
export const MAX_INLINE_IMAGE_BYTES = 320 * 1024;

export interface CompressedImage {
  /** Готовая строка data:image/jpeg;base64,... */
  dataUrl: string;
  /** Тот же результат в виде Blob — им удобно грузить в Firebase Storage. */
  blob: Blob;
  width: number;
  height: number;
  bytes: number;
}

function loadImageElement(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Не удалось открыть изображение'));
    img.src = dataUrl;
  });
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Не удалось прочитать файл'));
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string' && result.length > 0) {
        resolve(result);
      } else {
        reject(new Error('Файл пустой или повреждён'));
      }
    };
    reader.readAsDataURL(file);
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Браузер не смог сжать изображение'))),
      type,
      quality
    );
  });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Не удалось закодировать изображение'));
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

function fitWithin(width: number, height: number, maxWidth: number, maxHeight: number) {
  const scale = Math.min(1, maxWidth / width, maxHeight / height);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

/**
 * Сжимает файл до <= maxBytes, последовательно понижая качество, а затем размер.
 * Возвращает и Blob (для Firebase Storage), и data-URL (для запасного режима без Storage).
 */
export async function compressImage(
  file: File,
  options: { maxWidth?: number; maxHeight?: number; maxBytes?: number } = {}
): Promise<CompressedImage> {
  const { maxWidth = 1200, maxHeight = 1200, maxBytes = MAX_INLINE_IMAGE_BYTES } = options;

  const rawDataUrl = await readFileAsDataUrl(file);
  const img = await loadImageElement(rawDataUrl);

  const naturalWidth = img.naturalWidth || img.width;
  const naturalHeight = img.naturalHeight || img.height;
  if (!naturalWidth || !naturalHeight) {
    throw new Error('Не удалось определить размер изображения');
  }

  let { width, height } = fitWithin(naturalWidth, naturalHeight, maxWidth, maxHeight);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Браузер не поддерживает обработку изображений');

  const render = async (targetWidth: number, targetHeight: number, quality: number) => {
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    ctx.clearRect(0, 0, targetWidth, targetHeight);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
    return canvasToBlob(canvas, 'image/jpeg', quality);
  };

  // Сначала снижаем качество (визуально дешевле), и только потом уменьшаем размер.
  const qualitySteps = [0.82, 0.72, 0.62, 0.52];
  let blob: Blob | null = null;

  for (let attempt = 0; attempt < 4; attempt += 1) {
    for (const quality of qualitySteps) {
      blob = await render(width, height, quality);
      if (blob.size <= maxBytes) {
        const dataUrl = await blobToDataUrl(blob);
        return { dataUrl, blob, width, height, bytes: blob.size };
      }
    }
    // Ещё слишком тяжело — уменьшаем габариты на 25% и пробуем заново.
    width = Math.max(200, Math.round(width * 0.75));
    height = Math.max(200, Math.round(height * 0.75));
  }

  if (!blob) throw new Error('Не удалось сжать изображение');
  const dataUrl = await blobToDataUrl(blob);
  return { dataUrl, blob, width, height, bytes: blob.size };
}

/**
 * Совместимость со старым кодом: возвращает только data-URL.
 * @deprecated используйте compressImage — она отдаёт ещё и Blob для Firebase Storage.
 */
export async function compressAndEncodeImage(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200
): Promise<string> {
  const result = await compressImage(file, { maxWidth, maxHeight });
  return result.dataUrl;
}
