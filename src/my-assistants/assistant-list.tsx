import type { ReactNode } from "react";

import { ChevronDownLine24Icon } from "@otp/space-ui-kit/icons/chevron-down-line-24";
import { Button } from "@otp/space-ui-kit/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@otp/space-ui-kit/collapsible";
import { Toast } from "@otp/space-ui-kit/toast";
import { Typography } from "@otp/space-ui-kit/typography";
import { badge, countLabel } from "./my-assistants-labels";
import {
  formatDate,
  type Assistant,
  type Employee,
} from "./my-assistants-model";
import { cn } from "./utils";

type AssistantListProps = {
  assistants: Assistant[];
  employees: Employee[];
  selectedId: string | null;
  onAdd: () => void;
  onSelect: (id: string) => void;
};

type SectionProps = Omit<AssistantListProps, "assistants" | "onAdd"> & {
  title: string;
  kind: "активный" | "неактивный";
  items: Assistant[];
  /** Кнопка справа в шапке секции — вне триггера, чтобы не вкладывать кнопку в кнопку. */
  action?: ReactNode;
};

/** Карточка ассистента (макет 41296:126243): ФИО, название, бейдж срока внизу; удаление — в меню «…». */
function AssistantCard({
  assistant,
  employee,
  onSelect,
  selected,
}: {
  assistant: Assistant;
  employee?: Employee;
  onSelect: (id: string) => void;
  selected: boolean;
}) {
  const { label, status } = badge(assistant);
  return (
    <li>
      <button
        aria-current={selected ? "true" : undefined}
        className={cn(
          "m-[0px] box-border flex w-full cursor-pointer appearance-none flex-col items-start gap-spacing-lg rounded-radius-md border border-solid p-spacing-lg text-left outline-none ui-transition-colors focus-visible:ring-(length:--ui-stroke-focus) focus-visible:ring-ring/50",
          selected
            ? "border-base-surface-primary-background bg-base-surface-primary-background"
            : "border-base-border-standard-neutral-light-normal bg-base-surface-primary-block-normal hover:bg-base-surface-tertiary-neutral-normal",
        )}
        onClick={() => onSelect(assistant.id)}
        type="button"
      >
        <span className="flex flex-col gap-spacing-xs">
          <Typography.Body.TwoSB>{employee?.name}</Typography.Body.TwoSB>
          <Typography.Body.ThreeR color="secondary">
            {assistant.name || "Ассистент"}
          </Typography.Body.ThreeR>
        </span>
        <span className="flex flex-wrap gap-spacing-xs">
          <Toast contrast={selected} icon={false} size="small" status={status}>
            {label}
          </Toast>
          {employee?.dismissal ? (
            <Toast contrast={selected} icon={false} size="small" status="attention">
              Увольняется {formatDate(employee.dismissal)}
            </Toast>
          ) : null}
        </span>
      </button>
    </li>
  );
}

/** Сворачиваемая секция «Активные» / «Приостановлены» (Деск_Body_list, макет 41296:126243). */
function Section({ action, employees, items, kind, onSelect, selectedId, title }: SectionProps) {
  return (
    <Collapsible
      // Пустая секция стоит свёрнутой, а с первым ассистентом раскрывается.
      key={`${title}-${items.length > 0}`}
      className="flex flex-col rounded-radius-lg bg-base-surface-primary-block-normal p-spacing-xl"
      defaultOpen={items.length > 0}
    >
      <div className="flex items-center gap-spacing-lg">
        <CollapsibleTrigger className="group/section m-[0px] flex min-w-unit-0 flex-1 cursor-pointer appearance-none flex-col items-start gap-spacing-md rounded-radius-xs border-none bg-transparent p-[0px] text-left text-base-texticons-primary outline-none focus-visible:ring-(length:--ui-stroke-focus) focus-visible:ring-ring/50">
          {/* Шеврон стоит сразу за заголовком, а не у правого края. */}
          <span className="flex items-center gap-spacing-md">
            <Typography.Title.TwoM as="span">{title}</Typography.Title.TwoM>
            <ChevronDownLine24Icon
              aria-hidden="true"
              className="shrink-0 ui-transition-transform group-data-panel-open/section:rotate-180"
            />
          </span>
          <Typography.Body.TwoR as="span" color="tertiary">
            {countLabel(items.length, kind)}
          </Typography.Body.TwoR>
        </CollapsibleTrigger>
        {action}
      </div>
      {items.length ? (
        // Тайминги раскрытия — как у Accordion кита: высота из --collapsible-panel-height (Base UI).
        <CollapsibleContent className="h-(--collapsible-panel-height) overflow-hidden ui-transition-accordion-expand data-closed:h-unit-0 data-closed:opacity-0 data-ending-style:h-unit-0 data-ending-style:opacity-0 data-ending-style:ui-transition-accordion-collapse data-starting-style:h-unit-0 data-starting-style:opacity-0 motion-reduce:ui-transition-none">
          <ul className="m-[0px] flex list-none flex-col gap-spacing-md p-[0px] pt-spacing-xxxl">
            {items.map((assistant) => (
              <AssistantCard
                key={assistant.id}
                assistant={assistant}
                employee={employees.find((e) => e.id === assistant.employeeId)}
                onSelect={onSelect}
                selected={assistant.id === selectedId}
              />
            ))}
          </ul>
        </CollapsibleContent>
      ) : null}
    </Collapsible>
  );
}

/**
 * Колонка списка: «Добавить ассистента» в шапке «Активных», секции прокручиваются.
 * Полоса прокрутки 8px вынесена в зазор между колонками (-mr + gutter), карточки до панели — 16px.
 */
export function AssistantList({ assistants, onAdd, ...props }: AssistantListProps) {
  return (
    <aside aria-label="Ассистенты" className="flex min-h-unit-0 flex-col">
      <div className="box-border flex w-full flex-col gap-spacing-md lg:-mr-spacing-md lg:min-h-unit-0 lg:w-[calc(100%+8px)] lg:flex-1 lg:overflow-y-auto lg:[scrollbar-gutter:stable] lg:[&::-webkit-scrollbar]:w-[8px] lg:[&::-webkit-scrollbar-thumb]:rounded-radius-lg lg:[&::-webkit-scrollbar-thumb]:bg-base-surface-tertiary-neutral-pressed lg:[&::-webkit-scrollbar-track]:bg-transparent">
        <Section
          {...props}
          action={
            <Button className="shrink-0" onClick={onAdd} size="medium" tone="lime">
              Добавить ассистента
            </Button>
          }
          items={assistants.filter((a) => !a.paused)}
          kind="активный"
          title="Активные"
        />
        <Section
          {...props}
          items={assistants.filter((a) => a.paused)}
          kind="неактивный"
          title="Приостановлены"
        />
      </div>
    </aside>
  );
}
