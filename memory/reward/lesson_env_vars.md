# Reward Lesson: Using Public URLs via Env Variables

## Correct Action
Setting asset image URLs to prioritize `env.R2_PUBLIC_URL` or `env.PUBLIC_URL` in backend/worker scripts before building relative or local paths.

## Reason
Guarantees that generated absolute URLs won’t depend on local hosting for images or items. The images will render correctly on both developer and production/live environments natively.

## Implementation Habit
When managing absolute URLs:
1. Always add `env.R2_PUBLIC_URL` parameter in lookup before propagating to Firestore or response bodies.
2. If `env.R2_PUBLIC_URL` contains a value, use it instead of generating URLs derived from `origin` headers.
