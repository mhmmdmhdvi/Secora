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
    "summary": "یاد بگیر وقتی JavaScript مرورگر با URI fragment ناامن برخورد می‌کند، چطور DOM-based XSS ساخته می‌شود.",
    "steps": [
        [
            {
                "type": "text",
                "text": "با پیشرفته‌تر شدن فریم‌ورک‌های JavaScript، بخش زیادی از منطق برنامه داخل مرورگر اجرا می‌شود. به همین خاطر، فقط امن‌بودن سرور کافی نیست؛ باید آسیب‌پذیری‌هایی را هم بشناسی که سمت مرورگر اتفاق می‌افتند.",
            }
        ],
        [
            {
                "type": "text",
                "text": "وب‌اپلیکیشن‌های مدرن زیاد از URI fragment استفاده می‌کنند؛ یعنی همان بخشی از URL که بعد از علامت # می‌آید. این روش برای نگه داشتن جای کاربر داخل صفحه مفید است، تاریخچه مرورگر را مرتب نگه می‌دارد و درخواست اضافه‌ای هم به سرور نمی‌فرستد.",
            }
        ],
        [
            {
                "type": "text",
                "text": "URI fragment همراه درخواست HTTP به سرور فرستاده نمی‌شود. یعنی اگر سایت بخواهد از آن استفاده کند، معمولاً JavaScript داخل مرورگر باید آن را بخواند. اگر این کار بدون بررسی امن انجام شود، مهاجم می‌تواند راهی برای تزریق JavaScript پیدا کند. بیایید ببینیم این اتفاق چطور به DOM-based XSS تبدیل می‌شود.",
            }
        ],
        [
            {
                "type": "text",
                "text": 'سایت نمونه ما قابلیت "infinite scroll" دارد؛ یعنی با پایین رفتن کاربر، محتوای جدید خودکار بارگذاری می‌شود. دقت کن که سایت از URI fragment برای ذخیره کردن جای کاربر در صفحه استفاده می‌کند.',
            }
        ],
        [
            {
                "type": "text",
                "text": "هدف این است که اگر کاربر از سایت خارج شد و بعد با دکمه Back برگشت، سایت بتواند او را تقریباً به همان جای قبلی برگرداند.",
            }
        ],
        [
            {
                "type": "text",
                "text": "اما این سایت یک اشتباه مهم دارد: مقدار URI fragment را بدون بررسی امن می‌خواند و مستقیم داخل صفحه می‌نویسد. یعنی چیزی که در URL آمده، تقریباً بی‌واسطه وارد DOM می‌شود.",
            }
        ],
        [
            {
                "type": "text",
                "text": "پس مهاجم می‌تواند URLای بسازد که داخل URI fragment آن JavaScript مخرب قرار دارد.",
            }
        ],
        [
            {
                "type": "text",
                "text": "اگر کاربری فریب بخورد و آن URL را باز کند، همان JavaScript داخل مرورگر خودش اجرا می‌شود.",
            }
        ],
        [
            {
                "type": "text",
                "text": "خب، این یعنی خطر مستقیم داخل مرورگر کاربر. حالا بیایید ببینیم چطور می‌شود جلوی DOM-based XSS را گرفت.",
            }
        ],
    ],
    "completion": [
        {
            "type": "text",
            "text": "حالا که دیدی DOM-based XSS چطور شکل می‌گیرد، بیایید یاد بگیریم چطور جلوی آن را بگیریم.",
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
            "hacked_message": "کدی که داخل URI fragment بود، در مرورگر قربانی اجرا شد.",
        },
    },
    "quiz_intro": {
        "eyebrow": "دانشت را بسنج",
        "icon": "🧠",
        "title": "آزمون: DOM-based XSS",
        "summary": "با این آزمون کوتاه مطمئن شو مفهوم DOM-based XSS را درست گرفته‌ای.",
        "start_button": "شروع آزمون",
        "review_button": "یک بار دیگر راهنما را مرور کن ←",
    },
    "quiz": {
        **LESSON["quiz"],
        "title": "آزمون: DOM-based XSS",
        "instructions": "با این آزمون کوتاه مطمئن شو مفهوم DOM-based XSS را درست گرفته‌ای.",
        "questions": [
            {
                **LESSON["quiz"]["questions"][0],
                "prompt": "URI fragment کدام بخش از URL است؟",
                "answers": [
                    {
                        **LESSON["quiz"]["questions"][0]["answers"][0],
                        "text": "بخشی از URL که بعد از اولین / می‌آید.",
                    },
                    {
                        **LESSON["quiz"]["questions"][0]["answers"][1],
                        "text": "بخشی از URL که بعد از ? می‌آید.",
                    },
                    {
                        **LESSON["quiz"]["questions"][0]["answers"][2],
                        "text": "بخشی از URL که بعد از # می‌آید.",
                    },
                ],
            },
            {
                **LESSON["quiz"]["questions"][1],
                "prompt": "اگر در JQuery از html(...) استفاده می‌کنی، خطر اصلی چیست؟",
                "answers": [
                    {
                        **LESSON["quiz"]["questions"][1]["answers"][0],
                        "text": "ممکن است نام کاربر با کلمه html شروع شود.",
                    },
                    {
                        **LESSON["quiz"]["questions"][1]["answers"][1],
                        "text": "JQuery اجازه تغییر محتوای صفحه را نمی‌دهد.",
                    },
                    {
                        **LESSON["quiz"]["questions"][1]["answers"][2],
                        "text": "اگر ورودی غیرقابل‌اعتماد مستقیم وارد html(...) شود، مهاجم ممکن است کد مخرب را داخل صفحه تزریق کند.",
                    },
                ],
            },
            {
                **LESSON["quiz"]["questions"][2],
                "prompt": "کدام جمله درباره URI fragment درست است؟",
                "answers": [
                    {
                        **LESSON["quiz"]["questions"][2]["answers"][0],
                        "text": "URI fragmentها به سرور فرستاده نمی‌شوند.",
                    },
                    {
                        **LESSON["quiz"]["questions"][2]["answers"][1],
                        "text": "fragmentها به‌صورت خودکار داخل cookie نوشته می‌شوند.",
                    },
                    {
                        **LESSON["quiz"]["questions"][2]["answers"][2],
                        "text": "تغییر fragment در JavaScript همیشه صفحه را refresh می‌کند.",
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
                    "text": " یکی از رایج‌ترین روش‌های حمله به وب‌سایت‌هاست. در XSS، مهاجم کاری می‌کند که JavaScript دلخواهش داخل مرورگر کاربر اجرا شود.",
                },
            ],
            [
                {
                    "type": "strong",
                    "text": "XSS از آن آسیب‌پذیری‌هایی است که خیلی زیاد گزارش می‌شود و تقریباً هر مهاجمی آن را خوب می‌شناسد.",
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
                    "text": "DOM-based XSS همان خطرهای ",
                },
                {"type": "link", "text": "دیگر انواع حمله XSS"},
                {
                    "type": "text",
                    "text": " را دارد، با یک تفاوت مهم: خیلی از آن‌ها از سمت سرور دیده نمی‌شوند، چون اتفاق اصلی داخل مرورگر می‌افتد. هر صفحه‌ای که از URI fragment استفاده می‌کند، اگر آن را امن مدیریت نکند، می‌تواند در معرض XSS باشد.",
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
                    "text": "برای جلوگیری از DOM-based XSS باید مطمئن شوی JavaScript سایت، URI fragment را بدون بررسی امن وارد صفحه نمی‌کند. چند راه عملی برای این کار وجود دارد.",
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
                            "text": " از template استفاده می‌کنند و نوشتن HTML خام را به کاری مشخص و کم‌تکرار تبدیل می‌کنند. این باعث می‌شود تیم توسعه کمتر سراغ روش‌های خطرناک برود و پیدا کردن کد ناامن هم ساده‌تر شود.",
                        },
                    ]
                ],
                "accordions": [
                    {
                        "title": "AngularJS",
                        "blocks": [
                            {
                                **GUIDE["protection"]["sections"][0]["accordions"][0]["blocks"][0],
                                "text": "در Angular محتوای پویایی که داخل آکولاد نوشته شود معمولاً خودکار escape می‌شود؛ پس نمونه زیر امن است:",
                            },
                            {
                                **GUIDE["protection"]["sections"][0]["accordions"][0]["blocks"][1],
                                "text": "اما مراقب کدی باش که محتوای پویا را به `innerHTML` وصل می‌کند؛ این حالت خودکار escape نمی‌شود:",
                            },
                        ],
                    },
                    {
                        "title": "React",
                        "blocks": [
                            {
                                **GUIDE["protection"]["sections"][0]["accordions"][1]["blocks"][0],
                                "text": "در React هم محتوای پویایی که داخل آکولاد نوشته شود معمولاً خودکار escape می‌شود؛ پس نمونه زیر امن است:",
                            },
                            {
                                **GUIDE["protection"]["sections"][0]["accordions"][1]["blocks"][1],
                                "text": "React اجازه می‌دهد با `dangerouslySetInnerHTML`، HTML خام داخل صفحه بنویسی. اسمش عمداً ترسناک است تا یادت بماند این کار خطر دارد. مراقب کدهایی شبیه نمونه زیر باش:",
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
                            "text": "گاهی استفاده از یک فریم‌ورک کامل JavaScript برای سایت بیش از حد سنگین است. در این حالت باید مرتب code review انجام بدهی و بخش‌هایی را پیدا کنی که از ",
                        },
                        {"type": "code", "text": "window.location.hash"},
                        {
                            "type": "text",
                            "text": " استفاده می‌کنند. بهتر است برای خواندن و تفسیر URI fragment استاندارد مشخصی داشته باشی و این منطق را در یک کتابخانه مرکزی نگه داری.",
                        },
                    ],
                    [
                        {
                            "type": "text",
                            "text": "اگر از JQuery استفاده می‌کنی، هر جایی را که تابع ",
                        },
                        {"type": "link", "text": "html(...)"},
                        {
                            "type": "text",
                            "text": " را صدا می‌زند با دقت بررسی کن. اگر سمت کاربر بر اساس ورودی غیرقابل‌اعتماد HTML خام می‌سازی، ممکن است آسیب‌پذیر باشی؛ فرقی هم ندارد آن ورودی از URI fragment آمده باشد یا از جای دیگر. هر وقت ممکن است از ",
                        },
                        {"type": "link", "text": "text(...)"},
                        {"type": "text", "text": " استفاده کن."},
                    ],
                    [
                        {
                            "type": "text",
                            "text": "اگر مستقیم از DOM APIهای خود مرورگر استفاده می‌کنی، تا حد ممکن از این propertyها و تابع‌ها دوری کن:",
                        }
                    ],
                ],
                "after_bullets": [
                    [
                        {"type": "text", "text": "به‌جای آن، هر جا ممکن است متن را "},
                        {"type": "em", "text": "داخل"},
                        {"type": "text", "text": " تگ‌ها تنظیم کن:"},
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
                            "text": " برای تبدیل JSON به objectهای JavaScript آن را اجرا یا evaluate نکن؛ مثلاً با تابع ",
                        },
                        {"type": "code", "text": "eval(...)"},
                        {"type": "text", "text": ". به‌جای این کار از "},
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
                            "text": "Burp Suite، محصول شرکت امنیتی ",
                        },
                        {"type": "link", "text": "PortSwigger"},
                        {
                            "type": "text",
                            "text": "، می‌تواند برای پیدا کردن ",
                        },
                        {"type": "link", "text": "آسیب‌پذیری‌های DOM-based"},
                        {"type": "text", "text": " کمک کند."},
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
                            "text": "امن‌ترین کد، کدی است که اصلاً لازم نیست نوشته شود. اگر واقعاً نیازی به URI fragment نداری، از آن استفاده نکن. یک unit test بنویس که JavaScript پروژه را برای عبارت ",
                        },
                        {"type": "code", "text": "window.location.hash"},
                        {
                            "type": "text",
                            "text": " بررسی کند و اگر آن را پیدا کرد fail شود. اگر واقعاً به URI fragment نیاز داشتی، ",
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
                            "text": "مرورگرها از Content-Security Policy پشتیبانی می‌کنند؛ قابلیتی که به سازنده صفحه اجازه می‌دهد مشخص کند JavaScript و ",
                        },
                        {"type": "link", "text": "منابع دیگر"},
                        {
                            "type": "text",
                            "text": " از چه دامنه‌هایی اجازه بارگذاری و اجرا دارند. حمله‌های XSS معمولاً وقتی موفق می‌شوند که مهاجم بتواند script مخرب را در صفحه کاربر اجرا کند؛ یا با تزریق تگ inline ",
                        },
                        {"type": "code", "text": "<script>"},
                        {"type": "text", "text": " جایی داخل تگ "},
                        {"type": "code", "text": "<html>"},
                        {
                            "type": "text",
                            "text": " صفحه، یا با مجبور کردن مرورگر به بارگذاری JavaScript از یک دامنه مخرب.",
                        },
                    ],
                    [
                        {
                            "type": "text",
                            "text": "با تنظیم Content-Security Policy در response header، می‌توانی به مرورگر بگویی JavaScript inline را ",
                        },
                        {"type": "em", "text": "هرگز"},
                        {
                            "type": "text",
                            "text": " اجرا نکند و JavaScript را فقط از دامنه‌های مشخص‌شده بپذیرد:",
                        },
                    ],
                ],
                "after_terminal": [
                    [
                        {
                            "type": "strong",
                            "text": "وقتی URLهایی را که اجازه بارگذاری script دارند مشخص می‌کنی، عملاً می‌گویی JavaScript inline مجاز نیست.",
                        }
                    ],
                    [
                        {
                            "type": "text",
                            "text": "Content-Security Policy را می‌شود داخل تگ ",
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
                            "text": "این روش می‌تواند خیلی مؤثر از کاربران تو محافظت کند!",
                        },
                        {
                            "type": "text",
                            "text": " البته آماده‌کردن سایت برای چنین headerهایی کمی نظم و بازبینی می‌خواهد. scriptهای inline در توسعه وب مدرن عادت خوبی نیستند، چون محتوا و کد را قاطی می‌کنند و نگهداری برنامه را سخت‌تر می‌کنند؛ ولی در سایت‌های قدیمی هنوز زیاد دیده می‌شوند.",
                        },
                    ],
                    [
                        {
                            "type": "text",
                            "text": "برای حذف مرحله‌به‌مرحله scriptهای inline، می‌توانی از ",
                        },
                        {"type": "link", "text": "گزارش‌های نقض CSP"},
                        {"type": "text", "text": " استفاده کنی. با اضافه کردن directive به نام "},
                        {"type": "code", "text": "report-to"},
                        {
                            "type": "text",
                            "text": " در policy header، مرورگر به‌جای اینکه JavaScript inline را فوراً مسدود کند، نقض policyها را به تو گزارش می‌دهد:",
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
        "summary": "با یک آزمون کوتاه مطمئن شو مفهوم DOM-based XSS را گرفته‌ای ←",
        "path": "/lessons/dom-based-xss-quiz",
    },
}


GUIDE_TRANSLATIONS = {
    "en": GUIDE,
    "fa": FA_GUIDE,
}


def inline_plain_text(parts):
    return " ".join(part.get("text", "") for part in parts if part.get("type") != "break")
