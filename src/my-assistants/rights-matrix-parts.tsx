import type { ComponentType, SVGProps } from "react";

import { AirplaneLine24Icon } from "@otp/space-ui-kit/icons/airplane-line-24";
import { CalendarLine24Icon } from "@otp/space-ui-kit/icons/calendar-line-24";
import { ChevronDownLine16Icon } from "@otp/space-ui-kit/icons/chevron-down-line-16";
import { DocumentLine24Icon } from "@otp/space-ui-kit/icons/document-line-24";
import { HeartPharmacyLine24Icon } from "@otp/space-ui-kit/icons/heart-pharmacy-line-24";
import { UserLine24Icon } from "@otp/space-ui-kit/icons/user-line-24";
import { Toggle } from "@otp/space-ui-kit/toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@otp/space-ui-kit/tooltip";
import { Typography } from "@otp/space-ui-kit/typography";
import {
  cellsState,
  columns,
  groupCells,
  groupUnavailableReason,
  isGroupAvailable,
  requestGroups,
  setGroup,
  type AssistantRole,
  type RightColumn,
  type Rights,
} from "./my-assistants-model";
import { cn } from "./utils";

/** Строки на линиях (макет 41273:109662): отступ 12 по горизонтали, 8 + 12 до разделителя по вертикали. */
export const cellClassName =
  "border-b border-base-border-standard-neutral-light-normal px-spacing-xs py-spacing-xl align-middle sm:px-spacing-lg sm:py-spacing-xxl";

/** Иконки групп в порядке requestGroups. */
const GROUP_ICONS: ComponentType<SVGProps<SVGSVGElement>>[] = [
  UserLine24Icon,
  CalendarLine24Icon,
  DocumentLine24Icon,
  HeartPharmacyLine24Icon,
  AirplaneLine24Icon,
];

type LockedToggleProps = { checked: boolean; label: string; reason: string };

/**
 * Недоступное право: выключенный тоггл с причиной в имени и в подсказке при наведении.
 * Обёртка не фокусируется: вложенный фокусируемый контейнер у switch запрещён axe,
 * а для скринридера причина уже входит в имя самого тоггла.
 */
export function LockedToggle({ checked, label, reason }: LockedToggleProps) {
  return (
    <Tooltip>
      <TooltipTrigger render={<span className="inline-flex cursor-not-allowed" />}>
        <Toggle aria-label={`${label} — ${reason}`} checked={checked} disabled tone="lime" />
      </TooltipTrigger>
      <TooltipContent side="top" tone="lighter">
        {reason}
      </TooltipContent>
    </Tooltip>
  );
}

export type RowsProps = {
  group: number;
  role: AssistantRole;
  rights: Rights;
  onChange: (rights: Rights) => void;
  /** Пауза: переключатели показывают выданные права, но не меняются. */
  disabled?: boolean;
  /** Показанные столбцы: пустой у роли столбец скрыт целиком. */
  visible: RightColumn[];
};

type GroupRowProps = RowsProps & { open: boolean; panelId: string; onToggle: () => void };

/** Строка группы: иконка, название и стрелка в первой колонке, переключатели группы в остальных. */
export function GroupRow({
  disabled,
  group: i,
  onChange,
  onToggle,
  open,
  panelId,
  rights,
  role,
  visible,
}: GroupRowProps) {
  const group = requestGroups[i];
  const Icon = GROUP_ICONS[i];
  return (
    <tr>
      <th className={cn(cellClassName, "text-left font-font-weight-regular")} scope="rowgroup">
        {group.expandable === false ? (
          // Права на группу выдаются сразу на все заявки — раскрывать нечего.
          <span className="flex w-full items-center gap-spacing-lg text-base-texticons-secondary">
            <Icon aria-hidden="true" className="hidden size-size-mxl shrink-0 sm:block" />
            <Typography.Body.TwoM color="secondary">{group.title}</Typography.Body.TwoM>
          </span>
        ) : (
          <button
            aria-controls={panelId}
            aria-expanded={open}
            className="m-[0px] flex w-full cursor-pointer appearance-none items-center gap-spacing-lg rounded-radius-xs border-none bg-transparent p-[0px] text-left text-base-texticons-secondary outline-none focus-visible:ring-(length:--ui-stroke-focus) focus-visible:ring-ring/50"
            onClick={onToggle}
            type="button"
          >
            <Icon aria-hidden="true" className="hidden size-size-mxl shrink-0 sm:block" />
            <Typography.Body.TwoM className="flex-1" color="secondary">
              {group.title}
            </Typography.Body.TwoM>
            <ChevronDownLine16Icon
              aria-hidden="true"
              className={cn("shrink-0 ui-transition-transform", open && "rotate-180")}
            />
          </button>
        )}
      </th>
      {visible.map((j) => {
        const cells = groupCells(role, rights, i, j);
        const state = cellsState(cells);
        return (
          <td key={j} className={cn(cellClassName, "text-center")}>
            {isGroupAvailable(role, i, j) ? (
              <span className="inline-flex flex-col items-center gap-spacing-xxs">
                <Toggle
                  aria-label={`${group.title}: все заявки, ${columns[j].label}`}
                  checked={state.all}
                  disabled={disabled}
                  onCheckedChange={(value) => onChange(setGroup(role, rights, i, j, value))}
                  tone="lime"
                />
                {state.some && !state.all ? (
                  <Typography.Caption.OneR color="tertiary">
                    {state.enabled}/{cells.length}
                  </Typography.Caption.OneR>
                ) : null}
              </span>
            ) : (
              <LockedToggle
                checked={false}
                label={`${group.title}: ${columns[j].label}`}
                reason={groupUnavailableReason(i, j)}
              />
            )}
          </td>
        );
      })}
    </tr>
  );
}
