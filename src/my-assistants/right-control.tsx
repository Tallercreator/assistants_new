import { createContext, useContext } from "react";

import { Checkbox } from "@otp/space-ui-kit/checkbox";
import { Toggle } from "@otp/space-ui-kit/toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@otp/space-ui-kit/tooltip";

/** Вид контрола права: переключатели по макету или чекбоксы — альтернатива для исследования. */
export type RightsControl = "toggle" | "checkbox";

/** Вид задаёт матрица один раз; строки и группы читают его отсюда, а не из пропсов. */
export const RightsControlContext = createContext<RightsControl>("toggle");

type RightControlProps = {
  label: string;
  checked: boolean;
  /** Часть прав группы: у чекбокса — «минус», у переключателя состояния нет. */
  indeterminate?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

/** Право в матрице: Toggle или Checkbox кита с одинаковыми именем и поведением. */
export function RightControl({ indeterminate = false, label, ...props }: RightControlProps) {
  const control = useContext(RightsControlContext);
  return control === "checkbox" ? (
    <Checkbox
      aria-label={label}
      indeterminate={indeterminate}
      onCheckedChange={(checked) => props.onCheckedChange?.(checked)}
      checked={props.checked}
      disabled={props.disabled}
      tone="lime"
    />
  ) : (
    <Toggle aria-label={label} tone="lime" {...props} />
  );
}

type LockedControlProps = { checked: boolean; label: string; reason: string };

/**
 * Недоступное право: заблокированный контрол с причиной в имени и в подсказке при наведении.
 * Обёртка не фокусируется: вложенный фокусируемый контейнер у switch запрещён axe,
 * а для скринридера причина уже входит в имя самого контрола.
 */
export function LockedControl({ checked, label, reason }: LockedControlProps) {
  return (
    <Tooltip>
      <TooltipTrigger render={<span className="inline-flex cursor-not-allowed" />}>
        <RightControl checked={checked} disabled label={`${label} — ${reason}`} />
      </TooltipTrigger>
      <TooltipContent side="top" tone="lighter">
        {reason}
      </TooltipContent>
    </Tooltip>
  );
}
