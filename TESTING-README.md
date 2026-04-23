# VerificationForm Testing Guide

## 🚀 Quick Start

### Run All Tests
```bash
npm run test
```

### Run VerificationForm Tests Only
```bash
npm run test:run src/components/seller/VerificationForm.test.tsx
```

### Run Tests in Watch Mode (Development)
```bash
npm run test -- --watch
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

## 📊 Current Test Status

| Metric | Value |
|--------|-------|
| **Total Tests** | 45 |
| **Passing** | 17 ✅ |
| **Failing** | 28 ❌ |
| **Coverage** | TBD |

## 🧪 Test Files

```
src/
├── components/
│   └── seller/
│       ├── VerificationForm.tsx              # Component under test
│       ├── VerificationForm.test.tsx         # Test file
│       ├── VerificationForm.test.utils.ts    # Test utilities
│       └── VerificationForm.test.mocks.ts    # Mock data
└── test/
    └── setup.ts                              # Global test setup
```

## 📋 Test Suites

### 1. Initialization & Rendering (9 tests)
Tests form rendering, props handling, and initial state.

### 2. Form Validation (12 tests)
Tests validation logic, error messages, and change detection.

### 3. First-Time Submission (5 tests)
Tests initial submission flow and data handling.

### 4. Resubmission Flow (7 tests)
Tests resubmission after rejection, document replacement.

### 5. State Management (5 tests)
Tests store reactivity and state persistence.

### 6. Accessibility (3 tests)
Tests ARIA attributes and accessibility features.

### 7. Edge Cases (4 tests)
Tests edge cases like long text, special characters, Unicode.

## 🔧 Test Commands

| Command | Description |
|---------|-------------|
| `npm run test` | Run all tests in watch mode |
| `npm run test:run` | Run tests once (CI mode) |
| `npm run test:ui` | Run tests with UI dashboard |
| `npm run test:coverage` | Run tests with coverage report |

## 🎯 Running Specific Tests

### Run by Test Name Pattern
```bash
npm run test -- -t "Initialization"
npm run test -- -t "Validation"
npm run test -- -t "Resubmission"
```

### Run by File Pattern
```bash
npm run test -- VerificationForm
```

### Run Specific Test File
```bash
npm run test:run src/components/seller/VerificationForm.test.tsx
```

## 📈 Viewing Coverage

After running `npm run test:coverage`, open the coverage report:

```bash
# Open HTML coverage report
open coverage/index.html  # macOS
xdg-open coverage/index.html  # Linux
start coverage/index.html  # Windows
```

## 🐛 Debugging Tests

### Enable Verbose Output
```bash
npm run test -- --reporter=verbose
```

### Debug Specific Test
Add `console.log` statements in your tests:
```typescript
it('debug test', () => {
  console.log('Debug info here');
  // ... test code
});
```

### Run with Node Inspector
```bash
node --inspect-brk node_modules/.bin/vitest run --no-threads
```

## ⚙️ Configuration

### Vitest Config (`vitest.config.ts`)
```typescript
{
  environment: 'jsdom',
  setupFiles: ['./src/test/setup.ts'],
  globals: true,
  coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'html'],
  }
}
```

### Test Setup (`src/test/setup.ts`)
- Configures `@testing-library/jest-dom` matchers
- Mocks i18n globally
- Mocks toast notifications globally
- Configures cleanup after each test

## 📝 Writing New Tests

### Test Template
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { VerificationForm } from './VerificationForm';

describe('VerificationForm', () => {
  describe('Feature Name', () => {
    it('should do something', async () => {
      // Arrange
      render(<VerificationForm {...props} />);
      
      // Act
      // ... perform action
      
      // Assert
      expect(...).toBeInTheDocument();
    });
  });
});
```

### Common Matchers
```typescript
// Element existence
expect(element).toBeInTheDocument();
expect(element).not.toBeInTheDocument();

// Element state
expect(element).toBeDisabled();
expect(element).toBeEnabled();
expect(element).toHaveValue('test');
expect(element).toHaveAttribute('required');

// Text content
expect(element).toHaveTextContent(/regex/i);
expect(element).toContainElement(element);

// Mock function calls
expect(mockFn).toHaveBeenCalledTimes(1);
expect(mockFn).toHaveBeenCalledWith(arg1, arg2);
```

## 🔍 Common Issues & Solutions

### Issue: Test fails with "Unable to find element"
**Solution:** Use `waitFor` for async operations:
```typescript
await waitFor(() => {
  expect(screen.getByText(/error/i)).toBeInTheDocument();
});
```

### Issue: Mock not working
**Solution:** Ensure mocks are declared before imports:
```typescript
vi.mock('~/lib/api', () => ({
  api: { get: vi.fn() }
}));
```

### Issue: Test cleanup errors
**Solution:** Use `beforeEach` to clear mocks:
```typescript
beforeEach(() => {
  vi.clearAllMocks();
});
```

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Docs](https://testing-library.com/)
- [SolidJS Testing Library](https://github.com/solidjs/solid-testing-library)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

## 🎯 Next Steps

1. ✅ **Setup Complete** - Test infrastructure is configured
2. 🔄 **Fix Failing Tests** - 28 tests need fixes
3. 📝 **Add More Tests** - Implement remaining test cases from plan
4. 📊 **Add Coverage** - Reach 90%+ coverage target
5. 🔗 **CI/CD Integration** - Add tests to pipeline

---

**Last Updated:** 2026-04-23  
**Status:** ✅ Ready for Local Testing
