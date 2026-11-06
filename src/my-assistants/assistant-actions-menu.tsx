import { useState } from "react";

import { ClockLine24Icon } from "@otp/space-ui-kit/icons/clock-line-24";
import { PlayLine24Icon } from "@otp/space-ui-kit/icons/play-line-24";
import { CopyLine24Icon } from "@otp/space-ui-kit/icons/copy-line-24";
import { DotsHorizontalLine24Icon } from "@otp/space-ui-kit/icons/dots-horizontal-line-24";
import { PenLine24Icon } from "@otp/space-ui-kit/icons/pen-line-24";
import { TrashLine24Icon } from "@otp/space-ui-kit/icons/trash-line-24";
import { Dropdown } from "@otp/space-ui-kit/dropdown";
import { DropdownItem } from "@otp/space-ui-kit/dropdown-item";
import { IconButton } from "@otp/space-ui-kit/icon-button";
import { Popover, PopoverContent, PopoverTrigger } from "@otp/space-ui-kit/popover";
import type { AssistantPanelProps } from "./assistant-panel";

type ActionsMenuProps = Pick<
  AssistantPanelProps,
  "assistant" | "dirty" | "fieldEditing" | "onDelete" | "onDuplicate" | "onEdit" | "onTogglePause"
>;

/** Меню «…» карточки (макет 41296:127688): удаление красное, недоступные пункты объяснены или скрыты. */
export function ActionsMenu({
  assistant,
  dirty,
  fieldEditing,
  onDelete,
  onDuplicate,
  onEdit,
  onTogglePause,
}: ActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const run = (action: () => void) => () => {
    setOpen(false);
    action();
  };
  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger
        render={
          <IconButton aria-label="Действия с ассистентом" size="large" variant="secondary">
            <DotsHorizontalLine24Icon aria-hidden="true" />
          </IconButton>
        }
      />
      <PopoverContent align="end" aria-label="Действия с ассистентом" className="p-spacing-no">
        <Dropdown className="w-[300px]">
          {/* Новый ассистент ещё не сохранён: править уже открыто, приостанавливать и копировать
              нечего — эти пункты не показываем, остаётся только «Удалить ассистента». */}
          {fieldEditing ? null : (
            <DropdownItem
              description={assistant.paused ? "Сначала возобнови полномочия" : undefined}
              disabled={assistant.paused}
              left={<PenLine24Icon aria-hidden="true" />}
              onClick={run(onEdit)}
            >
              Редактировать
            </DropdownItem>
          )}
          {assistant.pending ? null : (
            <>
              <DropdownItem
                left={
                  assistant.paused ? (
                    <PlayLine24Icon aria-hidden="true" />
                  ) : (
                    <ClockLine24Icon aria-hidden="true" />
                  )
                }
                onClick={run(onTogglePause)}
              >
                {assistant.paused ? "Возобновить полномочия" : "Приостановить полномочия"}
              </DropdownItem>
              <DropdownItem
                description={dirty ? "Сначала сохрани или отмени изменения" : undefined}
                disabled={dirty}
                left={<CopyLine24Icon aria-hidden="true" />}
                onClick={run(onDuplicate)}
              >
                Дублировать полномочия
              </DropdownItem>
            </>
          )}
          <DropdownItem
            left={<TrashLine24Icon aria-hidden="true" />}
            onClick={run(onDelete)}
            tone="red"
          >
            Удалить ассистента
          </DropdownItem>
        </Dropdown>
      </PopoverContent>
    </Popover>
  );
}
