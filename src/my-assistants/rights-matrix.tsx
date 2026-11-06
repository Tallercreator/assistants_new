import { Fragment, useState } from "react";

import { Typography } from "@otp/space-ui-kit/typography";
import {
  cellsState,
  columnCells,
  columns,
  countRights,
  isGroupVisible,
  requestGroups,
  setColumn,
  visibleColumns,
  type AssistantRole,
  type Rights,
} from "./my-assistants-model";
import { GroupRow, cellClassName } from "./rights-matrix-parts";
import { RequestRows } from "./request-rows";
import {
  LockedControl,
  RightControl,
  RightsControlContext,
  type RightsControl,
} from "./right-control";
import { cn } from "./utils";

type RightsMatrixProps = {
  role: AssistantRole;
  rights: Rights;
  onChange: (rights: Rights) => void;
  /** Пауза: права видны, но переключатели заблокированы до возобновления. */
  disabled?: boolean /** Вид прав: переключатели (макет) или чекбоксы (для исследования). */;
  control?: RightsControl;
};

/**
 * Матрица полномочий по макету 41273:109662: текстовая шапка и строки на линиях,
 * у групп иконка слева. Шапка колонок закреплена под шапкой страницы.
 */
export function RightsMatrix({
  control = "toggle",
  disabled,
  onChange,
  rights,
  role,
}: RightsMatrixProps) {
  const [expanded, setExpanded] = useState<boolean[]>(() => requestGroups.map(() => false));
  const { enabled, total } = countRights(role, rights);
  const visible = visibleColumns(role);
  // Последняя показанная группа: под ней таблица заканчивается, разделитель лишний.
  const lastGroup = requestGroups.reduce((acc, _, i) => (isGroupVisible(role, i) ? i : acc), -1);
  const toggleGroup = (i: number) =>
    setExpanded((list) => list.map((value, index) => (index === i ? !value : value)));

  return (
    <RightsControlContext.Provider value={control}>
      <section aria-labelledby="rights-title" className="flex flex-col gap-spacing-xl">
        <h2 className="sr-only" id="rights-title">
          Полномочия: включено {enabled} из {total}
        </h2>
        <table className="w-full table-fixed border-separate border-spacing-spacing-no">
          <colgroup>
            <col className="w-1/2 sm:w-1/3" />
            {visible.map((j) => (
              <col key={j} />
            ))}
          </colgroup>
          {/* Десктоп: скроллится карточка — шапка липнет к её верху; мобайл: страница — под шапкой 72px. */}
          <thead className="sticky top-size-exs z-[1] bg-base-surface-primary-block-normal lg:-top-spacing-xl">
            <tr>
              {["Заявка", ...visible.map((j) => columns[j].title)].map((title, index) => (
                <th
                  key={title}
                  className={cn(
                    "border-b border-base-border-standard-neutral-light-normal px-spacing-xs py-spacing-lg font-font-weight-regular hyphens-auto sm:px-spacing-lg",
                    index ? "text-center" : "text-left",
                  )}
                  scope="col"
                >
                  <Typography.Body.ThreeM color="tertiary">{title}</Typography.Body.ThreeM>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className={cn(cellClassName, "text-left font-font-weight-regular")} scope="row">
                <Typography.Body.TwoM color="secondary">Все заявки</Typography.Body.TwoM>
              </th>
              {visible.map((j) => {
                const cells = columnCells(role, rights, j);
                const state = cellsState(cells);
                return (
                  <td key={j} className={cn(cellClassName, "text-center")}>
                    {cells.length ? (
                      <RightControl
                        checked={state.all}
                        disabled={disabled}
                        indeterminate={state.some && !state.all}
                        label={`Все заявки: ${columns[j].label}`}
                        onCheckedChange={(value) => onChange(setColumn(role, rights, j, value))}
                      />
                    ) : (
                      <LockedControl
                        checked={false}
                        label={`Все заявки: ${columns[j].label}`}
                        reason="Доступно только ассистенту руководителя уровня SMT"
                      />
                    )}
                  </td>
                );
              })}
            </tr>
          </tbody>
          {requestGroups.map((group, i) => {
            if (!isGroupVisible(role, i)) return null;
            const open = expanded[i];
            const panelId = `rights-group-${i}`;
            return (
              <Fragment key={group.title}>
                <tbody>
                  <GroupRow
                    disabled={disabled}
                    group={i}
                    last={i === lastGroup}
                    onChange={onChange}
                    onToggle={() => toggleGroup(i)}
                    open={open}
                    panelId={panelId}
                    rights={rights}
                    role={role}
                    visible={visible}
                  />
                </tbody>
                {/* Строки остаются в DOM ради анимации; свёрнутые — inert: ни фокуса, ни озвучки. */}
                <tbody
                  aria-hidden={!open}
                  id={panelId}
                  ref={(node) => node?.toggleAttribute("inert", !open)}
                >
                  <RequestRows
                    disabled={disabled}
                    group={i}
                    last={i === lastGroup}
                    onChange={onChange}
                    open={open}
                    rights={rights}
                    role={role}
                    visible={visible}
                  />
                </tbody>
              </Fragment>
            );
          })}
        </table>
      </section>
    </RightsControlContext.Provider>
  );
}
