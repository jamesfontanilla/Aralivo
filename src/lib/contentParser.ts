export type ContentIssueSeverity = "error" | "warning";

export type ContentIssue = {
  code: string;
  message: string;
  path: string;
  line?: number;
  severity: ContentIssueSeverity;
};

export type ParseResult<T> = {
  value: T | null;
  issues: ContentIssue[];
  ok: boolean;
};

export type LessonSection = {
  heading: string;
  level: number;
  content: string;
  line: number;
};

export type LessonDocument = {
  frontMatter: Record<string, unknown>;
  sections: LessonSection[];
  lineCount: number;
  meaningfulLineCount: number;
};

export type QuestionOption = {
  id: string;
  text: string;
};

export type AuthoringQuestion = {
  id: string;
  type: string;
  prompt: string;
  skill: string;
  outcome_id: string;
  cognitive_level: string;
  difficulty: string;
  estimated_seconds: number;
  tags: string[];
  options?: QuestionOption[];
  pairs?: {
    left: QuestionOption[];
    right: QuestionOption[];
  };
  items?: QuestionOption[];
  scenario?: string;
  answer: Record<string, unknown>;
  explanation: string;
  misconception: string;
  source_basis: string[];
  originality_note: string;
  [key: string]: unknown;
};

export type QuestionBank = {
  schema_version: number;
  question_bank_id: string;
  lesson_id: string;
  content_version: string;
  language: string;
  question_count: number;
  selection_policy: Record<string, unknown>;
  questions: AuthoringQuestion[];
};

export type LearnerQuestion = Omit<
  AuthoringQuestion,
  "answer" | "explanation" | "misconception" | "source_basis" | "originality_note"
>;

export type PracticeScope = "course" | "unit" | "lesson";

export type AssessmentPolicy = {
  scope: PracticeScope;
  label: string;
  selectionCount: number;
  description: string;
};

const requiredFrontMatter = [
  "schema_version",
  "content_version",
  "id",
  "slug",
  "title",
  "course_id",
  "unit_id",
  "position",
  "status",
  "language",
  "level",
  "estimated_minutes",
  "summary",
  "keywords",
  "prerequisites",
  "outcome_ids",
  "content_status",
  "source_policy",
  "license",
  "rights_review",
  "last_reviewed",
  "reviewed_by",
  "source_basis",
] as const;

const requiredLessonHeadings = [
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
] as const;

const questionTypes = new Set([
  "multiple_choice",
  "multiple_select",
  "true_false",
  "matching",
  "ordering",
  "fill_blank",
  "short_answer",
  "scenario",
]);

function issue(
  code: string,
  message: string,
  path: string,
  severity: ContentIssueSeverity = "error",
  line?: number,
): ContentIssue {
  return { code, message, path, severity, ...(line ? { line } : {}) };
}

function parseScalar(raw: string): unknown {
  const value = raw.trim();
  if (!value) return "";
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null") return null;
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  if (value.startsWith("[") && value.endsWith("]")) {
    try {
      return JSON.parse(value);
    } catch {
      return value
        .slice(1, -1)
        .split(",")
        .map((item) => item.trim().replace(/^['"]|['"]$/g, ""))
        .filter(Boolean);
    }
  }
  return value;
}

function parseFrontMatter(lines: string[]) {
  const frontMatter: Record<string, unknown> = {};
  for (const line of lines) {
    const match = line.match(/^([A-Za-z][A-Za-z0-9_]*)\s*:\s*(.*)$/);
    if (match) frontMatter[match[1]] = parseScalar(match[2]);
  }
  return frontMatter;
}

function sectionBody(lines: string[], startIndex: number) {
  const level = (lines[startIndex].match(/^#+/) ?? [""])[0].length;
  let endIndex = lines.length;
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const match = lines[index].match(/^(#{1,6})\s+/);
    if (match && match[1].length <= level) {
      endIndex = index;
      break;
    }
  }
  return lines.slice(startIndex + 1, endIndex).join("\n").trim();
}

export function parseLessonMarkdown(markdown: string): ParseResult<LessonDocument> {
  const normalized = markdown.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");
  const issues: ContentIssue[] = [];
  if (!normalized.trim()) {
    return { value: null, issues: [issue("EMPTY", "Lesson Markdown is empty.", "markdown")], ok: false };
  }
  if (lines[0]?.trim() !== "---") {
    issues.push(issue("FRONT_MATTER_REQUIRED", "The lesson must start with YAML front matter.", "front_matter", "error", 1));
  }
  const closingIndex = lines.findIndex((line, index) => index > 0 && line.trim() === "---");
  if (closingIndex < 0) {
    issues.push(issue("FRONT_MATTER_UNCLOSED", "YAML front matter must close with a second --- line.", "front_matter"));
  }
  const frontMatter = parseFrontMatter(closingIndex > 0 ? lines.slice(1, closingIndex) : []);
  for (const field of requiredFrontMatter) {
    if (!(field in frontMatter)) {
      issues.push(issue("FIELD_REQUIRED", `Required front matter field: ${field}.`, `front_matter.${field}`));
    }
  }
  const frontText = closingIndex > 0 ? lines.slice(1, closingIndex).join("\n") : "";
  if (!/^\s*status:\s*draft\s*$/m.test(frontText)) {
    issues.push(issue("STATUS_REQUIRED", "New lesson content must declare status: draft.", "front_matter.status"));
  }
  if (!/^\s*content_status:\s*original\s*$/m.test(frontText)) {
    issues.push(issue("ORIGINAL_CONTENT_REQUIRED", "Learner content must declare content_status: original.", "front_matter.content_status"));
  }
  if (!/^\s*source_policy:\s*alignment_only\s*$/m.test(frontText)) {
    issues.push(issue("SOURCE_POLICY_REQUIRED", "Sources must be limited to alignment_only use.", "front_matter.source_policy"));
  }
  if (!/^\s*license:\s*pending\s*$/m.test(frontText)) {
    issues.push(issue("LICENSE_REVIEW_REQUIRED", "The default lesson license must remain pending until reviewed.", "front_matter.license"));
  }
  if (!/^\s*rights_review:\s*pending\s*$/m.test(frontText)) {
    issues.push(issue("RIGHTS_REVIEW_REQUIRED", "The default rights review must remain pending until reviewed.", "front_matter.rights_review"));
  }
  if (/\bhttp:\/\//i.test(frontText)) {
    issues.push(issue("HTTPS_REQUIRED", "Every source URL must use HTTPS.", "front_matter.source_basis"));
  }
  if (!/quoted_text:\s*false\b/i.test(frontText)) {
    issues.push(issue("QUOTED_TEXT_REQUIRED", "Every source entry must declare quoted_text: false.", "front_matter.source_basis"));
  }
  if (/<!--\s*(?:answer|answer key)|answer key/i.test(normalized)) {
    issues.push(issue("ANSWER_KEY_HIDDEN", "Learner-facing Markdown must not contain an answer key.", "markdown"));
  }
  if (/\b(?:CHED-approved|officially adopted)\b/i.test(normalized)) {
    issues.push(issue("UNSUPPORTED_CLAIM", "Do not claim CHED approval, adoption, or institutional equivalence.", "markdown"));
  }
  const sourceCount = frontText.match(/^\s*-\s+source_id:/gm)?.length ?? 0;
  const sourceUrlCount = frontText.match(/^\s+url:\s+https:\/\//gm)?.length ?? 0;
  const quotedTextCount = frontText.match(/^\s+quoted_text:\s+false\s*$/gim)?.length ?? 0;
  if (sourceCount < 1 || sourceUrlCount < sourceCount) {
    issues.push(issue("SOURCE_BASIS_REQUIRED", "Each source_basis entry needs a verified HTTPS URL.", "front_matter.source_basis"));
  }
  if (quotedTextCount < sourceCount) {
    issues.push(issue("SOURCE_QUOTED_TEXT_REQUIRED", "Each source_basis entry must declare quoted_text: false.", "front_matter.source_basis"));
  }

  const contentStart = closingIndex > 0 ? closingIndex + 1 : 0;
  const contentLines = lines.slice(contentStart);
  const sections: LessonSection[] = [];
  contentLines.forEach((line, index) => {
    const match = line.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (match) {
      sections.push({
        heading: match[2],
        level: match[1].length,
        content: sectionBody(contentLines, index),
        line: contentStart + index + 1,
      });
    }
  });
  const h1 = sections.find((section) => section.level === 1);
  if (!h1) issues.push(issue("TITLE_HEADING_REQUIRED", "The lesson must include one level-one title heading.", "headings"));
  if (h1 && typeof frontMatter.title === "string" && h1.heading !== frontMatter.title) {
    issues.push(issue("TITLE_MISMATCH", "The level-one heading must match the front matter title.", "title"));
  }
  const levelTwo = sections.filter((section) => section.level === 2);
  const headingIndexes = requiredLessonHeadings.map((heading) => levelTwo.findIndex((section) => section.heading === heading));
  requiredLessonHeadings.forEach((heading, index) => {
    if (headingIndexes[index] < 0) issues.push(issue("HEADING_REQUIRED", `Required section heading: ## ${heading}.`, "headings"));
  });
  if (headingIndexes.some((index) => index >= 0) && headingIndexes.some((index, indexPosition) => index >= 0 && headingIndexes.slice(indexPosition + 1).some((next) => next >= 0 && next < index))) {
    issues.push(issue("HEADING_ORDER", "Lesson sections must follow the authoring contract order.", "headings"));
  }
  const keyIdeas = sections.filter((section) => section.level === 3 && section.line > (levelTwo.find((section) => section.heading === "Key ideas")?.line ?? Infinity) && section.line < (levelTwo.find((section) => section.heading === "Worked example")?.line ?? Infinity));
  if (keyIdeas.length < 8) issues.push(issue("KEY_IDEA_COUNT", "Key ideas must contain at least eight subsections.", "sections.key_ideas"));
  const examples = sections.filter((section) => section.level === 3 && section.line > (levelTwo.find((section) => section.heading === "Worked example")?.line ?? Infinity) && section.line < (levelTwo.find((section) => section.heading === "Common confusions")?.line ?? Infinity));
  if (examples.length < 2) issues.push(issue("WORKED_EXAMPLE_COUNT", "Worked example must contain at least two subsections.", "sections.worked_example"));
  const applyIt = levelTwo.find((section) => section.heading === "Apply it");
  if (!applyIt || !/Activity\s+1|Activity\s+2|Activity\s+3/i.test(applyIt.content)) {
    issues.push(issue("ACTIVITY_COUNT", "Apply it must contain Activity 1, Activity 2, and Activity 3.", "sections.apply_it"));
  }
  const recall = levelTwo.find((section) => section.heading === "Recall");
  const recallCount = recall?.content.match(/^\s*\d+[.)]\s+/gm)?.length ?? 0;
  if (recallCount < 10) issues.push(issue("RECALL_COUNT", "Recall must contain ten numbered prompts without answers.", "sections.recall"));
  const furtherStudy = levelTwo.find((section) => section.heading === "Further study");
  if ((furtherStudy?.content.match(/https:\/\//gi)?.length ?? 0) < 3) {
    issues.push(issue("SOURCE_RECOMMENDATION_COUNT", "Further study must include three to five verified HTTPS resources.", "sections.further_study"));
  }
  const physicalLineCount = lines.length;
  const meaningfulLineCount = lines.filter((line) => {
    const value = line.trim();
    return value.length >= 3 && value !== "---" && !/^#{1,6}\s+/.test(value);
  }).length;
  if (physicalLineCount < 250) issues.push(issue("CONTENT_TOO_SHORT", "The lesson must contain at least 250 physical lines.", "markdown"));
  if (meaningfulLineCount < 220) issues.push(issue("MEANINGFUL_CONTENT_TOO_SHORT", "At least 220 lines must contain meaningful, non-repetitive content.", "markdown"));
  const value: LessonDocument = { frontMatter, sections, lineCount: physicalLineCount, meaningfulLineCount };
  return { value, issues, ok: issues.every((item) => item.severity !== "error") };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasText(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateOptions(question: Record<string, unknown>, path: string, issues: ContentIssue[]) {
  const options = question.options;
  if (!Array.isArray(options) || options.some((option) => !isRecord(option) || !hasText(option.id) || !hasText(option.text))) {
    issues.push(issue("OPTION_SHAPE", "Options must be objects with stable IDs and text.", `${path}.options`));
  }
}

export function parseQuestionBankJson(input: string | unknown): ParseResult<QuestionBank> {
  const issues: ContentIssue[] = [];
  let parsed: unknown = input;
  if (typeof input === "string") {
    try {
      parsed = JSON.parse(input) as unknown;
    } catch {
      return { value: null, issues: [issue("INVALID_JSON", "Question bank is not valid JSON.", "root")], ok: false };
    }
  }
  if (!isRecord(parsed)) return { value: null, issues: [issue("JSON_OBJECT_REQUIRED", "Question bank must be a JSON object.", "root")], ok: false };
  const required = ["schema_version", "question_bank_id", "lesson_id", "content_version", "language", "question_count", "selection_policy", "questions"];
  required.forEach((field) => {
    if (!(field in parsed)) issues.push(issue("FIELD_REQUIRED", `Required question-bank field: ${field}.`, field));
  });
  const questions = parsed.questions;
  if (!Array.isArray(questions)) {
    issues.push(issue("QUESTIONS_ARRAY_REQUIRED", "questions must be an array.", "questions"));
    return { value: null, issues, ok: false };
  }
  if (questions.length < 36 || questions.length > 54) issues.push(issue("QUESTION_COUNT", "A bank must contain 45 questions by default, or 36–54 with an editorial note.", "questions"));
  else if (questions.length !== 45) issues.push(issue("EDITORIAL_COUNT_NOTE", "A non-default bank size needs an editorial note before publication.", "questions", "warning"));
  if (parsed.question_count !== questions.length) issues.push(issue("QUESTION_COUNT_MISMATCH", "question_count must match the questions array length.", "question_count"));
  const ids = new Set<string>();
  const prompts = new Set<string>();
  const types = new Set<string>();
  const outcomes = new Map<string, number>();
  let scenarioCount = 0;
  let retrievalCount = 0;
  const normalizedQuestions: AuthoringQuestion[] = [];
  questions.forEach((rawQuestion, index) => {
    const path = `questions[${index}]`;
    if (!isRecord(rawQuestion)) {
      issues.push(issue("QUESTION_OBJECT_REQUIRED", "Each question must be an object.", path));
      return;
    }
    const question = rawQuestion as AuthoringQuestion;
    ["id", "type", "prompt", "skill", "outcome_id", "cognitive_level", "difficulty", "estimated_seconds", "tags", "answer", "explanation", "misconception", "source_basis", "originality_note"].forEach((field) => {
      if (!(field in question)) issues.push(issue("FIELD_REQUIRED", `Required question field: ${field}.`, `${path}.${field}`));
    });
    if (!hasText(question.id)) issues.push(issue("QUESTION_ID_REQUIRED", "Question IDs must be non-empty strings.", `${path}.id`));
    if (typeof question.id === "string" && ids.has(question.id)) issues.push(issue("DUPLICATE_QUESTION_ID", "Question IDs must be unique.", `${path}.id`));
    if (typeof question.id === "string") ids.add(question.id);
    if (!hasText(question.prompt)) issues.push(issue("PROMPT_REQUIRED", "Every question needs a concise prompt.", `${path}.prompt`));
    const promptKey = typeof question.prompt === "string" ? question.prompt.trim().toLocaleLowerCase() : "";
    if (promptKey && prompts.has(promptKey)) issues.push(issue("DUPLICATE_PROMPT", "Question prompts must be unique.", `${path}.prompt`));
    if (promptKey) prompts.add(promptKey);
    if (!questionTypes.has(question.type)) issues.push(issue("QUESTION_TYPE", `Unsupported question type: ${String(question.type)}.`, `${path}.type`));
    if (typeof question.type === "string") types.add(question.type);
    if (typeof question.outcome_id === "string") outcomes.set(question.outcome_id, (outcomes.get(question.outcome_id) ?? 0) + 1);
    if (question.type === "scenario") scenarioCount += 1;
    if (["short_answer", "fill_blank", "ordering", "matching"].includes(question.type)) retrievalCount += 1;
    if (["multiple_choice", "multiple_select", "true_false"].includes(question.type)) validateOptions(question, path, issues);
    if (question.type === "multiple_choice" && (!Array.isArray(question.options) || question.options.length !== 4 || !isRecord(question.answer) || typeof question.answer.option_id !== "string")) issues.push(issue("MULTIPLE_CHOICE_SHAPE", "Multiple-choice questions need four options and one answer option_id.", path));
    if (question.type === "multiple_select" && (!Array.isArray(question.options) || question.options.length < 4 || question.options.length > 5 || !isRecord(question.answer) || !Array.isArray(question.answer.option_ids) || question.answer.option_ids.length < 2)) issues.push(issue("MULTIPLE_SELECT_SHAPE", "Multiple-select questions need four or five options and at least two answer option_ids.", path));
    if (question.type === "true_false" && (!Array.isArray(question.options) || question.options.length !== 2 || !isRecord(question.answer) || typeof question.answer.value !== "boolean")) issues.push(issue("TRUE_FALSE_SHAPE", "True/false questions need two options and a boolean answer.", path));
    if (question.type === "matching" && (!isRecord(question.pairs) || !Array.isArray(question.pairs.left) || !Array.isArray(question.pairs.right))) issues.push(issue("MATCHING_SHAPE", "Matching questions need complete left and right sets.", `${path}.pairs`));
    if (question.type === "matching" && (!isRecord(question.answer) || !Array.isArray(question.answer.matches))) issues.push(issue("MATCHING_ANSWER_SHAPE", "Matching questions need a one-to-one answer map.", `${path}.answer`));
    if (question.type === "ordering" && (!Array.isArray(question.items) || question.items.length < 2)) issues.push(issue("ORDERING_SHAPE", "Ordering questions need at least two ordered items.", `${path}.items`));
    if (question.type === "ordering" && (!isRecord(question.answer) || !Array.isArray(question.answer.ordered_ids))) issues.push(issue("ORDERING_ANSWER_SHAPE", "Ordering questions need an ordered_ids answer.", `${path}.answer`));
    if (question.type === "fill_blank" && (!isRecord(question.answer) || !Array.isArray(question.answer.accepted) || question.answer.accepted.length === 0)) issues.push(issue("FILL_BLANK_SHAPE", "Fill-blank answers need accepted variants.", `${path}.answer`));
    if (question.type === "short_answer" && (!isRecord(question.answer) || !Array.isArray(question.answer.rubric) || question.answer.rubric.length === 0)) issues.push(issue("SHORT_ANSWER_SHAPE", "Short-answer questions need a review rubric.", `${path}.answer`));
    if (question.type === "scenario" && !hasText(question.scenario) && !hasText(question.prompt)) issues.push(issue("SCENARIO_REQUIRED", "Scenario questions need a new situation.", `${path}.scenario`));
    normalizedQuestions.push(question);
  });
  if (types.size < 6) issues.push(issue("TYPE_DIVERSITY", "Use at least six distinct question types.", "questions"));
  if (scenarioCount < 4) issues.push(issue("SCENARIO_COUNT", "Include at least four application or scenario items.", "questions"));
  if (retrievalCount < 4) issues.push(issue("RETRIEVAL_COUNT", "Include at least four retrieval items that do not rely on recognition.", "questions"));
  outcomes.forEach((count, outcome) => {
    if (count < 4) issues.push(issue("OUTCOME_COVERAGE", `Outcome ${outcome} must be covered at least four times.`, "questions", "warning"));
  });
  const value: QuestionBank = {
    schema_version: Number(parsed.schema_version),
    question_bank_id: String(parsed.question_bank_id ?? ""),
    lesson_id: String(parsed.lesson_id ?? ""),
    content_version: String(parsed.content_version ?? ""),
    language: String(parsed.language ?? ""),
    question_count: Number(parsed.question_count),
    selection_policy: isRecord(parsed.selection_policy) ? parsed.selection_policy : {},
    questions: normalizedQuestions,
  };
  return { value, issues, ok: issues.every((item) => item.severity !== "error") };
}

export function stripAnswerKey(question: AuthoringQuestion): LearnerQuestion {
  const privateFields = new Set(["answer", "explanation", "misconception", "source_basis", "originality_note"]);
  return Object.fromEntries(
    Object.entries(question).filter(([key]) => !privateFields.has(key)),
  ) as LearnerQuestion;
}

export function toLearnerQuestionBank(bank: QuestionBank): LearnerQuestion[] {
  return bank.questions.map(stripAnswerKey);
}

export function getAssessmentPolicy(scope: PracticeScope): AssessmentPolicy {
  const policies: Record<PracticeScope, AssessmentPolicy> = {
    lesson: { scope, label: "Lesson practice", selectionCount: 15, description: "A focused set from one lesson." },
    unit: { scope, label: "Unit review", selectionCount: 30, description: "A broader review across the unit's lessons." },
    course: { scope, label: "Course assessment", selectionCount: 50, description: "A cumulative assessment across the course." },
  };
  return policies[scope];
}
