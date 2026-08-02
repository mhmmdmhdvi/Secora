const READY_LESSONS = new Set([
  "sql-injection",
  "cross-site-script-inclusion",
  "cross-site-scripting",
  "reflected-xss",
  "dom-based-xss",
  "xml-external-entities",
]);

const PREVIEW_LESSONS = new Set([]);

const DIFFICULTY_BY_LESSON = {
  "sql-injection": "beginner",
  "cross-site-script-inclusion": "beginner",
  "cross-site-scripting": "beginner",
  "reflected-xss": "beginner",
  "dom-based-xss": "intermediate",
  "xml-external-entities": "intermediate",
  "xml-bombs": "intermediate",
  "weak-session-ids": "beginner",
  "user-enumeration": "beginner",
  "unencrypted-communication": "beginner",
  "toxic-dependencies": "intermediate",
  "Server-Side-Request-Forgery": "intermediate",
  "Remote-Code-Execution": "advanced",
  "Command-Execution": "intermediate",
  "File-Upload-Vul": "intermediate",
  "Directory-Traversal": "beginner",
  "Prototype-Pollution": "advanced",
  "Ai-Prompt-Injection": "intermediate",
  "Ai-Data-Extraction-Attacks": "advanced",
  "Ai-Bias-and-Unreliability": "beginner",
};

const TOPIC_BY_LESSON = {
  "sql-injection": "injection",
  "Regex-Injection": "injection",
  "Command-Execution": "injection",
  "cross-site-script-inclusion": "clientSide",
  "cross-site-scripting": "clientSide",
  "reflected-xss": "clientSide",
  "dom-based-xss": "clientSide",
  "Clickjacking": "clientSide",
  "Cross-Site-Request-Forgery": "clientSide",
  "weak-session-ids": "auth",
  "user-enumeration": "auth",
  "Session-Fixation": "auth",
  "Privilege-Escalation": "auth",
  "Password-Mismanagement": "auth",
  "xml-external-entities": "data",
  "xml-bombs": "data",
  "Information-Leakage": "data",
  "Mass-Assigment": "data",
  "unencrypted-communication": "transport",
  "SSL-Stripping": "transport",
  "Downgrade-Attacks": "transport",
  "Server-Side-Request-Forgery": "serverSide",
  "Remote-Code-Execution": "serverSide",
  "File-Upload-Vul": "serverSide",
  "Directory-Traversal": "serverSide",
  "Host-Header-Poisoning": "serverSide",
  "Denial-of-Service-Attacks": "serverSide",
  "Subdomain-Squatting": "supplyChain",
  "toxic-dependencies": "supplyChain",
  "Malvertising": "supplyChain",
  "Email-Spoofing": "supplyChain",
  "Dns-Poisoning": "supplyChain",
  "Logging-And-Monitoring": "defense",
  "Lax-Security-Settings": "defense",
  "Insecure-Design": "defense",
  "Broken-Access-Control": "defense",
  "Prototype-Pollution": "clientSide",
  "Ai-Prompt-Injection": "ai",
  "Ai-Data-Extraction-Attacks": "ai",
  "Ai-Bias-and-Unreliability": "ai",
};

const MINUTES_BY_DIFFICULTY = {
  beginner: 15,
  intermediate: 20,
  advanced: 30,
};

export const TOPIC_OPTIONS = [
  "all",
  "injection",
  "clientSide",
  "auth",
  "data",
  "transport",
  "serverSide",
  "supplyChain",
  "defense",
  "ai",
];

export const DIFFICULTY_OPTIONS = ["all", "beginner", "intermediate", "advanced"];

export function getLessonCatalogMeta(lesson) {
  const difficulty = DIFFICULTY_BY_LESSON[lesson.id] || "beginner";
  const topic = TOPIC_BY_LESSON[lesson.id] || "defense";
  const availability = availabilityForLesson(lesson.id);

  return {
    availability,
    difficulty,
    estimatedMinutes: MINUTES_BY_DIFFICULTY[difficulty],
    isClickable: availability !== "comingSoon",
    topic,
  };
}

function availabilityForLesson(slug) {
  if (READY_LESSONS.has(slug)) return "ready";
  if (PREVIEW_LESSONS.has(slug)) return "preview";
  return "comingSoon";
}
