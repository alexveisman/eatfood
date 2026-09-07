import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ImageOff } from 'lucide-react';
import type { ImageSource } from '../types';
import { getGoogleDriveThumbnailFallback, resolveImage } from '../utils/imageUrlHelper';

interface SmartImageProps {
  source?: ImageSource;
  alt: string;
  /**
   * Подсказка браузеру о размере картинки в вёрстке — по ней он выбирает вариант из srcSet.
   * Без неё браузер считает, что картинка шириной во весь экран, и качает самый тяжёлый файл.
   */
  sizes?: string;
  className?: string;
  /** Классы для обёртки, которая резервирует место и рисует плейсхолдер. */
  wrapperClassName?: string;
  /** Первые видимые картинки грузим сразу — lazy для них только замедляет показ. */
  priority?: boolean;
  /** Что показать, если фото нет или оно не загрузилось. */
  fallback?: React.ReactNode;
  /** Вызывается, когда картинку загрузить не удалось (все запасные адреса исчерпаны). */
  onFailed?: (src: string) => void;
  onClick?: () => void;
}

/**
 * Картинка, которая грузится предсказуемо:
 *  - место под неё зарезервировано заранее (нет скачков вёрстки при подгрузке);
 *  - пока грузится, виден размытый плейсхолдер или мягкий фон, а не пустая дыра;
 *  - в srcSet отдаются варианты по ширине, мобильный не качает 1200px-файл;
 *  - если ссылка не открылась, пробуем запасной адрес Google Drive, затем показываем заглушку.
 */
export const SmartImage: React.FC<SmartImageProps> = ({
  source,
  alt,
  sizes = '100vw',
  className = '',
  wrapperClassName = '',
  priority = false,
  fallback,
  onFailed,
  onClick,
}) => {
  const resolved = useMemo(() => resolveImage(source), [source]);

  const [currentSrc, setCurrentSrc] = useState(resolved?.src ?? '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);
  const triedFallbackRef = useRef(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    triedFallbackRef.current = false;
    setCurrentSrc(resolved?.src ?? '');
    setIsLoaded(false);
    setHasFailed(!resolved);
  }, [resolved]);

  // Если картинка пришла из кеша, событие load могло сработать до навешивания обработчика.
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [currentSrc]);

  const handleError = () => {
    if (!triedFallbackRef.current && currentSrc) {
      triedFallbackRef.current = true;
      const driveFallback = getGoogleDriveThumbnailFallback(currentSrc);
      if (driveFallback) {
        setCurrentSrc(driveFallback);
        return;
      }
    }
    setHasFailed(true);
    onFailed?.(currentSrc);
  };

  const showPlaceholderArt = !resolved || hasFailed;

  return (
    <div
      className={`relative overflow-hidden bg-[#F3EDE4] ${wrapperClassName}`}
      onClick={onClick}
    >
      {/* Размытая миниатюра под фото: страница выглядит заполненной с первого кадра. */}
      {resolved?.blurDataUrl && !isLoaded && !hasFailed && (
        <img
          src={resolved.blurDataUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-lg"
        />
      )}

      {showPlaceholderArt ? (
        fallback ?? (
          <div className="w-full h-full min-h-full flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-[#FAF7F2] to-[#EFE7DB] text-[#B8A695]">
            <ImageOff className="w-1/4 max-w-6 min-w-4 h-auto aspect-square stroke-[1.5]" />
          </div>
        )
      ) : (
        <img
          ref={imgRef}
          src={currentSrc}
          srcSet={resolved.srcSet}
          sizes={resolved.srcSet ? sizes : undefined}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          draggable={false}
          referrerPolicy="no-referrer"
          onLoad={() => setIsLoaded(true)}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
        />
      )}
    </div>
  );
};
