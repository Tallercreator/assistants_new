import type { ReactNode } from "react";

import { ClockLine16Icon } from "@otp/space-ui-kit/icons/clock-line-16";
import { MessageLine16Icon } from "@otp/space-ui-kit/icons/message-line-16";
import { MobileLine16Icon } from "@otp/space-ui-kit/icons/mobile-line-16";
import { PinMapLine16Icon } from "@otp/space-ui-kit/icons/pin-map-line-16";
import { showAlertToast } from "@otp/space-ui-kit/alert-toast";
import { Button } from "@otp/space-ui-kit/button";
import { GraphCol } from "@otp/space-ui-kit/graph-col";
import { Toast } from "@otp/space-ui-kit/toast";
import { Typography } from "@otp/space-ui-kit/typography";
import { contacts } from "./my-assistants-contacts";
import { formatDate, type Employee } from "./my-assistants-model";

export type StatusKind = "working" | "trip" | "vacation";

export function statusKind(status: string): StatusKind {
  if (status.startsWith("В отпуске")) return "vacation";
  if (status.startsWith("В командировке")) return "trip";
  return "working";
}

const toastStatus = { working: "positive", trip: "process", vacation: "attention" } as const;

const initials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

/** Фото 64×64 (GraphCol Large); без фото — инициалы. */
export function AvatarTile({ employee }: { employee: Employee }) {
  return employee.photo ? (
    <GraphCol content="image" interactive={false} size="large" tone="neutral">
      <img alt="" className="object-cover object-top" src={employee.photo} />
    </GraphCol>
  ) : (
    <GraphCol content="initials" interactive={false} size="large" tone="purple">
      {initials(employee.name)}
    </GraphCol>
  );
}

function ContactRow({ children, icon }: { children: ReactNode; icon: ReactNode }) {
  return (
    <span className="flex items-center gap-spacing-md text-base-texticons-primary [&_svg]:size-size-mmd [&_svg]:shrink-0">
      {icon}
      {children}
    </span>
  );
}

/** Превью карточки профиля (макет 41296:136052): статус, фото, контакты и переход в профиль. */
export function ProfilePreview({ employee }: { employee: Employee }) {
  const kind = statusKind(employee.status);
  const contact = contacts[employee.id];
  return (
    // Отступ 16 со всех сторон и ширина по содержимому, как в макете; PopoverBody кита даёт 24/8.
    // Превью рендерится порталом вне оболочки демо: сброс отступов абзацев — здесь же.
    <div className="box-border flex w-max max-w-[calc(100vw-32px)] flex-col gap-spacing-xxxl p-spacing-xl [&_p]:m-[0px]">
      <div className="flex flex-col gap-spacing-xl">
        {/* Увольнение важнее текущего статуса: предупреждение, как в макете 41296:136052. */}
        {employee.dismissal ? (
          <Toast className="self-start" icon={false} size="small" status="attention">
            Сотрудник увольняется {formatDate(employee.dismissal)}
          </Toast>
        ) : (
          <Toast className="self-start" icon={false} size="small" status={toastStatus[kind]}>
            {kind === "working" ? "Сотрудник на месте" : employee.status}
          </Toast>
        )}
        <div className="flex items-center gap-spacing-lg">
          <AvatarTile employee={employee} />
          {/* Строки не переносятся, карточка растёт по ширине (hug в макете). */}
          <div className="flex min-w-unit-0 flex-col gap-spacing-sm whitespace-nowrap">
            <Typography.Body.TwoM as="p">{employee.name}</Typography.Body.TwoM>
            <div className="flex flex-col gap-spacing-xs">
              <Typography.Body.ThreeR as="p" color="tertiary">
                {employee.job}; {employee.tab}
              </Typography.Body.ThreeR>
              <Typography.Body.ThreeR as="p" color="tertiary">
                {employee.department}
              </Typography.Body.ThreeR>
            </div>
          </div>
        </div>
      </div>
      {contact ? (
        <div className="flex flex-col gap-spacing-md">
          <ContactRow icon={<ClockLine16Icon aria-hidden="true" />}>
            <Typography.Paragraph.ThreeR>{contact.localTime}</Typography.Paragraph.ThreeR>
          </ContactRow>
          {/* Телефон и добавочный — через 12, «Доб.» и номер — через 2 (макет 41296:136015). */}
          <span className="flex items-center gap-spacing-lg">
            <ContactRow icon={<MobileLine16Icon aria-hidden="true" />}>
              <Typography.Paragraph.ThreeR>{contact.phone}</Typography.Paragraph.ThreeR>
            </ContactRow>
            <span className="flex items-center gap-spacing-xxs">
              <Typography.Paragraph.ThreeR color="tertiary">Доб.</Typography.Paragraph.ThreeR>
              <Typography.Paragraph.ThreeR>{contact.ext}</Typography.Paragraph.ThreeR>
            </span>
          </span>
          <ContactRow icon={<MessageLine16Icon aria-hidden="true" />}>
            <Typography.Paragraph.ThreeR>{contact.email}</Typography.Paragraph.ThreeR>
          </ContactRow>
          <ContactRow icon={<PinMapLine16Icon aria-hidden="true" />}>
            <Typography.Paragraph.ThreeR>{contact.office}</Typography.Paragraph.ThreeR>
          </ContactRow>
        </div>
      ) : null}
      <Button
        className="w-full"
        onClick={() =>
          showAlertToast({ status: "info", title: "Профиль сотрудника в прототипе не открывается" })
        }
        size="medium"
      >
        Перейти в профиль
      </Button>
    </div>
  );
}
