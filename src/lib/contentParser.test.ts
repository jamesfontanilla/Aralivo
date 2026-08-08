import { describe, expect, it } from "vitest";
import {
  getAssessmentPolicy,
  parseLessonMarkdown,
  parseQuestionBankJson,
  stripAnswerKey,
} from "./contentParser";

function validLessonMarkdown() {
  const lines = [
    "---",
    "schema_version: 1",
    "content_version: 1.0",
    "id: research.evidence.sampling-bias",
    "slug: sampling-bias",
    "title: Sampling and bias",
    "course_id: research",
    "unit_id: evidence",
    "position: 2",
    "status: draft",
    "language: en-PH",
    "level: undergraduate",
    "estimated_minutes: 8",
    "summary: Read a sample with more care.",
    "keywords: [sampling, bias, evidence]",
    "prerequisites: []",
    "outcome_ids: [LO1, LO2, LO3]",
    "content_status: original",
    "source_policy: alignment_only",
    "license: pending",
    "rights_review: pending",
    "last_reviewed: 2026-08-08",
    "reviewed_by: editorial-owner",
    "source_basis:",
    "  - source_id: official-research-source",
    "    title: Research source",
    "    publisher: Commission on Higher Education",
    "    url: https://example.com/source",
    "    accessed: 2026-08-08",
    "    locator: section 1",
    "    used_for: outcome alignment and fact-checking",
    "    quoted_text: false",
    "    license: official-reference",
    "---",
    "# Sampling and bias",
    "This lesson helps learners inspect how inclusion choices shape a claim.",
    "## Why this matters",
    ...Array.from({ length: 8 }, (_, index) => `A useful reason ${index + 1} is to connect evidence choices to a real decision.`),
    "## Learning outcomes",
    "1. Identify a sampling decision.",
    "2. Explain how inclusion can shape a conclusion.",
    "3. Compare two sampling contexts.",
    "4. Apply a boundary to a new situation.",
    "## Before you begin",
    "Review the idea of a population and ask who had a chance to be included.",
    "## Vocabulary",
    ...Array.from({ length: 10 }, (_, index) => `- **Term ${index + 1}:** A plain-language definition, an original example, and a boundary.`),
    "## Key ideas",
    ...Array.from({ length: 8 }, (_, index) => [
      `### Idea ${index + 1}: A visible choice`,
      ...Array.from({ length: 12 }, (_, detail) => `Idea ${index + 1}, detail ${detail + 1}, connects the sampling choice to an observable outcome.`),
    ]).flat(),
    "## Worked example",
    ...Array.from({ length: 2 }, (_, index) => [
      `### Example ${index + 1}`,
      ...Array.from({ length: 12 }, (_, detail) => `Example ${index + 1}, reasoning step ${detail + 1}, shows a decision and its limitation.`),
    ]).flat(),
    "## Common confusions",
    ...Array.from({ length: 6 }, (_, index) => `- **Confusion:** Mistake ${index + 1}. **Correction:** Name the boundary. **Why it matters:** Shape the claim.`),
    "## Apply it",
    "### Activity 1: Quick application",
    "Purpose, estimated time, materials, numbered steps, completion criteria, accessibility alternative, and privacy boundary.",
    "### Activity 2: Compare or analyze",
    "Purpose, estimated time, materials, numbered steps, completion criteria, accessibility alternative, and privacy boundary.",
    "### Activity 3: Transfer",
    "Purpose, estimated time, materials, numbered steps, completion criteria, accessibility alternative, and privacy boundary.",
    "## Recall",
    ...Array.from({ length: 10 }, (_, index) => `${index + 1}. Recall prompt ${index + 1}.`),
    "## Reflection or transfer",
    "Reflect on a study decision and transfer the idea to a community situation.",
    "## Further study",
    "- [Resource one](https://example.com/one)",
    "- [Resource two](https://example.com/two)",
    "- [Resource three](https://example.com/three)",
    "## Sources and provenance",
    "The source was used for alignment and fact-checking; no source text, table, diagram, example, or question bank was reproduced.",
    "## Rights and originality",
    "The explanation, examples, and activities were newly authored; the license remains pending and this is not an official institutional curriculum.",
  ];
  while (lines.length < 260) lines.push(`Additional meaningful editorial check ${lines.length}.`);
  return lines.join("\n");
}

function questionBank() {
  const types = [
    ...Array(12).fill("multiple_choice"),
    ...Array(6).fill("multiple_select"),
    ...Array(6).fill("true_false"),
    ...Array(5).fill("matching"),
    ...Array(4).fill("ordering"),
    ...Array(4).fill("fill_blank"),
    ...Array(4).fill("short_answer"),
    ...Array(4).fill("scenario"),
  ];
  const questions = types.map((type, index) => {
    const question: Record<string, unknown> = {
      id: `research.evidence.sampling-bias.q${String(index + 1).padStart(3, "0")}`,
      type,
      prompt: `Original practice prompt ${index + 1}.`,
      skill: `skill-${index % 4}`,
      outcome_id: `LO${(index % 3) + 1}`,
      cognitive_level: index % 2 ? "apply" : "understand",
      difficulty: "medium",
      estimated_seconds: 60,
      tags: ["retrieval"],
      answer: { value: "server-only" },
      explanation: "The explanation teaches the relevant principle.",
      misconception: "The learner may confuse a sample with a population.",
      source_basis: ["official-research-source"],
      originality_note: "Newly authored for Aralivo.",
    };
    if (type === "multiple_choice" || type === "multiple_select" || type === "true_false") {
      question.options = [
        { id: "a", text: "Option A" },
        { id: "b", text: "Option B" },
        { id: "c", text: "Option C" },
        { id: "d", text: "Option D" },
      ];
    }
    if (type === "multiple_choice") question.answer = { option_id: "b" };
    if (type === "multiple_select") question.answer = { option_ids: ["a", "c"] };
    if (type === "true_false") {
      question.options = [{ id: "true", text: "True" }, { id: "false", text: "False" }];
      question.answer = { value: index % 2 === 0 };
    }
    if (type === "matching") {
      question.pairs = { left: [{ id: "l1", text: "Idea" }], right: [{ id: "r1", text: "Definition" }] };
      question.answer = { matches: [{ left_id: "l1", right_id: "r1" }] };
    }
    if (type === "ordering") {
      question.items = [{ id: "s1", text: "First" }, { id: "s2", text: "Second" }];
      question.answer = { ordered_ids: ["s1", "s2"] };
    }
    if (type === "fill_blank") question.answer = { accepted: ["sample"] };
    if (type === "short_answer") question.answer = { rubric: ["Names the relevant concept."], key_points: ["concept"] };
    if (type === "scenario") {
      question.scenario = "A new situation asks the learner to transfer the idea.";
      question.answer = { best_response: "b", key_points: ["context"] };
    }
    return question;
  });
  return {
    schema_version: 1,
    question_bank_id: "research.evidence.sampling-bias.questions",
    lesson_id: "research.evidence.sampling-bias",
    content_version: "1.0",
    language: "en-PH",
    question_count: 45,
    selection_policy: { lesson_practice_count: 15 },
    questions,
  };
}

describe("content parser", () => {
  it("parses the prompt-compatible lesson structure", () => {
    const result = parseLessonMarkdown(validLessonMarkdown());
    expect(result.ok).toBe(true);
    expect(result.value?.frontMatter.content_status).toBe("original");
    expect(result.value?.lineCount).toBeGreaterThanOrEqual(250);
    expect(result.value?.sections.filter((section) => section.level === 2).map((section) => section.heading)).toEqual([
      "Why this matters",
      "Learning outcomes",
      "Before you begin",
      "Vocabulary",
      "Key ideas",
      "Worked example",
      "Common confusions",
      "Apply it",
      "Recall",
      "Reflection or transfer",
      "Further study",
      "Sources and provenance",
      "Rights and originality",
    ]);
    expect(result.issues).toHaveLength(0);
  });

  it("rejects hidden answer keys and incomplete lesson structure", () => {
    const result = parseLessonMarkdown("---\nstatus: draft\n---\n# Lesson\n<!-- answer key -->");
    expect(result.ok).toBe(false);
    expect(result.issues.some((item) => item.code === "ANSWER_KEY_HIDDEN")).toBe(true);
    expect(result.issues.some((item) => item.code === "HEADING_REQUIRED")).toBe(true);
  });

  it("validates the default question distribution and strips private answer data", () => {
    const result = parseQuestionBankJson(questionBank());
    expect(result.ok).toBe(true);
    expect(result.value?.questions).toHaveLength(45);
    const learnerQuestion = stripAnswerKey(result.value!.questions[0]);
    expect(learnerQuestion.answer).toBeUndefined();
    expect(learnerQuestion.explanation).toBeUndefined();
    expect(learnerQuestion.prompt).toBe("Original practice prompt 1.");
  });

  it("exposes the three selection policies used by the practice chooser", () => {
    expect(getAssessmentPolicy("lesson").selectionCount).toBe(15);
    expect(getAssessmentPolicy("unit").selectionCount).toBe(30);
    expect(getAssessmentPolicy("course").selectionCount).toBe(50);
  });
});
