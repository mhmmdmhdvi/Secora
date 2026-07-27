LESSON = {
    "slug": "cross-site-script-inclusion",
    "title": "Cross-Site Script Inclusion (XSSI)",
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
        [{"type": "text", "text": "JavaScript files are not subject to the same-origin policy. Websites often load scripts from third-party domains like Google CDN."}],
        [{"type": "text", "text": "The same works in reverse. Any JavaScript hosted on your site can be imported by third-party websites."}],
        [{"type": "text", "text": "If you embed sensitive information directly into JavaScript files, attackers may be able to read it."}],
        [{"type": "text", "text": "Imagine your website is a Single Page Application (SPA) that dynamically updates the DOM."}],
        [{"type": "text", "text": "Such apps often keep state in memory. Developers sometimes inject API keys into the JavaScript to improve load time."}],
        [{"type": "text", "text": "But a malicious site could simply import your JavaScript file and extract the API key."}],
        [{"type": "text", "text": "This allows attackers to impersonate your users and access their data."}],
    ],
    "origin_table": {
        "intro": "Only the following URLs are considered to have the same origin as https://www.example.com:",
        "body": """URL                                    Same Origin?
https://www.example.com/profile        Yes - everything matches
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
    "completion": [{"type": "text", "text": "XSSI is an often-overlooked risk, so we should learn how to spot it."}],
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
                        "text": "When an attacker manages to execute malicious JavaScript in a victim's browser.",
                        "is_correct": False,
                    },
                    {
                        "key": "rce",
                        "text": "When an attacker is able to execute malicious code on your web server.",
                        "is_correct": False,
                    },
                ],
            },
            {
                "key": "safe-state-loading",
                "type": "single",
                "prompt": "What is a safe way to load state into the browser's JavaScript engine from the server?",
                "answers": [
                    {"key": "json-fetch", "text": "Loading JSON data via the fetch API.", "is_correct": True},
                    {"key": "interpolated-js", "text": "Interpolating data in JavaScript files.", "is_correct": False},
                    {"key": "public-xml", "text": "Including every user's credentials in a publicly available XML feed.", "is_correct": False},
                ],
            },
        ],
    },
}

FA_LESSON = {
    **LESSON,
    "summary": "یاد بگیر چطور XSSI می‌تواند وضعیت و داده‌های حساس JavaScript را بین سایت‌ها افشا کند.",
    "steps": [
        [
            {"type": "text", "text": "مرورگرها برای امن نگه داشتن کاربر از "},
            {"type": "strong", "text": "سیاست هم‌مبدأ یا Same-Origin Policy"},
            {"type": "text", "text": " استفاده می‌کنند: یعنی دو صفحه فقط وقتی اجازه تعامل دارند که از همان "},
            {"type": "strong", "text": "دامنه، پورت"},
            {"type": "text", "text": " و "},
            {"type": "strong", "text": "پروتکل"},
            {"type": "text", "text": " بارگذاری شده باشند."},
        ],
        [{"type": "text", "text": "این سیاست جلوی سایت‌های مخرب را می‌گیرد تا وقتی کاربر از آن‌ها بازدید می‌کند، نتوانند داده‌های حساس سایت‌های دیگر را بخوانند."}],
        [{"type": "text", "text": "اما فایل‌های JavaScript مثل بسیاری از پاسخ‌های دیگر محدود به سیاست هم‌مبدأ نیستند. وب‌سایت‌ها معمولاً اسکریپت‌ها را از دامنه‌های بیرونی مثل Google CDN بارگذاری می‌کنند."}],
        [{"type": "text", "text": "این ماجرا برعکس هم کار می‌کند؛ هر فایل JavaScript که روی سایت تو قرار دارد، می‌تواند توسط وب‌سایت‌های دیگر هم وارد و اجرا شود."}],
        [{"type": "text", "text": "اگر اطلاعات حساس را مستقیم داخل فایل‌های JavaScript قرار بدهی، مهاجم ممکن است بتواند همان اطلاعات را بخواند."}],
        [{"type": "text", "text": "فرض کن وب‌سایت تو یک برنامه تک‌صفحه‌ای یا SPA است که محتوای صفحه را به‌صورت پویا در DOM به‌روزرسانی می‌کند."}],
        [{"type": "text", "text": "این نوع برنامه‌ها معمولاً بخشی از وضعیت برنامه را در حافظه نگه می‌دارند. گاهی توسعه‌دهنده‌ها برای سریع‌تر شدن بارگذاری، کلیدهای API را مستقیم داخل JavaScript تزریق می‌کنند."}],
        [{"type": "text", "text": "اما یک سایت مخرب می‌تواند خیلی ساده همان فایل JavaScript را از سایت تو وارد کند و کلید API را از داخل آن بیرون بکشد."}],
        [{"type": "text", "text": "با این کار، مهاجم می‌تواند خودش را جای کاربر جا بزند و به داده‌های او دسترسی پیدا کند."}],
    ],
    "origin_table": {
        "intro": "برای https://www.example.com فقط URLهای زیر هم‌مبدأ محسوب می‌شوند:",
        "body": """URL                                    هم‌مبدأ؟
https://www.example.com/profile        بله - همه چیز یکسان است
http://www.example.com                 نه - پروتکل فرق دارد
https://www.anotherwebsite.com         نه - دامنه فرق دارد
https://www.example.com:8080           نه - پورت فرق دارد""",
    },
    "completion": [{"type": "text", "text": "XSSI ریسکی است که خیلی وقت‌ها نادیده گرفته می‌شود؛ پس باید یاد بگیریم چطور آن را تشخیص بدهیم."}],
    "quiz_intro": {
        "eyebrow": "دانشت را بسنج",
        "icon": "✏️",
        "title": "آزمون: XSSI",
        "summary": "این آزمون کوتاه را انجام بده تا مطمئن شوی نکته‌ها را خوب گرفته‌ای.",
        "start_button": "شروع آزمون",
        "review_button": "یک بار دیگر مرور کن ←",
    },
    "quiz": {
        **LESSON["quiz"],
        "title": "آزمون: XSSI",
        "instructions": "این آزمون کوتاه را انجام بده تا مطمئن شوی نکته‌ها را خوب گرفته‌ای.",
        "questions": [
            {
                **LESSON["quiz"]["questions"][0],
                "prompt": "Cross-Site Script Inclusion یا XSSI چیست؟",
                "answers": [
                    {
                        **LESSON["quiz"]["questions"][0]["answers"][0],
                        "text": "وقتی یک سایت مخرب، JavaScript را از یک دامنه دیگر وارد می‌کند و می‌تواند اطلاعات حساسی مثل مشخصات کاربر را از همان اسکریپت استخراج کند.",
                    },
                    {
                        **LESSON["quiz"]["questions"][0]["answers"][1],
                        "text": "وقتی مهاجم موفق می‌شود JavaScript مخرب را داخل مرورگر قربانی اجرا کند.",
                    },
                    {
                        **LESSON["quiz"]["questions"][0]["answers"][2],
                        "text": "وقتی مهاجم می‌تواند کد مخرب را روی سرور وب اجرا کند.",
                    },
                ],
            },
            {
                **LESSON["quiz"]["questions"][1],
                "prompt": "روش امن برای بارگذاری state از سرور به موتور JavaScript مرورگر چیست؟",
                "answers": [
                    {
                        **LESSON["quiz"]["questions"][1]["answers"][0],
                        "text": "بارگذاری داده‌های JSON با fetch API.",
                    },
                    {
                        **LESSON["quiz"]["questions"][1]["answers"][1],
                        "text": "تزریق مستقیم داده‌ها داخل فایل‌های JavaScript.",
                    },
                    {
                        **LESSON["quiz"]["questions"][1]["answers"][2],
                        "text": "قرار دادن اطلاعات ورود همه کاربران داخل یک XML عمومی.",
                    },
                ],
            },
        ],
    },
}

LESSON_TRANSLATIONS = {
    "en": LESSON,
    "fa": FA_LESSON,
}


def inline_plain_text(parts):
    chunks = []
    for part in parts:
        if part["type"] == "break":
            chunks.append("\n")
        else:
            chunks.append(part["text"])
    return "".join(chunks)
