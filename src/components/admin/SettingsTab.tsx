import React, { useState } from 'react';
import { KeyRound, RotateCcw, ShieldAlert } from 'lucide-react';
import { isUsingDefaultPin, setAdminPin, verifyAdminPin } from '../../utils/adminAuth';
import { Field, inputClass, StatusBanner, type AdminStatus } from './adminShared';

interface SettingsTabProps {
  onResetCatalog: () => Promise<void>;
  isSaving: boolean;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ onResetCatalog, isSaving }) => {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [status, setStatus] = useState<AdminStatus | null>(null);
  const [usingDefault, setUsingDefault] = useState(() => isUsingDefaultPin());

  const handleChangePin = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus(null);

    if (!(await verifyAdminPin(currentPin))) {
      setStatus({ tone: 'error', message: 'Текущий PIN введён неверно.' });
      return;
    }
    try {
      await setAdminPin(newPin);
      setCurrentPin('');
      setNewPin('');
      setUsingDefault(false);
      setStatus({ tone: 'success', message: 'PIN изменён. Он сохранён только в этом браузере.' });
    } catch (error) {
      setStatus({ tone: 'error', message: error instanceof Error ? error.message : 'Не удалось сменить PIN.' });
    }
  };

  return (
    <div className="space-y-4">
      {usingDefault && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900">
          <ShieldAlert className="w-5 h-5 shrink-0 text-amber-700" />
          <div className="text-xs leading-relaxed">
            <p className="font-bold">Используется стандартный PIN</p>
            <p>Смените его ниже — иначе панель откроется у любого, кто знает код по умолчанию.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleChangePin} className="p-4 rounded-2xl bg-white border border-stone-200 space-y-3">
        <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-amber-700" />
          Смена PIN-кода
        </h3>

        <Field label="Текущий PIN">
          <input
            type="password"
            inputMode="numeric"
            autoComplete="current-password"
            value={currentPin}
            onChange={(event) => setCurrentPin(event.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Новый PIN" hint="Минимум 4 символа.">
          <input
            type="password"
            inputMode="numeric"
            autoComplete="new-password"
            value={newPin}
            onChange={(event) => setNewPin(event.target.value)}
            className={inputClass}
          />
        </Field>

        <StatusBanner status={status} onDismiss={() => setStatus(null)} />

        <button
          type="submit"
          disabled={!currentPin || newPin.length < 4}
          className="w-full min-h-11 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white text-sm font-bold transition-colors"
        >
          Сохранить новый PIN
        </button>
      </form>

      <section className="p-4 rounded-2xl bg-stone-100 border border-stone-200 space-y-2">
        <h3 className="text-sm font-black text-stone-900">Два разных входа — зачем</h3>
        <ul className="text-xs text-stone-600 leading-relaxed space-y-1.5 list-disc pl-4">
          <li>
            <strong>Почта и пароль</strong> — настоящий вход. Только он даёт право менять меню
            для всех посетителей: база проверяет именно его. Учётная запись заводится один раз
            в Firebase, шаги описаны в <code>docs/НАСТРОЙКА.md</code>.
          </li>
          <li>
            <strong>PIN</strong> — просто замок на двери панели, база о нём ничего не знает.
            Правки в этом режиме остаются в текущем браузере.
          </li>
          <li>Сессия панели истекает через 12 часов.</li>
        </ul>
      </section>

      <section className="p-4 rounded-2xl bg-white border border-red-200 space-y-2.5">
        <h3 className="text-sm font-black text-red-900 flex items-center gap-2">
          <RotateCcw className="w-4 h-4" />
          Вернуть исходное меню
        </h3>
        <p className="text-xs text-stone-600 leading-relaxed">
          Удалит все ваши правки — блюда, цены и загруженные фото — и вернёт меню к тому виду,
          который заложен в код сайта. Отменить это нельзя.
        </p>
        <button
          type="button"
          disabled={isSaving}
          onClick={() => {
            if (confirm('Удалить все правки и вернуть исходное меню? Это действие необратимо.')) {
              onResetCatalog();
            }
          }}
          className="w-full min-h-11 px-4 rounded-xl border border-red-300 bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-800 text-sm font-bold transition-colors"
        >
          Сбросить меню к исходному
        </button>
      </section>
    </div>
  );
};
