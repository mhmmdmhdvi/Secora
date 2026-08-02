import identityProvider from "../../../assets/lessons/identity-provider.png";
import malHacking from "../../../assets/lessons/mal-hacking.png";
import malPensive from "../../../assets/lessons/mal-pensive.png";
import malSucceed from "../../../assets/lessons/mal-succeed.png";
import relyingParty from "../../../assets/lessons/relying-party.png";
import relyingPartyAuthenticated from "../../../assets/lessons/relying-party-authenticated.png";
import relyingPartyError from "../../../assets/lessons/relying-party-error.png";
import xxeProbe from "../../../assets/lessons/xxe-probe.png";

const SITE_IMAGES = {
  identity_provider: identityProvider,
  relying_party: relyingParty,
  relying_party_authenticated: relyingPartyAuthenticated,
  relying_party_error: relyingPartyError,
};

const MAL_IMAGES = {
  hacking: malHacking,
  pensive: malPensive,
  succeed: malSucceed,
};

function XxeScene({ scene, simulation }) {
  if (!scene) return null;

  return (
    <div className="mt-2 flex w-full justify-center sm:mt-4">
      <div className="flex w-full max-w-5xl flex-col items-center justify-center gap-5 sm:gap-6 xl:flex-row xl:items-center">
        <SceneCard scene={scene} simulation={simulation} />
      </div>
    </div>
  );
}

function SceneCard({ scene, simulation }) {
  switch (scene.type) {
    case "probe":
      return <ProbeImage />;
    case "browser-image":
      return <BrowserImage scene={scene} simulation={simulation} />;
    case "mal-with-browser":
      return <MalWithBrowser scene={scene} simulation={simulation} />;
    case "mal-code":
      return <MalCode scene={scene} simulation={simulation} />;
    case "mal-payload-code":
      return <MalPayloadCode scene={scene} simulation={simulation} />;
    default:
      return null;
  }
}

function ProbeImage() {
  return (
    <div className="flex w-full max-w-5xl items-center justify-center rounded-3xl border border-border bg-white p-3 shadow-lg shadow-black/5 sm:p-5">
      <img
        src={xxeProbe}
        alt="XML external entity attack flow"
        className="max-h-[34rem] w-full object-contain"
      />
    </div>
  );
}

function BrowserImage({ scene, simulation, compact = false }) {
  const image = SITE_IMAGES[scene.image];
  const site = siteMeta(scene.image, simulation);

  if (!image) return null;

  return (
    <BrowserShell url={site.url} compact={compact}>
      <div className="bg-white p-0">
        <img
          src={image}
          alt={site.alt}
          className="w-full object-contain"
          loading="lazy"
          decoding="async"
        />
      </div>
    </BrowserShell>
  );
}

function MalWithBrowser({ scene, simulation }) {
  return (
    <>
      <MalImage type={scene.mal} />
      <BrowserImage scene={scene} simulation={simulation} compact />
    </>
  );
}

function MalCode({ scene, simulation }) {
  return (
    <>
      <MalImage type={scene.mal} />
      <CodeBox code={simulation.code[scene.code]} compact />
    </>
  );
}

function MalPayloadCode({ scene, simulation }) {
  return (
    <>
      <div className="flex w-full shrink-0 flex-col items-center xl:w-auto">
        <PayloadBubble payload={simulation.payload} />
        <MalImage type={scene.mal} className="mt-3" />
      </div>
      <CodeBox code={simulation.code[scene.code]} compact />
    </>
  );
}

function MalImage({ type, className = "" }) {
  const image = MAL_IMAGES[type] || malPensive;

  return (
    <img
      src={image}
      alt="Mal attacker illustration"
      className={`w-32 max-w-full shrink-0 object-contain sm:w-44 lg:w-52 xl:w-56 ${className}`}
      loading="lazy"
      decoding="async"
    />
  );
}

function BrowserShell({ url, children, compact = false }) {
  return (
    <div
      dir="ltr"
      className={`w-full max-w-full overflow-hidden rounded-2xl border border-slate-300 bg-white text-left text-slate-950 shadow-xl shadow-slate-900/10 ${
        compact ? "sm:max-w-xl" : "sm:max-w-2xl"
      }`}
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

function CodeBox({ code, compact = false }) {
  if (!code) return null;

  return (
    <div
      dir="ltr"
      className={`w-full max-w-full overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 text-left shadow-xl shadow-black/20 ${
        compact ? "sm:max-w-md xl:max-w-[27rem]" : "sm:max-w-lg xl:max-w-[30rem]"
      }`}
    >
      <div className="border-b border-slate-700 bg-slate-900 px-4 py-3 font-mono text-xs text-slate-300 sm:text-sm">
        {code.header}
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap break-words p-4 font-mono text-[11px] leading-6 text-cyan-200 sm:p-5 sm:text-xs">
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

function siteMeta(imageKey, simulation) {
  if (imageKey === "identity_provider") {
    return simulation.sites.identity_provider;
  }

  return simulation.sites.relying_party;
}

export default XxeScene;
