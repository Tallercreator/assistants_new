import { Button } from "@otp/space-ui-kit/button";
import { FieldItem } from "@otp/space-ui-kit/field";
import { Popover, PopoverContent, PopoverTrigger } from "@otp/space-ui-kit/popover";
import { Radio, RadioGroup } from "@otp/space-ui-kit/radio";
import { Typography } from "@otp/space-ui-kit/typography";
import type { AssistantRole } from "./my-assistants-model";

/**
 * Сценарии матрицы для показа прототипа. Роль ассистента в продукте скрыта и задаётся уровнем
 * руководителя; здесь её переключает модератор. У роли без прав на создание столбца нет.
 */
const scenarios: { role: AssistantRole; title: string; description: string }[] = [
  {
    role: "smt",
    title: "Создание и согласование",
    description: "Оба столбца: свои заявки и заявки сотрудников",
  },
  {
    role: "assistant",
    title: "Только согласование",
    description: "Столбца «Создание и просмотр моих заявок» нет",
  },
];

type ScenarioSwitchProps = {
  role: AssistantRole;
  onRoleChange: (role: AssistantRole) => void;
};

/** Кнопка «Сценарий» в шапке демо: включает и выключает столбец создания заявок. */
export function ScenarioSwitch({ onRoleChange, role }: ScenarioSwitchProps) {
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
        {/* Превью рендерится порталом вне оболочки демо: сброс отступов абзацев — здесь же. */}
        <div className="box-border flex w-[320px] max-w-[calc(100vw-32px)] flex-col gap-spacing-xl p-spacing-xl [&_p]:m-[0px]">
          <Typography.Body.TwoM as="p">Сценарий прототипа</Typography.Body.TwoM>
          <RadioGroup
            aria-label="Сценарий прототипа"
            className="flex flex-col gap-spacing-xl"
            onValueChange={(value) => onRoleChange(value as AssistantRole)}
            value={role}
          >
            {scenarios.map((scenario) => (
              <FieldItem key={scenario.role} className="items-start">
                <Radio tone="lime" value={scenario.role} />
                <span className="flex flex-col gap-spacing-xxs">
                  <Typography.Body.TwoR>{scenario.title}</Typography.Body.TwoR>
                  <Typography.Body.ThreeR color="tertiary">
                    {scenario.description}
                  </Typography.Body.ThreeR>
                </span>
              </FieldItem>
            ))}
          </RadioGroup>
        </div>
      </PopoverContent>
    </Popover>
  );
}
