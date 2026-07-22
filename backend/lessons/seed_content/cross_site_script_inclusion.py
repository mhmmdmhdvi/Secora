LESSON = {
    "slug": "cross-site-script-inclusion",
    "title": "Cross‑Site Script Inclusion (XSSI)",
    "summary": "Learn how XSSI can expose sensitive JavaScript state across sites.",
    "difficulty": "beginner",
    "sort_order": 2,
    "estimated_minutes": 12,
    "simulation_key": "cross-site-script-inclusion",
    "required_locales": ("fa", "en"),
    "guide_path": "/lessons/cross-site-script-inclusion-guide",
    "quiz_path": "/lessons/cross-site-script-inclusion-quiz",
    "quiz_start_path": "/lessons/cross-site-script-inclusion-quiz-start",
    "lessons_path": "/lessons",
    "total_steps": 10,
    "final_step": 9,
    "steps": [
        [
            {"type": "text", "text": "Browsers keep the user secure by implementing the "},
            {"type": "strong", "text": "same-origin policy"},
            {"type": "text", "text": ": two pages are allowed to interact if they are loaded from the same "},
            {"type": "strong", "text": "domain, port"},
            {"type": "text", "text": " and "},
            {"type": "strong", "text": "protocol"},
            {"type": "text", "text": "."},
        ],
        [{"type": "text", "text": "This policy prevents malicious websites from reading sensitive data from other sites when a user visits them."}],
        [{"type": "text", "text": "JavaScript files are not subject to the same‑origin policy. Websites often load scripts from third‑party domains like Google CDN."}],
        [{"type": "text", "text": "The same works in reverse. Any JavaScript hosted on your site can be imported by third‑party websites."}],
        [{"type": "text", "text": "If you embed sensitive information directly into JavaScript files, attackers may be able to read it."}],
        [{"type": "text", "text": "Imagine your website is a Single Page Application (SPA) that dynamically updates the DOM."}],
        [{"type": "text", "text": "Such apps often keep state in memory. Developers sometimes inject API keys into the JavaScript to improve load time."}],
        [{"type": "text", "text": "But a malicious site could simply import your JavaScript file and extract the API key."}],
        [{"type": "text", "text": "This allows attackers to impersonate your users and access their data."}],
    ],
    "origin_table": {
        "intro": "Only the followings URLs are considered to have the same origin as https://www.example.com:",
        "body": """URL                                    Same Origin?
https://www.example.com/profile        Yes - everything maches
http://www.example.com                 No - the protocol differs
https://www.anotherwebsite.com         No - the domain differs
https://www.example.com:8080           No - the port differs""",
    },
    "code_examples": {
        "1": {
            "filename": "hack-attempt.js",
            "code": """/**
 * Attempt to access a user's profile page.
 */
fetch('https://www.facebooke.com/profile').catch((err) => {
  // The browser will cause this code to fail because the page
  // lives at a different origin. This prevents hackers scraping
  // data.
});""",
        },
        "2": {
            "filename": "cross-domain-loading.js",
            "code": """/**
 * Load in a JavaScript library from another origin.
 */
fetch('https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.js').then((response) => {
  // This will succeed because browsers will allow
  // JavaScript to be loaded from other origins.
});""",
        },
        "3": {
            "filename": "cross-domain-loading.js",
            "code": """/**
 * Load in a JavaScript library from another origin.
 */
fetch('https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.js').then((response) => {
  // This will succeed because browsers will allow
  // JavaScript to be loaded from other origins.
});""",
        },
        "4": {
            "filename": "unsafe-interpolation.py",
            "code": """@app.route('/js/bundle.js')
def javascript:
  \"\"\"Don't ever do this!\"\"\"
  return render_template('js/bundle.js', INSERT_API_KEY_HERE=session.api_key)""",
        },
        "5": {
            "filename": "Application.jsx",
            "code": """export default class App extends React.Component {
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
}""",
        },
        "6": {
            "filename": "Application.jsx",
            "code": """export default class App extends React.Component {
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
}""",
        },
        "7": {
            "filename": "attacker.html",
            "code": """<script>

/**
 * If this script is hosted on an attacker's website, and one of your
 * users is tricked into visiting that site...
 */
fetch('https://www.yourwebsite.com/js/bundle.js')
 .then(response => {
   /**
    * ...the attacker extracts the API key here, and starts impersonating
    * your user.
    */
 });

</script>""",
        },
    },
    "completion": [{"type": "text", "text": "XSSI is an often‑overlooked risk, so we should learn how to spot it."}],
    "quiz_intro": {
        "eyebrow": "Test your knowledge",
        "icon": "✏️",
        "title": "Quiz: XSSI",
        "summary": "Take this quick quiz to show you were paying attention.",
        "start_button": "Start the quiz",
        "review_button": "Review the material one more time →",
    },
    "quiz": {
        "pass_percentage": 100,
        "shuffle_questions": False,
        "shuffle_answers": False,
        "title": "Quiz: XSSI",
        "instructions": "Take this quick quiz to show you were paying attention.",
        "questions": [
            {
                "key": "what-is-xssi",
                "type": "single",
                "prompt": "What is Cross-Site Script Inclusion (XSSI)?",
                "answers": [
                    {
                        "key": "script-import-leaks-sensitive-data",
                        "text": "When a malicious site imports JavaScript from a third-party domain and is able to extract sensitive details like user credentials from the imported script.",
                        "is_correct": True,
                    },
                    {
                        "key": "xss",
                        "text": "When an attacker manages to execute malicious JavaScript in a victims browser.",
                        "is_correct": False,
                    },
                    {
                        "key": "rce",
                        "text": "when an attacker is able to execute malicious code on your web-server.",
                        "is_correct": False,
                    },
                ],
            },
            {
                "key": "safe-state-loading",
                "type": "single",
                "prompt": "What is a safe way of loading state into the browsers JavaScript engine from the server?",
                "answers": [
                    {"key": "json-fetch", "text": "Loading JSON data via the fetch API.", "is_correct": True},
                    {"key": "interpolated-js", "text": "Interpolating data in JavaScript files.", "is_correct": False},
                    {"key": "public-xml", "text": "Including every users credentials in a publicly available XML feed.", "is_correct": False},
                ],
            },
        ],
    },
}


def inline_plain_text(parts):
    return "".join(part["text"] for part in parts if part["type"] != "break")
