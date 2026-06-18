# Frontend Playbook

## Add a New Page/Route
1. Add route file in correct group under `src/routes`.
2. Use existing layout patterns and guard boundaries.
3. Add loading + error + empty UI states.
4. Add/adjust nav entry only when route is ready (or mark as coming soon).
5. Add required i18n keys in both locales.

## Add Data Read
1. Add/extend endpoint function in `lib/api/endpoints/<feature>.api.ts`.
2. If reusable, wrap in router `query(...)`.
3. Consume in route using `createAsync(...)`.
4. Keep typed response contracts updated.

## Add Mutation
1. Add endpoint write call in API module.
2. Add route-level `action(...)` wrapper.
3. Trigger with `useAction`; track with `useSubmission`.
4. Handle success, stale conflict, and error feedback.
5. Revalidate affected queries.

## Add Form
1. Define/extend zod schema and form contracts.
2. Reuse UI primitives (`Input`, `Textarea`, `Select`, etc.).
3. Keep submission and validation states explicit.
4. Keep user-facing messages in i18n keys.

## Add/Change Order UI Behavior
1. Confirm backend descriptor/state contract first.
2. Update display helpers in `lib/orders/order-display.utils.ts`.
3. Keep timeline/tracking/status badge behavior aligned.
4. Ensure seller and buyer views remain consistent for shared states.

## Add/Adjust Sidebar/Nav
1. Edit config/layout source of truth.
2. Ensure no enabled dead links.
3. Preserve route matching behavior (exact/prefix/query-param-aware where needed).
4. Keep labels localized.

## Pre-PR Checklist
- `npm run build`
- No TS/lint regressions in touched files
- Query/action usage follows conventions
- i18n keys updated in both locales
- Navigation/routes aligned with implementation state
- No auth/session/locale regression
