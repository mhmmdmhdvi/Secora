LESSON = {
    "slug": "sql-injection",
    "title": "SQL Injection",
    "summary": "Learn how SQL injection works by attacking a deliberately vulnerable login form.",
    "difficulty": "beginner",
    "sort_order": 1,
    "estimated_minutes": 15,
    "simulation_key": "sql-injection",
    "required_locales": ("fa", "en"),
    "guide_path": "/lessons/sql-injection-guide",
    "quiz_path": "/lessons/sql-injection-quiz",
    "quiz_start_path": "/lessons/sql-injection-quiz-start",
    "lessons_path": "/lessons",
    "bank": {
        "url": "www.securebank.com",
        "title": "SECURE BANK",
        "tagline": "You can trust us with your money, we almost never get hacked.",
        "username_label": "Username",
        "password_label": "Password",
        "login_button": "Log in",
        "error_message": "An error occurred.",
        "welcome_message": "Welcome back user@gmail.com!",
        "balance_message": "Your current balance is",
        "balance": "$8,266",
        "transfer_button": "Initiate a transfer",
    },
    "credentials": {
        "email": "user@email.com",
        "password": "password",
        "quoted_password": "password'",
        "injection_password": "' or 1=1--",
    },
    "logs": {
        "initialized": "Application initialized.",
        "attempting_login": "User is attempting to login...",
        "invalid_prefix": "Invalid SQL:",
        "sql_comment_detected": "SQL comment detected: --",
        "authenticated": "Authentication successful.",
    },
    "query": {
        "title": "SQL Query",
        "injection_highlight": " or 1=1--",
    },
    "completion": [
        {"type": "strong", "text": "Phew"},
        {"type": "text", "text": ". Now we know how "},
        {"type": "strong", "text": "SQL injection"},
        {
            "type": "text",
            "text": " works, let's learn how to protect against this kind of attack.",
        },
    ],
    "steps": [
        [
            {
                "type": "text",
                "text": "This is the vulnerable application we will be trying to hack with an ",
            },
            {"type": "strong", "text": "SQL injection"},
            {"type": "text", "text": " attack."},
        ],
        [
            {"type": "strong", "text": "Here are the application logs"},
            {
                "type": "text",
                "text": ". Watch what happens here when you interact with the vulnerable application.",
            },
        ],
        [
            {
                "type": "strong",
                "text": "Go ahead and try logging in with the following credentials:",
            },
            {"type": "break"},
            {"type": "break"},
            {"type": "text", "text": "Email: "},
            {"type": "muted", "text": "user@email.com", "break_all": True},
            {"type": "break"},
            {"type": "text", "text": "Password: "},
            {"type": "muted", "text": "password"},
        ],
        [
            {"type": "strong", "text": "Okay, so guessing the password didn't work. "},
            {
                "type": "text",
                "text": "Let's try adding a quote character after the password:",
            },
            {"type": "break"},
            {"type": "break"},
            {"type": "text", "text": "Email: "},
            {"type": "muted", "text": "user@email.com", "break_all": True},
            {"type": "break"},
            {"type": "text", "text": "Password: "},
            {"type": "muted", "text": "password'"},
        ],
        [
            {"type": "strong", "text": "Hmmm."},
            {
                "type": "text",
                "text": " The application crashed with an unexpected error. What could that mean?",
            },
        ],
        [
            {"type": "strong", "text": "The logs show a SQL syntax error."},
            {
                "type": "text",
                "text": " This indicates that the quote character messed something up in an unexpected way.",
            },
        ],
        [
            {
                "type": "strong",
                "text": "This is what the application code looks like behind the scenes.",
            },
        ],
        [
            {"type": "strong", "text": "Enter the password"},
            {"type": "text", "text": " "},
            {"type": "muted", "text": " password'"},
            {"type": "text", "text": " and watch the code window."},
        ],
        [
            {
                "type": "strong",
                "text": "The quote is inserted directly into the SQL string, and terminates the query early.",
            },
            {
                "type": "text",
                "text": " This is what caused the syntax error we saw in the logs.",
            },
        ],
        [
            {
                "type": "text",
                "text": "This behavior indicates that the application might be vulnerable to ",
            },
            {"type": "strong", "text": "SQL injection"},
            {"type": "text", "text": "."},
        ],
        [
            {"type": "text", "text": "Enter the following credentials and click Log in:"},
            {"type": "break"},
            {"type": "break"},
            {"type": "text", "text": "Email: "},
            {"type": "muted", "text": "user@email.com", "break_all": True},
            {"type": "break"},
            {"type": "text", "text": "Password: "},
            {"type": "muted", "text": "' or 1=1--"},
        ],
        [
            {"type": "strong", "text": "And we are in!"},
            {
                "type": "text",
                "text": " We successfully gained access to the application without having to guess the password, using ",
            },
            {"type": "strong", "text": "SQL injection"},
            {"type": "text", "text": "."},
        ],
        [
            {"type": "text", "text": "The "},
            {"type": "muted", "text": "--"},
            {
                "type": "text",
                "text": " characters you entered caused the database to ignore the rest of the SQL statement, allowing you to be authenticated without having to supply the real password.",
            },
        ],
    ],
    "quiz_intro": {
        "eyebrow": "Test your knowledge",
        "icon": "✏️",
        "title": "Quiz: SQL Injection",
        "summary": "Take this quick quiz to show you were paying attention.",
        "start_button": "Start the quiz",
        "review_button": "Review the material one more time →",
    },
    "quiz": {
        "pass_percentage": 100,
        "shuffle_questions": False,
        "shuffle_answers": False,
        "title": "Quiz: SQL Injection",
        "instructions": "Take this quick quiz to show you were paying attention.",
        "questions": [
            {
                "key": "orm-immunity",
                "type": "single",
                "prompt": "Using an Object Relational Mapping tool will make you completely immune to SQL injection attacks.",
                "answers": [
                    {"key": "true", "text": "True", "is_correct": False},
                    {"key": "false", "text": "False", "is_correct": True},
                ],
            },
            {
                "key": "quote-character",
                "type": "single",
                "prompt": "SQL Injection attacks always involve the attacker sending an unexpected quote character.",
                "answers": [
                    {"key": "true", "text": "True", "is_correct": False},
                    {"key": "false", "text": "False", "is_correct": True},
                ],
            },
            {
                "key": "effective-protection",
                "type": "single",
                "prompt": "Which of the following approaches is an effective way of protecting yourself against SQL injection?",
                "answers": [
                    {
                        "key": "parameterized-statements",
                        "text": "Using parameterized statements in your code.",
                        "is_correct": True,
                    },
                    {
                        "key": "https",
                        "text": "Using HTTPS in your website.",
                        "is_correct": False,
                    },
                    {
                        "key": "separate-server",
                        "text": "Moving your database to a separate server.",
                        "is_correct": False,
                    },
                    {
                        "key": "rotate-passwords",
                        "text": "Frequently rotating your database passwords.",
                        "is_correct": False,
                    },
                ],
            },
        ],
    },
}

FA_LESSON = {
    **LESSON,
    "summary": "با حمله به یک فرم ورود عمداً آسیب‌پذیر، یاد بگیر SQL Injection چطور کار می‌کند.",
    "bank": {
        **LESSON["bank"],
        "tagline": "با خیال راحت پولت را به ما بسپار؛ تقریباً هیچ‌وقت هک نمی‌شویم.",
        "username_label": "نام کاربری",
        "password_label": "رمز عبور",
        "login_button": "ورود",
        "error_message": "خطایی رخ داد.",
        "welcome_message": "خوش برگشتی user@gmail.com!",
        "balance_message": "موجودی فعلی حساب تو",
        "transfer_button": "شروع انتقال وجه",
    },
    "logs": LESSON["logs"],
    "query": {
        **LESSON["query"],
    },
    "completion": [
        {"type": "strong", "text": "خب، نفس راحت!"},
        {"type": "text", "text": " حالا فهمیدیم "},
        {"type": "strong", "text": "SQL Injection"},
        {
            "type": "text",
            "text": " چطور کار می‌کند. قدم بعدی این است که یاد بگیریم چطور جلوی چنین حمله‌ای را بگیریم.",
        },
    ],
    "steps": [
        [
            {
                "type": "text",
                "text": "این همان برنامه آسیب‌پذیری است که قرار است با یک حمله ",
            },
            {"type": "strong", "text": "SQL Injection"},
            {"type": "text", "text": " امتحانش کنیم."},
        ],
        [
            {"type": "strong", "text": "این‌ها لاگ‌های برنامه هستند"},
            {
                "type": "text",
                "text": ". وقتی با برنامه آسیب‌پذیر کار می‌کنی، اینجا را نگاه کن تا ببینی پشت صحنه چه اتفاقی می‌افتد.",
            },
        ],
        [
            {
                "type": "strong",
                "text": "اول با این اطلاعات ورود امتحان کن:",
            },
            {"type": "break"},
            {"type": "break"},
            {"type": "text", "text": "Email: "},
            {"type": "muted", "text": "user@email.com", "break_all": True},
            {"type": "break"},
            {"type": "text", "text": "Password: "},
            {"type": "muted", "text": "password"},
        ],
        [
            {"type": "strong", "text": "خب، حدس زدن رمز عبور جواب نداد. "},
            {
                "type": "text",
                "text": "حالا بعد از رمز، یک کاراکتر quote اضافه کن:",
            },
            {"type": "break"},
            {"type": "break"},
            {"type": "text", "text": "Email: "},
            {"type": "muted", "text": "user@email.com", "break_all": True},
            {"type": "break"},
            {"type": "text", "text": "Password: "},
            {"type": "muted", "text": "password'"},
        ],
        [
            {"type": "strong", "text": "جالب شد."},
            {
                "type": "text",
                "text": " برنامه با یک خطای غیرمنتظره از کار افتاد. این می‌تواند چه معنایی داشته باشد؟",
            },
        ],
        [
            {"type": "strong", "text": "لاگ‌ها یک خطای syntax در SQL نشان می‌دهند."},
            {
                "type": "text",
                "text": " یعنی همان کاراکتر quote چیزی را در کوئری، برخلاف انتظار برنامه، به‌هم زده است.",
            },
        ],
        [
            {
                "type": "strong",
                "text": "این چیزی است که کد برنامه در پشت صحنه شبیه آن رفتار می‌کند.",
            },
        ],
        [
            {"type": "strong", "text": "رمز عبور"},
            {"type": "text", "text": " "},
            {"type": "muted", "text": "password'"},
            {"type": "text", "text": " را وارد کن و پنجره کد را نگاه کن."},
        ],
        [
            {
                "type": "strong",
                "text": "کاراکتر quote مستقیم داخل رشته SQL قرار گرفته و کوئری را زودتر از موعد بسته است.",
            },
            {
                "type": "text",
                "text": " همین باعث خطای syntax شد که در لاگ‌ها دیدیم.",
            },
        ],
        [
            {
                "type": "text",
                "text": "این رفتار نشان می‌دهد برنامه احتمالاً در برابر ",
            },
            {"type": "strong", "text": "SQL Injection"},
            {"type": "text", "text": " آسیب‌پذیر است."},
        ],
        [
            {"type": "text", "text": "این اطلاعات را وارد کن و روی ورود بزن:"},
            {"type": "break"},
            {"type": "break"},
            {"type": "text", "text": "Email: "},
            {"type": "muted", "text": "user@email.com", "break_all": True},
            {"type": "break"},
            {"type": "text", "text": "Password: "},
            {"type": "muted", "text": "' or 1=1--"},
        ],
        [
            {"type": "strong", "text": "وارد شدیم!"},
            {
                "type": "text",
                "text": " بدون حدس زدن رمز واقعی، با استفاده از ",
            },
            {"type": "strong", "text": "SQL Injection"},
            {"type": "text", "text": " توانستیم به برنامه دسترسی بگیریم."},
        ],
        [
            {"type": "text", "text": "کاراکترهای "},
            {"type": "muted", "text": "--"},
            {
                "type": "text",
                "text": " باعث شدند پایگاه‌داده باقی دستور SQL را نادیده بگیرد؛ برای همین بدون داشتن رمز عبور واقعی، احراز هویت انجام شد.",
            },
        ],
    ],
    "quiz_intro": {
        **LESSON["quiz_intro"],
        "eyebrow": "دانشت را امتحان کن",
        "title": "آزمون: SQL Injection",
        "summary": "با این آزمون کوتاه مطمئن شو نکته‌های اصلی را گرفته‌ای.",
        "start_button": "شروع آزمون",
        "review_button": "یک بار دیگر مطالب را مرور کن ←",
    },
    "quiz": {
        **LESSON["quiz"],
        "title": "آزمون: SQL Injection",
        "instructions": "با این آزمون کوتاه مطمئن شو نکته‌های اصلی را گرفته‌ای.",
        "questions": [
            {
                "key": "orm-immunity",
                "type": "single",
                "prompt": "استفاده از یک ابزار Object Relational Mapping تو را کاملاً در برابر SQL Injection ایمن می‌کند.",
                "answers": [
                    {"key": "true", "text": "درست", "is_correct": False},
                    {"key": "false", "text": "نادرست", "is_correct": True},
                ],
            },
            {
                "key": "quote-character",
                "type": "single",
                "prompt": "حمله‌های SQL Injection همیشه شامل فرستادن یک کاراکتر quote غیرمنتظره هستند.",
                "answers": [
                    {"key": "true", "text": "درست", "is_correct": False},
                    {"key": "false", "text": "نادرست", "is_correct": True},
                ],
            },
            {
                "key": "effective-protection",
                "type": "single",
                "prompt": "کدام روش زیر برای محافظت در برابر SQL Injection مؤثر است؟",
                "answers": [
                    {
                        "key": "parameterized-statements",
                        "text": "استفاده از parameterized statements در کد.",
                        "is_correct": True,
                    },
                    {
                        "key": "https",
                        "text": "استفاده از HTTPS در وب‌سایت.",
                        "is_correct": False,
                    },
                    {
                        "key": "separate-server",
                        "text": "انتقال پایگاه‌داده به یک سرور جداگانه.",
                        "is_correct": False,
                    },
                    {
                        "key": "rotate-passwords",
                        "text": "تعویض مرتب رمزهای پایگاه‌داده.",
                        "is_correct": False,
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
