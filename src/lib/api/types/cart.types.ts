export type StockStatus =
  | 'in_stock'
  | 'low_stock'
  | 'out_of_stock';

export interface CartItem {
  id: string;
  variantId: string;
  quantity: number;
  price: string;
  lineTotal: string;
  productName: string;
  productSlug: string;
  productType: string;
  shopId: string;
  thumbnail: { id: string; url: string } | null;
  stockStatus: StockStatus;
  availableQuantity: number | null;
  maxQuantity: number;
  variantAttributes: {
    growthStage?: string;
    plantForm?: string;
    variegation?: string;
    leafDensity?: string;
    containerType?: string;
    containerSize?: string;
  } | null;
  variantTitle?: string;
  sku?: string;
}

export interface Cart {
  id: string;
  itemsCount: number;
  totalQuantity: number;
  subtotal: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CartValidationIssue {
  itemId: string;
  variantId: string;
  productName: string;
  issue:
    | 'variant_not_found'
    | 'variant_deactivated'
    | 'product_unavailable'
    | 'insufficient_stock'
    | 'shop_closed';
  details: string;
  availableQuantity?: number;
}

export interface CartValidationResult {
  isValid: boolean;
  issues: CartValidationIssue[];
  validItemsCount: number;
  invalidItemsCount: number;
}

export interface BulkUpdateResult {
  updated: CartItem[];
  removed: { itemId: string; variantId: string }[];
  errors: { itemId: string; error: string }[];
}

export interface BulkRemoveResult {
  removedCount: number;
  notFound: string[];
}

export interface MergeCartResult {
  mergedCount: number;
  failedItems: { variantId: string; reason: string }[];
  cart: Cart;
}

export interface AddToCartRequest {
  variantId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface BulkUpdateItem {
  itemId: string;
  quantity: number;
}

export interface BulkUpdateCartRequest {
  items: BulkUpdateItem[];
}

export interface BulkRemoveCartRequest {
  itemIds: string[];
}

export interface MergeCartItem {
  variantId: string;
  quantity: number;
}

export interface MergeCartRequest {
  guestItems: MergeCartItem[];
}
