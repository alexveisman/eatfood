import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import type { Product } from '../../types';
import { SmartImage } from '../SmartImage';
import { inputClass } from './adminShared';

interface DishesTabProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onCreate: () => void;
  onDelete: (product: Product) => void;
  onReorder: (products: Product[], successMessage: string) => Promise<void>;
  isSaving: boolean;
}

export const DishesTab: React.FC<DishesTabProps> = ({
  products,
  onEdit,
  onCreate,
  onDelete,
  onReorder,
  isSaving,
}) => {
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return products;
    return products.filter((product) => product.name.toLowerCase().includes(trimmed));
  }, [products, query]);

  /**
   * Перестановка блюда на одну позицию.
   * Переписываем orderIndex у всего списка последовательно — иначе блюда с одинаковым
   * или отсутствующим индексом начинают прыгать при каждой перезагрузке.
   */
  const move = async (productId: string, direction: -1 | 1) => {
    const index = products.findIndex((p) => p.id === productId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= products.length) return;

    const reordered = [...products];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

    const withIndexes = reordered.map((product, position) => ({ ...product, orderIndex: position + 1 }));
    await onReorder(withIndexes, 'Порядок блюд в меню обновлён.');
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Поиск по названию"
            className={`${inputClass} pl-9`}
          />
        </div>
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex items-center justify-center gap-1.5 min-h-11 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-sm font-bold transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Добавить блюдо</span>
        </button>
      </div>

      {query.trim() && (
        <p className="text-[11px] text-stone-500">
          Порядок можно менять только без поиска — стрелки скрыты, пока список отфильтрован.
        </p>
      )}

      <ul className="space-y-2">
        {visible.map((product) => {
          const position = products.findIndex((p) => p.id === product.id);
          return (
            <li
              key={product.id}
              className="flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-stone-200"
            >
              {!query.trim() && (
                <div className="flex flex-col shrink-0">
                  <button
                    type="button"
                    onClick={() => move(product.id, -1)}
                    disabled={position === 0 || isSaving}
                    aria-label="Поднять выше"
                    className="w-9 h-8 rounded-t-lg bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-stone-600 flex items-center justify-center transition-colors"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(product.id, 1)}
                    disabled={position === products.length - 1 || isSaving}
                    aria-label="Опустить ниже"
                    className="w-9 h-8 rounded-b-lg bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-stone-600 flex items-center justify-center transition-colors"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              )}

              <SmartImage
                source={product.image}
                alt={product.name}
                sizes="64px"
                wrapperClassName="w-16 h-16 rounded-xl shrink-0 border border-stone-200"
                fallback={
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-400">
                    нет фото
                  </div>
                }
              />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-stone-900 leading-snug break-words">{product.name}</p>
                <p className="text-[11px] text-stone-500">
                  {product.price} ₪ · {product.unit}
                  {product.isPreorderOnly ? ' · под заказ' : ''}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => onEdit(product)}
                  aria-label={`Редактировать ${product.name}`}
                  className="w-11 h-11 rounded-xl bg-stone-100 hover:bg-amber-100 text-stone-600 hover:text-amber-800 flex items-center justify-center transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(product)}
                  aria-label={`Удалить ${product.name}`}
                  className="w-11 h-11 rounded-xl bg-stone-100 hover:bg-red-100 text-stone-600 hover:text-red-700 flex items-center justify-center transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {visible.length === 0 && (
        <p className="text-center text-sm text-stone-500 py-8">Ничего не найдено.</p>
      )}
    </div>
  );
};
