import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppLanguage } from "../../../../hooks/useAppLanguage";
import TerminalBox from "../../shared/TerminalBox";

const CODE_SAMPLE_GROUPS = [
  {
    title: "Node",
    items: [
      {
        heading: "Mustache.js",
        blocks: [
          {
            en: "Tags in double mustaches automatically escape HTML:",
            fa: "تگ‌هایی که داخل دو mustache نوشته می‌شوند، HTML را به‌صورت خودکار escape می‌کنند:",
            code: "{{ contents }}",
          },
          {
            en: "Tags in triple mustaches do not escape HTML, and should be used with care:",
            fa: "تگ‌هایی که داخل سه mustache نوشته می‌شوند HTML را escape نمی‌کنند؛ پس باید با دقت استفاده شوند:",
            code: "{{{ contents }}}",
          },
        ],
      },
      {
        heading: "Dust.js",
        blocks: [
          {
            en: "Key tags automatically escape HTML:",
            fa: "تگ‌های key به‌صورت خودکار HTML را escape می‌کنند:",
            code: "{ contents }",
          },
          {
            en: "However, escaping can be disabled with the |s operator, so use this with care:",
            fa: "اما با عملگر |s می‌شود escaping را غیرفعال کرد؛ پس با احتیاط از آن استفاده کن:",
            code: "{ contents | s }",
          },
        ],
      },
      {
        heading: "Nunjucks",
        blocks: [
          {
            en: "If auto-escaping is turned on in the environment, Nunjucks will automatically escape tags for safe output:",
            fa: "اگر auto-escaping در محیط فعال باشد، Nunjucks تگ‌ها را برای خروجی امن به‌صورت خودکار escape می‌کند:",
            code: "{{ contents }}",
          },
          {
            en: "Content marked with the safe filter will not be escaped — use this function with care:",
            fa: "محتوایی که با فیلتر safe مشخص شود escape نمی‌شود؛ از این قابلیت با دقت استفاده کن:",
            code: "{{ contents | safe }}",
          },
          {
            en: "Auto-escaping can be disabled for a template, in which case tags need to be escaped manually:",
            fa: "می‌شود auto-escaping را برای یک template غیرفعال کرد؛ در این حالت باید تگ‌ها را دستی escape کنی:",
            code: "{{ contents | escape }}",
          },
        ],
      },
    ],
  },
  {
    title: "Python",
    items: [
      {
        heading: "Django",
        blocks: [
          {
            en: "Templates in Django escape HTML by default, so anything that looks like the following is generally safe:",
            fa: "Templateهای Django به‌صورت پیش‌فرض HTML را escape می‌کنند؛ بنابراین چیزی شبیه نمونه زیر معمولاً امن است:",
            code: "{{ contents }}",
          },
          {
            en: "You can override escape by using the |safe filter. There are often good reasons to do this, but you will need to conduct code reviews on anything that uses this command:",
            fa: "با فیلتر |safe می‌توانی escaping را دور بزنی. گاهی دلیل خوبی برای این کار وجود دارد، اما هر جایی که از این دستور استفاده شده باید حتماً در code review بررسی شود:",
            code: "{{ contents | safe }}",
          },
          {
            en: "Note that HTML-escaping can also be turned on or off with the {% autoescape %} tag.",
            fa: "دقت کن که HTML-escaping با تگ {% autoescape %} هم می‌تواند روشن یا خاموش شود.",
          },
        ],
      },
      {
        heading: "Flask",
        blocks: [
          {
            en: "Flask templates escape HTML by default, so code that looks like the following is generally safe:",
            fa: "Templateهای Flask به‌صورت پیش‌فرض HTML را escape می‌کنند؛ پس کدی مثل نمونه زیر معمولاً امن است:",
            code: `<ul id="navigation">
  {% for item in navigation %}
    <li><a href="{{ item.href }}">{{ item.caption }}</a></li>
  {% endfor %}
</ul>`,
          },
          {
            en: "However, escaping can be turned off by using the safe keyword:",
            fa: "اما با keyword مربوط به safe می‌توان escaping را غیرفعال کرد:",
            code: `<ul id="navigation">
  {% for item in navigation %}
    <li><a href="{{ item.href }}">{{ item.caption | safe }}</a></li>
  {% endfor %}
</ul>`,
          },
          {
            en: "Or enclosing everything in an autoescape false block:",
            fa: "یا می‌شود همه چیز را داخل یک بلاک autoescape false قرار داد:",
            code: `{% autoescape false %}
  <ul id="navigation">
    {% for item in navigation %}
      <li><a href="{{ item.href }}">{{ item.caption }}</a></li>
    {% endfor %}
  </ul>
{% endautoescape %}`,
          },
          {
            en: "Be sure to conduct code reviews on any templates that use these features!",
            fa: "هر templateای که از این قابلیت‌ها استفاده می‌کند باید حتماً در code review بررسی شود.",
          },
        ],
      },
    ],
  },
  {
    title: "Ruby",
    items: [
      {
        heading: "Rails",
        blocks: [
          {
            en: "Rails templates escape HTML by default, so anything that looks like the following is generally safe:",
            fa: "Templateهای Rails به‌صورت پیش‌فرض HTML را escape می‌کنند؛ بنابراین چیزی مثل نمونه زیر معمولاً امن است:",
            code: "<%= contents %>",
          },
          {
            en: "You can override escape by using the raw function, or using the <%== operator. There are often good reasons to do this, but you will need to conduct code reviews on anything that uses these functions:",
            fa: "با تابع raw یا عملگر <%== می‌توانی escaping را دور بزنی. گاهی دلیل خوبی برای این کار هست، اما هر جا از این قابلیت‌ها استفاده شده باید در code review با دقت بررسی شود:",
            code: `<%= raw contents %>

<%== contents %>`,
          },
        ],
      },
    ],
  },
  {
    title: "C#",
    items: [
      {
        heading: "ASP.NET",
        blocks: [
          {
            en: "Use either of the following functions to safely escape HTML. The <%: form was introduced in ASP.NET 4.0:",
            fa: "برای escape کردن امن HTML می‌توانی از یکی از روش‌های زیر استفاده کنی. فرم <%: از ASP.NET 4.0 معرفی شد:",
            code: `<%= HttpUtility.HtmlEncode(contents) %>

<%: contents %>`,
          },
          {
            en: "The following way of writing to a template does not escape HTML automatically, so you should use it with care:",
            fa: "روش زیر هنگام نوشتن در template، HTML را به‌صورت خودکار escape نمی‌کند؛ پس باید با احتیاط استفاده شود:",
            code: "<%= contents %>",
          },
          {
            en: "Use HttpUtility.HtmlEncode(...) if you need to escape HTML manually.",
            fa: "اگر لازم شد HTML را دستی escape کنی، از HttpUtility.HtmlEncode(...) استفاده کن.",
          },
        ],
      },
    ],
  },
  {
    title: "PHP",
    items: [
      {
        heading: "PHP templates",
        blocks: [
          {
            en: "The echo command does not escape HTML by default, which means that any code like the following, which pulls data directly out of the HTTP request, is vulnerable to XSS attacks:",
            fa: "دستور echo به‌صورت پیش‌فرض HTML را escape نمی‌کند. یعنی کدی مثل نمونه زیر، که داده را مستقیم از درخواست HTTP می‌خواند، در برابر حمله XSS آسیب‌پذیر است:",
            code: `<?php
  echo $_POST["comment"];
?>`,
          },
          {
            en: "Be sure to use the strip_tags function or the htmlspecialchars function to safely escape parameters:",
            fa: "برای امن‌سازی پارامترها حتماً از تابع strip_tags یا htmlspecialchars استفاده کن:",
            code: `<?php
  echo strip_tags($_POST["comment"]);
?>`,
          },
        ],
      },
    ],
  },
  {
    title: "AngularJS",
    items: [
      {
        heading: "Angular templates",
        blocks: [
          {
            en: "In Angular, any dynamic content written out in curly brackets will automatically be escaped, so the following is safe:",
            fa: "در Angular، هر محتوای dynamic که داخل curly brackets نوشته شود به‌صورت خودکار escape می‌شود؛ پس نمونه زیر امن است:",
            code: "<div>{{dynamicContent}}</div>",
          },
          {
            en: "Be wary of any code that binds dynamic content to the innerHTML attribute since that will not be escaped automatically:",
            fa: "مراقب کدهایی باش که محتوای dynamic را به attribute به نام innerHTML bind می‌کنند؛ چون این محتوا به‌صورت خودکار escape نمی‌شود:",
            code: `<div [innerHTML]="dynamicContent"></div>
<div innerHTML="{{dynamicContent}}"></div>`,
          },
        ],
      },
    ],
  },
  {
    title: "React",
    items: [
      {
        heading: "React components",
        blocks: [
          {
            en: "In React, any dynamic content written out in curly brackets will automatically be escaped, so the following is safe:",
            fa: "در React، هر محتوای dynamic که داخل curly brackets نوشته شود به‌صورت خودکار escape می‌شود؛ بنابراین نمونه زیر امن است:",
            code: `render() {
  return <div>{dynamicContent}</div>;
}`,
          },
          {
            en: "React allows you to write out raw HTML by binding content to the dangerouslySetInnerHTML property, which is named to remind you of the security risk. Watch out for any code that looks like the following:",
            fa: "React اجازه می‌دهد با property به نام dangerouslySetInnerHTML، HTML خام را مستقیم خروجی بگیری. اسم این property عمداً هشداردهنده است تا ریسک امنیتی را یادت بیندازد. مراقب کدهایی مثل نمونه زیر باش:",
            code: `render() {
  return <div dangerouslySetInnerHTML={{ __html: dynamicContent }} />;
}`,
          },
        ],
      },
    ],
  },
];

const COPY = {
  en: {
    title: "Code Samples",
    intro:
      "Preventing XSS vulnerabilities requires using the right code libraries, and performing thorough code reviews. Below are some examples of what to look out for when checking your code.",
    quizEyebrow: "Ready to test your understanding?",
    quizLabel: "Quiz:",
    quizTitle: "Cross-Site Scripting",
    quizSummary: "Take a quick quiz to show you were paying attention →",
  },
  fa: {
    title: "نمونه کدها",
    intro:
      "برای جلوگیری از آسیب‌پذیری‌های XSS باید از کتابخانه‌های درست استفاده کنی و code review را جدی بگیری. نمونه‌های زیر نشان می‌دهند هنگام بررسی کد باید حواست به چه چیزهایی باشد.",
    quizEyebrow: "یاد گرفتی؟",
    quizLabel: "آزمون:",
    quizTitle: "Cross-Site Scripting",
    quizSummary: "یک آزمون کوتاه بده تا مطمئن شوی نکته‌ها را خوب گرفته‌ای ←",
  },
};

export default function SectionCodeSamples() {
  const navigate = useNavigate();
  const { language } = useAppLanguage();
  const [open, setOpen] = useState({});
  const isPersian = language === "fa";
  const copy = COPY[isPersian ? "fa" : "en"];

  const toggle = (title) => {
    setOpen((previous) => ({
      ...previous,
      [title]: !previous[title],
    }));
  };

  return (
    <section className="w-full flex flex-col items-center mt-12 sm:mt-16">
      <div className="w-full max-w-4xl px-2 sm:px-0 space-y-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl sm:text-3xl text-text-muted" aria-hidden="true">
            {"</>"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-text">
            {copy.title}
          </h2>
        </div>

        <p className="text-base sm:text-lg text-text-muted leading-relaxed">
          {copy.intro}
        </p>

        <div className="space-y-4">
          {CODE_SAMPLE_GROUPS.map((group) => (
            <CodeSampleAccordion
              key={group.title}
              group={group}
              isOpen={!!open[group.title]}
              isPersian={isPersian}
              onToggle={() => toggle(group.title)}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => navigate("/lessons/cross-site-scripting-quiz")}
          className="mt-10 w-full cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl
          p-6 sm:p-8 active:scale-[0.98] transition shadow-md hover:shadow-xl border-4 border-black text-center"
        >
          <p className="text-sm font-semibold opacity-90 mb-2">
            {copy.quizEyebrow}
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold mb-3 flex items-center justify-center gap-2">
            <span aria-hidden="true">🧠</span>
            <span className="text-indigo-950 dark:text-white">{copy.quizLabel}</span>
            <span className="text-white">{copy.quizTitle}</span>
          </h2>

          <p className="text-md opacity-95">{copy.quizSummary}</p>
        </button>
      </div>
    </section>
  );
}

function CodeSampleAccordion({ group, isOpen, isPersian, onToggle }) {
  return (
    <div className="border border-border rounded-xl overflow-hidden transition-all duration-300 bg-surface">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex justify-between items-center px-5 sm:px-6 py-5 text-left font-semibold
        text-text bg-surface hover:bg-surface-muted active:scale-[0.98] transition"
      >
        <span dir="ltr">{group.title}</span>
        <span
          className={`transform transition-transform duration-300 text-text-muted ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        >
          ▼
        </span>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6 pt-2 text-text-muted space-y-6">
          {group.items.map((item) => (
            <div key={item.heading}>
              <h3 className="font-semibold text-text mt-4 mb-3" dir="ltr">
                {item.heading}
              </h3>

              <div className="space-y-4">
                {item.blocks.map((block, index) => (
                  <div key={`${item.heading}-${index}`}>
                    <p className="leading-relaxed">
                      {isPersian ? block.fa : block.en}
                    </p>
                    {block.code && <TerminalBox>{block.code}</TerminalBox>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
