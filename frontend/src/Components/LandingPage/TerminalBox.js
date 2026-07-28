import React, { useEffect, useState } from "react";

const TERMINAL_LINES = [
  { text: "Initializing SecureLearn Data Harvester...", color: "#8be9fd" },
  { text: "Connecting to target -> vuln.site:443", color: "#f1fa8c" },
  { text: "Running vulnerability scan...", color: "#8be9fd" },
  { text: "[+] Port 80 open", color: "#50fa7b" },
  { text: "[+] Port 443 open", color: "#50fa7b" },
  { text: "[!] Possible SQL injection at /login", color: "#ff5555" },
  { text: "Crafting payload: ' OR 1=1 --", color: "#ff79c6" },
  { text: "Sending payload...", color: "#8be9fd" },
  { text: "Response: HTTP 200 OK", color: "#50fa7b" },
  { text: "[+] Login bypass successful", color: "#50fa7b" },
  { text: "[*] Lesson: sanitize user inputs", color: "#f1fa8c" },
];

function TerminalBox({ compact = false }) {
  const [displayLines, setDisplayLines] = useState([]);
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (lineIndex >= TERMINAL_LINES.length) return;

    const currentLine = TERMINAL_LINES[lineIndex];

    if (charIndex < currentLine.text.length) {
      const timeout = setTimeout(() => {
        const partial = currentLine.text.substring(0, charIndex + 1);

        setDisplayLines((prev) => {
          const updated = [...prev];
          if (updated[lineIndex]) {
            updated[lineIndex] = { ...currentLine, text: partial };
          } else {
            updated.push({ ...currentLine, text: partial });
          }
          return updated;
        });

        setCharIndex((prev) => prev + 1);
      }, 35);

      return () => clearTimeout(timeout);
    }

    const lineTimeout = setTimeout(() => {
      setLineIndex((prev) => prev + 1);
      setCharIndex(0);
    }, 600);

    return () => clearTimeout(lineTimeout);
  }, [charIndex, lineIndex]);

  return (
    <div
      dir="ltr"
      className={`w-full bg-[#282a36] rounded-2xl border-[3px] border-[#44475a] overflow-hidden font-mono text-left shadow-[0_12px_40px_rgba(0,0,0,0.25)] ${
        compact
          ? "max-w-[520px] min-h-[300px] sm:min-h-[360px] lg:min-h-[430px]"
          : "max-w-[584px] min-h-[320px] sm:min-h-[380px] lg:min-h-[494px]"
      }`}
    >
      {/* HEADER */}
      <div className="bg-[#44475a] h-10 flex items-center justify-between px-3 sm:px-4">
        <div className="flex gap-1.5 shrink-0">
          <span className="w-3 h-3 rounded-full bg-[#ff5555]"></span>
          <span className="w-3 h-3 rounded-full bg-[#f1fa8c]"></span>
          <span className="w-3 h-3 rounded-full bg-[#50fa7b]"></span>
        </div>

        <div className="text-[#f8f8f2] text-[11px] sm:text-[13px] font-semibold truncate ml-3">
          Data Harvester - Incoming Streams
        </div>
      </div>

      {/* BODY */}
      <div
        className={`p-4 sm:p-5 text-[13px] sm:text-[14px] leading-7 text-white overflow-y-auto ${
          compact
            ? "h-[260px] sm:h-[320px] lg:h-[386px]"
            : "h-[280px] sm:h-[340px] lg:h-[450px] lg:text-[15px]"
        }`}
      >
        {displayLines.map((line, index) => (
          <div
            key={index}
            style={{ color: line.color }}
            className="break-words"
          >
            {line.text}
          </div>
        ))}

        <span className="inline-block w-[8px] h-[16px] bg-[#bd93f9] ml-[5px] animate-pulse align-middle"></span>
      </div>
    </div>
  );
}

export default TerminalBox;
