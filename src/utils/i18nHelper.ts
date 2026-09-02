import { Product, Language, Category } from '../types';
import { CATEGORIES } from '../data/menuData';
import { TRANSLATIONS, CATEGORY_TRANSLATIONS, PRODUCT_TRANSLATIONS } from '../i18n/translations';

export function getLocalizedProduct(product: Product, lang: Language): Product {
  const trans = PRODUCT_TRANSLATIONS[product.id]?.[lang];
  if (!trans) return product;

  return {
    ...product,
    name: trans.name || product.name,
    unit: trans.unit || product.unit,
    weight: trans.weight || product.weight,
    badge: trans.badge || product.badge,
    shortDescription: trans.shortDescription || product.shortDescription,
    fullDescription: trans.fullDescription || product.fullDescription,
    ingredients: trans.ingredients || product.ingredients,
    availableFillings: trans.availableFillings || product.availableFillings,
    cookingOptions: trans.cookingOptions || product.cookingOptions,
    storageInfo: trans.storageInfo || product.storageInfo,
    cookingInstructions: trans.cookingInstructions || product.cookingInstructions,
  };
}

export function getLocalizedCategories(lang: Language): Category[] {
  return CATEGORIES.map((cat) => {
    const trans = CATEGORY_TRANSLATIONS[cat.id]?.[lang];
    return {
      ...cat,
      label: trans?.label || cat.label,
      description: trans?.description || cat.description,
    };
  });
}

export function getTranslations(lang: Language) {
  return TRANSLATIONS[lang] || TRANSLATIONS.ru;
}
