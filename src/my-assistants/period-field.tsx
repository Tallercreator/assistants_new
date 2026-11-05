import { Checkbox } from "@otp/space-ui-kit/checkbox";
import { Field, FieldError, FieldItem, FieldLabel } from "@otp/space-ui-kit/field";
import { SelectDate } from "@otp/space-ui-kit/select-date";
import { Typography } from "@otp/space-ui-kit/typography";
import { formatDate, type Assistant } from "./my-assistants-model";
import { cn } from "./utils";

export type Period = Pick<Assistant, "start" | "end" | "indefinite">;

type PeriodFieldProps = {
  value: Period;
  error?: string;
  onChange: (period: Period) => void;
  className?: string;
  /** inline — поле и чекбокс в строку (карточка); stacked — поле на всю ширину, чекбокс под ним (окно). */
  layout?: "inline" | "stacked";
};

/** Срок действия прав и «Выдать права бессрочно» рядом (макет 41301:170760). */
export function PeriodField({
  className,
  error,
  layout = "inline",
  onChange,
  value,
}: PeriodFieldProps) {
  const { indefinite } = value;
  const inline = layout === "inline";
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-spacing-xl",
        inline && "md:flex-row md:items-start md:gap-spacing-xxl",
        className,
      )}
    >
      <Field
        className={cn("w-full", inline && "md:max-w-[343px] md:min-w-[220px] md:flex-1")}
        invalid={Boolean(error)}
      >
        <FieldLabel>Срок действия прав</FieldLabel>
        {indefinite ? (
          <SelectDate
            formatValue={(date) => `${formatDate(date)} - бессрочно`}
            label="Дата начала"
            onValueChange={(date) => onChange({ ...value, start: date })}
            size="large"
            value={value.start}
          />
        ) : (
          <SelectDate
            label="ДД.ММ.ГГГГ - ДД.ММ.ГГГГ"
            mode="range"
            onRangeChange={(range) =>
              onChange({ ...value, start: range.from ?? null, end: range.to ?? null })
            }
            range={{ from: value.start ?? undefined, to: value.end ?? undefined }}
            size="large"
          />
        )}
        <FieldError>{error}</FieldError>
      </Field>
      {/* Отступ сверху = высота подписи поля (18) + зазор (8): чекбокс по центру поля 48px. */}
      <FieldItem className={cn("shrink-0", inline && "md:mt-[26px] md:h-size-xl")}>
        <Checkbox
          checked={indefinite}
          onCheckedChange={(checked) => onChange({ ...value, indefinite: checked })}
          tone="lime"
        />
        <Typography.Body.TwoR className="whitespace-nowrap">
          Выдать права бессрочно
        </Typography.Body.TwoR>
      </FieldItem>
    </div>
  );
}
