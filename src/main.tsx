/* eslint-disable @typescript-eslint/no-unused-vars -- route components are intentionally colocated in this scaffold. */
import * as React from "react";
import { StrictMode, Suspense, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import type { Session } from "@supabase/supabase-js";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  CloudOff,
  ExternalLink,
  FileDown,
  Flame,
  Focus,
  HelpCircle,
  Home,
  KeyRound,
  Leaf,
  Link2,
  LockKeyhole,
  LogOut,
  Mail,
  Menu,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Search,
  Settings as SettingsIcon,
  ShieldCheck,
  Sparkles,
  Target,
  TimerReset,
  Trash2,
  Trophy,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import {
  BrowserRouter,
  Link,
  NavLink,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { appUrl, supabase } from "./lib/supabase";
import { getAssessmentPolicy, type PracticeScope } from "./lib/contentParser";
import lessonMarkdown from "../data/seed/lessons/understanding-self/the-self-from-various-perspectives/introduction-to-the-self/lesson.md?raw";
import philosophicalLessonMarkdown from "../data/seed/lessons/understanding-self/the-self-from-various-perspectives/philosophical-perspectives-of-the-self/lesson.md?raw";
import sociologyLessonMarkdown from "../data/seed/lessons/understanding-self/the-self-from-various-perspectives/the-self-in-sociology/lesson.md?raw";
import anthropologyLessonMarkdown from "../data/seed/lessons/understanding-self/the-self-from-various-perspectives/the-self-in-anthropology/lesson.md?raw";
import psychologyLessonMarkdown from "../data/seed/lessons/understanding-self/the-self-from-various-perspectives/the-self-in-psychology/lesson.md?raw";
import westernEasternLessonMarkdown from "../data/seed/lessons/understanding-self/the-self-from-various-perspectives/western-and-eastern-views-of-the-self/lesson.md?raw";
import ethicsLessonMarkdown from "../data/seed/lessons/ethics/foundations-of-ethics/moral-and-non-moral-standards/lesson.md?raw";
import moralDilemmasLessonMarkdown from "../data/seed/lessons/ethics/foundations-of-ethics/moral-dilemmas-and-ethical-problems/lesson.md?raw";
import freedomLessonMarkdown from "../data/seed/lessons/ethics/foundations-of-ethics/freedom-responsibility-reason-and-impartiality/lesson.md?raw";
import cultureMoralBehaviorLessonMarkdown from "../data/seed/lessons/ethics/the-moral-agent/culture-and-moral-behavior/lesson.md?raw";
import communicationLessonMarkdown from "../data/seed/lessons/purposive-communication/communication-foundations/communication-processes-and-elements/lesson.md?raw";
import principlesEthicsLessonMarkdown from "../data/seed/lessons/purposive-communication/communication-foundations/principles-and-ethics-of-communication/lesson.md?raw";
import verbalNonVerbalMultimodalLessonMarkdown from "../data/seed/lessons/purposive-communication/communication-foundations/verbal-non-verbal-and-multimodal-communication/lesson.md?raw";
import communicationGlobalizationLessonMarkdown from "../data/seed/lessons/purposive-communication/language-culture-and-audience/communication-and-globalization/lesson.md?raw";
import stsLessonMarkdown from "../data/seed/lessons/science-technology-society/science-technology-and-social-change/what-are-science-technology-and-society/lesson.md?raw";
import historicalAntecedentsLessonMarkdown from "../data/seed/lessons/science-technology-society/science-technology-and-social-change/historical-antecedents-of-science-and-technology/lesson.md?raw";
import "./styles.css";

const seedLessonId = "understanding-self.the-self-from-various-perspectives.introduction-to-the-self";
const philosophicalLessonId = "understanding-self.the-self-from-various-perspectives.philosophical-perspectives-of-the-self";
const sociologyLessonId = "understanding-self.the-self-from-various-perspectives.the-self-in-sociology";
const anthropologyLessonId = "understanding-self.the-self-from-various-perspectives.the-self-in-anthropology";
const psychologyLessonId = "understanding-self.the-self-from-various-perspectives.the-self-in-psychology";
const westernEasternLessonId = "understanding-self.the-self-from-various-perspectives.western-and-eastern-views-of-the-self";
const seedUnitId = "the-self-from-various-perspectives";
const ethicsLessonId = "ethics.foundations-of-ethics.moral-and-non-moral-standards";
const moralDilemmasLessonId = "ethics.foundations-of-ethics.moral-dilemmas-and-ethical-problems";
const freedomLessonId = "ethics.foundations-of-ethics.freedom-responsibility-reason-and-impartiality";
const cultureMoralBehaviorLessonId = "ethics.the-moral-agent.culture-and-moral-behavior";
const ethicsUnitId = "foundations-of-ethics";
const moralAgentUnitId = "the-moral-agent";
const communicationLessonId = "purposive-communication.communication-foundations.communication-processes-and-elements";
const principlesEthicsLessonId = "purposive-communication.communication-foundations.principles-and-ethics-of-communication";
const verbalNonVerbalMultimodalLessonId = "purposive-communication.communication-foundations.verbal-non-verbal-and-multimodal-communication";
const communicationUnitId = "communication-foundations";
const communicationGlobalizationLessonId = "purposive-communication.language-culture-and-audience.communication-and-globalization";
const languageCultureAudienceUnitId = "language-culture-and-audience";
const stsLessonId = "science-technology-society.science-technology-and-social-change.what-are-science-technology-and-society";
const historicalAntecedentsLessonId = "science-technology-society.science-technology-and-social-change.historical-antecedents-of-science-and-technology";
const stsUnitId = "science-technology-and-social-change";

const subjects = [
  {
    id: "understanding-self",
    name: "Understanding the Self",
    code: "Required course",
    color: "violet",
    icon: "⌁",
    progress: 0,
    next: "Start with Introduction to the Self",
    lessons: 6,
  },
  {
    id: "philippine-history",
    name: "Readings in Philippine History",
    code: "Required course",
    color: "mint",
    icon: "⌘",
    progress: 0,
    next: "Content not generated yet",
    lessons: 0,
  },
  {
    id: "contemporary-world",
    name: "The Contemporary World",
    code: "Required course",
    color: "coral",
    icon: "◌",
    progress: 0,
    next: "Content not generated yet",
    lessons: 0,
  },
  {
    id: "science-technology-society",
    name: "Science, Technology, and Society",
    code: "Required course",
    color: "violet",
    icon: "S",
    progress: 0,
    next: "Start with What Are Science, Technology, and Society?",
    lessons: 2,
  },
  {
    id: "mathematics-modern-world",
    name: "Mathematics in the Modern World",
    code: "Required course",
    color: "mint",
    icon: "M",
    progress: 0,
    next: "Content not generated yet",
    lessons: 0,
  },
  {
    id: "jose-rizal",
    name: "Life and Works of Jose Rizal",
    code: "Required course",
    color: "coral",
    icon: "R",
    progress: 0,
    next: "Content not generated yet",
    lessons: 0,
  },
  {
    id: "purposive-communication",
    name: "Purposive Communication",
    code: "Required course",
    color: "violet",
    icon: "P",
    progress: 0,
    next: "Start with Communication and Globalization",
    lessons: 4,
  },
  {
    id: "art-appreciation",
    name: "Art Appreciation",
    code: "Required course",
    color: "mint",
    icon: "A",
    progress: 0,
    next: "Content not generated yet",
    lessons: 0,
  },
  {
    id: "ethics",
    name: "Ethics",
    code: "Required course",
    color: "coral",
    icon: "E",
    progress: 0,
    next: "Start with Culture and Moral Behavior",
    lessons: 4,
  },
];

type CourseUnit = {
  id: string;
  subjectId: string;
  title: string;
  label: string;
  progress: number;
  lessons: number;
  duration: string;
  state: "complete" | "current" | "locked";
};

type CourseLesson = {
  id: string;
  unitId: string;
  title: string;
  eyebrow: string;
  duration: string;
  state: "in-progress" | "practiced" | "not-started";
  progress: number;
  outcome: string;
};

const units: CourseUnit[] = [
  {
    id: seedUnitId,
    subjectId: "understanding-self",
    title: "The Self from Various Perspectives",
    label: "Unit 1",
    progress: 0,
    lessons: 6,
    duration: "255 min",
    state: "current",
  },
  {
    id: ethicsUnitId,
    subjectId: "ethics",
    title: "Foundations of Ethics",
    label: "Unit 1",
    progress: 0,
    lessons: 3,
    duration: "130 min",
    state: "current",
  },
  {
    id: moralAgentUnitId,
    subjectId: "ethics",
    title: "The Moral Agent",
    label: "Unit 2",
    progress: 0,
    lessons: 1,
    duration: "45 min",
    state: "current",
  },
  {
    id: communicationUnitId,
    subjectId: "purposive-communication",
    title: "Communication Foundations",
    label: "Unit 1",
    progress: 0,
    lessons: 3,
    duration: "135 min",
    state: "current",
  },
  {
    id: languageCultureAudienceUnitId,
    subjectId: "purposive-communication",
    title: "Language, Culture, and Audience",
    label: "Unit 2",
    progress: 0,
    lessons: 1,
    duration: "45 min",
    state: "current",
  },
  {
    id: stsUnitId,
    subjectId: "science-technology-society",
    title: "Science, Technology, and Social Change",
    label: "Unit 1",
    progress: 0,
    lessons: 2,
    duration: "85 min",
    state: "current",
  },
];

const lessons: CourseLesson[] = [
  {
    id: seedLessonId,
    unitId: seedUnitId,
    title: "Introduction to the Self",
    eyebrow: "Lesson 1",
    duration: "30 min",
    state: "not-started",
    progress: 0,
    outcome: "Compare perspectives on the self and build a careful, revisable account.",
  },
  {
    id: philosophicalLessonId,
    unitId: seedUnitId,
    title: "Philosophical Perspectives of the Self",
    eyebrow: "Lesson 2",
    duration: "45 min",
    state: "not-started",
    progress: 0,
    outcome: "Compare philosophical accounts of identity, consciousness, body, and continuity.",
  },
  {
    id: sociologyLessonId,
    unitId: seedUnitId,
    title: "The Self in Sociology",
    eyebrow: "Lesson 3",
    duration: "45 min",
    state: "not-started",
    progress: 0,
    outcome: "Explain how interaction, socialization, roles, and institutions shape the self.",
  },
  {
    id: anthropologyLessonId,
    unitId: seedUnitId,
    title: "The Self in Anthropology",
    eyebrow: "Lesson 4",
    duration: "45 min",
    state: "not-started",
    progress: 0,
    outcome: "Analyze how culture, language, practices, and identity shape the self.",
  },
  {
    id: psychologyLessonId,
    unitId: seedUnitId,
    title: "The Self in Psychology",
    eyebrow: "Lesson 5",
    duration: "45 min",
    state: "not-started",
    progress: 0,
    outcome: "Compare psychological theories of self-concept, motivation, personality, development, and behavior.",
  },
  {
    id: westernEasternLessonId,
    unitId: seedUnitId,
    title: "Western and Eastern Views of the Self",
    eyebrow: "Lesson 6",
    duration: "45 min",
    state: "not-started",
    progress: 0,
    outcome: "Compare independent and interdependent views of the self across selected Western and Eastern traditions.",
  },
  {
    id: ethicsLessonId,
    unitId: ethicsUnitId,
    title: "Moral and Non-Moral Standards",
    eyebrow: "Lesson 1",
    duration: "40 min",
    state: "not-started",
    progress: 0,
    outcome: "Distinguish moral standards from other rules and make a careful ethical judgment.",
  },
  {
    id: moralDilemmasLessonId,
    unitId: ethicsUnitId,
    title: "Moral Dilemmas and Ethical Problems",
    eyebrow: "Lesson 2",
    duration: "45 min",
    state: "not-started",
    progress: 0,
    outcome: "Distinguish genuine moral dilemmas from ordinary ethical problems and justify a responsible response under conflict.",
  },
  {
    id: freedomLessonId,
    unitId: ethicsUnitId,
    title: "Freedom, Responsibility, Reason, and Impartiality",
    eyebrow: "Lesson 3",
    duration: "45 min",
    state: "not-started",
    progress: 0,
    outcome: "Use freedom, responsibility, reason, and impartiality to justify a transparent and fair moral judgment.",
  },
  {
    id: cultureMoralBehaviorLessonId,
    unitId: moralAgentUnitId,
    title: "Culture and Moral Behavior",
    eyebrow: "Lesson 1",
    duration: "45 min",
    state: "not-started",
    progress: 0,
    outcome: "Explain how culture shapes moral learning and behavior while distinguishing cultural context from uncritical moral relativism.",
  },
  {
    id: communicationLessonId,
    unitId: communicationUnitId,
    title: "Communication Processes and Elements",
    eyebrow: "Lesson 1",
    duration: "45 min",
    state: "not-started",
    progress: 0,
    outcome: "Trace how messages are created, interpreted, and repaired across audiences and channels.",
  },
  {
    id: principlesEthicsLessonId,
    unitId: communicationUnitId,
    title: "Principles and Ethics of Communication",
    eyebrow: "Lesson 2",
    duration: "45 min",
    state: "not-started",
    progress: 0,
    outcome: "Use truthfulness, respect, fairness, privacy, and accountability to judge and revise communication choices.",
  },
  {
    id: verbalNonVerbalMultimodalLessonId,
    unitId: communicationUnitId,
    title: "Verbal, Non-Verbal, and Multimodal Communication",
    eyebrow: "Lesson 3",
    duration: "45 min",
    state: "not-started",
    progress: 0,
    outcome: "Compare words, embodied cues, and combined modes, then design a clear and accessible message.",
  },
  {
    id: communicationGlobalizationLessonId,
    unitId: languageCultureAudienceUnitId,
    title: "Communication and Globalization",
    eyebrow: "Lesson 1",
    duration: "45 min",
    state: "not-started",
    progress: 0,
    outcome: "Analyze how global connections change language, audiences, access, and responsibility, then design a culturally responsive message.",
  },
  {
    id: stsLessonId,
    unitId: stsUnitId,
    title: "What Are Science, Technology, and Society?",
    eyebrow: "Lesson 1",
    duration: "40 min",
    state: "not-started",
    progress: 0,
    outcome: "Build an STS lens for seeing how evidence, design, and social choices shape one another.",
  },
  {
    id: historicalAntecedentsLessonId,
    unitId: stsUnitId,
    title: "Historical Antecedents of Science and Technology",
    eyebrow: "Lesson 2",
    duration: "45 min",
    state: "not-started",
    progress: 0,
    outcome: "Trace how earlier knowledge, tools, institutions, and social choices shaped later science and technology.",
  },
];

type PracticeSelection = {
  scope: PracticeScope;
  courseId: string;
  unitId: string;
  lessonId: string;
};

function unitsForCourse(courseId: string) {
  return units.filter((unit) => unit.subjectId === courseId);
}

function lessonsForUnit(unitId: string) {
  return lessons.filter((lesson) => lesson.unitId === unitId);
}

function normalizePracticeSelection(
  scope: PracticeScope,
  courseId = subjects[0].id,
  unitId?: string,
  lessonId?: string,
): PracticeSelection {
  const course = subjects.find((item) => item.id === courseId) ?? subjects[0];
  const courseUnits = unitsForCourse(course.id);
  const unit = courseUnits.find((item) => item.id === unitId) ?? courseUnits[0] ?? units[0];
  const unitLessons = lessonsForUnit(unit.id);
  const lesson = unitLessons.find((item) => item.id === lessonId) ?? unitLessons[0] ?? lessons[0];
  return { scope, courseId: course.id, unitId: unit.id, lessonId: lesson.id };
}

function practiceSelectionFromSearch(search: string): PracticeSelection {
  const params = new URLSearchParams(search);
  const requestedScope = params.get("scope");
  const scope: PracticeScope =
    requestedScope === "course" || requestedScope === "unit" || requestedScope === "lesson"
      ? requestedScope
      : "lesson";
  return normalizePracticeSelection(
    scope,
    params.get("course") ?? undefined,
    params.get("unit") ?? undefined,
    params.get("lesson") ?? undefined,
  );
}

function practiceSelectionPath(selection: PracticeSelection) {
  const params = new URLSearchParams({
    scope: selection.scope,
    course: selection.courseId,
    unit: selection.unitId,
    lesson: selection.lessonId,
  });
  return `/practice?${params.toString()}`;
}

const loopSteps = [
  { label: "Learn", text: "Build a small, useful mental model.", icon: BookOpen },
  { label: "Recall", text: "Pull it back from memory, gently.", icon: RotateCcw },
  { label: "Reflect", text: "Notice what needs another pass.", icon: Sparkles },
  { label: "Continue", text: "Keep the next action close.", icon: ArrowRight },
];

function getStoredFlag(key: string) {
  return window.localStorage.getItem(key) === "true";
}

function setStoredFlag(key: string, value: boolean) {
  window.localStorage.setItem(key, String(value));
}

function readStored<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStored<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

type CompletionScope = "lesson" | "unit" | "course";

type CompletionState = {
  lessons: Record<string, string>;
  units: Record<string, string>;
  courses: Record<string, string>;
};

type ReceiptMilestone = {
  scope: CompletionScope;
  id: string;
  contentIdentifier: string;
  achievementType: `${CompletionScope}_completed`;
};

const COMPLETION_STATE_KEY = "aralivo-completions-v1";
const completionListeners = new Set<() => void>();

function getCompletionState(): CompletionState {
  const stored = readStored<Partial<CompletionState>>(COMPLETION_STATE_KEY, {});
  return {
    lessons: stored.lessons ?? {},
    units: stored.units ?? {},
    courses: stored.courses ?? {},
  };
}

function useCompletionState() {
  const [state, setState] = useState<CompletionState>(() => getCompletionState());
  useEffect(() => {
    const listener = () => setState(getCompletionState());
    completionListeners.add(listener);
    return () => {
      completionListeners.delete(listener);
    };
  }, []);
  return state;
}

function persistCompletionState(state: CompletionState) {
  writeStored(COMPLETION_STATE_KEY, state);
  completionListeners.forEach((listener) => listener());
}

function milestoneFor(scope: CompletionScope, id: string): ReceiptMilestone {
  return {
    scope,
    id,
    contentIdentifier: `${scope}:${id}`,
    achievementType: `${scope}_completed`,
  };
}

function completedMilestones(state: CompletionState): ReceiptMilestone[] {
  return [
    ...Object.keys(state.courses).map((id) => milestoneFor("course", id)),
    ...Object.keys(state.units).map((id) => milestoneFor("unit", id)),
    ...Object.keys(state.lessons).map((id) => milestoneFor("lesson", id)),
  ];
}

function markLessonCompleted(lessonId: string): ReceiptMilestone[] {
  const lesson = lessons.find((item) => item.id === lessonId);
  if (!lesson) return [];
  const state = getCompletionState();
  const next = {
    lessons: { ...state.lessons },
    units: { ...state.units },
    courses: { ...state.courses },
  };
  const completedAt = new Date().toISOString();
  const milestones: ReceiptMilestone[] = [];

  if (!next.lessons[lesson.id]) {
    next.lessons[lesson.id] = completedAt;
    milestones.push(milestoneFor("lesson", lesson.id));
  }

  const unit = units.find((item) => item.id === lesson.unitId);
  if (!unit) return milestones;
  const unitLessons = lessonsForUnit(unit.id);
  if (unitLessons.length > 0 && unitLessons.every((item) => next.lessons[item.id]) && !next.units[unit.id]) {
    next.units[unit.id] = completedAt;
    milestones.push(milestoneFor("unit", unit.id));
  }

  const courseUnits = unitsForCourse(unit.subjectId);
  if (courseUnits.length > 0 && courseUnits.every((item) => next.units[item.id]) && !next.courses[unit.subjectId]) {
    next.courses[unit.subjectId] = completedAt;
    milestones.push(milestoneFor("course", unit.subjectId));
  }

  if (milestones.length > 0) persistCompletionState(next);
  return milestones;
}

function markScopedMilestoneCompleted(scope: CompletionScope, id: string): ReceiptMilestone[] {
  if (scope === "lesson") return markLessonCompleted(id);
  const state = getCompletionState();
  const next = {
    lessons: { ...state.lessons },
    units: { ...state.units },
    courses: { ...state.courses },
  };
  const bucket = scope === "unit" ? next.units : next.courses;
  if (bucket[id]) return [];
  bucket[id] = new Date().toISOString();
  const milestones = [milestoneFor(scope, id)];
  if (scope === "unit") {
    const unit = units.find((item) => item.id === id);
    const courseUnits = unit ? unitsForCourse(unit.subjectId) : [];
    if (unit && courseUnits.length > 0 && courseUnits.every((item) => next.units[item.id]) && !next.courses[unit.subjectId]) {
      next.courses[unit.subjectId] = bucket[id];
      milestones.push(milestoneFor("course", unit.subjectId));
    }
  }
  persistCompletionState(next);
  return milestones;
}

async function issueLearningReceipt(milestone: ReceiptMilestone) {
  const idempotencyKey = `completion-${milestone.scope}-${milestone.id}-v2`;
  return apiRequest<{ receipt: ReceiptRecord; payload_hash: string }>("/api/v1/receipts/issue", {
    method: "POST",
    headers: { "Idempotency-Key": idempotencyKey },
    body: JSON.stringify({
      scope: milestone.scope,
      content_identifier: milestone.contentIdentifier,
      achievement_type: milestone.achievementType,
      content_version: "catalog-v1",
      idempotency_key: idempotencyKey,
    }),
  });
}

function renderInlineLessonText(text: string, keyPrefix: string) {
  const tokens = text.split(/(!\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).filter(Boolean);
  return tokens.map((token, index) => {
    const key = `${keyPrefix}-${index}`;
    const image = token.match(/^!\[([^\]]+)\]\(([^)]+)\)$/);
    if (image) {
      return <img key={key} src={image[2]} alt={image[1]} loading="lazy" />;
    }
    const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      return (
        <a key={key} href={link[2]} target="_blank" rel="noreferrer">
          {link[1]}
        </a>
      );
    }
    if (token.startsWith("**") && token.endsWith("**")) {
      return <strong key={key}>{token.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={key}>{token}</React.Fragment>;
  });
}

function LessonMarkdownContent({ markdown }: { markdown: string }) {
  const body = markdown.split("\n---\n").slice(1).join("\n---\n");
  const lines = body.split("\n");
  const blocks: Array<
    | { type: "line"; line: string; index: number }
    | { type: "unordered" | "ordered"; items: Array<{ text: string; index: number }> }
  > = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed === "---") return;
    const bullet = trimmed.match(/^[-*]\s+(.+)$/);
    const numbered = trimmed.match(/^\d+[.)]\s+(.+)$/);
    if (bullet || numbered) {
      const type = bullet ? "unordered" : "ordered";
      const previous = blocks[blocks.length - 1];
      if (previous?.type === type) {
        previous.items.push({ text: (bullet ?? numbered)![1], index });
      } else {
        blocks.push({ type, items: [{ text: (bullet ?? numbered)![1], index }] });
      }
      return;
    }
    blocks.push({ type: "line", line: trimmed, index });
  });

  return (
    <div className="lesson-markdown">
      {blocks.map((block) => {
        if ("items" in block) {
          const List = block.type === "unordered" ? "ul" : "ol";
          return (
            <List key={`${block.type}-${block.items[0].index}`}>
              {block.items.map((item) => (
                <li key={`${block.type}-item-${item.index}`}>{renderInlineLessonText(item.text, `${block.type}-item-${item.index}`)}</li>
              ))}
            </List>
          );
        }

        const heading = block.line.match(/^(#{1,4})\s+(.+)$/);
        if (heading) {
          if (heading[1].length === 1) return null;
          const Heading = `h${Math.min(4, heading[1].length)}` as "h2" | "h3" | "h4";
          return <Heading key={`heading-${block.index}`}>{renderInlineLessonText(heading[2], `heading-${block.index}`)}</Heading>;
        }
        return <p key={`paragraph-${block.index}`}>{renderInlineLessonText(block.line, `paragraph-${block.index}`)}</p>;
      })}
    </div>
  );
}

type DemoProfile = {
  email: string;
  displayName: string;
  term: string;
  subject: string;
  verified: boolean;
  receiptsEnabled?: boolean;
};

type PlannerTask = {
  id: string;
  title: string;
  subject: string;
  minutes: number;
  due: string;
  done: boolean;
};

type FocusSession = {
  id: string;
  durationSeconds: number;
  startedAt: number | null;
  accumulatedSeconds: number;
  state: "active" | "paused" | "completed" | "ended";
};

type ReceiptRecord = {
  id: string;
  payload_hash: string;
  milestone_scope: CompletionScope;
  content_identifier: string;
  achievement_type: string;
  completed_at: string;
  issuer_public_key: string;
  content_version: string;
  network: "testnet" | "public";
  transaction_hash: string | null;
  verification_url: string | null;
  status: "pending" | "issued" | "failed";
  created_at: string;
};

type StellarConfig = {
  stellar_enabled: boolean;
  stellar_network: "testnet" | "public";
  stellar_anchor_mode: string;
};

const defaultProfile: DemoProfile = {
  email: "jamie@example.com",
  displayName: "Jamie Santos",
  term: "August–December 2026",
  subject: "Understanding the Self",
  verified: true,
  receiptsEnabled: false,
};

const defaultTasks: PlannerTask[] = [];

function getProfile() {
  return readStored<DemoProfile>("aralivo-profile", defaultProfile);
}

async function apiHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const session = supabase ? (await supabase.auth.getSession()).data.session : null;
  if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;
  return headers;
}

async function apiRequest<T>(path: string, init: RequestInit): Promise<T | null> {
  try {
    const requestHeaders = new Headers(await apiHeaders());
    if (init.headers)
      new Headers(init.headers).forEach((value, key) => requestHeaders.set(key, value));
    const response = await fetch(path, {
      ...init,
      headers: requestHeaders,
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

async function syncProfile(user: User, updates: Partial<DemoProfile> = {}) {
  if (!supabase) return getProfile();
  const { data } = await supabase
    .from("profiles")
    .select("id,email,display_name,term,primary_subject,verified,receipts_enabled")
    .eq("id", user.id)
    .maybeSingle();
  const profile: DemoProfile = {
    email: data?.email ?? user.email ?? defaultProfile.email,
    displayName: data?.display_name ?? user.user_metadata?.display_name ?? defaultProfile.displayName,
    term: data?.term ?? defaultProfile.term,
    subject: data?.primary_subject ?? defaultProfile.subject,
    verified: Boolean(data?.verified ?? user.email_confirmed_at),
    receiptsEnabled: Boolean(data?.receipts_enabled ?? defaultProfile.receiptsEnabled),
    ...updates,
  };
  writeStored("aralivo-profile", profile);
  return profile;
}

function getElapsedSeconds(session: FocusSession, now = Date.now()) {
  return Math.min(
    session.durationSeconds,
    session.accumulatedSeconds +
      (session.state === "active" && session.startedAt
        ? Math.floor((now - session.startedAt) / 1000)
        : 0),
  );
}

function App() {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<"loading" | "authenticated" | "unauthenticated">("loading");
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    if (!supabase) {
      setAuthState("unauthenticated");
      return;
    }
    let mounted = true;
    const syncAndRoute = async (sessionUser: User) => {
      const profile = await syncProfile(sessionUser);
      const path = window.location.pathname;
      const isAppSurface = [
        "/today",
        "/planner",
        "/subjects",
        "/practice",
        "/flashcards",
        "/focus",
        "/resources",
        "/receipts",
        "/settings",
      ].some((route) => path === route || path.startsWith(`${route}/`));
      if (mounted && isAppSurface && profile.subject !== "Understanding the Self") {
        navigate("/onboarding", { replace: true });
      }
    };
    void supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUser(data.session?.user ?? null);
      setAuthState(data.session ? "authenticated" : "unauthenticated");
      if (data.session) void syncAndRoute(data.session.user);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      setAuthState(session ? "authenticated" : "unauthenticated");
      if (session) window.setTimeout(() => void syncAndRoute(session.user), 0);
    });
    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [navigate]);

  const signOut = async () => {
    await supabase?.auth.signOut();
    window.localStorage.removeItem("aralivo-auth");
    window.localStorage.removeItem("aralivo-pending-signup");
    window.localStorage.removeItem("aralivo-pending-auth");
    setUser(null);
    setAuthState("unauthenticated");
  };

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/sign-in" element={<AuthPage mode="sign-in" />} />
      <Route path="/sign-up" element={<AuthPage mode="sign-up" />} />
      <Route path="/check-email" element={<CheckEmailPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route
        path="/forgot-password"
        element={<AuthPage mode="forgot" />}
      />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/auth/callback" element={<CallbackPage />} />
      <Route path="/auth/error" element={<AuthErrorPage />} />
      <Route path="/app" element={<Navigate to="/today" replace />} />
      <Route path="/app/:section" element={<AppNamespaceRedirect />} />
      <Route
        element={
          authState === "loading" ? (
            <AuthLoadingPage />
          ) : authState === "authenticated" ? (
            <AppShell onSignOut={signOut} />
          ) : (
            <Navigate to="/sign-in" replace />
          )
        }
      >
        <Route path="/today" element={<TodayPage />} />
        <Route path="/planner" element={<PlannerPage />} />
        <Route path="/subjects" element={<SubjectsPage />} />
        <Route path="/subjects/:subjectId" element={<SubjectPage />} />
        <Route path="/units/:unitId" element={<UnitPage />} />
        <Route path="/lessons/:lessonId" element={<LessonPage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/flashcards" element={<FlashcardsPage />} />
        <Route path="/focus" element={<FocusPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/receipts" element={<ReceiptsPage />} />
        <Route path="/settings" element={<SettingsPage onSignOut={signOut} />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function AuthLoadingPage() {
  return (
    <div className="auth-page">
      <div className="auth-card centered-card">
        <div className="loading-orb"><span /></div>
        <h1>Checking your session…</h1>
        <p>We’re securely opening your private workspace.</p>
      </div>
    </div>
  );
}

function AppNamespaceRedirect() {
  const { section } = useParams();
  const destination: Record<string, string> = {
    today: "/today",
    planner: "/planner",
    subjects: "/subjects",
    practice: "/practice",
    flashcards: "/flashcards",
    focus: "/focus",
    resources: "/resources",
    receipts: "/receipts",
    settings: "/settings",
  };
  return <Navigate to={destination[section ?? ""] ?? "/today"} replace />;
}

function NotFoundPage() {
  const destination = "/";
  return (
    <div className="auth-page">
      <div className="auth-card centered-card">
        <div className="danger-orb">
          <X size={27} />
        </div>
        <p className="eyebrow">Page not found</p>
        <h1>That path wandered off.</h1>
        <p>Try the workspace home, or return to the public landing page.</p>
        <Link className="button button-primary button-full" to={destination}>
          Continue <ArrowRight size={17} />
        </Link>
      </div>
    </div>
  );
}

function Landing() {
  const [active, setActive] = useState(0);
  const ActiveIcon = loopSteps[active].icon;
  return (
    <div className="marketing-page">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="marketing-header">
        <Link className="brand" to="/" aria-label="Aralivo home">
          <span className="brand-mark">a</span>
          <span>aralivo</span>
        </Link>
        <nav className="marketing-nav" aria-label="Public navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#privacy">Privacy first</a>
          <Link to="/sign-in">Sign in</Link>
          <Link className="button button-small" to="/sign-up">
            Create account <ArrowUpRight size={15} />
          </Link>
        </nav>
      </header>
      <main id="main-content">
        <section className="hero container">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-dot" />A quieter way to keep learning
            </p>
            <h1>
              Keep the next useful thing <em>close.</em>
            </h1>
            <p className="hero-lede">
              Aralivo is a private learning workspace for college students who want a steady place
              to learn, practice, and come back to.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" to="/sign-up">
                Start for free <ArrowRight size={17} />
              </Link>
              <a className="text-link" href="#how-it-works">
                See the study loop <ChevronDown size={16} />
              </a>
            </div>
            <div className="hero-proof">
              <span>
                <LockKeyhole size={16} /> Private by default
              </span>
              <span>
                <Leaf size={16} /> Free-first, always
              </span>
            </div>
          </div>
          <div className="hero-art" aria-label="Illustration of a study loop" role="img">
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <div className="art-pebble">
              <span>today</span>
              <strong>
                One good
                <br />
                next step.
              </strong>
              <small>Your first course · Content pending</small>
              <div className="art-progress">
                <span />
              </div>
            </div>
            <div className="art-note note-one">
              <Sparkles size={15} /> recall
            </div>
            <div className="art-note note-two">
              <Target size={15} /> focus
            </div>
            <div className="art-leaf">⌁</div>
          </div>
        </section>
        <section className="loop-section container" id="how-it-works">
          <div className="section-heading">
            <div>
              <p className="eyebrow">A small loop that compounds</p>
              <h2>Learning has a rhythm.</h2>
            </div>
            <p>
              Keep the parts that matter close together: understanding, retrieval, and a next action
              that feels possible.
            </p>
          </div>
          <div className="loop-grid">
            <div className="loop-tabs" role="tablist" aria-label="Study loop steps">
              {loopSteps.map((step, index) => (
                <button
                  key={step.label}
                  className={active === index ? "loop-tab active" : "loop-tab"}
                  onClick={() => setActive(index)}
                  role="tab"
                  aria-selected={active === index}
                >
                  <span>0{index + 1}</span>
                  {step.label}
                </button>
              ))}
            </div>
            <div className="loop-preview">
              <div className="loop-preview-icon">
                <ActiveIcon size={24} />
              </div>
              <p className="eyebrow">Step 0{active + 1}</p>
              <h3>{loopSteps[active].label}</h3>
              <p>{loopSteps[active].text}</p>
              <div className="loop-line">
                <span style={{ width: `${(active + 1) * 25}%` }} />
              </div>
            </div>
          </div>
        </section>
        <section className="privacy-strip container" id="privacy">
          <div className="privacy-icon">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h2>Your learning stays yours.</h2>
            <p>
              Aralivo is designed around private progress, honest feedback, and useful practice. No
              public leaderboards. No selling your notes. No claims about grades.
            </p>
          </div>
          <Link className="text-link" to="/sign-up">
            Make a space <ArrowRight size={16} />
          </Link>
        </section>
      </main>
      <footer className="marketing-footer container">
        <span>© 2026 Aralivo</span>
        <span>Built for steady progress, not performance theater.</span>
      </footer>
    </div>
  );
}

type AuthMode = "sign-in" | "sign-up" | "forgot";
function AuthPage({ mode }: { mode: AuthMode }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const title =
    mode === "sign-in"
      ? "Welcome back."
      : mode === "sign-up"
        ? "Make room to learn."
        : "Reset your password.";
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.includes("@") || !email.includes(".")) {
      setError("Enter a valid email address.");
      return;
    }
    if (mode === "sign-up" && !name.trim()) {
      setError("Add a name so Aralivo knows how to greet you.");
      return;
    }
    if (mode !== "forgot" && password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }
    if (mode === "sign-up" && password !== confirmPassword) {
      setError("Passwords do not match. Re-enter the same password in both fields.");
      return;
    }
    if (!supabase) {
      setError("Authentication is not configured yet. Add the Supabase URL and public key to this deployment.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      if (mode === "forgot") {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${appUrl()}/reset-password`,
        });
        if (resetError) throw resetError;
        writeStored("aralivo-pending-auth", { action: "reset", email });
        navigate("/check-email");
      } else if (mode === "sign-up") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: name.trim() },
            emailRedirectTo: `${appUrl()}/auth/callback`,
          },
        });
        if (signUpError) throw signUpError;
        writeStored("aralivo-pending-signup", {
          email,
          displayName: name.trim(),
          term: defaultProfile.term,
          subject: defaultProfile.subject,
          verified: Boolean(data.session),
        } satisfies DemoProfile);
        if (data.session) navigate("/onboarding");
        else navigate("/check-email");
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        if (data.user) {
          const profile = await syncProfile(data.user);
          navigate(profile.subject === "Understanding the Self" ? "/today" : "/onboarding");
        }
      }
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "We couldn’t complete that request.");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="auth-page">
      <Link className="brand auth-brand" to="/">
        <span className="brand-mark">a</span>
        <span>aralivo</span>
      </Link>
      <div className="auth-card">
        <div className="auth-card-top">
          <p className="eyebrow">
            {mode === "sign-up" ? "Start with a private space" : "Your learning workspace"}
          </p>
          <h1>{title}</h1>
          <p>
            {mode === "forgot"
              ? "We’ll send a secure link if an account exists for this email."
              : "A calm place to pick up the thread."}
          </p>
        </div>
        {mode !== "forgot" && (
          <button
            className="button button-google"
            type="button"
            disabled={submitting || !supabase}
            onClick={async () => {
              if (!supabase) return;
              setError("");
              setSubmitting(true);
              if (mode === "sign-up") {
                writeStored("aralivo-pending-signup", {
                  email: email || defaultProfile.email,
                  displayName: name.trim() || defaultProfile.displayName,
                  term: defaultProfile.term,
                  subject: defaultProfile.subject,
                  verified: false,
                } satisfies DemoProfile);
              }
              const { error: oauthError } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: { redirectTo: `${appUrl()}/auth/callback` },
              });
              if (oauthError) {
                setError(oauthError.message);
                setSubmitting(false);
              }
            }}
          >
            <span className="google-g">G</span> {submitting ? "Opening Google…" : "Continue with Google"}
          </button>
        )}
        {mode !== "forgot" && (
          <div className="or-divider">
            <span>or continue with email</span>
          </div>
        )}
        <form onSubmit={submit} noValidate>
          {mode === "sign-up" && (
            <Field
              label="Your name"
              value={name}
              onChange={setName}
              placeholder="How should Aralivo greet you?"
              autoComplete="name"
              name="name"
              required
            />
          )}
          {
            <Field
              label="Email address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              autoComplete="email"
              name="email"
              required
              error={error && (!email.includes("@") || !email.includes(".")) ? error : ""}
            />
          }
          {mode !== "forgot" && (
            <Field
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="8 characters minimum"
              autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
              name="password"
              required
              showToggle
              error={error && email.includes("@") ? error : ""}
            />
          )}
          {mode === "sign-up" && (
            <>
              <ul className="password-requirements" aria-label="Password requirements">
                <li className={password.length >= 8 ? "met" : ""}>At least 8 characters</li>
                <li className={/[A-Z]/.test(password) ? "met" : ""}>One uppercase letter</li>
                <li className={/[0-9]/.test(password) ? "met" : ""}>One number</li>
              </ul>
              <Field
                label="Confirm password"
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="Repeat your password…"
                autoComplete="new-password"
                name="confirmPassword"
                required
                showToggle
                error={error && password !== confirmPassword ? error : ""}
              />
            </>
          )}
          <button className="button button-primary button-full" type="submit" disabled={submitting}>
            {mode === "sign-in"
              ? "Sign in"
              : mode === "sign-up"
                ? "Create my space"
                : "Send reset link"}
            <ArrowRight size={17} />
          </button>
        </form>
        {mode === "sign-in" && (
          <Link className="center-link" to="/forgot-password">
            Forgot your password?
          </Link>
        )}
        {!supabase && (
          <p className="field-error" role="alert">
            This deployment is waiting for its Supabase public configuration.
          </p>
        )}
        {mode === "sign-in" ? (
          <p className="auth-switch">
            New here? <Link to="/sign-up">Create an account</Link>
          </p>
        ) : mode === "sign-up" ? (
          <p className="auth-switch">
            Already have a space? <Link to="/sign-in">Sign in</Link>
          </p>
        ) : (
          <p className="auth-switch">
            <Link to="/sign-in">Back to sign in</Link>
          </p>
        )}
      </div>
      <p className="auth-legal">
        By continuing, you agree to Aralivo’s <a href="#terms">Terms</a> and{" "}
        <a href="#privacy">Privacy Notice</a>.
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
  name,
  required = false,
  showToggle = false,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  name?: string;
  required?: boolean;
  showToggle?: boolean;
  error?: string;
}) {
  const [visible, setVisible] = useState(false);
  const inputId = `field-${(name ?? label).toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  const errorId = `${inputId}-error`;
  return (
    <div className="field">
      <label htmlFor={inputId}>{label}</label>
      <span className="field-control">
        <input
          id={inputId}
          name={name}
          type={showToggle && visible ? "text" : type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
        />
        {showToggle && (
          <button
            className="password-toggle"
            type="button"
            aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
            onClick={() => setVisible((current) => !current)}
          >
            {visible ? "Hide" : "Show"}
          </button>
        )}
      </span>
      {error && (
        <small className="field-error" id={errorId} role="alert">
          {error}
        </small>
      )}
    </div>
  );
}

function CheckEmailPage() {
  const navigate = useNavigate();
  const [resent, setResent] = useState(false);
  const [error, setError] = useState("");
  const pendingSignup = readStored<DemoProfile | null>("aralivo-pending-signup", null);
  const pendingAuth = readStored<{ action: "reset"; email: string } | null>("aralivo-pending-auth", null);
  useEffect(() => {
    if (!pendingSignup && !pendingAuth) {
      navigate("/sign-up", { replace: true });
    }
  }, [navigate, pendingAuth, pendingSignup]);
  const resend = async () => {
    if (!supabase || !pendingSignup?.email) return;
    setError("");
    const { error: resendError } = await supabase.auth.resend({ type: "signup", email: pendingSignup.email });
    if (resendError) setError(resendError.message);
    else setResent(true);
  };
  return (
    <div className="auth-page">
      <Link className="brand auth-brand" to="/">
        <span className="brand-mark">a</span>
        <span>aralivo</span>
      </Link>
      <div className="auth-card centered-card">
        <div className="success-orb">
          <Mail size={27} />
        </div>
        <p className="eyebrow">One small step</p>
        <h1>Check your email.</h1>
        <p>
          {pendingAuth
            ? "We sent a secure password reset link to your inbox."
            : "We sent a secure verification link to your inbox. It expires soon, and you can request a new one if it gets lost."}
        </p>
        {pendingSignup && (
          <button className="button button-quiet button-full" onClick={() => void resend()} disabled={resent}>
            {resent ? "Verification email sent" : "Resend verification"}
          </button>
        )}
        {resent && (
          <p className="saved-message" role="status">
            A fresh verification link is on its way.
          </p>
        )}
        {error && <p className="field-error" role="alert">{error}</p>}
        {pendingAuth && (
          <Link className="button button-primary button-full" to="/sign-in">
            Back to sign in <ArrowRight size={17} />
          </Link>
        )}
        <Link className="center-link" to="/sign-up">
          Use a different email
        </Link>
      </div>
    </div>
  );
}
function VerifyEmailPage() {
  const navigate = useNavigate();
  const pending = readStored<DemoProfile | null>("aralivo-pending-signup", null);
  useEffect(() => {
    navigate("/auth/callback", { replace: true });
  }, [navigate]);
  return (
    <div className="auth-page">
      <Link className="brand auth-brand" to="/">
        <span className="brand-mark">a</span>
        <span>aralivo</span>
      </Link>
      <div className="auth-card centered-card">
        <div className="success-orb mint">
          <Check size={27} />
        </div>
        <p className="eyebrow">Email verified</p>
        <h1>You’re ready to begin.</h1>
        <p>
          Your space is private by default. Let’s choose what you’re learning and where to start.
        </p>
        <button
          className="button button-primary button-full"
          onClick={() => {
            writeStored("aralivo-pending-signup", { ...pending, verified: true });
            navigate("/onboarding");
          }}
          disabled={!pending}
        >
          Choose your first action <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}
function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [term, setTerm] = useState("August–December 2026");
  const [subject, setSubject] = useState("Understanding the Self");
  const [action, setAction] = useState("Explore my course");
  const [subjectError, setSubjectError] = useState("");
  const steps = [
    {
      title: "Choose a term",
      text: "Give this season of learning a name. You can change it later.",
      content: (
        <label className="field">
          <span>Term name</span>
          <input value={term} onChange={(event) => setTerm(event.target.value)} />
        </label>
      ),
    },
    {
      title: "Choose a first course",
      text: "Choose the course you will use to test generated Aralivo content.",
      content: (
        <>
          <label className="field">
            <span>First course</span>
            <select
              value={subject}
              onChange={(event) => {
                setSubject(event.target.value);
                setSubjectError("");
              }}
              aria-describedby="onboarding-course-note"
            >
              {subjects.map((course) => <option value={course.name} key={course.id}>{course.name}</option>)}
            </select>
          </label>
          <p className="muted-copy onboarding-fallback" id="onboarding-course-note">
            Understanding the Self is required for this setup so generated lessons can be tested against this account.
          </p>
          {subjectError && <p className="field-error" role="alert">{subjectError}</p>}
        </>
      ),
    },
    {
      title: "Choose your first action",
      text: "A clear first step makes returning easier.",
      content: (
        <div className="onboarding-actions">
          {["Explore my course", "Plan a focus session"].map((item) => (
            <button
              key={item}
              className={action === item ? "onboarding-action active" : "onboarding-action"}
              onClick={() => setAction(item)}
            >
              <span>
                {item === "Explore my course" ? (
                  <BookOpen size={17} />
                ) : (
                  <Focus size={17} />
                )}
              </span>
              {item}
              <ChevronRight size={16} />
            </button>
          ))}
        </div>
      ),
    },
  ];
  const finish = async () => {
    const pending = readStored<DemoProfile>("aralivo-pending-signup", defaultProfile);
    const session = supabase ? (await supabase.auth.getSession()).data.session : null;
    if (session?.user && supabase) {
      const profile = await syncProfile(session.user, { term, subject, verified: true });
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: session.user.id,
        email: session.user.email,
        display_name: profile.displayName,
        term,
        primary_subject: subject,
        verified: true,
      });
      if (profileError) {
        setSubjectError(profileError.message);
        return;
      }
    } else {
      writeStored("aralivo-profile", { ...pending, term, subject, verified: true });
    }
    window.localStorage.removeItem("aralivo-pending-signup");
    navigate("/today", { replace: true });
  };
  const continueOnboarding = () => {
    if (step === 1 && subject !== "Understanding the Self") {
      setSubjectError("Choose Understanding the Self to continue this setup.");
      return;
    }
    if (step < 2) setStep((value) => value + 1);
    else void finish();
  };
  return (
    <div className="auth-page onboarding-page">
      <Link className="brand auth-brand" to="/">
        <span className="brand-mark">a</span>
        <span>aralivo</span>
      </Link>
      <div className="auth-card onboarding-card">
        <div className="onboarding-progress">
          <span>Step {step + 1} of 3</span>
          <ProgressBar value={(step + 1) * 33.33} tone="mint" />
        </div>
        <div className="auth-card-top">
          <p className="eyebrow">Make it yours</p>
          <h1>{steps[step].title}</h1>
          <p>{steps[step].text}</p>
        </div>
        {steps[step].content}
        <div className="onboarding-footer">
          <button
            className="button button-quiet"
            onClick={() => setStep((value) => value - 1)}
            disabled={step === 0}
          >
            Back
          </button>
          <button
            className="button button-primary"
            onClick={continueOnboarding}
          >
            {step < 2 ? "Continue" : "Open Today"} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
function ResetPasswordPage() {
  const [saved, setSaved] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  return (
    <div className="auth-page">
      <Link className="brand auth-brand" to="/">
        <span className="brand-mark">a</span>
        <span>aralivo</span>
      </Link>
      <div className="auth-card">
        <div className="auth-card-top">
          <p className="eyebrow">New password</p>
          <h1>Choose a fresh start.</h1>
          <p>Use a password you don’t use anywhere else.</p>
        </div>
        {saved ? (
          <Notice
            tone="success"
            title="Password updated"
            text="Your old sessions have been signed out. You can sign in again now."
          />
        ) : (
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              if (password.length < 8) return setError("Use at least 8 characters for your password.");
              if (password !== confirmation) return setError("Passwords do not match.");
              if (!supabase) return setError("Authentication is not configured yet.");
              const { error: updateError } = await supabase.auth.updateUser({ password });
              if (updateError) setError(updateError.message);
              else {
                setSaved(true);
                window.setTimeout(() => navigate("/today", { replace: true }), 1000);
              }
            }}
          >
            <Field
              label="New password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="8 characters minimum"
            />
            <Field
              label="Confirm password"
              type="password"
              value={confirmation}
              onChange={setConfirmation}
              placeholder="Repeat your password"
            />
            {error && <p className="field-error" role="alert">{error}</p>}
            <button className="button button-primary button-full" type="submit">
              Update password <ArrowRight size={17} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
function CallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    let completed = false;
    let timeoutId: number | undefined;
    const finish = async (session: Session) => {
      if (!active || completed || !session) return;
      completed = true;
      if (timeoutId) window.clearTimeout(timeoutId);
      const profile = await syncProfile(session.user);
      const isNewSignup = Boolean(readStored<DemoProfile | null>("aralivo-pending-signup", null));
      if (active) {
        navigate(
          isNewSignup || profile.subject !== "Understanding the Self" ? "/onboarding" : "/today",
          { replace: true },
        );
      }
    };
    const complete = async () => {
      if (!supabase) {
        setError("Authentication is not configured yet.");
        return;
      }
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        if (active) setError(sessionError.message);
        return;
      }
      if (data.session) {
        await finish(data.session);
        return;
      }
      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if ((event === "SIGNED_IN" || event === "INITIAL_SESSION") && session) {
          authListener.subscription.unsubscribe();
          window.setTimeout(() => void finish(session), 0);
        }
      });
      timeoutId = window.setTimeout(() => {
        authListener.subscription.unsubscribe();
        if (active && !completed) setError("No active session was returned.");
      }, 12000);
    };
    void complete();
    return () => {
      active = false;
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [navigate]);
  return (
    <div className="auth-page">
      <div className="auth-card centered-card">
        <div className="loading-orb">
          <span />
        </div>
        <h1>Finishing sign in…</h1>
        <p>We’re bringing you back to your private workspace.</p>
        {error && <p className="field-error" role="alert">{error}</p>}
        <Link className="text-link" to="/today">
          Continue to Today <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
function AuthErrorPage() {
  return (
    <div className="auth-page">
      <div className="auth-card centered-card">
        <div className="danger-orb">
          <X size={27} />
        </div>
        <p className="eyebrow">Couldn’t complete sign in</p>
        <h1>Let’s try that again.</h1>
        <p>The provider didn’t return a valid sign-in. No account was changed.</p>
        <Link className="button button-primary button-full" to="/sign-in">
          Back to sign in <ArrowRight size={17} />
        </Link>
      </div>
    </div>
  );
}

function AppShell({ onSignOut }: { onSignOut: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [online, setOnline] = useState(() => navigator.onLine);
  const profile = getProfile();
  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  const nav = [
    { to: "/today", label: "Today", icon: Home },
    { to: "/planner", label: "Planner", icon: CalendarDays },
    { to: "/subjects", label: "Courses", icon: BookOpen },
    { to: "/practice", label: "Practice", icon: Target },
    { to: "/flashcards", label: "Flashcards", icon: RotateCcw },
    { to: "/focus", label: "Focus", icon: Focus },
    { to: "/resources", label: "Resources", icon: Search },
    { to: "/receipts", label: "Receipts", icon: ShieldCheck },
  ];
  return (
    <div className="app-shell">
      <a className="skip-link" href="#app-content">
        Skip to main content
      </a>
      <aside className={mobileOpen ? "app-sidebar mobile-open" : "app-sidebar"}>
        <div className="sidebar-head">
          <Link className="brand" to="/today" onClick={() => setMobileOpen(false)}>
            <span className="brand-mark">a</span>
            <span>aralivo</span>
          </Link>
          <button
            className="icon-button mobile-close"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          >
            <X size={18} />
          </button>
        </div>
        <div className="sidebar-label">Workspace</div>
        <nav className="app-nav" aria-label="Authenticated navigation">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => (isActive ? "app-nav-link active" : "app-nav-link")}
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-spacer" />
        <div className="sidebar-pebble">
          <span className="sidebar-pebble-icon">
            <Flame size={16} />
          </span>
          <div>
            <strong>4 day rhythm</strong>
            <small>Small steps count.</small>
          </div>
        </div>
        <NavLink
          to="/settings"
          className="app-nav-link settings-link"
          onClick={() => setMobileOpen(false)}
        >
          <SettingsIcon size={18} strokeWidth={1.8} />
          <span>Settings</span>
        </NavLink>
        <button
          className="profile-mini"
          onClick={onSignOut}
          aria-label={`${profile.displayName} Sign out`}
        >
          <span className="avatar">JS</span>
          <span>
            <strong>{profile.displayName}</strong>
            <small>Sign out</small>
          </span>
          <LogOut size={15} />
        </button>
      </aside>
      <div className="app-main">
        <header className="app-topbar">
          <button
            className="icon-button mobile-menu"
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={21} />
          </button>
          <div className="breadcrumbs">
            <span>Workspace</span>
            <ChevronRight size={14} />
            <strong>
              <CurrentPage />
            </strong>
          </div>
          <div className="topbar-actions">
            <span className={online ? "sync-pill" : "sync-pill sync-pill-offline"} role="status">
              <span className="sync-dot" /> {online ? "Online" : "Offline"}
            </span>
            <button className="icon-button" aria-label="Help">
              <HelpCircle size={19} />
            </button>
            <button className="avatar avatar-top" aria-label="Open profile menu">
              JS
            </button>
          </div>
        </header>
        <main className="app-content" id="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function CurrentPage() {
  const location = useLocation();
  const labels: Record<string, string> = {
    "/today": "Today",
    "/planner": "Planner",
    "/subjects": "Courses",
    "/practice": "Practice",
    "/flashcards": "Flashcards",
    "/focus": "Focus",
    "/resources": "Resources",
    "/receipts": "Receipts",
    "/settings": "Settings",
  };
  return <>{labels[location.pathname] ?? "Learning"}</>;
}

function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      {action && <div className="page-header-action">{action}</div>}
    </div>
  );
}
function SectionTitle({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="section-title">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <div>
        <h2>{title}</h2>
        {action}
      </div>
    </div>
  );
}
function Notice({
  tone,
  title,
  text,
}: {
  tone: "success" | "info" | "warning";
  title: string;
  text: string;
}) {
  return (
    <div className={`notice notice-${tone}`}>
      <span className="notice-icon">
        {tone === "success" ? (
          <CheckCircle2 size={17} />
        ) : tone === "warning" ? (
          <CloudOff size={17} />
        ) : (
          <Sparkles size={17} />
        )}
      </span>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}
function ProgressBar({
  value,
  tone = "primary",
}: {
  value: number;
  tone?: "primary" | "mint" | "coral";
}) {
  return (
    <div className={`progress-track progress-${tone}`}>
      <span style={{ width: `${value}%` }} />
    </div>
  );
}
function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "mint" | "coral" | "yellow" | "violet";
}) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
}
function Card({
  children,
  className = "",
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article" | "section";
}) {
  const Tag = as;
  return <Tag className={`card ${className}`}>{children}</Tag>;
}

function TodayPage() {
  const navigate = useNavigate();
  const [online, setOnline] = useState(() => navigator.onLine);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Thursday, 7 August"
        title="Good morning, Jamie."
        description="A useful next step is waiting for you."
        action={
          <button className="button button-quiet" onClick={() => navigate("/focus")}>
            <Focus size={16} /> Start focus
          </button>
        }
      />
      <div className="offline-banner" hidden={online || dismissed} role="status">
        <span>
          <CloudOff size={15} /> You’re viewing a saved snapshot. Changes will sync when you’re back
          online.
        </span>
        <button aria-label="Dismiss offline notice" onClick={() => setDismissed(true)}>
          <X size={15} />
        </button>
      </div>
      <div className="today-grid">
        <Card className="study-pebble-card">
          <div className="pebble-top">
            <div>
              <p className="eyebrow">Your next useful action</p>
              <Pill tone="mint">Ready to learn</Pill>
            </div>
            <button className="icon-button" aria-label="More next action options">
              <MoreHorizontal size={20} />
            </button>
          </div>
          <h2>
            Start with a useful question
          </h2>
          <p>Begin with an introduction, compare philosophical perspectives, then study how society, culture, psychology, and tradition shape the self.</p>
          <div className="pebble-meta">
            <span>
              <BookOpen size={15} /> Understanding the Self
            </span>
            <span>
              <Target size={15} /> 6 lessons · 255 min
            </span>
          </div>
          <div className="pebble-actions">
            <button className="button button-dark" onClick={() => navigate("/subjects/understanding-self")}>
              Open course <ArrowRight size={17} />
            </button>
            <button className="button button-ghost" onClick={() => navigate("/focus")}>
              Focus on this
            </button>
          </div>
          <div className="pebble-scribble">⌁</div>
        </Card>
        <Card className="goal-card">
          <div className="goal-card-head">
            <div>
              <p className="eyebrow">Today’s goal</p>
              <h2>
                25 <span>of 40 min</span>
              </h2>
            </div>
            <div className="goal-ring" style={{ "--progress": "62%" } as React.CSSProperties}>
              <strong>62%</strong>
            </div>
          </div>
          <ProgressBar value={62} tone="mint" />
          <p className="muted-copy">One focused session can close the gap.</p>
          <button className="text-link" onClick={() => navigate("/focus")}>
            Start a 15 min session <ArrowRight size={15} />
          </button>
        </Card>
      </div>
      <div className="dashboard-columns">
        <div className="dashboard-main">
          <SectionTitle
            eyebrow="Keep your place"
            title="Your subjects"
            action={
              <Link className="text-link" to="/subjects">
                View all <ArrowRight size={15} />
              </Link>
            }
          />
          <div className="subject-grid">
            {subjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
          <SectionTitle eyebrow="A little momentum" title="Recent progress" />
          <Card className="recent-card">
            <div className="empty-inline">
              <BookOpen size={22} />
              <strong>Two lessons are ready.</strong>
              <p>Start with the introduction, then compare philosophical accounts of the self and identity.</p>
            </div>
          </Card>
        </div>
        <aside className="dashboard-aside">
          <Card className="xp-card">
            <div className="xp-card-top">
              <span className="xp-icon">
                <Zap size={18} />
              </span>
              <Pill tone="yellow">Level 4</Pill>
            </div>
            <h2>
              425 <span>XP</span>
            </h2>
            <p className="muted-copy">160 XP to the next level</p>
            <ProgressBar value={68} tone="primary" />
            <div className="xp-foot">
              <span>
                <Flame size={15} /> 4 day rhythm
              </span>
              <span>68%</span>
            </div>
          </Card>
          <Card className="due-card">
            <SectionTitle
              title="Due soon"
              action={
                <button className="icon-button" aria-label="More due items">
                  <MoreHorizontal size={18} />
                </button>
              }
            />
            <div className="empty-inline compact-empty">
              <CalendarDays size={22} />
              <strong>Nothing due yet.</strong>
              <p>Your new lesson and practice set will show up here as you work through them.</p>
            </div>
            <Link className="text-link" to="/planner">
              Open planner <ArrowRight size={15} />
            </Link>
          </Card>
          <Card className="receipt-mini">
            <div className="receipt-mini-icon">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="eyebrow">Learning receipts</p>
              <h3>Private proof, on your terms.</h3>
              <p className="muted-copy">Opt in when a milestone is worth keeping.</p>
              <Link className="text-link" to="/receipts">
                Explore receipts <ArrowRight size={15} />
              </Link>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function SubjectCard({ subject }: { subject: (typeof subjects)[number] }) {
  return (
    <Link className={`subject-card subject-${subject.color}`} to={`/subjects/${subject.id}`}>
      <div className="subject-card-top">
        <span className="subject-symbol">{subject.icon}</span>
        <span className="subject-code">{subject.code}</span>
      </div>
      <h3>{subject.name}</h3>
      <div className="subject-progress">
        <ProgressBar
          value={subject.progress}
          tone={subject.color === "mint" ? "mint" : subject.color === "coral" ? "coral" : "primary"}
        />
        <span>{subject.progress}%</span>
      </div>
      <p>Next · {subject.next}</p>
    </Link>
  );
}

function SubjectsPage() {
  const [search, setSearch] = useState("");
  const filtered = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Your learning map"
        title="Courses"
        description="Follow a clear course path, or choose the next right-sized lesson."
        action={
          <button className="button button-primary">
            <Plus size={17} /> Add course
          </button>
        }
      />
      <div className="toolbar">
        <label className="search-field">
          <Search size={17} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search courses"
            aria-label="Search courses"
          />
        </label>
        <button className="button button-quiet">
          <MoreHorizontal size={17} /> Sort
        </button>
      </div>
      <div className="subject-grid subject-grid-large">
        {filtered.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
      </div>
      {filtered.length === 0 && (
        <Card className="empty-state">
          <div className="empty-icon">
            <Search size={23} />
          </div>
          <h2>No courses found</h2>
          <p>Try another search, or add your course manually.</p>
          <button className="button button-primary">
            <Plus size={16} /> Add course
          </button>
        </Card>
      )}
      <Card className="catalog-callout">
        <div className="catalog-icon">
          <BookOpen size={20} />
        </div>
        <div>
          <p className="eyebrow">Build your own path</p>
          <h2>Can’t find a course in the catalog?</h2>
          <p className="muted-copy">
            Create a private course with your own units and learning actions. Nothing needs to
            match a school system.
          </p>
        </div>
        <button className="button button-quiet">
          Create manually <ArrowRight size={16} />
        </button>
      </Card>
    </div>
  );
}

function ContentUnavailablePage({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-stack content-empty-page">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <Card className="empty-state content-empty-card">
        <div className="empty-icon"><BookOpen size={23} /></div>
        <Pill tone="violet">Not published yet</Pill>
        <h2>There is nothing to open here yet</h2>
        <p>Generate and validate the content first. This page will become available when the published files are ready.</p>
        <div className="summary-actions">
          <Link className="button button-primary" to="/subjects">Browse courses <ArrowRight size={16} /></Link>
          <Link className="button button-quiet" to="/today">Back to Today</Link>
        </div>
      </Card>
    </div>
  );
}

function SubjectPage() {
  const { subjectId } = useParams();
  const subject = subjects.find((item) => item.id === subjectId) ?? subjects[0];
  const subjectUnits = units.filter((unit) => unit.subjectId === subject.id);
  const completionState = useCompletionState();
  const courseComplete = subjectUnits.length > 0 && subjectUnits.every((unit) => completionState.units[unit.id]);
  const courseProgress = courseComplete ? 100 : subject.progress;
  return (
    <div className="page-stack">
      <nav className="content-breadcrumb" aria-label="Course breadcrumb">
        <Link to="/subjects">Courses</Link>
        <ChevronRight size={14} aria-hidden="true" />
        <span aria-current="page">{subject.name}</span>
      </nav>
      <div className={`subject-hero subject-${subject.color}`}>
        <div className="subject-hero-symbol">{subject.icon}</div>
        <div>
          <p className="eyebrow">{subject.code} · {subjectUnits.length} units published</p>
          <h1>{subject.name}</h1>
          <p>Understand the ideas, practice the moves, keep what you learn.</p>
        </div>
        <div className="subject-hero-progress">
          <strong>{courseProgress}%</strong>
          <span>overall progress</span>
          <ProgressBar
            value={courseProgress}
            tone={
              subject.color === "mint" ? "mint" : subject.color === "coral" ? "coral" : "primary"
            }
          />
        </div>
      </div>
      <Notice
        tone={courseComplete ? "success" : "info"}
        title={courseComplete ? "Course complete" : "Course receipt path"}
        text={
          courseComplete
            ? "Every unit is complete. Your course milestone is ready in Learning receipts when receipts are enabled."
            : "Complete every lesson in each unit and Aralivo will complete the unit and course milestones for you."
        }
      />
      <div className="subject-layout">
        <main>
          <SectionTitle
            eyebrow="The learning path"
            title="Units"
            action={<Pill tone="mint">{subjectUnits.reduce((total, unit) => total + unit.lessons, 0)} lessons ready</Pill>}
          />
          {subjectUnits.length > 0 ? (
            <div className="unit-list">
              {subjectUnits.map((unit, index) => (
                <UnitRow key={unit.id} unit={unit} index={index} />
              ))}
            </div>
          ) : (
            <Card className="empty-state content-empty-card">
              <div className="empty-icon"><BookOpen size={23} /></div>
              <h2>Units are not published yet</h2>
              <p>Generate and validate the course content before learners begin this path.</p>
            </Card>
          )}
        </main>
        <aside>
          <Card className="next-side-card">
            <p className="eyebrow">Course status</p>
            <h2>{subject.next}</h2>
            <p className="muted-copy">Start with one focused lesson, then use practice to turn the ideas into your own reasoning.</p>
            <Link className="button button-dark button-full" to="/subjects">
              Back to courses <ArrowRight size={16} />
            </Link>
          </Card>
          <Card className="outcome-card">
            <p className="eyebrow">Your starting path</p>
            <h3>Learn, then practice</h3>
            <ul className="check-list">
              <li>
                <CheckCircle2 size={16} /> read the introduction
              </li>
              <li>
                <CheckCircle2 size={16} /> try the 15-item practice set
              </li>
              <li>
                <CheckCircle2 size={16} /> save a private reflection
              </li>
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function UnitRow({ unit, index }: { unit: (typeof units)[number]; index: number }) {
  const completionState = useCompletionState();
  const complete = unit.state === "complete" || Boolean(completionState.units[unit.id]);
  const locked = unit.state === "locked";
  return (
    <Link
      className={`unit-row ${locked ? "is-locked" : ""}`}
      to={locked ? "#" : `/units/${unit.id}`}
      onClick={(event) => locked && event.preventDefault()}
    >
      <div className={`unit-number ${complete ? "complete" : unit.state}`}>
        {complete ? (
          <Check size={16} />
        ) : locked ? (
          <LockKeyhole size={15} />
        ) : (
          `0${index + 1}`
        )}
      </div>
      <div className="unit-content">
        <div className="unit-row-top">
          <span className="eyebrow">{unit.label}</span>
          <Pill
            tone={
              complete ? "mint" : unit.state === "locked" ? "neutral" : "violet"
            }
          >
            {complete
              ? "Complete"
              : unit.state === "locked"
                ? "Locked"
                : "In progress"}
          </Pill>
        </div>
        <h3>{unit.title}</h3>
        <p>
          {unit.lessons} lessons · {unit.duration}
        </p>
        <ProgressBar value={complete ? 100 : unit.progress} tone={complete ? "mint" : "primary"} />
      </div>
      <ChevronRight className="unit-arrow" size={20} />
    </Link>
  );
}

function UnitPage() {
  const { unitId } = useParams();
  const unit = units.find((item) => item.id === unitId) ?? units[0];
  const unitLessons = lessons.filter((lesson) => lesson.unitId === unit.id);
  const course = subjects.find((item) => item.id === unit.subjectId) ?? subjects[0];
  const unitSelection = normalizePracticeSelection("unit", course.id, unit.id);
  const isEthicsUnit = unit.id === ethicsUnitId;
  const isMoralAgentUnit = unit.id === moralAgentUnitId;
  const isCommunicationUnit = unit.id === communicationUnitId;
  const isStsUnit = unit.id === stsUnitId;
  const hasNoPrerequisitesUnit = isEthicsUnit || isMoralAgentUnit || isCommunicationUnit || isStsUnit;
  const completionState = useCompletionState();
  const unitComplete = unit.state === "complete" || Boolean(completionState.units[unit.id]);
  const unitProgress = unitComplete ? 100 : unit.progress;
  return (
    <div className="page-stack">
      <nav className="content-breadcrumb" aria-label="Unit breadcrumb">
        <Link to="/subjects">Courses</Link>
        <ChevronRight size={14} aria-hidden="true" />
        <Link to={`/subjects/${course.id}`}>{course.name}</Link>
        <ChevronRight size={14} aria-hidden="true" />
        <span aria-current="page">{unit.title}</span>
      </nav>
      <PageHeader
        eyebrow={`${course.name} · ${unit.label}`}
        title={unit.title}
        description={
          isEthicsUnit
            ? "A short path from familiar rules to a more careful account of moral judgment."
            : isMoralAgentUnit
              ? "A focused path through the cultural settings, pressures, and choices that shape moral agency."
            : isCommunicationUnit
              ? "A practical path from message elements to clearer, more respectful exchanges."
              : isStsUnit
                ? "A practical introduction to the relationships among evidence, design, context, and social change."
              : "A short path from a useful question to a more careful account of yourself."
        }
        action={
          <Link className="button button-primary" to={practiceSelectionPath(unitSelection)}>
            <Target size={16} /> Review unit · 30 items
          </Link>
        }
      />
      <Notice
        tone={unitComplete ? "success" : "info"}
        title={unitComplete ? "Unit complete" : "Complete the lessons to finish this unit"}
        text={
          unitComplete
            ? "The unit milestone has been recorded. View Learning receipts to verify it."
            : `Finish all ${unitLessons.length} lessons in this unit and Aralivo will record the unit milestone automatically.`
        }
      />
      <div className="unit-overview-grid">
        <Card>
          <p className="eyebrow">Learning outcomes</p>
          <ul className="check-list">
            {isEthicsUnit ? (
              <>
                <li><CheckCircle2 size={16} /> distinguish moral and non-moral standards</li>
                <li><CheckCircle2 size={16} /> compare legal, technical, and etiquette rules</li>
                <li><CheckCircle2 size={16} /> make a careful, revisable ethical judgment</li>
              </>
            ) : isMoralAgentUnit ? (
              <>
                <li><CheckCircle2 size={16} /> explain how culture shapes moral learning</li>
                <li><CheckCircle2 size={16} /> distinguish context from uncritical relativism</li>
                <li><CheckCircle2 size={16} /> judge without stereotyping or erasing agency</li>
              </>
            ) : isCommunicationUnit ? (
              <>
                <li><CheckCircle2 size={16} /> identify the elements in a communication event</li>
                <li><CheckCircle2 size={16} /> apply truthfulness, respect, fairness, and privacy</li>
                <li><CheckCircle2 size={16} /> design an audience-aware verbal, non-verbal, and multimodal message</li>
              </>
            ) : isStsUnit ? (
              <>
                <li><CheckCircle2 size={16} /> distinguish science, technology, society, and context</li>
                <li><CheckCircle2 size={16} /> trace reciprocal relationships and trade-offs</li>
                <li><CheckCircle2 size={16} /> evaluate a community decision with an STS lens</li>
              </>
            ) : (
              <>
                <li><CheckCircle2 size={16} /> identify questions about the self</li>
                <li><CheckCircle2 size={16} /> compare six useful perspectives</li>
                <li><CheckCircle2 size={16} /> state a careful next question</li>
              </>
            )}
          </ul>
        </Card>
        <Card>
          <p className="eyebrow">Unit progress</p>
          <div className="big-stat">
            {unitProgress}
            <span>%</span>
          </div>
          <ProgressBar value={unitProgress} tone="mint" />
          <p className="muted-copy">
            {unitLessons.filter((l) => l.state !== "not-started").length} of {unitLessons.length}{" "}
            lessons touched
          </p>
        </Card>
      </div>
      <SectionTitle eyebrow="The path" title="Lessons" />
      <div className="lesson-list">
        {unitLessons.map((lesson, index) => (
          <LessonRow key={lesson.id} lesson={lesson} index={index} />
        ))}
      </div>
      <Notice
        tone="info"
        title="Prerequisite note"
        text={
          hasNoPrerequisitesUnit
            ? isMoralAgentUnit
              ? "There are no prerequisites. Bring one familiar or unfamiliar practice and ask what it means, who benefits, who bears the burden, and what reasons support it."
              : isStsUnit
              ? "Lesson 1 is a helpful companion, but there are no enforced prerequisites. Bring one ordinary technology or public system and ask what evidence, design choices, and social conditions shape it."
              : "There are no prerequisites. Bring one ordinary situation to the lesson and ask what the people involved needed to understand."
            : "You’ll get more from this unit if you can describe what makes a question observable. Revisit Operationalize the idea if you want a quick refresher."
        }
      />
    </div>
  );
}
function LessonRow({ lesson, index }: { lesson: (typeof lessons)[number]; index: number }) {
  const stateLabel =
    lesson.state === "in-progress"
      ? "In progress"
      : lesson.state === "practiced"
        ? "Practiced"
        : "Not started";
  return (
    <Link className="lesson-row" to={`/lessons/${lesson.id}`}>
      <div className="lesson-index">
        {lesson.state === "practiced" ? <CheckCircle2 size={19} /> : <span>0{index + 1}</span>}
      </div>
      <div className="lesson-row-content">
        <div className="lesson-row-top">
          <span className="eyebrow">{lesson.eyebrow}</span>
          <Pill
            tone={
              lesson.state === "practiced"
                ? "mint"
                : lesson.state === "in-progress"
                  ? "violet"
                  : "neutral"
            }
          >
            {stateLabel}
          </Pill>
        </div>
        <h3>{lesson.title}</h3>
        <p>{lesson.outcome}</p>
        <span className="lesson-duration">
          <Clock3 size={14} /> {lesson.duration}
        </span>
        {lesson.progress > 0 && <ProgressBar value={lesson.progress} tone="primary" />}
      </div>
      <ChevronRight size={20} />
    </Link>
  );
}

function LessonPage() {
  const { lessonId: routeLessonId } = useParams();
  return <SeedLessonPage lessonId={routeLessonId ?? seedLessonId} />;
  /* eslint-disable react-hooks/rules-of-hooks -- legacy route implementation retained below for future generated content. */
  /* istanbul ignore next -- retained route contract for generated lesson content. */
  const { lessonId } = useParams();
  const lesson = lessons.find((item) => item.id === lessonId) ?? lessons[0];
  const unit = units.find((item) => item.id === lesson.unitId) ?? units[1];
  const course = subjects.find((item) => item.id === unit.subjectId) ?? subjects[0];
  const lessonSelection = normalizePracticeSelection("lesson", course.id, unit.id, lesson.id);
  const noteKey = `aralivo-notes-${getProfile().email}`;
  const [note, setNote] = useState(() => window.localStorage.getItem(noteKey) ?? "");
  const [saved, setSaved] = useState(false);
  const [reported, setReported] = useState(false);
  const [completed, setCompleted] = useState(lesson.state === "practiced");
  const saveNote = () => {
    window.localStorage.setItem(noteKey, note);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };
  const clearNote = () => {
    window.localStorage.removeItem(noteKey);
    setNote("");
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };
  return (
    <div className="lesson-page page-stack">
      <nav className="content-breadcrumb" aria-label="Lesson breadcrumb">
        <Link to="/subjects">Courses</Link>
        <ChevronRight size={14} />
        <Link to={`/subjects/${course.id}`}>{course.name}</Link>
        <ChevronRight size={14} />
        <Link to={`/units/${unit.id}`}>{unit.title}</Link>
        <ChevronRight size={14} />
        <span aria-current="page">{lesson.title}</span>
      </nav>
      <div className="lesson-header">
        <div>
          <p className="eyebrow">
            {lesson.eyebrow} · {lesson.duration}
          </p>
          <h1>{lesson.title}</h1>
          <p>{lesson.outcome}</p>
        </div>
        <div className="lesson-header-actions">
          <button className="button button-primary" onClick={() => setCompleted(true)}>
            {completed ? <CheckCircle2 size={17} /> : <Play size={17} />}
            {completed ? "Completed" : "Start lesson"}
          </button>
          <button className="button button-quiet" onClick={saveNote}>
            <KeyRound size={16} /> Save note
          </button>
          {note && (
            <button className="button button-quiet" onClick={clearNote}>
              Delete note
            </button>
          )}
        </div>
      </div>
      <div className="lesson-progress-row">
        <span>Lesson progress</span>
        <ProgressBar value={completed ? 100 : 68} />
        <strong>{completed ? 100 : 68}%</strong>
        {saved && (
          <span className="saved-message" role="status">
            <Check size={14} /> Saved
          </span>
        )}
      </div>
      <div className="lesson-layout">
        <article className="reading-surface">
          <h2>Why the first choice matters</h2>
          <p>
            When we ask a question, we rarely get to observe every person or situation we care
            about. Instead, we work with a sample. That makes the path from question to evidence
            more practical—and more fragile—than it first appears.
          </p>
          <div className="callout callout-mint">
            <Sparkles size={18} />
            <div>
              <strong>A useful pause</strong>
              <p>
                Before trusting a result, ask: who had a chance to be included, and who did not?
              </p>
            </div>
          </div>
          <h2>Sampling is a design decision</h2>
          <p>
            A sample is not just a smaller version of a population. It is a set of choices: where to
            look, when to look, and what counts as an eligible observation. Those choices can bring
            a perspective into view—or leave it out entirely.
          </p>
          <div className="worked-example">
            <div className="worked-example-label">
              <span>Worked example</span>
              <MoreHorizontal size={16} />
            </div>
            <h3>“Most students in our class prefer the new study space.”</h3>
            <p>
              If the question was asked at the study space, the answer may describe the people who
              already like using it. That does not make the result useless. It does mean the claim
              needs a narrower shape.
            </p>
            <div className="example-footer">
              <Pill tone="yellow">Watch for selection bias</Pill>
              <span>
                <Clock3 size={14} /> 2 min read
              </span>
            </div>
          </div>
          <h2>Try the retrieval cue</h2>
          <p>
            Without looking back, name one way a sample can become unrepresentative. Then write one
            question you would ask before trusting a conclusion.
          </p>
          <label className="note-field">
            <span>Your private note</span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Capture the thought you want to find later…"
              rows={5}
            />
            <small>Only you can see this note. It won’t be included in receipts or emails.</small>
          </label>
          <div className="lesson-complete">
            <div>
              <Pill tone={completed ? "mint" : "violet"}>
                {completed ? "Lesson complete" : "Ready when you are"}
              </Pill>
              <h3>
                {completed
                  ? "Nice. The next useful step is practice."
                  : "Finish with a quick practice set."}
              </h3>
              <p>Retrieval is where this idea starts becoming yours.</p>
            </div>
            <Link className="button button-dark" to={practiceSelectionPath(lessonSelection)}>
              Practice this lesson <ArrowRight size={17} />
            </Link>
          </div>
        </article>
        <aside className="lesson-aside">
          <Card>
            <p className="eyebrow">In this lesson</p>
            <ul className="lesson-outline">
              <li className="active">
                <span />
                Why the first choice matters
              </li>
              <li>
                <span />
                Sampling is a design decision
              </li>
              <li>
                <span />
                Try the retrieval cue
              </li>
            </ul>
          </Card>
          <Card className="source-card">
            <p className="eyebrow">Source context</p>
            <h3>Aralivo learning note</h3>
            <p>
              This lesson is an original learning aid, reviewed for clarity and provenance before
              publication.
            </p>
            <span className="source-meta">
              <ShieldCheck size={14} /> Source basis recorded
            </span>
            <button className="text-link" onClick={() => setReported(true)}>
              {reported ? "Report received" : "Report content"} <ArrowRight size={14} />
            </button>
          </Card>
        </aside>
      </div>
    </div>
  );
}
/* eslint-enable react-hooks/rules-of-hooks */

function SeedLessonPage({ lessonId }: { lessonId: string }) {
  const lesson = lessons.find((item) => item.id === lessonId) ?? lessons[0];
  const isPhilosophicalLesson = lesson.id === philosophicalLessonId;
  const isSociologyLesson = lesson.id === sociologyLessonId;
  const isAnthropologyLesson = lesson.id === anthropologyLessonId;
  const isPsychologyLesson = lesson.id === psychologyLessonId;
  const isWesternEasternLesson = lesson.id === westernEasternLessonId;
  const isEthicsLesson = lesson.id === ethicsLessonId;
  const isMoralDilemmasLesson = lesson.id === moralDilemmasLessonId;
  const isFreedomLesson = lesson.id === freedomLessonId;
  const isCultureMoralBehaviorLesson = lesson.id === cultureMoralBehaviorLessonId;
  const isCommunicationLesson = lesson.id === communicationLessonId;
  const isPrinciplesEthicsLesson = lesson.id === principlesEthicsLessonId;
  const isVerbalNonVerbalMultimodalLesson = lesson.id === verbalNonVerbalMultimodalLessonId;
  const isCommunicationGlobalizationLesson = lesson.id === communicationGlobalizationLessonId;
  const isStsLesson = lesson.id === stsLessonId;
  const isHistoricalAntecedentsLesson = lesson.id === historicalAntecedentsLessonId;
  const markdown = isCommunicationGlobalizationLesson
    ? communicationGlobalizationLessonMarkdown
    : isVerbalNonVerbalMultimodalLesson
    ? verbalNonVerbalMultimodalLessonMarkdown
    : isPrinciplesEthicsLesson
    ? principlesEthicsLessonMarkdown
    : isCommunicationLesson
    ? communicationLessonMarkdown
    : isFreedomLesson
    ? freedomLessonMarkdown
    : isCultureMoralBehaviorLesson
    ? cultureMoralBehaviorLessonMarkdown
    : isMoralDilemmasLesson
    ? moralDilemmasLessonMarkdown
    : isEthicsLesson
    ? ethicsLessonMarkdown
    : isAnthropologyLesson
    ? anthropologyLessonMarkdown
    : isPsychologyLesson
    ? psychologyLessonMarkdown
    : isWesternEasternLesson
    ? westernEasternLessonMarkdown
    : isSociologyLesson
    ? sociologyLessonMarkdown
    : isHistoricalAntecedentsLesson
    ? historicalAntecedentsLessonMarkdown
    : isStsLesson
    ? stsLessonMarkdown
    : isPhilosophicalLesson
      ? philosophicalLessonMarkdown
      : lessonMarkdown;
  const lessonUnit = units.find((item) => item.id === lesson.unitId) ?? units[0];
  const lessonCourse = subjects.find((item) => item.id === lessonUnit.subjectId) ?? subjects[0];
  const startingProgress = isPhilosophicalLesson || isSociologyLesson || isAnthropologyLesson || isPsychologyLesson || isWesternEasternLesson || isEthicsLesson || isMoralDilemmasLesson || isFreedomLesson || isCultureMoralBehaviorLesson || isCommunicationLesson || isPrinciplesEthicsLesson || isVerbalNonVerbalMultimodalLesson || isCommunicationGlobalizationLesson || isStsLesson || isHistoricalAntecedentsLesson ? 0 : 12;
  const lessonIntro = isCommunicationGlobalizationLesson
    ? "Read for how global connection changes language, audience, access, representation, and the responsibility to invite correction."
    : isVerbalNonVerbalMultimodalLesson
    ? "Read for the ways words, voice, movement, space, timing, visuals, sound, and layout work together to make a message usable."
    : isPrinciplesEthicsLesson
    ? "Read for the small choices that protect truth, dignity, fairness, privacy, access, and accountability across everyday messages."
    : isCommunicationLesson
    ? "Read for the choices that shape a message, the context that shapes interpretation, and the feedback that makes repair possible."
    : isFreedomLesson
    ? "Read for how meaningful choice, answerability, reasons, and fair consideration work together when a decision affects other people."
    : isCultureMoralBehaviorLesson
    ? "Read for how culture teaches expectations, how context improves moral judgment, and why difference does not end moral criticism."
    : isMoralDilemmasLesson
    ? "Read for the difference between a hard ethical problem and a genuine moral dilemma, then practice making the response proportionate and reviewable."
    : isEthicsLesson
    ? "Read for the kind of reason each standard gives, the people affected, and the evidence that keeps a judgment proportionate."
    : isAnthropologyLesson
    ? "Read for the cultural meanings, identities, and histories that shape the self without turning difference into a stereotype."
    : isPsychologyLesson
    ? "Read for the different ways psychology explains self-concept, motivation, development, and behavior without turning any theory into a complete identity."
    : isWesternEasternLesson
    ? "Read for the values each tradition makes visible, the limits of broad cultural labels, and the evidence needed for a fair comparison."
    : isSociologyLesson
    ? "Read for the social settings, expectations, and audiences that shape identity without reducing a person to one label."
    : isHistoricalAntecedentsLesson
    ? "Read for the earlier conditions, practices, institutions, and movements that shaped later science and technology, including what the historical record leaves uncertain."
    : isStsLesson
    ? "Read for the relationships among evidence, design, context, and public choices; the point is to make the connections visible."
    : isPhilosophicalLesson
      ? "Read for the question each thinker is answering, the evidence each view favors, and the limits that keep comparison honest."
      : "Read for distinctions, not for a single final definition. The lesson will ask you to keep more than one useful lens in view.";
  const lessonOutline = isCommunicationGlobalizationLesson
    ? ["Why this matters", "Vocabulary and key ideas", "Language, culture, and access", "Worked examples", "Apply and transfer"]
    : isVerbalNonVerbalMultimodalLesson
    ? ["Why this matters", "Vocabulary and key ideas", "Modes and relationships", "Worked examples", "Apply and transfer"]
    : isPrinciplesEthicsLesson
    ? ["Why this matters", "Vocabulary and key ideas", "The ethical decision loop", "Worked examples", "Apply and transfer"]
    : isCommunicationLesson
    ? ["Why this matters", "Vocabulary and key ideas", "Communication models", "Worked examples", "Apply and transfer"]
    : isPsychologyLesson
    ? ["Why this matters", "Vocabulary and key ideas", "Psychological lenses", "Worked examples", "Apply it and transfer"]
    : isWesternEasternLesson
    ? ["Why this matters", "Vocabulary and key ideas", "Western and Eastern lenses", "Worked examples", "Apply it and transfer"]
    : isEthicsLesson || isMoralDilemmasLesson || isFreedomLesson || isCultureMoralBehaviorLesson || isSociologyLesson || isAnthropologyLesson
    ? ["Why this matters", "Vocabulary and key ideas", "Worked examples", "Apply it", "Recall and transfer"]
    : isHistoricalAntecedentsLesson
    ? ["Why this matters", "Vocabulary and key ideas", "Historical pathways and evidence", "Worked examples", "Apply and transfer"]
    : isStsLesson
    ? ["Why this matters", "Vocabulary and key ideas", "The STS relationship", "Worked examples", "Apply and transfer"]
    : isPhilosophicalLesson
      ? ["Why this matters", "Vocabulary and key ideas", "Key philosophical perspectives", "Worked examples", "Apply it and transfer"]
      : ["Why this matters", "Vocabulary and key ideas", "Worked examples", "Apply it", "Recall and transfer"];
  const [note, setNote] = useState(() => window.localStorage.getItem(`aralivo-notes-${getProfile().email}`) ?? "");
  const [saved, setSaved] = useState(false);
  const completionState = useCompletionState();
  const lessonIsComplete = Boolean(completionState.lessons[lesson.id]);
  const [completed, setCompleted] = useState(lessonIsComplete);
  const [completionStatus, setCompletionStatus] = useState("");
  const [reported, setReported] = useState(false);
  const noteKey = `aralivo-notes-${getProfile().email}`;
  useEffect(() => setCompleted(lessonIsComplete), [lessonIsComplete]);
  const completeLesson = async () => {
    if (completed) return;
    const milestones = markLessonCompleted(lesson.id);
    setCompleted(true);
    if (!getProfile().receiptsEnabled) {
      setCompletionStatus("Lesson complete. Enable receipts to keep a private, verifiable record.");
      return;
    }
    setCompletionStatus("Saving your lesson receipt…");
    const results = await Promise.all(milestones.map((milestone) => issueLearningReceipt(milestone)));
    const issuedCount = results.filter((result) => result?.receipt?.status === "issued").length;
    setCompletionStatus(
      issuedCount === milestones.length
        ? milestones.length > 1
          ? "Lesson complete. Unit and course milestones were recorded too."
          : "Lesson complete. Your receipt is ready to verify."
        : "Lesson complete. Your progress is safe; receipt syncing can be retried from Learning receipts.",
    );
  };
  const saveNote = () => {
    window.localStorage.setItem(noteKey, note);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };
  const clearNote = () => {
    window.localStorage.removeItem(noteKey);
    setNote("");
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };
  return (
    <div className="lesson-page page-stack">
      <nav className="content-breadcrumb" aria-label="Lesson breadcrumb">
        <Link to="/subjects">Courses</Link>
        <ChevronRight size={14} aria-hidden="true" />
        <Link to={`/subjects/${lessonCourse.id}`}>{lessonCourse.name}</Link>
        <ChevronRight size={14} aria-hidden="true" />
        <Link to={`/units/${lessonUnit.id}`}>{lessonUnit.title}</Link>
        <ChevronRight size={14} aria-hidden="true" />
        <span aria-current="page">{lesson.title}</span>
      </nav>
      <div className="lesson-header">
        <div>
          <p className="eyebrow">{lesson.eyebrow} · {lesson.duration}</p>
          <h1>{lesson.title}</h1>
          <p>{lesson.outcome}</p>
        </div>
        <div className="lesson-header-actions">
          <button className="button button-primary" onClick={() => void completeLesson()} disabled={completed}>
            {completed ? <CheckCircle2 size={17} /> : <Play size={17} />}
            {completed ? "Completed" : "Start lesson"}
          </button>
          <button className="button button-quiet" onClick={saveNote}>
            <KeyRound size={16} /> Save note
          </button>
          {note && <button className="button button-quiet" onClick={clearNote}>Clear note</button>}
        </div>
      </div>
      <div className="lesson-progress-row">
        <span>Lesson progress</span>
        <ProgressBar value={completed ? 100 : startingProgress} />
        <strong>{completed ? 100 : startingProgress}%</strong>
        {saved && <span className="saved-message" role="status"><Check size={14} /> Saved</span>}
      </div>
      <div className="lesson-layout">
        <article className="reading-surface">
          <div className="reading-intro">
            <Pill tone="violet">{isCommunicationLesson || isPrinciplesEthicsLesson || isVerbalNonVerbalMultimodalLesson || isCommunicationGlobalizationLesson || isMoralDilemmasLesson || isFreedomLesson || isCultureMoralBehaviorLesson ? "A 45-minute guided lesson" : isEthicsLesson ? "A 40-minute guided distinction" : isHistoricalAntecedentsLesson ? "A 45-minute guided history" : isStsLesson ? "A 40-minute STS introduction" : isAnthropologyLesson || isPsychologyLesson || isWesternEasternLesson || isSociologyLesson || isPhilosophicalLesson ? "A 45-minute guided lesson" : "A 30-minute starting point"}</Pill>
            <p>{lessonIntro}</p>
          </div>
          <LessonMarkdownContent markdown={markdown} />
          <label className="note-field">
            <span>Your private note</span>
            <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Capture the thought you want to find later…" rows={5} />
            <small>Only you can see this note. It will not be included in receipts or emails.</small>
          </label>
          <div className="lesson-complete">
            <div>
              <Pill tone={completed ? "mint" : "violet"}>{completed ? "Lesson complete" : "Ready when you are"}</Pill>
              <h3>{completed ? "Nice. The next useful step is practice." : "Finish with a quick practice set."}</h3>
              <p>Retrieval is where this idea starts becoming yours.</p>
            </div>
            <Link className="button button-dark" to={practiceSelectionPath(normalizePracticeSelection("lesson", lessonCourse.id, lessonUnit.id, lesson.id))}>
              Practice this lesson <ArrowRight size={17} />
            </Link>
          </div>
        </article>
        <aside className="lesson-aside">
          <Card>
            <p className="eyebrow">In this lesson</p>
            <ul className="lesson-outline">
              {lessonOutline.map((item, index) => <li className={index === 0 ? "active" : ""} key={item}><span /> {item}</li>)}
            </ul>
          </Card>
          <Card className="source-card">
            <p className="eyebrow">Source context</p>
            <h3>Original learning aid</h3>
            <p>Written for Aralivo with source alignment and lesson-proper references recorded for review.</p>
            <span className="source-meta"><ShieldCheck size={14} /> Provenance recorded</span>
            <button className="text-link" onClick={() => setReported(true)}>
              {reported ? "Report received" : "Report content"} <ArrowRight size={14} />
            </button>
          </Card>
        </aside>
      </div>
    </div>
  );
}

type PracticeType =
  | "multiple_choice"
  | "multi_select"
  | "multiple_select"
  | "true_false"
  | "fill_blank"
  | "short_answer"
  | "matching"
  | "ordering"
  | "scenario";

type PracticeItem = {
  id: string;
  type: PracticeType;
  prompt: string;
  options?: string[];
  items?: string[];
  pairs?: string[];
  matchingOptions?: string[];
  outcome_id?: string;
};

type LearnerQuestionPayload = {
  id: string;
  type: PracticeType;
  prompt: string;
  options?: Array<string | { id: string; text: string }>;
  items?: Array<string | { id: string; text: string }>;
  pairs?: { left: Array<{ id: string; text: string }>; right: Array<{ id: string; text: string }> };
  scenario?: string;
  outcome_id?: string;
};

function normalizeLearnerQuestions(value: unknown): PracticeItem[] {
  if (!value || typeof value !== "object" || !("questions" in value)) return [];
  const questions = (value as { questions?: unknown }).questions;
  if (!Array.isArray(questions)) return [];
  const textValue = (item: string | { id: string; text: string }) => typeof item === "string" ? item : item.text;
  return questions.filter((item): item is LearnerQuestionPayload => Boolean(item && typeof item === "object" && "id" in item && "type" in item && "prompt" in item)).map((item) => ({
    id: item.id,
    type: item.type === "multiple_select" ? "multi_select" : item.type,
    prompt: item.scenario ? `${item.scenario}\n\n${item.prompt}` : item.prompt,
    options: item.options?.map(textValue),
    items: item.items?.map(textValue),
    pairs: item.pairs ? item.pairs.left.flatMap((left, index) => [left.text, item.pairs?.right[index]?.text ?? ""]) : undefined,
    matchingOptions: item.pairs?.right.map((right) => right.text),
    outcome_id: item.outcome_id,
  }));
}

const practiceItems: PracticeItem[] = [
  {
    id: "sampling-01",
    type: "multiple_choice",
    prompt: "Why can the way a sample is chosen affect a conclusion?",
    options: [
      "A smaller group always gives a more accurate answer.",
      "The people included can shape the conclusion.",
      "Sampling only matters in laboratory studies.",
      "A sample removes the need for a clear question.",
    ],
  },
  {
    id: "sampling-02",
    type: "multi_select",
    prompt: "Which choices can introduce selection bias?",
    options: [
      "Only asking people who are already nearby",
      "Including people from different relevant contexts",
      "Excluding people who cannot access the survey",
      "Writing down the inclusion rule before recruiting",
    ],
  },
  {
    id: "sampling-03",
    type: "true_false",
    prompt: "A sample is a set of design choices, not just a smaller population.",
  },
  {
    id: "sampling-04",
    type: "fill_blank",
    prompt: "A sample that systematically misses part of the population may be ________.",
    options: ["unrepresentative", "random", "complete"],
  },
  {
    id: "sampling-05",
    type: "short_answer",
    prompt: "Name one question you would ask before trusting a sample-based conclusion.",
  },
  {
    id: "sampling-06",
    type: "matching",
    prompt: "Match each idea with the useful question it invites.",
    pairs: [
      "Who was included?",
      "Who had a chance to be heard?",
      "Where was the question asked?",
      "Could the setting shape the answer?",
    ],
  },
  {
    id: "sampling-07",
    type: "ordering",
    prompt: "Put the review steps in a useful order.",
    items: [
      "Name the population",
      "Inspect how people were included",
      "Shape the conclusion",
      "Ask what remains unseen",
    ],
  },
  {
    id: "sampling-08",
    type: "scenario",
    prompt:
      "A campus survey is shared only in a popular study group. What is the most useful first concern?",
    options: [
      "The responses may overrepresent people already engaged with the group.",
      "The survey must be perfectly accurate.",
      "The sample size no longer matters.",
      "The conclusion can be widened without checking.",
    ],
  },
  {
    id: "sampling-09",
    type: "multiple_choice",
    prompt: "What makes a sampling decision easier to explain later?",
    options: [
      "A clear inclusion rule",
      "A more dramatic headline",
      "A hidden recruitment source",
      "A longer conclusion",
    ],
  },
  {
    id: "sampling-10",
    type: "true_false",
    prompt: "A narrow sample can still be useful when the conclusion is shaped to match it.",
  },
  {
    id: "sampling-11",
    type: "multi_select",
    prompt: "Which details belong in a transparent sampling note?",
    options: [
      "Where participants were found",
      "Who was excluded and why",
      "The exact claim the sample can support",
      "A promise that no bias exists",
    ],
  },
  {
    id: "sampling-12",
    type: "fill_blank",
    prompt: "Before trusting a result, ask who had a chance to be ________.",
    options: ["included", "impressed", "graded"],
  },
  {
    id: "sampling-13",
    type: "short_answer",
    prompt: "Write one way the setting of a question could affect who answers.",
  },
  {
    id: "sampling-14",
    type: "ordering",
    prompt: "Order the move from observation to a careful claim.",
    items: [
      "Describe the observed pattern",
      "Name the sampling limits",
      "Choose a narrower claim",
      "Identify the next question",
    ],
  },
  {
    id: "sampling-15",
    type: "scenario",
    prompt:
      "A result says ‘most students’ after asking only students in one class. What is the best next move?",
    options: [
      "Narrow the claim or gather a broader sample.",
      "Treat the class as every student.",
      "Remove the sampling details.",
      "Publish the broadest version first.",
    ],
  },
];

function PracticeScopeChooser({
  selection,
  onChange,
  onStart,
}: {
  selection: PracticeSelection;
  onChange: (selection: PracticeSelection) => void;
  onStart: () => void;
}) {
  const selectedCourse = subjects.find((subject) => subject.id === selection.courseId) ?? subjects[0];
  const courseUnits = unitsForCourse(selectedCourse.id);
  const selectedUnit = courseUnits.find((unit) => unit.id === selection.unitId) ?? courseUnits[0] ?? units[0];
  const unitLessons = lessonsForUnit(selectedUnit.id);
  const selectedLesson = unitLessons.find((lesson) => lesson.id === selection.lessonId) ?? unitLessons[0] ?? lessons[0];
  const policy = getAssessmentPolicy(selection.scope);
  const targetTitle =
    selection.scope === "course"
      ? selectedCourse.name
      : selection.scope === "unit"
        ? selectedUnit.title
        : selectedLesson.title;
  const targetDescription =
    selection.scope === "course"
      ? `${courseUnits.length} units · a cumulative path through this course`
      : selection.scope === "unit"
        ? `${unitLessons.length} lessons · a review across this unit`
        : `${selectedUnit.title} · one focused lesson at a time`;
  const updateScope = (scope: PracticeScope) =>
    onChange(normalizePracticeSelection(scope, selection.courseId, selection.unitId, selection.lessonId));
  const chooseCourse = (courseId: string) => onChange(normalizePracticeSelection(selection.scope, courseId));
  const chooseUnit = (unitId: string) => {
    const unit = units.find((item) => item.id === unitId) ?? units[0];
    onChange(normalizePracticeSelection(selection.scope, unit.subjectId, unit.id));
  };
  const chooseLesson = (lessonId: string) => {
    const lesson = lessons.find((item) => item.id === lessonId) ?? lessons[0];
    const unit = units.find((item) => item.id === lesson.unitId) ?? units[0];
    onChange(normalizePracticeSelection(selection.scope, unit.subjectId, unit.id, lesson.id));
  };
  return (
    <div className="practice-page page-stack practice-chooser">
      <Link className="back-link" to="/today">
        <ChevronRight size={15} className="rotate-180" /> Back to Today
      </Link>
      <PageHeader
        eyebrow="Practice setup"
        title="Choose where to practice"
        description="The questionnaire stays familiar. Choose the learning boundary first so the next set has the right context."
      />
      <ol className="practice-steps" aria-label="Practice setup steps">
        <li className="active"><span>1</span> Choose a scope</li>
        <li><span>2</span> Choose content</li>
        <li><span>3</span> Practice</li>
      </ol>
      <div className="scope-switcher" role="radiogroup" aria-label="Practice scope">
        {(["course", "unit", "lesson"] as PracticeScope[]).map((scope) => {
          const scopePolicy = getAssessmentPolicy(scope);
          return (
            <button
              className={selection.scope === scope ? "scope-tab active" : "scope-tab"}
              key={scope}
              type="button"
              role="radio"
              aria-checked={selection.scope === scope}
              onClick={() => updateScope(scope)}
            >
              <span>{scope === "course" ? "Course" : scope === "unit" ? "Unit" : "Lesson"}</span>
              <small>{scopePolicy.selectionCount} items</small>
            </button>
          );
        })}
      </div>
      <Card className="scope-panel">
        <div className="scope-panel-head">
          <div>
            <p className="eyebrow">Step 1 · Choose content</p>
            <h2>{selection.scope === "course" ? "Which course?" : selection.scope === "unit" ? "Which unit?" : "Which lesson?"}</h2>
          </div>
          <Pill tone="violet">{policy.label}</Pill>
        </div>
        {selection.scope === "course" ? (
          <div className="scope-option-grid">
            {subjects.map((course) => (
              <button
                className={course.id === selectedCourse.id ? "scope-option selected" : "scope-option"}
                key={course.id}
                type="button"
                aria-pressed={course.id === selectedCourse.id}
                onClick={() => chooseCourse(course.id)}
              >
                <span className={`scope-option-symbol subject-${course.color}`}>{course.icon}</span>
                <span className="scope-option-copy">
                  <strong>{course.name}</strong>
                  <small>{course.code} · {unitsForCourse(course.id).length} units · {course.progress}% underway</small>
                </span>
                {course.id === selectedCourse.id && <CheckCircle2 size={18} aria-hidden="true" />}
              </button>
            ))}
          </div>
        ) : selection.scope === "unit" ? (
          <div className="scope-choice-stack">
            <label className="field scope-select-field">
              <span>Course</span>
              <select value={selectedCourse.id} onChange={(event) => chooseCourse(event.target.value)}>
                {subjects.map((course) => <option value={course.id} key={course.id}>{course.name}</option>)}
              </select>
            </label>
            <div className="scope-option-grid">
              {courseUnits.map((unit) => (
                <button
                  className={unit.id === selectedUnit.id ? "scope-option selected" : "scope-option"}
                  key={unit.id}
                  type="button"
                  aria-pressed={unit.id === selectedUnit.id}
                  onClick={() => chooseUnit(unit.id)}
                >
                  <span className="scope-option-number">{unit.label.replace("Unit ", "")}</span>
                  <span className="scope-option-copy"><strong>{unit.title}</strong><small>{unit.lessons} lessons · {unit.duration} · {unit.progress}% complete</small></span>
                  {unit.id === selectedUnit.id && <CheckCircle2 size={18} aria-hidden="true" />}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="scope-choice-stack">
            <div className="scope-select-row">
              <label className="field scope-select-field">
                <span>Course</span>
                <select value={selectedCourse.id} onChange={(event) => chooseCourse(event.target.value)}>
                  {subjects.map((course) => <option value={course.id} key={course.id}>{course.name}</option>)}
                </select>
              </label>
              <label className="field scope-select-field">
                <span>Unit</span>
                <select value={selectedUnit.id} onChange={(event) => chooseUnit(event.target.value)}>
                  {courseUnits.map((unit) => <option value={unit.id} key={unit.id}>{unit.title}</option>)}
                </select>
              </label>
            </div>
            <div className="scope-option-grid">
              {unitLessons.map((lesson) => (
                <button
                  className={lesson.id === selectedLesson.id ? "scope-option selected" : "scope-option"}
                  key={lesson.id}
                  type="button"
                  aria-pressed={lesson.id === selectedLesson.id}
                  onClick={() => chooseLesson(lesson.id)}
                >
                  <span className="scope-option-number"><BookOpen size={16} aria-hidden="true" /></span>
                  <span className="scope-option-copy"><strong>{lesson.title}</strong><small>{lesson.duration} · {lesson.progress}% complete</small></span>
                  {lesson.id === selectedLesson.id && <CheckCircle2 size={18} aria-hidden="true" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>
      <Card className="scope-ready-card">
        <div className="scope-ready-icon"><Target size={20} /></div>
        <div className="scope-ready-copy">
          <p className="eyebrow">Ready to practice</p>
          <h2>{targetTitle}</h2>
          <p>{targetDescription}</p>
          <p className="muted-copy">The validated bank selects {policy.selectionCount} items for this scope, with answers kept on the server until you submit.</p>
        </div>
        <button className="button button-dark" type="button" onClick={onStart}>
          Start questionnaire <ArrowRight size={17} />
        </button>
      </Card>
    </div>
  );
}

function PracticePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selection, setSelection] = useState(() => practiceSelectionFromSearch(location.search));
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (!started) setSelection(practiceSelectionFromSearch(location.search));
  }, [location.search, started]);
  const updateSelection = (nextSelection: PracticeSelection) => {
    setSelection(nextSelection);
    navigate(practiceSelectionPath(nextSelection), { replace: true });
  };
  return started ? (
    <PracticeQuestionnaire selection={selection} />
  ) : (
    <PracticeScopeChooser selection={selection} onChange={updateSelection} onStart={() => setStarted(true)} />
  );
}

function PracticeQuestionnaire({ selection }: { selection: PracticeSelection }) {
  const policy = getAssessmentPolicy(selection.scope);
  const selectedCourse = subjects.find((subject) => subject.id === selection.courseId) ?? subjects[0];
  const courseUnits = unitsForCourse(selectedCourse.id);
  const selectedUnit = courseUnits.find((unit) => unit.id === selection.unitId) ?? courseUnits[0] ?? units[0];
  const unitLessons = lessonsForUnit(selectedUnit.id);
  const selectedLesson = unitLessons.find((lesson) => lesson.id === selection.lessonId) ?? unitLessons[0] ?? lessons[0];
  const [items, setItems] = useState<PracticeItem[]>(practiceItems);
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState<string | string[]>("");
  const [matchingAnswers, setMatchingAnswers] = useState<Record<string, string>>({});
  const [ordering, setOrdering] = useState<string[]>(practiceItems[6].items ?? []);
  const [complete, setComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [attemptId, setAttemptId] = useState("demo-practice");
  const [contentLoading, setContentLoading] = useState(true);
  const item = items[current] ?? items[0];
  useEffect(() => {
    let active = true;
    setContentLoading(true);
    void apiRequest<{ attempt_id: string; questions: LearnerQuestionPayload[] }>(
      `/api/v1/content/questions/${encodeURIComponent(selectedLesson.id)}?scope=lesson_practice&seed=2026`,
      { method: "GET" },
    ).then((result) => {
      if (!active) return;
      const nextItems = normalizeLearnerQuestions(result);
      if (nextItems.length) {
        setItems(nextItems);
        setCurrent(0);
        setAnswer("");
        setOrdering(nextItems.find((question) => question.type === "ordering")?.items ?? []);
        setAttemptId(result?.attempt_id ?? "demo-practice");
      }
      setContentLoading(false);
    });
    return () => {
      active = false;
    };
  }, [selectedLesson.id]);
  useEffect(() => {
    if (items[current]?.type === "ordering") setOrdering(items[current].items ?? []);
    setMatchingAnswers({});
  }, [current, items]);
  const matchingLefts = item.type === "matching" ? (item.pairs ?? []).filter((_, index) => index % 2 === 0) : [];
  const hasAnswer =
    item.type === "ordering"
      ? ordering.length > 0
      : item.type === "matching"
        ? matchingLefts.length > 0 && matchingLefts.every((left) => Boolean(matchingAnswers[left]))
      : Array.isArray(answer)
        ? answer.length > 0
        : answer.trim().length > 0;
  const selectOption = (value: string) => setAnswer(value);
  const toggleOption = (value: string) => {
    setAnswer((currentAnswer) => {
      const values = Array.isArray(currentAnswer) ? currentAnswer : [];
      return values.includes(value)
        ? values.filter((itemValue) => itemValue !== value)
        : [...values, value];
    });
  };
  const finalizePractice = async () => {
    const completionId =
      selection.scope === "course"
        ? selectedCourse.id
        : selection.scope === "unit"
          ? selectedUnit.id
          : selectedLesson.id;
    const milestones = markScopedMilestoneCompleted(selection.scope, completionId);
    setComplete(true);
    if (!getProfile().receiptsEnabled) {
      setStatus(`${policy.label} complete. Enable receipts to keep a private, verifiable record.`);
      return;
    }
    setStatus("Saving your completion receipt…");
    const results = await Promise.all(milestones.map((milestone) => issueLearningReceipt(milestone)));
    const issuedCount = results.filter((result) => result?.receipt?.status === "issued").length;
    setStatus(
      issuedCount === milestones.length
        ? "Completion recorded. You can verify it from Learning receipts."
        : "Completion saved. Receipt syncing can be retried from Learning receipts.",
    );
  };
  const submit = async () => {
    if (!hasAnswer || submitting) return;
    setSubmitting(true);
    const idempotencyKey = `practice-${item.id}-${Date.now()}`;
    const result = await apiRequest<{ feedback?: { explanation?: string } }>(
      "/api/v1/assessments/submit",
      {
        method: "POST",
        headers: { "Idempotency-Key": idempotencyKey },
        body: JSON.stringify({
          attempt_id: attemptId,
          question_id: item.id,
          answer: item.type === "matching" ? matchingAnswers : answer,
          idempotency_key: idempotencyKey,
        }),
      },
    );
    setStatus(
      result
        ? "Response synced. Moving to the next question."
        : "Response saved locally. Moving to the next question.",
    );
    setSubmitting(false);
    if (current === items.length - 1) void finalizePractice();
    else {
      const next = current + 1;
      setCurrent(next);
      setAnswer("");
      setMatchingAnswers({});
      setOrdering(items[next].items ?? []);
    }
  };
  const moveOrdering = (index: number, direction: -1 | 1) => {
    setOrdering((values) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= values.length) return values;
      const next = [...values];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  };
  if (complete) {
    return (
      <div className="page-stack">
        <PageHeader
          eyebrow={`${policy.label} · 15-item interactive set`}
          title="You made it through."
          description={`The point was to notice what your reasoning does next in ${selectedCourse.name}.`}
        />
        <Card className="practice-summary">
          <div className="summary-orb">
            <Trophy size={27} />
          </div>
          <Pill tone="mint">Practice complete</Pill>
          <h2>You added 35 XP.</h2>
          <p>All {items.length} responses were recorded for this practice set.</p>
          {status && (
            <div className="practice-status" role="status" aria-live="polite">
              {status}
            </div>
          )}
          <div className="summary-stats">
            <div>
              <strong>{items.length} / {items.length}</strong>
              <span>items answered</span>
            </div>
            <div>
              <strong>8</strong>
              <span>response types used</span>
            </div>
            <div>
              <strong>8 min</strong>
              <span>estimated time</span>
            </div>
          </div>
          <div className="summary-actions">
            <Link className="button button-primary" to={`/lessons/${selectedLesson.id}`}>
              Review lesson <ArrowRight size={16} />
            </Link>
            <Link className="button button-quiet" to="/today">
              Back to Today
            </Link>
          </div>
        </Card>
      </div>
    );
  }
  return (
    <div className="practice-page page-stack">
      <div className="practice-top">
        <div>
          <Link className="back-link" to={`/lessons/${selectedLesson.id}`}>
            <ChevronRight size={15} className="rotate-180" /> Back to lesson
          </Link>
          <p className="eyebrow">{policy.label} · 15-item interactive set</p>
          <h1>{selectedLesson.title}</h1>
          <p className="practice-context">{selectedUnit.title} · {selectedCourse.name}</p>
        </div>
        <Link className="button button-quiet" to={`/lessons/${selectedLesson.id}`}>
          Save & exit
        </Link>
      </div>
      <div className="practice-progress">
        <span>
          Question {current + 1} of {items.length}
        </span>
        <ProgressBar value={((current + 1) / items.length) * 100} tone="primary" />
        <strong>{Math.round(((current + 1) / items.length) * 100)}%</strong>
      </div>
      {status && (
        <div className="practice-status" role="status" aria-live="polite">
          {status}
        </div>
      )}
      {contentLoading && <div className="practice-status" role="status">Loading the validated question set…</div>}
      <div className="question-shell">
        <div className="question-meta">
          <Pill tone="violet">{item.type.replace("_", " ")}</Pill>
          <span>Outcome · {item.outcome_id ?? "apply the lesson idea"}</span>
        </div>
        <h2>{item.prompt}</h2>
        {item.type === "multiple_choice" || item.type === "scenario" ? (
          <div className="option-list" role="radiogroup" aria-label="Answer options">
            {(item.options ?? []).map((option, index) => (
              <button
                key={option}
                className={answer === option ? "answer-option selected" : "answer-option"}
                onClick={() => selectOption(option)}
                role="radio"
                aria-checked={answer === option}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span>{option}</span>
                {answer === option && <Check size={17} />}
              </button>
            ))}
          </div>
        ) : item.type === "multi_select" ? (
          <div className="option-list" role="group" aria-label="Select all that apply">
            {(item.options ?? []).map((option, index) => {
              const checked = Array.isArray(answer) && answer.includes(option);
              return (
                <button
                  key={option}
                  className={checked ? "answer-option selected" : "answer-option"}
                  onClick={() => toggleOption(option)}
                  aria-pressed={checked}
                >
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  <span>{option}</span>
                  {checked && <Check size={17} />}
                </button>
              );
            })}
          </div>
        ) : item.type === "true_false" ? (
          <div className="binary-options" role="radiogroup" aria-label="True or false">
            <button
              className={answer === "True" ? "answer-option selected" : "answer-option"}
              onClick={() => selectOption("True")}
              role="radio"
              aria-checked={answer === "True"}
            >
              True
            </button>
            <button
              className={answer === "False" ? "answer-option selected" : "answer-option"}
              onClick={() => selectOption("False")}
              role="radio"
              aria-checked={answer === "False"}
            >
              False
            </button>
          </div>
        ) : item.type === "fill_blank" ? (
          <label className="field answer-field">
            <span>Your answer</span>
            <input
              value={typeof answer === "string" ? answer : ""}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="Complete the sentence…"
              autoComplete="off"
            />
          </label>
        ) : item.type === "short_answer" ? (
          <label className="field answer-field">
            <span>Your response</span>
            <textarea
              value={typeof answer === "string" ? answer : ""}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="A sentence is enough…"
              rows={4}
            />
          </label>
        ) : item.type === "matching" ? (
          <div className="matching-list">
            {matchingLefts.map((left) => (
              <label className="field" key={left}>
                <span>{left}</span>
                <select
                  value={matchingAnswers[left] ?? ""}
                  onChange={(event) => setMatchingAnswers((currentAnswers) => ({ ...currentAnswers, [left]: event.target.value }))}
                >
                  <option value="">Choose a match…</option>
                  {(item.matchingOptions ?? []).map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
            ))}
          </div>
        ) : (
          <div className="ordering-list" aria-label="Reorder the steps">
            {ordering.map((value, index) => (
              <div className="ordering-row" key={value}>
                <span>{index + 1}</span>
                <strong>{value}</strong>
                <button
                  className="icon-button"
                  aria-label={`Move ${value} up`}
                  onClick={() => moveOrdering(index, -1)}
                  disabled={index === 0}
                >
                  <ChevronDown className="rotate-180" size={16} />
                </button>
                <button
                  className="icon-button"
                  aria-label={`Move ${value} down`}
                  onClick={() => moveOrdering(index, 1)}
                  disabled={index === ordering.length - 1}
                >
                  <ChevronDown size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="question-actions">
          <span className="muted-copy">
            <HelpCircle size={15} /> Your response is saved before the next item.
          </span>
          <button
            className="button button-dark"
            disabled={!hasAnswer || submitting}
            onClick={submit}
          >
            {submitting
              ? "Saving…"
              : current === items.length - 1
                ? "Finish practice"
                : "Check answer"}{" "}
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

function PracticePageLegacy() {
  const [current, setCurrent] = useState(1);
  const [selected, setSelected] = useState("");
  const [feedback, setFeedback] = useState(false);
  const [complete, setComplete] = useState(false);
  const options = [
    "A smaller group always gives a more accurate answer.",
    "The people included can shape the conclusion.",
    "Sampling only matters in laboratory studies.",
    "A sample removes the need for a clear question.",
  ];
  if (complete)
    return (
      <div className="page-stack">
        <PageHeader
          eyebrow="Lesson practice · 15 items"
          title="You made it through."
          description="The point was to notice what your reasoning does next."
        />
        <Card className="practice-summary">
          <div className="summary-orb">
            <Trophy size={27} />
          </div>
          <Pill tone="mint">Practice complete</Pill>
          <h2>You added 35 XP.</h2>
          <p>You reviewed the idea of selection bias and are ready for the next lesson.</p>
          <div className="summary-stats">
            <div>
              <strong>12 / 15</strong>
              <span>items answered</span>
            </div>
            <div>
              <strong>3</strong>
              <span>skills revisited</span>
            </div>
            <div>
              <strong>8 min</strong>
              <span>estimated time</span>
            </div>
          </div>
          <div className="summary-actions">
            <Link className="button button-primary" to="/lessons/sampling-bias">
              Review lesson <ArrowRight size={16} />
            </Link>
            <Link className="button button-quiet" to="/today">
              Back to Today
            </Link>
          </div>
        </Card>
      </div>
    );
  return (
    <div className="practice-page page-stack">
      <div className="practice-top">
        <div>
          <Link className="back-link" to="/lessons/sampling-bias">
            <ChevronRight size={15} className="rotate-180" /> Back to lesson
          </Link>
          <p className="eyebrow">Lesson practice · Exactly 15 items</p>
          <h1>Sampling & bias</h1>
        </div>
        <button className="button button-quiet" onClick={() => undefined}>
          Save & exit
        </button>
      </div>
      <div className="practice-progress">
        <span>Question {current} of 15</span>
        <ProgressBar value={(current / 15) * 100} tone="primary" />
        <strong>{Math.round((current / 15) * 100)}%</strong>
      </div>
      <div className="question-shell">
        <div className="question-meta">
          <Pill tone="violet">Concept check</Pill>
          <span>Outcome · recognize selection bias</span>
        </div>
        <h2>Why can the way a sample is chosen affect a conclusion?</h2>
        <div className="option-list" role="radiogroup" aria-label="Answer options">
          {options.map((option, index) => (
            <button
              key={option}
              className={selected === option ? "answer-option selected" : "answer-option"}
              onClick={() => {
                setSelected(option);
                setFeedback(false);
              }}
              role="radio"
              aria-checked={selected === option}
            >
              <span className="option-letter">{String.fromCharCode(65 + index)}</span>
              <span>{option}</span>
              {selected === option && <Check size={17} />}
            </button>
          ))}
        </div>
        {feedback && (
          <Notice
            tone="success"
            title="Good reasoning."
            text="The group included can shape the pattern we see. That is the idea to carry into the next example."
          />
        )}
        <div className="question-actions">
          <span className="muted-copy">
            <HelpCircle size={15} /> You can revisit this question later.
          </span>
          <button
            className="button button-dark"
            disabled={!selected}
            onClick={() => {
              if (current === 15) setComplete(true);
              else {
                setFeedback(true);
                setSelected("");
                setCurrent((value) => value + 1);
              }
            }}
          >
            {current === 15 ? "Finish practice" : "Check answer"} <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

function FlashcardsPage() {
  return (
    <ContentUnavailablePage
      eyebrow="Flashcards"
      title="Flashcards will appear after lesson authoring"
      description="No generated lesson cards are available yet."
    />
  );
  /* istanbul ignore next -- retained route contract for generated lesson cards. */
  const [revealed, setRevealed] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Retrieval, at your pace"
        title="Flashcards"
        description="Three small reviews can be enough for today."
        action={
          <button className="button button-primary">
            <Plus size={17} /> New card
          </button>
        }
      />
      <div className="flashcards-layout">
        <Card className="flashcard-stage">
          <div className="flashcard-top">
            <span className="eyebrow">Due now · 1 of 3</span>
            <Pill tone="violet">Research Methods</Pill>
          </div>
          <button
            className={revealed ? "flashcard revealed" : "flashcard"}
            onClick={() => setRevealed((value) => !value)}
            aria-label={revealed ? "Card answer revealed" : "Reveal card answer"}
          >
            <span className="flashcard-label">{revealed ? "Answer" : "Recall"}</span>
            <strong>
              {revealed
                ? "The people included can shape the conclusion."
                : "Why can a sample quietly shape what you find?"}
            </strong>
            <small>
              {revealed
                ? "Tap a rating below to schedule your next review."
                : "Press Enter or tap to reveal"}
            </small>
          </button>
          {reviewed ? (
            <Notice
              tone="success"
              title="Card scheduled."
              text="We’ll bring this one back after a little space."
            />
          ) : (
            <div className="rating-row">
              <span className="muted-copy">How did that feel?</span>
              {["Again", "Hard", "Good", "Easy"].map((rating, index) => (
                <button
                  className={`rating-button rating-${index}`}
                  key={rating}
                  disabled={!revealed}
                  onClick={() => setReviewed(true)}
                >
                  {rating}
                  <small>{["1d", "3d", "7d", "14d"][index]}</small>
                </button>
              ))}
            </div>
          )}
        </Card>
        <aside className="flashcards-aside">
          <Card>
            <p className="eyebrow">Your review rhythm</p>
            <div className="big-stat">
              3 <span>due</span>
            </div>
            <ProgressBar value={66} tone="mint" />
            <p className="muted-copy">2 cards reviewed this week</p>
          </Card>
          <Card>
            <p className="eyebrow">Private cards</p>
            <h3>Make the prompt yours.</h3>
            <p className="muted-copy">
              Add a personal card from any lesson. Cards stay private unless you choose to export
              them.
            </p>
            <button className="text-link">
              <Plus size={15} /> Add a personal card
            </button>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function PlannerPage() {
  const storageKey = `aralivo-planner-${getProfile().email}`;
  const [tasks, setTasks] = useState<PlannerTask[]>(() => readStored(storageKey, defaultTasks));
  const [dialog, setDialog] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [menuIndex, setMenuIndex] = useState<number | null>(null);
  const [status, setStatus] = useState("");
  const emptyDraft = { title: "", subject: "Understanding the Self", minutes: "20", due: "Today" };
  const [draft, setDraft] = useState(emptyDraft);
  useEffect(() => writeStored(storageKey, tasks), [storageKey, tasks]);
  const openNew = () => {
    setEditingIndex(null);
    setDraft(emptyDraft);
    setDialog(true);
  };
  const openEdit = (index: number) => {
    const task = tasks[index];
    setEditingIndex(index);
    setDraft({
      title: task.title,
      subject: task.subject,
      minutes: String(task.minutes),
      due: task.due,
    });
    setDialog(true);
    setMenuIndex(null);
  };
  const saveTask = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.title.trim()) return;
    const nextTask: PlannerTask = {
      id: editingIndex === null ? `task-${Date.now()}` : tasks[editingIndex].id,
      title: draft.title.trim(),
      subject: draft.subject,
      minutes: Math.max(1, Number(draft.minutes) || 20),
      due: draft.due,
      done: editingIndex === null ? false : tasks[editingIndex].done,
    };
    setTasks((currentTasks) =>
      editingIndex === null
        ? [...currentTasks, nextTask]
        : currentTasks.map((task, index) => (index === editingIndex ? nextTask : task)),
    );
    setDialog(false);
    setStatus(editingIndex === null ? "Task added." : "Task updated.");
  };
  const toggleTask = (index: number) =>
    setTasks((currentTasks) =>
      currentTasks.map((task, taskIndex) =>
        taskIndex === index ? { ...task, done: !task.done } : task,
      ),
    );
  const deleteTask = (index: number) => {
    setTasks((currentTasks) => currentTasks.filter((_, taskIndex) => taskIndex !== index));
    setMenuIndex(null);
    setStatus("Task deleted.");
  };
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Make space for the work"
        title="Planner"
        description="Private tasks, realistic time estimates, and a clean export when you need it."
        action={
          <button className="button button-primary" onClick={openNew}>
            <Plus size={17} /> Add task
          </button>
        }
      />
      <div className="planner-toolbar">
        <div className="date-switcher">
          <button className="icon-button" aria-label="Previous week">
            <ChevronRight className="rotate-180" size={18} />
          </button>
          <strong>7–13 August 2026</strong>
          <button className="icon-button" aria-label="Next week">
            <ChevronRight size={18} />
          </button>
        </div>
        <button
          className="button button-quiet"
          onClick={() => {
            downloadTaskICS(tasks);
            setStatus("Calendar file downloaded.");
          }}
        >
          <FileDown size={16} /> Export .ics
        </button>
      </div>
      {status && (
        <div className="practice-status" role="status" aria-live="polite">
          {status}
        </div>
      )}
      <div className="planner-layout">
        <Card className="task-card">
          <div className="task-list-head">
            <span className="eyebrow">This week</span>
            <Pill tone="mint">{tasks.filter((task) => task.done).length} complete</Pill>
          </div>
          {tasks.length === 0 ? (
            <div className="empty-inline">
              <CalendarDays size={22} />
              <strong>No tasks yet.</strong>
              <p>Add one small next action to make the week easier to enter.</p>
              <button className="button button-primary" onClick={openNew}>
                Add your first task
              </button>
            </div>
          ) : (
            tasks.map((task, index) => (
              <div className={task.done ? "task-row done" : "task-row"} key={task.id}>
                <button
                  className="task-check"
                  aria-label={
                    task.done ? `Mark ${task.title} incomplete` : `Mark ${task.title} complete`
                  }
                  aria-pressed={task.done}
                  onClick={() => toggleTask(index)}
                >
                  {task.done && <Check size={14} />}
                </button>
                <div className="task-main">
                  <strong>{task.title}</strong>
                  <span>{task.subject}</span>
                </div>
                <span className="task-minutes">
                  <Clock3 size={14} /> {task.minutes} min
                </span>
                <Pill tone={task.due === "Today" ? "coral" : "neutral"}>{task.due}</Pill>
                <button
                  className="icon-button"
                  aria-label={`More options for ${task.title}`}
                  aria-expanded={menuIndex === index}
                  onClick={() => setMenuIndex(menuIndex === index ? null : index)}
                >
                  <MoreHorizontal size={18} />
                </button>
                {menuIndex === index && (
                  <div className="task-menu">
                    <button onClick={() => openEdit(index)}>Edit task</button>
                    <button onClick={() => deleteTask(index)}>Delete task</button>
                  </div>
                )}
              </div>
            ))
          )}
        </Card>
        <aside className="planner-aside">
          <Card>
            <p className="eyebrow">Time available</p>
            <h2>
              {Math.floor(
                tasks
                  .filter((task) => !task.done)
                  .reduce((total, task) => total + task.minutes, 0) / 60,
              )}
              h{" "}
              {tasks.filter((task) => !task.done).reduce((total, task) => total + task.minutes, 0) %
                60}
              m
            </h2>
            <p className="muted-copy">Across your open tasks this week.</p>
            <div className="availability">
              <span style={{ height: "48%" }} />
              <span style={{ height: "76%" }} />
              <span style={{ height: "35%" }} />
              <span style={{ height: "92%" }} />
              <span style={{ height: "64%" }} />
              <span style={{ height: "26%" }} />
              <span style={{ height: "50%" }} />
            </div>
            <div className="availability-labels">
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
              <span>S</span>
            </div>
          </Card>
          <Notice
            tone="info"
            title="Calendar stays optional"
            text="You can export a private .ics file without connecting Google Calendar."
          />
        </aside>
      </div>
      {dialog && (
        <TaskDialog
          draft={draft}
          setDraft={setDraft}
          editing={editingIndex !== null}
          onClose={() => setDialog(false)}
          onSubmit={saveTask}
        />
      )}
    </div>
  );
}

function TaskDialog({
  draft,
  setDraft,
  editing,
  onClose,
  onSubmit,
}: {
  draft: { title: string; subject: string; minutes: string; due: string };
  setDraft: React.Dispatch<
    React.SetStateAction<{ title: string; subject: string; minutes: string; due: string }>
  >;
  editing: boolean;
  onClose: () => void;
  onSubmit: (event: React.FormEvent) => void;
}) {
  const titleId = "task-dialog-title";
  return (
    <div className="dialog-backdrop" role="presentation">
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <button
          className="dialog-close icon-button"
          onClick={onClose}
          aria-label="Close task dialog"
        >
          <X size={18} />
        </button>
        <p className="eyebrow">Private planning</p>
        <h2 id={titleId}>{editing ? "Edit task" : "Add a task"}</h2>
        <p>Give the next useful action a clear shape.</p>
        <form onSubmit={onSubmit}>
          <label className="field">
            <span>Task title</span>
            <input
              value={draft.title}
              onChange={(event) =>
                setDraft((current) => ({ ...current, title: event.target.value }))
              }
              placeholder="Review one useful idea…"
              required
              autoComplete="off"
            />
          </label>
          <label className="field">
            <span>Subject</span>
            <select
              value={draft.subject}
              onChange={(event) =>
                setDraft((current) => ({ ...current, subject: event.target.value }))
              }
            >
              {subjects.map((course) => (
                <option value={course.name} key={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </label>
          <div className="task-form-grid">
            <label className="field">
              <span>Minutes</span>
              <input
                type="number"
                min="1"
                max="240"
                value={draft.minutes}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, minutes: event.target.value }))
                }
              />
            </label>
            <label className="field">
              <span>Due</span>
              <select
                value={draft.due}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, due: event.target.value }))
                }
              >
                <option>Today</option>
                <option>Tomorrow</option>
                <option>Friday</option>
                <option>Next week</option>
              </select>
            </label>
          </div>
          <div className="dialog-actions">
            <button className="button button-quiet" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="button button-dark" type="submit">
              {editing ? "Save task" : "Add task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function downloadTaskICS(tasks: PlannerTask[]) {
  const events = tasks
    .filter((task) => !task.done)
    .map((task, index) => {
      const start = new Date(Date.UTC(2026, 7, 7 + index, 9, 0));
      const end = new Date(start.getTime() + task.minutes * 60_000);
      const format = (date: Date) =>
        date
          .toISOString()
          .replace(/[-:]/g, "")
          .replace(/\.\d{3}Z$/, "Z");
      return [
        "BEGIN:VEVENT",
        `UID:${task.id}@aralivo`,
        `DTSTAMP:${format(new Date())}`,
        `DTSTART:${format(start)}`,
        `DTEND:${format(end)}`,
        `SUMMARY:Aralivo · ${task.title.replace(/[\r\n]/g, " ")}`,
        `DESCRIPTION:Private study task · ${task.subject}`,
        "END:VEVENT",
      ].join("\r\n");
    });
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Aralivo//Planner//EN",
    "CALSCALE:GREGORIAN",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "aralivo-planner.ics";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function PlannerPageLegacy() {
  const [tasks, setTasks] = useState([
    {
      title: "Review unit: Evidence you can trust",
      subject: "Research Methods",
      minutes: 20,
      due: "Today",
      done: false,
    },
    {
      title: "Read: Affordances",
      subject: "Human–Computer Interaction",
      minutes: 9,
      due: "Tomorrow",
      done: false,
    },
    {
      title: "Write a retrieval note",
      subject: "Technology & Society",
      minutes: 10,
      due: "Friday",
      done: true,
    },
  ]);
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Make space for the work"
        title="Planner"
        description="Private tasks, realistic time estimates, and a clean export when you need it."
        action={
          <button className="button button-primary">
            <Plus size={17} /> Add task
          </button>
        }
      />
      <div className="planner-toolbar">
        <div className="date-switcher">
          <button className="icon-button">
            <ChevronRight className="rotate-180" size={18} />
          </button>
          <strong>7–13 August 2026</strong>
          <button className="icon-button">
            <ChevronRight size={18} />
          </button>
        </div>
        <button className="button button-quiet" onClick={() => downloadICS()}>
          <FileDown size={16} /> Export .ics
        </button>
      </div>
      <div className="planner-layout">
        <Card className="task-card">
          <div className="task-list-head">
            <span className="eyebrow">This week</span>
            <Pill tone="mint">1 complete</Pill>
          </div>
          {tasks.map((task, index) => (
            <div className={task.done ? "task-row done" : "task-row"} key={task.title}>
              <button
                className="task-check"
                aria-label={
                  task.done ? `Mark ${task.title} incomplete` : `Mark ${task.title} complete`
                }
                onClick={() =>
                  setTasks((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, done: !item.done } : item,
                    ),
                  )
                }
              >
                {task.done && <Check size={14} />}
              </button>
              <div className="task-main">
                <strong>{task.title}</strong>
                <span>{task.subject}</span>
              </div>
              <span className="task-minutes">
                <Clock3 size={14} /> {task.minutes} min
              </span>
              <Pill tone={task.due === "Today" ? "coral" : "neutral"}>{task.due}</Pill>
              <button className="icon-button" aria-label={`More options for ${task.title}`}>
                <MoreHorizontal size={18} />
              </button>
            </div>
          ))}
        </Card>
        <aside className="planner-aside">
          <Card>
            <p className="eyebrow">Time available</p>
            <h2>1h 45m</h2>
            <p className="muted-copy">Across 3 open windows this week.</p>
            <div className="availability">
              <span style={{ height: "48%" }} />
              <span style={{ height: "76%" }} />
              <span style={{ height: "35%" }} />
              <span style={{ height: "92%" }} />
              <span style={{ height: "64%" }} />
              <span style={{ height: "26%" }} />
              <span style={{ height: "50%" }} />
            </div>
            <div className="availability-labels">
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
              <span>S</span>
            </div>
          </Card>
          <Notice
            tone="info"
            title="Calendar stays optional"
            text="You can export a private .ics file without connecting Google Calendar."
          />
        </aside>
      </div>
    </div>
  );
}
function downloadICS() {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Aralivo//Planner//EN",
    "BEGIN:VEVENT",
    "UID:aralivo-evidence-20260807",
    "DTSTAMP:20260807T000000Z",
    "DTSTART:20260807T090000Z",
    "DTEND:20260807T092000Z",
    "SUMMARY:Aralivo · Review unit: Evidence you can trust",
    "DESCRIPTION:Private study task from Aralivo",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "aralivo-planner.ics";
  anchor.click();
  URL.revokeObjectURL(url);
}

function FocusPage() {
  const profile = getProfile();
  const focusKey = `aralivo-focus-${profile.email}`;
  const persisted = readStored<FocusSession | null>(focusKey, null);
  const [session, setSession] = useState<FocusSession | null>(persisted?.state ? persisted : null);
  const [duration, setDuration] = useState(
    Math.round((persisted?.durationSeconds ?? 25 * 60) / 60),
  );
  const [remaining, setRemaining] = useState(() =>
    persisted ? persisted.durationSeconds - getElapsedSeconds(persisted) : 25 * 60,
  );
  const [reflection, setReflection] = useState("");
  const [focusSubject, setFocusSubject] = useState(profile.subject);
  const [outcome, setOutcome] = useState("Prepare for my first generated lesson.");
  const [syncStatus, setSyncStatus] = useState("");
  const state = session?.state ?? "planned";
  useEffect(() => {
    if (!session) {
      setRemaining(duration * 60);
      return;
    }
    const update = () =>
      setRemaining(Math.max(0, session.durationSeconds - getElapsedSeconds(session)));
    update();
    const timer = window.setInterval(update, 250);
    return () => window.clearInterval(timer);
  }, [duration, session]);
  useEffect(() => {
    if (session) writeStored(focusKey, session);
    else window.localStorage.removeItem(focusKey);
  }, [focusKey, session]);
  const start = () => {
    const next: FocusSession = {
      id: `focus-${Date.now()}`,
      durationSeconds: duration * 60,
      startedAt: Date.now(),
      accumulatedSeconds: 0,
      state: "active",
    };
    setSession(next);
  };
  const pause = () => {
    if (!session) return;
    const elapsed = getElapsedSeconds(session);
    setSession({ ...session, startedAt: null, accumulatedSeconds: elapsed, state: "paused" });
  };
  const resume = () => {
    if (!session) return;
    setSession({ ...session, startedAt: Date.now(), state: "active" });
  };
  const finish = async (nextState: "completed" | "ended") => {
    if (!session) return;
    const elapsed = getElapsedSeconds(session);
    const next = {
      ...session,
      startedAt: null,
      accumulatedSeconds: elapsed,
      state: nextState,
    } as FocusSession;
    setSession(next);
    const idempotencyKey = `focus-${session.id}`;
    const result = await apiRequest<{ xp_awarded?: number }>("/api/v1/focus/complete", {
      method: "POST",
      headers: { "Idempotency-Key": idempotencyKey },
      body: JSON.stringify({
        session_id: session.id,
        elapsed_seconds: elapsed,
        state: nextState,
        idempotency_key: idempotencyKey,
      }),
    });
    setSyncStatus(
      result
        ? `Session synced · ${result.xp_awarded ?? 0} XP added.`
        : "Session saved locally and will sync when the API is available.",
    );
  };
  const mins = Math.floor(remaining / 60)
    .toString()
    .padStart(2, "0");
  const secs = (remaining % 60).toString().padStart(2, "0");
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Low-friction focus"
        title="Focus"
        description="Choose a small outcome, then let the timer fade into the background."
      />
      {state === "planned" && (
        <div className="focus-setup">
          <Card className="focus-setup-main">
            <div className="focus-setup-head">
              <div>
                <p className="eyebrow">Before you begin</p>
                <h2>What deserves your attention?</h2>
              </div>
              <span className="focus-spark">
                <Focus size={22} />
              </span>
            </div>
            <label className="field">
              <span>Subject</span>
              <select value={focusSubject} onChange={(event) => setFocusSubject(event.target.value)}>
                {subjects.map((course) => (
                  <option value={course.name} key={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Intended outcome</span>
              <input value={outcome} onChange={(event) => setOutcome(event.target.value)} />
            </label>
            <div className="duration-picker">
              <span className="eyebrow">Session length</span>
              <div>
                {[15, 25, 45, 60].map((value) => (
                  <button
                    type="button"
                    key={value}
                    className={duration === value ? "duration-button active" : "duration-button"}
                    onClick={() => setDuration(value)}
                  >
                    {value}
                    <small>min</small>
                  </button>
                ))}
              </div>
            </div>
            <label className="check-toggle" htmlFor="break-reminder">
              <input id="break-reminder" type="checkbox" />
              <span className="toggle-ui" /> Take a break reminder <small>optional</small>
            </label>
            <button className="button button-dark button-full" onClick={start}>
              <Play size={17} /> Start focus
            </button>
          </Card>
          <aside>
            <Card className="focus-why">
              <p className="eyebrow">Why this works</p>
              <h3>One clear intention is enough.</h3>
              <p className="muted-copy">
                Aralivo calculates elapsed time from timestamps, so a backgrounded tab won’t throw
                off your session.
              </p>
              <div className="focus-state-list">
                <span>
                  <CheckCircle2 size={15} /> Pauses are okay
                </span>
                <span>
                  <CheckCircle2 size={15} /> No forced breaks
                </span>
                <span>
                  <CheckCircle2 size={15} /> XP is awarded once
                </span>
              </div>
            </Card>
            <Card>
              <p className="eyebrow">Recent focus</p>
              <div className="empty-inline compact-empty">
                <Focus size={22} />
                <strong>No focus history yet.</strong>
                <p>Completed sessions will appear here.</p>
              </div>
            </Card>
          </aside>
        </div>
      )}
      {state !== "planned" && (
        <div className="focus-active">
          <Card className="focus-timer-card">
            <div className="focus-live">
              <span className="live-dot" />{" "}
              {state === "active"
                ? "In focus"
                : state === "paused"
                  ? "Paused"
                  : state === "completed"
                    ? "Completed"
                    : "Ended early"}
            </div>
            <div className="timer-display" data-testid="timer-display" aria-live="polite">
              {state === "completed"
                ? `${Math.floor((session?.durationSeconds ?? 0) / 60)
                    .toString()
                    .padStart(2, "0")}:00`
                : `${mins}:${secs}`}
            </div>
            <p>{focusSubject}</p>
            <h2>{outcome}</h2>
            <div className="timer-actions">
              {state === "active" && (
                <button className="button button-quiet" onClick={pause}>
                  <Pause size={17} /> Pause
                </button>
              )}
              {state === "paused" && (
                <button className="button button-primary" onClick={resume}>
                  <Play size={17} /> Resume
                </button>
              )}
              {state === "active" && (
                <button className="button button-dark" onClick={() => finish("completed")}>
                  <CheckCircle2 size={17} /> Mark complete
                </button>
              )}
              {state === "paused" && (
                <button className="button button-quiet" onClick={() => finish("ended")}>
                  <X size={17} /> End early
                </button>
              )}
              {(state === "completed" || state === "ended") && (
                <Link className="button button-dark" to="/today">
                  Back to Today <ArrowRight size={17} />
                </Link>
              )}
            </div>
          </Card>
          {(state === "completed" || state === "ended") && (
            <Card className="reflection-card">
              <p className="eyebrow">Session reflection</p>
              <h2>
                {state === "completed" ? "What will you carry forward?" : "What got in the way?"}
              </h2>
              <textarea
                value={reflection}
                onChange={(event) => setReflection(event.target.value)}
                placeholder="A sentence is plenty…"
                rows={4}
              />
              <Notice
                tone="success"
                title={
                  syncStatus ||
                  (state === "completed" ? "Session complete." : "Session saved without a penalty.")
                }
                text="Your focus history is private, and this reflection stays out of receipts."
              />
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

function FocusPageLegacy() {
  const [state, setState] = useState<"planned" | "active" | "paused" | "completed" | "ended">(
    "planned",
  );
  const [duration, setDuration] = useState(25);
  const [remaining, setRemaining] = useState(duration * 60);
  const [reflection, setReflection] = useState("");
  useEffect(() => {
    if (state !== "active") return;
    const started = Date.now();
    const timer = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - started) / 1000);
      setRemaining((value) => Math.max(0, value - elapsed));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [state]);
  const mins = Math.floor(remaining / 60)
    .toString()
    .padStart(2, "0");
  const secs = (remaining % 60).toString().padStart(2, "0");
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Low-friction focus"
        title="Focus"
        description="Choose a small outcome, then let the timer fade into the background."
      />
      {state === "planned" && (
        <div className="focus-setup">
          <Card className="focus-setup-main">
            <div className="focus-setup-head">
              <div>
                <p className="eyebrow">Before you begin</p>
                <h2>What deserves your attention?</h2>
              </div>
              <span className="focus-spark">
                <Focus size={22} />
              </span>
            </div>
            <label className="field">
              <span>Subject</span>
              <select defaultValue="research">
                <option value="research">Research Methods</option>
                <option value="hci">Human–Computer Interaction</option>
                <option value="ethics">Technology & Society</option>
              </select>
            </label>
            <label className="field">
              <span>Intended outcome</span>
              <input defaultValue="Understand how selection bias can appear in a sample." />
            </label>
            <div className="duration-picker">
              <span className="eyebrow">Session length</span>
              <div>
                {[15, 25, 45, 60].map((value) => (
                  <button
                    key={value}
                    className={duration === value ? "duration-button active" : "duration-button"}
                    onClick={() => {
                      setDuration(value);
                      setRemaining(value * 60);
                    }}
                  >
                    {value}
                    <small>min</small>
                  </button>
                ))}
              </div>
            </div>
            <label className="check-toggle">
              <input type="checkbox" />
              <span className="toggle-ui" /> Take a break reminder <small>optional</small>
            </label>
            <button className="button button-dark button-full" onClick={() => setState("active")}>
              <Play size={17} /> Start focus
            </button>
          </Card>
          <aside>
            <Card className="focus-why">
              <p className="eyebrow">Why this works</p>
              <h3>One clear intention is enough.</h3>
              <p className="muted-copy">
                Aralivo calculates elapsed time from timestamps, so a backgrounded tab won’t throw
                off your session.
              </p>
              <div className="focus-state-list">
                <span>
                  <CheckCircle2 size={15} /> Pauses are okay
                </span>
                <span>
                  <CheckCircle2 size={15} /> No forced breaks
                </span>
                <span>
                  <CheckCircle2 size={15} /> XP is awarded once
                </span>
              </div>
            </Card>
            <Card>
              <p className="eyebrow">Recent focus</p>
              <div className="focus-history-item">
                <span>25</span>
                <div>
                  <strong>Research Methods</strong>
                  <small>Completed · Monday</small>
                </div>
              </div>
              <div className="focus-history-item">
                <span>15</span>
                <div>
                  <strong>HCI</strong>
                  <small>Ended early · Sunday</small>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      )}
      {state !== "planned" && (
        <div className="focus-active">
          <Card className="focus-timer-card">
            <div className="focus-live">
              <span className="live-dot" />{" "}
              {state === "active"
                ? "In focus"
                : state === "paused"
                  ? "Paused"
                  : state === "completed"
                    ? "Completed"
                    : "Ended early"}
            </div>
            <div className="timer-display" aria-live="polite">
              {state === "completed" ? "25:00" : `${mins}:${secs}`}
            </div>
            <p>Research Methods</p>
            <h2>Understand how selection bias can appear in a sample.</h2>
            <div className="timer-actions">
              {state === "active" && (
                <button className="button button-quiet" onClick={() => setState("paused")}>
                  <Pause size={17} /> Pause
                </button>
              )}
              {state === "paused" && (
                <button className="button button-primary" onClick={() => setState("active")}>
                  <Play size={17} /> Resume
                </button>
              )}
              {state === "active" && (
                <button className="button button-dark" onClick={() => setState("completed")}>
                  <CheckCircle2 size={17} /> Mark complete
                </button>
              )}
              {state === "paused" && (
                <button className="button button-quiet" onClick={() => setState("ended")}>
                  <X size={17} /> End early
                </button>
              )}
              {(state === "completed" || state === "ended") && (
                <Link className="button button-dark" to="/today">
                  Back to Today <ArrowRight size={17} />
                </Link>
              )}
            </div>
          </Card>
          {(state === "completed" || state === "ended") && (
            <Card className="reflection-card">
              <p className="eyebrow">Session reflection</p>
              <h2>
                {state === "completed" ? "What will you carry forward?" : "What got in the way?"}
              </h2>
              <textarea
                value={reflection}
                onChange={(event) => setReflection(event.target.value)}
                placeholder="A sentence is plenty…"
                rows={4}
              />
              <Notice
                tone="success"
                title={
                  state === "completed" ? "You added 25 XP." : "Session saved without a penalty."
                }
                text="Your focus history is private, and this reflection stays out of receipts."
              />
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

function ResourcesPage() {
  const [query, setQuery] = useState("");
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Bring good context with you"
        title="Resources"
        description="Low-volume, attributed discovery from public catalogs and scholarly metadata."
      />
      <Card className="resource-search">
        <Search size={20} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search books, papers, or ideas"
          aria-label="Search resources"
        />
        <button className="button button-primary">Search</button>
      </Card>
      <div className="resource-grid">
        <Card className="resource-card">
          <div className="resource-type">
            <BookOpen size={17} /> Open Library
          </div>
          <h2>Designing with the mind in mind</h2>
          <p>Simple, human-centered notes on how people perceive and use interfaces.</p>
          <div className="resource-footer">
            <span>Book metadata · 2014</span>
            <a href="https://openlibrary.org" target="_blank" rel="noreferrer">
              View source <ExternalLink size={14} />
            </a>
          </div>
        </Card>
        <Card className="resource-card">
          <div className="resource-type">
            <Leaf size={17} /> OpenAlex
          </div>
          <h2>Learning through retrieval practice</h2>
          <p>A scholarly work surfaced with context, not a claim of school approval.</p>
          <div className="resource-footer">
            <span>Open access · 2023</span>
            <a href="https://openalex.org" target="_blank" rel="noreferrer">
              View source <ExternalLink size={14} />
            </a>
          </div>
        </Card>
        <Card className="resource-card resource-card-muted">
          <div className="resource-type">
            <Sparkles size={17} /> AI assistant
          </div>
          <h2>Lesson context will appear here</h2>
          <p>Generate and publish a lesson before using the assistant with lesson-specific context.</p>
          <Pill tone="neutral">Not configured</Pill>
          <button className="text-link">
            Learn about privacy <ArrowRight size={14} />
          </button>
        </Card>
      </div>
      <Notice
        tone="info"
        title="Provider availability is optional"
        text="Aralivo keeps your core study loop available when an external catalog or AI provider is unavailable."
      />
    </div>
  );
}

function ReceiptsPage() {
  const profile = getProfile();
  const completionState = useCompletionState();
  const [optedIn, setOptedIn] = useState(Boolean(profile.receiptsEnabled));
  const [stellarConfig, setStellarConfig] = useState<StellarConfig | null>(null);
  const [receipts, setReceipts] = useState<ReceiptRecord[]>([]);
  const [levelFilter, setLevelFilter] = useState<"all" | CompletionScope>("all");
  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    let active = true;
    void Promise.all([
      apiRequest<StellarConfig>("/api/v1/config", { method: "GET" }),
      apiRequest<{ receipts: ReceiptRecord[] }>("/api/v1/receipts", { method: "GET" }),
    ]).then(([config, history]) => {
      if (!active) return;
      setStellarConfig(config);
      if (history?.receipts) setReceipts(history.receipts);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const savePreference = async (enabled: boolean) => {
    setOptedIn(enabled);
    writeStored("aralivo-profile", { ...profile, receiptsEnabled: enabled });
    if (supabase) {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const { error } = await supabase
          .from("profiles")
          .update({ receipts_enabled: enabled })
          .eq("id", data.user.id);
        if (error) {
          setStatus("The preference could not be saved. Try again.");
          return;
        }
      }
    }
    setStatus(enabled ? "Receipts enabled. New completions will be recorded automatically." : "Receipts turned off.");
  };

  const syncCompletedMilestones = async () => {
    if (!stellarConfig?.stellar_enabled) {
      setStatus("Stellar testnet is not configured on this deployment yet.");
      return;
    }
    if (!optedIn) {
      setStatus("Enable receipts before recording completed milestones.");
      return;
    }
    const known = new Set(receipts.map((receipt) => receipt.content_identifier));
    const pendingMilestones = completedMilestones(completionState).filter(
      (milestone) => !known.has(milestone.contentIdentifier),
    );
    if (pendingMilestones.length === 0) {
      setStatus("All completed milestones are already recorded.");
      return;
    }
    setIssuing(true);
    setStatus(`Saving ${pendingMilestones.length} completion${pendingMilestones.length === 1 ? "" : "s"}…`);
    const results = await Promise.all(pendingMilestones.map((milestone) => issueLearningReceipt(milestone)));
    const issued = results.flatMap((result) => (result?.receipt ? [result.receipt] : []));
    if (issued.length > 0) {
      setReceipts((current) => [
        ...issued,
        ...current.filter((receipt) => !issued.some((item) => item.id === receipt.id)),
      ]);
    }
    setIssuing(false);
    setStatus(
      issued.length === pendingMilestones.length
        ? "All completed milestones are ready to verify."
        : "Some milestones are saved locally and can be retried here.",
    );
  };

  const receiptScope = (receipt: ReceiptRecord): CompletionScope => {
    if (receipt.milestone_scope) return receipt.milestone_scope;
    if (receipt.achievement_type.startsWith("lesson")) return "lesson";
    if (receipt.achievement_type.startsWith("unit")) return "unit";
    return "course";
  };
  const visibleReceipts = receipts.filter((receipt) => levelFilter === "all" || receiptScope(receipt) === levelFilter);
  const scopeCounts = (Object.keys({ lesson: true, unit: true, course: true }) as CompletionScope[]).map((scope) => ({
    scope,
    count: receipts.filter((receipt) => receiptScope(receipt) === scope).length,
  }));
  const networkLabel = stellarConfig?.stellar_network === "public" ? "Stellar public" : "Stellar testnet";
  const levelLabel: Record<CompletionScope, string> = { lesson: "Lessons", unit: "Units", course: "Courses" };

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Private proof, if you want it"
        title="Learning receipts"
        description="A verifiable record for every completed lesson, unit, and course."
        action={
          <Pill tone={stellarConfig?.stellar_enabled ? "mint" : "neutral"}>
            {stellarConfig?.stellar_enabled ? networkLabel : "Testnet not configured"}
          </Pill>
        }
      />
      <Card className="receipt-hero">
        <div className="receipt-hero-icon">
          <ShieldCheck size={25} />
        </div>
        <div>
          <p className="eyebrow">Privacy-safe by design</p>
          <h2>Keep the milestones that matter.</h2>
          <p>
            Aralivo stores each readable receipt privately and anchors only its hash in Stellar account data.
            Your name, email, notes, answers, and school records never go on-chain.
          </p>
          <p className="receipt-hero-note">
            {optedIn ? "New completions will be recorded automatically." : "Nothing is shared until you opt in."}
          </p>
        </div>
        <button
          className={optedIn ? "button button-quiet" : "button button-dark"}
          onClick={() => void savePreference(!optedIn)}
          disabled={loading}
        >
          {optedIn ? "Turn off receipts" : "Enable receipts"}
        </button>
      </Card>
      {status && (
        <div className="practice-status" role="status" aria-live="polite">
          {status}
        </div>
      )}
      <div className="receipts-layout">
        <Card>
          <SectionTitle
            title="Your receipt history"
            action={
              <button
                className="button button-quiet"
                onClick={() => void syncCompletedMilestones()}
                disabled={!optedIn || issuing || !stellarConfig?.stellar_enabled}
              >
                {issuing ? "Saving…" : "Record completed milestones"}
              </button>
            }
          />
          <div className="receipt-filter" role="group" aria-label="Filter receipts by completion level">
            <button className={levelFilter === "all" ? "is-active" : ""} aria-pressed={levelFilter === "all"} onClick={() => setLevelFilter("all")}>All <span>{receipts.length}</span></button>
            {scopeCounts.map(({ scope, count }) => (
              <button key={scope} className={levelFilter === scope ? "is-active" : ""} aria-pressed={levelFilter === scope} onClick={() => setLevelFilter(scope)}>
                {levelLabel[scope]} <span>{count}</span>
              </button>
            ))}
          </div>
          {!optedIn ? (
            <div className="empty-inline">
              <ShieldCheck size={22} />
              <strong>Receipts are off.</strong>
              <p>Enable receipts to automatically record lesson, unit, and course completions.</p>
            </div>
          ) : visibleReceipts.length > 0 ? (
            <div className="receipt-history-list">
              {visibleReceipts.map((receipt) => (
                <div className="receipt-item" key={receipt.id}>
                  <div className="receipt-item-icon">
                    {receipt.status === "issued" ? <CheckCircle2 size={18} /> : <ShieldCheck size={18} />}
                  </div>
                  <div>
                    <strong>{levelLabel[receiptScope(receipt)]} complete</strong>
                    <p translate="no">
                      {receipt.content_identifier} · {receipt.network} · {receipt.status}
                    </p>
                    <code translate="no">{receipt.payload_hash.slice(0, 16)}…</code>
                  </div>
                  {receipt.verification_url && receipt.status === "issued" ? (
                    <a className="text-link" href={receipt.verification_url} target="_blank" rel="noreferrer">
                      Verify <ExternalLink size={14} />
                    </a>
                  ) : (
                    <Pill tone="neutral">{receipt.status}</Pill>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-inline">
              <ShieldCheck size={22} />
              <strong>{levelFilter === "all" ? "No receipts yet." : `No ${levelLabel[levelFilter].toLowerCase()} receipts yet.`}</strong>
              <p>Complete a milestone and Aralivo will keep its private proof here.</p>
            </div>
          )}
        </Card>
        <Card>
          <p className="eyebrow">Three levels, one privacy boundary</p>
          <ul className="check-list">
            <li><CheckCircle2 size={16} /> lesson completion</li>
            <li><CheckCircle2 size={16} /> unit completion</li>
            <li><CheckCircle2 size={16} /> course completion</li>
            <li><X size={16} className="list-no" /> private notes or answers</li>
            <li><X size={16} className="list-no" /> name, email, or school records</li>
          </ul>
          <p className="muted-copy receipt-explainer">
            Complete every lesson in a unit to complete the unit. Complete every unit in a course to complete the course.
          </p>
          <Link className="text-link" to="/settings#privacy">
            Read the privacy note <ArrowRight size={14} />
          </Link>
        </Card>
      </div>
    </div>
  );
}

function ReceiptsPageLegacyPlaceholder() {
  const profile = getProfile();
  const [optedIn, setOptedIn] = useState(Boolean(profile.receiptsEnabled));
  const [stellarConfig, setStellarConfig] = useState<StellarConfig | null>(null);
  const [receipts, setReceipts] = useState<ReceiptRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    let active = true;
    void Promise.all([
      apiRequest<StellarConfig>("/api/v1/config", { method: "GET" }),
      apiRequest<{ receipts: ReceiptRecord[] }>("/api/v1/receipts", { method: "GET" }),
    ]).then(([config, history]) => {
      if (!active) return;
      setStellarConfig(config);
      if (history?.receipts) setReceipts(history.receipts);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const savePreference = async (enabled: boolean) => {
    setOptedIn(enabled);
    writeStored("aralivo-profile", { ...profile, receiptsEnabled: enabled });
    if (supabase) {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const { error } = await supabase
          .from("profiles")
          .update({ receipts_enabled: enabled })
          .eq("id", data.user.id);
        if (error) {
          setStatus("The preference could not be saved. Try again.");
          return;
        }
      }
    }
    setStatus(enabled ? "Receipts enabled for this account." : "Receipts turned off.");
  };

  const issueCourseReceipt = async () => {
    if (!stellarConfig?.stellar_enabled) {
      setStatus("Stellar testnet is not configured on this deployment yet.");
      return;
    }
    if (!optedIn) await savePreference(true);
    setIssuing(true);
    setStatus("Anchoring your course selection on Stellar testnet…");
    const courseSlug = profile.subject.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const idempotencyKey = `course-selected-${courseSlug}-v1`;
    const result = await apiRequest<{ receipt: ReceiptRecord; payload_hash: string }>(
      "/api/v1/receipts/issue",
      {
        method: "POST",
        headers: { "Idempotency-Key": idempotencyKey },
        body: JSON.stringify({
          content_identifier: `course:${courseSlug}`,
          achievement_type: "course_selected",
          content_version: "catalog-v1",
          idempotency_key: idempotencyKey,
        }),
      },
    );
    setIssuing(false);
    if (result?.receipt) {
      setReceipts((current) => [result.receipt, ...current.filter((item) => item.id !== result.receipt.id)]);
      setStatus(
        result.receipt.status === "issued"
          ? "Receipt issued. You can verify it on Stellar."
          : "Receipt saved and waiting for Stellar confirmation.",
      );
    } else {
      setStatus("The receipt could not be issued. Your study data was not affected.");
    }
  };

  const networkLabel = stellarConfig?.stellar_network === "public" ? "Stellar public" : "Stellar testnet";
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Private proof, if you want it"
        title="Learning receipts"
        description="A verifiable learning record - not a degree, grade, or official credential."
        action={
          <Pill tone={stellarConfig?.stellar_enabled ? "mint" : "neutral"}>
            {stellarConfig?.stellar_enabled ? networkLabel : "Testnet not configured"}
          </Pill>
        }
      />
      <Card className="receipt-hero">
        <div className="receipt-hero-icon">
          <ShieldCheck size={25} />
        </div>
        <div>
          <p className="eyebrow">Privacy-safe by design</p>
          <h2>Keep a milestone without sharing your history.</h2>
          <p>
            Aralivo stores the readable receipt privately and anchors only its hash in Stellar account data.
            Your name, email, notes, answers, and school records never go on-chain.
          </p>
          <p className="receipt-hero-note">
            {optedIn ? "Receipts are enabled for this account." : "Nothing is shared until you opt in."}
          </p>
        </div>
        <button
          className={optedIn ? "button button-quiet" : "button button-dark"}
          onClick={() => void savePreference(!optedIn)}
          disabled={loading}
        >
          {optedIn ? "Turn off receipts" : "Enable receipts"}
        </button>
      </Card>
      {status && (
        <div className="practice-status" role="status" aria-live="polite">
          {status}
        </div>
      )}
      <div className="receipts-layout">
        <Card>
          <SectionTitle
            title="Your receipt history"
            action={
              <button
                className="button button-quiet"
                onClick={() => void issueCourseReceipt()}
                disabled={!optedIn || issuing || !stellarConfig?.stellar_enabled}
              >
                {issuing ? "Anchoring…" : "Record selected course"}
              </button>
            }
          />
          {!optedIn ? (
            <div className="empty-inline">
              <ShieldCheck size={22} />
              <strong>Receipts are off.</strong>
              <p>Enable receipts when you want to keep a verifiable learning record.</p>
            </div>
          ) : receipts.length > 0 ? (
            <div className="receipt-history-list">
              {receipts.map((receipt) => (
                <div className="receipt-item" key={receipt.id}>
                  <div className="receipt-item-icon">
                    {receipt.status === "issued" ? <CheckCircle2 size={18} /> : <ShieldCheck size={18} />}
                  </div>
                  <div>
                    <strong>{receipt.achievement_type.replaceAll("_", " ")}</strong>
                    <p>
                      {receipt.content_identifier} · {receipt.network} · {receipt.status}
                    </p>
                    <code translate="no">{receipt.payload_hash.slice(0, 16)}…</code>
                  </div>
                  {receipt.verification_url && receipt.status === "issued" ? (
                    <a className="text-link" href={receipt.verification_url} target="_blank" rel="noreferrer">
                      Verify <ExternalLink size={14} />
                    </a>
                  ) : (
                    <Pill tone="neutral">{receipt.status}</Pill>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-inline">
              <ShieldCheck size={22} />
              <strong>No receipts yet.</strong>
              <p>Record your selected course now, then add lesson milestones as you complete them.</p>
            </div>
          )}
        </Card>
        <Card>
          <p className="eyebrow">What is public?</p>
          <ul className="check-list">
            <li>
              <CheckCircle2 size={16} /> content identifier
            </li>
            <li>
              <CheckCircle2 size={16} /> achievement type
            </li>
            <li>
              <CheckCircle2 size={16} /> timestamp and content version
            </li>
            <li>
              <X size={16} className="list-no" /> private notes or answers
            </li>
            <li>
              <X size={16} className="list-no" /> name, email, or school records
            </li>
          </ul>
          <p className="muted-copy receipt-explainer">
            The on-chain entry contains only a receipt hash. Aralivo keeps the readable record in your account.
          </p>
          <Link className="text-link" to="/settings#privacy">
            Read the privacy note <ArrowRight size={14} />
          </Link>
        </Card>
      </div>
    </div>
  );
}

function ReceiptsPageLegacy() {
  const [optedIn, setOptedIn] = useState(false);
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Private proof, if you want it"
        title="Learning receipts"
        description="A verifiable learning record—not a degree, grade, or official credential."
        action={
          <Pill tone={optedIn ? "mint" : "neutral"}>{optedIn ? "Opted in" : "Opted out"}</Pill>
        }
      />
      <Card className="receipt-hero">
        <div className="receipt-hero-icon">
          <ShieldCheck size={25} />
        </div>
        <div>
          <p className="eyebrow">Privacy-safe by design</p>
          <h2>Keep a milestone without sharing your history.</h2>
          <p>
            Receipts use a pseudonymous identifier and content hash. They never include your name,
            email, notes, detailed answers, or raw study history.
          </p>
        </div>
        <button
          className={optedIn ? "button button-quiet" : "button button-dark"}
          onClick={() => setOptedIn((value) => !value)}
        >
          {optedIn ? "Turn off receipts" : "Opt in to receipts"}
        </button>
      </Card>
      <div className="receipts-layout">
        <Card>
          <SectionTitle
            title="Issued receipts"
            action={
              <button className="icon-button" aria-label="More receipt options">
                <MoreHorizontal size={18} />
              </button>
            }
          />
          {optedIn ? (
            <div className="receipt-item">
              <div className="receipt-item-icon">
                <Trophy size={18} />
              </div>
              <div>
                <strong>Evidence you can trust · Unit complete</strong>
                <p>Issued 7 August 2026 · Testnet</p>
              </div>
              <button className="text-link">
                View <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div className="empty-inline">
              <ShieldCheck size={22} />
              <strong>No receipts yet.</strong>
              <p>Opt in when a milestone is worth keeping.</p>
            </div>
          )}
        </Card>
        <Card>
          <p className="eyebrow">What is public?</p>
          <ul className="check-list">
            <li>
              <CheckCircle2 size={16} /> content identifier
            </li>
            <li>
              <CheckCircle2 size={16} /> achievement type
            </li>
            <li>
              <CheckCircle2 size={16} /> timestamp and content version
            </li>
            <li>
              <X size={16} className="list-no" /> private notes or answers
            </li>
            <li>
              <X size={16} className="list-no" /> name, email, or school records
            </li>
          </ul>
          <button className="text-link">
            Read the privacy note <ArrowRight size={14} />
          </button>
        </Card>
      </div>
    </div>
  );
}

function SettingsPage({ onSignOut }: { onSignOut: () => void }) {
  const [section, setSection] = useState(() => window.location.hash.replace("#", "") || "profile");
  const [profile, setProfile] = useState(getProfile);
  const [saved, setSaved] = useState("Saved");
  const [dialog, setDialog] = useState(false);
  const [status, setStatus] = useState("");
  const sections = [
    { id: "profile", label: "Profile", icon: UserRound },
    { id: "account", label: "Account & sign-in", icon: KeyRound },
    { id: "security", label: "Security", icon: ShieldCheck },
    { id: "study", label: "Study preferences", icon: Target },
    { id: "notifications", label: "Notifications", icon: Mail },
    { id: "integrations", label: "Integrations", icon: Link2 },
    { id: "receipts", label: "Receipts", icon: ShieldCheck },
    { id: "privacy", label: "Privacy & data", icon: LockKeyhole },
    { id: "appearance", label: "Appearance", icon: Sparkles },
    { id: "danger", label: "Danger zone", icon: Trash2 },
  ];
  const selectSection = (next: string) => {
    setSection(next);
    window.history.replaceState(null, "", `/settings#${next}`);
  };
  const updateReceiptPreference = async (enabled: boolean) => {
    const nextProfile = { ...profile, receiptsEnabled: enabled };
    setProfile(nextProfile);
    writeStored("aralivo-profile", nextProfile);
    if (supabase) {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const { error } = await supabase
          .from("profiles")
          .update({ receipts_enabled: enabled })
          .eq("id", data.user.id);
        if (error) {
          setStatus("Receipt preference could not be saved.");
          return;
        }
      }
    }
    setStatus("Receipt preference updated.");
  };
  const saveProfile = async () => {
    writeStored("aralivo-profile", profile);
    if (supabase) {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        await supabase.from("profiles").update({
          display_name: profile.displayName,
          term: profile.term,
          primary_subject: profile.subject,
        }).eq("id", data.user.id);
      }
    }
    setSaved("Saving…");
    window.setTimeout(() => setSaved("Saved"), 450);
    setStatus("Profile changes saved on this device.");
  };
  const exportData = () => {
    const payload = {
      profile,
      tasks: readStored<PlannerTask[]>(`aralivo-planner-${profile.email}`, defaultTasks),
      notes: window.localStorage.getItem(`aralivo-notes-${profile.email}`) ?? "",
      exportedAt: new Date().toISOString(),
    };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "aralivo-data.json";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus("Your private data export is ready.");
  };
  const clearLocalData = () => {
    window.localStorage.removeItem(`aralivo-notes-${profile.email}`);
    window.localStorage.removeItem(`aralivo-planner-${profile.email}`);
    window.localStorage.removeItem(`aralivo-focus-${profile.email}`);
    setStatus("Local study data cleared.");
  };
  return (
    <div className="settings-page">
      <PageHeader
        eyebrow="Your space, your choices"
        title="Settings"
        description="Keep the important controls findable, and the sensitive ones deliberate."
      />
      <div className="settings-layout">
        <aside className="settings-nav" aria-label="Settings sections">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={
                section === id
                  ? "settings-nav-item active"
                  : `settings-nav-item ${id === "danger" ? "danger-link" : ""}`
              }
              onClick={() => selectSection(id)}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </aside>
        <main className="settings-content">
          <div className="settings-save-state" role="status">
            <span className="sync-dot" /> {saved}
          </div>
          {status && (
            <div className="practice-status" role="status" aria-live="polite">
              {status}
            </div>
          )}
          {section === "profile" && (
            <SettingsSection
              eyebrow="Profile"
              title="How Aralivo knows you"
              description="These details shape your workspace, not your public identity."
            >
              <div className="profile-row">
                <div className="avatar avatar-large">JS</div>
                <div>
                  <strong>{profile.displayName}</strong>
                  <p className="muted-copy">Profile initials are used by default.</p>
                </div>
                <button className="button button-quiet" type="button">
                  Change avatar
                </button>
              </div>
              <div className="settings-form-grid">
                <label className="field">
                  <span>Display name</span>
                  <input
                    name="displayName"
                    value={profile.displayName}
                    onChange={(event) =>
                      setProfile((current) => ({ ...current, displayName: event.target.value }))
                    }
                    autoComplete="name"
                  />
                </label>
                <label className="field">
                  <span>Academic level</span>
                  <select defaultValue="undergraduate">
                    <option>Undergraduate</option>
                    <option>Graduate</option>
                    <option>Independent learner</option>
                  </select>
                </label>
                <label className="field">
                  <span>Language</span>
                  <select defaultValue="en">
                    <option>English</option>
                  </select>
                </label>
                <label className="field">
                  <span>Timezone</span>
                  <select defaultValue="asia-manila">
                    <option value="asia-manila">Asia/Manila (UTC+8)</option>
                    <option value="utc">UTC</option>
                  </select>
                </label>
              </div>
              <SaveButton onClick={saveProfile} />
            </SettingsSection>
          )}
          {section === "account" && (
            <SettingsSection
              eyebrow="Account & sign-in"
              title="Ways to get back in"
              description="Keep at least one verified recovery method active."
            >
              <div className="settings-list">
                <SettingRow
                  icon={<Mail size={18} />}
                  title={profile.email}
                  description="Email address · Verified"
                  action={<Pill tone="mint">Verified</Pill>}
                />
                <SettingRow
                  icon={<span className="google-g">G</span>}
                  title="Google"
                  description="Connected for sign-in only"
                  action={
                    <button
                      className="button button-quiet"
                      type="button"
                      onClick={() =>
                        setStatus("Google sign-in is available when a provider is configured.")
                      }
                    >
                      Disconnect
                    </button>
                  }
                />
                <SettingRow
                  icon={<KeyRound size={18} />}
                  title="Password"
                  description="Password managed by Supabase Auth"
                  action={
                    <Link className="button button-quiet" to="/forgot-password">
                      Change
                    </Link>
                  }
                />
              </div>
            </SettingsSection>
          )}
          {section === "security" && (
            <SettingsSection
              eyebrow="Security"
              title="Keep your account yours"
              description="Sensitive actions ask for deliberate confirmation before they change anything important."
            >
              <div className="security-callout">
                <ShieldCheck size={20} />
                <div>
                  <strong>Your account is in good shape.</strong>
                  <p>Your Supabase Auth session is active in this browser.</p>
                </div>
              </div>
              <SettingRow
                icon={<LogOut size={18} />}
                title="Current session"
                description="This browser · Current session"
                action={
                  <button className="button button-quiet" type="button" onClick={onSignOut}>
                    Sign out
                  </button>
                }
              />
              <SettingRow
                icon={<TimerReset size={18} />}
                title="Password reset"
                description="Send a fresh reset link to your verified email"
                action={
                  <Link className="button button-quiet" to="/forgot-password">
                    Send link
                  </Link>
                }
              />
            </SettingsSection>
          )}
          {section === "study" && (
            <SettingsSection
              eyebrow="Study preferences"
              title="Make the default feel like you"
              description="Small defaults help you start without making decisions every time."
            >
              <SettingsToggle
                title="Daily goal"
                description="Keep a gentle target visible on Today."
                enabled
                onChange={() => setStatus("Study preference updated.")}
              />
              <label className="field">
                <span>Default session length</span>
                <select defaultValue="25">
                  <option>15 minutes</option>
                  <option>25 minutes</option>
                  <option>45 minutes</option>
                </select>
              </label>
              <SaveButton onClick={() => setStatus("Study preferences saved.")} />
            </SettingsSection>
          )}
          {section === "notifications" && (
            <SettingsSection
              eyebrow="Notifications"
              title="Only the useful nudges"
              description="Aralivo does not send marketing email by default."
            >
              <SettingsToggle
                title="Email verification and security"
                description="Important account messages only."
                enabled
                onChange={() => setStatus("Notification preference updated.")}
              />
              <SettingsToggle
                title="Study reminders"
                description="A gentle reminder when you asked for one."
                enabled
                onChange={() => setStatus("Notification preference updated.")}
              />
            </SettingsSection>
          )}
          {section === "integrations" && (
            <SettingsSection
              eyebrow="Integrations"
              title="Optional connections"
              description="Every provider is isolated. Your core study loop works without them."
            >
              <IntegrationRow
                name="Google Calendar"
                detail="Not connected · configure OAuth to enable"
                action="Connect"
                disabled
              />
              <IntegrationRow name="Open Library" detail="Available · low-volume" action="View" />
              <IntegrationRow name="OpenAlex" detail="Not configured" action="Learn" disabled />
              <IntegrationRow
                name="AI assistant"
                detail="Disabled · no key configured"
                action="Learn"
                disabled
              />
              <IntegrationRow
                name="Stellar receipts"
                detail="Testnet ready · opt-in"
                action="Open"
              />
            </SettingsSection>
          )}
          {section === "receipts" && (
            <SettingsSection
              eyebrow="Receipts"
              title="Decide what is worth keeping"
              description="Receipts are learning records, not degrees or official credentials."
            >
              <SettingsToggle
                title="Issue privacy-safe receipts"
                description="Never includes notes, answers, grades, email, or school records."
                enabled={Boolean(profile.receiptsEnabled)}
                onChange={(enabled) => void updateReceiptPreference(enabled)}
              />
              <Notice
                tone="info"
                title="Testnet first"
                text="Receipt registration is isolated behind a server-side adapter and never blocks study, practice, or planner features."
              />
            </SettingsSection>
          )}
          {section === "privacy" && (
            <SettingsSection
              eyebrow="Privacy & data"
              title="Take your data with you"
              description="Exports are private downloads. Clearing local data removes this device’s saved snapshot."
            >
              <SettingRow
                icon={<FileDown size={18} />}
                title="Export data"
                description="Download your profile, progress, tasks, and notes."
                action={
                  <button className="button button-quiet" type="button" onClick={exportData}>
                    Export JSON
                  </button>
                }
              />
              <SettingRow
                icon={<Trash2 size={18} />}
                title="Clear local data"
                description="Remove offline snapshots from this browser."
                action={
                  <button className="button button-quiet" type="button" onClick={clearLocalData}>
                    Clear
                  </button>
                }
              />
              <SettingRow
                icon={<LogOut size={18} />}
                title="Sign out"
                description="End this browser session."
                action={
                  <button className="button button-quiet" type="button" onClick={onSignOut}>
                    Sign out
                  </button>
                }
              />
            </SettingsSection>
          )}
          {section === "appearance" && (
            <SettingsSection
              eyebrow="Appearance & accessibility"
              title="Make it easier to stay with"
              description="The visual system stays calm, with stronger contrast and less motion when you need it."
            >
              <SettingsToggle
                title="Reduced motion"
                description="Use quieter transitions and no progress animation."
                enabled={false}
                onChange={() => setStatus("Reduced motion preference updated.")}
              />
              <SettingsToggle
                title="High contrast support"
                description="System forced-colors preferences are respected."
                enabled
                onChange={() => setStatus("High contrast support is enabled.")}
              />
            </SettingsSection>
          )}
          {section === "danger" && (
            <SettingsSection
              eyebrow="Danger zone"
              title="Irreversible actions"
              description="These actions need deliberate confirmation and cannot be undone."
            >
              <div className="danger-zone">
                <div>
                  <h3>Delete account</h3>
                  <p>This permanently removes your account, notes, progress, and integrations.</p>
                </div>
                <button
                  className="button button-danger"
                  type="button"
                  onClick={() => setDialog(true)}
                >
                  <Trash2 size={16} /> Delete account
                </button>
              </div>
            </SettingsSection>
          )}
        </main>
      </div>
      {dialog && (
        <ConfirmDialog
          onClose={() => setDialog(false)}
          onConfirm={() => {
            [
              "aralivo-auth",
              "aralivo-profile",
              `aralivo-notes-${profile.email}`,
              `aralivo-planner-${profile.email}`,
              `aralivo-focus-${profile.email}`,
            ].forEach((key) => window.localStorage.removeItem(key));
            setDialog(false);
            onSignOut();
          }}
        />
      )}
    </div>
  );
}

function SettingsPageLegacy({ onSignOut }: { onSignOut: () => void }) {
  const [section, setSection] = useState("profile");
  const [saved, setSaved] = useState("Saved");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [dialog, setDialog] = useState(false);
  const sections = [
    { id: "profile", label: "Profile", icon: UserRound },
    { id: "account", label: "Account & sign-in", icon: KeyRound },
    { id: "security", label: "Security", icon: ShieldCheck },
    { id: "study", label: "Study preferences", icon: Target },
    { id: "notifications", label: "Notifications", icon: Mail },
    { id: "integrations", label: "Integrations", icon: Link2 },
    { id: "receipts", label: "Receipts", icon: ShieldCheck },
    { id: "privacy", label: "Privacy & data", icon: LockKeyhole },
    { id: "appearance", label: "Appearance", icon: Sparkles },
    { id: "danger", label: "Danger zone", icon: Trash2 },
  ];
  const update = () => {
    setSaved("Saving…");
    window.setTimeout(() => setSaved("Saved just now"), 600);
  };
  return (
    <div className="settings-page">
      <PageHeader
        eyebrow="Your space, your choices"
        title="Settings"
        description="Keep the important controls findable, and the sensitive ones deliberate."
      />
      <div className="settings-layout">
        <aside className="settings-nav" aria-label="Settings sections">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={
                section === id
                  ? "settings-nav-item active"
                  : `settings-nav-item ${id === "danger" ? "danger-link" : ""}`
              }
              onClick={() => {
                setSection(id);
                window.history.replaceState(null, "", `/settings#${id}`);
              }}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </aside>
        <main className="settings-content">
          <div className="settings-save-state" role="status">
            <span className="sync-dot" /> {saved}
          </div>
          {section === "profile" && (
            <SettingsSection
              eyebrow="Profile"
              title="How Aralivo knows you"
              description="These details shape your workspace, not your public identity."
            >
              <div className="profile-row">
                <div className="avatar avatar-large">JS</div>
                <div>
                  <strong>Jamie Santos</strong>
                  <p className="muted-copy">Profile initials are used by default.</p>
                </div>
                <button className="button button-quiet">Change avatar</button>
              </div>
              <div className="settings-form-grid">
                <label className="field">
                  <span>Display name</span>
                  <input defaultValue="Jamie Santos" onChange={update} />
                </label>
                <label className="field">
                  <span>Academic level</span>
                  <select defaultValue="undergraduate" onChange={update}>
                    <option value="undergraduate">Undergraduate</option>
                    <option value="graduate">Graduate</option>
                    <option value="independent">Independent learner</option>
                  </select>
                </label>
                <label className="field">
                  <span>Language</span>
                  <select defaultValue="en" onChange={update}>
                    <option value="en">English</option>
                  </select>
                </label>
                <label className="field">
                  <span>Timezone</span>
                  <select defaultValue="asia-manila" onChange={update}>
                    <option value="asia-manila">Asia/Manila (UTC+8)</option>
                    <option value="utc">UTC</option>
                  </select>
                </label>
              </div>
              <SaveButton onClick={update} />
            </SettingsSection>
          )}
          {section === "account" && (
            <SettingsSection
              eyebrow="Account & sign-in"
              title="Ways to get back in"
              description="Keep at least one verified recovery method active."
            >
              <div className="settings-list">
                <SettingRow
                  icon={<Mail size={18} />}
                  title="jamie@example.com"
                  description="Email address · Verified"
                  action={<Pill tone="mint">Verified</Pill>}
                />
                <SettingRow
                  icon={<span className="google-g">G</span>}
                  title="Google"
                  description="Connected for sign-in only"
                  action={<button className="button button-quiet">Disconnect</button>}
                />
                <SettingRow
                  icon={<KeyRound size={18} />}
                  title="Password"
                  description="Last changed 14 days ago"
                  action={<button className="button button-quiet">Change</button>}
                />
              </div>
            </SettingsSection>
          )}
          {section === "security" && (
            <SettingsSection
              eyebrow="Security"
              title="Keep your account yours"
              description="Sensitive actions ask for re-authentication before they change anything important."
            >
              <div className="security-callout">
                <ShieldCheck size={20} />
                <div>
                  <strong>Your account is in good shape.</strong>
                  <p>No unusual activity detected in the last 30 days.</p>
                </div>
              </div>
              <SettingRow
                icon={<LogOut size={18} />}
                title="Active sessions"
                description="This browser · Current session"
                action={<button className="button button-quiet">Sign out others</button>}
              />
              <SettingRow
                icon={<TimerReset size={18} />}
                title="Password reset"
                description="Send a fresh reset link to your verified email"
                action={<button className="button button-quiet">Send link</button>}
              />
            </SettingsSection>
          )}
          {section === "study" && (
            <SettingsSection
              eyebrow="Study preferences"
              title="Make the default feel like you"
              description="Small defaults help you start without making decisions every time."
            >
              <SettingsToggle
                title="Daily goal"
                description="Keep a gentle target visible on Today."
                enabled
                onChange={update}
              />
              <label className="field">
                <span>Default session length</span>
                <select defaultValue="25" onChange={update}>
                  <option value="15">15 minutes</option>
                  <option value="25">25 minutes</option>
                  <option value="45">45 minutes</option>
                </select>
              </label>
              <label className="field">
                <span>Preferred study time</span>
                <select defaultValue="morning" onChange={update}>
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                </select>
              </label>
              <SaveButton onClick={update} />
            </SettingsSection>
          )}
          {section === "notifications" && (
            <SettingsSection
              eyebrow="Notifications"
              title="Only the useful nudges"
              description="Aralivo does not send marketing email by default."
            >
              <SettingsToggle
                title="Email verification and security"
                description="Important account messages only."
                enabled
                onChange={update}
              />
              <SettingsToggle
                title="Study reminders"
                description="A gentle reminder when you asked for one."
                enabled
                onChange={update}
              />
              <SettingsToggle
                title="Calendar notifications"
                description="Only for events you explicitly export or create."
                enabled={false}
                onChange={update}
              />
            </SettingsSection>
          )}
          {section === "integrations" && (
            <SettingsSection
              eyebrow="Integrations"
              title="Optional connections"
              description="Every provider is isolated. Your core study loop works without them."
            >
              <IntegrationRow name="Google Calendar" detail="Not connected" action="Connect" />
              <IntegrationRow name="Open Library" detail="Available · low-volume" action="View" />
              <IntegrationRow name="OpenAlex" detail="Not configured" action="Learn" />
              <IntegrationRow
                name="AI assistant"
                detail="Disabled · no key configured"
                action="Learn"
              />
              <IntegrationRow
                name="Stellar receipts"
                detail="Testnet ready · opt-in"
                action="Open"
              />
            </SettingsSection>
          )}
          {section === "receipts" && (
            <SettingsSection
              eyebrow="Receipts"
              title="Decide what is worth keeping"
              description="Receipts are learning records, not degrees or official credentials."
            >
              <SettingsToggle
                title="Issue privacy-safe receipts"
                description="Never includes notes, answers, grades, email, or school records."
                enabled={false}
                onChange={update}
              />
              <Notice
                tone="info"
                title="Testnet first"
                text="Receipt registration is isolated behind a server-side adapter and never blocks study, practice, or planner features."
              />
            </SettingsSection>
          )}
          {section === "privacy" && (
            <SettingsSection
              eyebrow="Privacy & data"
              title="Take your data with you"
              description="Exports are private downloads. Clearing local data removes this device’s saved snapshot."
            >
              <SettingRow
                icon={<FileDown size={18} />}
                title="Export data"
                description="Download your profile, progress, tasks, and notes."
                action={<button className="button button-quiet">Export JSON</button>}
              />
              <SettingRow
                icon={<Trash2 size={18} />}
                title="Clear local data"
                description="Remove offline snapshots from this browser."
                action={<button className="button button-quiet">Clear</button>}
              />
              <SettingRow
                icon={<LogOut size={18} />}
                title="Sign out"
                description="Private local state is cleared by default."
                action={
                  <button className="button button-quiet" onClick={onSignOut}>
                    Sign out
                  </button>
                }
              />
            </SettingsSection>
          )}
          {section === "appearance" && (
            <SettingsSection
              eyebrow="Appearance & accessibility"
              title="Make it easier to stay with"
              description="The visual system stays calm, with stronger contrast and less motion when you need it."
            >
              <SettingsToggle
                title="Reduced motion"
                description="Use quieter transitions and no progress animation."
                enabled={reducedMotion}
                onChange={() => {
                  setReducedMotion((value) => !value);
                  update();
                }}
              />
              <SettingsToggle
                title="High contrast support"
                description="System forced-colors preferences are respected."
                enabled
                onChange={update}
              />
              <div className="theme-options">
                <button className="theme-option active">
                  <span className="theme-swatch swatch-system" /> System
                </button>
                <button className="theme-option">
                  <span className="theme-swatch swatch-light" /> Light
                </button>
                <button className="theme-option">
                  <span className="theme-swatch swatch-clay" /> Study clay
                </button>
              </div>
            </SettingsSection>
          )}
          {section === "danger" && (
            <SettingsSection
              eyebrow="Danger zone"
              title="Irreversible actions"
              description="These actions need deliberate confirmation and cannot be undone."
            >
              <div className="danger-zone">
                <div>
                  <h3>Delete account</h3>
                  <p>
                    This permanently removes your account, notes, progress, and integrations.
                    Receipts already registered on a public network cannot be edited, but they
                    contain no direct identity.
                  </p>
                </div>
                <button className="button button-danger" onClick={() => setDialog(true)}>
                  <Trash2 size={16} /> Delete account
                </button>
              </div>
            </SettingsSection>
          )}
        </main>
      </div>
      {dialog && (
        <ConfirmDialog
          onClose={() => setDialog(false)}
          onConfirm={() => {
            setDialog(false);
            onSignOut();
          }}
        />
      )}
    </div>
  );
}
function SettingsSection({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="settings-section">
      <div className="settings-section-head">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {children}
    </section>
  );
}
function SaveButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="settings-actions">
      <button className="button button-dark" onClick={onClick}>
        Save changes <Check size={16} />
      </button>
    </div>
  );
}
function SettingRow({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: React.ReactNode;
}) {
  return (
    <div className="setting-row">
      <span className="setting-icon">{icon}</span>
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
      <div>{action}</div>
    </div>
  );
}
function SettingsToggle({
  title,
  description,
  enabled,
  onChange,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}) {
  const [value, setValue] = useState(enabled);
  return (
    <div className="setting-row">
      <span className="setting-icon">
        <CheckCircle2 size={18} />
      </span>
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
      <button
        className={value ? "toggle active" : "toggle"}
        onClick={() => {
          const nextValue = !value;
          setValue(nextValue);
          onChange(nextValue);
        }}
        role="switch"
        aria-checked={value}
        aria-label={title}
      >
        <span />
      </button>
    </div>
  );
}
function IntegrationRow({
  name,
  detail,
  action,
  disabled = false,
}: {
  name: string;
  detail: string;
  action: string;
  disabled?: boolean;
}) {
  return (
    <div className="setting-row">
      <span className="setting-icon">
        <Link2 size={18} />
      </span>
      <div>
        <strong>{name}</strong>
        <p>{detail}</p>
      </div>
      <button className="button button-quiet" disabled={disabled} aria-label={`${action} ${name}`}>
        {action}
      </button>
    </div>
  );
}
function ConfirmDialog({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  const [typed, setTyped] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>("button, input"),
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);
  return (
    <div className="dialog-backdrop" role="presentation">
      <div
        className="dialog"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        aria-describedby="delete-description"
      >
        <button className="dialog-close icon-button" onClick={onClose} aria-label="Close dialog">
          <X size={18} />
        </button>
        <div className="danger-orb small">
          <Trash2 size={22} />
        </div>
        <p className="eyebrow">This cannot be undone</p>
        <h2 id="delete-title">Delete your Aralivo space?</h2>
        <p id="delete-description">
          Your profile, learning history, private notes, and integrations will be permanently
          removed. Type <strong>DELETE</strong> to continue.
        </p>
        <input
          ref={inputRef}
          className="dialog-input"
          value={typed}
          onChange={(event) => setTyped(event.target.value)}
          placeholder="Type DELETE"
          aria-label="Type DELETE to confirm"
        />
        <div className="dialog-actions">
          <button className="button button-quiet" onClick={onClose}>
            Keep my space
          </button>
          <button
            className="button button-danger"
            disabled={typed !== "DELETE"}
            onClick={onConfirm}
          >
            Delete permanently
          </button>
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="route-loading">
            <span className="loading-spinner" /> Loading your space…
          </div>
        }
      >
        <App />
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
);
