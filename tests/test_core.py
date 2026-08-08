from datetime import datetime, timezone

from api.content.validators import validate_lesson_markdown, validate_question_bank
from api.services.assessment import AssessmentScope, AssessmentSelectionError, select_questions
from api.services.receipts import build_receipt_payload, hash_receipt_payload
from api.services.xp import XpLedger


def question_bank(count=45):
    types = ["multiple_choice", "multi_select", "true_false", "fill_blank", "short_answer", "matching", "ordering", "scenario"]
    return {"bank_id": "bank-1", "lesson_id": "lesson-1", "content_version": "1", "questions": [{"id": f"q-{i}", "type": types[i % len(types)], "prompt": f"Prompt {i}", "outcome_id": f"o-{i % 3}", "skill": "sampling", "cognitive_level": "apply", "difficulty": "medium", "estimated_time_seconds": 45, "explanation": "Because.", "misconception": "A common shortcut.", "source_basis": ["https://example.com/source"], "originality_note": "Original practice item.", "answer": {"value": "server-only"}, "options": ["A", "B"]} for i in range(count)]}


def test_assessment_sizes_and_seeded_selection():
    bank = question_bank()
    selected = select_questions(bank, AssessmentScope.lesson_practice, ["o-0", "o-1", "o-2"], [], 7)
    assert len(selected) == 15
    assert {item["outcome_id"] for item in selected} >= {"o-0", "o-1", "o-2"}
    assert [item["id"] for item in selected] == [item["id"] for item in select_questions(bank, AssessmentScope.lesson_practice, ["o-0", "o-1", "o-2"], [], 7)]
    assert len(select_questions(bank, AssessmentScope.unit_review, ["o-0", "o-1", "o-2"], [], 7)) == 30


def test_insufficient_pool_fails_without_duplication():
    try:
        select_questions(question_bank(20), AssessmentScope.final_exam, ["o-0"], [], 7)
    except AssessmentSelectionError as error:
        assert "50" in str(error)
    else:
        raise AssertionError("Expected insufficient question pool to fail")


def test_xp_is_idempotent():
    ledger = XpLedger()
    assert ledger.award("focus-1", 25, "focus_session") == 25
    assert ledger.award("focus-1", 25, "focus_session") == 0
    assert ledger.total == 25


def test_receipt_hash_is_stable_and_privacy_safe():
    payload = build_receipt_payload({"learner_identifier": "user-secret", "content_identifier": "lesson-1", "achievement_type": "lesson_complete", "completed_at": datetime(2026, 8, 7, tzinfo=timezone.utc), "issuer_public_key": "GISSUER", "content_version": "1", "network": "testnet", "private_note": "never"})
    assert "private_note" not in payload
    assert hash_receipt_payload(payload) == hash_receipt_payload(dict(payload))


def test_receipt_milestone_scope_is_hashable_but_private_fields_stay_out():
    payload = build_receipt_payload({
        "schema_version": "2",
        "milestone_scope": "unit",
        "learner_identifier": "user-secret",
        "content_identifier": "unit:ethics.foundations",
        "achievement_type": "unit_completed",
        "completed_at": datetime(2026, 8, 7, tzinfo=timezone.utc),
        "issuer_public_key": "GISSUER",
        "content_version": "catalog-v1",
        "network": "testnet",
        "private_note": "never",
    })
    assert payload["milestone_scope"] == "unit"
    assert "private_note" not in payload
    assert hash_receipt_payload(payload) != hash_receipt_payload({**payload, "milestone_scope": "course"})


def test_lesson_validator_rejects_hidden_answers():
    issues = validate_lesson_markdown("---\nquoted_text: false\n---\n<!-- answer key -->")
    assert any(issue.code == "ANSWER_KEY_HIDDEN" for issue in issues)


def test_question_validator_rejects_duplicate_ids():
    bank = question_bank()
    bank["questions"][1]["id"] = bank["questions"][0]["id"]
    issues = validate_question_bank(bank)
    assert any(issue.code == "DUPLICATE_QUESTION_ID" for issue in issues)
