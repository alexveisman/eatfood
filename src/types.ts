export type Language = 'ru' | 'en' | 'he';

/**
 * Изображение с набором адаптивных вариантов.
 * Такие наборы генерирует скрипт scripts/optimize-images.mjs для фотографий,
 * вшитых в сборку. Сейчас таких фотографий нет: все снимки владелец загружает
 * через панель, и они приходят обычной строкой-ссылкой.
 */
export interface ResponsiveImage {
  /** Запасной вариант (JPEG 800px) — используется как `src`. */
  src: string;
  /** Строка srcSet с WebP-вариантами разной ширины. */
  srcSet: string;
  /** Крошечный размытый плейсхолдер, показывается пока грузится настоящее фото. */
  blurDataUrl: string;
  /** Соотношение сторон оригинала (ширина / высота) — резервирует место и убирает скачки вёрстки. */
  aspectRatio: number;
}

/** Источник картинки: либо адаптивный набор, либо обычная строка (URL/data:) от владельца. */
export type ImageSource = ResponsiveImage | string;

export type CategoryId = 
  | 'all' 
  | 'bakery'
  | 'blini' 
  | 'dumplings_mains' 
  | 'salads';

export interface Category {
  id: CategoryId;
  label: string;
  iconName: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  price: number;
  /** Показывать цену как «от N ₪»: у блюда есть варианты дороже базового. */
  priceFrom?: boolean;
  unit: string;
  minQuantity?: number;
  stepQuantity?: number;
  shortDescription: string;
  fullDescription: string;
  ingredients: string[];
  /** Путь к фото. Для встроенных блюд — адаптивный набор, для загруженных владельцем — URL или data:. */
  image: ImageSource;
  gallery?: ImageSource[];
  availableFillings?: string[];
  fillingRequired?: boolean;
  cookingOptions?: string[];
  weight?: string;
  isBestseller?: boolean;
  isNew?: boolean;
  badge?: string;
  storageInfo?: string;
  cookingInstructions?: string;
  isPreorderOnly?: boolean;
  orderIndex?: number;
}

export interface CartItem {
  cartItemId: string;
  product: Product;
  quantity: number;
  selectedFilling?: string;
  selectedCookingOption?: string;
  customNotes?: string;
  totalPrice: number;
}

export interface Review {
  id: string;
  author: string;
  date: string;
  rating: number;
  orderItems: string;
  comment: string;
  verified: boolean;
  photoUrl?: string;
  location?: string;
}

export interface OrderFormState {
  customerName: string;
  customerPhone: string;
  deliveryType: 'pickup' | 'taxi';
  preferredDate: string;
  preferredTime: string;
  notes: string;
}
