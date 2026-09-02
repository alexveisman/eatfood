/**
 * Ленивая загрузка Firestore.
 *
 * SDK Firestore весит около 110 КБ в сжатом виде. Раньше он подключался статически и
 * скачивался, разбирался и выполнялся до первого показа меню — хотя само меню
 * заложено в сборку и может отобразиться мгновенно, без единого запроса в сеть.
 *
 * Теперь SDK подгружается уже после первого показа страницы, и синхронизация с
 * облаком просто «догоняет» открытое меню.
 */

type FirestoreModule = typeof import('firebase/firestore');

export interface FirestoreApi extends FirestoreModule {
  db: import('firebase/firestore').Firestore;
}

let apiPromise: Promise<FirestoreApi> | null = null;

export function getFirestoreApi(): Promise<FirestoreApi> {
  if (!apiPromise) {
    apiPromise = Promise.all([import('./firebase'), import('firebase/firestore')]).then(
      ([{ db }, firestore]) => ({ ...firestore, db })
    );
    apiPromise.catch(() => {
      // Неудачную попытку не кешируем — следующая может пройти успешно.
      apiPromise = null;
    });
  }
  return apiPromise;
}
