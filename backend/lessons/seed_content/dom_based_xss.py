LESSON = {
    "slug": "dom-based-xss",
    "title": "DOM-based XSS",
    "summary": "Learn how URI fragments and unsafe browser-side rendering can create DOM-based XSS.",
    "difficulty": "intermediate",
    "sort_order": 5,
    "estimated_minutes": 15,
    "simulation_key": "dom-based-xss",
    "required_locales": ("fa", "en"),
    "guide_path": "/lessons/dom-based-xss-guide",
    "quiz_path": "/lessons/dom-based-xss-quiz",
    "quiz_start_path": "/lessons/dom-based-xss-quiz-start",
    "lessons_path": "/lessons",
    "total_steps": 9,
    "final_step": 8,
    "steps": [
        [
            {
                "type": "text",
                "text": "As JavaScript frameworks have gotten more sophisticated, a lot of business logic has been pushed to the client-side. Correspondingly, the importance of knowing how to protect against vulnerabilities occurring in the browser have increased.",
            }
        ],
        [
            {
                "type": "text",
                "text": "Rich web applications often use URI fragments - the part of the URL after the # sign. This has proven a convenient method of storing the user's location within a page in a way that keeps browser history readable, but does not cause extra round trips to the server.",
            }
        ],
        [
            {
                "type": "text",
                "text": "URI fragments are not sent with HTTP requests, so they need to be interpreted by client-side JavaScript. You should be careful that your treatment of URI fragments does not permit the injection of malicious JavaScript. Let's see how a site might be vulnerable to DOM-based XSS attacks.",
            }
        ],
        [
            {
                "type": "text",
                "text": 'Our example website has "infinite scroll": content is loaded in dynamically as the page is scrolled down. Notice how the URI fragment is used to track the scroll location.',
            }
        ],
        [
            {
                "type": "text",
                "text": "This is done so that if a user navigates away from the site, and then presses the back button, the site can reload their last location.",
            }
        ],
        [
            {
                "type": "text",
                "text": "However, there is a vulnerability in the way the URI fragment is interpreted by this site. The site updates the page number directly from the URI fragment, without checking the contents.",
            }
        ],
        [
            {
                "type": "text",
                "text": "This means an attacker can construct a URL with malicious JavaScript in the URI fragment...",
            }
        ],
        [
            {
                "type": "text",
                "text": "...and when somebody is tricked into visiting that URL, the JavaScript will be executed in their browser.",
            }
        ],
        [
            {
                "type": "text",
                "text": "Okay, that's clearly pretty dangerous. Let's see how to protect against DOM-based XSS vulnerabilities.",
            }
        ],
    ],
    "completion": [
        {
            "type": "text",
            "text": "Now that you have seen how DOM-based XSS works, let's learn how to protect against it.",
        }
    ],
    "simulation": {
        "site": {
            "name": "chinterest",
            "url": "www.chinterest.com",
            "hash": "#page=12",
            "restored_hash": "#page=12",
            "tagline": "Endless ideas, endless scrolling",
            "page_label": "Current page",
            "restore_note": "Back button restores this scroll location from the URI fragment.",
            "cards": [
                "Cozy cabin lighting",
                "Minimal desk setup",
                "Sourdough scoring ideas",
                "Tiny balcony garden",
                "Handmade ceramic mugs",
                "Weekend reading nook",
                "Clean login page inspiration",
                "Secure frontend patterns",
            ],
        },
        "code": {
            "header": "Dangerous use of innerHTML",
            "body": "window.addEventListener('load', function () {\n  const page = window.location.hash.substr(1);\n  loadPage(page);\n\n  document.getElementById('page-no').innerHTML = page;\n});",
        },
        "attack": {
            "payload_url": 'www.chinterest.com#&lt;script&gt;window.location="www.haxxed.com"&lt;/script#&gt;',
            "hacked_url": "www.haxxed.com",
            "hacked_title": "Browser redirected",
            "hacked_message": "The script from the URI fragment ran in the victim's browser.",
        },
        "scenes": {
            "1": {"type": "xss-image"},
            "2": {"type": "xss-image"},
            "3": {"type": "chinterest-scroll"},
            "4": {"type": "chinterest-restore"},
            "5": {"type": "dangerous-code"},
            "6": {"type": "mal-payload"},
            "7": {"type": "hacked-site"},
        },
    },
    "quiz_intro": {
        "eyebrow": "Test your knowledge",
        "icon": "🧠",
        "title": "Quiz: DOM-based XSS",
        "summary": "Take this quick quiz to show you were paying attention.",
        "start_button": "Start the quiz",
        "review_button": "Review the material one more time →",
    },
    "quiz": {
        "title": "DOM-based XSS quiz",
        "instructions": "Take this quick quiz to show you were paying attention.",
        "pass_percentage": 100,
        "shuffle_questions": False,
        "shuffle_answers": False,
        "questions": [
            {
                "key": "uri-fragment-location",
                "type": "single",
                "prompt": "What is a URI fragment?",
                "answers": [
                    {
                        "key": "after-slash",
                        "text": "The part of the URL after the first / character.",
                        "is_correct": False,
                    },
                    {
                        "key": "after-question-mark",
                        "text": "The part of the URL after a ? character.",
                        "is_correct": False,
                    },
                    {
                        "key": "after-hash",
                        "text": "The part of the URL after a # character.",
                        "is_correct": True,
                    },
                ],
            },
            {
                "key": "jquery-html-risk",
                "type": "single",
                "prompt": "If you use the html(...) function in JQuery, what should you be wary of?",
                "answers": [
                    {
                        "key": "password-html",
                        "text": "The user's password may be 'html'.",
                        "is_correct": False,
                    },
                    {
                        "key": "no-html-function",
                        "text": "There is no html(...) function in JQuery.",
                        "is_correct": False,
                    },
                    {
                        "key": "untrusted-html-input",
                        "text": "Untrusted input passed directly to the html(...) function may allow an attacker to inject malicious code in a page.",
                        "is_correct": True,
                    },
                ],
            },
            {
                "key": "uri-fragment-truths",
                "type": "single",
                "prompt": "Which of the following statements is true regarding URI fragments?",
                "answers": [
                    {
                        "key": "not-sent-server",
                        "text": "URI fragments are not sent to a server.",
                        "is_correct": True,
                    },
                    {
                        "key": "written-cookies",
                        "text": "The fragments are written directly to cookies.",
                        "is_correct": False,
                    },
                    {
                        "key": "fragment-refreshes-page",
                        "text": "Changing the fragment in JavaScript always forces the browser to refresh the page.",
                        "is_correct": False,
                    },
                ],
            }
        ],
    },
}


FA_LESSON = {
    **LESSON,
    "summary": "یاد بگیر چطور URI fragmentها و رندر ناامن در مرورگر می‌توانند DOM-based XSS بسازند.",
    "steps": [
        [
            {
                "type": "text",
                "text": "با پیشرفته‌تر شدن فریم‌ورک‌های JavaScript، بخش زیادی از منطق برنامه به سمت مرورگر و سمت کاربر منتقل شده است. به همین دلیل، شناخت و جلوگیری از آسیب‌پذیری‌هایی که داخل مرورگر رخ می‌دهند اهمیت بیشتری پیدا کرده است.",
            }
        ],
        [
            {
                "type": "text",
                "text": "وب‌اپلیکیشن‌های مدرن زیاد از URI fragment استفاده می‌کنند؛ یعنی بخشی از URL که بعد از علامت # می‌آید. این روش برای نگه داشتن موقعیت کاربر داخل صفحه راحت است، تاریخچه مرورگر را خوانا نگه می‌دارد و باعث درخواست اضافه به سرور نمی‌شود.",
            }
        ],
        [
            {
                "type": "text",
                "text": "URI fragmentها همراه درخواست HTTP به سرور فرستاده نمی‌شوند؛ پس باید توسط JavaScript سمت کاربر تفسیر شوند. باید مراقب باشی نحوه برخوردت با URI fragmentها امکان تزریق JavaScript مخرب را ایجاد نکند. بیایید ببینیم یک سایت چطور ممکن است در برابر DOM-based XSS آسیب‌پذیر شود.",
            }
        ],
        [
            {
                "type": "text",
                "text": 'سایت نمونه ما قابلیت "infinite scroll" دارد؛ یعنی وقتی کاربر صفحه را پایین می‌برد، محتوا به‌صورت پویا بارگذاری می‌شود. دقت کن که URI fragment برای نگه داشتن موقعیت اسکرول استفاده شده است.',
            }
        ],
        [
            {
                "type": "text",
                "text": "این کار برای این انجام شده که اگر کاربر از سایت خارج شود و بعد دکمه Back مرورگر را بزند، سایت بتواند همان موقعیت قبلی را دوباره بارگذاری کند.",
            }
        ],
        [
            {
                "type": "text",
                "text": "اما مشکل اینجاست که این سایت URI fragment را به شکل ناامن تفسیر می‌کند. شماره صفحه مستقیماً از داخل URI fragment برداشته و بدون بررسی محتوا داخل صفحه نوشته می‌شود.",
            }
        ],
        [
            {
                "type": "text",
                "text": "یعنی مهاجم می‌تواند URLای بسازد که داخل URI fragment آن JavaScript مخرب قرار گرفته باشد...",
            }
        ],
        [
            {
                "type": "text",
                "text": "...و وقتی کسی فریب بخورد و آن URL را باز کند، JavaScript داخل مرورگر همان کاربر اجرا می‌شود.",
            }
        ],
        [
            {
                "type": "text",
                "text": "خب، این کاملاً خطرناک است. حالا بیایید ببینیم چطور باید جلوی آسیب‌پذیری‌های DOM-based XSS را گرفت.",
            }
        ],
    ],
    "completion": [
        {
            "type": "text",
            "text": "حالا که دیدی DOM-based XSS چطور کار می‌کند، بیایید یاد بگیریم چطور جلوی آن را بگیریم.",
        }
    ],
    "simulation": {
        **LESSON["simulation"],
        "site": {
            **LESSON["simulation"]["site"],
            "tagline": "ایده‌های بی‌پایان، اسکرول بی‌پایان",
            "page_label": "صفحه فعلی",
            "restore_note": "دکمه Back مرورگر این موقعیت اسکرول را از URI fragment برمی‌گرداند.",
            "cards": [
                "نورپردازی گرم برای کلبه",
                "میز کار مینیمال",
                "ایده‌هایی برای نان ترش",
                "باغچه کوچک بالکن",
                "ماگ‌های سرامیکی دست‌ساز",
                "گوشه مطالعه آخر هفته",
                "الهام برای صفحه ورود تمیز",
                "الگوهای امن سمت کاربر",
            ],
        },
        "code": {
            **LESSON["simulation"]["code"],
            "header": "استفاده خطرناک از innerHTML",
        },
        "attack": {
            **LESSON["simulation"]["attack"],
            "hacked_title": "مرورگر منتقل شد",
            "hacked_message": "اسکریپتی که داخل URI fragment بود در مرورگر قربانی اجرا شد.",
        },
    },
    "quiz_intro": {
        "eyebrow": "دانشت را امتحان کن",
        "icon": "🧠",
        "title": "آزمون: DOM-based XSS",
        "summary": "با این آزمون کوتاه مطمئن شو نکته‌های اصلی را خوب گرفته‌ای.",
        "start_button": "شروع آزمون",
        "review_button": "یک بار دیگر مطالب را مرور کن ←",
    },
    "quiz": {
        **LESSON["quiz"],
        "title": "آزمون: DOM-based XSS",
        "instructions": "با این آزمون کوتاه مطمئن شو نکته‌های اصلی را خوب گرفته‌ای.",
        "questions": [
            {
                **LESSON["quiz"]["questions"][0],
                "prompt": "URI fragment چیست؟",
                "answers": [
                    {
                        **LESSON["quiz"]["questions"][0]["answers"][0],
                        "text": "بخشی از URL که بعد از اولین کاراکتر / می‌آید.",
                    },
                    {
                        **LESSON["quiz"]["questions"][0]["answers"][1],
                        "text": "بخشی از URL که بعد از کاراکتر ? می‌آید.",
                    },
                    {
                        **LESSON["quiz"]["questions"][0]["answers"][2],
                        "text": "بخشی از URL که بعد از کاراکتر # می‌آید.",
                    },
                ],
            },
            {
                **LESSON["quiz"]["questions"][1],
                "prompt": "اگر از تابع html(...) در JQuery استفاده می‌کنی، باید مراقب چه چیزی باشی؟",
                "answers": [
                    {
                        **LESSON["quiz"]["questions"][1]["answers"][0],
                        "text": "ممکن است رمز عبور کاربر «html» باشد.",
                    },
                    {
                        **LESSON["quiz"]["questions"][1]["answers"][1],
                        "text": "در JQuery اصلاً تابعی به نام html(...) وجود ندارد.",
                    },
                    {
                        **LESSON["quiz"]["questions"][1]["answers"][2],
                        "text": "اگر ورودی غیرقابل‌اعتماد مستقیم به html(...) داده شود، مهاجم ممکن است بتواند کد مخرب را داخل صفحه تزریق کند.",
                    },
                ],
            },
            {
                **LESSON["quiz"]["questions"][2],
                "prompt": "کدام جمله درباره URI fragmentها درست است؟",
                "answers": [
                    {
                        **LESSON["quiz"]["questions"][2]["answers"][0],
                        "text": "URI fragmentها به سرور فرستاده نمی‌شوند.",
                    },
                    {
                        **LESSON["quiz"]["questions"][2]["answers"][1],
                        "text": "fragmentها مستقیم داخل cookieها نوشته می‌شوند.",
                    },
                    {
                        **LESSON["quiz"]["questions"][2]["answers"][2],
                        "text": "تغییر fragment در JavaScript همیشه باعث refresh شدن صفحه می‌شود.",
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


GUIDE = {
    "overview": {
        "title": "DOM-based XSS",
        "metrics": [
            {"label": "Prevalence", "value": "Rare", "icon": "⚙️", "tone": "orange"},
            {"label": "Exploitability", "value": "Easy", "icon": "🔧", "tone": "red"},
            {"label": "Impact", "value": "Harmful", "icon": "💀", "tone": "rose"},
        ],
        "paragraphs": [
            [
                {"type": "strong", "text": "Cross-site scripting"},
                {
                    "type": "text",
                    "text": " (XSS) is one of the most common ways hackers attack websites. XSS vulnerabilities permit a malicious user to execute arbitrary chunks of JavaScript when other users visit your site.",
                },
            ],
            [
                {
                    "type": "strong",
                    "text": "XSS is the most common publicly reported security vulnerability, and part of every hacker's toolkit.",
                }
            ],
        ],
    },
    "risks": {
        "title": "Risks",
        "icon": "⚠️",
        "paragraphs": [
            [
                {
                    "type": "text",
                    "text": "DOM-based XSS attacks have all the risks associated with ",
                },
                {"type": "link", "text": "the other types of XSS attack"},
                {
                    "type": "text",
                    "text": ", with the added bonus that they are impossible to detect from the server side. Any page that uses URI fragments is potentially at risk from XSS attacks.",
                },
            ]
        ],
        "bullets": [],
        "closing": [],
    },
    "protection": {
        "title": "Protection",
        "icon": "🔒",
        "intro": [
            [
                {
                    "type": "text",
                    "text": "Protecting against DOM-based XSS attacks is a matter of checking that your JavaScript does not interpret URI fragments in an unsafe manner. There are a number of ways to ensure this.",
                }
            ]
        ],
        "sections": [
            {
                "heading": "Use a JavaScript Framework",
                "paragraphs": [
                    [
                        {"type": "text", "text": "Frameworks like "},
                        {"type": "link", "text": "AngularJS"},
                        {"type": "text", "text": " and "},
                        {"type": "link", "text": "React"},
                        {
                            "type": "text",
                            "text": " use templates that makes construction of ad-hoc HTML an explicit (and rare) action. This will push your development team towards best practices, and make unsafe operations easier to detect.",
                        },
                    ]
                ],
                "accordions": [
                    {
                        "title": "AngularJS",
                        "blocks": [
                            {
                                "text": "In Angular any dynamic content written out in curly brackets will automatically be escaped, so the following is safe:",
                                "code": "<div>{{dynamicContent}}</div>",
                                "tone": "safe",
                            },
                            {
                                "text": "Be wary of any code that binds dynamic content to the `innerHTML` attribute since that will not be escaped automatically:",
                                "code": '<div [innerHTML]="dynamicContent"></div>\n<div innerHTML="{{dynamicContent}}"></div>',
                                "tone": "danger",
                            },
                        ],
                    },
                    {
                        "title": "React",
                        "blocks": [
                            {
                                "text": "In React any dynamic content written out in curly brackets will automatically be escaped, so the following is safe:",
                                "code": "render() {\n  return <div>{dynamicContent}</div>\n}",
                                "tone": "safe",
                            },
                            {
                                "text": "React allows you write out raw HTML by binding content to the `dangerouslySetInnerHTML` property, which is named to remind you of the security risk! Watch out for any code that looks like the following:",
                                "code": "render() {\n  return <div dangerouslySetInnerHTML={{ __html: dynamicContent }} />\n}",
                                "tone": "danger",
                            },
                        ],
                    },
                ],
            },
            {
                "heading": "Audit Your Code Carefully",
                "paragraphs": [
                    [
                        {
                            "type": "text",
                            "text": "Sometimes a full JavaScript framework is too heavyweight for your site. In that case, you will need to regularly conduct code reviews to spot locations that reference ",
                        },
                        {"type": "code", "text": "window.location.hash"},
                        {
                            "type": "text",
                            "text": ". Consider coming up with agreed coding standards on how URI fragments are to be written and interpreted, and centralize this logic in a core library.",
                        },
                    ],
                    [
                        {
                            "type": "text",
                            "text": "If you use JQuery, carefully check any code that uses the ",
                        },
                        {"type": "link", "text": "html(...)"},
                        {
                            "type": "text",
                            "text": " function. If you are constructing raw HTML on the client-side on the back of untrusted input, you may have a problem, whether the input comes from a URI fragment or not. Use the ",
                        },
                        {"type": "link", "text": "text(...)"},
                        {"type": "text", "text": " function whenever possible."},
                    ],
                    [
                        {
                            "type": "text",
                            "text": "If you are using direct the native DOM APIs, avoid using the following properties and functions:",
                        }
                    ],
                ],
                "bullets": ["innerHTML", "outerHTML", "document.write"],
                "after_bullets": [
                    [
                        {
                            "type": "text",
                            "text": "Instead, set text content ",
                        },
                        {"type": "em", "text": "within"},
                        {"type": "text", "text": " tags wherever possible:"},
                    ]
                ],
                "secondary_bullets": ["textContent"],
            },
            {
                "heading": "Parse JSON Carefully",
                "paragraphs": [
                    [
                        {"type": "strong", "text": "Do not"},
                        {
                            "type": "text",
                            "text": " evaluate JSON to convert it to native JavaScript objects - for example, by using the ",
                        },
                        {"type": "code", "text": "eval(...)"},
                        {"type": "text", "text": " function. Instead use "},
                        {"type": "link", "text": "JSON.parse(...)"},
                        {"type": "text", "text": "."},
                    ]
                ],
            },
            {
                "heading": "Detect Unsafe Code Using Development Tools",
                "paragraphs": [
                    [
                        {
                            "type": "text",
                            "text": "The Burp Suite, produced by the security firm ",
                        },
                        {"type": "link", "text": "PortSwigger"},
                        {
                            "type": "text",
                            "text": ", can be used to detect ",
                        },
                        {"type": "link", "text": "DOM-based vulnerabilities"},
                        {"type": "text", "text": "."},
                    ]
                ],
            },
            {
                "heading": "Don't Use URI Fragments At All!",
                "paragraphs": [
                    [
                        {
                            "type": "text",
                            "text": "The most secure code is the code that isn't there. If you don't need to use URI fragments, then don't! Write a unit test to scan your JavaScript for mentions of ",
                        },
                        {"type": "code", "text": "window.location.hash"},
                        {
                            "type": "text",
                            "text": ", and have it fail if the pattern is found. When there is a need to use URI fragments, ",
                        },
                        {"type": "em", "text": "then"},
                        {
                            "type": "text",
                            "text": " you can discuss how to ensure their safe use.",
                        },
                    ]
                ],
            },
            {
                "heading": "Implement a Content-Security Policy",
                "paragraphs": [
                    [
                        {
                            "type": "text",
                            "text": "Browsers support Content-Security Policies that allow the author of a web-page to control where JavaScript (",
                        },
                        {"type": "link", "text": "and other resources"},
                        {
                            "type": "text",
                            "text": ") can be loaded and executed from. XSS attacks rely on the attacker being able to run malicious scripts on a user's web page - either by injecting inline ",
                        },
                        {"type": "code", "text": "<script>"},
                        {
                            "type": "text",
                            "text": " tags somewhere within the ",
                        },
                        {"type": "code", "text": "<html>"},
                        {
                            "type": "text",
                            "text": " tag of a page, or by tricking the browser into loading the JavaScript from a malicious third-party domain.",
                        },
                    ],
                    [
                        {
                            "type": "text",
                            "text": "By setting a content security policy in the response header, you can tell the browser to ",
                        },
                        {"type": "em", "text": "never"},
                        {
                            "type": "text",
                            "text": " execute inline JavaScript, and to lock down which domains can host JavaScript for a page:",
                        },
                    ],
                ],
                "terminal": "Content-Security-Policy: script-src 'self' https://apis.google.com",
                "after_terminal": [
                    [
                        {
                            "type": "strong",
                            "text": "By listing the URLs from which scripts can be loaded, you are implicitly stating that inline JavaScript is not allowed.",
                        }
                    ],
                    [
                        {
                            "type": "text",
                            "text": "The content security policy can also be set in a ",
                        },
                        {"type": "code", "text": "<meta>"},
                        {"type": "text", "text": " tag in the "},
                        {"type": "code", "text": "<head>"},
                        {"type": "text", "text": " element of the page:"},
                    ],
                ],
                "second_terminal": "<meta http-equiv=\"Content-Security-Policy\"\n      content=\"script-src 'self' https://apis.google.com\">",
                "closing": [
                    [
                        {
                            "type": "strong",
                            "text": "This approach will protect your users very effectively!",
                        },
                        {
                            "type": "text",
                            "text": " However, it may take a considerable amount of discipline to make your site ready for such a header. Inline scripts tags are considered bad practice in modern web-development - mixing content and code makes web-applications difficult to maintain - but are common in older, legacy sites.",
                        },
                    ],
                    [
                        {
                            "type": "text",
                            "text": "To migrate away from inline scripts incrementally, consider making use of ",
                        },
                        {"type": "link", "text": "CSP Violation Reports"},
                        {
                            "type": "text",
                            "text": ". By adding a ",
                        },
                        {"type": "code", "text": "report-to"},
                        {
                            "type": "text",
                            "text": " directive in your policy header, the browser will notify you of any policy violations, rather than preventing inline JavaScript from executing:",
                        },
                    ],
                ],
                "third_terminal": "Reporting-Endpoints: csp-endpoint=\"https://example.com/csp-reports\"\nContent-Security-Policy-Report-Only: script-src 'self'; report-to csp-endpoint",
            },
        ],
    },
    "quiz_cta": {
        "eyebrow": "Got it?",
        "icon": "✏️",
        "label": "Quiz:",
        "title": "DOM-based XSS",
        "summary": "Take a quick quiz to show you were paying attention →",
        "path": "/lessons/dom-based-xss-quiz",
    },
}


FA_GUIDE = {
    **GUIDE,
    "overview": {
        "title": "DOM-based XSS",
        "metrics": [
            {"label": "چقدر رایج است", "value": "نادر", "icon": "⚙️", "tone": "orange"},
            {"label": "سوءاستفاده از آن", "value": "آسان", "icon": "🔧", "tone": "red"},
            {"label": "شدت آسیب", "value": "زیان‌بار", "icon": "💀", "tone": "rose"},
        ],
        "paragraphs": [
            [
                {"type": "strong", "text": "Cross-site scripting یا XSS"},
                {
                    "type": "text",
                    "text": " یکی از رایج‌ترین روش‌هایی است که مهاجمان برای حمله به وب‌سایت‌ها استفاده می‌کنند. آسیب‌پذیری‌های XSS به کاربر مخرب اجازه می‌دهند وقتی کاربران دیگر از سایت بازدید می‌کنند، تکه‌هایی از JavaScript دلخواه را در مرورگر آن‌ها اجرا کند.",
                },
            ],
            [
                {
                    "type": "strong",
                    "text": "XSS یکی از رایج‌ترین آسیب‌پذیری‌های امنیتی گزارش‌شده به‌صورت عمومی است و تقریباً در جعبه‌ابزار هر مهاجمی پیدا می‌شود.",
                }
            ],
        ],
    },
    "risks": {
        "title": "ریسک‌ها",
        "icon": "⚠️",
        "paragraphs": [
            [
                {
                    "type": "text",
                    "text": "حمله‌های DOM-based XSS همه ریسک‌های ",
                },
                {"type": "link", "text": "دیگر انواع حمله XSS"},
                {
                    "type": "text",
                    "text": " را دارند، با یک نکته اضافه: از سمت سرور قابل تشخیص نیستند. هر صفحه‌ای که از URI fragment استفاده می‌کند، می‌تواند در معرض خطر XSS باشد.",
                },
            ]
        ],
        "bullets": [],
        "closing": [],
    },
    "protection": {
        "title": "محافظت",
        "icon": "🔒",
        "intro": [
            [
                {
                    "type": "text",
                    "text": "برای محافظت در برابر DOM-based XSS باید مطمئن شوی JavaScript سایت، URI fragmentها را به شکل ناامن تفسیر نمی‌کند. چند راه برای انجام این کار وجود دارد.",
                }
            ]
        ],
        "sections": [
            {
                **GUIDE["protection"]["sections"][0],
                "heading": "از یک فریم‌ورک JavaScript استفاده کن",
                "paragraphs": [
                    [
                        {"type": "text", "text": "فریم‌ورک‌هایی مثل "},
                        {"type": "link", "text": "AngularJS"},
                        {"type": "text", "text": " و "},
                        {"type": "link", "text": "React"},
                        {
                            "type": "text",
                            "text": " از template استفاده می‌کنند و ساختن HTML خام و موقتی را به یک کار صریح و کم‌تکرار تبدیل می‌کنند. این کار تیم توسعه را به سمت الگوهای امن‌تر می‌برد و تشخیص عملیات ناامن را ساده‌تر می‌کند.",
                        },
                    ]
                ],
                "accordions": [
                    {
                        "title": "AngularJS",
                        "blocks": [
                            {
                                **GUIDE["protection"]["sections"][0]["accordions"][0]["blocks"][0],
                                "text": "در Angular هر محتوای پویایی که داخل آکولاد نوشته شود به‌صورت خودکار escape می‌شود؛ بنابراین نمونه زیر امن است:",
                            },
                            {
                                **GUIDE["protection"]["sections"][0]["accordions"][0]["blocks"][1],
                                "text": "مراقب کدی باش که محتوای پویا را به attribute به نام `innerHTML` متصل می‌کند؛ چون این حالت به‌صورت خودکار escape نمی‌شود:",
                            },
                        ],
                    },
                    {
                        "title": "React",
                        "blocks": [
                            {
                                **GUIDE["protection"]["sections"][0]["accordions"][1]["blocks"][0],
                                "text": "در React هر محتوای پویایی که داخل آکولاد نوشته شود به‌صورت خودکار escape می‌شود؛ بنابراین نمونه زیر امن است:",
                            },
                            {
                                **GUIDE["protection"]["sections"][0]["accordions"][1]["blocks"][1],
                                "text": "React اجازه می‌دهد با property به نام `dangerouslySetInnerHTML`، HTML خام را داخل صفحه بنویسی؛ اسمش هم عمداً خطر را یادآوری می‌کند. مراقب کدهایی شبیه نمونه زیر باش:",
                            },
                        ],
                    },
                ],
            },
            {
                **GUIDE["protection"]["sections"][1],
                "heading": "کدت را با دقت بازبینی کن",
                "paragraphs": [
                    [
                        {
                            "type": "text",
                            "text": "گاهی استفاده از یک فریم‌ورک کامل JavaScript برای سایت سنگین است. در این حالت باید مرتب code review انجام بدهی و بخش‌هایی را پیدا کنی که به ",
                        },
                        {"type": "code", "text": "window.location.hash"},
                        {
                            "type": "text",
                            "text": " اشاره می‌کنند. بهتر است برای نوشتن و تفسیر URI fragmentها استاندارد مشخصی داشته باشی و این منطق را در یک کتابخانه مرکزی نگه داری.",
                        },
                    ],
                    [
                        {
                            "type": "text",
                            "text": "اگر از JQuery استفاده می‌کنی، هر کدی را که از تابع ",
                        },
                        {"type": "link", "text": "html(...)"},
                        {
                            "type": "text",
                            "text": " استفاده می‌کند با دقت بررسی کن. اگر در سمت کاربر، HTML خام را بر اساس ورودی غیرقابل‌اعتماد می‌سازی، ممکن است مشکل داشته باشی؛ چه آن ورودی از URI fragment آمده باشد چه نه. هر وقت ممکن است از تابع ",
                        },
                        {"type": "link", "text": "text(...)"},
                        {"type": "text", "text": " استفاده کن."},
                    ],
                    [
                        {
                            "type": "text",
                            "text": "اگر مستقیم از DOM APIهای بومی مرورگر استفاده می‌کنی، از propertyها و تابع‌های زیر دوری کن:",
                        }
                    ],
                ],
                "after_bullets": [
                    [
                        {"type": "text", "text": "به‌جای آن، هر جا ممکن است متن را "},
                        {"type": "em", "text": "داخل"},
                        {"type": "text", "text": " تگ‌ها قرار بده:"},
                    ]
                ],
            },
            {
                **GUIDE["protection"]["sections"][2],
                "heading": "JSON را با دقت parse کن",
                "paragraphs": [
                    [
                        {"type": "strong", "text": "هیچ‌وقت"},
                        {
                            "type": "text",
                            "text": " برای تبدیل JSON به objectهای JavaScript، آن را evaluate نکن؛ مثلاً با تابع ",
                        },
                        {"type": "code", "text": "eval(...)"},
                        {"type": "text", "text": ". به‌جای آن از "},
                        {"type": "link", "text": "JSON.parse(...)"},
                        {"type": "text", "text": " استفاده کن."},
                    ]
                ],
            },
            {
                **GUIDE["protection"]["sections"][3],
                "heading": "کد ناامن را با ابزارهای توسعه پیدا کن",
                "paragraphs": [
                    [
                        {
                            "type": "text",
                            "text": "Burp Suite که توسط شرکت امنیتی ",
                        },
                        {"type": "link", "text": "PortSwigger"},
                        {
                            "type": "text",
                            "text": " ساخته شده، می‌تواند برای شناسایی ",
                        },
                        {"type": "link", "text": "آسیب‌پذیری‌های DOM-based"},
                        {"type": "text", "text": " استفاده شود."},
                    ]
                ],
            },
            {
                **GUIDE["protection"]["sections"][4],
                "heading": "اصلاً از URI fragment استفاده نکن!",
                "paragraphs": [
                    [
                        {
                            "type": "text",
                            "text": "امن‌ترین کد، کدی است که اصلاً وجود ندارد. اگر لازم نیست از URI fragment استفاده کنی، استفاده نکن. یک unit test بنویس که JavaScript پروژه را برای عبارت ",
                        },
                        {"type": "code", "text": "window.location.hash"},
                        {
                            "type": "text",
                            "text": " بررسی کند و اگر آن را پیدا کرد fail شود. اگر واقعاً نیاز به URI fragment داشتی، ",
                        },
                        {"type": "em", "text": "آن وقت"},
                        {
                            "type": "text",
                            "text": " درباره روش امن استفاده از آن تصمیم بگیر.",
                        },
                    ]
                ],
            },
            {
                **GUIDE["protection"]["sections"][5],
                "heading": "Content-Security Policy پیاده‌سازی کن",
                "paragraphs": [
                    [
                        {
                            "type": "text",
                            "text": "مرورگرها از Content-Security Policy پشتیبانی می‌کنند؛ قابلیتی که به سازنده صفحه اجازه می‌دهد کنترل کند JavaScript و ",
                        },
                        {"type": "link", "text": "منابع دیگر"},
                        {
                            "type": "text",
                            "text": " از چه دامنه‌هایی بارگذاری و اجرا شوند. حمله‌های XSS معمولاً به این وابسته‌اند که مهاجم بتواند اسکریپت مخرب را در صفحه کاربر اجرا کند؛ یا با تزریق تگ inline ",
                        },
                        {"type": "code", "text": "<script>"},
                        {"type": "text", "text": " جایی داخل تگ "},
                        {"type": "code", "text": "<html>"},
                        {
                            "type": "text",
                            "text": " صفحه، یا با مجبور کردن مرورگر به بارگذاری JavaScript از یک دامنه مخرب بیرونی.",
                        },
                    ],
                    [
                        {
                            "type": "text",
                            "text": "با تنظیم Content-Security Policy در هدر پاسخ، می‌توانی به مرورگر بگویی JavaScript inline را ",
                        },
                        {"type": "em", "text": "هرگز"},
                        {
                            "type": "text",
                            "text": " اجرا نکند و فقط از دامنه‌های مشخص‌شده JavaScript بارگذاری کند:",
                        },
                    ],
                ],
                "after_terminal": [
                    [
                        {
                            "type": "strong",
                            "text": "وقتی URLهایی را که اجازه بارگذاری script دارند مشخص می‌کنی، در عمل می‌گویی JavaScript inline مجاز نیست.",
                        }
                    ],
                    [
                        {
                            "type": "text",
                            "text": "Content-Security Policy را می‌توان داخل تگ ",
                        },
                        {"type": "code", "text": "<meta>"},
                        {"type": "text", "text": " در بخش "},
                        {"type": "code", "text": "<head>"},
                        {"type": "text", "text": " صفحه هم تنظیم کرد:"},
                    ],
                ],
                "closing": [
                    [
                        {
                            "type": "strong",
                            "text": "این روش از کاربران تو خیلی خوب محافظت می‌کند!",
                        },
                        {
                            "type": "text",
                            "text": " البته آماده‌کردن سایت برای چنین هدرهایی ممکن است کمی نظم و بازبینی بخواهد. تگ‌های script inline در توسعه وب مدرن عادت خوبی نیستند، چون محتوا و کد را قاطی می‌کنند و نگهداری برنامه را سخت‌تر می‌کنند؛ با این حال در سایت‌های قدیمی زیاد دیده می‌شوند.",
                        },
                    ],
                    [
                        {
                            "type": "text",
                            "text": "برای مهاجرت مرحله‌به‌مرحله از scriptهای inline، می‌توانی از ",
                        },
                        {"type": "link", "text": "گزارش‌های نقض CSP"},
                        {"type": "text", "text": " استفاده کنی. با اضافه کردن directive به نام "},
                        {"type": "code", "text": "report-to"},
                        {
                            "type": "text",
                            "text": " در policy header، مرورگر به‌جای اینکه اجرای JavaScript inline را فوراً مسدود کند، نقض policyها را به تو گزارش می‌دهد:",
                        },
                    ],
                ],
            },
        ],
    },
    "quiz_cta": {
        "eyebrow": "یاد گرفتی؟",
        "icon": "✏️",
        "label": "آزمون:",
        "title": "DOM-based XSS",
        "summary": "با یک آزمون کوتاه مطمئن شو نکته‌های اصلی را گرفته‌ای ←",
        "path": "/lessons/dom-based-xss-quiz",
    },
}


GUIDE_TRANSLATIONS = {
    "en": GUIDE,
    "fa": FA_GUIDE,
}


def inline_plain_text(parts):
    return " ".join(part.get("text", "") for part in parts if part.get("type") != "break")
