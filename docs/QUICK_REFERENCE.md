# Quick Reference Guide

## Common Tasks

### Creating a New Buyer Page

1. **Create route file**:
   ```
   src/routes/(app)/my-page/index.tsx
   ```

2. **Use PageHeader**:
   ```tsx
   import { PageHeader } from "~/components/layout/PageHeader";
   
   <PageHeader
     title={t("buyer.myPage.title")}
     subtitle={t("buyer.myPage.subtitle")}
   />
   ```

3. **Add navigation link**:
   ```tsx
   <A href="/app/my-page">My Page</A>
   ```

4. **Add i18n keys**:
   ```typescript
   buyer: {
     myPage: {
       title: "My Page",
       subtitle: "Description",
     }
   }
   ```

---

### Creating a New Seller Page (Shop Context)

1. **Create route file**:
   ```
   src/routes/(seller)/shops/[shopId]/my-page/index.tsx
   ```

2. **Get shop ID from params**:
   ```tsx
   import { useParams } from "@solidjs/router";
   
   const params = useParams();
   const shopId = params.shopId;
   ```

3. **Use PageHeader with breadcrumbs**:
   ```tsx
   <PageHeader
     title={t("seller.myPage.title")}
     breadcrumbs={[
       { label: "Seller", href: "/app/seller" },
       { label: shopName(), href: `/app/seller/shops/${shopId}` },
       { label: "My Page" }
     ]}
   />
   ```

4. **Verify shop ownership** (in API call):
   ```tsx
   const data = await api.getShopData(shopId);
   if (!data) navigate("/app/seller/shops");
   ```

---

### Switching Roles Programmatically

```tsx
import { useRole } from "~/lib/context/role-context";
import { useNavigate } from "@solidjs/router";

const { setRole } = useRole();
const navigate = useNavigate();

// Switch to seller
setRole("seller");
navigate("/app/seller");

// Switch to buyer
setRole("buyer");
navigate("/app");
```

---

### Switching Shops

```tsx
import { useShop } from "~/lib/context/shop-context";

const { setActiveShopId } = useShop();

// Switch shop
setActiveShopId(newShopId);

// Clear shop (go to shop list)
setActiveShopId(null);
navigate("/app/seller/shops");
```

---

### Checking Current Context

```tsx
import { useRole } from "~/lib/context/role-context";
import { useShop } from "~/lib/context/shop-context";

const { isBuyer, isSeller } = useRole();
const { activeShopId, hasActiveShop } = useShop();

// Conditional rendering
<Show when={isBuyer()}>
  <BuyerContent />
</Show>

<Show when={isSeller() && hasActiveShop()}>
  <ShopContent shopId={activeShopId()!} />
</Show>
```

---

### Creating Empty States

```tsx
import { EmptyState } from "~/components/layout/EmptyState";

<EmptyState
  icon={<ProductIcon />}
  title={t("seller.products.empty.title")}
  description={t("seller.products.empty.description")}
  action={
    <Button href={`/app/seller/shops/${shopId}/products/new`}>
      {t("seller.products.addProduct")}
    </Button>
  }
/>
```

---

### Adding Status Badges

```tsx
import { StatusBadge } from "~/components/ui/StatusBadge";

<StatusBadge status="active" />
<StatusBadge status="pending" />
<StatusBadge status="shipped" />
```

---

### Confirming Destructive Actions

```tsx
import { ConfirmationModal } from "~/components/ui/ConfirmationModal";

const [showConfirm, setShowConfirm] = createSignal(false);

<ConfirmationModal
  open={showConfirm()}
  onClose={() => setShowConfirm(false)}
  onConfirm={handleDelete}
  title={t("common.confirmDelete")}
  description={t("seller.products.deleteWarning")}
  confirmText={t("common.delete")}
  cancelText={t("common.cancel")}
  variant="danger"
/>
```

---

## Route Patterns

### Buyer Routes
```
/app                    → Dashboard
/app/orders             → List
/app/orders/{id}        → Detail
/app/profile            → Profile
/app/favorites          → Favorites
/app/settings           → Settings
```

### Seller Routes
```
/app/seller                           → Landing
/app/seller/shops                     → List
/app/seller/shops/new                 → Create
/app/seller/shops/{id}/dashboard      → Dashboard
/app/seller/shops/{id}/products       → List
/app/seller/shops/{id}/products/new   → Create
/app/seller/shops/{id}/products/{id}  → Edit
```

---

## i18n Pattern

```typescript
// Structure
{
  common: { ... },
  buyer: {
    dashboard: { ... },
    orders: { ... },
    profile: { ... },
  },
  seller: {
    landing: { ... },
    shops: { ... },
    dashboard: { ... },
    products: { ... },
    orders: { ... },
  }
}

// Usage
const { t } = useI18n();
<h1>{t("buyer.dashboard.title")}</h1>
```

---

## Testing Checklist

Before committing:

- [ ] Route has explicit context
- [ ] Shop ID in URL (if seller shop page)
- [ ] Breadcrumbs show hierarchy
- [ ] i18n keys defined
- [ ] Empty state implemented
- [ ] Loading state shown
- [ ] Error state handled
- [ ] Mobile responsive
- [ ] Keyboard accessible
- [ ] Screen reader tested

---

## Common Mistakes

### ❌ Don't
```tsx
// Generic route
<A href="/dashboard">Dashboard</A>

// Missing shop context
<A href="/products">Products</A>

// Hardcoded text
<h1>Dashboard</h1>

// Mixed contexts
{isSeller() ? <SellerView /> : <BuyerView />}
```

### ✅ Do
```tsx
// Explicit route
<A href="/app">Dashboard</A>

// With shop context
<A href={`/app/seller/shops/${shopId}/products`}>Products</A>

// Internationalized
<h1>{t("buyer.dashboard.title")}</h1>

// Separate pages
// buyer: /app/index.tsx
// seller: /app/seller/shops/{shopId}/dashboard/index.tsx
```

---

## Need Help?

1. Check [Design System](./DESIGN_SYSTEM.md)
2. Review [Routing Guidelines](./guidelines/ROUTING.md)
3. Look at [Component Docs](./components/)
4. Ask in team chat
