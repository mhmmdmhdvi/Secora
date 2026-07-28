import React, { useEffect, useState } from "react";

import malPensive from "../../../assets/lessons/mal-pensive.png";
import vicBaking from "../../../assets/lessons/vic-baking.png";

const ACTOR_ASSETS = {
  mal: {
    src: malPensive,
    alt: "Mal",
  },
  vic: {
    src: vicBaking,
    alt: "Vic",
  },
};

function ReflectedXssScene({ scene, simulation }) {
  if (!scene) return null;

  const actor = ACTOR_ASSETS[scene.actor];
  const showsThoughtBubble = scene.type === "payload-craft";

  return (
    <div className="mt-2 flex w-full justify-center sm:mt-4">
      <div className="flex w-full max-w-6xl flex-col items-center justify-center gap-4 sm:gap-5 xl:flex-row xl:items-start 2xl:max-w-7xl">
        {actor && (
          <div className="flex w-full shrink-0 flex-col items-center xl:w-auto">
            {showsThoughtBubble && (
              <PayloadBubble
                payload={simulation.site.payload_url}
                className="mb-3 w-full max-w-[15rem] sm:max-w-[17rem]"
              />
            )}
            <img
              src={actor.src}
              alt={actor.alt}
              className="w-36 max-w-full object-contain sm:w-48 lg:w-56 xl:w-60 2xl:w-64"
            />
          </div>
        )}

        <SceneCard scene={scene} simulation={simulation} />
      </div>
    </div>
  );
}

function SceneCard({ scene, simulation }) {
  switch (scene.type) {
    case "welp-home":
      return <WelpBrowser site={simulation.site} mode="home" size="small" />;
    case "welp-results":
      return <WelpBrowser site={simulation.site} mode="results" size="small" />;
    case "payload-craft":
      return <WelpBrowser site={simulation.site} mode="home" size="small" />;
    case "hacked":
    case "victim-hacked":
      return <HackedBox hacked={simulation.hacked} />;
    case "victim-intro":
      return <CharacterCard eyebrow={simulation.labels?.victim} label="Vic" />;
    case "email-trap":
      return <EmailTrap email={simulation.email} />;
    case "victim-click":
      return <WelpBrowser site={simulation.site} mode="attack-url" size="small" />;
    case "server-log":
      return <LogBox logs={simulation.logs} />;
    default:
      return null;
  }
}

function BrowserShell({ url, children, size = "regular" }) {
  const isSmall = size === "small";

  return (
    <div
      dir="ltr"
      className={`w-full max-w-full overflow-hidden rounded-2xl border border-slate-300 bg-white text-left text-slate-950 shadow-xl shadow-slate-900/10 ${
        isSmall ? "sm:max-w-md" : "sm:max-w-2xl"
      }`}
    >
      <div
        className={`flex items-center gap-1.5 border-b border-slate-300 bg-slate-100 px-2 sm:gap-2 sm:px-3 ${
          isSmall ? "py-1.5" : "py-2"
        }`}
      >
        <button
          className={`${isSmall ? "h-7 w-7 sm:h-8 sm:w-8" : "h-8 w-8 sm:h-9 sm:w-9"} flex shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-slate-200 text-xl leading-none text-slate-500 sm:text-2xl`}
        >
          ‹
        </button>
        <button
          className={`${isSmall ? "h-7 w-7 sm:h-8 sm:w-8" : "h-8 w-8 sm:h-9 sm:w-9"} flex shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-slate-200 text-xl leading-none text-slate-500 sm:text-2xl`}
        >
          ›
        </button>
        <div
          className={`min-w-0 flex-1 rounded-full border-2 border-slate-600 bg-white px-2 font-mono text-slate-950 sm:px-3 ${
            isSmall ? "py-1 text-[10px] sm:text-xs" : "py-1.5 text-xs sm:text-sm"
          }`}
        >
          <span className="block truncate">{url}</span>
        </div>
      </div>
      {children}
    </div>
  );
}

function WelpBrowser({ site, mode, size = "regular" }) {
  const isSmall = size === "small";
  const url =
    mode === "results"
      ? `${site.url}?search=${site.safe_query}`
      : mode === "attack-url"
        ? `${site.url}?search=${site.attack_query}`
        : site.url;

  return (
    <BrowserShell url={url} size={size}>
      <div
        className={`bg-red-600 text-white ${
          isSmall ? "px-4 py-3 sm:px-5 sm:py-4" : "px-5 py-4 sm:px-6 sm:py-5"
        }`}
      >
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div className="min-w-0">
            <div
              className={`font-sans font-black leading-none tracking-[-0.08em] text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.9)] ${
                isSmall ? "text-4xl sm:text-6xl" : "text-5xl sm:text-7xl"
              }`}
            >
              {site.name}
            </div>
            <p
              className={`mt-2 max-w-full break-words font-mono font-semibold sm:mt-3 ${
                isSmall ? "text-[11px] sm:text-sm" : "text-xs sm:text-base"
              }`}
            >
              {site.tagline}
            </p>
          </div>
          <div
            className={`hidden shrink-0 font-mono font-black sm:block ${
              isSmall ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"
            }`}
          >
            ¯\_(ツ)_/¯
          </div>
        </div>
      </div>

      <div
        className={`font-mono leading-7 ${
          isSmall
            ? "min-h-44 px-4 py-4 text-xs sm:min-h-52 sm:px-5 sm:py-5 sm:text-sm"
            : "min-h-56 px-5 py-5 text-sm sm:min-h-64 sm:px-6 sm:py-6 sm:text-base"
        }`}
      >
        {mode === "results" ? (
          <SearchResults site={site} isSmall={isSmall} />
        ) : (
          <>
            <p className="max-w-md">{site.empty_message}</p>
            <div className="mt-6 rounded-2xl border-2 border-slate-500 px-3 py-2.5 text-slate-400 sm:mt-8 sm:px-4 sm:py-3">
              {site.placeholder}
            </div>
          </>
        )}
      </div>
    </BrowserShell>
  );
}

function SearchResults({ site, isSmall = false }) {
  return (
    <div>
      <p className="font-bold">{site.results_title}</p>
      <div className={`${isSmall ? "mt-4 space-y-4" : "mt-5 space-y-5"}`}>
        {site.results.map((result) => (
          <div key={result.name} className="flex gap-3 sm:gap-4">
            <div
              className={`flex shrink-0 items-center justify-center ${
                isSmall ? "h-14 w-14 text-4xl sm:h-16 sm:w-20 sm:text-5xl" : "h-24 w-28 text-7xl"
              }`}
            >
              🌮
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-500">{result.name}</h3>
              <div className="mt-1 flex gap-1" aria-label={`${result.rating} stars`}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center justify-center rounded text-[10px] ${
                      isSmall ? "h-3.5 w-3.5 sm:h-4 sm:w-4" : "h-5 w-5"
                    } ${
                      index < result.rating
                        ? "bg-orange-400 text-white"
                        : "bg-slate-300 text-white"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className={`${isSmall ? "mt-2" : "mt-3"} max-w-xs`}>
                {result.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PayloadBubble({ payload, className = "" }) {
  return (
    <div
      dir="ltr"
      className={`rounded-2xl bg-blue-400 px-3 py-2.5 text-left font-mono text-[11px] font-bold leading-5 text-white shadow-lg shadow-blue-500/20 [overflow-wrap:anywhere] sm:px-4 sm:py-3 sm:text-xs ${className}`}
    >
      {payload}
    </div>
  );
}

function HackedBox({ hacked }) {
  return (
    <div
      dir="ltr"
      className="w-full max-w-full overflow-hidden rounded-3xl border border-red-400/50 bg-slate-950 text-left shadow-2xl shadow-red-950/30 sm:max-w-lg"
    >
      <div className="border-b border-red-400/30 bg-red-500/10 px-4 py-4 sm:px-5">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-red-300 sm:text-sm sm:tracking-[0.24em]">
          {hacked.host}
        </p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-red-200 sm:text-3xl">
          {hacked.title}
        </h2>
      </div>
      <div className="px-4 py-5 font-mono text-xs leading-7 text-slate-200 sm:px-5 sm:text-sm">
        <p>{hacked.message}</p>
        <div className="mt-5 rounded-2xl border border-red-400/30 bg-red-500/10 px-3 py-3 text-red-200 [overflow-wrap:anywhere] sm:px-4">
          <span className="text-red-300">{hacked.cookie_label}:</span>{" "}
          asdfefefffasdfCsdfnEfefffasdfnEf
        </div>
      </div>
    </div>
  );
}

function CharacterCard({ eyebrow, label }) {
  return (
    <div className="w-full max-w-full rounded-3xl border border-border bg-surface p-5 text-center shadow-lg shadow-black/5 sm:max-w-md sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary sm:text-sm sm:tracking-[0.24em]">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-bold text-text sm:text-3xl">{label}</h2>
    </div>
  );
}

function EmailTrap({ email }) {
  return (
    <BrowserShell url={email.url} size="small">
      <div className="px-4 py-5 font-mono text-xs text-slate-950 sm:px-5 sm:text-sm">
        <p>
          <strong>Subject:</strong> {email.subject}
        </p>
        <p>
          <strong>To:</strong> {email.to}
        </p>
        <div className="flex justify-center py-6 text-7xl sm:py-8 sm:text-8xl">🌮</div>
        <button className="w-full bg-slate-950 px-3 py-3 text-xs font-black uppercase tracking-wide text-white sm:px-4 sm:py-4 sm:text-sm">
          {email.button}
        </button>
      </div>
    </BrowserShell>
  );
}

function LogBox({ logs }) {
  const [visibleLineCount, setVisibleLineCount] = useState(1);

  useEffect(() => {
    setVisibleLineCount(1);

    const interval = setInterval(() => {
      setVisibleLineCount((current) => {
        if (current >= logs.lines.length) {
          clearInterval(interval);
          return current;
        }
        return current + 1;
      });
    }, 220);

    return () => clearInterval(interval);
  }, [logs.lines.length]);

  return (
    <div
      dir="ltr"
      className="w-full max-w-full overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 text-left shadow-xl shadow-black/20 sm:max-w-md"
    >
      <div className="border-b border-slate-700 bg-slate-900 px-4 py-3 font-mono text-xs text-slate-300 sm:text-sm">
        {logs.header}
      </div>
      <pre className="max-h-[22rem] overflow-auto whitespace-pre-wrap break-words p-3 font-mono text-[11px] leading-5 text-green-300 sm:p-4 sm:text-xs sm:leading-6">
        {logs.lines.slice(0, visibleLineCount).join("\n")}
        <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-green-300 align-middle" />
      </pre>
    </div>
  );
}

export default ReflectedXssScene;
