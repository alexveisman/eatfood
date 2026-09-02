/**
 * Вход владельца через Firebase Authentication.
 *
 * Зачем это нужно. Правила базы (firestore.rules) разрешают менять меню только
 * тому, кто вошёл под учётной записью владельца. PIN-код к этому отношения не
 * имеет: он проверяется в браузере и базе о нём ничего не известно. Без входа
 * по почте и паролю панель может сохранять правки только на текущем устройстве.
 *
 * SDK авторизации подключается лениво — обычному посетителю он не нужен.
 */

import type { User } from 'firebase/auth';

type AuthModule = typeof import('firebase/auth');

interface AuthApi extends AuthModule {
  auth: import('firebase/auth').Auth;
}

let apiPromise: Promise<AuthApi> | null = null;

function getAuthApi(): Promise<AuthApi> {
  if (!apiPromise) {
    apiPromise = Promise.all([import('./firebase'), import('firebase/auth')]).then(
      ([{ default: app }, authModule]) => ({ ...authModule, auth: authModule.getAuth(app) })
    );
    apiPromise.catch(() => {
      apiPromise = null;
    });
  }
  return apiPromise;
}

export interface OwnerAccount {
  email: string | null;
  uid: string;
}

function toOwner(user: User | null): OwnerAccount | null {
  return user ? { email: user.email, uid: user.uid } : null;
}

/** Понятные сообщения вместо кодов вида `auth/invalid-credential`. */
function describeAuthError(error: unknown): string {
  const code = typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : '';

  switch (code) {
    case 'auth/invalid-email':
      return 'Неверный формат почты.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Почта или пароль не подходят. Проверьте их в Firebase → Authentication → Users.';
    case 'auth/too-many-requests':
      return 'Слишком много попыток. Подождите пару минут и попробуйте снова.';
    case 'auth/network-request-failed':
      return 'Нет связи с сервером. Проверьте интернет.';
    case 'auth/operation-not-allowed':
      return 'В Firebase не включён вход по почте и паролю: Authentication → Sign-in method → Email/Password.';
    case 'auth/configuration-not-found':
      return 'В проекте Firebase не настроена авторизация. Откройте Authentication и нажмите «Начать».';
    default:
      return error instanceof Error ? error.message : 'Не удалось войти.';
  }
}

export async function signInOwner(email: string, password: string): Promise<OwnerAccount> {
  const { auth, signInWithEmailAndPassword } = await getAuthApi();
  try {
    const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    return toOwner(credential.user) as OwnerAccount;
  } catch (error) {
    throw new Error(describeAuthError(error));
  }
}

export async function signOutOwner(): Promise<void> {
  try {
    const { auth, signOut } = await getAuthApi();
    await signOut(auth);
  } catch (error) {
    console.warn('Не удалось выйти из учётной записи:', error);
  }
}

/**
 * Следит за состоянием входа. Firebase сам запоминает сессию между визитами,
 * поэтому повторно вводить пароль каждый раз не придётся.
 */
export function watchOwner(callback: (owner: OwnerAccount | null) => void): () => void {
  let cancelled = false;
  let unsubscribe = () => {};

  getAuthApi()
    .then(({ auth, onAuthStateChanged }) => {
      if (cancelled) return;
      unsubscribe = onAuthStateChanged(auth, (user) => callback(toOwner(user)));
    })
    .catch((error) => {
      console.warn('Авторизация Firebase недоступна:', error);
      callback(null);
    });

  return () => {
    cancelled = true;
    unsubscribe();
  };
}
