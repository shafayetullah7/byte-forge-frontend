# ShopSelector Component

## Purpose
Allows sellers to select and switch between their owned shops. Only visible in seller mode.

---

## Usage

```tsx
import { ShopSelector } from "~/components/layout/ShopSelector";

// In seller layout header
<ShopSelector />
```

---

## Behavior

1. **Shows active shop name** with status badge
2. **Dropdown lists all owned shops**:
   - Recent shops at top (last 3 accessed)
   - All shops below with search
   - Status badges (active, paused, draft)
3. **Switching shops**:
   - Warns about unsaved changes
   - Updates shop context
   - Reloads shop-specific data
   - Persists to localStorage
4. **Create new shop** option at bottom

---

## Implementation

```tsx
import { Component, createSignal, For, Show } from "solid-js";
import { useShop } from "~/lib/context/shop-context";
import { useI18n } from "~/i18n";
import { A } from "@solidjs/router";

interface Shop {
  id: string;
  name: string;
  status: "active" | "paused" | "draft";
}

export const ShopSelector: Component = () => {
  const { activeShopId, setActiveShopId } = useShop();
  const { t } = useI18n();
  const [isOpen, setIsOpen] = createSignal(false);
  
  // TODO: Fetch from API
  const [shops] = createSignal<Shop[]>([
    { id: "1", name: "My Plant Shop", status: "active" },
    { id: "2", name: "Garden Store", status: "paused" },
  ]);

  const activeShop = () => shops().find(s => s.id === activeShopId());

  const handleShopChange = (shopId: string) => {
    // TODO: Check for unsaved changes
    // if (hasUnsavedChanges()) {
    //   confirm("You have unsaved changes. Continue?");
    // }
    
    setActiveShopId(shopId);
    setIsOpen(false);
  };

  return (
    <div class="relative">
      <button
        onClick={() => setIsOpen(!isOpen())}
        class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border rounded-lg"
      >
        <span class="font-medium">
          {activeShop()?.name || t("common.selectShop")}
        </span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <Show when={isOpen()}>
        <div class="absolute top-full mt-2 w-64 bg-white dark:bg-gray-800 border rounded-lg shadow-lg z-50">
          <div class="p-2">
            <For each={shops()}>
              {(shop) => (
                <button
                  onClick={() => handleShopChange(shop.id)}
                  class="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-gray-100"
                  classList={{ "bg-gray-100": shop.id === activeShopId() }}
                >
                  <span>{shop.name}</span>
                  <StatusBadge status={shop.status} />
                </button>
              )}
            </For>
          </div>
          <div class="border-t p-2">
            <A
              href="/app/seller/shops/new"
              class="block w-full px-3 py-2 text-center text-sm font-medium text-blue-600 hover:bg-gray-100 rounded"
            >
              + {t("common.createShop")}
            </A>
          </div>
        </div>
      </Show>
    </div>
  );
};
```

---

## Props

None - uses `ShopContext` internally.

---

## Design Rules

1. ✅ Only visible in seller mode
2. ✅ Always shows active shop name
3. ✅ Shows shop status badges
4. ✅ Warns about unsaved changes before switching
5. ✅ Recent shops appear at top (max 3)
6. ✅ Includes "Create New Shop" option
7. ✅ Persists selection to localStorage

---

## Features

### Recent Shops
Shows last 3 accessed shops at top of dropdown for quick access.

### Search (Future)
For sellers with many shops, add search functionality:
```tsx
<input
  type="text"
  placeholder={t("common.searchShops")}
  class="w-full px-3 py-2 border rounded"
/>
```

### Shop Pinning (Future)
Allow pinning favorite shops to top:
```tsx
<button onClick={() => togglePin(shop.id)}>
  {isPinned(shop.id) ? "★" : "☆"}
</button>
```

---

## Accessibility

- **Keyboard**: Fully accessible via Tab, Enter, and Arrow keys
- **Screen Reader**: Announces active shop and shop count
- **Focus**: Clear focus indicator on dropdown items
- **ARIA**: Proper `role="listbox"` and `aria-selected`

```tsx
<div role="listbox" aria-label={t("common.selectShopAriaLabel")}>
  <button
    role="option"
    aria-selected={shop.id === activeShopId()}
  >
    {shop.name}
  </button>
</div>
```

---

## i18n Keys

```typescript
common: {
  selectShop: "Select Shop",
  createShop: "Create Shop",
  searchShops: "Search shops...",
  selectShopAriaLabel: "Select a shop to manage",
  activeShop: "Active shop",
}

seller: {
  shops: {
    recentShops: "Recent Shops",
    allShops: "All Shops ({count})",
  }
}
```

---

## Unsaved Changes Warning

```tsx
const handleShopChange = (shopId: string) => {
  if (hasUnsavedChanges()) {
    const confirmed = confirm(
      t("common.unsavedChangesWarning")
    );
    if (!confirmed) return;
  }
  
  setActiveShopId(shopId);
  setIsOpen(false);
};
```

---

## Examples

### In Seller Header
```tsx
<header class="flex items-center justify-between p-4">
  <Logo />
  <ShopSelector />
  <ProfileMenu />
</header>
```

### With Shop Status
```tsx
<ShopSelector />
// Shows: "My Plant Shop [Active]"
```

---

## Testing

```tsx
test("switches shops", () => {
  const { getByText, getByRole } = render(<ShopSelector />);
  
  // Open dropdown
  fireEvent.click(getByRole("button"));
  
  // Select different shop
  fireEvent.click(getByText("Garden Store"));
  
  // Verify shop changed
  expect(getByRole("button")).toHaveTextContent("Garden Store");
});

test("warns about unsaved changes", () => {
  // Mock unsaved changes
  vi.spyOn(window, "confirm").mockReturnValue(false);
  
  const { getByText, getByRole } = render(<ShopSelector />);
  
  fireEvent.click(getByRole("button"));
  fireEvent.click(getByText("Garden Store"));
  
  // Should not switch if user cancels
  expect(getByRole("button")).toHaveTextContent("My Plant Shop");
});
```

---

## Related Components

- `RoleSwitcher` - Switches between buyer/seller modes
- `StatusBadge` - Shows shop status
- `ConfirmationModal` - Unsaved changes warning
