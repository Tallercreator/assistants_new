import { toast } from "sonner";

import { showAlertToast } from "@otp/space-ui-kit/alert-toast";

export const notify = (title: string) => showAlertToast({ status: "success", title });

/** Тост с «Вернуть»: по клику действие откатывается, а тост закрывается сразу. */
export function notifyWithUndo(title: string, onUndo: () => void) {
  const id = showAlertToast({
    actionLabel: "Вернуть",
    onAction: () => {
      toast.dismiss(id);
      onUndo();
    },
    status: "success",
    title,
  });
}
