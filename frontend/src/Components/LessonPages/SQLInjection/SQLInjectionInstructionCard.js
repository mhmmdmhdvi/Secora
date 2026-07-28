import { useTranslation } from "react-i18next";

import { normalizeLanguage } from "../../../i18n";

function isCodeLikeText(text) {
  return /[A-Za-z0-9_@'.=-]/.test(text) && !/[\u0600-\u06FF]/.test(text);
}

function renderMutedPart(part, key) {
  const isCodeLike = isCodeLikeText(part.text);

  return (
    <span
      key={key}
      dir={isCodeLike ? "ltr" : undefined}
      className={`text-text-muted${
        isCodeLike ? " inline-block max-w-full break-words text-left [unicode-bidi:isolate]" : ""
      }${part.breakAll ? " break-all" : ""}`}
    >
      {part.text}
    </span>
  );
}

function renderCredentialPair(labelPart, valuePart, key) {
  return (
    <span
      key={key}
      dir="ltr"
      className="inline-block max-w-full break-words text-left [unicode-bidi:isolate]"
    >
      {labelPart.text}
      <span className="text-text-muted">{valuePart.text}</span>
    </span>
  );
}

function renderStepContent(parts) {
  const content = [];

  for (let index = 0; index < parts.length; index += 1) {
    const part = parts[index];
    const nextPart = parts[index + 1];
    const isCodeLabel = part.type === "text" && /^(Email|Password):\s*$/.test(part.text);

    if (isCodeLabel && nextPart?.type === "muted") {
      content.push(renderCredentialPair(part, nextPart, index));
      index += 1;
      continue;
    }

    if (part.type === "break") {
      content.push(<br key={index} />);
    } else if (part.type === "strong") {
      content.push(<strong key={index}>{part.text}</strong>);
    } else if (part.type === "muted") {
      content.push(renderMutedPart(part, index));
    } else {
      content.push(<span key={index}>{part.text}</span>);
    }
  }

  return content;
}

function SQLInjectionInstructionCard({ step, nextStep, steps }) {
  const { i18n } = useTranslation();
  const isPersian = normalizeLanguage(i18n.language) === "fa";
  const textPaddingClass = isPersian ? "pl-6" : "pr-6";
  const arrowPositionClass = isPersian ? "left-3 sm:left-4" : "right-3 sm:right-4";
  const arrow = isPersian ? "←" : "→";

  return (
    <button
      type="button"
      className="relative w-full max-w-2xl rounded-2xl border border-border bg-surface p-4 text-text transition active:scale-[0.98] sm:p-5 md:p-6"
      onClick={nextStep}
    >
      <p
        className={`break-words text-sm leading-7 sm:text-base ${textPaddingClass} ${
          isPersian ? "text-right" : "text-left"
        }`}
      >
        {renderStepContent(steps[step] || [])}
      </p>

      <span
        className={`absolute ${arrowPositionClass} bottom-3 text-sm text-text-muted sm:bottom-4 sm:text-base`}
      >
        {arrow}
      </span>
    </button>
  );
}

export default SQLInjectionInstructionCard;
