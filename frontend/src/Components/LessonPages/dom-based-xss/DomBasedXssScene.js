import { useEffect, useRef } from "react";

import domXssGif from "../../../assets/lessons/DOM-based-XSS.gif";
import haxxedGif from "../../../assets/lessons/haxxed.gif";
import malPensive from "../../../assets/lessons/mal-pensive.png";
import malSucceed from "../../../assets/lessons/mal-succeed.png";
import xssImage from "../../../assets/lessons/xss.png";

function DomBasedXssScene({ scene, simulation }) {
  if (!scene) return null;

  return (
    <div className="mt-2 flex w-full justify-center sm:mt-4">
      <div className="flex w-full max-w-6xl flex-col items-center justify-center gap-5 sm:gap-6 xl:flex-row xl:items-start 2xl:max-w-7xl">
        <SceneCard scene={scene} simulation={simulation} />
      </div>
    </div>
  );
}

function SceneCard({ scene, simulation }) {
  switch (scene.type) {
    case "xss-image":
      return <LessonImage />;
    case "chinterest-scroll":
      return <ChinterestBrowser site={simulation.site} mode="scroll" />;
    case "chinterest-restore":
      return <ChinterestBrowser site={simulation.site} mode="restore" />;
    case "dangerous-code":
      return <CodeBox code={simulation.code} />;
    case "mal-payload":
      return <MalPayloadScene attack={simulation.attack} code={simulation.code} />;
    case "hacked-site":
      return <HackedScene attack={simulation.attack} />;
    default:
      return null;
  }
}

function LessonImage() {
  return (
    <div className="flex w-full max-w-3xl items-center justify-center rounded-3xl border border-border bg-surface p-4 shadow-lg shadow-black/5 sm:p-6">
      <img
        src={xssImage}
        alt="XSS illustration"
        className="max-h-[22rem] w-full max-w-lg object-contain"
      />
    </div>
  );
}

function BrowserShell({ url, children, className = "" }) {
  return (
    <div
      dir="ltr"
      className={`w-full max-w-full overflow-hidden rounded-2xl border border-slate-300 bg-white text-left text-slate-950 shadow-xl shadow-slate-900/10 sm:max-w-2xl ${className}`}
    >
      <div className="flex items-center gap-1.5 border-b border-slate-300 bg-slate-100 px-2 py-1.5 sm:gap-2 sm:px-3 sm:py-2">
        <button className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-slate-200 text-xl leading-none text-slate-500 sm:h-8 sm:w-8 sm:text-2xl">
          ‹
        </button>
        <button className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-slate-200 text-xl leading-none text-slate-500 sm:h-8 sm:w-8 sm:text-2xl">
          ›
        </button>
        <div className="min-w-0 flex-1 rounded-full border-2 border-slate-600 bg-white px-2 py-1 font-mono text-[10px] text-slate-950 sm:px-3 sm:text-xs">
          <span className="block truncate">{url}</span>
        </div>
      </div>
      {children}
    </div>
  );
}

function ChinterestBrowser({ site, mode }) {
  const scrollerRef = useRef(null);
  const url = `${site.url}${mode === "restore" ? site.restored_hash : site.hash}`;

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return undefined;

    scroller.scrollTop = 0;
    const interval = setInterval(() => {
      const nextPosition = scroller.scrollTop + 2;
      if (nextPosition >= scroller.scrollHeight - scroller.clientHeight) {
        scroller.scrollTop = 0;
        return;
      }
      scroller.scrollTop = nextPosition;
    }, 30);

    return () => clearInterval(interval);
  }, [mode]);

  return (
    <BrowserShell url={url}>
      <div className="bg-fuchsia-600 px-4 py-4 text-white sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-mono text-3xl font-black tracking-tight sm:text-4xl">
              {site.name}
            </h2>
            <p className="mt-1 font-mono text-xs font-semibold sm:text-sm">
              {site.tagline}
            </p>
          </div>
          <div className="rounded-full bg-white/15 px-3 py-2 font-mono text-xs font-bold sm:text-sm">
            <span>{site.page_label}: </span>
            <span id="page-no">{site.hash.replace("#", "")}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-0 sm:grid-cols-[1fr_12rem]">
        <div
          ref={scrollerRef}
          className="h-[23rem] overflow-y-auto bg-slate-50 p-4 sm:h-[25rem] sm:p-5"
        >
          <div className="columns-2 gap-3 sm:columns-3 sm:gap-4">
            {site.cards.concat(site.cards).map((card, index) => (
              <div
                key={`${card}-${index}`}
                className="mb-3 break-inside-avoid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div
                  className={`flex items-center justify-center bg-gradient-to-br p-6 text-4xl ${
                    index % 4 === 0
                      ? "from-pink-100 to-orange-100"
                      : index % 4 === 1
                        ? "from-blue-100 to-cyan-100"
                        : index % 4 === 2
                          ? "from-emerald-100 to-lime-100"
                          : "from-violet-100 to-fuchsia-100"
                  }`}
                >
                  {["✨", "🪴", "🍞", "🔐"][index % 4]}
                </div>
                <p className="p-3 font-mono text-xs font-bold leading-5 text-slate-700">
                  {card}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-slate-200 bg-white p-4 font-mono text-xs leading-6 text-slate-600 sm:border-l sm:border-t-0">
          {mode === "restore" ? (
            <p>{site.restore_note}</p>
          ) : (
            <p>
              The hash in the address bar quietly follows the user's scroll
              position.
            </p>
          )}
        </div>
      </div>
    </BrowserShell>
  );
}

function CodeBox({ code, compact = false }) {
  return (
    <div
      dir="ltr"
      className={`w-full max-w-full overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 text-left shadow-xl shadow-black/20 ${
        compact ? "sm:max-w-lg" : "sm:max-w-2xl"
      }`}
    >
      <div className="border-b border-slate-700 bg-slate-900 px-4 py-3 font-mono text-xs text-slate-300 sm:text-sm">
        {code.header}
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap p-4 font-mono text-xs leading-6 text-cyan-200 sm:p-5 sm:text-sm">
        {code.body}
      </pre>
    </div>
  );
}

function PayloadBubble({ payload }) {
  return (
    <div
      dir="ltr"
      className="w-full max-w-[17rem] rounded-2xl bg-blue-400 px-3 py-2.5 text-left font-mono text-[11px] font-bold leading-5 text-white shadow-lg shadow-blue-500/20 [overflow-wrap:anywhere] sm:max-w-[19rem] sm:px-4 sm:py-3 sm:text-xs"
    >
      {payload}
    </div>
  );
}

function MalPayloadScene({ attack, code }) {
  return (
    <>
      <div className="flex w-full shrink-0 flex-col items-center xl:w-auto">
        <PayloadBubble payload={attack.payload_url} />
        <img
          src={malPensive}
          alt="Mal thinking about a DOM XSS payload"
          className="mt-3 w-36 max-w-full object-contain sm:w-48 lg:w-56 xl:w-60"
        />
      </div>
      <CodeBox code={code} compact />
    </>
  );
}

function HackedScene({ attack }) {
  return (
    <>
      <img
        src={malSucceed}
        alt="Mal succeeded"
        className="w-36 max-w-full object-contain sm:w-48 lg:w-56 xl:w-60"
      />
      <BrowserShell url={attack.hacked_url} className="sm:max-w-lg">
        <div className="bg-slate-950 p-5 text-center text-white sm:p-6">
          <img
            src={haxxedGif || domXssGif}
            alt="Haxxed"
            className="mx-auto max-h-44 w-full max-w-sm object-contain"
          />
          <h2 className="mt-4 font-mono text-2xl font-black text-red-300 sm:text-3xl">
            {attack.hacked_title}
          </h2>
          <p className="mx-auto mt-3 max-w-sm font-mono text-xs leading-6 text-slate-300 sm:text-sm">
            {attack.hacked_message}
          </p>
        </div>
      </BrowserShell>
    </>
  );
}

export default DomBasedXssScene;
