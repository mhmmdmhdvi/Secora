import Button from "./Button";
import Callout from "./Callout";
import { useTranslation } from "react-i18next";

function ErrorState({
  actionLabel,
  children,
  description,
  onAction,
  title,
}) {
  const { t } = useTranslation();
  const resolvedTitle = title || t("state.somethingWentWrong");
  const resolvedDescription = description || t("state.pleaseTryAgain");
  const resolvedActionLabel = actionLabel || t("state.tryAgain");

  return (
    <div className="mx-auto w-full max-w-lg">
      <Callout tone="danger" title={resolvedTitle}>
        <p>{children || resolvedDescription}</p>

        {onAction && (
          <Button
            className="mt-5"
            onClick={onAction}
            size="sm"
            variant="danger"
          >
            {resolvedActionLabel}
          </Button>
        )}
      </Callout>
    </div>
  );
}

export default ErrorState;
