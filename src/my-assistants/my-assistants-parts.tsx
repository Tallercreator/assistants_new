import emptyState from "./assets/empty-state.png";
import { Button } from "@otp/space-ui-kit/button";
import { Popup, PopupActionPanel, PopupContent, PopupHeader } from "@otp/space-ui-kit/popup";
import { Typography } from "@otp/space-ui-kit/typography";
import { formatDate } from "./my-assistants-model";

/** Пустой экран (макет 41301:171083): иллюстрация, заголовок и тёмная кнопка. */
export function StartScreen({ onAdd }: { onAdd: () => void }) {
  return (
    <section className="flex min-h-[calc(100vh-136px)] flex-col items-center justify-center gap-spacing-xxxl px-spacing-xl text-center">
      <img alt="" className="h-[220px] w-[248px] object-contain" src={emptyState} />
      <div className="flex flex-col items-center gap-spacing-lg">
        <Typography.Heading.OneB as="h2">У тебя пока нет ассистентов</Typography.Heading.OneB>
        {/* Объясняем, кто такой ассистент: раздел открывают редко, многие — впервые. */}
        <Typography.Body.TwoR as="p" className="max-w-[680px]" color="secondary">
          Ассистент — сотрудник, которому ты передаёшь часть работы с заявками: он сможет создавать
          заявки от твоего имени и согласовывать заявки твоих сотрудников
        </Typography.Body.TwoR>
        <Typography.Body.TwoR as="p" color="secondary">
          Добавь сотрудника и выбери полномочия и срок
        </Typography.Body.TwoR>
      </div>
      <Button onClick={onAdd} size="large">
        Добавить ассистента
      </Button>
    </section>
  );
}

type ConfirmKind = "pause" | "delete" | "unsaved";

/** Тексты подтверждений из макетов 41301:174089, 41301:174777 и 41301:173563. */
const copy = (
  today: Date,
): Record<
  ConfirmKind,
  { title: string; description: string; primary: string; secondary: string }
> => ({
  pause: {
    title: "Приостановить полномочия ассистента?",
    description: `Ассистент временно не сможет пользоваться полномочиями. Дата окончания полномочий станет сегодняшней — ${formatDate(today)}. Ты сможешь возобновить их в любой момент.`,
    primary: "Приостановить",
    secondary: "Отменить",
  },
  delete: {
    title: "Удалить ассистента?",
    description:
      "Ассистент будет удалён из списка, его полномочия и настройки не сохранятся. Если хочешь отключить доступ временно и сохранить настройки, приостанови его.",
    primary: "Удалить",
    secondary: "Приостановить",
  },
  unsaved: {
    title: "Изменения не сохранены",
    description: "Если выйти сейчас, изменения названия, срока и полномочий не сохранятся",
    primary: "Сохранить изменения",
    secondary: "Выйти без сохранения",
  },
});

type ConfirmDialogProps = {
  kind: ConfirmKind | null;
  today: Date;
  onClose: () => void;
  onPrimary: () => void;
  onSecondary: () => void;
};

/**
 * Подтверждение приостановки, удаления или выхода без сохранения. У «Отменить» в паузе
 * вторая кнопка просто закрывает окно; у выхода она — отдельное действие. Удаление — три
 * кнопки: «Отменить» без фона слева, «Приостановить» и «Удалить» справа.
 */
export function ConfirmDialog({
  kind,
  onClose,
  onPrimary,
  onSecondary,
  today,
}: ConfirmDialogProps) {
  const text = kind ? copy(today)[kind] : null;
  return (
    <Popup onClose={onClose} open={kind !== null}>
      <PopupContent className="w-[640px] max-w-[calc(100vw-32px)] min-w-unit-0">
        {text ? (
          <>
            <PopupHeader
              closeLabel="Закрыть"
              description={text.description}
              showCloseButton
              title={text.title}
              type="subtitle"
            />
            {kind === "delete" ? (
              <PopupActionPanel>
                {/* Один ряд вместо равных долей панели: выход слева, два действия справа. */}
                <div className="flex items-center gap-spacing-md">
                  <Button className="mr-auto" onClick={onClose} size="large" variant="ghost">
                    Отменить
                  </Button>
                  <Button onClick={onSecondary} size="large" variant="secondary">
                    {text.secondary}
                  </Button>
                  <Button onClick={onPrimary} size="large">
                    {text.primary}
                  </Button>
                </div>
              </PopupActionPanel>
            ) : (
              <PopupActionPanel>
                <Button
                  onClick={kind === "pause" ? onClose : onSecondary}
                  size="large"
                  variant="secondary"
                >
                  {text.secondary}
                </Button>
                <Button onClick={onPrimary} size="large">
                  {text.primary}
                </Button>
              </PopupActionPanel>
            )}
          </>
        ) : null}
      </PopupContent>
    </Popup>
  );
}
