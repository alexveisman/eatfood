import React, { useState } from 'react';
import { Lock, KeyRound, AlertCircle, Check, X } from 'lucide-react';
import { verifyAdminPin } from '../utils/adminAuth';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);
    try {
      // Проверка асинхронная: PIN сверяется по хешу, а не по открытому тексту.
      if (await verifyAdminPin(pin)) {
        setError(false);
        setIsSuccess(true);
        setPin('');
        onSuccess();
      } else {
        setError(true);
        setPin('');
      }
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-stone-200 p-6 text-stone-900 text-center space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
          title="Закрыть"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-7 h-7" />
        </div>

        <div className="space-y-1">
          <h3 className="font-bold text-lg text-stone-900">
            Вход для владельца
          </h3>
          <p className="text-xs text-stone-500">
            Введите PIN-код для управления меню, ценами и фотографиями
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          <div className="relative">
            <input
              type="password"
              inputMode="numeric"
              maxLength={10}
              autoFocus
              placeholder="Введите PIN"
              value={pin}
              onChange={(e) => {
                setError(false);
                setPin(e.target.value);
              }}
              className="w-full text-center text-lg font-mono tracking-widest px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-600 bg-stone-50"
            />
            <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          {error && (
            <div className="p-2 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center justify-center gap-1.5 animate-shake">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Неверный PIN-код</span>
            </div>
          )}

          <button
            type="submit"
            disabled={pin.length === 0 || isChecking}
            className={`w-full py-3 rounded-2xl text-sm font-bold text-white shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 ${
              isSuccess
                ? 'bg-emerald-600'
                : pin.length > 0
                ? 'bg-amber-700 hover:bg-amber-800'
                : 'bg-stone-300 text-stone-500 cursor-not-allowed'
            }`}
          >
            {isSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Доступ разрешён!</span>
              </>
            ) : (
              <span>Войти в управление</span>
            )}
          </button>
        </form>

        <p className="text-[11px] text-stone-400 pt-1">
          Код можно изменить в панели: вкладка «Настройки».
        </p>
      </div>
    </div>
  );
};
