import React, { useMemo, useState } from 'react';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import type { CategoryId, ImageSource, Product } from '../../types';
import { CATEGORIES } from '../../data/menuData';
import { Field, inputClass, StatusBanner, textareaClass, Toggle, type AdminStatus } from './adminShared';
import { PhotoPicker } from './PhotoPicker';

interface DishEditorProps {
  /** null — создаём новое блюдо. */
  product: Product | null;
  onCancel: () => void;
  onSave: (product: Product) => Promise<void>;
  isSaving: boolean;
}

/** Многострочный текст ↔ массив: по строке на элемент — так владельцу проще всего править списки. */
const linesToArray = (text: string): string[] =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

const EMPTY_DRAFT = {
  name: '',
  category: 'bakery' as CategoryId,
  price: 50,
  priceFrom: false,
  unit: 'шт',
  weight: '',
  badge: '',
  shortDescription: '',
  fullDescription: '',
  ingredientsText: '',
  fillingsText: '',
  cookingOptionsText: '',
  storageInfo: '',
  cookingInstructions: '',
  isBestseller: false,
  isNew: false,
  isPreorderOnly: false,
  minQuantity: 1,
  stepQuantity: 1,
  orderIndex: 0,
};

function draftFrom(product: Product | null) {
  if (!product) return EMPTY_DRAFT;
  return {
    name: product.name,
    category: product.category,
    price: product.price,
    priceFrom: product.priceFrom ?? false,
    unit: product.unit,
    weight: product.weight ?? '',
    badge: product.badge ?? '',
    shortDescription: product.shortDescription ?? '',
    fullDescription: product.fullDescription ?? '',
    ingredientsText: (product.ingredients ?? []).join('\n'),
    fillingsText: (product.availableFillings ?? []).join('\n'),
    cookingOptionsText: (product.cookingOptions ?? []).join('\n'),
    storageInfo: product.storageInfo ?? '',
    cookingInstructions: product.cookingInstructions ?? '',
    isBestseller: product.isBestseller ?? false,
    isNew: product.isNew ?? false,
    isPreorderOnly: product.isPreorderOnly ?? false,
    minQuantity: product.minQuantity ?? 1,
    stepQuantity: product.stepQuantity ?? 1,
    orderIndex: product.orderIndex ?? 0,
  };
}

/**
 * Форма блюда.
 *
 * Раньше здесь показывались только 7 полей, а сохранялся объект, собранный с нуля —
 * поэтому вес, условия хранения, инструкция по разогреву и метка «под заказ»
 * стирались при любом редактировании. Теперь в форме есть все поля карточки,
 * а неизменённые значения переносятся из исходного блюда как есть.
 */
export const DishEditor: React.FC<DishEditorProps> = ({ product, onCancel, onSave, isSaving }) => {
  const [draft, setDraft] = useState(() => draftFrom(product));
  const [image, setImage] = useState<ImageSource>(product?.image ?? '');
  const [photoNotice, setPhotoNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const editableCategories = useMemo(() => CATEGORIES.filter((c) => c.id !== 'all'), []);
  const set = <K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.name.trim()) {
      setError('Укажите название блюда.');
      return;
    }
    setError(null);

    const fillings = linesToArray(draft.fillingsText);
    const cookingOptions = linesToArray(draft.cookingOptionsText);

    const next: Product = {
      // Всё, что не показано в форме (например, gallery), переносим из исходного блюда без изменений.
      ...(product ?? ({} as Product)),
      id: product?.id ?? `dish-${Date.now()}`,
      name: draft.name.trim(),
      category: draft.category,
      price: Number(draft.price) || 0,
      priceFrom: draft.priceFrom,
      unit: draft.unit.trim() || 'шт',
      image,
      shortDescription: draft.shortDescription.trim(),
      fullDescription: draft.fullDescription.trim() || draft.shortDescription.trim(),
      ingredients: linesToArray(draft.ingredientsText),
      availableFillings: fillings.length > 0 ? fillings : undefined,
      fillingRequired: fillings.length > 0,
      cookingOptions: cookingOptions.length > 0 ? cookingOptions : undefined,
      weight: draft.weight.trim() || undefined,
      // Пустая строка сохраняется намеренно: так владелец убирает плашку с карточки.
      badge: draft.badge.trim(),
      storageInfo: draft.storageInfo.trim() || undefined,
      cookingInstructions: draft.cookingInstructions.trim() || undefined,
      isBestseller: draft.isBestseller,
      isNew: draft.isNew,
      isPreorderOnly: draft.isPreorderOnly,
      minQuantity: Number(draft.minQuantity) || 1,
      stepQuantity: Number(draft.stepQuantity) || 1,
      orderIndex: Number(draft.orderIndex) || undefined,
    };

    await onSave(next);
  };

  const status: AdminStatus | null = error
    ? { tone: 'error', message: error }
    : photoNotice
      ? { tone: 'warning', message: photoNotice }
      : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pb-24">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 min-h-11 px-3 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-xs font-bold text-stone-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>К списку</span>
        </button>
        <h3 className="font-black text-sm sm:text-base text-stone-900 truncate">
          {product ? `Редактирование: ${product.name}` : 'Новое блюдо'}
        </h3>
      </div>

      <StatusBanner status={status} onDismiss={() => { setError(null); setPhotoNotice(null); }} />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] gap-4">
        <section className="space-y-3 p-3.5 rounded-2xl bg-white border border-stone-200">
          <h4 className="text-xs font-black uppercase tracking-wide text-stone-500">Фотография</h4>
          <PhotoPicker
            value={image}
            onChange={setImage}
            id={product?.id ?? 'new-dish'}
            onNotice={setPhotoNotice}
          />
        </section>

        <div className="space-y-4">
          <section className="space-y-3 p-3.5 rounded-2xl bg-white border border-stone-200">
            <h4 className="text-xs font-black uppercase tracking-wide text-stone-500">Основное</h4>

            <Field label="Название блюда">
              <input
                value={draft.name}
                onChange={(e) => set('name', e.target.value)}
                className={inputClass}
                placeholder="Например: Пирожки домашние"
                required
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Категория">
                <select
                  value={draft.category}
                  onChange={(e) => set('category', e.target.value as CategoryId)}
                  className={inputClass}
                >
                  {editableCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Цена, ₪">
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.5"
                  value={draft.price}
                  onChange={(e) => set('price', Number(e.target.value))}
                  className={inputClass}
                />
              </Field>
            </div>

            <Toggle
              checked={draft.priceFrom}
              onChange={(v) => set('priceFrom', v)}
              label="Цена «от»"
              hint="Когда варианты блюда стоят по-разному"
            />

            <div className="grid grid-cols-2 gap-3">
              <Field label="Единица" hint="Показывается рядом с ценой">
                <input
                  value={draft.unit}
                  onChange={(e) => set('unit', e.target.value)}
                  className={inputClass}
                  placeholder="за 1 кг"
                />
              </Field>

              <Field label="Вес / порция" hint="Например: ~75 г / шт">
                <input
                  value={draft.weight}
                  onChange={(e) => set('weight', e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Плашка на карточке" hint="Короткая метка, например «Хит» или «С пылу с жару 🔥». Пусто — плашки не будет.">
              <input
                value={draft.badge}
                onChange={(e) => set('badge', e.target.value)}
                className={inputClass}
                maxLength={40}
              />
            </Field>

            <Field label="Порядок в меню" hint="Меньше число — выше в списке. 0 — оставить как есть.">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={draft.orderIndex}
                onChange={(e) => set('orderIndex', Number(e.target.value))}
                className={inputClass}
              />
            </Field>
          </section>

          <section className="space-y-3 p-3.5 rounded-2xl bg-white border border-stone-200">
            <h4 className="text-xs font-black uppercase tracking-wide text-stone-500">Описание</h4>

            <Field label="Короткое описание" hint="Одна-две строки — их видно прямо в меню.">
              <textarea
                value={draft.shortDescription}
                onChange={(e) => set('shortDescription', e.target.value)}
                rows={2}
                className={textareaClass}
              />
            </Field>

            <Field label="Подробное описание">
              <textarea
                value={draft.fullDescription}
                onChange={(e) => set('fullDescription', e.target.value)}
                rows={4}
                className={textareaClass}
              />
            </Field>

            <Field label="Состав" hint="По одному ингредиенту в строке.">
              <textarea
                value={draft.ingredientsText}
                onChange={(e) => set('ingredientsText', e.target.value)}
                rows={4}
                className={`${textareaClass} font-mono text-xs`}
                placeholder={'мука\nмолоко\nсливочное масло'}
              />
            </Field>
          </section>

          <section className="space-y-3 p-3.5 rounded-2xl bg-white border border-stone-200">
            <h4 className="text-xs font-black uppercase tracking-wide text-stone-500">Начинки и приготовление</h4>

            <Field label="Варианты начинок" hint="По одному варианту в строке. Если список не пуст, покупатель обязан выбрать начинку.">
              <textarea
                value={draft.fillingsText}
                onChange={(e) => set('fillingsText', e.target.value)}
                rows={4}
                className={`${textareaClass} font-mono text-xs`}
                placeholder={'Картофель с луком\nКапуста\nВишня'}
              />
            </Field>

            <Field label="Способы приготовления" hint="По одному в строке: печёные, жареные…">
              <textarea
                value={draft.cookingOptionsText}
                onChange={(e) => set('cookingOptionsText', e.target.value)}
                rows={2}
                className={`${textareaClass} font-mono text-xs`}
              />
            </Field>

            <Field label="Условия хранения">
              <textarea
                value={draft.storageInfo}
                onChange={(e) => set('storageInfo', e.target.value)}
                rows={2}
                className={textareaClass}
              />
            </Field>

            <Field label="Как разогреть / подать">
              <textarea
                value={draft.cookingInstructions}
                onChange={(e) => set('cookingInstructions', e.target.value)}
                rows={2}
                className={textareaClass}
              />
            </Field>
          </section>

          <section className="space-y-3 p-3.5 rounded-2xl bg-white border border-stone-200">
            <h4 className="text-xs font-black uppercase tracking-wide text-stone-500">Метки и количество</h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Toggle
                checked={draft.isBestseller}
                onChange={(v) => set('isBestseller', v)}
                label="Хит продаж"
              />
              <Toggle checked={draft.isNew} onChange={(v) => set('isNew', v)} label="Новинка" />
              <Toggle
                checked={draft.isPreorderOnly}
                onChange={(v) => set('isPreorderOnly', v)}
                label="Только под заказ"
                hint="Готовится в день заказа"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Минимальный заказ">
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  value={draft.minQuantity}
                  onChange={(e) => set('minQuantity', Number(e.target.value))}
                  className={inputClass}
                />
              </Field>
              <Field label="Шаг количества">
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  value={draft.stepQuantity}
                  onChange={(e) => set('stepQuantity', Number(e.target.value))}
                  className={inputClass}
                />
              </Field>
            </div>
          </section>
        </div>
      </div>

      {/* Кнопка сохранения закреплена внизу: в длинной форме до неё иначе далеко прокручивать. */}
      <div
        className="fixed bottom-0 left-0 right-0 z-10 px-4 py-3 bg-white/95 backdrop-blur border-t border-stone-200 flex gap-2 sm:absolute sm:rounded-b-2xl"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <button
          type="button"
          onClick={onCancel}
          className="min-h-11 px-4 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-sm font-bold text-stone-700 transition-colors"
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="flex-1 inline-flex items-center justify-center gap-2 min-h-11 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white text-sm font-bold transition-colors"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{isSaving ? 'Сохраняем…' : 'Сохранить блюдо'}</span>
        </button>
      </div>
    </form>
  );
};
