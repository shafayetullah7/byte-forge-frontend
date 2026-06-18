# ADR-0001: Query/Action Separation and Feature Rollout UX

## Status
Accepted

## Context
Frontend routes mix read-heavy dashboards and write-heavy workflows (orders, checkout, seller operations).
Without strict patterns, data flow becomes inconsistent and navigation can expose unfinished features prematurely.

## Decision
1. Read operations use router query/createAsync.
2. Write operations use router action/useAction/useSubmission.
3. Shared API fetcher remains the single transport path.
4. Incomplete features can exist as routes but should use explicit upcoming-feature UX and controlled nav exposure.

## Consequences
- Clearer data flow and fewer stale-state bugs.
- Consistent pending/success/error handling for mutations.
- Lower navigation confusion for partially rolled-out feature areas.
