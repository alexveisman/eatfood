import React from 'react';
import { CategoryId, Category, Language } from '../types';
import { 
   Utensils, 
   Croissant, 
   Cookie,
   Package, 
   Flame, 
   Cake,
   Layers,
   Search,
   X
 } from 'lucide-react';
import { getTranslations } from '../utils/i18nHelper';

interface CategoryNavProps {
  categories: Category[];
  activeCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currentLang: Language;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  currentLang,
}) => {
  const t = getTranslations(currentLang);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Croissant':
        return <Croissant className="w-4 h-4" />;
      case 'Layers':
        return <Layers className="w-4 h-4" />;
      case 'Package':
        return <Package className="w-4 h-4" />;
      case 'Flame':
        return <Flame className="w-4 h-4" />;
      case 'Cookie':
        return <Cookie className="w-4 h-4" />;
      case 'Cake':
        return <Cake className="w-4 h-4" />;
      default:
        return <Utensils className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-2.5 sm:space-y-3 pt-1">
      {/* Search Input Bar */}
      <div className="relative w-full">
        <Search className={`absolute ${currentLang === 'he' ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B5E3C] pointer-events-none`} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t.searchPlaceholder}
          className={`w-full ${currentLang === 'he' ? 'pr-10 pl-10' : 'pl-10 pr-10'} py-2 sm:py-2.5 rounded-full bg-white border border-[#E8E2D9] text-xs sm:text-sm text-[#4A3728] placeholder-[#A09081] focus:outline-none focus:ring-2 focus:ring-[#D97706]/40 focus:border-[#D97706] shadow-2xs transition-all h-11`}
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className={`absolute ${currentLang === 'he' ? 'left-1' : 'right-1'} top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-[#8B5E3C] hover:text-[#4A3728] rounded-full hover:bg-gray-100 cursor-pointer`}
            aria-label="Очистить поиск"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main Category Horizontal Scrolling Tabs */}
      <div className="overflow-x-auto pb-1 -mx-2 px-2 sm:mx-0 sm:px-0 no-scrollbar snap-x snap-mandatory flex items-center gap-2">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 sm:px-4 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer select-none shrink-0 snap-start min-h-11 sm:min-h-10 ${
                isActive
                  ? 'bg-[#4A3728] text-white shadow-xs'
                  : 'bg-white hover:bg-[#F5F1EB] text-[#4A3728] border border-[#E8E2D9]'
              }`}
            >
              <span className={isActive ? 'text-[#D97706]' : 'text-[#8B5E3C]'}>
                {getCategoryIcon(cat.iconName)}
              </span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
