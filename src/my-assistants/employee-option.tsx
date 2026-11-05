import type { ReactNode } from "react";

import { LoupeLine24Icon } from "@otp/space-ui-kit/icons/loupe-line-24";
import { FieldItem } from "@otp/space-ui-kit/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupContent,
  InputGroupInput,
} from "@otp/space-ui-kit/input-group";
import { Typography } from "@otp/space-ui-kit/typography";
import { EmployeeAvatar } from "./employee-avatar";
import type { Employee } from "./my-assistants-model";
import { cn } from "./utils";

/** Поиск сотрудника в окнах выбора: лупа слева, плейсхолдер «Введи ФИО сотрудника». */
export function EmployeeSearch({
  onChange,
  value,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    // shrink-0: PopupBody — flex-колонка со скроллом, без него поле сжимается под длинным списком.
    <InputGroup className="shrink-0" size="large">
      <InputGroupAddon align="inline-start">
        <LoupeLine24Icon aria-hidden="true" className="size-size-mxl" data-icon="inline-start" />
      </InputGroupAddon>
      <InputGroupContent>
        <InputGroupInput
          aria-label="Найти сотрудника"
          onChange={(event) => onChange(event.target.value)}
          placeholder="Введи ФИО сотрудника"
          type="search"
          value={value}
        />
      </InputGroupContent>
    </InputGroup>
  );
}

export const matchesQuery = (employee: Employee, query: string) => {
  const needle = query.trim().toLowerCase();
  return !needle || `${employee.name} ${employee.department}`.toLowerCase().includes(needle);
};

type EmployeeOptionProps = {
  control: ReactNode;
  disabled?: boolean;
  employee: Employee;
  note?: string;
};

/** Строка сотрудника (макет 41301:171267): фото 64 со статусом, ФИО, должность и подразделение, контрол справа. */
export function EmployeeOption({ control, disabled, employee, note }: EmployeeOptionProps) {
  // Должность и подразделение — вторичный, но активный текст; серее — только у недоступной строки.
  const meta = disabled ? "disabled" : "tertiary";
  return (
    <FieldItem
      className={cn(
        "gap-spacing-lg rounded-radius-md py-spacing-xs",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
      )}
    >
      <span className="flex min-w-unit-0 flex-1 items-center gap-spacing-xxl">
        <EmployeeAvatar employee={employee} />
        <span className="flex min-w-unit-0 flex-col gap-spacing-sm">
          <Typography.Body.TwoM className="truncate" color={disabled ? "disabled" : "primary"}>
            {employee.name}
          </Typography.Body.TwoM>
          <span className="flex flex-col gap-spacing-xs">
            <Typography.Body.ThreeR className="truncate" color={meta}>
              {note ?? `${employee.job}; ${employee.tab}`}
            </Typography.Body.ThreeR>
            <Typography.Body.ThreeR color={meta}>{employee.department}</Typography.Body.ThreeR>
          </span>
        </span>
      </span>
      {control}
    </FieldItem>
  );
}
