import type { ReactNode } from "react";

import { Typography } from "@otp/space-ui-kit/typography";
import {
  columns,
  isAvailable,
  isViewAuto,
  requestGroups,
  setCell,
  unavailableReason,
} from "./my-assistants-model";
import { LockedControl, RightControl } from "./right-control";
import type { RowsProps } from "./rights-matrix-parts";
import { cn } from "./utils";

/** Анимация строк заявок: высота 0fr → 1fr у обёртки, тайминги раскрытия как у Accordion кита. */
const revealClassName =
  "grid transition-[grid-template-rows,opacity] duration-motion-duration-expand ease-motion-easing-out motion-reduce:transition-none";
const cellPadding = "px-spacing-xs py-spacing-xl sm:px-spacing-lg sm:py-spacing-xxl";

type RevealCellProps = {
  as: "th" | "td";
  children: ReactNode;
  className?: string;
  open: boolean;
  /** Последняя строка таблицы — без разделителя снизу. */
  last?: boolean;
};

/** Ячейка строки заявки: свёрнута — нулевая высота и без линии, раскрыта — как обычная ячейка. */
function RevealCell({ as: Cell, children, className, last = false, open }: RevealCellProps) {
  return (
    <Cell
      className={cn(
        "p-unit-0 align-middle",
        // Свёрнутая строка — без линии: иначе 1px от каждой заявки копится в пустоту под группой.
        open && !last && "border-b border-base-border-standard-neutral-light-normal",
      )}
      scope={Cell === "th" ? "row" : undefined}
    >
      <div
        className={cn(
          revealClassName,
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-unit-0 overflow-hidden">
          <div className={cn(cellPadding, className)}>{children}</div>
        </div>
      </div>
    </Cell>
  );
}

/** Заявки группы: текст сдвинут под название группы (иконка 24 + зазор 12). */
export function RequestRows({
  disabled,
  group: i,
  last,
  onChange,
  open,
  rights,
  role,
  visible,
}: RowsProps & { open: boolean }) {
  const types = requestGroups[i].types;
  return types.map((type, k) => {
    const lastRow = Boolean(last) && k === types.length - 1;
    return (
      <tr key={type.title}>
        <RevealCell
          as="th"
          className="pl-spacing-lg text-left font-font-weight-regular sm:pl-spacing-exxs"
          last={lastRow}
          open={open}
        >
          <Typography.Body.ThreeR as="span" className="block" color="secondary">
            {type.title}
          </Typography.Body.ThreeR>
          {type.subtitle ? (
            <Typography.Caption.OneR as="span" className="mt-spacing-xxs block" color="tertiary">
              {type.subtitle}
            </Typography.Caption.OneR>
          ) : null}
        </RevealCell>
        {visible.map((j) => (
          <RevealCell key={j} as="td" className="text-center" last={lastRow} open={open}>
            {j === 0 && isViewAuto(role, i, k) ? (
              <LockedControl
                checked
                label={`${type.title}: просмотр заявки руководителя`}
                reason="Просмотр заявки руководителя выдаётся автоматически"
              />
            ) : isAvailable(role, i, k, j) ? (
              <RightControl
                checked={rights[i][k][j]}
                disabled={disabled}
                label={`${type.title}: ${columns[j].label}`}
                onCheckedChange={(value) => onChange(setCell(rights, i, k, j, value))}
              />
            ) : (
              <LockedControl
                checked={false}
                label={`${type.title}: ${columns[j].label}`}
                reason={unavailableReason(i, k, j)}
              />
            )}
          </RevealCell>
        ))}
      </tr>
    );
  });
}
