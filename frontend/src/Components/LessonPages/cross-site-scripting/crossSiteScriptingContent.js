export const XSS_LESSON_STEPS = {
  en: [
    [
      { type: "text", text: "Imagine you are the owner of " },
      { type: "strong", text: "breddit.com" },
      {
        type: "text",
        text: ", the number one social media site for the baking industry. You have an avid community of commenters who love sharing their bread knowledge.",
      },
    ],
    [
      {
        type: "text",
        text: "Because the main use of your website is to facilitate discussion, users can add comments, which are saved to the database and displayed to other users.",
      },
    ],
    [
      {
        type: "text",
        text: "Unfortunately the popularity of your site has also attracted the attention of hackers, who want to access your site for nefarious purposes.",
      },
    ],
    [
      {
        type: "text",
        text: "Unless you are careful when constructing the HTML, hackers can abuse the comment function by injecting JavaScript.",
      },
    ],
    [
      { type: "text", text: "Watch how " },
      { type: "strong", text: "Mal" },
      {
        type: "text",
        text: " injects malicious JavaScript to attack another user.",
      },
    ],
    [
      {
        type: "text",
        text: "A real attack might use injected JavaScript to redirect Vic to a malicious website under Mal's control, allowing Mal to steal his cookies.",
      },
    ],
    [
      {
        type: "text",
        text: "Let's learn how to protect against cross-site scripting!",
      },
    ],
  ],
  fa: [
    [
      { type: "text", text: "تصور کن مالک " },
      { type: "strong", text: "breddit.com", dir: "ltr" },
      {
        type: "text",
        text: " هستی؛ محبوب‌ترین شبکه اجتماعی برای جامعه نان‌پزی. کاربرهای زیادی داری که عاشق حرف زدن درباره نان، دستور پخت و تجربه‌هایشان هستند.",
      },
    ],
    [
      {
        type: "text",
        text: "چون هدف اصلی سایت تو گفت‌وگو است، کاربرها می‌توانند نظر بنویسند. این نظرها در دیتابیس ذخیره می‌شوند و بعد برای بقیه کاربران نمایش داده می‌شوند.",
      },
    ],
    [
      {
        type: "text",
        text: "اما همین محبوبیت باعث شده هکرها هم به سایتت توجه کنند؛ کسانی که می‌خواهند از سایت برای هدف‌های مخرب استفاده کنند.",
      },
    ],
    [
      {
        type: "text",
        text: "اگر موقع ساختن HTML دقت نکنی، مهاجم می‌تواند از بخش نظرات سوءاستفاده کند و JavaScript مخرب داخل صفحه تزریق کند.",
      },
    ],
    [
      { type: "text", text: "ببین " },
      { type: "strong", text: "Mal", dir: "ltr" },
      {
        type: "text",
        text: " چطور با تزریق JavaScript مخرب، کاربر دیگری را هدف قرار می‌دهد.",
      },
    ],
    [
      {
        type: "text",
        text: "در یک حمله واقعی، JavaScript تزریق‌شده می‌تواند Vic را به یک سایت مخرب که تحت کنترل Mal است منتقل کند؛ جایی که Mal می‌تواند کوکی‌های او را بدزدد.",
      },
    ],
    [
      {
        type: "text",
        text: "حالا یاد بگیریم چطور از سایت در برابر Cross-Site Scripting محافظت کنیم.",
      },
    ],
  ],
};

export const BREDDIT_DEMO_COPY = {
  en: {
    threadTitle: "How much do you folks like bread?",
    comments: [
      {
        author: "roll_with_it",
        text: "i dream of baking tins.",
      },
      {
        author: "k_knead_you_right_now",
        text: "i love it so much, i think i might be part duck",
      },
    ],
    placeholder: "Type a comment...",
  },
  fa: {
    threadTitle: "شما چقدر نان دوست دارید؟",
    comments: [
      {
        author: "roll_with_it",
        text: "من حتی خواب قالب‌های نان‌پزی را می‌بینم.",
      },
      {
        author: "k_knead_you_right_now",
        text: "آن‌قدر نان دوست دارم که فکر کنم یک کم اردک شده‌ام.",
      },
    ],
    placeholder: "نظر خود را بنویس...",
  },
};

export function getCrossSiteScriptingLesson(language) {
  const isPersian = language === "fa";

  return {
    slug: "cross-site-scripting",
    title: "Cross-Site Scripting (XSS)",
    guidePath: "/lessons/cross-site-scripting-guide",
    quizPath: "/lessons/cross-site-scripting-quiz",
    quizStartPath: "/lessons/cross-site-scripting-quiz-start",
    lessonsPath: "/lessons",
    quizIntro: isPersian
      ? {
          eyebrow: "یاد گرفتی؟",
          icon: "🧠",
          title: "آزمون: Cross-Site Scripting",
          summary:
            "دو پرسش کوتاه درباره اثر XSS و روش‌های جلوگیری از آن. اگر لازم داشتی، قبل از شروع یک بار راهنما را مرور کن.",
          startButton: "شروع آزمون",
          reviewButton: "مرور دوباره راهنما",
        }
      : {
          eyebrow: "Ready to test your understanding?",
          icon: "🧠",
          title: "Quiz: Cross-Site Scripting",
          summary:
            "Two quick questions about what XSS can do and how to prevent it. Review the guide first if you need a refresher.",
          startButton: "Start the quiz",
          reviewButton: "Review the guide",
        },
    quiz: {
      passScore: 2,
      questions: isPersian ? FA_QUIZ_QUESTIONS : EN_QUIZ_QUESTIONS,
    },
  };
}

const EN_QUIZ_QUESTIONS = [
  {
    key: "stored-xss-impact",
    text: "If an attacker manages to store malicious JavaScript in your database, what could they do when another user views that content?",
    answer: 0,
    options: [
      "Hijack the user's session by running code in their browser",
      "Drop database tables directly from the browser without a server request",
      "Disable HTTPS for every visitor at the network level",
      "Read private server environment variables directly from JavaScript",
    ],
  },
  {
    key: "xss-prevention",
    text: "What is the best default defense when rendering user-controlled text into HTML?",
    answer: 0,
    options: [
      "Escape dynamic content before writing it into the page",
      "Obfuscate your JavaScript bundle before deployment",
      "Ask users to disable JavaScript in their browser",
      "Hide the comment form with CSS after submission",
    ],
  },
];

const FA_QUIZ_QUESTIONS = [
  {
    key: "stored-xss-impact",
    text: "اگر مهاجم بتواند JavaScript مخرب را داخل دیتابیس ذخیره کند، وقتی کاربر دیگری آن محتوا را می‌بیند چه کاری ممکن است انجام دهد؟",
    answer: 0,
    options: [
      "نشست کاربر را با اجرای کد در مرورگر او بدزدد",
      "بدون هیچ درخواست سمت سرور، جدول‌های دیتابیس را مستقیم از مرورگر حذف کند",
      "HTTPS را برای همه بازدیدکننده‌ها در سطح شبکه غیرفعال کند",
      "متغیرهای خصوصی محیط سرور را مستقیم از JavaScript بخواند",
    ],
  },
  {
    key: "xss-prevention",
    text: "بهترین دفاع پیش‌فرض هنگام نمایش متن کنترل‌شده توسط کاربر داخل HTML چیست؟",
    answer: 0,
    options: [
      "محتوای dynamic را قبل از نوشتن داخل صفحه escape کنیم",
      "فایل JavaScript را قبل از انتشار obfuscate کنیم",
      "از کاربر بخواهیم JavaScript مرورگرش را غیرفعال کند",
      "بعد از ارسال نظر، فرم کامنت را با CSS پنهان کنیم",
    ],
  },
];
