import { getApp, getApps, initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import type { FirebaseStorage } from 'firebase/storage';
import firebaseConfigData from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db: Firestore =
  firebaseConfigData.firestoreDatabaseId && firebaseConfigData.firestoreDatabaseId !== '(default)'
    ? getFirestore(app, firebaseConfigData.firestoreDatabaseId)
    : getFirestore(app);

export const hasStorageBucket = Boolean(firebaseConfigData.storageBucket);

/**
 * Firebase Storage подключается лениво: он нужен только владельцу в админке,
 * а его SDK весит около 30 КБ, которые незачем грузить обычному посетителю.
 */
let storagePromise: Promise<FirebaseStorage> | null = null;
export function getStorageLazy(): Promise<FirebaseStorage> {
  if (!storagePromise) {
    storagePromise = import('firebase/storage').then(({ getStorage }) => {
      const storage = getStorage(app);
      /*
        По умолчанию SDK повторяет неудачную загрузку две минуты. Если хранилище
        не настроено, владелец всё это время смотрит на крутящийся индикатор и
        считает, что фотографии не работают. Сокращаем ожидание: запасной путь
        (встроить фото в карточку) всё равно сработает.
      */
      storage.maxUploadRetryTime = 10_000;
      storage.maxOperationRetryTime = 10_000;
      return storage;
    });
  }
  return storagePromise;
}

export default app;
