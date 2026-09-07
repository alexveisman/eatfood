import React, { useRef, useState } from 'react';
import { AlertTriangle, Camera, Link2, Loader2, Trash2, Upload } from 'lucide-react';
import type { ImageSource } from '../../types';
import { uploadImage } from '../../services/imageUploadService';
import { convertGoogleDriveUrl, isResponsiveImage } from '../../utils/imageUrlHelper';
import { SmartImage } from '../SmartImage';
import { inputClass } from './adminShared';

interface PhotoPickerProps {
  value: ImageSource | undefined;
  onChange: (value: string) => void;
  /** Идентификатор блюда — попадает в имя файла в хранилище. */
  id: string;
  scope?: string;
  onNotice?: (message: string | null) => void;
  compact?: boolean;
}

/**
 * Выбор фотографии: файл с телефона/компьютера или ссылка (Google Диск, Dropbox, любой URL).
 *
 * Загруженный файл сжимается и по возможности уходит в Firebase Storage, откуда
 * отдаётся ссылкой. Так фото кешируется браузером и не утяжеляет карточку блюда.
 */
export const PhotoPicker: React.FC<PhotoPickerProps> = ({
  value,
  onChange,
  id,
  scope = 'products',
  onNotice,
  compact = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [urlDraft, setUrlDraft] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setIsUploading(true);
    onNotice?.(null);
    try {
      const uploaded = await uploadImage(file, { scope, id });
      setLoadFailed(false);
      onChange(uploaded.url);
      onNotice?.(uploaded.warning ?? null);
    } catch (error) {
      onNotice?.(
        error instanceof Error ? error.message : 'Не удалось обработать фотографию. Попробуйте JPG или PNG.'
      );
    } finally {
      setIsUploading(false);
      setIsDragOver(false);
    }
  };

  const applyUrl = () => {
    const converted = convertGoogleDriveUrl(urlDraft);
    if (!converted) return;
    setLoadFailed(false);
    onChange(converted);
    setUrlDraft('');
    onNotice?.(null);
  };

  const isGoogleDriveLink =
    typeof value === 'string' &&
    (value.includes('googleusercontent.com') || value.includes('drive.google.com'));

  const isBuiltIn = isResponsiveImage(value);

  return (
    <div className="space-y-2.5">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          handleFile(event.dataTransfer.files?.[0]);
        }}
        className={`relative rounded-2xl border-2 border-dashed transition-colors ${
          isDragOver ? 'border-amber-500 bg-amber-50' : 'border-stone-300 bg-stone-50'
        }`}
      >
        <SmartImage
          source={value}
          alt="Текущее фото блюда"
          sizes={compact ? '160px' : '(max-width: 640px) 100vw, 400px'}
          onFailed={() => setLoadFailed(true)}
          wrapperClassName={`${compact ? 'h-28' : 'h-44 sm:h-52'} w-full rounded-2xl`}
          fallback={
            <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-stone-400">
              <Camera className="w-7 h-7 stroke-[1.5]" />
              <span className="text-[11px] font-medium">Фото пока нет</span>
            </div>
          }
        />

        {isUploading && (
          <div className="absolute inset-0 rounded-2xl bg-black/55 flex flex-col items-center justify-center gap-1.5 text-white">
            <Loader2 className="w-6 h-6 animate-spin text-amber-300" />
            <span className="text-[11px] font-bold">Сжимаем и загружаем…</span>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          handleFile(event.target.files?.[0]);
          event.target.value = '';
        }}
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-1.5 min-h-11 px-3 rounded-xl bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white text-xs font-bold transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>{value ? 'Заменить фото' : 'Загрузить фото'}</span>
        </button>

        {value && !isBuiltIn && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="inline-flex items-center justify-center gap-1.5 min-h-11 px-3 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors"
            title="Убрать фото у блюда"
          >
            <Trash2 className="w-4 h-4" />
            <span>Убрать</span>
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link2 className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="url"
            value={urlDraft}
            onChange={(event) => setUrlDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                applyUrl();
              }
            }}
            placeholder="Или вставьте ссылку (Google Диск, Dropbox, URL)"
            className={`${inputClass} pl-9 text-xs`}
          />
        </div>
        <button
          type="button"
          onClick={applyUrl}
          disabled={!urlDraft.trim()}
          className="shrink-0 min-h-11 px-4 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 disabled:opacity-50 text-xs font-bold text-stone-700 transition-colors"
        >
          Применить
        </button>
      </div>

      {/*
        Раньше не открывшаяся картинка выглядела как «фото просто нет»: владелец
        вставлял ссылку, видел заглушку и не понимал, в чём дело. Самая частая
        причина — закрытый доступ к файлу на Google Диске.
      */}
      {loadFailed && (
        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-[11px] text-amber-900 leading-relaxed">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-700" />
          <span>
            {isGoogleDriveLink ? (
              <>
                Картинка по ссылке не открывается. Чаще всего файл на Google Диске закрыт:
                откройте его → «Настройки доступа» → <strong>«Все, у кого есть ссылка»</strong>.
                Надёжнее всего — не давать ссылку, а загрузить сам файл кнопкой выше.
              </>
            ) : (
              <>Картинка по этой ссылке не открывается. Проверьте адрес или загрузите файл кнопкой выше.</>
            )}
          </span>
        </div>
      )}

      {isBuiltIn && (
        <p className="text-[11px] text-stone-500 leading-snug">
          Сейчас показывается фото из комплекта сайта. Загрузите своё, чтобы заменить его.
        </p>
      )}
    </div>
  );
};
