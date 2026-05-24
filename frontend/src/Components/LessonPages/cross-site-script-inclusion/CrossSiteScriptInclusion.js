import { useState } from "react";

function CrossSiteScriptInclusion() {
  const [step, setStep] = useState(0);

  const nextStep = () => {
    if (step < 9) setStep(step + 1);
  };

  const codeBlocks = {
    step2: `/**
 * Attempt to access a user's profile page.
 */
fetch('https://www.facebooke.com/profile').catch((err) => {
  // The browser will cause this code to fail because the page
  // lives at a different origin. This prevents hackers scraping
  // data.
});`,

    step3: `/**
 * Load in a JavaScript library from another origin.
 */
fetch('https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.js').then((response) => {
  // This will succeed because browsers will allow
  // JavaScript to be loaded from other origins.
});`,

    step5: `@app.route('/js/bundle.js')
def javascript:
  """Don't ever do this!"""
  return render_template('js/bundle.js', INSERT_API_KEY_HERE=session.api_key)`,

    step6: `export default class App extends React.Component {
  state = {
    message: 'Welcome, new user! Fetching your data...',
    apiKey: '{{INSERT_API_KEY_HERE}}',
  };

  componentDidMount() {
    // Load in data using the pre-populated API key.
    fetch('/api/profile', {
      headers: {
        Authorization: 'Basic ' + base64.encode(this.state.apiKey + ':'),
      },
    }).then(loadWelcomePage);
  }

  render() {
    return (
      <div className="component-app">
        <Message value={this.state.message} />
      </div>
    );
  }
}`,

    step7: `export default class App extends React.Component {
  state = {
    message: 'Welcome, new user! Fetching your data...',
    apiKey: 'c9e2d730-4aba-42b2-9711-26ad584cba35',
  };

  componentDidMount() {
    fetch('/api/profile', {
      headers: {
        Authorization: 'Basic ' + base64.encode(this.state.apiKey + ':'),
      },
    }).then(loadWelcomePage);
  }

  render() {
    return (
      <div className="component-app">
        <Message value={this.state.message} />
      </div>
    );
  }
}`,

    step8: `<script>

/**
 * If this script is hosted on an attacker's website, and one of your
 * users is tricked into visiting that site...
 */
fetch('https://www.yourwebsite.com/js/bundle.js')
 .then(response => {
   /**
    * ...the attacker extracts the API key here, and start impersonating
    * your user.
    */
 });

</script>`
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-6 sm:mt-10 px-4 sm:px-6 lg:px-8 pb-12">

      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-8">
        Cross‑Site Script Inclusion (XSSI)
      </h1>

      {/* dots */}
      <div className="flex justify-center gap-2 sm:gap-3 mb-6 sm:mb-10 flex-wrap">
        {Array.from({ length: 10 }).map((_, i) => (
          <button
            key={i}
            className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 rounded-full transition-transform
            ${i === step ? "bg-blue-500 scale-125" : ""}
            ${i < step ? "bg-gray-600" : "bg-gray-300"}`}
            onClick={() => setStep(i)}
          />
        ))}
      </div>

      {/* final step */}
      {step === 9 && (
        <div className="flex justify-center">
          <div
            className="w-full max-w-2xl p-6 sm:p-7 bg-gray-100 rounded-2xl cursor-pointer
            border hover:shadow-xl active:scale-[0.98] transition text-center"
            onClick={() =>
              (window.location.href =
                "/lessons/cross-site-script-inclusion-guide")
            }
          >
            <p className="text-sm sm:text-base">
              XSSI is an often‑overlooked risk, so we should learn how to spot
              it.
            </p>
          </div>
        </div>
      )}

      {step !== 9 && (
        <div className="flex flex-col items-center gap-6">

          {/* text box */}
          <div
            className="w-full max-w-2xl p-5 sm:p-6 bg-white border rounded-2xl cursor-pointer
            border-black active:scale-[0.98] transition touch-manipulation relative"
            onClick={nextStep}
          >
            <p className="leading-7 text-sm sm:text-base pr-6">
              {step === 0 &&
                <>Browsers keep the user secure by implementing the <strong>same-origin policy</strong>: two pages are allowed to interact if they are loaded from the same <strong>domain, port</strong> and <strong>protocol</strong>.</>}

              {step === 1 &&
                <>This policy prevents malicious websites from reading sensitive data from other sites when a user visits them.</>}

              {step === 2 &&
                <>JavaScript files are not subject to the same‑origin policy. Websites often load scripts from third‑party domains like Google CDN.</>}

              {step === 3 &&
                <>The same works in reverse. Any JavaScript hosted on your site can be imported by third‑party websites.</>}

              {step === 4 &&
                <>If you embed sensitive information directly into JavaScript files, attackers may be able to read it.</>}

              {step === 5 &&
                <>Imagine your website is a Single Page Application (SPA) that dynamically updates the DOM.</>}

              {step === 6 &&
                <>Such apps often keep state in memory. Developers sometimes inject API keys into the JavaScript to improve load time.</>}

              {step === 7 &&
                <>But a malicious site could simply import your JavaScript file and extract the API key.</>}

              {step === 8 &&
                <>This allows attackers to impersonate your users and access their data.</>}
            </p>

            <span className="absolute right-3 bottom-3 sm:right-4 sm:bottom-4 text-gray-400 text-sm sm:text-base">
  →
</span>

          </div>

          {/* special table for step 0 */}
          {step === 0 && (
  <div className="w-full max-w-2xl bg-gray-900 text-yellow-400 p-4 sm:p-6 rounded-2xl font-mono text-[11px] sm:text-sm overflow-x-auto">
    <div className="text-center mb-4">
      Only the followings URLs are considered to have the same origin as https://www.example.com:
    </div>

    <pre className="whitespace-pre">
{`URL                                    Same Origin?
https://www.example.com/profile        Yes - everything maches
http://www.example.com                 No - the protocol differs
https://www.anotherwebsite.com         No - the domain differs
https://www.example.com:8080           No - the port differs`}
    </pre>
  </div>
)}


          {/* code blocks */}
          {step === 1 && (
  <div className="w-full max-w-2xl bg-gray-900 rounded-2xl overflow-hidden shadow-lg">
    <div className="bg-gray-800 text-gray-300 px-4 py-2 text-sm font-mono">
      hack-attempt.js
    </div>

    <pre className="p-3 sm:p-4 font-mono text-[10px] sm:text-xs md:text-sm leading-relaxed whitespace-pre-wrap">

<span className="text-gray-400">/**</span>
{"\n"}
<span className="text-gray-400"> * Attempt to access a user's profile page.</span>
{"\n"}
<span className="text-gray-400"> */</span>
{"\n"}

<span className="text-orange-400">fetch</span>
<span className="text-white">(</span>
<span className="text-green-400">'https://www.facebooke.com/profile'</span>
<span className="text-white">)</span>
<span className="text-orange-400">.catch</span>
<span className="text-white">((err) =&gt; {"{"}</span>

{"\n"}  <span className="text-gray-400">// The browser will cause this code to fail because the page</span>
{"\n"}  <span className="text-gray-400">// lives at a different origin. This prevents hackers scraping</span>
{"\n"}  <span className="text-gray-400">// data.</span>

{"\n"}<span className="text-white">{"}"}</span>
<span className="text-white">);</span>

    </pre>
  </div>
)}


          {step === 2 && (
  <div className="w-full max-w-2xl bg-gray-900 rounded-2xl overflow-hidden shadow-lg">
    <div className="bg-gray-800 text-gray-300 px-4 py-2 text-sm font-mono">
      cross-domain-loading.js
    </div>

    <pre className="p-3 sm:p-4 font-mono text-[10px] sm:text-xs md:text-sm leading-relaxed whitespace-pre-wrap">

<span className="text-gray-400">/**</span>
{"\n"}
<span className="text-gray-400"> * Load in a JavaScript library from another origin.</span>
{"\n"}
<span className="text-gray-400"> */</span>
{"\n"}

<span className="text-orange-400">fetch</span>
<span className="text-white">(</span>
<span className="text-green-400">'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.js'</span>
<span className="text-white">)</span>
<span className="text-orange-400">.then</span>
<span className="text-white">((response) =&gt; {"{"}</span>

{"\n"}  <span className="text-gray-400">// This will succeed because browsers will allow</span>
{"\n"}  <span className="text-gray-400">// JavaScript to be loaded from other origins.</span>

{"\n"}<span className="text-white">{"}"}</span>
<span className="text-white">);</span>

    </pre>
  </div>
)}


          {step === 3 && (
  <div className="w-full max-w-2xl bg-gray-900 rounded-2xl overflow-hidden shadow-lg">
    <div className="bg-gray-800 text-gray-300 px-4 py-2 text-sm font-mono">
      cross-domain-loading.js
    </div>

    <pre className="p-3 sm:p-4 font-mono text-[10px] sm:text-xs md:text-sm leading-relaxed whitespace-pre-wrap">

<span className="text-gray-400">/**</span>
{"\n"}
<span className="text-gray-400"> * Load in a JavaScript library from another origin.</span>
{"\n"}
<span className="text-gray-400"> */</span>
{"\n"}

<span className="text-orange-400">fetch</span>
<span className="text-white">(</span>
<span className="text-green-400">'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.js'</span>
<span className="text-white">)</span>
<span className="text-orange-400">.then</span>
<span className="text-white">((response) =&gt; {"{"}</span>

{"\n"}  <span className="text-gray-400">// This will succeed because browsers will allow</span>
{"\n"}  <span className="text-gray-400">// JavaScript to be loaded from other origins.</span>

{"\n"}<span className="text-white">{"}"}</span>
<span className="text-white">);</span>

    </pre>
  </div>
)}


          {step === 4 && (
  <div className="w-full max-w-2xl bg-gray-900 rounded-2xl overflow-hidden shadow-lg">
    <div className="bg-gray-800 text-gray-300 px-4 py-2 text-sm font-mono">
      unsafe-interpolation.py
    </div>

    <pre className="p-3 sm:p-4 font-mono text-[10px] sm:text-xs md:text-sm leading-relaxed whitespace-pre-wrap">

<span className="text-blue-400">@app.route</span>
<span className="text-white">(</span>
<span className="text-green-400">'/js/bundle.js'</span>
<span className="text-white">)</span>

{"\n"}
<span className="text-blue-400">def</span>
<span className="text-orange-400"> javascript</span>
<span className="text-white">:</span>

{"\n"}  <span className="text-green-400">"""Don't ever do this!"""</span>

{"\n"} <span className="text-blue-400">return </span>
<span className="text-white">render_template</span>
<span className="text-white">(</span>
<span className="text-green-400">'js/bundle.js'</span>
<span className="text-white">, INSERT_API_KEY_HERE=session.api_key)</span>

    </pre>
  </div>
)}


          {step === 5 && (
  <div className="w-full max-w-2xl bg-gray-900 rounded-2xl overflow-hidden shadow-lg">
    <div className="bg-gray-800 text-gray-300 px-4 py-2 text-sm font-mono">
      Application.jsx
    </div>

<pre className="p-3 sm:p-4 font-mono text-[10px] sm:text-xs md:text-sm leading-relaxed whitespace-pre overflow-x-auto">

<span className="text-blue-400">export default class</span>{" "}
<span className="text-orange-400">App</span>{" "}
<span className="text-blue-400">extends</span>{" "}
<span className="text-orange-400">React.Component</span>{" "}
<span className="text-white">{"{"}</span>

{"\n"}  <span className="text-white">state = {"{"}</span>

{"\n"}    <span className="text-blue-400">message</span><span className="text-white">:</span>{" "}
<span className="text-green-400">'Welcome, new user! Fetching your data...'</span><span className="text-white">,</span>

{"\n"}    <span className="text-blue-400">apiKey</span><span className="text-white">:</span>{" "}
<span className="text-green-400">{'{{INSERT_API_KEY_HERE}}'}</span><span className="text-white">,</span>

{"\n"}  <span className="text-white">{"}"};</span>

{"\n\n"}  <span className="text-orange-400">componentDidMount</span><span className="text-white">()</span>{" "}
<span className="text-white">{"{"}</span>

{"\n"}    <span className="text-gray-400">// Load in data using the pre-populated API key.</span>

{"\n"}    <span className="text-orange-400">fetch</span>
<span className="text-white">(</span>
<span className="text-green-400">'/api/profile'</span>
<span className="text-white">, {"{"}</span>

{"\n"}      <span className="text-blue-400">headers</span><span className="text-white">: {"{"}</span>

{"\n"}        <span className="text-orange-400">Authorization</span><span className="text-white">:</span>{" "}
<span className="text-green-400">'Basic '</span>{" "}
<span className="text-white">+</span>{" "}
<span className="text-white">base64.</span><span className="text-orange-400">encode</span>
<span className="text-white">(this.state.apiKey + </span>
<span className="text-green-400">':'</span>
<span className="text-white">),</span>

{"\n"}      <span className="text-white">{"}"}</span>

{"\n"}    <span className="text-white">{"}"}).then</span>
<span className="text-white">(</span>
<span className="text-white">loadWelcomePage</span>
<span className="text-white">);</span>

{"\n"}  <span className="text-white">{"}"}</span>

{"\n\n"}  <span className="text-orange-400">render</span><span className="text-white">()</span>{" "}
<span className="text-white">{"{"}</span>

{"\n"}    <span className="text-blue-400">return</span>{" "}
<span className="text-white">(</span>

{"\n"}      <span className="text-white">&lt;</span>
<span className="text-orange-400">div</span>{" "}
<span className="text-blue-400">className</span>
<span className="text-white">=</span>
<span className="text-green-400">"component-app"</span>
<span className="text-white">&gt;</span>

{"\n"}        <span className="text-white">&lt;</span>
<span className="text-orange-400">Message</span>{" "}
<span className="text-blue-400">value</span>
<span className="text-white">=</span>
<span className="text-green-400">{"{this.state.message}"}</span>{" "}
<span className="text-white">/&gt;</span>

{"\n"}      <span className="text-white">&lt;/</span>
<span className="text-orange-400">div</span>
<span className="text-white">&gt;</span>

{"\n"}    <span className="text-white">);</span>

{"\n"}  <span className="text-white">{"}"}</span>

{"\n"}<span className="text-white">{"}"}</span>

</pre>
  </div>
)}


          {step === 6 && (
  <div className="w-full max-w-2xl bg-gray-900 rounded-2xl overflow-hidden shadow-lg">
    <div className="bg-gray-800 text-gray-300 px-4 py-2 text-sm font-mono">
      Application.jsx
    </div>

<pre className="p-3 sm:p-4 font-mono text-[10px] sm:text-xs md:text-sm leading-relaxed whitespace-pre overflow-x-auto">

<span className="text-blue-400">export default class</span>{" "}
<span className="text-orange-400">App</span>{" "}
<span className="text-blue-400">extends</span>{" "}
<span className="text-orange-400">React.Component</span>{" "}
<span className="text-white">{"{"}</span>

{"\n"}  <span className="text-white">state = {"{"}</span>

{"\n"}    <span className="text-blue-400">message</span><span className="text-white">:</span>{" "}
<span className="text-green-400">'Welcome, new user! Fetching your data...'</span><span className="text-white">,</span>

{"\n"}    <span className="text-blue-400">apiKey</span><span className="text-white">:</span>{" "}
<span className="text-green-400">'c9e2d730-4aba-42b2-9711-26ad584cba35'</span><span className="text-white">,</span>

{"\n"}  <span className="text-white">{"}"};</span>

{"\n\n"}  <span className="text-orange-400">componentDidMount</span><span className="text-white">()</span>{" "}
<span className="text-white">{"{"}</span>

{"\n"}    <span className="text-gray-400">// Load in data using the pre-populated API key.</span>

{"\n"}    <span className="text-orange-400">fetch</span><span className="text-white">(</span>
<span className="text-green-400">'/api/profile'</span><span className="text-white">, {"{"}</span>

{"\n"}      <span className="text-blue-400">headers</span><span className="text-white">: {"{"}</span>

{"\n"}        <span className="text-orange-400">Authorization</span><span className="text-white">:</span>{" "}
<span className="text-green-400">'Basic '</span>{" "}
<span className="text-white">+</span>{" "}
<span className="text-white">base64.</span><span className="text-orange-400">encode</span>
<span className="text-white">(this.state.apiKey + </span>
<span className="text-green-400">':'</span>
<span className="text-white">),</span>

{"\n"}      <span className="text-white">{"}"}</span>

{"\n"}    <span className="text-white">{"}"}).<span className="text-orange-400">then</span>(loadWelcomePage);</span>

{"\n"}  <span className="text-white">{"}"}</span>

{"\n\n"}  <span className="text-orange-400">render</span><span className="text-white">()</span>{" "}
<span className="text-white">{"{"}</span>

{"\n"}    <span className="text-blue-400">return</span>{" "}
<span className="text-white">(</span>

{"\n"}      <span className="text-white">&lt;</span>
<span className="text-orange-400">div</span>{" "}
<span className="text-blue-400">className</span>
<span className="text-white">=</span>
<span className="text-green-400">"component-app"</span>
<span className="text-white">&gt;</span>

{"\n"}        <span className="text-white">&lt;</span>
<span className="text-orange-400">Message</span>{" "}
<span className="text-blue-400">value</span>
<span className="text-white">=</span>
<span className="text-green-400">{"{this.state.message}"}</span>{" "}
<span className="text-white">/&gt;</span>

{"\n"}      <span className="text-white">&lt;/</span>
<span className="text-orange-400">div</span>
<span className="text-white">&gt;</span>

{"\n"}    <span className="text-white">);</span>

{"\n"}  <span className="text-white">{"}"}</span>

{"\n"}<span className="text-white">{"}"}</span>

</pre>
  </div>
)}


          {step === 7 && (
  <div className="w-full max-w-2xl bg-gray-900 rounded-2xl overflow-hidden shadow-lg">
    <div className="bg-gray-800 text-gray-300 px-4 py-2 text-sm font-mono">
      attacker.html
    </div>

<pre className="p-3 sm:p-4 font-mono text-[10px] sm:text-xs md:text-sm leading-relaxed whitespace-pre overflow-x-auto">

<span className="text-white">&lt;</span><span className="text-orange-400">script</span><span className="text-white">&gt;</span>

{"\n\n"}  <span className="text-gray-400">/**</span>
{"\n"}   <span className="text-gray-400">* If this script is hosted on an attacker's website, and one of your</span>
{"\n"}   <span className="text-gray-400">* users is tricked into visiting that site...</span>
{"\n"}   <span className="text-gray-400">*/</span>

{"\n"}  <span className="text-orange-400">fetch</span><span className="text-white">(</span>
<span className="text-green-400">'https://www.yourwebsite.com/js/bundle.js'</span>
<span className="text-white">)</span>

{"\n"}   <span className="text-white">.</span><span className="text-orange-400">then</span>
<span className="text-white">(response =&gt; {"{"}</span>

{"\n"}     <span className="text-white">/**</span>
{"\n"}      <span className="text-white">* ...the attacker extract the API </span><span className="text-orange-400">key</span><span className="text-white"> here, </span><span className="text-blue-400">and start</span><span className="text-white"> impersonating</span>
{"\n"}      <span className="text-white">* your user.</span>
{"\n"}      <span className="text-white">*/</span>

{"\n"}   <span className="text-white">{"}"}</span><span className="text-white">);</span>

{"\n\n"}<span className="text-white">&lt;/</span><span className="text-orange-400">script</span><span className="text-white">&gt;</span>

</pre>
  </div>
)}

        </div>
      )}
    </div>
  );
}

function CodeBox({ title, code }) {
  return (
    <div className="w-full max-w-2xl bg-gray-900 rounded-2xl overflow-hidden shadow-lg">
      <div className="bg-gray-800 text-gray-300 px-3 sm:px-4 py-2 text-xs sm:text-sm font-mono">
        {title}
      </div>

      <pre className="p-3 sm:p-4 text-yellow-400 font-mono text-[10px] sm:text-xs md:text-sm whitespace-pre overflow-x-auto">
        {code}
      </pre>
    </div>
  );
}


export default CrossSiteScriptInclusion;
