import { Button } from "@otp/space-ui-kit/button";
import { Checkbox } from "@otp/space-ui-kit/checkbox";
import { FieldItem } from "@otp/space-ui-kit/field";
import { Popover, PopoverContent, PopoverTrigger } from "@otp/space-ui-kit/popover";
import { Radio, RadioGroup } from "@otp/space-ui-kit/radio";
import { Typography } from "@otp/space-ui-kit/typography";
import type { AssistantRole } from "./my-assistants-model";
import type { RightsControl } from "./right-control";

/** Настройки показа прототипа: роль, вид прав и фиче-тоггл кнопок в выборе сотрудника. */
export type PrototypeOptions = {
  role: AssistantRole;
  control: RightsControl;
  /** Под фиче-тогглом: кнопки «Отменить» и «Добавить» в окне выбора сотрудника. */
  pickerButtons: boolean;
};

type Choice<T extends string> = { value: T; title: string; description: string };

/**
 * Роль ассистента в продукте скрыта и задаётся уровнем руководителя; здесь её переключает
 * модератор. У роли без прав на создание столбца нет.
 */
const roles: Choice<AssistantRole>[] = [
  {
    value: "smt",
    title: "Создание и согласование",
    description: "Оба столбца: свои заявки и заявки сотрудников",
  },
  {
    value: "assistant",
    title: "Только согласование",
    description: "Столбца «Создание и просмотр моих заявок» нет",
  },
];

const controls: Choice<RightsControl>[] = [
  { value: "toggle", title: "Переключатели", description: "Как в макете" },
  { value: "checkbox", title: "Чекбоксы", description: "Альтернатива для исследования" },
];

function ChoiceGroup<T extends string>(props: {
  label: string;
  choices: Choice<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-col gap-spacing-lg">
      <Typography.Body.TwoM as="p">{props.label}</Typography.Body.TwoM>
      <RadioGroup
        aria-label={props.label}
        className="flex flex-col gap-spacing-lg"
        onValueChange={(value) => props.onChange(value)}
        value={props.value}
      >
        {props.choices.map((choice) => (
          <FieldItem key={choice.value} className="items-start">
            <Radio tone="lime" value={choice.value} />
            <span className="flex flex-col gap-spacing-xxs">
              <Typography.Body.TwoR>{choice.title}</Typography.Body.TwoR>
              <Typography.Body.ThreeR color="tertiary">{choice.description}</Typography.Body.ThreeR>
            </span>
          </FieldItem>
        ))}
      </RadioGroup>
    </div>
  );
}

type ScenarioSwitchProps = {
  options: PrototypeOptions;
  onOptionsChange: (options: PrototypeOptions) => void;
};

/** Кнопка «Сценарий» в шапке демо: столбцы матрицы, вид прав и кнопки выбора сотрудника. */
export function ScenarioSwitch({ onOptionsChange, options }: ScenarioSwitchProps) {
  const set = (patch: Partial<PrototypeOptions>) => onOptionsChange({ ...options, ...patch });
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button className="shrink-0" size="small" variant="secondary">
            Сценарий
          </Button>
        }
      />
      <PopoverContent align="start" aria-label="Сценарий прототипа">
        {/* Окно рендерится порталом вне оболочки демо: сброс отступов абзацев — здесь же. */}
        <div className="box-border flex w-[320px] max-w-[calc(100vw-32px)] flex-col gap-spacing-xxxl p-spacing-xl [&_p]:m-[0px]">
          <ChoiceGroup
            choices={roles}
            label="Столбцы матрицы"
            onChange={(role) => set({ role })}
            value={options.role}
          />
          <ChoiceGroup
            choices={controls}
            label="Вид прав"
            onChange={(control) => set({ control })}
            value={options.control}
          />
          <div className="flex flex-col gap-spacing-lg">
            <Typography.Body.TwoM as="p">Выбор сотрудника</Typography.Body.TwoM>
            <FieldItem className="items-start">
              <Checkbox
                checked={options.pickerButtons}
                onCheckedChange={(pickerButtons) => set({ pickerButtons })}
                tone="lime"
              />
              <span className="flex flex-col gap-spacing-xxs">
                <Typography.Body.TwoR>Кнопки «Отменить» и «Добавить»</Typography.Body.TwoR>
                <Typography.Body.ThreeR color="tertiary">
                  Без них выбор сотрудника сразу добавляет ассистента
                </Typography.Body.ThreeR>
              </span>
            </FieldItem>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
