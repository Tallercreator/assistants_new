import { useState } from "react";

import { Button } from "@otp/space-ui-kit/button";
import { Checkbox } from "@otp/space-ui-kit/checkbox";
import {
  Popup,
  PopupActionPanel,
  PopupBody,
  PopupClose,
  PopupContent,
  PopupHeader,
} from "@otp/space-ui-kit/popup";
import { Typography } from "@otp/space-ui-kit/typography";
import {
  EmployeeOption,
  EmployeeSearch,
  matchesQuery,
} from "./employee-option";
import type { Employee } from "./my-assistants-model";

type DuplicateDialogProps = {
  /** Сотрудники, у которых уже есть настройки ассистента: им полномочия заменятся. */
  existingIds: number[];
  employees: Employee[];
  open: boolean;
  /** Сотрудник-источник: себе полномочия не дублируются. */
  sourceId: number | null;
  onDuplicate: (employeeIds: number[]) => void;
  onOpenChange: (open: boolean) => void;
};

/**
 * «Дублировать полномочия другому» (макет 41301:172380): выбор нескольких сотрудников.
 * Для уже добавленных — подтверждение замены; «Назад» сохраняет выбор.
 */
export function DuplicateDialog({
  employees,
  existingIds,
  onDuplicate,
  onOpenChange,
  open,
  sourceId,
}: DuplicateDialogProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [confirming, setConfirming] = useState(false);
  const found = employees.filter((e) => e.id !== sourceId && matchesQuery(e, query));
  const replaced = employees.filter((e) => selected.includes(e.id) && existingIds.includes(e.id));

  const change = (next: boolean) => {
    if (!next) {
      setQuery("");
      setSelected([]);
      setConfirming(false);
    }
    onOpenChange(next);
  };
  const toggle = (id: number, checked: boolean) =>
    setSelected((list) => (checked ? [...list, id] : list.filter((value) => value !== id)));
  const finish = () => {
    onDuplicate(selected);
    change(false);
  };

  return (
    <Popup onOpenChange={change} open={open}>
      <PopupContent className="w-[640px] max-w-[calc(100vw-32px)] min-w-unit-0">
        {confirming ? (
          <>
            <PopupHeader
              closeLabel="Закрыть"
              description={`${replaced.map((e) => e.name).join(", ")} ${
                replaced.length > 1 ? "уже ассистенты" : "уже ассистент"
              }. Текущие полномочия заменятся скопированными, срок и приостановка сохранятся.`}
              showCloseButton
              title="Заменить полномочия?"
              type="subtitle"
            />
            <PopupActionPanel>
              <Button onClick={() => setConfirming(false)} size="large" variant="secondary">
                Назад
              </Button>
              <Button onClick={finish} size="large">
                Заменить
              </Button>
            </PopupActionPanel>
          </>
        ) : (
          <>
            <PopupHeader
              closeLabel="Закрыть"
              description="Скопируются название и все переключатели. Срок сможешь задать каждому отдельно."
              showCloseButton
              title="Дублировать полномочия другому"
              type="subtitle"
            />
            <PopupBody className="gap-spacing-xxxl">
              <EmployeeSearch onChange={setQuery} value={query} />
              <div
                aria-label="Сотрудники"
                className="flex shrink-0 flex-col gap-spacing-xxxl"
                role="group"
              >
                {found.map((employee) => (
                  <EmployeeOption
                    key={employee.id}
                    control={
                      <Checkbox
                        checked={selected.includes(employee.id)}
                        onCheckedChange={(value) => toggle(employee.id, value)}
                        tone="lime"
                      />
                    }
                    employee={employee}
                    note={
                      existingIds.includes(employee.id)
                        ? "Уже ассистент — полномочия будут заменены"
                        : undefined
                    }
                  />
                ))}
                {found.length ? null : (
                  <Typography.Body.TwoR as="p" color="secondary">
                    Никого не нашли. Проверь написание или поищи по подразделению.
                  </Typography.Body.TwoR>
                )}
              </div>
            </PopupBody>
            <PopupActionPanel>
              <PopupClose
                render={
                  <Button size="large" variant="secondary">
                    Отменить
                  </Button>
                }
              />
              <Button
                disabled={!selected.length}
                onClick={() => (replaced.length ? setConfirming(true) : finish())}
                size="large"
              >
                {selected.length > 1 ? `Дублировать: ${selected.length}` : "Дублировать"}
              </Button>
            </PopupActionPanel>
          </>
        )}
      </PopupContent>
    </Popup>
  );
}
