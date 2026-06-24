# Plant inventory — deferred features

## Implemented

- **Stock quantity operations** via dedicated Inventory tab:
  - Plant hub: `/app/seller/products/plants/{id}/inventory`
  - Product hub: `/app/seller/products/{id}/inventory` (same `ProductInventoryPanel`)
- Actions: restock, adjust, mark damaged, with movement history
- Catalog PATCH **does not** include stock fields (`inventoryCount`, `trackInventory`, `lowStockThreshold`)

## Deferred

Editing **trackInventory** and **lowStockThreshold** after plant creation is not supported in the UI.

**Reason:** No inventory settings API exists. The inventory controller only exposes GET + POST (restock/adjust/damaged). Catalog PATCH explicitly rejects stock fields on variants.

**Future work:** Add `PATCH /api/v1/user/seller/products/:id/inventory/settings` (or per-variant) to update `trackInventory` and `lowStockThreshold` on the `inventory` table without going through catalog update.
