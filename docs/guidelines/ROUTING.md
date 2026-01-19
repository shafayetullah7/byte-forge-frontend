# Routing Guidelines

## Core Principles

### 1. Explicit Context
Every route must clearly indicate whether it's for buyers or sellers.

**❌ Wrong**:
```
/dashboard
/profile
/settings
```

**✅ Correct**:
```
/app                    (buyer dashboard)
/app/profile            (buyer profile)
/app/seller             (seller landing)
```

### 2. Shop Context Visibility
Seller routes that operate on a specific shop must include the shop ID in the URL.

**❌ Wrong**:
```
/seller/products
/seller/orders
```

**✅ Correct**:
```
/app/seller/shops/{shopId}/products
/app/seller/shops/{shopId}/orders
```

### 3. No Generic Routes
Routes must be specific to their context.

**❌ Forbidden**:
- `/dashboard` - Which dashboard? Buyer or seller?
- `/orders` - Buyer orders or shop orders?
- `/products` - Which shop's products?

---

## Route Structure

### Buyer Routes
All buyer routes start with `/app`:

```
/app                          → Buyer dashboard
/app/orders                   → Order history (as buyer)
/app/orders/{orderId}         → Order details
/app/profile                  → User profile
/app/favorites                → Saved products
/app/settings                 → User account settings
```

### Seller Routes (No Shop)
Seller routes without shop context:

```
/app/seller                   → Seller landing page
/app/seller/shops             → List of owned shops
/app/seller/shops/new         → Create new shop
```

### Seller Routes (Shop Context)
Seller routes with active shop context:

```
/app/seller/shops/{shopId}/dashboard    → Shop dashboard
/app/seller/shops/{shopId}/products     → Product list
/app/seller/shops/{shopId}/products/new → Add product
/app/seller/shops/{shopId}/products/{productId} → Edit product
/app/seller/shops/{shopId}/orders       → Shop orders
/app/seller/shops/{shopId}/orders/{orderId} → Order details
/app/seller/shops/{shopId}/analytics    → Shop analytics
/app/seller/shops/{shopId}/customers    → Customer insights
/app/seller/shops/{shopId}/settings     → Shop settings
```

---

## File Structure

Routes are organized using SolidStart's file-based routing:

```
src/routes/
  (app)/                              # Buyer layout group
    index.tsx                         # /app
    profile/
      index.tsx                       # /app/profile
    orders/
      index.tsx                       # /app/orders
      [orderId]/
        index.tsx                     # /app/orders/{orderId}
    favorites/
      index.tsx                       # /app/favorites
    settings/
      index.tsx                       # /app/settings
    
  (seller)/                           # Seller layout group
    index.tsx                         # /app/seller
    shops/
      index.tsx                       # /app/seller/shops
      new/
        index.tsx                     # /app/seller/shops/new
      [shopId]/
        dashboard/
          index.tsx                   # /app/seller/shops/{shopId}/dashboard
        products/
          index.tsx                   # /app/seller/shops/{shopId}/products
          new/
            index.tsx                 # /app/seller/shops/{shopId}/products/new
          [productId]/
            index.tsx                 # /app/seller/shops/{shopId}/products/{productId}
        orders/
          index.tsx                   # /app/seller/shops/{shopId}/orders
          [orderId]/
            index.tsx                 # /app/seller/shops/{shopId}/orders/{orderId}
        analytics/
          index.tsx                   # /app/seller/shops/{shopId}/analytics
        customers/
          index.tsx                   # /app/seller/shops/{shopId}/customers
        settings/
          index.tsx                   # /app/seller/shops/{shopId}/settings
```

---

## Layout Groups

### Buyer Layout `(app).tsx`
Wraps all buyer routes with:
- Buyer-focused navigation
- Buyer theme colors
- Authentication guard
- Email verification check

### Seller Layout `(seller).tsx`
Wraps all seller routes with:
- Seller-focused navigation
- Seller theme colors
- Shop selector (when applicable)
- Authentication guard
- Email verification check

---

## Navigation Examples

### Internal Links

**Buyer Navigation**:
```tsx
import { A } from "@solidjs/router";

// Navigate to buyer dashboard
<A href="/app">Dashboard</A>

// Navigate to orders
<A href="/app/orders">My Orders</A>

// Navigate to specific order
<A href={`/app/orders/${orderId}`}>View Order</A>
```

**Seller Navigation**:
```tsx
import { A } from "@solidjs/router";

// Navigate to seller landing
<A href="/app/seller">Seller Home</A>

// Navigate to shop list
<A href="/app/seller/shops">My Shops</A>

// Navigate to shop dashboard
<A href={`/app/seller/shops/${shopId}/dashboard`}>Dashboard</A>

// Navigate to products
<A href={`/app/seller/shops/${shopId}/products`}>Products</A>
```

### Programmatic Navigation

```tsx
import { useNavigate } from "@solidjs/router";

const navigate = useNavigate();

// Navigate to buyer dashboard
navigate("/app");

// Navigate to shop dashboard
navigate(`/app/seller/shops/${shopId}/dashboard`);
```

---

## Redirects

### Old Route Migration

Create redirect files for deprecated routes:

**`src/routes/dashboard.tsx`**:
```tsx
import { Navigate } from "@solidjs/router";

export default function DashboardRedirect() {
  return <Navigate href="/app" />;
}
```

**`src/routes/profile.tsx`**:
```tsx
import { Navigate } from "@solidjs/router";

export default function ProfileRedirect() {
  return <Navigate href="/app/profile" />;
}
```

---

## Route Parameters

### Shop ID
Always use `shopId` as the parameter name:
```
/app/seller/shops/{shopId}/...
```

### Product ID
Always use `productId`:
```
/app/seller/shops/{shopId}/products/{productId}
```

### Order ID
Always use `orderId`:
```
/app/orders/{orderId}
/app/seller/shops/{shopId}/orders/{orderId}
```

---

## Testing Checklist

When creating a new route:

- [ ] Route clearly indicates context (buyer or seller)
- [ ] Shop ID included if seller route operates on shop
- [ ] No generic route names used
- [ ] File placed in correct layout group
- [ ] Navigation links use correct paths
- [ ] Breadcrumbs show correct hierarchy
- [ ] Mobile navigation works
- [ ] Authentication guard applied
- [ ] i18n keys defined for page content

---

## Common Mistakes

### ❌ Mistake 1: Generic Routes
```tsx
// Wrong - no context
<A href="/dashboard">Dashboard</A>

// Correct - explicit context
<A href="/app">Dashboard</A>
```

### ❌ Mistake 2: Missing Shop Context
```tsx
// Wrong - which shop?
<A href="/seller/products">Products</A>

// Correct - explicit shop
<A href={`/app/seller/shops/${shopId}/products`}>Products</A>
```

### ❌ Mistake 3: Mixing Contexts
```tsx
// Wrong - buyer and seller mixed
function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      {isSeller() ? <SellerStats /> : <BuyerStats />}
    </div>
  );
}

// Correct - separate pages
// /app/index.tsx (buyer)
function BuyerDashboard() {
  return <BuyerStats />;
}

// /app/seller/shops/{shopId}/dashboard/index.tsx (seller)
function ShopDashboard() {
  return <SellerStats />;
}
```

---

## Best Practices

1. **Always use absolute paths** in navigation
2. **Never hardcode shop IDs** - use context or parameters
3. **Validate shop ownership** before rendering seller pages
4. **Show 404 for invalid shop IDs**
5. **Redirect to shop list** if shop ID missing in seller routes
6. **Use breadcrumbs** to show route hierarchy
7. **Test all navigation flows** before shipping

---

## Examples

See `/docs/examples/routing/` for complete examples of:
- Buyer page navigation
- Seller page navigation
- Shop switching with navigation
- Role switching with navigation
- Breadcrumb implementation
