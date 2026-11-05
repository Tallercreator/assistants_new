import { useState } from "react";

import { Toaster } from "@otp/space-ui-kit/sonner";
import { AddAssistantDialog } from "./add-assistant-dialog";
import { AssistantList } from "./assistant-list";
import { AssistantPanel } from "./assistant-panel";
import { DuplicateDialog } from "./duplicate-dialog";
import { employeeOf } from "./my-assistants-draft";
import { DEMO_TODAY, employees } from "./my-assistants-fixtures";
import type { AssistantRole } from "./my-assistants-model";
import { ConfirmDialog, StartScreen } from "./my-assistants-parts";
import { MyAssistantsShell } from "./my-assistants-shell";
import { ResumeDialog } from "./resume-dialog";
import { ScenarioSwitch } from "./scenario-switch";
import { useMyAssistants } from "./use-my-assistants";

export type MyAssistantsDemoProps = {
  /** Роль определяется уровнем руководителя и скрыта от пользователя — в демо её задаёт модератор. */
  role?: AssistantRole;
  /** empty — стартовый экран без ассистентов, saved — один настроенный ассистент. */
  initialState?: "empty" | "saved";
};

/** Демо «Мои ассистенты» по макетам на новой ДС (Figma 41301:181913). */
export function MyAssistantsDemo({ initialState = "saved", ...props }: MyAssistantsDemoProps) {
  // Начальная роль — из пропса, дальше её меняет кнопка «Сценарий» в шапке.
  const [role, setRole] = useState<AssistantRole>(props.role ?? "smt");
  const state = useMyAssistants(role, initialState);
  const { actions, assistants, confirm, dirty, draft, errors, fieldEditing, selected } = state;
  const [pickerOpen, setPickerOpen] = useState(false);
  const [duplicateOpen, setDuplicateOpen] = useState(false);
  const selectedEmployee = selected ? employeeOf(selected) : undefined;
  const addedIds = assistants
    .filter((a) => !a.pending || a.id !== selected?.id)
    .map((a) => a.employeeId);
  const openPicker = () => actions.guard(() => setPickerOpen(true));

  return (
    <MyAssistantsShell scenario={<ScenarioSwitch onRoleChange={setRole} role={role} />}>
      {selected && draft && selectedEmployee ? (
        // На десктопе рабочая область — ровно экран под шапкой (72 + отступы 16 + 16): страница не
        // скроллится, список и карточка прокручиваются каждый внутри себя.
        <div className="box-border grid items-start gap-spacing-xl rounded-radius-xxl bg-base-surface-primary-background p-spacing-md lg:h-[calc(100vh-104px)] lg:grid-cols-[minmax(300px,506fr)_minmax(0,1040fr)] lg:items-stretch lg:overflow-hidden">
          <AssistantList
            assistants={assistants}
            employees={employees}
            onAdd={openPicker}
            onDelete={(assistant) => actions.setConfirm({ kind: "delete", assistant })}
            onSelect={actions.select}
            selectedId={selected.id}
          />
          <AssistantPanel
            assistant={selected}
            dirty={dirty}
            draft={draft}
            employee={selectedEmployee}
            errors={errors}
            fieldEditing={fieldEditing}
            onCancel={actions.cancel}
            onDelete={() => actions.setConfirm({ kind: "delete", assistant: selected })}
            onDraftChange={actions.setDraft}
            onDuplicate={() => setDuplicateOpen(true)}
            onEdit={state.startEditing}
            onSave={actions.save}
            onTogglePause={actions.togglePause}
            role={role}
          />
        </div>
      ) : (
        <StartScreen onAdd={openPicker} />
      )}

      <AddAssistantDialog
        addedIds={addedIds}
        employees={employees}
        onAdd={actions.add}
        onOpenChange={setPickerOpen}
        open={pickerOpen}
      />
      <DuplicateDialog
        employees={employees}
        existingIds={addedIds}
        onDuplicate={actions.duplicate}
        onOpenChange={setDuplicateOpen}
        open={duplicateOpen}
        sourceId={selected?.employeeId ?? null}
      />
      <ConfirmDialog
        kind={confirm && confirm.kind !== "resume" ? confirm.kind : null}
        onClose={() => actions.setConfirm(null)}
        onPrimary={actions.applyConfirm}
        onSecondary={actions.applySecondary}
        today={DEMO_TODAY}
      />
      <ResumeDialog
        assistant={confirm?.kind === "resume" ? confirm.assistant : null}
        onClose={() => actions.setConfirm(null)}
        onResume={actions.resume}
        today={DEMO_TODAY}
      />
      <Toaster />
    </MyAssistantsShell>
  );
}
