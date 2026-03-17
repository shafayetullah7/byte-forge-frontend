# Shop Creation Flow Refactor Plan

## Executive Summary

Refactor the frontend shop creation flow to match the backend's `ApplySellerDto` schema, following project standards (modular-forms, Zod schemas, typed API endpoints).

---

## Current State

### Backend Expects (`ApplySellerDto`)
```typescript
{
  address: string;              // Required
  logoId?: string;             // UUID
  bannerId?: string;           // UUID
  translations: [               // Required
    {
      locale: string;         // e.g., "en", "bn"
      shopName: string;       // Required
      about: string;          // Min 10 chars
      brandStory?: string;
      featuredHighlight?: string;
    }
  ];
  tradeLicenseNumber: string;            // Required
  tradeLicenseDocumentId: string;       // UUID - Required
  tinNumber?: string;
  tinDocumentId?: string;
  utilityBillDocumentId?: string;
}
```

### Frontend Currently Sends
```typescript
{
  name: string;
  slug: string;
  description?: string;
  logoId?: string;
}
```

---

## Phase 1: Type & Schema Alignment (Foundation)

### 1.1 Update Shop Types
- **File**: `src/lib/api/types/seller.types.ts`
- **Actions**:
  - Rename `CreateShopRequest` → `ApplyAsSellerRequest`
  - Add `ShopTranslation` type
  - Add `BusinessVerification` type
  - Update `Shop` type to match backend `LocalizedShopDetails`

### 1.2 Create Zod Schema
- **File**: `src/schemas/shop.schema.ts`
- **Actions**:
  - Create `shopTranslationSchema` (locale, shopName, about, brandStory, featuredHighlight)
  - Create `applyAsSellerSchema` matching backend DTO
  - Export type `ApplyAsSellerFormData`

### 1.3 Update API Endpoint
- **File**: `src/lib/api/endpoints/seller.api.ts`
- **Actions**:
  - Update `shops.create` to use correct types
  - Add `shops.getMyShopStatus` using `/my-shop/status` endpoint

---

## Phase 2: Shop Context Enhancement

### 2.1 Update Shop Context
- **File**: `src/lib/context/shop-context.tsx`
- **Actions**:
  - Add `shopStatus` signal for routing
  - Add `fetchShopStatus()` method using new status endpoint
  - Update `getShop()` to use localized details endpoint

### 2.2 Add Shop Status Route Guard
- **File**: `src/routes/(protected)/app/seller/(seller-protected).tsx`
- **Actions**:
  - Use `/my-shop/status` for quick routing decisions
  - Redirect to setup if no shop exists

---

## Phase 3: UI Form Refactor

### 3.1 Create Multi-Step Form Structure
- **File**: `src/routes/(protected)/app/seller/setup-shop/(setup-shop).tsx`
- **Actions**:
  - Convert to modular-forms approach (like register)
  - Create step-based UI:
    - **Step 1**: Basic Info (shop name, about)
    - **Step 2**: Branding (logo, banner)
    - **Step 3**: Business Info (address)
    - **Step 4**: Verification (trade license, documents)

### 3.2 Reuse Existing Components
- **Components to use**:
  - `ImageUpload` for logo, banner, documents
  - `Input` for text fields
  - `Button` for actions
  - Existing i18n translations

### 3.3 Add Document Upload
- **Actions**:
  - Use `useImageUpload` hook for trade license, TIN, utility bill
  - Show upload progress and previews
  - Validate file types (PDF, images)

---

## Phase 4: Testing & Integration

### 4.1 Test Flow
- Test shop creation with all fields
- Verify translations are saved correctly
- Test document uploads
- Verify redirect after creation

### 4.2 Error Handling
- Handle API errors gracefully
- Show field-level validation errors
- Handle duplicate shop name

---

## File Changes Summary

| Phase | File | Changes |
|-------|------|---------|
| 1.1 | `seller.types.ts` | Update types |
| 1.2 | `shop.schema.ts` | NEW - Zod schemas |
| 1.3 | `seller.api.ts` | Update API |
| 2.1 | `shop-context.tsx` | Add status |
| 2.2 | `seller-protected.tsx` | Route guard |
| 3.1 | `setup-shop.tsx` | Multi-step form |
| 3.2 | Components | Reuse existing |

---

## Implementation Order

1. **Phase 1** (Foundation) - 2-3 hours
2. **Phase 2** (Context) - 1-2 hours  
3. **Phase 3** (UI) - 4-6 hours
4. **Phase 4** (Testing) - 1-2 hours

**Total Estimated**: 8-13 hours
