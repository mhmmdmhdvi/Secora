export const XSS_GUIDE_COPY = {
  en: {
    overview: {
      title: "Cross-Site Scripting",
      metrics: [
        { icon: "📊", label: "Prevalence", value: "Common", tone: "orange" },
        { icon: "💣", label: "Exploitability", value: "Easy", tone: "red" },
        { icon: "🔥", label: "Impact", value: "Harmful", tone: "rose" },
      ],
      paragraphs: [
        [
          { type: "strong", text: "Cross-site scripting" },
          {
            type: "text",
            text: " (XSS) is one of the most common methods hackers use to attack websites. XSS vulnerabilities permit a malicious user to execute arbitrary chunks of JavaScript when other users visit your site.",
          },
        ],
        [
          {
            type: "strong",
            text: "XSS is the most common publicly reported security vulnerability, and part of every hacker's toolkit.",
          },
        ],
      ],
    },
    risks: {
      title: "Risks",
      question:
        "What could a determined hacker do when exploiting an XSS vulnerability?",
      intro:
        "XSS allows arbitrary execution of JavaScript code, so the damage that can be done by an attacker depends on the sensitivity of the data being handled by your site. Some of the things hackers have done by exploiting XSS include:",
      bullets: [
        [
          { type: "strong", text: "Spreading" },
          { type: "text", text: " worms " },
          { type: "strong", text: "on social media sites." },
          {
            type: "text",
            text: " Facebook, Twitter and YouTube have all been successfully attacked in this way.",
          },
        ],
        [
          { type: "strong", text: "Session hijacking." },
          {
            type: "text",
            text: " Malicious JavaScript may be able to send the session ID to a remote site under the hacker's control, allowing the hacker to impersonate that user by hijacking a session in progress.",
          },
        ],
        [
          { type: "strong", text: "Identity theft." },
          {
            type: "text",
            text: " If the user enters confidential information such as credit card numbers into a compromised website, these details can be stolen using malicious JavaScript.",
          },
        ],
        [
          {
            type: "text",
            text: "Denial of service attacks ",
          },
          { type: "strong", text: "and website vandalism." },
        ],
        [
          { type: "strong", text: "Theft of sensitive data" },
          { type: "text", text: " like passwords." },
        ],
        [
          { type: "strong", text: "Financial fraud" },
          { type: "text", text: " on banking sites." },
        ],
      ],
      closing:
        "XSS vulnerabilities continue to be among the most exploited web application flaws worldwide, impacting even major social networks and financial institutions.",
    },
    protection: {
      title: "Protection",
      intro:
        "To protect against stored XSS attacks, make sure any dynamic content coming from the data store cannot be used to inject JavaScript on a page.",
      sections: [
        {
          heading: "Escape Dynamic Content",
          paragraphs: [
            [
              {
                type: "text",
                text: "Web pages are made up of HTML, usually described in template files, with dynamic content woven in when the page is rendered. ",
              },
              { type: "strong", text: "Stored XSS attacks" },
              {
                type: "text",
                text: " make use of the improper treatment of dynamic content coming from a backend data store. The attacker abuses an editable field by inserting some JavaScript code, which is evaluated in the browser when another user visits that page.",
              },
            ],
            [
              {
                type: "text",
                text: "Unless your site is a content-management system, it is rare that you want your users to author raw HTML. Instead, you should ",
              },
              { type: "strong", text: "escape" },
              {
                type: "text",
                text: " all dynamic content coming from a data store, so the browser knows it is to be treated as the contents of HTML tags, as opposed to raw HTML.",
              },
            ],
            [
              {
                type: "text",
                text: "Escaping dynamic content generally consists of replacing significant characters with the HTML entity encoding:",
              },
            ],
          ],
        },
        {
          heading: "Allowlist Values",
          paragraphs: [
            [
              {
                type: "text",
                text: "If a particular dynamic data item can only take a handful of valid values, the best practice is to restrict the values in the data store, and have your rendering logic only permit known good values. For instance, instead of asking a user to type in their country of residence, have them select from a drop-down list.",
              },
            ],
          ],
        },
        {
          heading: "Implement a Content-Security Policy",
          paragraphs: [
            [
              {
                type: "text",
                text: "Browsers support Content-Security Policies that allow the author of a web page to control where JavaScript and other resources can be loaded and executed from. XSS attacks rely on the attacker being able to run malicious scripts on a user's web page — either by injecting inline ",
              },
              { type: "code", text: "<script>" },
              {
                type: "text",
                text: " tags somewhere within the HTML of a page, or by tricking the browser into loading JavaScript from a malicious third-party domain.",
              },
            ],
            [
              {
                type: "text",
                text: "By setting a content security policy in the response header, you can tell the browser to never execute inline JavaScript, and to lock down which domains can host JavaScript for a page:",
              },
            ],
          ],
          terminal: "policyHeader",
          afterTerminal: [
            [
              {
                type: "strong",
                text: "By listing the URIs from which scripts can be loaded, you are implicitly stating that inline JavaScript is not allowed.",
              },
            ],
            [
              {
                type: "text",
                text: "The content security policy can also be set in a meta tag in the ",
              },
              { type: "code", text: "head" },
              { type: "text", text: " element of the page:" },
            ],
          ],
          secondTerminal: "metaPolicy",
          closing: [
            [
              {
                type: "strong",
                text: "This approach will protect your users very effectively!",
              },
              {
                type: "text",
                text: " However, it may take a considerable amount of discipline to make your site ready for such a header. Inline script tags are considered bad practice in modern web development, but are common in older sites.",
              },
            ],
            [
              {
                type: "text",
                text: "To migrate away from inline scripts incrementally, consider making use of CSP Violation Reports. By adding a report-to directive in your policy header, the browser will notify you of any policy violations rather than preventing inline JavaScript from executing:",
              },
            ],
          ],
          thirdTerminal: "reportPolicy",
          finalParagraph:
            "This will give you reassurance that there are no lingering inline scripts before you ban them outright.",
        },
        {
          heading: "Sanitize HTML",
          paragraphs: [
            [
              {
                type: "text",
                text: "Some sites have a legitimate need to store and render raw HTML. If your site stores and renders rich content, you need to use an HTML sanitization library to ensure malicious users cannot inject scripts in their HTML submissions.",
              },
            ],
          ],
        },
      ],
      tableHeadings: ["Character", "Encoding"],
      frameworkNote:
        "Most modern frameworks will escape dynamic content by default — see the code samples below for details.",
      escapeClosing:
        "Escaping editable content in this way means it will never be treated as executable code by the browser. This closes the door on most XSS attacks.",
    },
  },
  fa: {
    overview: {
      title: "Cross-Site Scripting",
      metrics: [
        { icon: "📊", label: "چقدر رایج است", value: "زیاد", tone: "orange" },
        { icon: "💣", label: "سوءاستفاده از آن", value: "آسان", tone: "red" },
        { icon: "🔥", label: "شدت آسیب", value: "زیاد", tone: "rose" },
      ],
      paragraphs: [
        [
          { type: "strong", text: "Cross-Site Scripting", dir: "ltr" },
          {
            type: "text",
            text: " یا XSS یکی از رایج‌ترین روش‌هایی است که مهاجم‌ها برای حمله به وب‌سایت‌ها استفاده می‌کنند. وقتی سایت نسبت به XSS آسیب‌پذیر باشد، یک کاربر مخرب می‌تواند کاری کند که هنگام بازدید دیگران از سایت، قطعه‌ای JavaScript در مرورگر آن‌ها اجرا شود.",
          },
        ],
        [
          {
            type: "strong",
            text: "XSS از رایج‌ترین آسیب‌پذیری‌های گزارش‌شده در وب است و تقریباً در جعبه‌ابزار هر مهاجمی پیدا می‌شود.",
          },
        ],
      ],
    },
    risks: {
      title: "خطرها",
      question: "اگر یک مهاجم جدی از XSS سوءاستفاده کند، چه کارهایی می‌تواند انجام دهد؟",
      intro:
        "XSS امکان اجرای JavaScript دلخواه را فراهم می‌کند. میزان آسیب به این بستگی دارد که سایت تو چه داده‌هایی را مدیریت می‌کند. نمونه‌هایی از کارهایی که مهاجم‌ها با XSS انجام داده‌اند:",
      bullets: [
        [
          { type: "strong", text: "پخش کردن کرم‌ها" },
          {
            type: "text",
            text: " در شبکه‌های اجتماعی. Facebook، Twitter و YouTube هم قبلاً با این روش مورد حمله قرار گرفته‌اند.",
          },
        ],
        [
          { type: "strong", text: "ربودن نشست کاربر." },
          {
            type: "text",
            text: " JavaScript مخرب ممکن است session ID را به سایتی تحت کنترل مهاجم بفرستد و به او اجازه دهد خودش را جای کاربر جا بزند.",
          },
        ],
        [
          { type: "strong", text: "سرقت هویت." },
          {
            type: "text",
            text: " اگر کاربر اطلاعات حساسی مثل شماره کارت را در یک سایت آلوده وارد کند، همان اطلاعات می‌تواند با JavaScript مخرب دزدیده شود.",
          },
        ],
        [{ type: "text", text: "حمله‌های از کار انداختن سرویس و خرابکاری در ظاهر سایت." }],
        [{ type: "text", text: "سرقت داده‌های حساس مثل رمز عبور." }],
        [{ type: "text", text: "تقلب مالی در سایت‌های بانکی." }],
      ],
      closing:
        "آسیب‌پذیری‌های XSS هنوز هم جزو پر‌استفاده‌ترین ضعف‌های امنیتی وب هستند و حتی شبکه‌های اجتماعی بزرگ و سرویس‌های مالی را هم درگیر کرده‌اند.",
    },
    protection: {
      title: "محافظت",
      intro:
        "برای محافظت در برابر Stored XSS باید مطمئن شوی محتوای dynamic که از دیتابیس می‌آید، نتواند JavaScript را داخل صفحه تزریق و اجرا کند.",
      sections: [
        {
          heading: "Escape کردن محتوای Dynamic",
          paragraphs: [
            [
              {
                type: "text",
                text: "صفحه‌های وب از HTML ساخته می‌شوند؛ معمولاً داخل templateها تعریف می‌شوند و هنگام نمایش صفحه، محتوای dynamic در آن‌ها قرار می‌گیرد. ",
              },
              { type: "strong", text: "حمله Stored XSS" },
              {
                type: "text",
                text: " از همین نقطه سوءاستفاده می‌کند: داده‌ای که از دیتابیس می‌آید درست مدیریت نمی‌شود. مهاجم در یک فیلد قابل ویرایش JavaScript قرار می‌دهد و وقتی کاربر دیگری صفحه را باز می‌کند، آن کد در مرورگر اجرا می‌شود.",
              },
            ],
            [
              {
                type: "text",
                text: "اگر سایت تو یک سیستم مدیریت محتوا نیست، معمولاً نمی‌خواهی کاربرها HTML خام بنویسند. بهتر است همه محتوای dynamic که از دیتابیس می‌آید را ",
              },
              { type: "strong", text: "escape" },
              {
                type: "text",
                text: " کنی تا مرورگر آن را متن معمولی داخل HTML بداند، نه HTML خام و قابل اجرا.",
              },
            ],
            [
              {
                type: "text",
                text: "Escape کردن محتوای dynamic معمولاً یعنی کاراکترهای مهم با HTML entity جایگزین شوند:",
              },
            ],
          ],
        },
        {
          heading: "استفاده از مقدارهای مجاز",
          paragraphs: [
            [
              {
                type: "text",
                text: "اگر یک داده dynamic فقط می‌تواند چند مقدار مشخص و معتبر داشته باشد، بهترین کار این است که همان مقدارها را در دیتابیس محدود کنی و منطق نمایش فقط همان مقدارهای امن را قبول کند. مثلاً به‌جای اینکه از کاربر بخواهی کشور محل زندگی‌اش را دستی تایپ کند، بهتر است از یک لیست انتخابی استفاده کنی.",
              },
            ],
          ],
        },
        {
          heading: "پیاده‌سازی Content-Security Policy",
          paragraphs: [
            [
              {
                type: "text",
                text: "مرورگرها از Content-Security Policy پشتیبانی می‌کنند؛ قابلیتی که به سازنده صفحه اجازه می‌دهد مشخص کند JavaScript و منابع دیگر از کجا اجازه بارگذاری و اجرا دارند. حمله XSS معمولاً به اجرای اسکریپت مخرب در صفحه کاربر وابسته است؛ یا با تزریق تگ ",
              },
              { type: "code", text: "<script>" },
              {
                type: "text",
                text: " داخل HTML صفحه، یا با مجبور کردن مرورگر به بارگذاری JavaScript از یک دامنه مخرب.",
              },
            ],
            [
              {
                type: "text",
                text: "با تنظیم Content-Security Policy در response header می‌توانی به مرورگر بگویی inline JavaScript را اجرا نکند و فقط از دامنه‌های مشخص‌شده JavaScript بگیرد:",
              },
            ],
          ],
          terminal: "policyHeader",
          afterTerminal: [
            [
              {
                type: "strong",
                text: "وقتی URIهای مجاز برای بارگذاری script را مشخص می‌کنی، عملاً می‌گویی inline JavaScript اجازه اجرا ندارد.",
              },
            ],
            [
              {
                type: "text",
                text: "Content-Security Policy را می‌توان داخل meta tag در بخش ",
              },
              { type: "code", text: "head" },
              { type: "text", text: " صفحه هم تنظیم کرد:" },
            ],
          ],
          secondTerminal: "metaPolicy",
          closing: [
            [
              {
                type: "strong",
                text: "این روش می‌تواند خیلی خوب از کاربران محافظت کند.",
              },
              {
                type: "text",
                text: " البته آماده کردن سایت برای چنین headerای کمی نظم و سخت‌گیری می‌خواهد. inline script در توسعه مدرن وب کار خوبی نیست، اما در سایت‌های قدیمی زیاد دیده می‌شود.",
              },
            ],
            [
              {
                type: "text",
                text: "برای مهاجرت تدریجی از inline scriptها می‌توانی از CSP Violation Reports استفاده کنی. با اضافه کردن report-to directive، مرورگر به‌جای اینکه فوراً اجرای inline JavaScript را متوقف کند، نقض policy را به تو گزارش می‌دهد:",
              },
            ],
          ],
          thirdTerminal: "reportPolicy",
          finalParagraph:
            "این کار به تو اطمینان می‌دهد قبل از ممنوع کردن کامل inline scriptها، مورد پنهانی و جا‌مانده‌ای در سایت باقی نمانده است.",
        },
        {
          heading: "Sanitize کردن HTML",
          paragraphs: [
            [
              {
                type: "text",
                text: "بعضی سایت‌ها واقعاً نیاز دارند HTML خام را ذخیره و نمایش دهند. اگر سایت تو محتوای rich ذخیره و render می‌کند، باید از یک کتابخانه sanitization برای HTML استفاده کنی تا کاربرهای مخرب نتوانند داخل HTML ارسالی خود script تزریق کنند.",
              },
            ],
          ],
        },
      ],
      tableHeadings: ["کاراکتر", "کدگذاری"],
      frameworkNote:
        "بیشتر frameworkهای مدرن محتوای dynamic را به‌صورت پیش‌فرض escape می‌کنند؛ نمونه‌های کد پایین صفحه جزئیات بیشتری نشان می‌دهند.",
      escapeClosing:
        "وقتی محتوای قابل ویرایش این‌طور escape شود، مرورگر دیگر آن را کد اجرایی حساب نمی‌کند. همین کار جلوی بیشتر حمله‌های XSS را می‌گیرد.",
    },
  },
};

export function getXssGuideCopy(language) {
  return XSS_GUIDE_COPY[language === "fa" ? "fa" : "en"];
}
