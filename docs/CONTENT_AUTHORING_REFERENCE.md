# Content authoring reference

This file preserves the authoring contract without generating content.

## Lesson Markdown path

`data/seed/lessons/{subject-slug}/{unit-slug}/{lesson-slug}/lesson.md`

Required front matter includes stable lesson ID, slug/course/unit consistency, status, language, level, duration, outcome IDs, source basis, HTTPS URLs, `quoted_text: false`, provenance, rights-review status, and license status. Required sections are learning outcomes, reading content, worked example, recall prompts, and practice handoff. Validators reject hidden answer keys, unsupported CHED claims, unverified source claims, personal data, and insufficient content.

## Question JSON path

`data/seed/questions/{course-slug}/{unit-slug}/{lesson-slug}/questions.json`

The top-level object carries bank identity, lesson identity, content version, and questions. Each item requires a stable ID, type, outcome, skill, cognitive level, difficulty, estimated time, tags, valid answer shape, explanation, misconception, source basis, and originality note. At least six question types, outcome coverage, realistic distractors, valid matching/ordering/fill-blank/short-answer structures, and no duplicate prompts are required.

Default editorial target: 45 questions per lesson. The validator supports 36–54 only with an editorial note. Selection sizes are 15, 30, and 50; a pool is never duplicated to fill an assessment.

No concrete lesson Markdown or question-bank JSON file is generated in this repository.
