import { lessons } from "./lessons";
import { getLessonCatalogMeta } from "./lessonCatalogMeta";

const ROADMAP_DEFINITIONS = [
  {
    slug: "starter-web-attacks",
    lessonSlugs: [
      "sql-injection",
      "cross-site-script-inclusion",
      "cross-site-scripting",
      "reflected-xss",
      "dom-based-xss",
    ],
  },
  {
    slug: "client-side-browser-attacks",
    lessonSlugs: [
      "cross-site-script-inclusion",
      "cross-site-scripting",
      "reflected-xss",
      "dom-based-xss",
      "Cross-Site-Request-Forgery",
      "Clickjacking",
      "Prototype-Pollution",
    ],
  },
  {
    slug: "injection-and-code-execution",
    lessonSlugs: [
      "sql-injection",
      "Regex-Injection",
      "Command-Execution",
      "Remote-Code-Execution",
      "File-Upload-Vul",
      "Directory-Traversal",
      "Server-Side-Request-Forgery",
    ],
  },
  {
    slug: "auth-session-access-control",
    lessonSlugs: [
      "weak-session-ids",
      "user-enumeration",
      "Session-Fixation",
      "Password-Mismanagement",
      "Privilege-Escalation",
      "Broken-Access-Control",
    ],
  },
  {
    slug: "data-xml-and-disclosure",
    lessonSlugs: [
      "xml-external-entities",
      "xml-bombs",
      "Mass-Assigment",
      "Information-Leakage",
    ],
  },
  {
    slug: "transport-routing-and-trust",
    lessonSlugs: [
      "unencrypted-communication",
      "SSL-Stripping",
      "Downgrade-Attacks",
      "Dns-Poisoning",
      "Host-Header-Poisoning",
      "Open-Redirects",
    ],
  },
  {
    slug: "defense-operations-and-resilience",
    lessonSlugs: [
      "Insecure-Design",
      "Lax-Security-Settings",
      "Logging-And-Monitoring",
      "Denial-of-Service-Attacks",
      "Buffer-Overflows",
    ],
  },
  {
    slug: "supply-chain-and-abuse",
    lessonSlugs: [
      "toxic-dependencies",
      "Subdomain-Squatting",
      "Malvertising",
      "Email-Spoofing",
    ],
  },
  {
    slug: "ai-security",
    lessonSlugs: [
      "Ai-Bias-and-Unreliability",
      "Ai-Prompt-Injection",
      "Ai-Data-Extraction-Attacks",
    ],
  },
];

export function buildLearningRoadmaps({ progressBySlug = {}, t }) {
  const lessonsBySlug = new Map(lessons.map((lesson) => [lesson.id, lesson]));
  const roadmaps = ROADMAP_DEFINITIONS.map((definition) =>
    buildRoadmap({
      definition,
      lessonsBySlug,
      progressBySlug,
      t,
    })
  );
  const recommendedSlug =
    roadmaps.find((roadmap) => roadmap.nextLesson)?.slug ||
    roadmaps.find((roadmap) => roadmap.status !== "completed")?.slug ||
    roadmaps[0]?.slug ||
    "";

  return roadmaps.map((roadmap) => ({
    ...roadmap,
    isRecommended: roadmap.slug === recommendedSlug,
  }));
}

function buildRoadmap({ definition, lessonsBySlug, progressBySlug, t }) {
  const roadmapLessons = definition.lessonSlugs
    .map((slug) => lessonsBySlug.get(slug))
    .filter(Boolean);
  const completedLessons = roadmapLessons.filter(
    (lesson) => progressBySlug[lesson.id]?.status === "completed"
  ).length;
  const nextReadyLesson = roadmapLessons.find((lesson) => {
    const meta = getLessonCatalogMeta(lesson);
    const progress = progressBySlug[lesson.id];
    return meta.availability !== "comingSoon" && progress?.status !== "completed";
  });
  const hasComingSoon = roadmapLessons.some(
    (lesson) => getLessonCatalogMeta(lesson).availability === "comingSoon"
  );
  const startedLessons = roadmapLessons.filter((lesson) => progressBySlug[lesson.id]).length;
  let pathStatus = "notStarted";
  if (roadmapLessons.length > 0 && completedLessons === roadmapLessons.length) {
    pathStatus = "completed";
  } else if (completedLessons > 0 || startedLessons > 0) {
    pathStatus = "inProgress";
  }

  return {
    slug: definition.slug,
    title: t(`paths.roadmaps.${definition.slug}.title`),
    summary: t(`paths.roadmaps.${definition.slug}.summary`),
    status: pathStatus,
    isRecommended: false,
    estimatedMinutes: roadmapLessons.reduce(
      (total, lesson) => total + getLessonCatalogMeta(lesson).estimatedMinutes,
      0
    ),
    completedLessons,
    hasComingSoon,
    remainingLessons: Math.max(roadmapLessons.length - completedLessons, 0),
    startedLessons,
    totalLessons: roadmapLessons.length,
    progressPercent:
      roadmapLessons.length === 0
        ? 0
        : Math.round((completedLessons / roadmapLessons.length) * 100),
    nextLessonSlug: nextReadyLesson?.id || "",
    nextLesson: nextReadyLesson
      ? serializeRoadmapLesson({
          lesson: nextReadyLesson,
          status: "current",
          progress: progressBySlug[nextReadyLesson.id],
          t,
        })
      : null,
    lessons: roadmapLessons.map((lesson) =>
      serializeRoadmapLesson({
        lesson,
        progress: progressBySlug[lesson.id],
        status: statusForRoadmapLesson({
          lesson,
          nextReadyLessonSlug: nextReadyLesson?.id,
          progress: progressBySlug[lesson.id],
        }),
        t,
      })
    ),
  };
}

function serializeRoadmapLesson({ lesson, progress, status, t }) {
  return {
    slug: lesson.id,
    title: lesson.title,
    summary: t(`lessonDescriptions.${lesson.id}`, {
      defaultValue: lesson.description,
    }),
    status,
    isCompleted: progress?.status === "completed",
    isCurrent: status === "current",
    progress: progress || null,
  };
}

function statusForRoadmapLesson({ lesson, nextReadyLessonSlug, progress }) {
  const meta = getLessonCatalogMeta(lesson);

  if (meta.availability === "comingSoon") {
    return "comingSoon";
  }

  if (progress?.status === "completed") {
    return "completed";
  }

  if (lesson.id === nextReadyLessonSlug) {
    return "current";
  }

  return "available";
}
