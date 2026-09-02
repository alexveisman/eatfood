/**
 * Локальное хранилище на IndexedDB.
 *
 * Нужно для двух вещей: показать меню мгновенно (до ответа сети) и не потерять
 * правки владельца, если облако недоступно. localStorage тут не подходит —
 * его лимит около 5 МБ, а фото, встроенные в карточки, легко его превышают.
 */

const DB_NAME = 'BakeryMenuAppDB';
const DB_VERSION = 1;
const STORE_PRODUCTS = 'products';
const STORE_GALLERY = 'gallery';
const STORE_SETTINGS = 'settings';

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB не поддерживается этим браузером'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      if (!database.objectStoreNames.contains(STORE_PRODUCTS)) {
        database.createObjectStore(STORE_PRODUCTS, { keyPath: 'id' });
      }
      if (!database.objectStoreNames.contains(STORE_GALLERY)) {
        database.createObjectStore(STORE_GALLERY, { keyPath: 'id' });
      }
      if (!database.objectStoreNames.contains(STORE_SETTINGS)) {
        database.createObjectStore(STORE_SETTINGS, { keyPath: 'key' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    // В приватном режиме Safari запрос может «зависнуть» на запросе разрешения.
    request.onblocked = () => reject(new Error('База данных заблокирована другой вкладкой'));
  });

  // Неудачное открытие не должно навсегда закешироваться отклонённым промисом.
  dbPromise.catch(() => {
    dbPromise = null;
  });

  return dbPromise;
}

/** Выполняет операции в одной транзакции и ждёт именно её завершения, а не отдельных запросов. */
async function runTransaction<T>(
  storeName: string,
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => T | void
): Promise<T | void> {
  const database = await openDB();
  return new Promise((resolve, reject) => {
    const tx = database.transaction(storeName, mode);
    let result: T | void;
    try {
      result = operation(tx.objectStore(storeName));
    } catch (error) {
      tx.abort();
      reject(error);
      return;
    }
    tx.oncomplete = () => resolve(result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error ?? new Error('Транзакция прервана'));
  });
}

function getAll<T>(storeName: string): Promise<T[]> {
  return runTransaction<Promise<T[]>>(storeName, 'readonly', (store) => {
    const request = store.getAll();
    return new Promise<T[]>((resolve, reject) => {
      request.onsuccess = () => resolve((request.result as T[]) || []);
      request.onerror = () => reject(request.error);
    });
  }).then((value) => value as Promise<T[]>);
}

export async function idbSaveProduct(product: unknown): Promise<void> {
  await runTransaction(STORE_PRODUCTS, 'readwrite', (store) => store.put(product));
}

export async function idbSaveAllProducts(products: unknown[]): Promise<void> {
  await runTransaction(STORE_PRODUCTS, 'readwrite', (store) => {
    products.forEach((product) => store.put(product));
  });
}

/** Полностью заменяет содержимое хранилища — используется при синхронизации с облаком. */
export async function idbReplaceAllProducts(products: unknown[]): Promise<void> {
  await runTransaction(STORE_PRODUCTS, 'readwrite', (store) => {
    store.clear();
    products.forEach((product) => store.put(product));
  });
}

export async function idbGetAllProducts(): Promise<any[]> {
  try {
    return await getAll<any>(STORE_PRODUCTS);
  } catch (error) {
    console.warn('Не удалось прочитать локальный каталог:', error);
    return [];
  }
}

export async function idbDeleteProduct(productId: string): Promise<void> {
  await runTransaction(STORE_PRODUCTS, 'readwrite', (store) => store.delete(productId));
}

export async function idbSaveGalleryPhoto(photo: unknown): Promise<void> {
  await runTransaction(STORE_GALLERY, 'readwrite', (store) => store.put(photo));
}

export async function idbGetAllGallery(): Promise<any[]> {
  try {
    return await getAll<any>(STORE_GALLERY);
  } catch (error) {
    console.warn('Не удалось прочитать локальную галерею:', error);
    return [];
  }
}

export async function idbDeleteGalleryPhoto(photoId: string): Promise<void> {
  await runTransaction(STORE_GALLERY, 'readwrite', (store) => store.delete(photoId));
}

export async function idbGetSetting<T>(key: string): Promise<T | undefined> {
  try {
    const rows = await getAll<{ key: string; value: T }>(STORE_SETTINGS);
    return rows.find((row) => row.key === key)?.value;
  } catch {
    return undefined;
  }
}

export async function idbSetSetting<T>(key: string, value: T): Promise<void> {
  await runTransaction(STORE_SETTINGS, 'readwrite', (store) => store.put({ key, value }));
}
