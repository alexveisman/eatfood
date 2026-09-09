import { getFirestoreApi } from '../lib/firestoreLazy';
import { INITIAL_PRODUCTS } from '../data/menuData';
import type { ImageSource, Product } from '../types';
import {
  idbDeleteGalleryPhoto,
  idbGetAllGallery,
  idbGetAllProducts,
  idbGetSetting,
  idbReplaceAllProducts,
  idbSaveAllProducts,
  idbSaveGalleryPhoto,
  idbSaveProduct,
  idbSetSetting,
} from '../utils/idbStorage';
import { isResponsiveImage, isValidImageSource, toStorableImage } from '../utils/imageUrlHelper';

export interface GalleryPhotoItem {
  id: string;
  title: string;
  category: string;
  image: string;
  createdAt?: string;
}

export interface OrderItemRecord {
  id: string;
  customerName: string;
  customerPhone: string;
  deliveryType: 'pickup' | 'taxi';
  preferredDate: string;
  preferredTime: string;
  notes: string;
  totalAmount: number;
  items: Array<{
    title: string;
    quantity: number;
    price: number;
    filling?: string;
    cookingOption?: string;
    notes?: string;
  }>;
  status: 'new' | 'in_progress' | 'ready' | 'completed' | 'cancelled';
  createdAt: string;
}

/** Итог операции записи: что удалось сохранить локально, а что доехало до облака. */
export interface SaveResult {
  savedLocally: boolean;
  syncedToCloud: boolean;
  error?: string;
}

const PRODUCTS_COLLECTION = 'products';
const GALLERY_COLLECTION = 'gallery';
const ORDERS_COLLECTION = 'orders';

/** Запас до лимита документа Firestore (1 МиБ), чтобы не упереться в него на служебных полях. */
const FIRESTORE_DOC_LIMIT_BYTES = 1_048_576;
const FIRESTORE_SAFE_DOC_BYTES = 900 * 1024;

/**
 * Форма документа блюда в базе.
 * Отличается от Product тем, что image здесь всегда строка: адаптивные наборы
 * вариантов живут в сборке и в базу не попадают.
 */
type StoredProduct = Omit<Product, 'image' | 'gallery'> & {
  image?: string;
  gallery?: string[];
  /** Надгробие: блюдо из встроенного меню, которое владелец удалил. */
  deleted?: boolean;
  updatedAt?: string;
};

const initialById = new Map(INITIAL_PRODUCTS.map((p) => [p.id, p]));

const PENDING_KEY = 'pendingLocalProducts';

/**
 * Правки, которые сохранились на устройстве, но не доехали до облака.
 *
 * Без них происходило вот что: владелец загружал фото, оно появлялось в меню,
 * запись в облако не проходила (правила базы или нет сети), а подписка на облако
 * тут же присылала состояние сервера — где фото нет. Каталог перестраивался по
 * серверу, и фотография пропадала с экрана, а idbReplaceAllProducts стирал и
 * локальную копию, так что после перезагрузки вернуть её было уже нельзя.
 *
 * Теперь такие правки лежат отдельно и накладываются поверх облачных данных,
 * пока облако их не примет.
 */
let pendingOverrides = new Map<string, StoredProduct>();
let pendingLoaded: Promise<void> | null = null;

function loadPendingOverrides(): Promise<void> {
  if (!pendingLoaded) {
    pendingLoaded = idbGetSetting<StoredProduct[]>(PENDING_KEY)
      .then((rows) => {
        pendingOverrides = new Map((rows ?? []).map((row) => [row.id, row]));
      })
      .catch(() => {
        pendingOverrides = new Map();
      });
  }
  return pendingLoaded;
}

function persistPendingOverrides(): void {
  idbSetSetting(PENDING_KEY, [...pendingOverrides.values()]).catch((error) =>
    console.warn('Не удалось запомнить несинхронизированные правки:', error)
  );
}

function markPending(records: StoredProduct[]): void {
  records.forEach((record) => pendingOverrides.set(record.id, record));
  persistPendingOverrides();
}

function clearPending(ids: string[]): void {
  let changed = false;
  ids.forEach((id) => {
    if (pendingOverrides.delete(id)) changed = true;
  });
  if (changed) persistPendingOverrides();
}

/**
 * Убирает из локальных правок те, что облако уже подтвердило.
 * Сравниваем по времени изменения: если в облаке запись не старее нашей — она доехала.
 */
function reconcilePending(cloudRecords: StoredProduct[]): void {
  let changed = false;
  for (const cloud of cloudRecords) {
    const pending = pendingOverrides.get(cloud.id);
    if (!pending) continue;
    const cloudAt = cloud.updatedAt ?? '';
    const pendingAt = pending.updatedAt ?? '';
    if (cloudAt >= pendingAt) {
      pendingOverrides.delete(cloud.id);
      changed = true;
    }
  }
  if (changed) persistPendingOverrides();
}

/** Есть ли правки, которых ещё нет в облаке (панель показывает это владельцу). */
export function getPendingChangeCount(): number {
  return pendingOverrides.size;
}

export const sortProductsByOrder = (list: Product[]): Product[] => {
  const fallbackOrder = new Map(INITIAL_PRODUCTS.map((p, index) => [p.id, p.orderIndex ?? index + 1]));
  return [...list].sort((a, b) => {
    const aOrder = a.orderIndex ?? fallbackOrder.get(a.id) ?? 999;
    const bOrder = b.orderIndex ?? fallbackOrder.get(b.id) ?? 999;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.name.localeCompare(b.name, 'ru');
  });
};

/**
 * Выбирает картинку для показа.
 *
 * Встроенное фото (набор из сборки) в базу не пишется — там оседает пустая
 * строка. Поэтому пустое значение в записи значит «своего фото нет», и мы
 * показываем встроенное, а не пустоту. Встроенный снимок убирают удалением
 * файла из src/assets/images/source/, а не через панель.
 */
function pickImage(storedImage: string | undefined, initialImage: ImageSource | undefined): ImageSource {
  if (storedImage === undefined || storedImage === null) {
    return initialImage ?? '';
  }
  const trimmed = storedImage.trim();
  // Пустая строка означает «своего фото нет», а не «фото убрано намеренно»:
  // запись могла сохраниться тогда, когда встроенного фото ещё не существовало.
  // Раньше такая запись затирала фото из репозитория, и оно исчезало через
  // мгновение после загрузки страницы — ровно в тот момент, когда приходили
  // сохранённые данные.
  if (trimmed.length === 0) return initialImage ?? '';

  // Старые записи из AI Studio содержали ссылки-заглушки на Unsplash — они больше не актуальны.
  if (trimmed.includes('unsplash.com')) {
    return initialImage ?? '';
  }
  return isValidImageSource(trimmed) ? trimmed : (initialImage ?? '');
}

/** Накладывает запись из базы на встроенное блюдо, сохраняя поля, которых в записи нет. */
function mergeWithInitial(stored: StoredProduct, initial?: Product): Product {
  const base = initial ?? ({} as Product);
  const image = pickImage(stored.image, initial?.image);
  const galleryFromStore = stored.gallery?.filter((item) => isValidImageSource(item));

  return {
    ...base,
    ...(stored as unknown as Product),
    image,
    gallery: galleryFromStore && galleryFromStore.length > 0 ? galleryFromStore : image ? [image] : [],
    // Пустая строка в badge означает «убрать плашку», поэтому не подменяем её встроенным значением.
    badge: stored.badge !== undefined ? stored.badge : base.badge,
    orderIndex: stored.orderIndex ?? base.orderIndex,
  };
}

/**
 * Собирает итоговый список: встроенное меню + правки владельца + его новые блюда − удалённые.
 * Локальные несинхронизированные правки идут последними и перекрывают облачные.
 */
function buildCatalog(storedRecords: StoredProduct[]): Product[] {
  const storedById = new Map<string, StoredProduct>();
  for (const record of storedRecords) storedById.set(record.id, record);
  for (const record of pendingOverrides.values()) storedById.set(record.id, record);

  const result: Product[] = [];

  for (const initial of INITIAL_PRODUCTS) {
    const stored = storedById.get(initial.id);
    if (stored?.deleted) continue;
    result.push(stored ? mergeWithInitial(stored, initial) : initial);
  }

  for (const stored of storedById.values()) {
    if (initialById.has(stored.id) || stored.deleted) continue;
    result.push(mergeWithInitial(stored));
  }

  return sortProductsByOrder(result);
}

/** Готовит запись для базы: убирает адаптивные наборы и undefined, которые Firestore не принимает. */
function toStoredProduct(product: Product): StoredProduct {
  const gallery = (product.gallery ?? [])
    .map((item) => toStorableImage(item))
    .filter((item) => item.length > 0);

  const record: Record<string, unknown> = {
    ...product,
    image: toStorableImage(product.image),
    // Не дублируем фото в галерее: раньше это удваивало вес документа и упирало его в лимит Firestore.
    gallery: gallery.filter((item) => item !== toStorableImage(product.image)),
    updatedAt: new Date().toISOString(),
  };

  for (const key of Object.keys(record)) {
    if (record[key] === undefined) delete record[key];
  }
  return record as StoredProduct;
}

/**
 * Предел ожидания ответа сервера.
 *
 * Офлайн Firestore ставит запись в очередь, и обещание не завершается ни успехом,
 * ни ошибкой — оно просто висит. Из-за этого правка не попадала в список
 * несинхронизированных и терялась при следующем запуске сайта.
 */
const CLOUD_WRITE_TIMEOUT_MS = 8000;

function withTimeout<T>(promise: Promise<T>, ms = CLOUD_WRITE_TIMEOUT_MS): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error('сервер не ответил вовремя, изменения ждут на устройстве')),
      ms
    );
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

function estimateDocBytes(record: unknown): number {
  try {
    return new Blob([JSON.stringify(record)]).size;
  } catch {
    return JSON.stringify(record).length;
  }
}

/** Проверяет вес документа до записи — иначе Firestore отклонит её уже после «сохранено». */
function assertDocFits(record: StoredProduct): string | null {
  const bytes = estimateDocBytes(record);
  if (bytes <= FIRESTORE_SAFE_DOC_BYTES) return null;
  const mb = (bytes / 1024 / 1024).toFixed(2);
  return `Карточка «${record.name}» весит ${mb} МБ и не помещается в облако (лимит ${(
    FIRESTORE_DOC_LIMIT_BYTES /
    1024 /
    1024
  ).toFixed(0)} МБ). Загрузите фото меньшего размера.`;
}

let cachedProducts: Product[] = sortProductsByOrder(INITIAL_PRODUCTS);
let cachedGallery: GalleryPhotoItem[] = [];
/**
 * Данные из облака приоритетнее локальных. Флаг защищает от гонки:
 * IndexedDB иногда отвечает позже Firestore и раньше затирал свежие данные старыми.
 */
let hasCloudProducts = false;
let hasCloudGallery = false;
/** Последний ответ облака — по нему пересобирается каталог при изменении локальных правок. */
let cachedRemoteRecords: StoredProduct[] = [];

const productListeners = new Set<(products: Product[]) => void>();
const galleryListeners = new Set<(photos: GalleryPhotoItem[]) => void>();

function notifyProductListeners() {
  const snapshot = [...cachedProducts];
  productListeners.forEach((listener) => {
    try {
      listener(snapshot);
    } catch (error) {
      console.error('Ошибка в подписчике каталога:', error);
    }
  });
}

function notifyGalleryListeners() {
  const snapshot = [...cachedGallery];
  galleryListeners.forEach((listener) => {
    try {
      listener(snapshot);
    } catch (error) {
      console.error('Ошибка в подписчике галереи:', error);
    }
  });
}

/**
 * Подписка на каталог. Отдаёт данные тремя волнами, каждая следующая точнее предыдущей:
 * встроенное меню сразу → сохранённое локально → актуальное из облака.
 */
export function subscribeToProducts(onUpdate: (products: Product[]) => void): () => void {
  productListeners.add(onUpdate);
  onUpdate([...cachedProducts]);

  // Сначала поднимаем несинхронизированные правки: без них первый же ответ
  // облака построит каталог без них и сотрёт их с экрана.
  loadPendingOverrides()
    .then(() => idbGetAllProducts())
    .then((stored) => {
      // Облако уже ответило — облачные данные свежее, но локальные правки
      // всё равно накладываются внутри buildCatalog.
      if (hasCloudProducts) {
        cachedProducts = buildCatalog(cachedRemoteRecords);
        notifyProductListeners();
        return;
      }
      if (!stored || stored.length === 0) {
        if (pendingOverrides.size === 0) return;
        cachedProducts = buildCatalog([]);
        notifyProductListeners();
        return;
      }
      cachedProducts = buildCatalog(stored as StoredProduct[]);
      notifyProductListeners();
    })
    .catch((error) => console.warn('Локальное хранилище недоступно:', error));

  // SDK Firestore подгружается асинхронно, поэтому отписка может понадобиться
  // раньше, чем подписка будет создана — этот флаг закрывает такую гонку.
  let isCancelled = false;
  let unsubscribeFirestore = () => {};

  getFirestoreApi()
    .then(({ db, collection, onSnapshot }) => {
      if (isCancelled) return;
      unsubscribeFirestore = onSnapshot(
        collection(db, PRODUCTS_COLLECTION),
        (snapshot) => {
          const records: StoredProduct[] = [];
          snapshot.forEach((docSnap) => {
            records.push({ ...(docSnap.data() as StoredProduct), id: docSnap.id });
          });

          /*
            Офлайн Firestore сразу присылает ответ из собственного кеша — и он пустой,
            потому что с сервером ещё не общались. Раньше такой ответ принимался за
            состояние облака: каталог перестраивался без правок владельца, а
            idbReplaceAllProducts стирал и локальную копию. Фотография пропадала
            насовсем. Пустой кеш теперь просто игнорируется.
          */
          const fromCache = snapshot.metadata.fromCache;
          if (fromCache && records.length === 0) return;

          cachedRemoteRecords = records;
          cachedProducts = buildCatalog(records);
          notifyProductListeners();

          // Заменять локальную копию и гасить локальные правки можно только по
          // подтверждённому ответу сервера, а не по кешу.
          if (!fromCache) {
            hasCloudProducts = true;
            reconcilePending(records);
            idbReplaceAllProducts(records).catch(() => {});
          }
        },
        (error) => {
          console.warn('Каталог из облака недоступен, работаем на локальных данных:', error.message);
        }
      );
    })
    .catch((error) => console.warn('Не удалось подключиться к облаку:', error));

  return () => {
    isCancelled = true;
    productListeners.delete(onUpdate);
    unsubscribeFirestore();
  };
}

/** Сохраняет блюдо: сразу локально, затем в облако. Ошибку облака возвращает, а не прячет. */
export async function saveProduct(product: Product): Promise<SaveResult> {
  const record = toStoredProduct(product);
  const merged = mergeWithInitial(record, initialById.get(product.id));

  const index = cachedProducts.findIndex((p) => p.id === product.id);
  if (index >= 0) {
    cachedProducts[index] = merged;
  } else {
    cachedProducts = [...cachedProducts, merged];
  }
  cachedProducts = sortProductsByOrder(cachedProducts);
  notifyProductListeners();

  let savedLocally = false;
  try {
    await idbSaveProduct(record);
    savedLocally = true;
  } catch (error) {
    console.error('Не удалось сохранить локально:', error);
  }

  const sizeError = assertDocFits(record);
  if (sizeError) {
    markPending([record]);
    return { savedLocally, syncedToCloud: false, error: sizeError };
  }

  try {
    const { db, doc, setDoc } = await getFirestoreApi();
    await withTimeout(setDoc(doc(db, PRODUCTS_COLLECTION, product.id), record, { merge: true }));
    clearPending([record.id]);
    return { savedLocally, syncedToCloud: true };
  } catch (error) {
    // Правка остаётся локальной: без этого следующий ответ облака стёр бы её.
    markPending([record]);
    return {
      savedLocally,
      syncedToCloud: false,
      error: `Сохранено на этом устройстве, но не попало в облако: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

/** Пакетное сохранение. Firestore принимает до 500 операций за раз. */
export async function saveMultipleProducts(productsToSave: Product[]): Promise<SaveResult> {
  if (productsToSave.length === 0) return { savedLocally: true, syncedToCloud: true };

  const records = productsToSave.map(toStoredProduct);

  const byId = new Map(records.map((record) => [record.id, record]));
  cachedProducts = sortProductsByOrder(
    cachedProducts.map((product) => {
      const record = byId.get(product.id);
      return record ? mergeWithInitial(record, initialById.get(product.id)) : product;
    })
  );
  for (const record of records) {
    if (!cachedProducts.some((p) => p.id === record.id)) {
      cachedProducts.push(mergeWithInitial(record, initialById.get(record.id)));
    }
  }
  cachedProducts = sortProductsByOrder(cachedProducts);
  notifyProductListeners();

  let savedLocally = false;
  try {
    await idbSaveAllProducts(records);
    savedLocally = true;
  } catch (error) {
    console.error('Не удалось сохранить локально:', error);
  }

  const tooBig = records.map(assertDocFits).filter(Boolean);
  if (tooBig.length > 0) {
    markPending(records);
    return { savedLocally, syncedToCloud: false, error: tooBig[0] as string };
  }

  try {
    const { db, doc, writeBatch } = await getFirestoreApi();
    for (let offset = 0; offset < records.length; offset += 400) {
      const batch = writeBatch(db);
      for (const record of records.slice(offset, offset + 400)) {
        batch.set(doc(db, PRODUCTS_COLLECTION, record.id), record, { merge: true });
      }
      await withTimeout(batch.commit());
    }
    clearPending(records.map((record) => record.id));
    return { savedLocally, syncedToCloud: true };
  } catch (error) {
    markPending(records);
    return {
      savedLocally,
      syncedToCloud: false,
      error: `Изменения сохранены на этом устройстве, но не попали в облако: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

/**
 * Удаление блюда.
 *
 * Для блюда, добавленного владельцем, документ удаляется целиком.
 * Для блюда из встроенного меню пишется надгробие `{ deleted: true }` — без него
 * блюдо возвращалось бы при каждой перезагрузке страницы, ведь встроенный список в коде.
 */
export async function deleteProduct(productId: string): Promise<SaveResult> {
  const isBuiltIn = initialById.has(productId);

  cachedProducts = cachedProducts.filter((p) => p.id !== productId);
  notifyProductListeners();

  const tombstone: StoredProduct = {
    id: productId,
    deleted: true,
    updatedAt: new Date().toISOString(),
  } as StoredProduct;

  let savedLocally = false;
  try {
    if (isBuiltIn) {
      await idbSaveProduct(tombstone);
    } else {
      const { idbDeleteProduct } = await import('../utils/idbStorage');
      await idbDeleteProduct(productId);
    }
    savedLocally = true;
  } catch (error) {
    console.error('Не удалось обновить локальное хранилище:', error);
  }

  try {
    const { db, doc, setDoc, deleteDoc } = await getFirestoreApi();
    if (isBuiltIn) {
      await withTimeout(setDoc(doc(db, PRODUCTS_COLLECTION, productId), tombstone, { merge: true }));
    } else {
      await withTimeout(deleteDoc(doc(db, PRODUCTS_COLLECTION, productId)));
    }
    clearPending([productId]);
    return { savedLocally, syncedToCloud: true };
  } catch (error) {
    markPending([tombstone]);
    return {
      savedLocally,
      syncedToCloud: false,
      error: `Удалено на этом устройстве, но не в облаке: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

/**
 * Возврат к исходному меню.
 * Чистит и облако тоже — иначе подписка тут же вернула бы прежние правки обратно.
 */
export async function resetProductsToDefault(): Promise<SaveResult> {
  clearPending([...pendingOverrides.keys()]);
  cachedProducts = sortProductsByOrder(INITIAL_PRODUCTS);
  notifyProductListeners();

  let savedLocally = false;
  try {
    await idbReplaceAllProducts([]);
    savedLocally = true;
  } catch (error) {
    console.error('Не удалось очистить локальное хранилище:', error);
  }

  try {
    const { db, doc, writeBatch } = await getFirestoreApi();
    const stored = await idbGetAllProducts();
    const idsToClear = new Set<string>([
      ...stored.map((record: StoredProduct) => record.id),
      ...cachedProducts.map((p) => p.id),
    ]);

    const ids = [...idsToClear];
    for (let offset = 0; offset < ids.length; offset += 400) {
      const batch = writeBatch(db);
      for (const id of ids.slice(offset, offset + 400)) {
        batch.delete(doc(db, PRODUCTS_COLLECTION, id));
      }
      await batch.commit();
    }
    return { savedLocally, syncedToCloud: true };
  } catch (error) {
    return {
      savedLocally,
      syncedToCloud: false,
      error: `Меню сброшено на этом устройстве, но правки остались в облаке: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

export function subscribeToGallery(onUpdate: (photos: GalleryPhotoItem[]) => void): () => void {
  galleryListeners.add(onUpdate);
  onUpdate([...cachedGallery]);

  idbGetAllGallery()
    .then((stored) => {
      if (hasCloudGallery || !stored || stored.length === 0) return;
      cachedGallery = stored;
      notifyGalleryListeners();
    })
    .catch(() => {});

  let isCancelled = false;
  let unsubscribeFirestore = () => {};

  getFirestoreApi()
    .then(({ db, collection, onSnapshot }) => {
      if (isCancelled) return;
      unsubscribeFirestore = onSnapshot(
        collection(db, GALLERY_COLLECTION),
        (snapshot) => {
          const loaded: GalleryPhotoItem[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push({ ...(docSnap.data() as GalleryPhotoItem), id: docSnap.id });
          });
          hasCloudGallery = true;
          // Пустой ответ тоже значим: владелец мог удалить все фото.
          cachedGallery = loaded.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
          loaded.forEach((item) => idbSaveGalleryPhoto(item).catch(() => {}));
          notifyGalleryListeners();
        },
        (error) => console.warn('Галерея из облака недоступна:', error.message)
      );
    })
    .catch(() => {
      // Работаем на локальных данных.
    });

  return () => {
    isCancelled = true;
    galleryListeners.delete(onUpdate);
    unsubscribeFirestore();
  };
}

export async function saveGalleryPhoto(photo: GalleryPhotoItem): Promise<SaveResult> {
  const record = { ...photo, createdAt: photo.createdAt || new Date().toISOString() };
  cachedGallery = [record, ...cachedGallery.filter((p) => p.id !== record.id)];
  notifyGalleryListeners();

  let savedLocally = false;
  try {
    await idbSaveGalleryPhoto(record);
    savedLocally = true;
  } catch (error) {
    console.error('Не удалось сохранить фото локально:', error);
  }

  if (estimateDocBytes(record) > FIRESTORE_SAFE_DOC_BYTES) {
    return {
      savedLocally,
      syncedToCloud: false,
      error: 'Фото слишком тяжёлое для облака. Выберите файл меньшего размера.',
    };
  }

  try {
    const { db, doc, setDoc } = await getFirestoreApi();
    await withTimeout(setDoc(doc(db, GALLERY_COLLECTION, record.id), record, { merge: true }));
    return { savedLocally, syncedToCloud: true };
  } catch (error) {
    return {
      savedLocally,
      syncedToCloud: false,
      error: `Фото сохранено на этом устройстве, но не попало в облако: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

export async function deleteGalleryPhoto(photoId: string): Promise<SaveResult> {
  cachedGallery = cachedGallery.filter((p) => p.id !== photoId);
  notifyGalleryListeners();

  let savedLocally = false;
  try {
    await idbDeleteGalleryPhoto(photoId);
    savedLocally = true;
  } catch (error) {
    console.error('Не удалось удалить фото локально:', error);
  }

  try {
    const { db, doc, deleteDoc } = await getFirestoreApi();
    await withTimeout(deleteDoc(doc(db, GALLERY_COLLECTION, photoId)));
    return { savedLocally, syncedToCloud: true };
  } catch (error) {
    return {
      savedLocally,
      syncedToCloud: false,
      error: `Удалено на этом устройстве, но не в облаке: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

export async function saveOrder(order: OrderItemRecord): Promise<SaveResult> {
  try {
    const { db, doc, setDoc } = await getFirestoreApi();
    await setDoc(doc(db, ORDERS_COLLECTION, order.id), order);
    return { savedLocally: false, syncedToCloud: true };
  } catch (error) {
    return {
      savedLocally: false,
      syncedToCloud: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Досылает в облако правки, застрявшие на устройстве.
 *
 * Нужно после того, как владелец настроил Firebase и вошёл по почте: всё, что он
 * успел наменять в локальном режиме, уезжает на сервер и становится видно покупателям.
 */
export async function flushPendingChanges(): Promise<SaveResult> {
  await loadPendingOverrides();
  const records = [...pendingOverrides.values()];
  if (records.length === 0) {
    return { savedLocally: true, syncedToCloud: true };
  }

  try {
    const { db, doc, writeBatch } = await getFirestoreApi();
    for (let offset = 0; offset < records.length; offset += 400) {
      const batch = writeBatch(db);
      for (const record of records.slice(offset, offset + 400)) {
        batch.set(doc(db, PRODUCTS_COLLECTION, record.id), record, { merge: true });
      }
      await withTimeout(batch.commit());
    }
    clearPending(records.map((record) => record.id));
    return { savedLocally: true, syncedToCloud: true };
  } catch (error) {
    return {
      savedLocally: true,
      syncedToCloud: false,
      error: `Не удалось отправить в облако ${records.length} изменений: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

/** Совместимость со старыми именами, использовавшимися в компонентах. */
export const saveProductToFirestore = saveProduct;
export const deleteProductFromFirestore = deleteProduct;
export const saveGalleryPhotoToFirestore = saveGalleryPhoto;
export const deleteGalleryPhotoFromFirestore = deleteGalleryPhoto;
export const saveOrderToFirestore = saveOrder;

/**
 * Оставлено для обратной совместимости: раньше компоненты сами приводили ссылку к виду для <img>.
 * Теперь этим занимается resolveImage() внутри SmartImage.
 */
export function getSanitizedProductImage(image?: ImageSource, initialImage?: ImageSource): ImageSource {
  if (isResponsiveImage(image)) return image;
  return pickImage(typeof image === 'string' ? image : undefined, initialImage);
}
