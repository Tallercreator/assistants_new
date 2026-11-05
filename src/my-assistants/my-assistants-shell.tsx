import type { ReactNode } from "react";

import assistantBot from "./assets/assistant-bot.svg";
import managerPhoto from "./assets/manager.png";
import { BellLine24Icon } from "@otp/space-ui-kit/icons/bell-line-24";
import { EducationLine24Icon } from "@otp/space-ui-kit/icons/education-line-24";
import { HeadphonesLine16Icon } from "@otp/space-ui-kit/icons/headphones-line-16";
import { HouseLine24Icon } from "@otp/space-ui-kit/icons/house-line-24";
import { LinesLoupeLine24Icon } from "@otp/space-ui-kit/icons/lines-loupe-line-24";
import { LinkLine16Icon } from "@otp/space-ui-kit/icons/link-line-16";
import { LoupeBigLine24Icon } from "@otp/space-ui-kit/icons/loupe-big-line-24";
import { SuitcaseLine24Icon } from "@otp/space-ui-kit/icons/suitcase-line-24";
import { UserDirectorLine24Icon } from "@otp/space-ui-kit/icons/user-director-line-24";
import { UsersLine16Icon } from "@otp/space-ui-kit/icons/users-line-16";
import { IconButton } from "@otp/space-ui-kit/icon-button";
import { Tabs, TabsList, TabsTab } from "@otp/space-ui-kit/tabs";
import { Typography } from "@otp/space-ui-kit/typography";

const sections = [
  { value: "home", label: "Главная", icon: HouseLine24Icon },
  { value: "work", label: "Работа", icon: SuitcaseLine24Icon },
  { value: "education", label: "Обучение", icon: EducationLine24Icon },
  { value: "manager", label: "Кабинет руководителя", icon: UserDirectorLine24Icon },
];

const footerLinks = [
  { label: "Быстрые ссылки", icon: LinkLine16Icon },
  { label: "Поддержка", icon: HeadphonesLine16Icon },
];

type MyAssistantsShellProps = {
  children: ReactNode;
  /** Управление прототипом рядом с заголовком (кнопка «Сценарий»). */
  scenario?: ReactNode;
};

/** Оболочка ОТП Space по макету 41271:93436: меню 278px, шапка 72px. */
export function MyAssistantsShell({ children, scenario }: MyAssistantsShellProps) {
  return (
    <div
      lang="ru"
      className="grid min-h-screen bg-base-surface-primary-block-normal text-base-texticons-primary [&_:is(h1,h2,p,dl,dd)]:m-[0px] xl:grid-cols-[278px_minmax(0,1fr)]"
    >
      <aside className="sticky top-unit-0 hidden box-border h-screen flex-col gap-spacing-xxxl border-r border-base-border-standard-neutral-light-normal p-spacing-xl xl:flex">
        <div className="flex items-center justify-between pr-spacing-xl">
          <span className="flex items-baseline gap-spacing-xs rounded-radius-md bg-base-surface-primary-lime-normal px-spacing-lg py-spacing-md">
            <Typography.Title.OneB as="span">отп</Typography.Title.OneB>
            <Typography.Title.OneM as="span">space</Typography.Title.OneM>
          </span>
          <IconButton aria-label="Свернуть меню" size="xsmall" variant="ghost">
            <LinesLoupeLine24Icon aria-hidden="true" />
          </IconButton>
        </div>
        <nav aria-label="Разделы ОТП Space" className="flex flex-1 flex-col gap-spacing-md">
          <Tabs defaultValue="manager" size="large" variant="segment" weight="fill">
            <TabsList aria-label="Разделы">
              {sections.map(({ icon: Icon, label, value }) => (
                <TabsTab key={value} aria-label={label} value={value}>
                  <Icon aria-hidden="true" />
                </TabsTab>
              ))}
            </TabsList>
          </Tabs>
          <a
            aria-current="page"
            className="flex items-center gap-spacing-sm rounded-radius-md bg-base-surface-primary-background p-spacing-lg no-underline text-base-texticons-secondary outline-none focus-visible:ring-(length:--ui-stroke-focus) focus-visible:ring-ring/50 [&_svg]:size-size-mmd"
            href="#my-assistants"
          >
            <UsersLine16Icon aria-hidden="true" />
            <Typography.Body.TwoM>Мои ассистенты</Typography.Body.TwoM>
          </a>
        </nav>
        <div className="flex flex-col rounded-radius-md bg-base-surface-primary-background p-spacing-md">
          {footerLinks.map(({ icon: Icon, label }) => (
            <a
              key={label}
              className="flex h-size-lg items-center gap-spacing-sm rounded-radius-sm px-spacing-lg no-underline text-base-texticons-secondary outline-none hover:bg-special-surface-primary-ghost-normal focus-visible:ring-(length:--ui-stroke-focus) focus-visible:ring-ring/50 [&_svg]:size-size-mmd"
              href="#my-assistants"
            >
              <Icon aria-hidden="true" />
              <Typography.Body.TwoR>{label}</Typography.Body.TwoR>
            </a>
          ))}
        </div>
      </aside>

      <div className="min-w-unit-0">
        <header className="sticky top-unit-0 z-10 flex h-size-exs items-center justify-between gap-spacing-lg bg-base-surface-primary-block-normal px-spacing-xl md:px-spacing-exxxxs">
          <div className="flex min-w-unit-0 items-center gap-spacing-lg">
            <Typography.Heading.OneB as="h1" className="truncate">
              Мои ассистенты
            </Typography.Heading.OneB>
            {scenario}
          </div>
          <div className="flex items-center gap-spacing-exxxxs">
            <div className="hidden items-center gap-spacing-md lg:flex">
              <span className="flex size-size-md items-center justify-center overflow-hidden rounded-radius-rounded bg-base-surface-primary-background">
                <img alt="" className="size-size-sm -scale-x-100" src={assistantBot} />
              </span>
              <span className="flex h-size-exxs flex-col justify-center gap-spacing-xxs rounded-radius-md bg-base-surface-tertiary-neutral-normal pr-spacing-xl pl-spacing-lg">
                <Typography.Body.ThreeM>Ассистент</Typography.Body.ThreeM>
                <Typography.Caption.OneR color="tertiary">
                  Спрашивайте, не стесняйтесь
                </Typography.Caption.OneR>
              </span>
            </div>
            <div className="flex items-center gap-spacing-xl">
              <div className="flex items-center gap-spacing-md">
                <IconButton
                  aria-label="Поиск"
                  className="hidden md:inline-flex"
                  size="medium"
                  variant="ghost"
                >
                  <LoupeBigLine24Icon aria-hidden="true" />
                </IconButton>
                <span className="relative">
                  <IconButton aria-label="Уведомления: есть новые" size="medium" variant="ghost">
                    <BellLine24Icon aria-hidden="true" />
                  </IconButton>
                  <span
                    aria-hidden="true"
                    className="absolute top-spacing-xs right-spacing-xs size-size-mxs rounded-radius-rounded bg-colorfull-surface-primary-purple-normal"
                  />
                </span>
              </div>
              <span className="flex items-center gap-spacing-sm">
                <img
                  alt=""
                  className="size-size-sm rounded-radius-rounded object-cover"
                  src={managerPhoto}
                />
                <Typography.Body.TwoB className="hidden md:inline">Константин</Typography.Body.TwoB>
              </span>
            </div>
          </div>
        </header>
        <div
          id="my-assistants"
          className="px-spacing-md pb-spacing-xl md:px-spacing-exxxxs md:pt-spacing-xl"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
