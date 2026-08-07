from __future__ import annotations

import random
from enum import Enum


class AssessmentScope(str, Enum):
    lesson_practice = "lesson_practice"
    unit_review = "unit_review"
    final_exam = "final_exam"


SCOPE_SIZES = {AssessmentScope.lesson_practice: 15, AssessmentScope.unit_review: 30, AssessmentScope.final_exam: 50}


class AssessmentSelectionError(ValueError):
    pass


def select_questions(bank: dict, scope: AssessmentScope, outcomes: list[str], recently_seen_ids: list[str], seed: int) -> list[dict]:
    questions = bank.get("questions", [])
    required = SCOPE_SIZES[scope]
    if len(questions) < required:
        raise AssessmentSelectionError(f"This {scope.value.replace('_', ' ')} needs {required} validated questions; the pool has {len(questions)}.")
    if len({item.get("id") for item in questions}) != len(questions):
        raise AssessmentSelectionError("Question IDs must be unique before an assessment can start.")
    rng = random.Random(seed)
    unseen = [item for item in questions if item.get("id") not in recently_seen_ids]
    pool = unseen if len(unseen) >= required else questions
    by_outcome: dict[str, list[dict]] = {outcome: [] for outcome in outcomes}
    for item in pool:
        if item.get("outcome_id") in by_outcome:
            by_outcome[item["outcome_id"]].append(item)
    chosen: list[dict] = []
    for outcome in outcomes:
        options = by_outcome[outcome]
        if not options:
            raise AssessmentSelectionError(f"No validated question covers outcome {outcome}.")
        chosen.append(rng.choice(options))
    chosen_ids = {item["id"] for item in chosen}
    remainder = [item for item in pool if item.get("id") not in chosen_ids]
    rng.shuffle(remainder)
    chosen.extend(remainder[: required - len(chosen)])
    rng.shuffle(chosen)
    return chosen
