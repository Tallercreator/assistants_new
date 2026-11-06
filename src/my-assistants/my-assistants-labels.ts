import { DEMO_TODAY } from "./my-assistants-fixtures";
import { formatDate, type Assistant, type Rights } from "./my-assistants-model";

/** Бейдж карточки в списке (макет 41301:171518): тон и текст по состоянию назначения. */
/** Русское множественное число: 1 право, 3 права, 5 прав. */
function plural(count: number, one: string, few: string, many: string) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

const DAY = 24 * 60 * 60 * 1000;
/** За сколько дней до окончания срока список предупреждает руководителя. */
const EXPIRY_WARNING_DAYS = 7;

/** «Истекает через 3 дня» для активного ассистента в последнюю неделю срока, иначе null. */
export function expiryWarning({ end, indefinite, paused, pending }: Assistant) {
  if (paused || pending || indefinite || !end) return null;
  const days = Math.round((end.getTime() - DEMO_TODAY.getTime()) / DAY);
  if (days < 0 || days > EXPIRY_WARNING_DAYS) return null;
  if (days === 0) return "Истекает сегодня";
  if (days === 1) return "Истекает завтра";
  return `Истекает через ${days} ${plural(days, "день", "дня", "дней")}`;
}

export function badge(assistant: Assistant): {
  label: string;
  status: "positive" | "neutral" | "process" | "attention";
} {
  const { end, indefinite, pausedAt, start } = assistant;
  if (assistant.pending || !start) return { label: "На активации", status: "process" };
  if (assistant.paused)
    return { label: `Приостановлен с ${formatDate(pausedAt ?? start)}`, status: "neutral" };
  const warning = expiryWarning(assistant);
  if (warning) return { label: warning, status: "attention" };
  const period =
    end && !indefinite ? `с ${formatDate(start)} до ${formatDate(end)}` : `с ${formatDate(start)}`;
  // Макет 41296:126243: «Активен …» — права уже действуют; срок в будущем — серый, без слова.
  if (start > DEMO_TODAY) return { label: period, status: "neutral" };
  return { label: `Активен ${period}`, status: "positive" };
}

/** Подпись в футере правки: сколько прав отличается от сохранённых. */
export function unsavedLabel(saved: Rights, draft: Rights) {
  const changed = saved.flat(2).filter((value, i) => value !== draft.flat(2)[i]).length;
  if (!changed) return "Есть несохранённые изменения";
  const word = plural(changed, "право", "права", "прав");
  return `Не сохранено: изменено ${changed} ${word}`;
}

/** «1 активный ассистент», «3 активных ассистента», «5 активных ассистентов». */
export function countLabel(count: number, kind: "активный" | "неактивный") {
  if (!count) return `Нет ${kind === "активный" ? "активных" : "неактивных"} ассистентов`;
  const stem = kind.slice(0, -2);
  return `${count} ${plural(count, `${kind} ассистент`, `${stem}ых ассистента`, `${stem}ых ассистентов`)}`;
}
