"""Create the private learning workspace schema."""
from alembic import op
import sqlalchemy as sa

revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


USER_TABLES = [
    ("profiles", [sa.Column("id", sa.UUID(), primary_key=True), sa.Column("user_id", sa.UUID(), nullable=False, unique=True), sa.Column("display_name", sa.Text()), sa.Column("timezone", sa.Text()), sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("now()"), nullable=False)]),
    ("auth_sessions", [sa.Column("id", sa.UUID(), primary_key=True), sa.Column("user_id", sa.UUID(), nullable=False), sa.Column("refresh_token_hash", sa.Text(), nullable=False), sa.Column("expires_at", sa.TIMESTAMP(timezone=True), nullable=False), sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("now()"), nullable=False)]),
    ("consents", [sa.Column("id", sa.UUID(), primary_key=True), sa.Column("user_id", sa.UUID(), nullable=False), sa.Column("consent_type", sa.Text(), nullable=False), sa.Column("version", sa.Text(), nullable=False), sa.Column("granted_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("now()"), nullable=False)]),
    ("terms", [sa.Column("id", sa.UUID(), primary_key=True), sa.Column("user_id", sa.UUID(), nullable=False), sa.Column("name", sa.Text(), nullable=False), sa.Column("starts_on", sa.Date()), sa.Column("ends_on", sa.Date())]),
    ("subjects", [sa.Column("id", sa.UUID(), primary_key=True), sa.Column("user_id", sa.UUID(), nullable=False), sa.Column("term_id", sa.UUID()), sa.Column("name", sa.Text(), nullable=False), sa.Column("course_code", sa.Text()), sa.Column("instructor", sa.Text()), sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("now()"), nullable=False)]),
    ("units", [sa.Column("id", sa.UUID(), primary_key=True), sa.Column("subject_id", sa.UUID(), nullable=False), sa.Column("title", sa.Text(), nullable=False), sa.Column("position", sa.Integer(), nullable=False)]),
    ("lessons", [sa.Column("id", sa.UUID(), primary_key=True), sa.Column("unit_id", sa.UUID(), nullable=False), sa.Column("stable_lesson_id", sa.Text(), nullable=False, unique=True), sa.Column("title", sa.Text(), nullable=False), sa.Column("content_version", sa.Text(), nullable=False), sa.Column("content_markdown", sa.Text(), nullable=False)]),
    ("lesson_progress", [sa.Column("id", sa.UUID(), primary_key=True), sa.Column("user_id", sa.UUID(), nullable=False), sa.Column("lesson_id", sa.UUID(), nullable=False), sa.Column("status", sa.Text(), nullable=False), sa.Column("progress_percent", sa.Integer(), nullable=False, server_default="0"), sa.Column("completed_at", sa.TIMESTAMP(timezone=True))]),
    ("study_tasks", [sa.Column("id", sa.UUID(), primary_key=True), sa.Column("user_id", sa.UUID(), nullable=False), sa.Column("subject_id", sa.UUID()), sa.Column("lesson_id", sa.UUID()), sa.Column("title", sa.Text(), nullable=False), sa.Column("due_at", sa.TIMESTAMP(timezone=True)), sa.Column("estimated_minutes", sa.Integer()), sa.Column("completed_at", sa.TIMESTAMP(timezone=True))]),
    ("flashcards", [sa.Column("id", sa.UUID(), primary_key=True), sa.Column("user_id", sa.UUID(), nullable=False), sa.Column("lesson_id", sa.UUID()), sa.Column("front", sa.Text(), nullable=False), sa.Column("back", sa.Text(), nullable=False), sa.Column("due_at", sa.TIMESTAMP(timezone=True)), sa.Column("review_count", sa.Integer(), nullable=False, server_default="0")]),
    ("question_banks", [sa.Column("id", sa.UUID(), primary_key=True), sa.Column("stable_bank_id", sa.Text(), nullable=False, unique=True), sa.Column("lesson_id", sa.UUID(), nullable=False), sa.Column("content_version", sa.Text(), nullable=False), sa.Column("status", sa.Text(), nullable=False)]),
    ("questions", [sa.Column("id", sa.UUID(), primary_key=True), sa.Column("question_bank_id", sa.UUID(), nullable=False), sa.Column("stable_question_id", sa.Text(), nullable=False, unique=True), sa.Column("learner_payload", sa.JSON(), nullable=False), sa.Column("answer_payload", sa.JSON(), nullable=False)]),
    ("quiz_attempts", [sa.Column("id", sa.UUID(), primary_key=True), sa.Column("user_id", sa.UUID(), nullable=False), sa.Column("scope", sa.Text(), nullable=False), sa.Column("seed", sa.BigInteger(), nullable=False), sa.Column("idempotency_key", sa.Text(), nullable=False, unique=True), sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("now()"), nullable=False)]),
    ("quiz_attempt_items", [sa.Column("id", sa.UUID(), primary_key=True), sa.Column("attempt_id", sa.UUID(), nullable=False), sa.Column("question_id", sa.UUID(), nullable=False), sa.Column("position", sa.Integer(), nullable=False), sa.Column("answer_payload", sa.JSON()), sa.Column("is_correct", sa.Boolean())]),
    ("focus_sessions", [sa.Column("id", sa.UUID(), primary_key=True), sa.Column("user_id", sa.UUID(), nullable=False), sa.Column("state", sa.Text(), nullable=False), sa.Column("started_at", sa.TIMESTAMP(timezone=True)), sa.Column("ended_at", sa.TIMESTAMP(timezone=True)), sa.Column("elapsed_seconds", sa.Integer()), sa.Column("idempotency_key", sa.Text(), nullable=False, unique=True)]),
    ("daily_check_ins", [sa.Column("id", sa.UUID(), primary_key=True), sa.Column("user_id", sa.UUID(), nullable=False), sa.Column("day", sa.Date(), nullable=False), sa.Column("minutes", sa.Integer(), nullable=False, server_default="0")]),
    ("milestones", [sa.Column("id", sa.UUID(), primary_key=True), sa.Column("user_id", sa.UUID(), nullable=False), sa.Column("milestone_type", sa.Text(), nullable=False), sa.Column("achieved_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("now()"), nullable=False)]),
    ("xp_events", [sa.Column("id", sa.UUID(), primary_key=True), sa.Column("user_id", sa.UUID(), nullable=False), sa.Column("idempotency_key", sa.Text(), nullable=False, unique=True), sa.Column("amount", sa.Integer(), nullable=False), sa.Column("reason", sa.Text(), nullable=False), sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("now()"), nullable=False)]),
    ("user_xp_totals", [sa.Column("user_id", sa.UUID(), primary_key=True), sa.Column("total_xp", sa.Integer(), nullable=False, server_default="0"), sa.Column("level", sa.Integer(), nullable=False, server_default="1")]),
    ("product_events", [sa.Column("id", sa.UUID(), primary_key=True), sa.Column("user_id", sa.UUID()), sa.Column("event_name", sa.Text(), nullable=False), sa.Column("safe_metadata", sa.JSON()), sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("now()"), nullable=False)]),
    ("external_resources", [sa.Column("id", sa.UUID(), primary_key=True), sa.Column("provider", sa.Text(), nullable=False), sa.Column("canonical_url", sa.Text(), nullable=False), sa.Column("metadata", sa.JSON(), nullable=False), sa.Column("expires_at", sa.TIMESTAMP(timezone=True))]),
    ("integration_connections", [sa.Column("id", sa.UUID(), primary_key=True), sa.Column("user_id", sa.UUID(), nullable=False), sa.Column("provider", sa.Text(), nullable=False), sa.Column("encrypted_refresh_token", sa.LargeBinary()), sa.Column("scopes", sa.JSON()), sa.Column("revoked_at", sa.TIMESTAMP(timezone=True))]),
    ("calendar_events", [sa.Column("id", sa.UUID(), primary_key=True), sa.Column("user_id", sa.UUID(), nullable=False), sa.Column("task_id", sa.UUID()), sa.Column("provider_event_id", sa.Text()), sa.Column("idempotency_key", sa.Text(), nullable=False, unique=True)]),
    ("learning_receipts", [sa.Column("id", sa.UUID(), primary_key=True), sa.Column("user_id", sa.UUID(), nullable=False), sa.Column("payload_hash", sa.Text(), nullable=False, unique=True), sa.Column("network", sa.Text(), nullable=False), sa.Column("transaction_id", sa.Text()), sa.Column("status", sa.Text(), nullable=False)]),
    ("receipt_verifications", [sa.Column("id", sa.UUID(), primary_key=True), sa.Column("receipt_id", sa.UUID(), nullable=False), sa.Column("verified_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("now()"), nullable=False), sa.Column("result", sa.JSON(), nullable=False)]),
    ("content_import_runs", [sa.Column("id", sa.UUID(), primary_key=True), sa.Column("source_path", sa.Text(), nullable=False), sa.Column("content_version", sa.Text(), nullable=False), sa.Column("status", sa.Text(), nullable=False), sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("now()"), nullable=False)]),
    ("content_validation_errors", [sa.Column("id", sa.UUID(), primary_key=True), sa.Column("import_run_id", sa.UUID(), nullable=False), sa.Column("code", sa.Text(), nullable=False), sa.Column("message", sa.Text(), nullable=False), sa.Column("path", sa.Text()), sa.Column("line", sa.Integer())]),
]


def upgrade() -> None:
    for name, columns in USER_TABLES:
        op.create_table(name, *columns)
    op.execute("CREATE INDEX IF NOT EXISTS ix_lesson_progress_user_id ON lesson_progress(user_id)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_xp_events_user_id ON xp_events(user_id)")
    for name, columns in USER_TABLES:
        if any(column.name == "user_id" for column in columns):
            op.execute(f"ALTER TABLE {name} ENABLE ROW LEVEL SECURITY")


def downgrade() -> None:
    for name, _ in reversed(USER_TABLES):
        op.drop_table(name)
