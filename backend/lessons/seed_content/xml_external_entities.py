LESSON = {
    "slug": "xml-external-entities",
    "title": "XML External Entities",
    "summary": "Learn how unsafe XML external entity parsing can expose sensitive server files.",
    "difficulty": "intermediate",
    "sort_order": 6,
    "estimated_minutes": 15,
    "simulation_key": "xml-external-entities",
    "required_locales": ("fa", "en"),
    "guide_path": "/lessons/xml-external-entities-guide",
    "quiz_path": "/lessons/xml-external-entities-quiz",
    "quiz_start_path": "/lessons/xml-external-entities-quiz-start",
    "lessons_path": "/lessons",
    "total_steps": 17,
    "final_step": 16,
    "steps": [
        [{"type": "text", "text": "XML is a useful data format because data files can be checked for correctness before being processed."}],
        [{"type": "text", "text": "The structure of an XML document can be validated against a Document Type Definition (DTD) for correctness. DTDs can be inlined in XML documents, and can refer to external entities."}],
        [{"type": "text", "text": "This is where problems can occur. In the process of resolving external entities, an XML parser may consult various networking protocols depending on the scheme specified in URLs."}],
        [{"type": "text", "text": "By making clever use of external entity references, an attacker can probe your server for files, hang the parser altogether by referencing URLs that never respond, or trigger fraudulent requests on the server-side. Let's look at one potential attack scenario."}],
        [{"type": "text", "text": 'Open ID is a popular authentication scheme implemented by web developers who want to use a third-party identity provider. Whenever you see "Login with Google" you are using Open ID.'}],
        [{"type": "text", "text": "With Open ID the workflow is generally performed by redirects between the site the user is seeking to log into (the relying party) and the identity provider."}],
        [{"type": "text", "text": "Version 2.0 of the Open ID specification allows for service discovery via XML. If the Open ID implementation is insecure, this allows harmful XML to be injected."}],
        [{"type": "text", "text": "Mal is a hacker who has discovered a vulnerability in the Open ID implementation of a popular social networking site."}],
        [{"type": "text", "text": "He crafts a malicious XML file with an external reference to the path /etc/shadow - a file that commonly holds password information on Linux systems. His hope is that when the XML is parsed, the parser will expand this file inline, revealing sensitive information to him."}],
        [{"type": "text", "text": "He then hosts the malicious XML file on his own server as part of the trap."}],
        [{"type": "text", "text": "Next he crafts a URL to the social media site mentioning the URL of his malicious XML file."}],
        [{"type": "text", "text": "He opens the URL in his browser. The social media site reaches out to find the XML descriptor."}],
        [{"type": "text", "text": "During parsing, it expands out the external entity reference, and includes the local user information file, just as Mal hoped. The first part of the trap is sprung."}],
        [{"type": "text", "text": "The expanded XML is now malformed, so the authentication process terminates, as you would expect."}],
        [{"type": "text", "text": "However, as part of the error reporting back to Mal, the site includes the fully expanded XML file - which incorporates the user information file. The trap is sprung!"}],
        [{"type": "text", "text": "And now Mal has a foot in the door. He is able to read sensitive data files on the server, and it is likely only a matter of time before he figures out how to smuggle code up there and escalate his attacks."}],
        [
            {"type": "strong", "text": "This is just one way unchecked XML parsing can be abused."},
            {"type": "text", "text": " Let's see how to protect yourself."},
        ],
    ],
    "completion": [
        {"type": "text", "text": "Now that you have seen how XML external entities work, let's learn how to prevent them."}
    ],
    "simulation": {
        "payload": "/openid/receiver.php?provider_id=1010459756371&openid.op_endpoint=132.321.222.120",
        "code": {
            "malicious": {
                "header": "malicious.xml",
                "body": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<!DOCTYPE xrds [\n<!ENTITY passwords SYSTEM \"file://etc/shadow\">\n]>\n<xrds>\n  &passwords;\n</xrds>",
            },
            "error": {
                "header": "error.xml",
                "body": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<!DOCTYPE xrds [\n<!ENTITY passwords SYSTEM \"file://etc/shadow\">\n]>\n<xrds>\n  root:$6$9K3EQkch$PTpXh6M×5mmAVmC\n  admin:$1$3.9г4eV$3nHTS5X7CJOYv9\n  daemon:*:18642:0:99999:7\n  bin:*:18642:0:99999:7\n  sys:*:18642:0:99999:7\n  sync:*:18642:0:99999:7\n</xrds>",
            },
            "shadow": {
                "header": "/etc/shadow",
                "body": "root:Qkc6M$6$9K3Exh$PTpXh×5mmAVmC admin:$1$3.9г4eV$3nHTS5X7CJOYv9 daemon:*:18642:0:99999:7\nbin:*:18642:0:99999:7 sys:*:18642:0:99999:7 sync:*:18642:0:99999:7",
            },
        },
        "sites": {
            "relying_party": {
                "url": "www.bookface.com",
                "title": "bookface",
                "alt": "Relying party social network",
            },
            "identity_provider": {
                "url": "accounts.identity-provider.test",
                "title": "Identity Provider",
                "alt": "Identity provider sign in",
            },
        },
        "scenes": {
            "3": {"type": "probe"},
            "4": {"type": "browser-image", "image": "relying_party"},
            "5": {"type": "browser-image", "image": "identity_provider"},
            "6": {"type": "browser-image", "image": "relying_party_authenticated"},
            "7": {"type": "mal-with-browser", "mal": "pensive", "image": "relying_party"},
            "8": {"type": "mal-code", "mal": "hacking", "code": "malicious"},
            "9": {"type": "mal-code", "mal": "hacking", "code": "malicious"},
            "10": {"type": "mal-payload-code", "mal": "hacking", "code": "malicious"},
            "11": {"type": "mal-with-browser", "mal": "hacking", "image": "relying_party"},
            "12": {"type": "mal-with-browser", "mal": "hacking", "image": "relying_party_authenticated"},
            "13": {"type": "mal-with-browser", "mal": "hacking", "image": "relying_party_error"},
            "14": {"type": "mal-code", "mal": "succeed", "code": "error"},
            "15": {"type": "mal-code", "mal": "succeed", "code": "shadow"},
        },
    },
    "quiz_intro": {
        "eyebrow": "Test your knowledge",
        "icon": "🧠",
        "title": "Quiz: XML External Entities",
        "summary": "Take this quick quiz to show you were paying attention.",
        "start_button": "Start the quiz",
        "review_button": "Review the material one more time →",
    },
    "quiz": {
        "title": "XML External Entities quiz",
        "instructions": "Take this quick quiz to show you were paying attention.",
        "pass_percentage": 100,
        "shuffle_questions": False,
        "shuffle_answers": False,
        "questions": [
            {
                "key": "inline-dtd-purpose",
                "type": "single",
                "prompt": "What can inline DTDs be used for?",
                "answers": [
                    {
                        "key": "executable-code",
                        "text": "Declaring executable application code.",
                        "is_correct": False,
                    },
                    {
                        "key": "external-entities",
                        "text": "Referencing external entities that can be expanded during XML parsing.",
                        "is_correct": True,
                    },
                    {
                        "key": "browser-styles",
                        "text": "Styling XML documents in the browser.",
                        "is_correct": False,
                    },
                    {
                        "key": "database-tables",
                        "text": "Creating database tables automatically.",
                        "is_correct": False,
                    },
                ],
            },
            {
                "key": "reduce-xxe-impact",
                "type": "single",
                "prompt": "How could you lessen the impact of an XML external entity vulnerability?",
                "answers": [
                    {
                        "key": "disable-tls-checks",
                        "text": "Disable TLS certificate checks before parsing XML.",
                        "is_correct": False,
                    },
                    {
                        "key": "least-privilege-disk",
                        "text": "Prevent the XML parsing code from accessing sensitive files on disk.",
                        "is_correct": True,
                    },
                    {
                        "key": "verbose-errors",
                        "text": "Return the fully expanded XML document in error messages.",
                        "is_correct": False,
                    },
                    {
                        "key": "enable-network",
                        "text": "Allow the XML parser to fetch any network resource it finds.",
                        "is_correct": False,
                    },
                ],
            }
        ],
    },
}

GUIDE = {
    "overview": {
        "title": "XML External Entities",
        "metrics": [
            {"label": "Prevalence", "value": "Rare", "icon": "⚙️", "tone": "orange"},
            {"label": "Exploitability", "value": "Difficult", "icon": "🔧", "tone": "orange"},
            {"label": "Impact", "value": "Devastating", "icon": "💀", "tone": "red"},
        ],
        "paragraphs": [
            [
                {
                    "type": "strong",
                    "text": "Unsecured XML parsers can permit an attacker to probe your file system for sensitive information.",
                },
                {
                    "type": "text",
                    "text": " If your site accepts XML in any fashion, you need to ensure your parser is correctly configured.",
                },
            ]
        ],
    },
    "risks": {
        "title": "Risks",
        "icon": "⚠️",
        "paragraphs": [
            [
                {"type": "highlight", "text": "XML External Entity"},
                {
                    "type": "text",
                    "text": " attacks allow a malicious user to read arbitrary files on your server.",
                },
            ],
            [
                {
                    "type": "text",
                    "text": "Getting access to the server's file system is often the first step an attacker will take when compromising your system. Unless you deploy a ",
                },
                {"type": "highlight", "text": "intrusion detection system"},
                {
                    "type": "text",
                    "text": ", you will often not know it is occurring until it's too late.",
                },
            ],
            [
                {"type": "strong", "text": "Even big companies like "},
                {"type": "link", "text": "Facebook"},
                {"type": "strong", "text": " have suffered from this vulnerability in the past."},
            ],
        ],
        "bullets": [],
        "closing": [],
    },
    "protection": {
        "title": "Protection",
        "icon": "🔒",
        "intro": [],
        "sections": [
            {
                "heading": "Disable Parsing of Inline DTDs",
                "paragraphs": [
                    [
                        {
                            "type": "text",
                            "text": "Inline DTDs are a feature that is rarely used. However, XML external attacks remain a risk because many XML parsing libraries do not disable this feature by default. ",
                        },
                        {
                            "type": "strong",
                            "text": "Make sure your XML parser configuration disables this feature.",
                        },
                        {
                            "type": "text",
                            "text": " See the code samples below, or consult your API documentation. Making this simple configuration change will protect you against XML External Entity attacks, and ",
                        },
                        {"type": "link", "text": "XML Bombs"},
                        {"type": "text", "text": "."},
                    ]
                ],
            },
            {
                "heading": "Limit the Permissions of Your Web Server Process",
                "paragraphs": [
                    [
                        {
                            "type": "text",
                            "text": "Run your server processes with only the permissions they require to function -- follow the ",
                        },
                        {"type": "link", "text": "principle of least privilege"},
                        {
                            "type": "text",
                            "text": ". This means restricting which directories in the file-system can be accessed. Consider running in a ",
                        },
                        {"type": "strong", "text": "chroot jail"},
                        {"type": "text", "text": " if you are running on Unix."},
                    ],
                    [
                        {
                            "type": "text",
                            "text": 'This "defense in depth" approach means that even if an attacker manages to compromise your web server, the damage they can do is limited.',
                        }
                    ],
                ],
            },
        ],
    },
    "code_samples": {
        "title": "Code Samples",
        "icon": "📄",
        "intro": "The following code samples indicate how to disable inline DTDs in the major XML-parsing libraries.",
        "items": [
            {
                "title": "Ruby",
                "blocks": [
                    {
                        "heading": "Nokogiri",
                        "paragraphs": [
                            "You can disable expanding of external entities in Nokogiri in the following manner:"
                        ],
                        "code": "# Open the XML file, perform config by pass a block.\ndoc = Nokogiri::XML(File.open(\"data.xml\")) do |config|\n  config.strict.noent\nend",
                        "closing": [
                            "Note that Nokogiri forbids network access when expanding external entities by default, since it uses the nonet configuration option."
                        ],
                    }
                ],
            },
            {
                "title": "Java",
                "blocks": [
                    {
                        "code": "DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();\nString FEATURE = \"https://apache.org/xml/features/disallow-doctype-decl\";\ndbf.setFeature(FEATURE, true);",
                    }
                ],
            },
            {
                "title": "C#",
                "blocks": [
                    {
                        "heading": ".NET 3.5 and Before",
                        "code": "// Disable directly on the reader...\nXmlTextReader reader = new XmlTextReader(stream);\nreader.ProhibitDtd = true;\n\n// ...or on the settings object.\nXmlReaderSettings settings = new XmlReaderSettings();\nsettings.ProhibitDtd = true;\nXmlReader reader = XmlReader.Create(stream, settings);",
                    },
                    {
                        "heading": ".NET 4.0 and After",
                        "code": "// Will throw an error if a <!DOCTYPE> element occurs.\nXmlReaderSettings settings = new XmlReaderSettings();\nsettings.DtdProcessing = DtdProcessing.Prohibit;\nXmlReader reader = XmlReader.Create(stream, settings);",
                    },
                ],
            },
        ],
    },
    "quiz_cta": {
        "eyebrow": "Got it?",
        "icon": "✏️",
        "label": "Quiz:",
        "title": "XML External Entities",
        "summary": "Take a quick quiz to show you were paying attention →",
        "path": "/lessons/xml-external-entities-quiz",
    },
}

FA_LESSON = {
    **LESSON,
    "summary": "یاد بگیر XML External Entity ناامن چطور می‌تواند فایل‌های حساس سرور را لو بدهد.",
    "steps": [
        [{"type": "text", "text": "XML قالبی برای ذخیره و جابه‌جایی داده است. مزیتش این است که قبل از پردازش، می‌توان بررسی کرد فایل ساختار درستی دارد یا نه."}],
        [{"type": "text", "text": "برای بررسی ساختار یک فایل XML، می‌شود از Document Type Definition یا DTD استفاده کرد. DTD می‌تواند داخل همان فایل XML نوشته شود و حتی به چیزهایی خارج از فایل هم اشاره کند."}],
        [{"type": "text", "text": "مشکل از همین اشاره‌های خارجی شروع می‌شود. وقتی parser می‌خواهد آن‌ها را بخواند، ممکن است سراغ فایل‌های داخل سرور یا آدرس‌های شبکه برود؛ بسته به چیزی که داخل XML نوشته شده است."}],
        [{"type": "text", "text": "اگر مهاجم از این قابلیت بد استفاده کند، می‌تواند دنبال فایل‌های حساس روی سرور بگردد، parser را با آدرس‌هایی که جواب نمی‌دهند گیر بیندازد، یا باعث شود سرور درخواست‌هایی بفرستد که نباید بفرستد. بیایید یک سناریوی واقعی‌تر را قدم‌به‌قدم ببینیم."}],
        [{"type": "text", "text": "Open ID یک روش رایج برای ورود با حساب‌های بیرونی است. مثلاً وقتی در سایتی دکمه‌ی «Login with Google» را می‌بینی، معمولاً پشت صحنه از Open ID استفاده می‌شود."}],
        [{"type": "text", "text": "در Open ID، کاربر بین دو بخش جابه‌جا می‌شود: سایتی که می‌خواهد وارد آن شود، یعنی relying party، و سرویسی که هویت کاربر را تأیید می‌کند، یعنی identity provider."}],
        [{"type": "text", "text": "در نسخه 2.0 استاندارد Open ID، بعضی اطلاعات سرویس می‌تواند از طریق XML پیدا شود. اگر این بخش ناامن پیاده‌سازی شده باشد، مهاجم می‌تواند XML مخرب وارد جریان ورود کند."}],
        [{"type": "text", "text": "Mal یک هکر است که متوجه شده پیاده‌سازی Open ID در یک شبکه اجتماعی محبوب مشکل امنیتی دارد."}],
        [
            {"type": "text", "text": "او یک فایل XML مخرب می‌سازد و داخل آن به مسیر "},
            {"type": "code", "text": "/etc/shadow"},
            {"type": "text", "text": " اشاره می‌کند؛ فایلی که در سیستم‌های Linux معمولاً اطلاعات حساس مربوط به رمزها را نگه می‌دارد. Mal امیدوار است وقتی XML پردازش می‌شود، parser محتوای این فایل را داخل XML قرار دهد و اطلاعات حساس لو برود."},
        ],
        [{"type": "text", "text": "بعد همین فایل XML مخرب را روی سرور خودش می‌گذارد تا قربانی بتواند آن را دریافت کند؛ تله آماده است."}],
        [{"type": "text", "text": "حالا یک URL برای سایت شبکه اجتماعی می‌سازد و داخل آن، آدرس فایل XML مخرب خودش را به عنوان provider معرفی می‌کند."}],
        [{"type": "text", "text": "Mal این URL را در مرورگر باز می‌کند. سایت شبکه اجتماعی برای پیدا کردن XML descriptor به آدرسی می‌رود که Mal معرفی کرده است."}],
        [{"type": "text", "text": "وقتی XML توسط parser خوانده می‌شود، اشاره‌ی خارجی داخل آن باز می‌شود و محتوای فایل حساس سرور وارد XML می‌شود؛ دقیقاً همان چیزی که Mal می‌خواست. تله شروع به کار کرده است."}],
        [{"type": "text", "text": "حالا XML نهایی ساختار درستی ندارد، پس فرایند ورود طبق انتظار با خطا متوقف می‌شود."}],
        [{"type": "text", "text": "اما مشکل اینجاست: سایت در پیام خطایی که به Mal نشان می‌دهد، همان XML کامل‌شده را هم برمی‌گرداند؛ XMLای که حالا بخشی از اطلاعات حساس سرور داخل آن قرار گرفته است. تله کامل عمل کرد!"}],
        [{"type": "text", "text": "حالا Mal یک جای پا داخل سیستم پیدا کرده است. او می‌تواند فایل‌های حساس سرور را بخواند، و اگر زمان کافی داشته باشد شاید راهی برای حمله‌ی بزرگ‌تر یا اجرای کد هم پیدا کند."}],
        [
            {"type": "strong", "text": "این فقط یکی از راه‌هایی است که XML parsing ناامن می‌تواند دردسرساز شود."},
            {"type": "text", "text": " حالا بیایید ببینیم چطور می‌شود جلوی این حمله را گرفت."},
        ],
    ],
    "completion": [
        {"type": "text", "text": "حالا که دیدی XML External Entity چطور کار می‌کند، بیایید یاد بگیریم چطور از آن جلوگیری کنیم."}
    ],
    "quiz_intro": {
        "eyebrow": "دانشت را بسنج",
        "icon": "🧠",
        "title": "آزمون: XML External Entities",
        "summary": "با این آزمون کوتاه مطمئن شو مفهوم اصلی XXE را درست گرفته‌ای.",
        "start_button": "شروع آزمون",
        "review_button": "یک بار دیگر راهنما را مرور کن ←",
    },
    "quiz": {
        **LESSON["quiz"],
        "title": "آزمون: XML External Entities",
        "instructions": "با این آزمون کوتاه مطمئن شو مفهوم اصلی XXE را درست گرفته‌ای.",
        "questions": [
            {
                **LESSON["quiz"]["questions"][0],
                "prompt": "inline DTDها چه قابلیتی به یک فایل XML می‌دهند؟",
                "answers": [
                    {
                        **LESSON["quiz"]["questions"][0]["answers"][0],
                        "text": "اینکه داخل XML کد اجرایی برنامه تعریف شود.",
                    },
                    {
                        **LESSON["quiz"]["questions"][0]["answers"][1],
                        "text": "اینکه XML به external entityهایی اشاره کند که هنگام پردازش باز می‌شوند.",
                    },
                    {
                        **LESSON["quiz"]["questions"][0]["answers"][2],
                        "text": "اینکه ظاهر سند XML در مرورگر زیباتر شود.",
                    },
                    {
                        **LESSON["quiz"]["questions"][0]["answers"][3],
                        "text": "اینکه جدول‌های پایگاه‌داده به‌صورت خودکار ساخته شوند.",
                    },
                ],
            },
            {
                **LESSON["quiz"]["questions"][1],
                "prompt": "اگر یک آسیب‌پذیری XML External Entity وجود داشته باشد، چطور می‌شود آسیب آن را کمتر کرد؟",
                "answers": [
                    {
                        **LESSON["quiz"]["questions"][1]["answers"][0],
                        "text": "قبل از پردازش XML، بررسی TLS را خاموش کنی.",
                    },
                    {
                        **LESSON["quiz"]["questions"][1]["answers"][1],
                        "text": "کاری کنی کد پردازش XML به فایل‌های حساس روی دیسک دسترسی نداشته باشد.",
                    },
                    {
                        **LESSON["quiz"]["questions"][1]["answers"][2],
                        "text": "XML کامل‌شده را داخل پیام خطا به کاربر نشان بدهی.",
                    },
                    {
                        **LESSON["quiz"]["questions"][1]["answers"][3],
                        "text": "به parser اجازه بدهی هر آدرس شبکه‌ای را که داخل XML دید دریافت کند.",
                    },
                ],
            },
        ],
    },
}

FA_GUIDE = {
    **GUIDE,
    "overview": {
        "title": "XML External Entities",
        "metrics": [
            {"label": "چقدر رایج است", "value": "نادر", "icon": "⚙️", "tone": "orange"},
            {"label": "سوءاستفاده از آن", "value": "دشوار", "icon": "🔧", "tone": "orange"},
            {"label": "شدت آسیب", "value": "ویرانگر", "icon": "💀", "tone": "red"},
        ],
        "paragraphs": [
            [
                {
                    "type": "strong",
                    "text": "اگر XML parser درست تنظیم نشده باشد، مهاجم ممکن است بتواند فایل‌های حساس سرور را پیدا و افشا کند.",
                },
                {
                    "type": "text",
                    "text": " اگر سایت تو به هر شکلی XML دریافت می‌کند، باید مطمئن شوی parser آن امن پیکربندی شده است.",
                },
            ]
        ],
    },
    "risks": {
        "title": "ریسک‌ها",
        "icon": "⚠️",
        "paragraphs": [
            [
                {"type": "highlight", "text": "XML External Entity"},
                {
                    "type": "text",
                    "text": " می‌تواند به مهاجم اجازه بدهد فایل‌هایی را از روی سرور بخواند؛ فایل‌هایی که اصلاً نباید در دسترس او باشند.",
                },
            ],
            [
                {
                    "type": "text",
                    "text": "وقتی مهاجم به فایل‌سیستم سرور دسترسی پیدا کند، معمولاً یک قدم مهم به نفوذ عمیق‌تر نزدیک شده است. اگر ",
                },
                {"type": "highlight", "text": "سیستم تشخیص نفوذ"},
                {
                    "type": "text",
                    "text": " نداشته باشی، ممکن است این اتفاق بیفتد و تا مدت‌ها اصلاً متوجهش نشوی.",
                },
            ],
            [
                {"type": "strong", "text": "حتی شرکت‌های بزرگی مثل "},
                {"type": "link", "text": "Facebook"},
                {"type": "strong", "text": " هم در گذشته با این آسیب‌پذیری درگیر شده‌اند."},
            ],
        ],
        "bullets": [],
        "closing": [],
    },
    "protection": {
        "title": "محافظت",
        "icon": "🔒",
        "intro": [],
        "sections": [
            {
                "heading": "پردازش inline DTDها را غیرفعال کن",
                "paragraphs": [
                    [
                        {
                            "type": "text",
                            "text": "inline DTD معمولاً چیزی نیست که بیشتر برنامه‌ها واقعاً به آن نیاز داشته باشند. با این حال، حملات XML external خطرناک می‌مانند، چون بعضی کتابخانه‌های پردازش XML این قابلیت را به‌صورت پیش‌فرض خاموش نمی‌کنند. ",
                        },
                        {
                            "type": "strong",
                            "text": "مطمئن شو تنظیمات XML parser تو inline DTD را غیرفعال می‌کند.",
                        },
                        {
                            "type": "text",
                            "text": " نمونه کدهای پایین را ببین یا مستندات API ابزار خودت را بررسی کن. همین تنظیم ساده می‌تواند جلوی حملات XML External Entity و ",
                        },
                        {"type": "link", "text": "XML Bombs"},
                        {"type": "text", "text": " را بگیرد."},
                    ]
                ],
            },
            {
                "heading": "دسترسی‌های فرایند وب‌سرور را محدود کن",
                "paragraphs": [
                    [
                        {
                            "type": "text",
                            "text": "فرایندهای سرور را فقط با دسترسی‌هایی اجرا کن که واقعاً برای کارشان لازم دارند؛ یعنی از ",
                        },
                        {"type": "link", "text": "اصل کمترین دسترسی"},
                        {
                            "type": "text",
                            "text": " پیروی کن. یعنی مشخص کنی برنامه به کدام بخش‌های فایل‌سیستم اجازه دسترسی دارد. اگر روی Unix اجرا می‌کنی، می‌توانی اجرای سرویس داخل ",
                        },
                        {"type": "strong", "text": "chroot jail"},
                        {"type": "text", "text": " را هم در نظر بگیری."},
                    ],
                    [
                        {
                            "type": "text",
                            "text": "این رویکرد «دفاع چندلایه» باعث می‌شود حتی اگر مهاجم از یک بخش عبور کرد، نتواند آزادانه به همه‌چیز روی سرور دسترسی پیدا کند.",
                        }
                    ],
                ],
            },
        ],
    },
    "code_samples": {
        **GUIDE["code_samples"],
        "title": "نمونه کدها",
        "intro": "نمونه‌های زیر نشان می‌دهند در چند کتابخانه رایج پردازش XML چطور می‌شود inline DTDها را غیرفعال کرد.",
        "items": [
            {
                **GUIDE["code_samples"]["items"][0],
                "blocks": [
                    {
                        **GUIDE["code_samples"]["items"][0]["blocks"][0],
                        "paragraphs": [
                            "در Nokogiri می‌توانی جلوی باز شدن external entityها را به شکل زیر بگیری:"
                        ],
                        "closing": [
                            "Nokogiri به‌صورت پیش‌فرض هنگام کار با external entityها اجازه دسترسی شبکه‌ای نمی‌دهد، چون از گزینه nonet استفاده می‌کند."
                        ],
                    }
                ],
            },
            GUIDE["code_samples"]["items"][1],
            GUIDE["code_samples"]["items"][2],
        ],
    },
    "quiz_cta": {
        "eyebrow": "یاد گرفتی؟",
        "icon": "✏️",
        "label": "آزمون:",
        "title": "XML External Entities",
        "summary": "با یک آزمون کوتاه مطمئن شو مفهوم XXE را درست گرفته‌ای ←",
        "path": "/lessons/xml-external-entities-quiz",
    },
}

LESSON_TRANSLATIONS = {"en": LESSON, "fa": FA_LESSON}
GUIDE_TRANSLATIONS = {"en": GUIDE, "fa": FA_GUIDE}


def inline_plain_text(parts):
    return "".join(part.get("text", "\n" if part.get("type") == "break" else "") for part in parts)
