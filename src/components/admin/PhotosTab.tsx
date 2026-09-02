import React, { useRef, useState } from 'react';
import { Check, ImagePlus, Loader2, Trash2, X } from 'lucide-react';
import type { Product } from '../../types';
import { uploadImage } from '../../services/imageUploadService';
import { SmartImage } from '../SmartImage';
import { inputClass, StatusBanner, type AdminStatus } from './adminShared';

interface PhotosTabProps {
  products: Product[];
  onSaveProducts: (products: Product[], successMessage: string) => Promise<void>;
  isSaving: boolean;
}

interface StagedPhoto {
  id: string;
  url: string;
  fileName: string;
  /** Пусто, пока владелец не выбрал блюдо. Ничего не сохраняем без явного выбора. */
  targetProductId: string;
  warning?: string;
}

/** Нормализация для поиска совпадения: убираем регистр, расширение и служебные символы. */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/, '')
    .replace(/[^a-zа-яё0-9]+/gi, ' ')
    .trim();
}

/**
 * Пытается угадать блюдо по имени файла.
 *
 * Возвращает пустую строку, если уверенного совпадения нет. Прежняя версия в этом
 * случае назначала фото случайному блюду по остатку от деления индекса — из-за чего
 * загрузка десяти фотографий перезаписывала фото у десяти произвольных позиций меню.
 */
function guessProduct(fileName: string, products: Product[]): string {
  const haystack = normalize(fileName);
  if (!haystack) return '';

  const words = haystack.split(' ').filter((w) => w.length >= 4);
  if (words.length === 0) return '';

  let best: { id: string; score: number } | null = null;

  for (const product of products) {
    const candidates = [normalize(product.id), normalize(product.name)];
    let score = 0;
    for (const word of words) {
      for (const candidate of candidates) {
        if (candidate.includes(word)) score += word.length;
      }
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { id: product.id, score };
    }
  }

  // Порог отсекает случайные пересечения вроде «foto» или «image».
  return best && best.score >= 5 ? best.id : '';
}

/**
 * Массовая работа с фотографиями блюд.
 *
 * Сценарий: владелец фотографирует партию выпечки, выбирает сразу все снимки,
 * сверяет предложенное соответствие и применяет одним нажатием.
 */
export const PhotosTab: React.FC<PhotosTabProps> = ({ products, onSaveProducts, isSaving }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [staged, setStaged] = useState<StagedPhoto[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [status, setStatus] = useState<AdminStatus | null>(null);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList).filter((file) => file.type.startsWith('image/'));
    if (files.length === 0) {
      setStatus({ tone: 'error', message: 'Среди выбранных файлов нет изображений.' });
      return;
    }

    setIsProcessing(true);
    setStatus(null);
    setProgress({ done: 0, total: files.length });

    const accepted: StagedPhoto[] = [];
    const failed: string[] = [];

    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      try {
        const uploaded = await uploadImage(file, { scope: 'products', id: `batch-${index}` });
        accepted.push({
          id: `staged-${Date.now()}-${index}`,
          url: uploaded.url,
          fileName: file.name,
          targetProductId: guessProduct(file.name, products),
          warning: uploaded.warning,
        });
      } catch (error) {
        failed.push(`${file.name}: ${error instanceof Error ? error.message : 'ошибка'}`);
      }
      setProgress({ done: index + 1, total: files.length });
    }

    setStaged((prev) => [...prev, ...accepted]);
    setIsProcessing(false);
    setProgress(null);

    const unmatched = accepted.filter((item) => !item.targetProductId).length;
    if (failed.length > 0) {
      setStatus({ tone: 'error', message: `Не удалось обработать: ${failed.join('; ')}` });
    } else if (unmatched > 0) {
      setStatus({
        tone: 'warning',
        message: `Готово: ${accepted.length} фото. Для ${unmatched} из них блюдо не определилось — выберите его вручную в списке ниже.`,
      });
    } else {
      setStatus({ tone: 'success', message: `Готово: ${accepted.length} фото. Проверьте соответствие и нажмите «Применить».` });
    }
  };

  const assigned = staged.filter((item) => item.targetProductId);

  const handleApply = async () => {
    if (assigned.length === 0) return;

    // Одно блюдо может получить только одно фото — берём последнее назначенное.
    const latestByProduct = new Map<string, string>();
    assigned.forEach((item) => latestByProduct.set(item.targetProductId, item.url));

    // Сохраняем только затронутые блюда, а не весь каталог целиком.
    const updated = products
      .filter((product) => latestByProduct.has(product.id))
      .map((product) => ({ ...product, image: latestByProduct.get(product.id) as string }));

    await onSaveProducts(updated, `Фото обновлены у ${updated.length} блюд.`);
    setStaged((prev) => prev.filter((item) => !item.targetProductId));
  };

  return (
    <div className="space-y-4">
      <section className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
        <div>
          <h3 className="text-sm font-black text-amber-950">Загрузка фотографий</h3>
          <p className="text-xs text-stone-600 leading-relaxed mt-0.5">
            Выберите сразу несколько снимков. Каждый будет сжат и загружен, а блюдо подставится
            по имени файла — проверьте и поправьте, если нужно.
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => {
            handleFiles(event.target.files);
            event.target.value = '';
          }}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="w-full inline-flex items-center justify-center gap-2 min-h-12 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white text-sm font-bold transition-colors"
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
          <span>
            {isProcessing && progress
              ? `Обрабатываем ${progress.done} из ${progress.total}…`
              : 'Выбрать фотографии'}
          </span>
        </button>

        <StatusBanner status={status} onDismiss={() => setStatus(null)} />
      </section>

      {staged.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-black text-stone-900">
              Готовы к применению: {assigned.length} из {staged.length}
            </h3>
            <button
              type="button"
              onClick={() => setStaged([])}
              className="text-xs font-semibold text-stone-500 hover:text-red-600 underline underline-offset-2"
            >
              Очистить всё
            </button>
          </div>

          <div className="space-y-2">
            {staged.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-stone-200"
              >
                <SmartImage
                  source={item.url}
                  alt={item.fileName}
                  sizes="72px"
                  wrapperClassName="w-18 h-18 rounded-xl shrink-0 border border-stone-200"
                />

                <div className="flex-1 min-w-0 space-y-1.5">
                  <p className="text-[11px] text-stone-500 truncate" title={item.fileName}>
                    {item.fileName}
                  </p>
                  <select
                    value={item.targetProductId}
                    onChange={(event) =>
                      setStaged((prev) =>
                        prev.map((row) =>
                          row.id === item.id ? { ...row, targetProductId: event.target.value } : row
                        )
                      )
                    }
                    className={`${inputClass} text-xs ${
                      item.targetProductId ? 'border-emerald-300' : 'border-amber-400 bg-amber-50'
                    }`}
                  >
                    <option value="">— выберите блюдо —</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                  {item.warning && <p className="text-[11px] text-amber-700 leading-snug">{item.warning}</p>}
                </div>

                <button
                  type="button"
                  onClick={() => setStaged((prev) => prev.filter((row) => row.id !== item.id))}
                  aria-label="Убрать из очереди"
                  className="w-11 h-11 shrink-0 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleApply}
            disabled={assigned.length === 0 || isSaving}
            className="w-full inline-flex items-center justify-center gap-2 min-h-12 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-sm font-bold transition-colors"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            <span>Применить ({assigned.length})</span>
          </button>
        </section>
      )}

      <section className="space-y-2">
        <h3 className="text-sm font-black text-stone-900">Фото блюд сейчас</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {products.map((product) => (
            <div key={product.id} className="rounded-2xl bg-white border border-stone-200 overflow-hidden">
              <SmartImage
                source={product.image}
                alt={product.name}
                sizes="(max-width: 640px) 45vw, 200px"
                wrapperClassName="w-full aspect-4/3"
                fallback={
                  <div className="w-full h-full flex items-center justify-center text-[11px] font-medium text-stone-400">
                    Нет фото
                  </div>
                }
              />
              <div className="p-2 flex items-start justify-between gap-1.5">
                <p className="text-[11px] font-semibold text-stone-800 leading-snug line-clamp-2">
                  {product.name}
                </p>
                {product.image ? (
                  <button
                    type="button"
                    title="Убрать фото"
                    onClick={() => onSaveProducts([{ ...product, image: '' }], `Фото у «${product.name}» убрано.`)}
                    className="shrink-0 w-7 h-7 rounded-lg text-stone-300 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
