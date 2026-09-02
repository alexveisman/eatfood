import React, { useState } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import type { GalleryPhotoItem } from '../../services/productService';
import { SmartImage } from '../SmartImage';
import { Field, inputClass, StatusBanner, type AdminStatus } from './adminShared';
import { PhotoPicker } from './PhotoPicker';

interface GalleryTabProps {
  photos: GalleryPhotoItem[];
  onSave: (photo: GalleryPhotoItem) => Promise<void>;
  onDelete: (photo: GalleryPhotoItem) => Promise<void>;
  isSaving: boolean;
}

export const GalleryTab: React.FC<GalleryTabProps> = ({ photos, onSave, onDelete, isSaving }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Домашняя кухня');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState<AdminStatus | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!image) {
      setStatus({ tone: 'error', message: 'Сначала выберите фотографию.' });
      return;
    }
    setStatus(null);
    await onSave({
      id: `photo-${Date.now()}`,
      title: title.trim() || 'Домашняя кухня',
      category: category.trim() || 'Галерея',
      image,
      createdAt: new Date().toISOString(),
    });
    setTitle('');
    setImage('');
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-white border border-stone-200 space-y-3">
        <h3 className="text-sm font-black text-stone-900">Добавить фото в галерею</h3>
        <p className="text-xs text-stone-500 leading-relaxed">
          Эти снимки показываются в ленте под меню. Они не привязаны к конкретному блюду.
        </p>

        <PhotoPicker
          value={image}
          onChange={setImage}
          id="gallery"
          scope="gallery"
          onNotice={(message) => setStatus(message ? { tone: 'warning', message } : null)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Подпись">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className={inputClass}
              placeholder="Например: Пирожки с вишней"
            />
          </Field>
          <Field label="Раздел">
            <input
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <StatusBanner status={status} onDismiss={() => setStatus(null)} />

        <button
          type="submit"
          disabled={isSaving || !image}
          className="w-full inline-flex items-center justify-center gap-2 min-h-11 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white text-sm font-bold transition-colors"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          <span>Добавить в галерею</span>
        </button>
      </form>

      <section className="space-y-2">
        <h3 className="text-sm font-black text-stone-900">В галерее сейчас: {photos.length}</h3>
        {photos.length === 0 ? (
          <p className="text-sm text-stone-500 py-6 text-center">
            Пока пусто. В ленте под меню показываются фотографии блюд.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {photos.map((photo) => (
              <div key={photo.id} className="rounded-2xl bg-white border border-stone-200 overflow-hidden">
                <SmartImage
                  source={photo.image}
                  alt={photo.title}
                  sizes="(max-width: 640px) 45vw, 200px"
                  wrapperClassName="w-full aspect-4/3"
                />
                <div className="p-2 flex items-start justify-between gap-1.5">
                  <p className="text-[11px] font-semibold text-stone-800 leading-snug line-clamp-2">
                    {photo.title}
                  </p>
                  <button
                    type="button"
                    onClick={() => onDelete(photo)}
                    aria-label={`Удалить ${photo.title}`}
                    className="shrink-0 w-7 h-7 rounded-lg text-stone-300 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
