# Shop Verification - Complete Frontend Implementation Plan

## Executive Summary

This plan outlines a complete, robust implementation of the shop verification system using a **dedicated route** rather than embedding it in the my-shop page. This approach provides better separation of concerns, cleaner state management, and a more focused user experience.

---

## Table of Contents

1. [Problem Analysis](#problem-analysis)
2. [Architecture Overview](#architecture-overview)
3. [Route Structure](#route-structure)
4. [Implementation Phases](#implementation-phases)
5. [Component Specifications](#component-specifications)
6. [State Management](#state-management)
7. [API Integration](#api-integration)
8. [Testing Strategy](#testing-strategy)
9. [Timeline & Milestones](#timeline--milestones)

---

## Problem Analysis

### What Went Wrong Before

1. **Wrong Pattern Applied**: Tried to use CRUD pattern (like address/contact) for a multi-state workflow
2. **State Management Issues**: `createEffect` for resetting modal state didn't work reliably
3. **Mixed Concerns**: Verification status affected shop status display logic
4. **Incomplete Flow**: No handling for rejection → resubmission cycle
5. **Poor UX**: Modal-based form for complex document management

### Key Differences: Verification vs CRUD

| Aspect | Address/Contact (CRUD) | Verification (Workflow) |
|--------|----------------------|------------------------|
| **Pattern** | Edit → Save → Done | Submit → Review → (Approve/Reject/Resubmit) |
| **States** | None | NONE → PENDING → REVIEWING → APPROVED/REJECTED |
| **File Uploads** | None | Multiple documents, immediate upload |
| **Admin Role** | None | Required (review, approve, reject) |
| **User Actions** | Edit anytime | Submit, View, Resubmit (if rejected) |
| **Data Lifetime** | Overwritten | Historical (audit trail) |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Verification System                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐ │
│  │  /seller/       │    │  /seller/       │    │  My Shop    │ │
│  │  setup-shop/    │    │  verification/  │    │  Page       │ │
│  │  verification   │───▶│  (dedicated)    │◀───│  (summary)  │ │
│  │  (first time)   │    │  (management)   │    │  only)      │ │
│  └─────────────────┘    └─────────────────┘    └─────────────┘ │
│           │                      │                      │       │
│           │                      │                      │       │
│           ▼                      ▼                      ▼       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Verification Components                     │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  • VerificationForm (multi-step)                        │   │
│  │  • VerificationStatusCard                               │   │
│  │  • DocumentUploader (immediate upload)                  │   │
│  │  • VerificationTimeline                                 │   │
│  │  • RejectionReasonDisplay                               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Backend API (Existing)                      │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  GET    /api/v1/user/seller/shops/my-shop/verification  │   │
│  │  PATCH  /api/v1/user/seller/shops/my-shop/verification  │   │
│  │  POST   /api/v1/media (document upload)                 │   │
│  │  DELETE /api/v1/media/:id (document deletion)           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Route Structure

### Proposed Routes

```
/seller/setup-shop/verification     → First-time verification (step in setup flow)
/seller/verification                → Dedicated verification management page
/seller/my-shop                     → Shop management (shows verification summary only)
```

### Route Responsibilities

| Route | Purpose | When Shown |
|-------|---------|------------|
| `/seller/setup-shop/verification` | Initial document submission | After completing setup-shop steps |
| `/seller/verification` | Full verification management | Anytime user needs to manage verification |
| `/seller/my-shop` | Shop CRUD operations | Day-to-day shop management |

---

## Implementation Phases

### Phase 1: Foundation (4-5 hours)

#### 1.1 Create Dedicated Verification Page

**File:** `src/routes/(protected)/app/seller/(seller-protected)/verification.tsx`

**Purpose:** Main verification management hub

**Features:**
- Display current verification status prominently
- Show/hide document upload form based on status
- Handle all verification states (NONE, PENDING, REVIEWING, APPROVED, REJECTED)
- Provide clear CTAs for each state

**Layout:**
```tsx
<div class="max-w-4xl mx-auto space-y-6">
  {/* Page Header */}
  <PageHeader title="Shop Verification" subtitle="..." />
  
  {/* Status Card - Always Visible */}
  <VerificationStatusCard status={...} />
  
  {/* Conditional Content Based on Status */}
  <Show when={canSubmitDocuments()} fallback={<NoActionRequired />}>
    <VerificationForm onSubmit={handleSubmit} />
  </Show>
  
  {/* Timeline/History */}
  <VerificationTimeline events={verificationHistory} />
</div>
```

#### 1.2 Create Status Display Component

**File:** `src/components/seller/VerificationStatusCard.tsx`

**Props:**
```typescript
interface VerificationStatusCardProps {
  status: VerificationStatusType | null;  // PENDING, REVIEWING, APPROVED, REJECTED, null
  rejectionReason?: string | null;
  verifiedAt?: Date | null;
  updatedAt?: Date | null;
  tradeLicenseNumber?: string | null;
  hasDocuments?: boolean;
}
```

**State-Based Rendering:**

```
┌──────────────────────────────────────────────────────────────┐
│ Status: null (No Verification Record)                        │
├──────────────────────────────────────────────────────────────┤
│ 📋 Icon                                                       │
│ Title: "Start Verification"                                  │
│ Description: "Submit your business documents to verify..."   │
│ CTA: "Submit Documents" button → Opens form                  │
│ Required Docs List:                                           │
│   • Trade License Number (required)                          │
│   • Trade License Document (required)                        │
│   • TIN Number (optional)                                    │
│   • Utility Bill (optional)                                  │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ Status: PENDING                                              │
├──────────────────────────────────────────────────────────────┤
│ ⏳ Icon (sage color)                                          │
│ Title: "Under Review"                                        │
│ Badge: PENDING                                                │
│ Message: "Your documents are being reviewed..."              │
│ Timeline: Submitted on [date]                                │
│ CTA: None (disabled) or "View Documents"                     │
│ Note: "You'll be notified within 48 hours"                   │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ Status: REVIEWING                                            │
├──────────────────────────────────────────────────────────────┤
│ 👁️ Icon (sage color)                                          │
│ Title: "Admin Reviewing"                                     │
│ Badge: REVIEWING                                              │
│ Message: "An admin is currently reviewing your documents"    │
│ Timeline: Submitted on [date], Under review since [date]     │
│ CTA: None                                                    │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ Status: APPROVED                                             │
├──────────────────────────────────────────────────────────────┤
│ ✅ Icon (forest green)                                        │
│ Title: "Verified"                                            │
│ Badge: APPROVED (green)                                      │
│ Message: "Your shop has been verified"                       │
│ Verified On: [formatted date]                                │
│ CTA: None (or "Download Certificate" if applicable)          │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ Status: REJECTED                                             │
├──────────────────────────────────────────────────────────────┤
│ ❌ Icon (terracotta/red)                                      │
│ Title: "Verification Rejected"                               │
│ Badge: REJECTED (red)                                        │
│ Rejection Reason: [prominent display in alert box]           │
│ Message: "Please fix the issues and resubmit"                │
│ Rejected On: [formatted date]                                │
│ CTA: "Resubmit Documents" → Opens form with existing data    │
└──────────────────────────────────────────────────────────────┘
```

#### 1.3 Create Document Upload Form

**File:** `src/components/seller/VerificationForm.tsx`

**Key Features:**
1. **Immediate file upload** - Upload to media API on file selection
2. **Preview existing documents** - Show currently uploaded docs when resubmitting
3. **Replace functionality** - Allow replacing uploaded files before submission
4. **Validation** - Required fields enforced before submission
5. **Loading states** - Upload progress, submission progress

**Form Structure:**
```tsx
<form onSubmit={handleSubmit} class="space-y-6">
  {/* Trade License Section */}
  <section>
    <h3>Trade License Information</h3>
    <Input 
      label="Trade License Number *"
      value={tradeLicenseNumber()}
      onInput={setTradeLicenseNumber}
      error={errors().tradeLicenseNumber}
    />
    <DocumentUploader
      label="Trade License Document *"
      accept="image/*,.pdf"
      uploadedMediaId={tradeLicenseDocumentId()}
      onMediaChange={setTradeLicenseDocumentId}
      description="PDF or Image, max 10MB"
    />
  </section>

  {/* TIN Section (Optional) */}
  <section>
    <h3>Tax Information (Optional)</h3>
    <Input 
      label="TIN Number"
      value={tinNumber()}
      onInput={setTinNumber}
    />
    <DocumentUploader
      label="TIN Document"
      accept="image/*,.pdf"
      uploadedMediaId={tinDocumentId()}
      onMediaChange={setTinDocumentId}
    />
  </section>

  {/* Utility Bill Section (Optional) */}
  <section>
    <h3>Address Proof (Optional)</h3>
    <DocumentUploader
      label="Utility Bill Document"
      accept="image/*,.pdf"
      uploadedMediaId={utilityBillDocumentId()}
      onMediaChange={setUtilityBillDocumentId}
      description="Electricity/Water/Gas bill"
    />
  </section>

  {/* Submit Button */}
  <div class="flex gap-3">
    <Button type="submit" loading={isSubmitting()}>
      {isResubmit() ? 'Resubmit Documents' : 'Submit for Verification'}
    </Button>
    <Button variant="outline" onClick={onCancel}>
      Cancel
    </Button>
  </div>
</form>
```

**Form State:**
```typescript
interface VerificationFormData {
  tradeLicenseNumber: string;        // Required
  tinNumber?: string;                // Optional
  tradeLicenseDocumentId: string;    // Required (after upload)
  tinDocumentId?: string;            // Optional (after upload)
  utilityBillDocumentId?: string;    // Optional (after upload)
}
```

---

### Phase 2: File Upload Component (3-4 hours)

#### 2.1 Create Reusable Document Uploader

**File:** `src/components/seller/DocumentUploader.tsx`

**Props:**
```typescript
interface DocumentUploaderProps {
  label: string;
  description?: string;
  accept: string;  // e.g., "image/*,.pdf"
  maxSizeMB?: number;  // Default: 10
  uploadedMediaId?: string | null;
  previewUrl?: string | null;
  onMediaChange: (mediaId: string | undefined) => void;
  onFileDelete?: (mediaId: string) => Promise<void>;
  disabled?: boolean;
  isLoading?: boolean;
}
```

**Features:**
- Immediate upload on file selection
- Preview for images and PDFs
- File type icon for non-images
- File size display
- Upload progress indicator
- Delete functionality (with confirmation)
- Error handling with toast notifications
- Drag & drop support (optional enhancement)

**Implementation:**
```typescript
export function DocumentUploader(props: DocumentUploaderProps) {
  const [localState, setLocalState] = createSignal({
    previewUrl: null as string | null,
    fileName: null as string | null,
    fileType: null as string | null,
    fileSize: null as number | null,
    isUploading: false,
  });

  const handleFileSelect = async (file: File) => {
    // 1. Validate file size
    if (file.size > (props.maxSizeMB || 10) * 1024 * 1024) {
      toaster.error(`File size must be less than ${props.maxSizeMB || 10}MB`);
      return;
    }

    // 2. Upload immediately
    setLocalState(s => ({ ...s, isUploading: true }));
    try {
      const response = await mediaApi.upload(file);
      
      // 3. Update local state
      setLocalState({
        previewUrl: response.url,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        isUploading: false,
      });

      // 4. Notify parent with media ID
      props.onMediaChange(response.id);
      toaster.success('File uploaded successfully');
    } catch (error) {
      toaster.error('Failed to upload file');
      setLocalState(s => ({ ...s, isUploading: false }));
      props.onMediaChange(undefined);
    }
  };

  const handleDelete = async () => {
    if (!props.uploadedMediaId) {
      // Just clear local state
      setLocalState(s => ({
        ...s,
        previewUrl: null,
        fileName: null,
        fileType: null,
        fileSize: null,
      }));
      props.onMediaChange(undefined);
      return;
    }

    try {
      await mediaApi.delete(props.uploadedMediaId);
      setLocalState(s => ({
        ...s,
        previewUrl: null,
        fileName: null,
        fileType: null,
        fileSize: null,
      }));
      props.onMediaChange(undefined);
      toaster.success('File deleted successfully');
    } catch (error) {
      toaster.error('Failed to delete file');
    }
  };

  return (
    <FileUpload
      preview={localState().previewUrl}
      fileName={localState().fileName}
      fileType={localState().fileType}
      fileSize={localState().fileSize}
      isUploading={localState().isUploading}
      onFileSelect={handleFileSelect}
      onDelete={handleDelete}
      disabled={props.disabled}
      label={props.label}
      description={props.description}
      accept={props.accept}
      showPreview={true}
    />
  );
}
```

---

### Phase 3: Integration (3-4 hours)

#### 3.1 Update Setup Shop Flow

**File:** `src/routes/(protected)/app/seller/setup-shop/(setup-shop).tsx`

**Changes:**
1. Add verification as final step (Step 6) OR redirect after shop creation
2. Show success message with "Proceed to Verification" CTA

**Option A: Verification as Step 6**
```tsx
// Add to setup-shop steps
const steps = [
  { title: 'Shop Name & Description', component: ShopNameStep },
  { title: 'Contact Information', component: ContactStep },
  { title: 'Address', component: AddressStep },
  { title: 'Branding', component: BrandingStep },
  { title: 'Review', component: ReviewStep },
  { title: 'Verification', component: VerificationStep }, // NEW
];
```

**Option B: Redirect After Creation (Recommended)**
```tsx
// After successful shop creation
const handleShopCreated = () => {
  toaster.success('Shop created successfully!');
  // Redirect to verification page
  navigate('/seller/verification', {
    state: { message: 'Please verify your shop to activate it' }
  });
};
```

#### 3.2 Add Verification Link to Navigation

**File:** `src/components/seller/SellerLayout.tsx` or sidebar component

**Add Navigation Item:**
```tsx
<nav>
  <NavLink href="/seller/dashboard">Dashboard</NavLink>
  <NavLink href="/seller/my-shop">My Shop</NavLink>
  <NavLink href="/seller/verification">Verification</NavLink> {/* NEW */}
  <NavLink href="/seller/products">Products</NavLink>
  <NavLink href="/seller/orders">Orders</NavLink>
</nav>
```

#### 3.3 Add Verification Summary to My Shop (Optional)

**File:** `src/routes/(protected)/app/seller/(seller-protected)/my-shop/(my-shop).tsx`

**Add Summary Card:**
```tsx
{/* Verification Summary */}
<Card title="Verification Status" class="mb-6">
  <Show when={verificationData()} fallback={
    <div class="flex items-center justify-between">
      <div>
        <p class="font-medium">Not Started</p>
        <p class="text-sm text-gray-500">Submit documents to verify your shop</p>
      </div>
      <A href="/seller/verification">
        <Button size="sm">Start Verification</Button>
      </A>
    </div>
  }>
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <Badge variant={getStatusColor(verificationData()!.status)}>
          {verificationData()!.status}
        </Badge>
        <Show when={verificationData()!.status === 'APPROVED'}>
          <span class="text-sm text-gray-500">
            Verified on {formatDate(verificationData()!.verifiedAt)}
          </span>
        </Show>
      </div>
      <A href="/seller/verification">
        <Button size="sm" variant="outline">Manage</Button>
      </A>
    </div>
  </Show>
</Card>
```

---

### Phase 4: Polish & Edge Cases (2-3 hours)

#### 4.1 Handle Edge Cases

**Case 1: No Shop Created Yet**
```tsx
// In verification page
const shopData = createAsync(() => getShop());

<Show when={shopData()} fallback={
  <EmptyState
    title="No Shop Found"
    description="Please create a shop before verifying"
    action={{
      label: 'Create Shop',
      href: '/seller/setup-shop'
    }}
  />
}>
  {/* Verification content */}
</Show>
```

**Case 2: Already Verified**
```tsx
<Show when={verificationData()?.status !== 'APPROVED'} fallback={
  <VerifiedState verifiedAt={verificationData()!.verifiedAt} />
}>
  {/* Form and other content */}
</Show>
```

**Case 3: Shop Status is REJECTED**
```tsx
// Shop can be rejected separately from verification
<Show when={shopData()?.status !== 'REJECTED'} fallback={
  <ShopRejectedState reason={shopData()?.rejectionReason} />
}>
  {/* Verification content */}
</Show>
```

#### 4.2 Add Loading States

```tsx
<Suspense fallback={
  <div class="flex items-center justify-center py-12">
    <Spinner size="lg" />
    <span class="ml-3">Loading verification data...</span>
  </div>
}>
  <VerificationPage />
</Suspense>
```

#### 4.3 Add Error Boundaries

```tsx
<ErrorBoundary fallback={(err, reset) => (
  <ErrorState
    title="Failed to Load Verification"
    message={err.message}
    onRetry={reset}
  />
)}>
  <VerificationPage />
</ErrorBoundary>
```

#### 4.4 Add Success/Error Notifications

```tsx
// In verification page
createEffect(() => {
  if (submissionResult()?.success) {
    toaster.success('Documents submitted successfully!');
    navigate('/seller/verification');
  } else if (submissionResult()?.error) {
    toaster.error(submissionResult()!.error.message);
  }
});
```

---

## Component Specifications

### Component Tree

```
VerificationPage (route)
├── PageHeader
├── VerificationStatusCard
│   ├── StatusIcon
│   ├── StatusBadge
│   ├── StatusMessage
│   ├── RejectionReason (conditional)
│   ├── VerifiedDate (conditional)
│   └── CTA Button (conditional)
├── VerificationForm (conditional)
│   ├── DocumentUploader (Trade License)
│   │   └── FileUpload (shared component)
│   ├── DocumentUploader (TIN)
│   │   └── FileUpload (shared component)
│   ├── DocumentUploader (Utility Bill)
│   │   └── FileUpload (shared component)
│   └── SubmitButton
├── VerificationTimeline (optional)
│   └── TimelineEvent[]
└── InfoBanner
```

### File Structure

```
src/
├── routes/
│   └── (protected)/app/seller/(seller-protected)/
│       ├── verification.tsx          # NEW - Main verification page
│       └── my-shop/
│           └── (my-shop).tsx         # Modified - Add verification summary
├── components/
│   └── seller/
│       ├── VerificationStatusCard.tsx    # NEW - Status display
│       ├── VerificationForm.tsx          # NEW - Document submission form
│       ├── DocumentUploader.tsx          # NEW - Reusable uploader
│       └── VerificationTimeline.tsx      # OPTIONAL - History display
└── lib/
    └── api/endpoints/
        └── seller-shop.api.ts        # Already exists
```

---

## State Management

### Page-Level State

```typescript
// In verification.tsx
const verificationData = createAsync(() => 
  sellerShopApi.getVerificationStatus().catch(() => null)
);

const [isSubmitting, setIsSubmitting] = createSignal(false);
const [submitted, setSubmitted] = createSignal(false);

const handleSubmit = async (data: VerificationFormData) => {
  setIsSubmitting(true);
  try {
    await sellerShopApi.updateVerification(data);
    setSubmitted(true);
    // Refetch after short delay to show updated status
    setTimeout(() => {
      verificationData.refetch();
      setSubmitted(false);
    }, 1000);
  } catch (error) {
    toaster.error(error.message);
  } finally {
    setIsSubmitting(false);
  }
};
```

### Form State

```typescript
// In VerificationForm.tsx
const [formData, setFormData] = createStore<VerificationFormData>({
  tradeLicenseNumber: props.initialData?.tradeLicenseNumber || '',
  tinNumber: props.initialData?.tinNumber || '',
  tradeLicenseDocumentId: props.initialData?.tradeLicenseDocumentId,
  tinDocumentId: props.initialData?.tinDocumentId,
  utilityBillDocumentId: props.initialData?.utilityBillDocumentId,
});

const [errors, setErrors] = createSignal<Record<string, string>>({});

const validate = (): boolean => {
  const newErrors: Record<string, string> = {};
  
  if (!formData.tradeLicenseNumber.trim()) {
    newErrors.tradeLicenseNumber = 'Trade License Number is required';
  }
  
  if (!formData.tradeLicenseDocumentId) {
    newErrors.tradeLicenseDocument = 'Trade License Document is required';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

### Document Upload State

```typescript
// In DocumentUploader.tsx
const [uploadState, setUploadState] = createSignal({
  previewUrl: null as string | null,
  fileName: null as string | null,
  fileType: null as string | null,
  fileSize: null as number | null,
  isUploading: false,
  error: null as string | null,
});

// Each document uploader manages its own state independently
// Parent component receives mediaId via onMediaChange callback
```

---

## API Integration

### Existing Endpoints (Backend)

```typescript
// GET verification status
GET /api/v1/user/seller/shops/my-shop/verification
Response: {
  status: VerificationStatusType;
  tradeLicenseNumber?: string;
  tinNumber?: string;
  tradeLicenseDocumentId?: string;
  tinDocumentId?: string;
  utilityBillDocumentId?: string;
  rejectionReason?: string;
  verifiedAt?: Date;
  updatedAt: Date;
}

// Submit/update verification
PATCH /api/v1/user/seller/shops/my-shop/verification
Body: {
  tradeLicenseNumber?: string;
  tinNumber?: string;
  tradeLicenseDocumentId?: string;
  tinDocumentId?: string;
  utilityBillDocumentId?: string;
}

// Upload document
POST /api/v1/media
Body: FormData (file)
Response: { id: string; url: string; }

// Delete document
DELETE /api/v1/media/:id
```

### API Client Usage

```typescript
// In components
import { sellerShopApi } from '~/lib/api/endpoints/seller-shop.api';
import { mediaApi } from '~/lib/api/endpoints/media.api';

// Fetch verification status
const status = await sellerShopApi.getVerificationStatus();

// Submit verification
await sellerShopApi.updateVerification({
  tradeLicenseNumber: '12345',
  tradeLicenseDocumentId: 'media-id-123',
});

// Upload document
const uploadResponse = await mediaApi.upload(file);
const mediaId = uploadResponse.id;

// Delete document
await mediaApi.delete(mediaId);
```

---

## Testing Strategy

### Unit Tests

```typescript
// VerificationStatusCard.test.tsx
describe('VerificationStatusCard', () => {
  it('renders null state when status is null', () => {
    render(() => <VerificationStatusCard status={null} />);
    expect(screen.getByText('Start Verification')).toBeInTheDocument();
  });

  it('renders PENDING state correctly', () => {
    render(() => <VerificationStatusCard status="PENDING" />);
    expect(screen.getByText('Under Review')).toBeInTheDocument();
    expect(screen.getByText('PENDING')).toBeInTheDocument();
  });

  it('renders REJECTED state with reason', () => {
    render(() => (
      <VerificationStatusCard 
        status="REJECTED" 
        rejectionReason="Document not clear"
      />
    ));
    expect(screen.getByText('Verification Rejected')).toBeInTheDocument();
    expect(screen.getByText('Document not clear')).toBeInTheDocument();
  });
});

// VerificationForm.test.tsx
describe('VerificationForm', () => {
  it('validates required fields', async () => {
    render(() => <VerificationForm onSubmit={() => ({ success: true })} />);
    
    await userEvent.click(screen.getByText('Submit'));
    
    expect(screen.getByText('Trade License Number is required')).toBeInTheDocument();
    expect(screen.getByText('Trade License Document is required')).toBeInTheDocument();
  });

  it('submits successfully with valid data', async () => {
    const mockSubmit = vi.fn().mockResolvedValue({ success: true });
    render(() => <VerificationForm onSubmit={mockSubmit} />);
    
    // Fill form...
    await userEvent.type(screen.getByLabelText(/trade license number/i), '12345');
    // Upload document...
    
    await userEvent.click(screen.getByText('Submit'));
    
    expect(mockSubmit).toHaveBeenCalledWith(expect.objectContaining({
      tradeLicenseNumber: '12345',
    }));
  });
});
```

### Integration Tests

```typescript
// verification.spec.ts (Playwright)
test('complete verification flow', async ({ page }) => {
  // Login
  await page.goto('/auth/login');
  // ... login steps

  // Navigate to verification
  await page.goto('/seller/verification');

  // Should show "Start Verification" initially
  await expect(page.getByText('Start Verification')).toBeVisible();

  // Fill form
  await page.fill('[name="tradeLicenseNumber"]', '12345');
  await page.setInputFiles('[type="file"]', 'test-license.pdf');

  // Submit
  await page.click('button[type="submit"]');

  // Should show success message
  await expect(page.getByText('submitted successfully')).toBeVisible();

  // Status should update to PENDING
  await expect(page.getByText('Under Review')).toBeVisible();
});
```

### Manual Testing Checklist

- [ ] No shop exists → Shows appropriate message with link to create shop
- [ ] First-time verification → Shows form with all fields
- [ ] Submit with missing required fields → Shows validation errors
- [ ] Submit with valid data → Shows success, updates status to PENDING
- [ ] PENDING status → Shows timeline, no form actions
- [ ] REVIEWING status → Shows "admin reviewing" message
- [ ] APPROVED status → Shows verified date, success state
- [ ] REJECTED status → Shows rejection reason, "Resubmit" button works
- [ ] File upload > 10MB → Shows error
- [ ] File upload fails → Shows error, allows retry
- [ ] Delete uploaded file → Removes from UI, allows re-upload
- [ ] Navigation between pages → State persists correctly
- [ ] Refresh page → Data refetches correctly
- [ ] Multiple document uploads → All upload independently

---

## Timeline & Milestones

### Week 1: Core Implementation

| Day | Task | Deliverable |
|-----|------|-------------|
| 1 | Phase 1.1: Create verification page | `verification.tsx` route |
| 2 | Phase 1.2: Create status card | `VerificationStatusCard.tsx` |
| 3 | Phase 1.3: Create verification form | `VerificationForm.tsx` |
| 4 | Phase 2.1: Create document uploader | `DocumentUploader.tsx` |
| 5 | Testing & bug fixes | Working verification flow |

### Week 2: Integration & Polish

| Day | Task | Deliverable |
|-----|------|-------------|
| 1 | Phase 3.1: Update setup-shop flow | Redirect to verification |
| 2 | Phase 3.2: Add navigation link | Sidebar updated |
| 3 | Phase 3.3: Add summary to my-shop | Verification summary card |
| 4 | Phase 4: Edge cases & polish | Error handling, loading states |
| 5 | Testing & documentation | Test coverage, README updated |

### Total Estimated Time: **40-50 hours** (8-10 days at 5 hours/day)

---

## Success Criteria

### Functional Requirements

- [ ] User can submit verification documents
- [ ] User can view current verification status
- [ ] User can resubmit if rejected
- [ ] File uploads work correctly (immediate upload)
- [ ] Validation prevents incomplete submissions
- [ ] All verification states display correctly

### Non-Functional Requirements

- [ ] Page loads in < 2 seconds
- [ ] File uploads show progress feedback
- [ ] Error messages are clear and actionable
- [ ] Mobile-responsive design
- [ ] Accessible (keyboard navigation, screen readers)

### Business Requirements

- [ ] Verification flow is clear and intuitive
- [ ] Users understand what documents are required
- [ ] Rejection reasons are prominently displayed
- [ ] Users can easily resubmit after rejection

---

## Appendix A: State Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                    Verification State Machine                     │
└──────────────────────────────────────────────────────────────────┘

     ┌─────────────┐
     │    NULL     │ ◄── Initial state (no verification record)
     │  (No Data)  │
     └──────┬──────┘
            │ User submits documents
            │ (POST /verification)
            ▼
     ┌─────────────┐
     │   PENDING   │ ◄── Documents submitted, awaiting admin
     │             │
     └──────┬──────┘
            │ Admin starts review
            │ (Backend updates status)
            ▼
     ┌─────────────┐
     │  REVIEWING  │ ◄── Admin actively reviewing
     │             │
     └──────┬──────┘
            │
     ┌──────┴──────┐
     │             │
     ▼             ▼
┌─────────┐   ┌──────────┐
│APPROVED │   │ REJECTED │
│         │   │          │
└─────────┘   └────┬─────┘
                   │ User resubmits
                   │ (PATCH /verification)
                   └──────────────┐
                                  ▼
                            (back to PENDING)


User Actions by State:
- NULL: Can submit documents
- PENDING: View only, cannot edit
- REVIEWING: View only, cannot edit
- APPROVED: View only, no actions needed
- REJECTED: Can resubmit with corrections
```

---

## Appendix B: Backend Notes

### Important Backend Behaviors

1. **Verification Record Creation**: Created on first document submission (not on shop creation)

2. **Shop Status vs Verification Status**: These are SEPARATE
   - Shop status: DRAFT → PENDING_VERIFICATION → APPROVED → ACTIVE
   - Verification status: NULL → PENDING → REVIEWING → APPROVED/REJECTED

3. **Backend Issue**: `updateVerification` does NOT update shop status to `PENDING_VERIFICATION`
   - **Recommendation**: Either fix backend or call `submitForReview` endpoint after verification submission

4. **Document Ownership**: Uploaded media IDs are stored in verification record
   - Deleting verification should also delete associated media (or transfer ownership)

### Backend Endpoints Reference

```typescript
// Get verification status
GET /api/v1/user/seller/shops/my-shop/verification

// Submit/update verification documents
PATCH /api/v1/user/seller/shops/my-shop/verification

// Upload document (generic media endpoint)
POST /api/v1/media

// Delete document (generic media endpoint)
DELETE /api/v1/media/:id

// Submit shop for review (changes shop status to PENDING_VERIFICATION)
POST /api/v1/user/seller/shops/my-shop/submit-for-review
```

---

## Appendix C: Migration from Old Implementation

### Breaking Changes

1. **Route Change**: `/seller/setup-shop/verification` → `/seller/verification`
2. **Component Names**: `VerificationDocumentUploader` → `VerificationForm` + `DocumentUploader`
3. **State Management**: Modal-based → Page-based

### Migration Steps

1. Delete old components (already done)
2. Create new components (this plan)
3. Update any links/references to old routes
4. Update navigation
5. Test thoroughly

---

**Document Version:** 1.0  
**Last Updated:** 2026-04-20  
**Author:** Kilo  
**Status:** Ready for Implementation
