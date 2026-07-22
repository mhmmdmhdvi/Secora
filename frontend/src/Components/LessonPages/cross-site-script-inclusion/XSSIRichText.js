export function XSSIRichText({ parts }) {
  return parts.map((part, index) => {
    if (part.type === "break") return <br key={index} />;
    if (part.type === "strong") return <strong key={index}>{part.text}</strong>;
    return <span key={index}>{part.text}</span>;
  });
}
