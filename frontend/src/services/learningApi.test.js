import {
  fetchLearningAchievements,
  fetchLearningPaths,
  fetchLessonCatalogProgress,
  fetchRecommendedNextLesson,
  fetchLessonBookmarks,
  fetchLessonProgress,
  fetchLearningXpProfile,
  removeLessonBookmark,
  saveLessonFeedback,
  saveLessonBookmark,
  saveLessonProgress,
  saveQuizAttempt,
} from "./learningApi";
import { clearAuthTokens, setAuthTokens } from "./authTokens";

describe("learningApi", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    clearAuthTokens();
    setAuthTokens({ access: "access-token", refresh: "refresh-token" });
  });

  afterEach(() => {
    clearAuthTokens();
    global.fetch = originalFetch;
  });

  it("saves lesson progress, bookmarks, and quiz attempts", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ currentStep: 11 }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ totalXp: 12, level: 1 }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ unlockedCount: 1, results: [] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ results: [{ slug: "web-security-basics" }] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ recommendation: { lesson: { slug: "xssi" } } }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ results: [{ lessonSlug: "sql-injection" }] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ results: [{ lessonSlug: "sql-injection" }] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ lessonSlug: "sql-injection" }), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        })
      )
      .mockResolvedValueOnce(
        new Response(null, {
          status: 204,
          headers: { "Content-Type": "application/json" },
        })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ lessonSlug: "sql-injection" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ attempt: { passed: true } }), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ rating: 5, lessonSlug: "sql-injection" }), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        })
      );

    await expect(fetchLessonProgress("sql-injection")).resolves.toEqual({
      currentStep: 11,
    });
    await expect(fetchLearningXpProfile()).resolves.toEqual({
      totalXp: 12,
      level: 1,
    });
    await expect(fetchLearningAchievements()).resolves.toEqual({
      unlockedCount: 1,
      results: [],
    });
    await expect(fetchLearningPaths("fa")).resolves.toEqual({
      results: [{ slug: "web-security-basics" }],
    });
    await expect(fetchRecommendedNextLesson("fa")).resolves.toEqual({
      recommendation: { lesson: { slug: "xssi" } },
    });
    await expect(fetchLessonCatalogProgress()).resolves.toEqual({
      results: [{ lessonSlug: "sql-injection" }],
    });
    await expect(fetchLessonBookmarks()).resolves.toEqual({
      results: [{ lessonSlug: "sql-injection" }],
    });
    await expect(saveLessonBookmark("sql-injection")).resolves.toEqual({
      lessonSlug: "sql-injection",
    });
    await expect(removeLessonBookmark("sql-injection")).resolves.toBeNull();
    await expect(
      saveLessonProgress("sql-injection", {
        currentStep: 11,
        totalSteps: 14,
      })
    ).resolves.toEqual({ lessonSlug: "sql-injection" });
    await expect(
      saveQuizAttempt("sql-injection", {
        score: 3,
        totalQuestions: 3,
      })
    ).resolves.toEqual({ attempt: { passed: true } });
    await expect(
      saveLessonFeedback(
        "sql-injection",
        {
          rating: 5,
          difficulty: "just_right",
          source: "quiz",
        },
        { locale: "fa" }
      )
    ).resolves.toEqual({ rating: 5, lessonSlug: "sql-injection" });

    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      "/api/v1/learning/xp/",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer access-token",
        }),
      })
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      3,
      "/api/v1/learning/achievements/",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer access-token",
        }),
      })
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      4,
      "/api/v1/learning/paths/?locale=fa",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer access-token",
        }),
      })
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      5,
      "/api/v1/learning/recommendation/?locale=fa",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer access-token",
        }),
      })
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      6,
      "/api/v1/learning/catalog-progress/",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer access-token",
        }),
      })
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      7,
      "/api/v1/learning/bookmarks/",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer access-token",
        }),
      })
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      8,
      "/api/v1/learning/bookmarks/sql-injection/",
      expect.objectContaining({
        method: "POST",
      })
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      9,
      "/api/v1/learning/bookmarks/sql-injection/",
      expect.objectContaining({
        method: "DELETE",
      })
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      10,
      "/api/v1/learning/progress/sql-injection/",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({ currentStep: 11, totalSteps: 14 }),
      })
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      11,
      "/api/v1/learning/quiz-attempts/sql-injection/",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ score: 3, totalQuestions: 3 }),
      })
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      12,
      "/api/v1/learning/feedback/sql-injection/?locale=fa",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          rating: 5,
          difficulty: "just_right",
          source: "quiz",
        }),
      })
    );
  });
});
