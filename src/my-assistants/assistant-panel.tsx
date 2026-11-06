import { useRef } from "react";

import { Button } from "@otp/space-ui-kit/button";
import { Toast } from "@otp/space-ui-kit/toast";
import { Typography } from "@otp/space-ui-kit/typography";
import { ActionsMenu } from "./assistant-actions-menu";
import { DetailsFields } from "./assistant-fields";
import { EmployeeAvatar } from "./employee-avatar";
import { expiryWarning, unsavedLabel } from "./my-assistants-labels";
import {
  formatDate,
  periodLabel,
  type Assistant,
  type AssistantRole,
  type Employee,
  type Rights,
} from "./my-assistants-model";
import type { RightsControl } from "./right-control";
import { RightsMatrix } from "./rights-matrix";

import type { AssistantDraft, DraftErrors } from "./assistant-fields";

export type { AssistantDraft, DraftErrors } from "./assistant-fields";

export type AssistantPanelProps = {
  assistant: Assistant;
  draft: AssistantDraft;
  employee: Employee;
  errors: DraftErrors;
  fieldEditing: boolean;
  role: AssistantRole;
  onDraftChange: (draft: AssistantDraft) => void;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePause: () => void;
  onDuplicate: () => void;
  onCancel: () => void;
  /** false — в полях ошибки: карточка прокручивается к первому незаполненному полю. */
  onSave: () => boolean;
  /** Есть несохранённые изменения: копировать можно только сохранённые полномочия. */
  dirty: boolean;
  /** Вид прав в матрице: переключатели или чекбоксы. */
  control: RightsControl;
};

function ProfileHeader({ employee }: { employee: Employee }) {
  return (
    // Макет 41296:127688: фото слева, ФИО и должность справа от него, по центру фото.
    <div className="flex min-w-unit-0 flex-1 items-center gap-spacing-xxl">
      <EmployeeAvatar employee={employee} preview />
      <div className="flex min-w-unit-0 flex-1 flex-col gap-spacing-md">
        <Typography.Title.TwoM as="h2">{employee.name}</Typography.Title.TwoM>
        <div className="flex flex-col gap-spacing-xs">
          <Typography.Body.TwoR as="p" color="tertiary">
            {employee.job}; {employee.tab}
          </Typography.Body.TwoR>
          <Typography.Body.TwoR as="p" color="tertiary">
            {employee.department}
          </Typography.Body.TwoR>
        </div>
      </div>
    </div>
  );
}

function AssistantInfo({ assistant }: { assistant: Assistant }) {
  const warning = expiryWarning(assistant);
  return (
    // Та же сетка, что у полей правки (DetailsFields): срок стоит на одном месте при любой длине
    // названия и не перескакивает при переходе в «Редактировать».
    <dl className="flex flex-col items-start gap-spacing-xl md:flex-row md:gap-[26px]">
      <div className="flex w-full flex-col gap-spacing-md md:max-w-[343px] md:min-w-[220px] md:flex-1">
        <Typography.Body.TwoR as="dt" color="tertiary">
          Название ассистента
        </Typography.Body.TwoR>
        <Typography.Body.TwoM as="dd">{assistant.name}</Typography.Body.TwoM>
      </div>
      <div className="flex w-full flex-col gap-spacing-md md:flex-[2]">
        <Typography.Body.TwoR as="dt" color="tertiary">
          Срок действия прав
        </Typography.Body.TwoR>
        <dd className="flex flex-wrap items-center gap-spacing-md">
          <Typography.Body.TwoM>{periodLabel(assistant)}</Typography.Body.TwoM>
          {assistant.paused ? (
            <Toast icon={false} size="small" status="neutral">
              Полномочия приостановлены
            </Toast>
          ) : null}
          {/* То же предупреждение, что в карточке списка: срок заканчивается на этой неделе. */}
          {warning ? (
            <Toast icon={false} size="small" status="attention">
              {warning}
            </Toast>
          ) : null}
        </dd>
      </div>
    </dl>
  );
}

const footerClassName =
  "sticky -bottom-spacing-xl -mx-spacing-xl -mt-spacing-exxxs lg:-mr-spacing-md flex flex-wrap items-center justify-end gap-spacing-lg bg-base-surface-primary-block-normal p-spacing-xl";

/** Карточка ассистента по макету 41301:170920: профиль, срок, матрица и панель сохранения. */
export function AssistantPanel(props: AssistantPanelProps) {
  const { assistant, dirty, draft, employee, errors, fieldEditing, onCancel } = props;
  const articleRef = useRef<HTMLElement>(null);
  const save = () => {
    if (props.onSave()) return;
    // Ошибки появляются после перерисовки: поле с aria-invalid ищем следующей задачей.
    setTimeout(() => {
      const field = articleRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // Только прокрутка, без фокуса: пустое поле с ошибкой в фокусе по гайду кита серое,
      // а без фокуса все незаполненные поля одинаково красные.
      field?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    }, 0);
  };
  return (
    // Полоса прокрутки 8px внутри карточки, как в макете (.Dropdown Scroll area); место под неё
    // зарезервировано, справа отступ 8 + полоса 8 = те же 16, что сверху, и ширина не прыгает.
    <article
      ref={articleRef}
      aria-label={`Ассистент: ${employee.name}`}
      className="relative box-border flex min-w-unit-0 flex-col gap-spacing-exxxs rounded-radius-lg bg-base-surface-primary-block-normal p-spacing-xl lg:min-h-unit-0 lg:overflow-y-auto lg:pr-spacing-md lg:[scrollbar-gutter:stable] lg:[&::-webkit-scrollbar]:w-[8px] lg:[&::-webkit-scrollbar-thumb]:rounded-radius-lg lg:[&::-webkit-scrollbar-thumb]:bg-base-surface-tertiary-neutral-pressed lg:[&::-webkit-scrollbar-track]:bg-transparent"
    >
      <div className="flex items-start gap-spacing-xl">
        <ProfileHeader employee={employee} />
        <ActionsMenu {...props} />
      </div>
      {fieldEditing ? (
        <DetailsFields draft={draft} errors={errors} onDraftChange={props.onDraftChange} />
      ) : (
        <AssistantInfo assistant={assistant} />
      )}
      <RightsMatrix
        control={props.control}
        disabled={assistant.paused}
        onChange={(rights: Rights) => props.onDraftChange({ ...draft, rights })}
        rights={draft.rights}
        role={props.role}
      />
      {assistant.paused ? (
        // На паузе единственное действие — возобновить: панель закреплена, как панель сохранения.
        <footer className={footerClassName}>
          <Typography.Body.TwoR className="mr-auto" color="secondary">
            Полномочия не действуют
            {assistant.pausedAt ? ` с ${formatDate(assistant.pausedAt)}` : null}
          </Typography.Body.TwoR>
          <Button onClick={props.onTogglePause} size="medium">
            Возобновить полномочия
          </Button>
        </footer>
      ) : dirty || fieldEditing ? (
        // Удаление — только из меню «…» и корзины в списке: футер отвечает лишь за сохранение.
        <footer className={footerClassName}>
          {/* Просмотр и правка — один экран: подпись говорит, что матрица уже изменена. */}
          {dirty && !assistant.pending ? (
            <Typography.Body.TwoR
              aria-live="polite"
              className="mr-auto"
              color="tertiary"
              role="status"
            >
              {unsavedLabel(assistant.rights, draft.rights)}
            </Typography.Body.TwoR>
          ) : null}
          <div className="flex gap-spacing-lg">
            <Button onClick={onCancel} size="medium" variant="secondary">
              Отменить
            </Button>
            <Button onClick={save} size="medium">
              Сохранить
            </Button>
          </div>
        </footer>
      ) : null}
    </article>
  );
}
