/**
 * Доступ к панели владельца.
 *
 * Важно понимать границы этой защиты: код сайта выполняется в браузере посетителя,
 * поэтому PIN-код — это замок на двери панели, а не защита самих данных. Реально
 * ограничить запись в базу могут только правила Firestore (см. firestore.rules)
 * и вход через Firebase Authentication. PIN здесь для того, чтобы случайный
 * посетитель не открыл панель, увидев ссылку #admin.
 *
 * По сравнению с прежней версией: PIN хранится не открытым текстом, а хешем,
 * и сессия администратора сама истекает через 12 часов.
 */

const PIN_HASH_KEY = 'homebakery_admin_pin_hash';
const SESSION_KEY = 'homebakery_admin_session';
const DEFAULT_PIN = '2026';
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
/** Соль не делает хеш секретным, но мешает узнать PIN по готовым радужным таблицам. */
const SALT = 'homebakery::admin::v1';

interface AdminSession {
  expiresAt: number;
}

async function hashPin(pin: string): Promise<string> {
  const data = new TextEncoder().encode(`${SALT}:${pin.trim()}`);

  // crypto.subtle доступен только в защищённом контексте (https или localhost).
  if (globalThis.crypto?.subtle) {
    const digest = await globalThis.crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  // Запасной путь для http-окружений: слабее, но лучше, чем хранить PIN открытым текстом.
  let hash = 0;
  for (const byte of data) {
    hash = (hash * 31 + byte) | 0;
  }
  return `weak-${(hash >>> 0).toString(16)}`;
}

function readStoredHash(): string | null {
  try {
    return localStorage.getItem(PIN_HASH_KEY);
  } catch {
    return null;
  }
}

/** Установлен ли собственный PIN, или всё ещё действует стандартный. */
export function isUsingDefaultPin(): boolean {
  return readStoredHash() === null;
}

export async function setAdminPin(newPin: string): Promise<void> {
  const trimmed = newPin.trim();
  if (trimmed.length < 4) {
    throw new Error('PIN должен состоять минимум из 4 символов.');
  }
  try {
    localStorage.setItem(PIN_HASH_KEY, await hashPin(trimmed));
  } catch (error) {
    throw new Error(`Не удалось сохранить PIN: ${error instanceof Error ? error.message : 'ошибка хранилища'}`);
  }
}

export async function verifyAdminPin(enteredPin: string): Promise<boolean> {
  const storedHash = readStoredHash();
  const expectedHash = storedHash ?? (await hashPin(DEFAULT_PIN));
  const isValid = (await hashPin(enteredPin)) === expectedHash;

  if (isValid) {
    try {
      const session: AdminSession = { expiresAt: Date.now() + SESSION_TTL_MS };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {
      // Без сохранённой сессии панель просто спросит PIN снова.
    }
  }
  return isValid;
}

export function isAdminAuthenticated(): boolean {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const session = JSON.parse(raw) as AdminSession;
    if (typeof session.expiresAt !== 'number' || Date.now() > session.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function logoutAdmin(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
    if (window.location.hash.toLowerCase() === '#admin') {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  } catch (error) {
    console.error('Не удалось выйти из панели:', error);
  }
}
