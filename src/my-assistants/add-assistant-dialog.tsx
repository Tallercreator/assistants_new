import { useState } from "react";

import { Button } from "@otp/space-ui-kit/button";
import {
  Popup,
  PopupActionPanel,
  PopupBody,
  PopupClose,
  PopupContent,
  PopupHeader,
} from "@otp/space-ui-kit/popup";
import { Radio, RadioGroup } from "@otp/space-ui-kit/radio";
import { Typography } from "@otp/space-ui-kit/typography";
import {
  EmployeeOption,
  EmployeeSearch,
  matchesQuery,
} from "./employee-option";
import type { Employee } from "./my-assistants-model";

type AddAssistantDialogProps = {
  addedIds: number[];
  employees: Employee[];
  open: boolean;
  onAdd: (employeeId: number) => void;
  onOpenChange: (open: boolean) => void;
  /** Фиче-тоггл: с кнопками выбор только отмечает сотрудника, без них — сразу добавляет. */
  withButtons?: boolean;
};

/**
 * «Добавить ассистента» (макет 41316:12553): поиск и выбор одного сотрудника, уже добавленные
 * недоступны. Кнопки «Отменить» / «Добавить» — под фиче-тогглом (макет 41301:171304).
 */
export function AddAssistantDialog({
  addedIds,
  employees,
  onAdd,
  onOpenChange,
  open,
  withButtons = false,
}: AddAssistantDialogProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const found = employees.filter((e) => matchesQuery(e, query));

  const change = (next: boolean) => {
    if (!next) {
      setQuery("");
      setSelected(null);
    }
    onOpenChange(next);
  };

  return (
    <Popup onOpenChange={change} open={open}>
      <PopupContent className="w-[640px] max-w-[calc(100vw-32px)] min-w-unit-0">
        <PopupHeader
          closeLabel="Закрыть"
          showCloseButton
          title="Добавить ассистента"
          type="subtitle"
        />
        <PopupBody className="gap-spacing-xxxl">
          <EmployeeSearch onChange={setQuery} value={query} />
          {found.length ? (
            <RadioGroup
              aria-label="Сотрудники"
              className="flex shrink-0 flex-col gap-spacing-xxxl"
              onValueChange={(value) => {
                if (withButtons) {
                  setSelected(Number(value));
                  return;
                }
                // Макет 41316:12553: без кнопок клик по сотруднику — это и есть «Добавить».
                onAdd(Number(value));
                change(false);
              }}
              value={selected === null ? null : String(selected)}
            >
              {found.map((employee) => {
                const added = addedIds.includes(employee.id);
                return (
                  <EmployeeOption
                    key={employee.id}
                    control={<Radio disabled={added} tone="lime" value={String(employee.id)} />}
                    disabled={added}
                    employee={employee}
                    note={added ? "Уже добавлен в ассистенты" : undefined}
                  />
                );
              })}
            </RadioGroup>
          ) : (
            <Typography.Body.TwoR as="p" color="secondary">
              Никого не нашли. Проверь написание или поищи по подразделению.
            </Typography.Body.TwoR>
          )}
        </PopupBody>
        {withButtons ? (
          <PopupActionPanel>
            <PopupClose
              render={
                <Button size="large" variant="secondary">
                  Отменить
                </Button>
              }
            />
            <Button
              disabled={selected === null}
              onClick={() => {
                if (selected === null) return;
                onAdd(selected);
                change(false);
              }}
              size="large"
            >
              Добавить
            </Button>
          </PopupActionPanel>
        ) : null}
      </PopupContent>
    </Popup>
  );
}
