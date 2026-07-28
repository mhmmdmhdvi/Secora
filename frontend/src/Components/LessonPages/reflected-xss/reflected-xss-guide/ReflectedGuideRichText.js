export default function ReflectedGuideRichText({ parts }) {
  if (!Array.isArray(parts)) return null;

  return parts.map((part, index) => {
    const key = `${part.type}-${part.text || "empty"}-${index}`;

    if (part.type === "strong") {
      return <strong key={key}>{part.text}</strong>;
    }

    if (part.type === "em") {
      return <em key={key}>{part.text}</em>;
    }

    if (part.type === "link") {
      return (
        <span
          key={key}
          className="cursor-default underline decoration-border underline-offset-4"
        >
          {part.text}
        </span>
      );
    }

    if (part.type === "highlight") {
      return (
        <span
          key={key}
          className="inline rounded-md bg-blue-100 px-2 py-1 font-semibold italic text-blue-950 dark:bg-blue-500/20 dark:text-blue-100"
        >
          {part.text}
        </span>
      );
    }

    if (part.type === "code") {
      return (
        <code
          key={key}
          dir="ltr"
          className="inline-block max-w-full break-words rounded bg-surface-muted px-1.5 py-0.5 font-mono text-[0.9em] text-text"
        >
          {part.text}
        </code>
      );
    }

    return <span key={key}>{part.text}</span>;
  });
}
