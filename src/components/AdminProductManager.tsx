import React, { useCallback, useEffect, useState } from 'react';
import { CloudOff, Database, FolderOpen, Image as ImageIcon, KeyRound, LogOut, Upload, X } from 'lucide-react';
import { type OwnerAccount, signOutOwner, watchOwner } from '../lib/firebaseAuthLazy';
import type { Product } from '../types';
import {
  deleteGalleryPhoto,
  deleteProduct,
  flushPendingChanges,
  type GalleryPhotoItem,
  getPendingChangeCount,
  resetProductsToDefault,
  saveGalleryPhoto,
  saveMultipleProducts,
  saveProduct,
  type SaveResult,
} from '../services/productService';
import { logoutAdmin } from '../utils/adminAuth';
import { StatusBanner, statusFromResult, type AdminStatus } from './admin/adminShared';
import { DishEditor } from './admin/DishEditor';
import { DishesTab } from './admin/DishesTab';
import { GalleryTab } from './admin/GalleryTab';
import { PhotosTab } from './admin/PhotosTab';
import { SettingsTab } from './admin/SettingsTab';

interface AdminProductManagerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  galleryPhotos: GalleryPhotoItem[];
  onLogout?: () => void;
}

type TabId = 'photos' | 'dishes' | 'gallery' | 'settings';

const TABS: Array<{ id: TabId; label: string; icon: React.ReactNode }> = [
  { id: 'photos', label: 'Фотографии', icon: <Upload className="w-4 h-4" /> },
  { id: 'dishes', label: 'Блюда', icon: <FolderOpen className="w-4 h-4" /> },
  { id: 'gallery', label: 'Галерея', icon: <ImageIcon className="w-4 h-4" /> },
  { id: 'settings', label: 'Настройки', icon: <KeyRound className="w-4 h-4" /> },
];

/**
 * Панель владельца.
 *
 * На телефоне открывается на весь экран, на компьютере — окном. Заголовок и вкладки
 * закреплены, прокручивается только содержимое: иначе на длинных списках кнопки закрытия
 * и переключения вкладок уезжали за пределы экрана.
 */
export const AdminProductManager: React.FC<AdminProductManagerProps> = ({
  isOpen,
  onClose,
  products,
  galleryPhotos,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<TabId>('photos');
  const [editing, setEditing] = useState<{ product: Product | null } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<AdminStatus | null>(null);
  const [owner, setOwner] = useState<OwnerAccount | null>(null);

  // Следим за входом владельца: от него зависит, увидят ли покупатели правки.
  useEffect(() => {
    if (!isOpen) return;
    return watchOwner(setOwner);
  }, [isOpen]);

  /*
    Как только владелец вошёл, досылаем в облако всё, что он успел наменять
    в локальном режиме — иначе эти правки так и остались бы на его устройстве.
  */
  useEffect(() => {
    if (!owner || getPendingChangeCount() === 0) return;
    let cancelled = false;
    flushPendingChanges().then((result) => {
      if (cancelled) return;
      setStatus(
        result.syncedToCloud
          ? { tone: 'success', message: 'Изменения, сохранённые ранее на этом устройстве, отправлены в облако.' }
          : { tone: 'warning', message: result.error ?? 'Не удалось отправить накопленные изменения.' }
      );
    });
    return () => {
      cancelled = true;
    };
  }, [owner]);

  // Панель перекрывает страницу целиком — прокрутку под ней нужно остановить.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !editing) onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, editing, onClose]);

  /** Общая обёртка вокруг операций записи: показывает занятость и честный итог. */
  const run = useCallback(async (operation: () => Promise<SaveResult>, successMessage: string) => {
    setIsSaving(true);
    setStatus({ tone: 'progress', message: 'Сохраняем…' });
    try {
      const result = await operation();
      setStatus(statusFromResult(result, successMessage));
      return result;
    } catch (error) {
      setStatus({
        tone: 'error',
        message: error instanceof Error ? error.message : 'Не удалось выполнить операцию.',
      });
      return { savedLocally: false, syncedToCloud: false } as SaveResult;
    } finally {
      setIsSaving(false);
    }
  }, []);

  if (!isOpen) return null;

  const handleSaveDish = async (product: Product) => {
    const result = await run(() => saveProduct(product), `Блюдо «${product.name}» сохранено.`);
    if (result.savedLocally || result.syncedToCloud) {
      setEditing(null);
    }
  };

  const handleDeleteDish = async (product: Product) => {
    if (!confirm(`Удалить «${product.name}» из меню?`)) return;
    await run(() => deleteProduct(product.id), `Блюдо «${product.name}» удалено.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-stretch sm:items-center justify-center sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full sm:max-w-5xl bg-stone-50 sm:rounded-3xl shadow-2xl sm:border sm:border-stone-200 flex flex-col overflow-hidden sm:max-h-[94vh]">
        {/* Шапка */}
        <header
          className="shrink-0 flex items-center justify-between gap-2 px-3.5 sm:px-6 py-3 border-b border-stone-200 bg-white"
          style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="font-black text-sm sm:text-base text-stone-900 truncate">Панель владельца</h2>
              <p className="text-[11px] text-stone-500 truncate">Меню, цены и фотографии</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={async () => {
                await signOutOwner();
                logoutAdmin();
                onLogout?.();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 min-h-10 px-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200 transition-colors"
              title="Выйти из панели"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Выйти</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Закрыть панель"
              className="w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Вкладки */}
        <nav className="shrink-0 flex gap-1 px-2 sm:px-4 bg-white border-b border-stone-200 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setEditing(null);
              }}
              className={`inline-flex items-center gap-1.5 px-3 min-h-12 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-amber-700 text-amber-800'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.id === 'dishes' && <span className="text-stone-400">({products.length})</span>}
              {tab.id === 'gallery' && <span className="text-stone-400">({galleryPhotos.length})</span>}
            </button>
          ))}
        </nav>

        {/*
          Главное, что должен понимать владелец: доходят ли его правки до покупателей.
          Без входа по почте правила базы запрещают запись, и всё остаётся в этом браузере.
        */}
        <div className="shrink-0 px-3.5 sm:px-6 py-2 bg-white border-b border-stone-200 space-y-2">
          {owner ? (
            <p className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1.5 leading-relaxed">
              Вы вошли как <strong>{owner.email ?? 'владелец'}</strong> — изменения увидят все
              посетители сайта.
            </p>
          ) : (
            <p className="text-[11px] text-amber-900 bg-amber-50 border border-amber-300 rounded-lg px-2.5 py-1.5 leading-relaxed flex items-start gap-1.5">
              <CloudOff className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-700" />
              <span>
                Режим «только это устройство». Изменения сохранятся в вашем браузере, но
                покупатели их не увидят. Войдите по почте и паролю — всё накопленное
                автоматически уедет на сайт.
              </span>
            </p>
          )}

          {status && <StatusBanner status={status} onDismiss={() => setStatus(null)} />}
        </div>

        {/* Содержимое */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain px-3.5 sm:px-6 py-4"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          {editing ? (
            <DishEditor
              product={editing.product}
              onCancel={() => setEditing(null)}
              onSave={handleSaveDish}
              isSaving={isSaving}
            />
          ) : (
            <>
              {activeTab === 'photos' && (
                <PhotosTab
                  products={products}
                  isSaving={isSaving}
                  onSaveProducts={async (updated, message) => {
                    await run(() => saveMultipleProducts(updated), message);
                  }}
                />
              )}

              {activeTab === 'dishes' && (
                <DishesTab
                  products={products}
                  isSaving={isSaving}
                  onEdit={(product) => setEditing({ product })}
                  onCreate={() => setEditing({ product: null })}
                  onDelete={handleDeleteDish}
                  onReorder={async (reordered, message) => {
                    await run(() => saveMultipleProducts(reordered), message);
                  }}
                />
              )}

              {activeTab === 'gallery' && (
                <GalleryTab
                  photos={galleryPhotos}
                  isSaving={isSaving}
                  onSave={async (photo) => {
                    await run(() => saveGalleryPhoto(photo), 'Фото добавлено в галерею.');
                  }}
                  onDelete={async (photo) => {
                    await run(() => deleteGalleryPhoto(photo.id), 'Фото удалено из галереи.');
                  }}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsTab
                  isSaving={isSaving}
                  onResetCatalog={async () => {
                    await run(() => resetProductsToDefault(), 'Меню возвращено к исходному виду.');
                  }}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
