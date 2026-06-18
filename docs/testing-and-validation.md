# Frontend Testing and Validation

## Baseline Commands
- Build: `npm run build`
- Tests:
  - `npm run test`
  - `npm run test:run`
  - `npm run test:coverage` (as needed)

## Validation by Change Type

### Route/layout changes
- Route resolves correctly from URL
- Loading and error boundaries still work
- Protected/auth redirects still behave as expected

### Query/data changes
- Read path uses query/createAsync pattern
- Empty and loading states render correctly
- Error path shows actionable fallback or message

### Mutation/action changes
- Buttons/forms show pending state
- Success feedback appears
- Error/stale conflict path handled
- Revalidation updates stale UI

### i18n changes
- Keys present in both `en.ts` and `bn.ts`
- Dynamic strings render with expected interpolation pattern

### Navigation changes
- Enabled links map to real routes
- Disabled/upcoming items remain non-breaking
- Active-state matching is correct for path/query filters

## PR Readiness Checklist
- Build passes
- No TS/lint regressions in touched files
- Query/action conventions preserved
- API calls still use shared fetcher
- i18n coverage complete for new text
