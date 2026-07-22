function CodeBlock({ children, code, filename, language }) {
  const codeText = code ?? children;

  return (
    <div className="overflow-hidden rounded-2xl bg-code text-code-text shadow-lg">
      {(filename || language) && (
        <div className="border-b border-white/10 bg-black/20 px-4 py-2 font-mono text-sm text-code-text/80">
          {filename || language}
        </div>
      )}

      <pre className="overflow-x-auto p-4 text-sm leading-7">
        <code>{codeText}</code>
      </pre>
    </div>
  );
}

export default CodeBlock;
