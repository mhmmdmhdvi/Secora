import {
  PhoneIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

import { useAppLanguage } from "../../hooks/useAppLanguage";

const contacts = [
  {
    label: "Instagram",
    value: "@mhmmd_mhdvii",
    href: "https://instagram.com/mhmmd_mhdvii",
  },
  {
    label: "LinkedIn",
    value: "mohammad-mahdavi-devops",
    href: "https://www.linkedin.com/in/mohammad-mahdavi-devops",
  },
  {
    label: "Telephone",
    value: "09392360398",
    href: "tel:09392360398",
  },
];

const copy = {
  en: {
    eyebrow: "About Secora",
    title: "Built from curiosity, shaped for learners.",
    intro:
      "Secora started as a passion project: a place where people can see how real hacking techniques work without the fear, noise, or confusion that usually surrounds cybersecurity.",
    paragraphs: [
      "I created this project because I believe security becomes much easier to understand when you can watch an attack unfold step by step. Reading about SQL Injection, XSS, or XML External Entities is useful, but seeing the mistake, the payload, the browser, and the result makes the lesson stay in your mind.",
      "The goal of Secora is to make those ideas approachable. It is not built to scare people away from coding. It is built to help developers, students, and curious learners understand the attacker mindset, then turn that understanding into better defensive habits.",
      "Every lesson is designed to feel practical and focused: first you explore the attack, then you read the guide, and finally you test yourself with a short quiz. The project will keep growing with more lessons, better visuals, Persian and English content, and a learning path that helps users move forward without feeling lost.",
      "If you have feedback, ideas, corrections, or just want to talk about the project, I would be happy to hear from you.",
    ],
    contactTitle: "Contact",
    contactSubtitle: "Reach out anytime.",
    projectNoteTitle: "Project note",
    projectNote:
      "Secora is still growing. Your feedback can directly shape the lessons, UI, and learning paths.",
    contactLabels: {
      Instagram: "Instagram",
      LinkedIn: "LinkedIn",
      Telephone: "Telephone",
    },
  },
  fa: {
    eyebrow: "درباره Secora",
    title: "از یک علاقه شخصی شروع شد، برای یادگیری واقعی ساخته شد.",
    intro:
      "Secora برای من فقط یک پروژه معمولی نبود؛ از علاقه‌ام به امنیت و آموزش شروع شد. می‌خواستم جایی بسازم که آدم‌ها بتوانند ببینند حمله‌های واقعی چطور کار می‌کنند، بدون اینکه امنیت سایبری برایشان ترسناک، شلوغ یا گیج‌کننده شود.",
    paragraphs: [
      "من این پروژه را ساختم چون باور دارم امنیت وقتی قابل فهم‌تر می‌شود که روند یک حمله را قدم‌به‌قدم ببینی. خواندن درباره SQL Injection، XSS یا XML External Entities مفید است، اما وقتی اشتباه، payload، مرورگر و نتیجه را کنار هم می‌بینی، مفهوم خیلی بهتر در ذهن می‌ماند.",
      "هدف Secora این است که این مفاهیم را ساده‌تر و نزدیک‌تر کند. قرار نیست کسی را از برنامه‌نویسی بترساند؛ قرار است به توسعه‌دهنده‌ها، دانشجوها و آدم‌های کنجکاو کمک کند ذهنیت مهاجم را بهتر بفهمند و بعد از همان فهم برای نوشتن کد امن‌تر استفاده کنند.",
      "هر درس طوری طراحی شده که کاربردی و متمرکز باشد: اول حمله را تجربه می‌کنی، بعد راهنمای دفاع را می‌خوانی و در پایان با یک آزمون کوتاه خودت را محک می‌زنی. Secora به‌مرور با درس‌های بیشتر، تصویرسازی بهتر، محتوای فارسی و انگلیسی و مسیرهای یادگیری کامل‌تر رشد می‌کند.",
      "اگر بازخورد، ایده، اصلاحیه یا حتی فقط حرفی درباره پروژه داری، خوشحال می‌شوم ازت بشنوم.",
    ],
    contactTitle: "ارتباط",
    contactSubtitle: "هر وقت خواستی پیام بده.",
    projectNoteTitle: "یادداشت پروژه",
    projectNote:
      "Secora هنوز در حال رشد است. بازخورد تو می‌تواند مستقیماً روی درس‌ها، رابط کاربری و مسیرهای یادگیری اثر بگذارد.",
    contactLabels: {
      Instagram: "اینستاگرام",
      LinkedIn: "لینکدین",
      Telephone: "شماره تماس",
    },
  },
};

function AboutPage() {
  const { language } = useAppLanguage();
  const isPersian = language === "fa";
  const text = isPersian ? copy.fa : copy.en;

  return (
    <section
      dir={isPersian ? "rtl" : "ltr"}
      className="mx-auto max-w-5xl py-10 sm:py-14 lg:py-20"
    >
      <div className="rounded-[2rem] border border-border bg-surface p-6 shadow-soft sm:p-8 lg:p-10">
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.28em] text-primary">
            {text.eyebrow}
          </p>
          <h1 className="text-4xl font-black tracking-tight text-text sm:text-5xl">
            {text.title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-text-muted">
            {text.intro}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <article className="space-y-6 text-base leading-8 text-text-muted sm:text-lg">
            {text.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>

          <aside className="rounded-[1.5rem] border border-border bg-app p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <SparklesIcon className="h-6 w-6" />
              </span>
              <div>
                <h2 className="text-xl font-black text-text">
                  {text.contactTitle}
                </h2>
                <p className="text-sm text-text-muted">
                  {text.contactSubtitle}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {contacts.map((contact) => (
                <a
                  key={contact.label}
                  href={contact.href}
                  target={
                    contact.href.startsWith("http") ? "_blank" : undefined
                  }
                  rel={
                    contact.href.startsWith("http")
                      ? "noreferrer"
                      : undefined
                  }
                  className="block rounded-2xl border border-border bg-surface p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft"
                >
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-text-muted">
                    {text.contactLabels[contact.label]}
                  </span>
                  <span className="mt-1 block break-words text-base font-bold text-text">
                    {contact.value}
                  </span>
                </a>
              ))}
            </div>

            <div className="mt-5 rounded-2xl bg-primary/10 p-4 text-sm leading-6 text-text-muted">
              <div className="mb-2 flex items-center gap-2 font-bold text-text">
                <PhoneIcon className="h-5 w-5 text-primary" />
                {text.projectNoteTitle}
              </div>
              {text.projectNote}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default AboutPage;
