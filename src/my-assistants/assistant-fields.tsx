import { Field, FieldError, FieldLabel } from "@otp/space-ui-kit/field";
import { Input } from "@otp/space-ui-kit/input";
import type { Assistant } from "./my-assistants-model";
import { PeriodField } from "./period-field";

export type AssistantDraft = Pick<Assistant, "name" | "start" | "end" | "indefinite" | "rights">;

export type DraftErrors = { name?: string; period?: string };

type DetailsFieldsProps = {
  draft: AssistantDraft;
  errors: DraftErrors;
  onDraftChange: (draft: AssistantDraft) => void;
};

/** Режим редактирования (макет 41301:170760): название, срок и «Выдать права бессрочно» в строку. */
export function DetailsFields({ draft, errors, onDraftChange }: DetailsFieldsProps) {
  return (
    // Макет 41301:170760: «Название» | группа «Срок + Выдать права бессрочно» (gap 26 / 20).
    // Поля сжимаются до 220px, а чекбокс не отрывается от срока; на узком экране — столбиком.
    <div className="flex flex-col items-start gap-spacing-xl md:flex-row md:gap-[26px]">
      <Field
        className="w-full md:max-w-[343px] md:min-w-[220px] md:flex-1"
        invalid={Boolean(errors.name)}
      >
        <FieldLabel>Название ассистента</FieldLabel>
        <Input
          maxLength={80}
          onChange={(event) => onDraftChange({ ...draft, name: event.target.value })}
          placeholder="Например, ассистент по отпускам"
          size="large"
          value={draft.name}
        />
        <FieldError>{errors.name}</FieldError>
      </Field>
      <PeriodField
        className="md:flex-[2]"
        error={errors.period}
        onChange={(period) => onDraftChange({ ...draft, ...period })}
        value={draft}
      />
    </div>
  );
}
