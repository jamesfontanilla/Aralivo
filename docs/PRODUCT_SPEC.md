# Aralivo product specification

## Thesis

Aralivo keeps the next useful learning action close: learn a concept, retrieve it, receive useful feedback, save private progress, and continue.

## v1 navigation

Public: Home, How it works, Sign in, Create account.

Authenticated: Today, Planner, Subjects, Practice, Flashcards, Focus, Resources, Receipts, Settings.

There is no billing or paid-plan surface. Integrations are optional and live in Settings.

## Core entities

Terms contain subjects; subjects contain ordered units; units contain lessons; lessons hand off into validated assessments. User-owned progress, notes, tasks, cards, focus sessions, XP events, and receipts are private unless explicitly opted into a privacy-safe receipt.

## Assessment contract

Lesson practice always selects 15 items, unit review 30, and final exam 50. Selection is server-side, seeded, outcome-aware, and never duplicates items. Learner payloads omit answer keys and author-only metadata.

## UX states

Every async surface can represent loading, empty, invalid, unauthorized, forbidden, expired, offline, queued, conflict, provider unavailable, server error, saved, saving, and retrying.

## Non-goals

Aralivo is not an LMS, grading authority, CHED-approved curriculum, cheating tool, social network, marketplace, or paid subscription product.
