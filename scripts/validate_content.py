"""Validate explicit lesson/question files without generating content."""
from pathlib import Path
import json
import sys

from api.content.validators import parse_question_json, validate_lesson_markdown


def main() -> int:
    root = Path("data/seed")
    errors = 0
    for lesson in root.glob("lessons/**/lesson.md"):
        issues = validate_lesson_markdown(lesson.read_text(encoding="utf-8"))
        for issue in issues:
            print(json.dumps({"file": str(lesson), **issue.model_dump()}))
        errors += len(issues)
    for question_file in root.glob("questions/**/questions.json"):
        _, issues = parse_question_json(question_file.read_text(encoding="utf-8"))
        for issue in issues:
            print(json.dumps({"file": str(question_file), **issue.model_dump()}))
        errors += len(issues)
    print(json.dumps({"valid": errors == 0, "errors": errors}))
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
