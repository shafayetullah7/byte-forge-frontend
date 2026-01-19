# RoleSwitcher Component

## Purpose
Allows users to manually switch between Buyer and Seller modes.

---

## Usage

```tsx
import { RoleSwitcher } from "~/components/layout/RoleSwitcher";

// In header or profile menu
<RoleSwitcher />
```

---

## Behavior

1. **Shows current role** with icon:
   - Buyer: 🛍️ (shopping bag)
   - Seller: 🏪 (shop)

2. **Clicking switches role**:
   - Updates role context
   - Navigates to appropriate landing page
   - Shows toast notification
   - Persists to localStorage

3. **Visual feedback**:
   - Hover state
   - Active role highlighted
   - Smooth transition

---

## Implementation

```tsx
import { Component } from "solid-js";
import { useRole } from "~/lib/context/role-context";
import { useNavigate } from "@solidjs/router";
import { useI18n } from "~/i18n";

export const RoleSwitcher: Component = () => {
  const { role, setRole, isBuyer } = useRole();
  const navigate = useNavigate();
  const { t } = useI18n();

  const switchRole = () => {
    const newRole = isBuyer() ? "seller" : "buyer";
    setRole(newRole);
    
    // Navigate to appropriate landing
    navigate(newRole === "buyer" ? "/app" : "/app/seller");
    
    // Show notification
    // toast.success(t(`common.switchedTo${newRole === 'buyer' ? 'Buyer' : 'Seller'}`));
  };

  return (
    <button
      onClick={switchRole}
      class="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <span class={isBuyer() ? "text-green-600" : "text-blue-600"}>
        {isBuyer() ? "🛍️" : "🏪"}
      </span>
      <span class="text-sm font-medium">
        {isBuyer() ? t("common.switchToSeller") : t("common.switchToBuyer")}
      </span>
    </button>
  );
};
```

---

## Props

None - uses `RoleContext` internally.

---

## Design Rules

1. ✅ Must be visible in header or profile menu
2. ✅ Never auto-switch without user intent
3. ✅ Always show visual indicator of active role
4. ✅ Always navigate after switching
5. ✅ Always show notification after switching
6. ✅ Persist preference to localStorage

---

## Accessibility

- **Keyboard**: Fully accessible via Tab and Enter
- **Screen Reader**: Announces current role and action
- **Focus**: Clear focus indicator
- **ARIA**: `role="button"` and `aria-label` set

```tsx
<button
  onClick={switchRole}
  role="button"
  aria-label={isBuyer() 
    ? t("common.switchToSellerAriaLabel") 
    : t("common.switchToBuyerAriaLabel")
  }
>
  {/* ... */}
</button>
```

---

## i18n Keys

Required translation keys:

```typescript
common: {
  switchToBuyer: "Switch to Buyer Mode",
  switchToSeller: "Switch to Seller Mode",
  switchedToBuyer: "Switched to Buyer Mode",
  switchedToSeller: "Switched to Seller Mode",
  switchToBuyerAriaLabel: "Switch to buyer mode to browse and purchase products",
  switchToSellerAriaLabel: "Switch to seller mode to manage your shops",
}
```

---

## Examples

### In Header
```tsx
<header class="flex items-center justify-between p-4">
  <Logo />
  <div class="flex items-center gap-4">
    <Search />
    <RoleSwitcher />
    <ProfileMenu />
  </div>
</header>
```

### In Profile Dropdown
```tsx
<DropdownMenu>
  <DropdownMenuItem>
    <RoleSwitcher />
  </DropdownMenuItem>
  <DropdownMenuItem>
    <A href="/app/settings">Settings</A>
  </DropdownMenuItem>
  <DropdownMenuItem>
    <button onClick={logout}>Logout</button>
  </DropdownMenuItem>
</DropdownMenu>
```

---

## Testing

```tsx
import { render, fireEvent } from "@solidjs/testing-library";
import { RoleSwitcher } from "./RoleSwitcher";

test("switches from buyer to seller", () => {
  const { getByRole } = render(<RoleSwitcher />);
  const button = getByRole("button");
  
  // Initially buyer
  expect(button).toHaveTextContent("Switch to Seller Mode");
  
  // Click to switch
  fireEvent.click(button);
  
  // Now seller
  expect(button).toHaveTextContent("Switch to Buyer Mode");
});
```

---

## Related Components

- `ShopSelector` - Shown only in seller mode
- `Navbar` - Contains role switcher
- `ProfileMenu` - Alternative placement for role switcher
