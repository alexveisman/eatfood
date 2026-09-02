import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import type { ImageSource } from '../types';
import { resolveImage } from '../utils/imageUrlHelper';

interface ImageLightboxProps {
  source?: ImageSource;
  title?: string;
  onClose: () => void;
}

/**
 * Просмотр фото во весь экран.
 * Раньше по миниатюре в меню можно было кликнуть, курсор менялся на «руку», но ничего
 * не происходило — обработчик в список не передавался. Теперь клик открывает фото целиком.
 */
export const ImageLightbox: React.FC<ImageLightboxProps> = ({ source, title, onClose }) => {
  const resolved = resolveImage(source);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);

    // Пока открыт просмотр, страница под ним не должна прокручиваться.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  if (!resolved) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Фото блюда'}
      onClick={onClose}
      className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      <button
        onClick={onClose}
        aria-label="Закрыть"
        className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
        style={{ top: 'max(1rem, env(safe-area-inset-top))' }}
      >
        <X className="w-5 h-5" />
      </button>

      <figure className="max-w-4xl w-full" onClick={(event) => event.stopPropagation()}>
        <img
          src={resolved.src}
          srcSet={resolved.srcSet}
          sizes="(max-width: 900px) 100vw, 900px"
          alt={title || 'Фото блюда'}
          className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
        />
        {title && (
          <figcaption className="mt-3 text-center text-sm font-semibold text-white/90">{title}</figcaption>
        )}
      </figure>
    </div>
  );
};
