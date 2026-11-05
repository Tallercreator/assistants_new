import { CheckBlockFill12Icon } from "@otp/space-ui-kit/icons/check-block-fill-12";
import { ClockFill12Icon } from "@otp/space-ui-kit/icons/clock-fill-12";
import { ExclamationPointCircleFill16Icon } from "@otp/space-ui-kit/icons/exclamation-point-circle-fill-16";
import { Popover, PopoverContent, PopoverTrigger } from "@otp/space-ui-kit/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@otp/space-ui-kit/tooltip";
import type { Employee } from "./my-assistants-model";
import { AvatarTile, ProfilePreview, statusKind } from "./profile-preview";
import { cn } from "./utils";

/**
 * Статус сотрудника — Bage/Special в правом нижнем углу фото (макет 41301:171304):
 * работает — лаймовая галочка, командировка — синие часы, отпуск — оранжевый восклицательный знак.
 */
const kinds = {
  working: {
    icon: CheckBlockFill12Icon,
    className: "bg-base-surface-secondary-standard-lime-normal text-base-texticons-lime-intense",
  },
  trip: {
    icon: ClockFill12Icon,
    className:
      "bg-colorfull-surface-secondary-standard-blue-normal text-colorfull-texticons-blue-average",
  },
  vacation: {
    icon: ExclamationPointCircleFill16Icon,
    className:
      "bg-colorfull-surface-secondary-contrast-orange-normal text-colorfull-texticons-orange-average",
  },
};

const badgeClassName =
  "absolute -right-spacing-lg -bottom-spacing-md flex size-size-mlg items-center justify-center rounded-radius-sm border border-special-border-as-a-block";

type EmployeeAvatarProps = {
  employee: Employee;
  /** Превью карточки профиля при наведении на фото и бейдж (макет 41296:136052). */
  preview?: boolean;
};

/** Фото 64×64 со статусом сотрудника; с preview — наведение показывает карточку профиля. */
export function EmployeeAvatar({ employee, preview = false }: EmployeeAvatarProps) {
  const { className, icon: Icon } = kinds[statusKind(employee.status)];
  const label = `Статус сотрудника: ${employee.status}`;

  if (preview) {
    return (
      <Popover>
        <PopoverTrigger
          aria-label={`Профиль: ${employee.name}`}
          closeDelay={150}
          delay={200}
          nativeButton={false}
          openOnHover
          render={
            <span className="relative inline-flex shrink-0 cursor-pointer rounded-radius-lg outline-none focus-visible:ring-(length:--ui-stroke-focus) focus-visible:ring-ring/50" />
          }
        >
          <AvatarTile employee={employee} />
          <span aria-label={label} className={cn(badgeClassName, className)} role="img">
            <Icon aria-hidden="true" className="size-size-msm" />
          </span>
        </PopoverTrigger>
        <PopoverContent align="start" aria-label={`Профиль: ${employee.name}`} side="bottom">
          <ProfilePreview employee={employee} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <span className="relative inline-flex shrink-0">
      <AvatarTile employee={employee} />
      <Tooltip>
        <TooltipTrigger
          render={<span aria-label={label} className={cn(badgeClassName, className)} role="img" />}
        >
          <Icon aria-hidden="true" className="size-size-msm" />
        </TooltipTrigger>
        <TooltipContent side="top" tone="lighter">
          {employee.status}
        </TooltipContent>
      </Tooltip>
    </span>
  );
}
