export default function TerminalBox({ children }) {
  return (
    <div className="w-full rounded-lg overflow-hidden shadow-xl border border-gray-700 my-6">
      
      {/* Header */}
      <div className="flex items-center gap-2 bg-gray-800 px-3 sm:px-4 py-2">
        <span className="w-3 h-3 rounded-full bg-red-500"></span>
        <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
        <span className="w-3 h-3 rounded-full bg-green-500"></span>
      </div>

      {/* Body */}
      <div className="bg-gray-900 px-3 sm:px-5 lg:px-6 py-3 sm:py-4 overflow-x-auto">
        <pre className="whitespace-pre-wrap break-words font-mono text-xs sm:text-sm lg:text-base leading-relaxed text-gray-100">
          {children}
        </pre>
      </div>

    </div>
  );
}
