---
description: ByteForge code quality, file sizing, naming conventions, and architecture standards
---

# ByteForge Code Quality Standard

This document defines the strict maintainability and architectural standards for the ByteForge frontend. Antigravity must adhere to these rules for all code generation and refactorings.

## 1. File Sizing and Organization
- **Sweet Spot (100–300 lines):** Target size for components/modules.
- **Danger Zone (>500 lines):** Technical debt. Must be split into sub-components or custom hooks.
- **Feature Folders:** Use `src/features/[feature-name]` to group components, hooks, and types related to one domain.

## 2. Component Composition (Explicit Examples)

### ✅ DO: Composition (The "Correct" Way)
Pass child elements to keep the base component simple and flexible.
```tsx
<Card variant="elevated">
  <CardHeader title="Order Summary" />
  <CardBody>
    <OrderList items={orders} />
  </CardBody>
  <CardFooter>
    <Button onClick={handleConfirm}>Confirm</Button>
  </CardFooter>
</Card>
```

### ❌ DON'T: Prop Explosion (The "Wrong" Way)
Avoid passing massive configuration props that force internal `if/else` logic.
```tsx
<Card 
  title="Order Summary" 
  items={orders} 
  showFooter={true} 
  onConfirm={handleConfirm}
  buttonText="Confirm"
  isElevated={true}
/>
```

## 3. Naming & Typing Standards

### Naming Conventions
- **Booleans:** Prefix with `is`, `has`, `should`, or `can`.
  - `isVisible`, `hasError`, `shouldRedirect`, `canEdit`.
- **Events:** 
  - Props: Prefix with `on` (`onClose`, `onUserUpdate`).
  - Internal Handlers: Prefix with `handle` (`handleClose`, `handleUserUpdate`).
- **Lists:** Use plural names (`users`, `orders`).

### TypeScript Standards
- **Components:** Use `interface` for props (allows extension).
- **Data/Unions:** Use `type` for complex unions or data structures.
- **Strictness:** No `any`. Use `unknown` or specific types.

## 4. Directory Mapping (Architecture)
| Directory | Content Rule |
| :--- | :--- |
| `src/components/ui` | "Dumb" components only. No business logic, no data fetching. |
| `src/features` | Domain-specific complex components and their related hooks/types. |
| `src/lib` | Configuration/wrappers for 3rd party libraries (axios, firebase). |
| `src/services` | Pure API logic. Should return data or throw errors, no UI. |
| `src/hooks` | Global, reusable hooks (e.g., `useWindowSize`, `useAuth`). |

## 5. Summary: High-Priority Do's and Don'ts

| Feature | ✅ DO | ❌ DON'T |
| :--- | :--- | :--- |
| **Logic** | Keep functions pure and small. | Write "God Functions" that do 5 different things. |
| **State** | Keep state local to the component. | Lift state to global stores "just in case." |
| **CSS** | Use the established design system tokens. | Hardcode hex colors or random pixel values. |
| **Files** | Name files exactly what they export. | Use generic names like `utils.ts` or `helpers.ts`. |
| **Constants** | Use `enums` for status and types. | Use magic strings like `if (status === 'active')`. |

## 6. Verification Checklist
Before finishing a task, Antigravity must check:
1. Is any file > 500 lines?
2. Are boolean variables correctly prefixed?
3. Is a "Smart" component doing too much "Dumb" UI styling?
4. Are all magic strings moved to a constant or enum?
