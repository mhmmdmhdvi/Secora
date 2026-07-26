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
        isCodeLike ? " inline-block text-left [unicode-bidi:isolate]" : ""
      }${part.breakAll ? " break-all" : ""}`}
    >
      {part.text}
    </span>
  );
}

function renderCredentialPair(labelPart, valuePart, key) {
  return (
    <span key={key} dir="ltr" className="inline-block text-left [unicode-bidi:isolate]">
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
  const textPaddingClass = isPersian ? "pl-8" : "pr-8";
  const arrowPositionClass = isPersian ? "left-4" : "right-4";
  const arrow = isPersian ? "←" : "→";

  return (
    <div
      className="w-full max-w-2xl p-5 sm:p-6 bg-surface text-text border rounded-2xl cursor-pointer
      border-border active:scale-[0.98] transition touch-manipulation relative"
      onClick={nextStep}
    >
      <p className={`leading-7 text-sm sm:text-base ${textPaddingClass}`}>
        {renderStepContent(steps[step] || [])}
      </p>

      <span
        className={`absolute ${arrowPositionClass} bottom-4 text-lg text-text-muted`}
      >
        {arrow}
      </span>
    </div>
  );
}

export default SQLInjectionInstructionCard;
