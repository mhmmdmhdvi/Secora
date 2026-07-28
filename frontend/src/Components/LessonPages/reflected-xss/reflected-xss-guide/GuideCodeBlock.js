export default function GuideCodeBlock({ code }) {
  return (
    <div
      dir="ltr"
      className="my-5 overflow-hidden rounded-lg border border-gray-800 bg-[#1f1f1f] text-left shadow-sm"
    >
      <pre className="overflow-x-auto px-4 py-4 text-xs leading-6 text-gray-100 sm:px-5 sm:text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
}
