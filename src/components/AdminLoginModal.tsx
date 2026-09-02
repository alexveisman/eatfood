import React, { useState } from 'react';
import { AlertCircle, Check, KeyRound, Loader2, Lock, Mail, X } from 'lucide-react';
import { signInOwner } from '../lib/firebaseAuthLazy';
import { verifyAdminPin } from '../utils/adminAuth';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** cloudSignedIn = вход через Firebase: правки увидят покупатели. */
  onSuccess: (cloudSignedIn: boolean) => void;
}

type Mode = 'cloud' | 'local';

/**
 * Вход в панель владельца.
 *
 * Основной способ — почта и пароль учётной записи Firebase. Только он даёт право
 * менять меню для всех посетителей: правила базы проверяют именно его.
 *
 * Запасной способ — PIN. Он открывает панель, но правки сохранятся только в этом
 * браузере. Нужен, пока владелец не завёл учётную запись, и панель об этом прямо
 * предупреждает, а не делает вид, что всё сохранено.
 */
export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<Mode>('cloud');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCloudSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsBusy(true);
    setError(null);
    try {
      await signInOwner(email, password);
      // Локальную сессию тоже отмечаем, чтобы кнопка панели осталась после перезагрузки.
      await verifyAdminPin(pin, { skipCheck: true });
      setIsSuccess(true);
      setPassword('');
      onSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось войти.');
    } finally {
      setIsBusy(false);
    }
  };

  const handlePinSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsBusy(true);
    setError(null);
    try {
      if (await verifyAdminPin(pin)) {
        setIsSuccess(true);
        setPin('');
        onSuccess(false);
      } else {
        setError('Неверный PIN-код.');
        setPin('');
      }
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-stone-200 p-6 text-stone-900 space-y-4">
        <button
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-lg text-stone-900">Вход для владельца</h3>
        </div>

        {mode === 'cloud' ? (
          <form onSubmit={handleCloudSubmit} className="space-y-3">
            <p className="text-xs text-stone-500 leading-relaxed text-center">
              Почта и пароль учётной записи, которую вы завели в Firebase. Только этот вход
              позволяет менять меню для всех посетителей сайта.
            </p>

            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                autoComplete="username"
                required
                autoFocus
                placeholder="Почта"
                value={email}
                onChange={(event) => {
                  setError(null);
                  setEmail(event.target.value);
                }}
                className="w-full min-h-12 pl-10 pr-4 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-600 bg-stone-50 text-sm"
              />
            </div>

            <div className="relative">
              <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                autoComplete="current-password"
                required
                placeholder="Пароль"
                value={password}
                onChange={(event) => {
                  setError(null);
                  setPassword(event.target.value);
                }}
                className="w-full min-h-12 pl-10 pr-4 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-600 bg-stone-50 text-sm"
              />
            </div>

            {error && (
              <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-start gap-1.5 leading-relaxed">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isBusy || !email || !password}
              className={`w-full min-h-12 rounded-2xl text-sm font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 ${
                isSuccess ? 'bg-emerald-600' : 'bg-amber-700 hover:bg-amber-800 disabled:opacity-50'
              }`}
            >
              {isBusy ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isSuccess ? (
                <Check className="w-4 h-4" />
              ) : null}
              <span>{isSuccess ? 'Вход выполнен' : 'Войти'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('local');
                setError(null);
              }}
              className="w-full text-[11px] text-stone-400 hover:text-stone-600 underline underline-offset-2"
            >
              Учётной записи ещё нет — войти по PIN
            </button>
          </form>
        ) : (
          <form onSubmit={handlePinSubmit} className="space-y-3">
            <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-xl text-[11px] text-amber-900 leading-relaxed">
              Вход по PIN открывает панель, но изменения сохранятся{' '}
              <strong>только в этом браузере</strong>. Покупатели их не увидят, пока вы не
              войдёте по почте и паролю.
            </div>

            <div className="relative">
              <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                inputMode="numeric"
                maxLength={20}
                autoFocus
                required
                placeholder="PIN"
                value={pin}
                onChange={(event) => {
                  setError(null);
                  setPin(event.target.value);
                }}
                className="w-full min-h-12 pl-10 pr-4 text-center font-mono tracking-widest rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-600 bg-stone-50"
              />
            </div>

            {error && (
              <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isBusy || pin.length === 0}
              className="w-full min-h-12 rounded-2xl bg-stone-700 hover:bg-stone-800 disabled:opacity-50 text-sm font-bold text-white transition-colors"
            >
              Открыть панель на этом устройстве
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('cloud');
                setError(null);
              }}
              className="w-full text-[11px] text-stone-400 hover:text-stone-600 underline underline-offset-2"
            >
              Назад к входу по почте
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
