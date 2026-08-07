from __future__ import annotations

import json
import re
from pydantic import BaseModel


class ValidationIssue(BaseModel):
    code: str
    message: str
    path: str = ""
    line: int | None = None


MODERN_REQUIRED_HEADINGS = [
    "## Why this matters",
    "## Learning outcomes",
    "## Before you begin",
    "## Vocabulary",
    "## Key ideas",
    "## Worked example",
    "## Common confusions",
    "## Apply it",
    "## Recall",
    "## Reflection or transfer",
    "## Further study",
    "## Sources and provenance",
    "## Rights and originality",
]
LEGACY_REQUIRED_HEADINGS = ["## Learning outcomes", "## Read", "## Worked example", "## Recall prompts", "## Practice handoff"]


def validate_lesson_markdown(markdown: str) -> list[ValidationIssue]:
    issues: list[ValidationIssue] = []
    if not markdown.strip():
        return [ValidationIssue(code="EMPTY", message="Lesson Markdown is empty.", path="markdown")]
    if not markdown.startswith("---"):
        issues.append(ValidationIssue(code="FRONT_MATTER_REQUIRED", message="Start the lesson with YAML front matter.", path="front_matter"))
    else:
        closing = markdown.find("\n---", 3)
        if closing < 0:
            issues.append(ValidationIssue(code="FRONT_MATTER_UNCLOSED", message="YAML front matter must close with a second --- line.", path="front_matter"))
        else:
            front = markdown[3:closing]
            required = ["lesson_id", "slug", "course_slug", "unit_slug", "status", "language", "level", "duration_minutes", "outcome_ids", "source_basis", "rights_review", "license_status"]
            for field in required:
                if not re.search(rf"^{re.escape(field)}\s*:", front, re.MULTILINE):
                    issues.append(ValidationIssue(code="FIELD_REQUIRED", message=f"Required front matter field: {field}.", path=f"front_matter.{field}"))
            if not re.search(r"quoted_text\s*:\s*false\b", front, re.IGNORECASE):
                issues.append(ValidationIssue(code="QUOTED_TEXT_NOT_ALLOWED", message="Learner lessons must declare quoted_text: false.", path="front_matter.quoted_text"))
            claim_text = re.sub(r"https?://\S+", "", markdown)
            if re.search(r"\bCHED\b|approved curriculum|official grade", claim_text, re.IGNORECASE):
                issues.append(ValidationIssue(code="UNSUPPORTED_CLAIM", message="Remove unsupported CHED, approval, or grading claims.", path="markdown"))
            if re.search(r"<!--.*answer|answer key", markdown, re.IGNORECASE | re.DOTALL):
                issues.append(ValidationIssue(code="ANSWER_KEY_HIDDEN", message="Do not hide answer keys in learner-facing Markdown.", path="markdown"))
            if re.search(r"http://", front):
                issues.append(ValidationIssue(code="HTTPS_REQUIRED", message="Source URLs must use HTTPS.", path="front_matter.source_basis"))
    modern_complete = all(heading in markdown for heading in MODERN_REQUIRED_HEADINGS)
    legacy_complete = all(heading in markdown for heading in LEGACY_REQUIRED_HEADINGS)
    if not modern_complete and not legacy_complete:
        for heading in MODERN_REQUIRED_HEADINGS:
            if heading not in markdown:
                issues.append(ValidationIssue(code="HEADING_REQUIRED", message=f"Required section heading: {heading}.", path="headings"))
    if len(markdown.splitlines()) < 24:
        issues.append(ValidationIssue(code="CONTENT_TOO_SHORT", message="Lesson content should include enough explanation, an example, recall, and a handoff.", path="markdown"))
    return issues


def validate_question_bank(question_bank: dict) -> list[ValidationIssue]:
    issues: list[ValidationIssue] = []
    if not isinstance(question_bank, dict):
        return [ValidationIssue(code="JSON_OBJECT_REQUIRED", message="Question bank must be a JSON object.", path="root")]
    for key in ("bank_id", "lesson_id", "content_version", "questions"):
        if key not in question_bank:
            issues.append(ValidationIssue(code="FIELD_REQUIRED", message=f"Required question-bank field: {key}.", path=key))
    questions = question_bank.get("questions", [])
    if not isinstance(questions, list):
        return issues + [ValidationIssue(code="QUESTIONS_ARRAY_REQUIRED", message="questions must be an array.", path="questions")]
    if not 36 <= len(questions) <= 54:
        issues.append(ValidationIssue(code="QUESTION_COUNT", message="A bank should contain 45 questions; 36–54 requires an editorial note.", path="questions"))
    ids = [item.get("id") for item in questions if isinstance(item, dict)]
    if len(ids) != len(set(ids)):
        issues.append(ValidationIssue(code="DUPLICATE_QUESTION_ID", message="Question IDs must be unique.", path="questions"))
    prompts = [item.get("prompt", "").strip().casefold() for item in questions if isinstance(item, dict)]
    if len(prompts) != len(set(prompts)):
        issues.append(ValidationIssue(code="DUPLICATE_PROMPT", message="Question prompts must be unique.", path="questions"))
    valid_types = {"multiple_choice", "multiple_select", "multi_select", "true_false", "fill_blank", "short_answer", "matching", "ordering", "scenario"}
    types = set()
    for index, item in enumerate(questions):
        path = f"questions[{index}]"
        if not isinstance(item, dict):
            issues.append(ValidationIssue(code="QUESTION_OBJECT_REQUIRED", message="Each question must be an object.", path=path))
            continue
        types.add(item.get("type"))
        for key in ("id", "type", "prompt", "outcome_id", "skill", "cognitive_level", "difficulty", "explanation", "misconception", "source_basis", "originality_note"):
            if key not in item:
                issues.append(ValidationIssue(code="FIELD_REQUIRED", message=f"Required question field: {key}.", path=f"{path}.{key}"))
        if "estimated_seconds" not in item and "estimated_time_seconds" not in item:
            issues.append(ValidationIssue(code="FIELD_REQUIRED", message="Required question field: estimated_seconds.", path=f"{path}.estimated_seconds"))
        if item.get("type") not in valid_types:
            issues.append(ValidationIssue(code="QUESTION_TYPE", message=f"Unsupported question type: {item.get('type')}.", path=f"{path}.type"))
        if "answer" not in item:
            issues.append(ValidationIssue(code="ANSWER_SHAPE_REQUIRED", message="Validated source JSON may contain an answer shape server-side.", path=f"{path}.answer"))
    if len(types) < 6:
        issues.append(ValidationIssue(code="TYPE_DIVERSITY", message="Use at least six distinct question types.", path="questions"))
    return issues


def parse_question_json(raw: str) -> tuple[dict | None, list[ValidationIssue]]:
    try:
        data = json.loads(raw)
    except json.JSONDecodeError as exc:
        return None, [ValidationIssue(code="INVALID_JSON", message="Question bank is not valid UTF-8 JSON.", line=exc.lineno)]
    return data, validate_question_bank(data)
