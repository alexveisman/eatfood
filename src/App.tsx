import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { CategoryId, Language, Product } from './types';
import { INITIAL_PRODUCTS } from './data/menuData';
import { Header } from './components/Header';
import { RestaurantMenuList } from './components/RestaurantMenuList';
import { HorizontalFoodGallery } from './components/HorizontalFoodGallery';
import { PreorderSection } from './components/PreorderSection';
import { DeliverySection } from './components/DeliverySection';
import { FloatingWhatsAppButton } from './components/FloatingWhatsAppButton';
import { Footer } from './components/Footer';
import { AdminLoginModal } from './components/AdminLoginModal';

/**
 * Панель владельца грузится отдельным файлом и только когда её открывают.
 * Обычному посетителю она не нужна, а весит вместе с Firebase Storage заметно.
 */
const AdminProductManager = lazy(() =>
  import('./components/AdminProductManager').then((module) => ({ default: module.AdminProductManager }))
);
import { getLocalizedProduct, getLocalizedCategories, getTranslations } from './utils/i18nHelper';
import {
  subscribeToProducts,
  subscribeToGallery,
  GalleryPhotoItem,
  sortProductsByOrder
} from './services/productService';
import { isAdminAuthenticated, logoutAdmin } from './utils/adminAuth';
import { ShieldCheck } from 'lucide-react';

export default function App() {
  // 1. Language State
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('bakery_language') as Language;
      return (saved === 'ru' || saved === 'en' || saved === 'he') ? saved : 'ru';
    } catch {
      return 'ru';
    }
  });

  // 2. Real-time Firebase Database state
  const [rawProducts, setRawProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhotoItem[]>([]);
  
  // 3. Admin & Security State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => isAdminAuthenticated());
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Trigger admin access checking
  const handleOpenAdmin = useCallback(() => {
    if (isAdminAuthenticated()) {
      setIsAdminLoggedIn(true);
      setIsAdminOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  }, []);

  // Check URL on load and hash changes for #admin, /admin, or ?admin
  useEffect(() => {
    const checkAdminRoute = () => {
      const isHashAdmin = window.location.hash.toLowerCase() === '#admin';
      const isPathAdmin = /\/admin\/?$/.test(window.location.pathname.toLowerCase());
      // Строгая проверка параметра: раньше подходила любая ссылка со словом admin
      // внутри запроса, например ?utm_source=adminpanel.
      const isQueryAdmin = new URLSearchParams(window.location.search).has('admin');

      if (isHashAdmin || isPathAdmin || isQueryAdmin) {
        handleOpenAdmin();
      }
    };

    checkAdminRoute();
    window.addEventListener('hashchange', checkAdminRoute);
    window.addEventListener('popstate', checkAdminRoute);

    return () => {
      window.removeEventListener('hashchange', checkAdminRoute);
      window.removeEventListener('popstate', checkAdminRoute);
    };
  }, [handleOpenAdmin]);

  useEffect(() => {
    // Subscribe to real-time products collection in Firestore
    const unsubscribeProducts = subscribeToProducts((loadedProducts) => {
      // Пустой массив тоже применяем: иначе удалённые блюда продолжали бы висеть в меню.
      if (Array.isArray(loadedProducts)) {
        setRawProducts(loadedProducts);
      }
    });

    // Subscribe to real-time gallery photos collection in Firestore
    const unsubscribeGallery = subscribeToGallery((loadedGallery) => {
      if (loadedGallery) {
        setGalleryPhotos(loadedGallery);
      }
    });

    return () => {
      unsubscribeProducts();
      unsubscribeGallery();
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('bakery_language', currentLang);
    } catch {
      // ignore
    }
    // Update HTML dir and lang for RTL support when Hebrew is active
    document.documentElement.dir = currentLang === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  const t = getTranslations(currentLang);
  const localizedCategories = getLocalizedCategories(currentLang);

  // 4. UI Filter State
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Localized products with search and category filters
  const localizedProductsList = useMemo(
    () => sortProductsByOrder(rawProducts).map((prod) => getLocalizedProduct(prod, currentLang)),
    [rawProducts, currentLang]
  );

  const filteredProducts = useMemo(() => localizedProductsList.filter((prod) => {
    // 1. Category filter
    if (activeCategory !== 'all' && prod.category !== activeCategory) {
      return false;
    }

    // 2. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inName = prod.name.toLowerCase().includes(q);
      const inFillings = prod.availableFillings?.some((f) => f.toLowerCase().includes(q));
      const inIngredients = prod.ingredients?.some((i) => i.toLowerCase().includes(q));
      return inName || inFillings || inIngredients;
    }

    return true;
  }), [localizedProductsList, activeCategory, searchQuery]);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-[#FDFBF7] text-[#4A3728] ${currentLang === 'he' ? 'font-sans' : ''}`}>
      {/* 1. Header with Language Switcher & WhatsApp */}
      <Header
        onOpenDeliveryInfo={() => scrollToSection('delivery-info-section')}
        currentLang={currentLang}
        onSelectLang={setCurrentLang}
        onChangeLang={setCurrentLang}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl mx-auto px-3.5 sm:px-6 w-full pb-24 sm:pb-16">
        {/* 2. Hero Intro Header (Clean public view) */}
        <section className={`pt-3 sm:pt-6 pb-1 ${currentLang === 'he' ? 'text-right' : 'text-left'} space-y-1`}>
          <h1 className="text-xl sm:text-3xl font-bold text-[#4A3728] tracking-tight leading-tight">
            {t.heroTitle}
          </h1>
          <p className="text-xs sm:text-sm text-[#6D5A4C] leading-relaxed max-w-2xl">
            {t.heroSubtitle}
          </p>
        </section>

        {/* 3. Products Catalog: Itemized Restaurant Menu List with Integrated Search & Category Segmentation */}
        <div id="catalog-section" className="my-3 sm:my-5">
          <RestaurantMenuList
            products={filteredProducts}
            currentLang={currentLang}
            categories={localizedCategories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onResetFilters={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
          />
        </div>

        {/* 5. Horizontal Swiping Food Photos Gallery */}
        <HorizontalFoodGallery
          products={rawProducts}
          galleryPhotos={galleryPhotos}
          currentLang={currentLang}
          isAdminLoggedIn={isAdminLoggedIn}
          onOpenAdmin={handleOpenAdmin}
        />

        {/* 6. Preorder / Custom Order Section */}
        <PreorderSection
          currentLang={currentLang}
        />

        {/* 7. Delivery & Pickup Information */}
        <DeliverySection
          currentLang={currentLang}
        />
      </main>

      {/* 8. Footer */}
      <Footer
        onScrollToDelivery={() => scrollToSection('delivery-info-section')}
        currentLang={currentLang}
      />

      {/* 9. Floating Quick WhatsApp Button */}
      <FloatingWhatsAppButton
        currentLang={currentLang}
      />

      {/* 10. Discrete Floating Admin Button for Authenticated Owner */}
      {isAdminLoggedIn && (
        <div className="fixed bottom-safe left-4 z-40 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <button
            onClick={() => setIsAdminOpen(true)}
            className="flex items-center gap-2 px-3.5 min-h-11 bg-stone-900/90 hover:bg-stone-900 text-white rounded-full text-xs font-bold shadow-lg backdrop-blur-xs border border-stone-700/60 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Открыть панель управления меню"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Панель владельца</span>
          </button>
        </div>
      )}

      {/* 11. Owner PIN Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          if (window.location.hash === '#admin') {
            history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        }}
        onSuccess={() => {
          setIsLoginModalOpen(false);
          setIsAdminLoggedIn(true);
          setIsAdminOpen(true);
        }}
      />

      {/* 12. Панель владельца (загружается по требованию) */}
      {isAdminOpen && (
        <Suspense fallback={null}>
          <AdminProductManager
            isOpen={isAdminOpen}
            onClose={() => {
              setIsAdminOpen(false);
              if (window.location.hash === '#admin') {
                history.replaceState(null, '', window.location.pathname + window.location.search);
              }
            }}
            products={rawProducts}
            galleryPhotos={galleryPhotos}
            onLogout={() => {
              logoutAdmin();
              setIsAdminLoggedIn(false);
              setIsAdminOpen(false);
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
