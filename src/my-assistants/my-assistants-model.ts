// Модель полномочий «Мои ассистенты» перенесена из прототипа v25 (таблица «Набор возможных прав» БТ).
// Роль ассистента определяется уровнем руководителя и скрыта от пользователя: в демо её меняет модератор.

import {
  requestGroups,
  type AssistantRole,
  type RightColumn,
  type Rights,
} from "./my-assistants-rights";

export {
  columns,
  requestGroups,
  type AssistantRole,
  type RightColumn,
  type Rights,
} from "./my-assistants-rights";

const COLUMNS: RightColumn[] = [0, 1];

const SMT_ONLY = "Доступно только ассистенту руководителя уровня SMT";
const stageName = (j: RightColumn) => (j ? "согласования" : "заведения");

export function isAvailable(role: AssistantRole, i: number, k: number, j: RightColumn) {
  return Boolean(requestGroups[i].types[k][role][j]);
}

export function isViewAuto(role: AssistantRole, i: number, k: number) {
  const view = requestGroups[i].types[k].view;
  return view === "both" || (view === "smt" && role === "smt");
}

function isSmtOnly(i: number, k: number, j: RightColumn) {
  const type = requestGroups[i].types[k];
  return Boolean(type.smt[j]) && !type.assistant[j];
}

function hasNoStage(i: number, k: number, j: RightColumn) {
  const type = requestGroups[i].types[k];
  const other = j === 0 ? 1 : 0;
  return (
    !type.smt[j] &&
    !type.assistant[j] &&
    (Boolean(type.smt[other]) || Boolean(type.assistant[other]) || Boolean(type.view))
  );
}

export function unavailableReason(i: number, k: number, j: RightColumn) {
  if (isSmtOnly(i, k, j)) return SMT_ONLY;
  if (hasNoStage(i, k, j)) return `В заявке нет этапа ${stageName(j)}`;
  return "Нельзя выдать ассистенту полномочия";
}

export function groupUnavailableReason(i: number, j: RightColumn) {
  const types = requestGroups[i].types;
  if (types.some((_, k) => isSmtOnly(i, k, j))) return SMT_ONLY;
  if (types.some((_, k) => hasNoStage(i, k, j)))
    return `В заявках группы нет этапа ${stageName(j)}`;
  return "Нельзя выдать ассистенту полномочия";
}

export function isGroupAvailable(role: AssistantRole, i: number, j: RightColumn) {
  return requestGroups[i].types.some((_, k) => isAvailable(role, i, k, j));
}

/** Столбцы матрицы: столбец без единого доступного права у роли не показываем. */
export function visibleColumns(role: AssistantRole) {
  return COLUMNS.filter((j) => requestGroups.some((_, i) => isGroupAvailable(role, i, j)));
}

export function isGroupVisible(role: AssistantRole, i: number) {
  return (
    isGroupAvailable(role, i, 0) ||
    isGroupAvailable(role, i, 1) ||
    requestGroups[i].types.some((_, k) => isViewAuto(role, i, k))
  );
}

export function makeRights(role: AssistantRole, value: boolean): Rights {
  return requestGroups.map((group, i) =>
    group.types.map((_, k) => COLUMNS.map((j) => value && isAvailable(role, i, k, j))),
  );
}

export function countRights(role: AssistantRole, rights: Rights) {
  let enabled = 0;
  let total = 0;
  rights.forEach((group, i) =>
    group.forEach((row, k) =>
      COLUMNS.forEach((j) => {
        if (!isAvailable(role, i, k, j)) return;
        total += 1;
        if (row[j]) enabled += 1;
      }),
    ),
  );
  return { enabled, total };
}

/** Состояние переключателя группы или колонки: все, часть или ни одного доступного права. */
export function cellsState(cells: boolean[]) {
  const enabled = cells.filter(Boolean).length;
  return { all: cells.length > 0 && enabled === cells.length, some: enabled > 0, enabled };
}

export function groupCells(role: AssistantRole, rights: Rights, i: number, j: RightColumn) {
  return rights[i].filter((_, k) => isAvailable(role, i, k, j)).map((row) => row[j]);
}

export function columnCells(role: AssistantRole, rights: Rights, j: RightColumn) {
  return rights.flatMap((_, i) => groupCells(role, rights, i, j));
}

export function setCell(
  rights: Rights,
  i: number,
  k: number,
  j: RightColumn,
  value: boolean,
): Rights {
  return rights.map((group, gi) =>
    group.map((row, rk) => (gi === i && rk === k ? row.map((v, c) => (c === j ? value : v)) : row)),
  );
}

export function setGroup(
  role: AssistantRole,
  rights: Rights,
  i: number,
  j: RightColumn,
  value: boolean,
): Rights {
  return rights.map((group, gi) =>
    gi !== i
      ? group
      : group.map((row, k) =>
          row.map((v, c) => (c === j && isAvailable(role, i, k, j) ? value : v)),
        ),
  );
}

export function setColumn(
  role: AssistantRole,
  rights: Rights,
  j: RightColumn,
  value: boolean,
): Rights {
  return rights.map((group, i) =>
    group.map((row, k) => row.map((v, c) => (c === j && isAvailable(role, i, k, j) ? value : v))),
  );
}

export type Employee = {
  id: number;
  name: string;
  job: string;
  tab: string;
  department: string;
  status: string;
  /** Без фото показываются инициалы. */
  photo?: string;
  /** Дата увольнения: предупреждение в карточке списка и в превью профиля. */
  dismissal?: Date;
};

export type Assistant = {
  id: string;
  employeeId: number;
  /** Название ассистента в карточке и списке. */
  name: string;
  /** Пустые даты — у получателя дублированных полномочий, пока срок не задан. */
  start: Date | null;
  end: Date | null;
  indefinite: boolean;
  paused: boolean;
  /** День приостановки: с него срок прав заканчивается, бейдж в списке — «с …». */
  pausedAt?: Date;
  /** Срок до приостановки: из него окно возобновления берёт окончание по умолчанию. */
  beforePause?: { end: Date | null; indefinite: boolean };
  /** Добавлен, но полномочия ещё не сохранены. */
  pending?: boolean;
  rights: Rights;
};

export const formatDate = (date: Date) =>
  date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });

export function periodLabel({ end, indefinite, start }: Assistant) {
  if (!start) return "Не задан";
  if (indefinite || !end) return `${formatDate(start)} - бессрочно`;
  return `${formatDate(start)} - ${formatDate(end)}`;
}
