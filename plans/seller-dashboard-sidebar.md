# Seller Dashboard Sidebar Expansion Plan

**Created:** April 16, 2026  
**Priority:** P0 (Critical for MVP)  
**Status:** Planning

---

## Overview

This plan outlines the implementation of missing seller dashboard sections: **Products**, **Orders**, **Earnings**, and **Settings**.

---

## Phase 1: Products Module (P0 - Critical)

### 1.1 Create Route Structure

```
src/routes/(protected)/app/seller/(seller-protected)/products/
├── (products).tsx          # Main products list page
├── [id]/
│   ├── (detail).tsx        # Product detail view
│   ├── edit.tsx            # Edit product form
│   └── variants.tsx        # Manage variants
├── new.tsx                 # Create new product
└── categories/
    └── (categories).tsx    # Category management
```

### 1.2 Files to Create

| File | Purpose | Components Needed |
|------|---------|-------------------|
| `products/(products).tsx` | List all seller's products | ProductTable, ProductCard, FilterBar, SearchInput |
| `products/new.tsx` | Create product form | ProductForm, ImageUploader, CategorySelect, TagSelect |
| `products/[id]/edit.tsx` | Edit existing product | ProductForm (same as new), VariantEditor |
| `products/[id]/variants.tsx` | Manage product variants | VariantTable, VariantModal, PriceInput |
| `products/categories/(categories).tsx` | Browse/manage categories | CategoryTree, CategoryModal |

### 1.3 Components to Create

| Component | Location | Purpose |
|-----------|----------|---------|
| `ProductForm.tsx` | `src/components/seller/products/` | Reusable form for create/edit |
| `ProductTable.tsx` | `src/components/seller/products/` | Data table for product list |
| `ProductCard.tsx` | `src/components/seller/products/` | Card view for products |
| `ImageUploader.tsx` | `src/components/seller/products/` | Cloudinary image upload |
| `VariantEditor.tsx` | `src/components/seller/products/` | Manage variant definitions |
| `CategoryTree.tsx` | `src/components/seller/products/` | Tree view for categories |
| `FilterBar.tsx` | `src/components/seller/products/` | Filter by type, category, status |

### 1.4 Translations to Add (i18n)

**File:** `src/i18n/en.ts` and `src/i18n/bn.ts`

```typescript
// English
seller: {
  products: {
    title: "Products",
    allProducts: "All Products",
    addProduct: "Add Product",
    editProduct: "Edit Product",
    categories: "Categories",
    tags: "Tags",
    createProduct: "Create Product",
    productType: "Product Type",
    plant: "Plant",
    pot: "Pot",
    seed: "Seeds",
    fertilizer: "Fertilizer",
    // ... more strings
  }
}

// Bengali
seller: {
  products: {
    title: "পণ্য",
    allProducts: "সকল পণ্য",
    addProduct: "পণ্য যোগ করুন",
    editProduct: "পণ্য সম্পাদনা",
    categories: "ক্যাটাগরি",
    tags: "ট্যাগ",
    createProduct: "পণ্য তৈরি করুন",
    productType: "পণ্যের ধরন",
    plant: "গাছ",
    pot: "টব",
    seed: "বীজ",
    fertilizer: "সার",
    // ... more strings
  }
}
```

---

## Phase 2: Orders Module (P0 - Critical)

### 2.1 Create Route Structure

```
src/routes/(protected)/app/seller/(seller-protected)/orders/
├── (orders).tsx            # Main orders list page
├── [id]/
│   ├── (detail).tsx        # Order detail view
│   ├── fulfill.tsx         # Fulfillment actions
│   └── invoice.tsx         # View/print invoice
└── returns/
    └── (returns).tsx       # Return/refund requests
```

### 2.2 Files to Create

| File | Purpose | Components Needed |
|------|---------|-------------------|
| `orders/(orders).tsx` | List all seller's orders | OrderTable, OrderFilter, StatusBadge |
| `orders/[id]/(detail).tsx` | Order details | OrderTimeline, CustomerInfo, ItemsList |
| `orders/[id]/fulfill.tsx` | Update order status | StatusSelector, TrackingInput |
| `orders/[id]/invoice.tsx` | View invoice | InvoiceTemplate (bilingual PDF) |
| `orders/returns/(returns).tsx` | Return requests | ReturnTable, ReturnModal |

### 2.3 Components to Create

| Component | Location | Purpose |
|-----------|----------|---------|
| `OrderTable.tsx` | `src/components/seller/orders/` | Data table for orders |
| `OrderCard.tsx` | `src/components/seller/orders/` | Card view for orders |
| `OrderTimeline.tsx` | `src/components/seller/orders/` | Status history visualization |
| `StatusBadge.tsx` | `src/components/seller/orders/` | Colored status indicator |
| `StatusSelector.tsx` | `src/components/seller/orders/` | Dropdown to change status |
| `TrackingInput.tsx` | `src/components/seller/orders/` | Add tracking number |
| `InvoiceTemplate.tsx` | `src/components/seller/orders/` | Bilingual invoice layout |

### 2.4 Translations to Add (i18n)

```typescript
// English
seller: {
  orders: {
    title: "Orders",
    allOrders: "All Orders",
    pending: "Pending",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
    orderNumber: "Order Number",
    customerName: "Customer Name",
    totalAmount: "Total Amount",
    orderDate: "Order Date",
    fulfillOrder: "Fulfill Order",
    addTracking: "Add Tracking",
    printInvoice: "Print Invoice",
    // ... more strings
  }
}

// Bengali
seller: {
  orders: {
    title: "অর্ডার",
    allOrders: "সকল অর্ডার",
    pending: "অপেক্ষমান",
    processing: "প্রসেসিং",
    shipped: "শিপ করা হয়েছে",
    delivered: "ডেলিভারি হয়েছে",
    cancelled: "বাতিল",
    orderNumber: "অর্ডার নম্বর",
    customerName: "গ্রাহকের নাম",
    totalAmount: "মোট মূল্য",
    orderDate: "অর্ডারের তারিখ",
    fulfillOrder: "অর্ডার পূরণ করুন",
    addTracking: "ট্র্যাকিং যোগ করুন",
    printInvoice: "ইনভয়েস প্রিন্ট করুন",
    // ... more strings
  }
}
```

---

## Phase 3: Earnings Module (P1 - High)

### 3.1 Create Route Structure

```
src/routes/(protected)/app/seller/(seller-protected)/earnings/
├── (earnings).tsx          # Dashboard with balance overview
├── payouts/
│   └── (payouts).tsx       # Payout history
└── settings.tsx            # Payout method settings
```

### 3.2 Files to Create

| File | Purpose | Components Needed |
|------|---------|-------------------|
| `earnings/(earnings).tsx` | Earnings overview | BalanceCard, EarningsChart, RecentPayouts |
| `earnings/payouts/(payouts).tsx` | Payout history | PayoutTable, PayoutDetail |
| `earnings/settings.tsx` | Configure payout method | BankAccountForm, MobileBankingForm |

### 3.3 Components to Create

| Component | Location | Purpose |
|-----------|----------|---------|
| `BalanceCard.tsx` | `src/components/seller/earnings/` | Display available/pending balance |
| `EarningsChart.tsx` | `src/components/seller/earnings/` | Revenue over time graph |
| `PayoutTable.tsx` | `src/components/seller/earnings/` | Payout history list |
| `BankAccountForm.tsx` | `src/components/seller/earnings/` | Bank details form |
| `MobileBankingForm.tsx` | `src/components/seller/earnings/` | bKash/Nagad form |

### 3.4 Translations to Add (i18n)

```typescript
// English
seller: {
  earnings: {
    title: "Earnings",
    availableBalance: "Available Balance",
    pendingBalance: "Pending Balance",
    totalEarnings: "Total Earnings",
    payouts: "Payouts",
    payoutHistory: "Payout History",
    payoutMethod: "Payout Method",
    bankTransfer: "Bank Transfer",
    bkash: "bKash",
    nagad: "Nagad",
    // ... more strings
  }
}

// Bengali
seller: {
  earnings: {
    title: "আয়",
    availableBalance: "উপলব্ধ ব্যালেন্স",
    pendingBalance: "অমীমাংসিত ব্যালেন্স",
    totalEarnings: "মোট আয়",
    payouts: "পেমেন্ট",
    payoutHistory: "পেমেন্ট ইতিহাস",
    payoutMethod: "পেমেন্ট পদ্ধতি",
    bankTransfer: "ব্যাংক ট্রান্সফার",
    bkash: "বিকাশ",
    nagad: "নগদ",
    // ... more strings
  }
}
```

---

## Phase 4: Settings Module (P1 - High)

### 4.1 Create Route Structure

```
src/routes/(protected)/app/seller/(seller-protected)/settings/
├── (settings).tsx          # Main settings page (tabs)
├── profile.tsx             # Shop profile settings
├── notifications.tsx       # Notification preferences
└── security.tsx            # Password, 2FA
```

### 4.2 Files to Create

| File | Purpose | Components Needed |
|------|---------|-------------------|
| `settings/(settings).tsx` | Settings hub with tabs | SettingsNav, TabContent |
| `settings/profile.tsx` | Shop profile | ShopInfoForm, LogoUploader, CoverUploader |
| `settings/notifications.tsx` | Email/SMS preferences | NotificationToggle |
| `settings/security.tsx` | Security settings | PasswordForm, TwoFactorSetup |

### 4.3 Components to Create

| Component | Location | Purpose |
|-----------|----------|---------|
| `SettingsNav.tsx` | `src/components/seller/settings/` | Tab navigation |
| `ShopInfoForm.tsx` | `src/components/seller/settings/` | Bilingual shop info form |
| `LogoUploader.tsx` | `src/components/seller/settings/` | Shop logo upload |
| `NotificationToggle.tsx` | `src/components/seller/settings/` | Toggle notification types |
| `PasswordForm.tsx` | `src/components/seller/settings/` | Change password form |

---

## Phase 5: Update Sidebar Configuration

### 5.1 Update `SellerLayout.tsx`

Add all new sidebar links with proper grouping:

```typescript
import { 
    Squares2x2Icon, ShoppingBagIcon, TagIcon,
    CubeIcon, PlusIcon, FolderIcon,
    ClipboardListIcon, ClockIcon, CheckCircleIcon, XCircleIcon,
    DollarSignIcon, BankIcon, CogIcon,
    ChevronDownIcon
} from "~/components/icons";

const sidebarConfig: SidebarConfig = {
    mode: "seller",
    brandColor: "terracotta",
    sections: [
        {
            title: t("seller.overview"),
            links: [
                { href: "/app/seller/my-shop", icon: Squares2x2Icon, label: t("common.dashboard") },
                { href: "/app/seller/shops", icon: ShoppingBagIcon, label: t("seller.shops") },
            ]
        },
        {
            title: t("seller.shopManagement"),
            links: [
                { href: "/app/seller/my-shop/edit", icon: PencilIcon, label: t("seller.shop.editShop") },
                { href: "/app/seller/my-shop/verification", icon: TagIcon, label: t("seller.verification.title") },
                { href: "/app/seller/my-shop/history", icon: ClockIcon, label: t("seller.shop.history") },
            ]
        },
        {
            title: t("seller.products.title"),
            links: [
                { href: "/app/seller/products", icon: CubeIcon, label: t("seller.products.allProducts") },
                { href: "/app/seller/products/new", icon: PlusIcon, label: t("seller.products.addProduct") },
                { href: "/app/seller/products/categories", icon: FolderIcon, label: t("seller.products.categories") },
            ]
        },
        {
            title: t("seller.orders.title"),
            links: [
                { href: "/app/seller/orders", icon: ClipboardListIcon, label: t("seller.orders.allOrders") },
                { href: "/app/seller/orders?status=pending", icon: ClockIcon, label: t("seller.orders.pending") },
                { href: "/app/seller/orders?status=delivered", icon: CheckCircleIcon, label: t("seller.orders.completed") },
            ]
        },
        {
            title: t("seller.earnings.title"),
            links: [
                { href: "/app/seller/earnings", icon: DollarSignIcon, label: t("seller.earnings.balance") },
                { href: "/app/seller/earnings/payouts", icon: BankIcon, label: t("seller.earnings.payouts") },
            ]
        },
        {
            title: t("common.settings"),
            links: [
                { href: "/app/seller/settings", icon: CogIcon, label: t("seller.settings.shopSettings") },
            ]
        },
    ]
};
```

### 5.2 Update `Sidebar.tsx` Component

Ensure the sidebar supports grouped sections with optional collapsible behavior.

---

## Implementation Order

| Priority | Phase | Estimated Effort | Dependencies |
|----------|-------|------------------|--------------|
| **P0** | 1. Products Module | 3-4 days | Backend API for products |
| **P0** | 2. Orders Module | 2-3 days | Backend API for orders |
| **P1** | 3. Earnings Module | 1-2 days | Backend API for payouts |
| **P1** | 4. Settings Module | 1 day | Existing shop API |
| **P0** | 5. Sidebar Update | 0.5 day | All above phases |

**Total Estimated Time:** 7-10 days

---

## API Endpoints Required (Backend)

### Products API
```
GET    /api/v1/seller/products           - List seller's products
POST   /api/v1/seller/products           - Create product
GET    /api/v1/seller/products/:id       - Get product details
PATCH  /api/v1/seller/products/:id       - Update product
DELETE /api/v1/seller/products/:id       - Delete product
GET    /api/v1/seller/products/:id/variants - Get variants
POST   /api/v1/seller/products/:id/variants - Create variant
PATCH  /api/v1/seller/products/:variantId   - Update variant
```

### Orders API
```
GET    /api/v1/seller/orders             - List seller's orders
GET    /api/v1/seller/orders/:id         - Get order details
PATCH  /api/v1/seller/orders/:id/status  - Update order status
POST   /api/v1/seller/orders/:id/tracking - Add tracking
GET    /api/v1/seller/orders/:id/invoice - Get invoice PDF
```

### Earnings API
```
GET    /api/v1/seller/earnings           - Get balance overview
GET    /api/v1/seller/earnings/payouts   - Get payout history
POST   /api/v1/seller/earnings/payout-method - Set payout method
GET    /api/v1/seller/earnings/payout-method - Get payout method
```

---

## Testing Checklist

- [ ] All routes are accessible
- [ ] Sidebar navigation works correctly
- [ ] All translations display properly (EN + BN)
- [ ] Forms validate correctly
- [ ] API calls handle errors gracefully
- [ ] Loading states are shown
- [ ] Mobile responsive design works
- [ ] Keyboard navigation works
- [ ] Screen reader accessibility

---

## Notes

- All forms must support bilingual input (EN + BN)
- Use existing design system components where possible
- Follow existing code patterns in the codebase
- Add proper loading and error states
- Implement proper authentication checks on all routes
