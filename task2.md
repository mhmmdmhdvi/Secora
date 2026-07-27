# SecureLearn Engagement Roadmap

This file orders the engagement ideas from easiest/highest-value to hardest/later.

The goal is not to trick users into staying. The goal is to make learning security feel rewarding, clear, and satisfying.

## Main Product Idea

Each lesson should feel like a small security mission:

```text
Try it -> break it -> understand it -> fix it -> prove it
```

For SQL Injection:

1. The user tries a normal login.
2. The login fails.
3. The user adds a quote and sees the SQL error.
4. The user uses the injection payload.
5. The attack succeeds.
6. The guide explains why it worked.
7. The user fixes the vulnerable code.
8. The quiz checks if they understood it.

## Build Order Summary

1. Real progress tracking
2. Resume lessons
3. Profile stats
4. Recommended next lesson
5. Better lesson catalog
6. Bookmarks
7. XP and levels
8. Achievements
9. Learning paths
10. Progress map
11. Mistake-based review
12. Review schedule
13. Daily 5-minute challenges
14. Safe practice lab
15. Lesson quality feedback
16. Content freshness

## Phase 1: Give The Website Memory

These are the most important first features. They make SecureLearn remember the user.

### Idea 1: Real Progress Tracking

Difficulty: Medium

Store user progress in the backend database.

Track:

- lesson started
- current lesson step
- guide completed
- quiz started
- quiz completed
- quiz score
- best quiz score
- lesson completed
- last activity date

Why this matters:

Users should not lose their place when they refresh the page or use another device.

Example UI:

```text
Continue SQL Injection
Step 11 of 14
Last opened today
```

Backend idea:

Create a new Django app called `learning`.

Possible models:

- `LessonProgress`
- `QuizAttempt`

### Idea 3: Resume Lessons

Status: Implemented

Difficulty: Easy after progress tracking exists

When a user leaves a lesson, save the current step.

When they come back, show:

```text
Resume from step 11
Start from beginning
```

Why this matters:

Security lessons can take time. Resume support makes the site feel polished.

Implemented as:

- lesson step progress saved in backend
- landing page Continue Learning panel
- recommended next lesson fallback
- current path and saved lesson shortcuts

### Idea 22: Profile Stats

Difficulty: Easy/Medium after progress tracking exists

Improve the profile page with learning stats.

Show:

- completed lessons
- current level later
- XP later
- streak later
- quiz accuracy
- bookmarked lessons later
- recent activity
- selected language
- selected theme

Why this matters:

The profile should feel like the user's learning record, not only account settings.

## Phase 2: Give Users A Clear Next Step

These features prevent the user from finishing a lesson and reaching a dead end.

### Idea 9: Recommended Next Lesson

Status: Implemented

Difficulty: Easy

After completing a lesson, show one clear next step.

Example:

```text
You completed SQL Injection.

Recommended next:
Cross-Site Script Inclusion
```

Why this matters:

Users should always know what to study next.

Simple version:

Use lesson `sort_order` to recommend the next published lesson.

Better version later:

Use learning paths and user weaknesses.

### Idea 13: Better Lesson Catalog

Status: Implemented

Difficulty: Medium

Improve the lessons page so it feels useful, not just like a grid.

Add:

- progress status
- difficulty filter
- topic filter
- estimated time
- completed / in progress / not started
- recommended lessons
- coming soon state

Example card:

```text
SQL Injection
Beginner - 15 min
Completed
Quiz score: 100%
```

Why this matters:

The catalog should help users choose what to learn next.

### Idea 14: Bookmarks (done)

Status: Implemented

Difficulty: Easy/Medium

Let users bookmark lessons they want to study later.

Example:

```text
Bookmarked
Cross-Site Scripting
Command Injection
```

Why this matters:

Users often browse first and study later.

Backend idea:

Add a simple `Bookmark` model:

```text
user + lesson_slug + optional lesson + created_at
```

## Phase 3: Add Light Gamification

These should be clean and small. No annoying popups.

### Idea 4: XP and Levels (done)

Status: Implemented

Difficulty: Medium

Give XP for real learning actions.

Example XP rules:

- Start a lesson: `+2 XP`
- Finish interactive lesson: `+10 XP`
- Read guide: `+5 XP`
- Pass quiz: `+10 XP`
- Pass quiz first try: `+5 bonus XP`
- Complete full lesson package: `+20 XP`

Possible level names:

- Beginner Analyst
- Web Security Apprentice
- Injection Hunter
- Client-Side Defender
- Secure Code Specialist

Why this matters:

XP gives users a small feeling of progress.

Important rule:

Use small clean feedback, not huge popups.

### Idea 12: Achievements (done)

Status: Implemented

Difficulty: Medium

Add achievements for real milestones.

Possible achievements:

- First Exploit
- First Lesson Completed
- SQL Injection Completed
- First Perfect Quiz
- Fixed Your First Vulnerability
- 3-Day Streak
- Web Basics Path Complete
- Injection Path Complete

Why this matters:

Achievements give users a memory of what they accomplished.

Important rule:

Achievements should be tied to real learning. Do not add random badges just for clicking pages.

## Phase 4: Organize The Learning Journey

These are useful after there are several complete lessons.

### Idea 8: Learning Paths

Status: Implemented

Difficulty: Medium

Group lessons into paths.

Possible paths:

- Web Security Basics
- OWASP Top 10
- Injection Attacks
- Client-Side Attacks
- Authentication Attacks
- API Security
- AI Security

Example:

```text
Injection Attacks
1. SQL Injection
2. Command Injection
3. LDAP Injection
4. Regex Injection
```

Why this matters:

A big catalog can feel overwhelming. Paths tell the user what to study next.

Simple version:

Create paths manually in the admin.

### Idea 23: Progress Map

Status: Implemented

Difficulty: Medium after learning paths exist

Add a visual map of the user's learning path.

Example:

```text
Web Security Basics

[SQL Injection] -> [XSSI] -> [XSS] -> [CSRF]
```

Why this matters:

A map makes progress feel concrete and shows how topics connect.

Important rule:

Do this after learning paths exist. The map should be UI over real path data.

## Phase 5: Make Review Smarter

These features help users remember, not only finish.

### Idea 10: Mistake-Based Review

Difficulty: Medium/Hard

When a user answers a quiz wrong, save the topic they missed.

Later, show review cards.

Example:

```text
Review: ORMs and SQL Injection

Question:
Does using an ORM make SQL Injection impossible?
```

Why this matters:

The user studies what they actually got wrong.

Needed first:

- quiz attempt tracking
- question topics or misconception tags

### Idea 20: Review Schedule

Difficulty: Medium

After a user completes a lesson, remind them to review later.

Example:

```text
Review SQL Injection tomorrow
Review again in 7 days
Review again in 30 days
```

Why this matters:

People forget. Spaced review helps users keep the knowledge.

Simple version:

Show review reminders inside dashboard/profile only.

Harder version later:

Email reminders or browser notifications.

## Phase 6: Add Short Return Loops

These are good later, when the lesson system is stable.

### Idea 11: Daily 5-Minute Challenges

Difficulty: Hard

Add short daily exercises that do not require a full lesson.

Examples:

- identify the vulnerable line
- choose the right payload
- choose the secure code
- answer one review question
- match attack name to behavior

Example:

```text
Daily Challenge

Which line is vulnerable to SQL Injection?
```

Why this matters:

Users may not always have time for a full lesson.

Why this is later:

Daily challenges are basically a new content type with their own UI, scoring, history, and scheduling.

## Phase 8: Content Quality And Trust

These are useful before a larger public launch.

### Idea 24: Lesson Quality Feedback

Status: Implemented

Difficulty: Easy/Medium

Let users report lesson issues.

Options:

- unclear explanation
- translation problem
- code sample issue
- outdated security advice
- UI bug

Why this matters:

Security content must stay accurate. Users can help find problems.

Implemented as:

- authenticated lesson feedback saved in PostgreSQL
- one editable feedback record per user per lesson
- rating, difficulty, optional comment, source, and locale
- Django admin review table
- feedback card on quiz result screens

### Idea 25: Content Freshness

Difficulty: Easy

Show when a lesson was last reviewed.

Example:

```text
Last reviewed: July 2026
```

Why this matters:

Security advice changes. Users should know the content is maintained.

## Things To Avoid

Do not add:

- annoying popups
- fake urgency
- dark patterns
- too many badges
- random rewards for meaningless clicks
- auto-playing sounds
- forced daily pressure
- visual clutter

SecureLearn should feel focused, smart, and rewarding.

## Best First Implementation Slice

Start here:

1. Create the `learning` Django app.
2. Add `LessonProgress` and `QuizAttempt` models.
3. Add API endpoints for reading and saving progress.
4. Save SQL Injection current step.
5. Mark SQL Injection complete after quiz pass.
6. Show completed lessons and quiz stats in Profile.

This gives the website a real memory.

After that:

1. Add recommended next lesson.
2. Add bookmarks.
3. Add XP.
4. Add achievements.
5. Add learning paths.
