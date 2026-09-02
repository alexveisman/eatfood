import React from 'react';
import { AlertTriangle, Check, CloudOff, Loader2 } from 'lucide-react';
import type { SaveResult } from '../../services/productService';

/**
 * Сообщение о результате операции.
 *
 * Здесь важен средний случай: изменение сохранилось на этом устройстве, но не доехало
 * до облака. Раньше такие ситуации молча писались в консоль, и владелец был уверен,
 * что покупатели уже видят новое фото. Теперь об этом сообщается прямо в панели.
 */
export type StatusTone = 'success' | 'warning' | 'error' | 'progress';

export interface AdminStatus {
  tone: StatusTone;
  message: string;
}

export function statusFromResult(result: SaveResult, successMessage: string): AdminStatus {
  if (result.syncedToCloud) {
    return { tone: 'success', message: successMessage };
  }
  if (result.savedLocally) {
    return {
      tone: 'warning',
      message: `${successMessage} Но изменения пока видны только на этом устройстве. ${
        result.error ?? ''
      }`.trim(),
    };
  }
  return {
    tone: 'error',
    message: result.error ?? 'Не удалось сохранить изменения.',
  };
}

const TONE_STYLES: Record<StatusTone, { box: string; icon: React.ReactNode }> = {
  success: {
    box: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    icon: <Check className="w-4 h-4 shrink-0 text-emerald-600" />,
  },
  warning: {
    box: 'bg-amber-50 border-amber-300 text-amber-900',
    icon: <CloudOff className="w-4 h-4 shrink-0 text-amber-600" />,
  },
  error: {
    box: 'bg-red-50 border-red-200 text-red-900',
    icon: <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />,
  },
  progress: {
    box: 'bg-stone-50 border-stone-200 text-stone-700',
    icon: <Loader2 className="w-4 h-4 shrink-0 animate-spin text-stone-500" />,
  },
};

export const StatusBanner: React.FC<{ status: AdminStatus | null; onDismiss?: () => void }> = ({
  status,
  onDismiss,
}) => {
  if (!status) return null;
  const style = TONE_STYLES[status.tone];
  return (
    <div
      role="status"
      className={`flex items-start gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium leading-relaxed ${style.box}`}
    >
      {style.icon}
      <span className="flex-1 break-words">{status.message}</span>
      {onDismiss && status.tone !== 'progress' && (
        <button
          onClick={onDismiss}
          className="shrink-0 underline underline-offset-2 opacity-70 hover:opacity-100"
        >
          скрыть
        </button>
      )}
    </div>
  );
};

/** Поле формы с подписью и пояснением — чтобы владелец понимал, на что влияет значение. */
export const Field: React.FC<{
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ label, hint, children, className = '' }) => (
  <label className={`block space-y-1 ${className}`}>
    <span className="text-xs font-bold text-stone-700">{label}</span>
    {children}
    {hint && <span className="block text-[11px] text-stone-500 leading-snug">{hint}</span>}
  </label>
);

/** Единый вид полей ввода: высота 44px удобна для пальца на телефоне. */
export const inputClass =
  'w-full min-h-11 px-3 py-2 rounded-xl border border-stone-300 bg-white text-sm text-stone-900 ' +
  'focus:outline-none focus:ring-2 focus:ring-amber-600/50 focus:border-amber-600 transition-shadow';

export const textareaClass =
  'w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-sm text-stone-900 leading-relaxed ' +
  'focus:outline-none focus:ring-2 focus:ring-amber-600/50 focus:border-amber-600 transition-shadow';

export const Toggle: React.FC<{
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  hint?: string;
}> = ({ checked, onChange, label, hint }) => (
  <label className="flex items-start gap-2.5 p-3 rounded-xl border border-stone-200 bg-white cursor-pointer hover:border-amber-300 transition-colors">
    <input
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      className="mt-0.5 w-5 h-5 accent-amber-700 shrink-0 cursor-pointer"
    />
    <span className="min-w-0">
      <span className="block text-xs font-bold text-stone-800">{label}</span>
      {hint && <span className="block text-[11px] text-stone-500 leading-snug">{hint}</span>}
    </span>
  </label>
);
