export interface MockCartItem {
  id: string;
  shopId: string;
  shopName: string;
  productName: string;
  productSlug: string;
  variantTitle: string;
  quantity: number;
  price: number;
  lineTotal: number;
  thumbnailUrl: string | null;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface MockAddress {
  id: string;
  type: 'shipping' | 'billing';
  label: string;
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string | null;
  country: string;
  districtId: string;
  isDefault: boolean;
}

export interface MockShopShipping {
  shopId: string;
  shopName: string;
  items: MockCartItem[];
  itemsSubtotal: number;
  shippingCost: number;
  districtId: string;
  districtName: string;
}

export interface MockPriceBreakdown {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shopBreakdowns: MockShopShipping[];
}

// Mock addresses
export const mockAddresses: MockAddress[] = [
  {
    id: 'addr-1',
    type: 'shipping',
    label: 'Home',
    recipientName: 'Rahim Uddin',
    phone: '+8801712345678',
    addressLine1: 'House 42, Road 11, Banani',
    addressLine2: 'Flat 3A',
    city: 'Dhaka',
    state: 'Dhaka',
    postalCode: '1213',
    country: 'Bangladesh',
    districtId: 'district-dhaka',
    isDefault: true,
  },
  {
    id: 'addr-2',
    type: 'shipping',
    label: 'Office',
    recipientName: 'Rahim Uddin',
    phone: '+8801712345678',
    addressLine1: 'Level 5, Delta Tower, Gulshan-2',
    addressLine2: null,
    city: 'Dhaka',
    state: 'Dhaka',
    postalCode: '1212',
    country: 'Bangladesh',
    districtId: 'district-dhaka',
    isDefault: false,
  },
  {
    id: 'addr-3',
    type: 'shipping',
    label: "Parent's House",
    recipientName: 'Karim Uddin',
    phone: '+8801812345678',
    addressLine1: 'Village: Natuarpara, Upazila: Sadar',
    addressLine2: null,
    city: 'Chittagong',
    state: 'Chittagong',
    postalCode: '4000',
    country: 'Bangladesh',
    districtId: 'district-chittagong',
    isDefault: false,
  },
];

// Mock cart items (simulating 2 shops)
export const mockCartItems: MockCartItem[] = [
  // Shop 1: Green Paradise
  {
    id: 'item-1',
    shopId: 'shop-1',
    shopName: 'Green Paradise Nursery',
    productName: 'Monstera Deliciosa',
    productSlug: 'monstera-deliciosa',
    variantTitle: 'Mature (Juvenile)',
    quantity: 1,
    price: 1200,
    lineTotal: 1200,
    thumbnailUrl: null,
    stockStatus: 'in_stock',
  },
  {
    id: 'item-2',
    shopId: 'shop-1',
    shopName: 'Green Paradise Nursery',
    productName: 'Fiddle Leaf Fig',
    productSlug: 'fiddle-leaf-fig',
    variantTitle: 'Standard (Mature)',
    quantity: 2,
    price: 850,
    lineTotal: 1700,
    thumbnailUrl: null,
    stockStatus: 'low_stock',
  },
  // Shop 2: Tropical Greens
  {
    id: 'item-3',
    shopId: 'shop-2',
    shopName: 'Tropical Greens BD',
    productName: 'Snake Plant Laurentii',
    productSlug: 'snake-plant-laurentii',
    variantTitle: 'Small (Cutting)',
    quantity: 3,
    price: 350,
    lineTotal: 1050,
    thumbnailUrl: null,
    stockStatus: 'in_stock',
  },
  {
    id: 'item-4',
    shopId: 'shop-2',
    shopName: 'Tropical Greens BD',
    productName: 'Pothos Marble Queen',
    productSlug: 'pothos-marble-queen',
    variantTitle: 'Medium (Mature)',
    quantity: 1,
    price: 600,
    lineTotal: 600,
    thumbnailUrl: null,
    stockStatus: 'in_stock',
  },
];

// Mock shipping rates per shop for Dhaka district
export const mockShippingRatesDhaka: Record<string, number> = {
  'shop-1': 60,
  'shop-2': 60,
};

// Mock shipping rates per shop for Chittagong district
export const mockShippingRatesChittagong: Record<string, number> = {
  'shop-1': 120,
  'shop-2': 100,
};

export function computePriceBreakdown(
  items: MockCartItem[],
  districtId: string,
  shippingRates: Record<string, number>
): MockPriceBreakdown {
  const shopGroups = new Map<string, MockCartItem[]>();
  items.forEach((item) => {
    const existing = shopGroups.get(item.shopId) || [];
    existing.push(item);
    shopGroups.set(item.shopId, existing);
  });

  const shopBreakdowns: MockShopShipping[] = [];
  let subtotal = 0;
  let totalShipping = 0;

  const districtNames: Record<string, string> = {
    'district-dhaka': 'Dhaka',
    'district-chittagong': 'Chittagong',
    'district-sylhet': 'Sylhet',
    'district-rajshahi': 'Rajshahi',
  };

  for (const [shopId, shopItems] of shopGroups) {
    const itemsSubtotal = shopItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const shippingCost = shippingRates[shopId] || 0;
    totalShipping += shippingCost;

    shopBreakdowns.push({
      shopId,
      shopName: shopItems[0].shopName,
      items: shopItems,
      itemsSubtotal,
      shippingCost,
      districtId,
      districtName: districtNames[districtId] || 'Unknown',
    });

    subtotal += itemsSubtotal;
  }

  return {
    subtotal,
    shipping: totalShipping,
    tax: 0,
    total: subtotal + totalShipping,
    shopBreakdowns,
  };
}
