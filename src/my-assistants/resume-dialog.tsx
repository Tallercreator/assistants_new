import { useState } from "react";

import { Button } from "@otp/space-ui-kit/button";
import {
  Popup,
  PopupActionPanel,
  PopupBody,
  PopupContent,
  PopupHeader,
} from "@otp/space-ui-kit/popup";
import type { Assistant } from "./my-assistants-model";
import { PeriodField, type Period } from "./period-field";

/** Новый срок по умолчанию: с сегодня до исходного окончания, если оно ещё не наступило. */
function initialPeriod(assistant: Assistant, today: Date): Period {
  const planned = assistant.beforePause;
  const end = planned?.end && planned.end > today ? planned.end : null;
  return { start: today, end, indefinite: planned?.indefinite ?? false };
}

type ResumeFormProps = {
  assistant: Assistant;
  today: Date;
  onClose: () => void;
  onResume: (period: Period) => void;
};

/** Форма монтируется заново при каждом открытии: срок всегда считается от исходного. */
function ResumeForm({ assistant, onClose, onResume, today }: ResumeFormProps) {
  const [period, setPeriod] = useState(() => initialPeriod(assistant, today));
  const [error, setError] = useState<string>();
  const submit = () => {
    if (!period.start || (!period.indefinite && !period.end)) {
      setError("Укажи начало и окончание срока.");
      return;
    }
    onResume(period);
  };
  return (
    <>
      <PopupHeader
        closeLabel="Закрыть"
        description="Выбери срок, в течение которого ассистент снова сможет действовать от твоего имени. Полномочия останутся такими же, как до приостановки."
        showCloseButton
        title="Возобновить полномочия ассистента?"
        type="subtitle"
      />
      <PopupBody>
        <PeriodField
          error={error}
          layout="stacked"
          onChange={(next) => {
            setPeriod(next);
            setError(undefined);
          }}
          value={period}
        />
      </PopupBody>
      <PopupActionPanel>
        <Button onClick={onClose} size="large" variant="secondary">
          Отменить
        </Button>
        <Button onClick={submit} size="large">
          Возобновить
        </Button>
      </PopupActionPanel>
    </>
  );
}

type ResumeDialogProps = Omit<ResumeFormProps, "assistant"> & { assistant: Assistant | null };

/** Возобновление приостановленного ассистента: выбор нового срока и подтверждение. */
export function ResumeDialog({ assistant, ...props }: ResumeDialogProps) {
  return (
    <Popup onClose={props.onClose} open={assistant !== null}>
      <PopupContent className="w-[640px] max-w-[calc(100vw-32px)] min-w-unit-0">
        {assistant ? <ResumeForm assistant={assistant} {...props} /> : null}
      </PopupContent>
    </Popup>
  );
}
