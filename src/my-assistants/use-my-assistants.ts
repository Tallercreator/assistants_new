import { useState } from "react";

import type { AssistantDraft, DraftErrors } from "./assistant-fields";
import { DEMO_TODAY, seedAssistants } from "./my-assistants-fixtures";
import {
  newAssistant,
  pausedCopy,
  resumedCopy,
  sameDraft,
  toDraft,
  validate,
} from "./my-assistants-draft";
import type { Assistant, AssistantRole } from "./my-assistants-model";
import { notify, notifyWithUndo } from "./my-assistants-toasts";
import type { Period } from "./period-field";

type Confirm =
  | { kind: "pause" | "delete" | "resume"; assistant: Assistant }
  /** Выход из карточки с несохранёнными изменениями (макет 41301:173563); run — куда шли. */
  | { kind: "unsaved"; run: () => void }
  | null;

/** Состояние демо: список ассистентов, черновик открытой карточки и действия над ними. */
export function useMyAssistants(role: AssistantRole, initialState: "empty" | "saved") {
  const [assistants, setAssistants] = useState<Assistant[]>(() =>
    initialState === "saved" ? seedAssistants(role) : [],
  );
  const [selectedId, setSelectedId] = useState<string | null>(() => assistants[0]?.id ?? null);
  const selected = assistants.find((a) => a.id === selectedId) ?? null;
  const [draft, setDraft] = useState<AssistantDraft | null>(() =>
    selected ? toDraft(selected) : null,
  );
  const [fieldEditing, setFieldEditing] = useState(false);
  const [errors, setErrors] = useState<DraftErrors>({});
  const [confirm, setConfirm] = useState<Confirm>(null);

  const dirty =
    selected && draft ? Boolean(selected.pending) || !sameDraft(draft, toDraft(selected)) : false;

  const open = (next: Assistant | null, editing = false) => {
    setSelectedId(next?.id ?? null);
    setDraft(next ? toDraft(next) : null);
    setFieldEditing(editing);
    setErrors({});
  };
  const replace = (next: Assistant) =>
    setAssistants((list) => list.map((a) => (a.id === next.id ? next : a)));

  /** Действие, уводящее из карточки: при несохранённых изменениях сначала спрашиваем. */
  const guard = (run: () => void) => {
    if (dirty) setConfirm({ kind: "unsaved", run });
    else run();
  };

  const select = (id: string) => {
    const next = assistants.find((a) => a.id === id);
    if (id !== selectedId && next) guard(() => open(next, Boolean(next.pending)));
  };

  const add = (employeeId: number) => {
    const assistant = newAssistant(employeeId, role);
    setAssistants((list) => [...list.filter((a) => !a.pending || a.id !== selectedId), assistant]);
    open(assistant, true);
  };

  /** Копирует сохранённые права и название; новым получателям — пустой срок и «На активации». */
  const duplicate = (employeeIds: number[]) => {
    if (!selected) return;
    const created: Assistant[] = [];
    const list = assistants.map((a) =>
      employeeIds.includes(a.employeeId) ? { ...a, rights: selected.rights } : a,
    );
    for (const employeeId of employeeIds) {
      if (list.some((a) => a.employeeId === employeeId)) continue;
      created.push({
        ...newAssistant(employeeId, role),
        name: selected.name,
        start: null,
        end: null,
        rights: selected.rights,
      });
    }
    setAssistants([...list, ...created]);
    if (created[0]) open(created[0], true);
    notify(`Полномочия скопированы: ${employeeIds.length}`);
  };

  /** Сохраняет черновик; false — есть ошибки в полях. */
  const save = () => {
    if (!selected || !draft) return false;
    const nextErrors = fieldEditing ? validate(draft) : {};
    setErrors(nextErrors);
    if (nextErrors.name || nextErrors.period) {
      setFieldEditing(true);
      return false;
    }
    const saved: Assistant = { ...selected, ...draft, pending: false };
    replace(saved);
    open(saved);
    notify(selected.pending ? "Полномочия выданы" : "Изменения сохранены");
    return true;
  };

  const cancel = () => {
    if (!selected) return;
    if (!selected.pending) {
      open(selected);
      return;
    }
    const rest = assistants.filter((a) => a.id !== selected.id);
    setAssistants(rest);
    open(rest[0] ?? null, Boolean(rest[0]?.pending));
  };

  /** Приостановка: срок прав заканчивается сегодня, назначение уходит в «Приостановлены». */
  const pause = (assistant: Assistant) => {
    const paused = pausedCopy(assistant, DEMO_TODAY);
    replace(paused);
    if (assistant.id === selectedId) open(paused);
    notify("Ассистент приостановлен");
  };

  /** Удаление с «Вернуть» в тосте: ассистент встаёт на прежнее место со всеми правами. */
  const remove = (assistant: Assistant) => {
    const index = assistants.findIndex((a) => a.id === assistant.id);
    const wasSelected = assistant.id === selectedId;
    const rest = assistants.filter((a) => a.id !== assistant.id);
    setAssistants(rest);
    if (wasSelected) open(rest[0] ?? null, Boolean(rest[0]?.pending));
    notifyWithUndo("Ассистент удалён", () => {
      setAssistants((list) => [...list.slice(0, index), assistant, ...list.slice(index)]);
      if (wasSelected) open(assistant);
    });
  };

  const applyConfirm = () => {
    if (!confirm) return;
    setConfirm(null);
    if (confirm.kind === "delete") remove(confirm.assistant);
    if (confirm.kind === "pause") pause(confirm.assistant);
    if (confirm.kind === "unsaved" && save()) confirm.run();
  };

  /** Вторая кнопка подтверждения: «Выйти без сохранения» или «Приостановить» вместо удаления. */
  const applySecondary = () => {
    if (!confirm) return;
    setConfirm(null);
    if (confirm.kind === "delete") pause(confirm.assistant);
    if (confirm.kind === "unsaved") {
      cancel();
      confirm.run();
    }
  };

  /** Пауза — через подтверждение, возобновление — через окно выбора нового срока. */
  const togglePause = () => {
    if (!selected) return;
    setConfirm({ kind: selected.paused ? "resume" : "pause", assistant: selected });
  };

  /** Права остаются прежними; действуют только после подтверждения срока в окне. */
  const resume = (period: Period) => {
    if (confirm?.kind !== "resume") return;
    const resumed = resumedCopy(confirm.assistant, period);
    setConfirm(null);
    replace(resumed);
    if (resumed.id === selectedId) open(resumed);
    notify("Полномочия возобновлены");
  };

  return {
    actions: {
      add,
      applyConfirm,
      applySecondary,
      cancel,
      duplicate,
      guard,
      resume,
      save,
      select,
      setConfirm,
      setDraft,
      togglePause,
    },
    assistants,
    confirm,
    dirty,
    draft,
    errors,
    fieldEditing,
    selected,
    startEditing: () => setFieldEditing(true),
  };
}
