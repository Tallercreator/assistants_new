import type { AssistantDraft, DraftErrors } from "./assistant-fields";
import type { Period } from "./period-field";
import { employees } from "./my-assistants-fixtures";
import {
  makeRights,
  type Assistant,
  type AssistantRole,
} from "./my-assistants-model";

export const employeeOf = (assistant: Assistant) =>
  employees.find((e) => e.id === assistant.employeeId);

export const toDraft = ({ end, indefinite, name, rights, start }: Assistant): AssistantDraft => ({
  end,
  indefinite,
  name,
  rights,
  start,
});

const time = (date: Date | null) => date?.getTime() ?? null;
export const sameDraft = (a: AssistantDraft, b: AssistantDraft) =>
  a.name === b.name &&
  a.indefinite === b.indefinite &&
  time(a.start) === time(b.start) &&
  time(a.end) === time(b.end) &&
  JSON.stringify(a.rights) === JSON.stringify(b.rights);

export function validate(draft: AssistantDraft): DraftErrors {
  const errors: DraftErrors = {};
  if (!draft.name.trim()) errors.name = "Введи название ассистента.";
  if (!draft.start || (!draft.indefinite && !draft.end)) {
    errors.period = draft.indefinite ? "Укажи дату начала." : "Укажи начало и окончание срока.";
  } else if (!draft.indefinite && draft.end && draft.end < draft.start) {
    errors.period = "Дата окончания раньше даты начала.";
  }
  return errors;
}

/** Новый ассистент (макет 41301:170760): все доступные права включены, срок пустой, до сохранения — «На активации». */
export function newAssistant(employeeId: number, role: AssistantRole): Assistant {
  return {
    id: `assistant-${employeeId}-${Date.now()}`,
    employeeId,
    name: "",
    start: null,
    end: null,
    indefinite: false,
    paused: false,
    pending: true,
    rights: makeRights(role, true),
  };
}

/** Пауза: срок прав заканчивается сегодня, исходный срок запоминаем для возобновления. */
export const pausedCopy = (assistant: Assistant, today: Date): Assistant => ({
  ...assistant,
  paused: true,
  pausedAt: today,
  beforePause: { end: assistant.end, indefinite: assistant.indefinite },
  end: today,
  indefinite: false,
});

/** Возобновление с новым сроком из окна; права остаются прежними. */
export const resumedCopy = (assistant: Assistant, period: Period): Assistant => ({
  ...assistant,
  ...period,
  paused: false,
  pausedAt: undefined,
  beforePause: undefined,
});
