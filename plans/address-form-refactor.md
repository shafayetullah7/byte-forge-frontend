# Address Form Refactoring Plan

**Created:** April 16, 2026  
**Last Updated:** April 16, 2026  
**Priority:** P1 (High)  
**Status:** Ready for Implementation

---

## Overview

Refactor the shop address upsert API and form to use a **translations object pattern** with explicit `en` and `bn` keys. This aligns with the bilingual-first architecture and provides cleaner type safety for upsert operations.

---

## Architecture Decision: Object vs Array

### ✅ Chosen: Object Structure

```typescript
{
  translations: {
    en: { country, division, district, street },
    bn: { country, division, district, street },
  },
  postalCode?: string,
  latitude?: string,
  longitude?: string,
  googleMapsLink?: string,
}
```

### ❌ Rejected: Array Structure

```typescript
{
  translations: [
    { locale: 'en', country, division, district, street },
    { locale: 'bn', country, division, district, street },
  ],
  // ...other fields
}
```

### Rationale

| Criteria | Object (Chosen) | Array (Rejected) |
|----------|-----------------|------------------|
| **Type Safety** | Explicit `en`/`bn` keys | Need runtime validation |
| **Access Pattern** | `translations.en.country` | `find(t => t.locale === 'en')` |
| **Upsert Clarity** | Direct mapping | Loop required |
| **Both Languages Required** | Implicit in schema | Need validation |
| **Frontend State** | Matches form structure | Needs transformation |
| **Extensibility** | Clear what languages exist | Dynamic but complex |

**Decision:** For a **fixed bilingual system** (EN + BN only), object structure is cleaner and more maintainable.

---

## Database Schema (No Changes Required)

The existing translation table pattern already supports this:

### `shop_address` Table (Non-translatable)
```sql
CREATE TABLE shop_address (
  id UUID PRIMARY KEY,
  shop_id UUID UNIQUE NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  latitude DECIMAL(13, 10),
  longitude DECIMAL(14, 10),
  google_maps_link TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### `shop_address_translations` Table (Translatable)
```sql
CREATE TABLE shop_address_translations (
  id UUID PRIMARY KEY,
  address_id UUID NOT NULL REFERENCES shop_address(id),
  locale VARCHAR(10) NOT NULL,
  country VARCHAR(100) NOT NULL,
  division VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  street VARCHAR(255) NOT NULL,
  UNIQUE(address_id, locale)
);
```

---

## Implementation Phases

### Phase 1: Backend Changes (`byte-forge-auth`)

#### 1.1 Update DTO Schema

**File:** `src/api/user/seller/shop/dto/update-shop-address.dto.ts`

**Current:**
```typescript
{
  country?: string;
  division?: string;
  district?: string;
  street?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  googleMapsLink?: string;
  translations?: {
    country?: string;
    division?: string;
    district?: string;
    street?: string;
  };
}
```

**New:**
```typescript
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const addressTranslationSchema = z.object({
  country: z.string().min(2).max(100),
  division: z.string().min(2).max(100),
  district: z.string().min(2).max(100),
  street: z.string().min(5).max(255),
});

export const updateShopAddressSchema = z.object({
  // Non-translatable fields (optional for partial updates)
  postalCode: z.string()
    .min(4, { message: 'message.validation.minLength' })
    .max(20, { message: 'message.validation.maxLength' })
    .optional(),
  
  latitude: z.string()
    .optional(),
  
  longitude: z.string()
    .optional(),
  
  googleMapsLink: z.string()
    .url({ message: 'message.validation.invalidUrl' })
    .max(500, { message: 'message.validation.maxLength' })
    .optional(),
  
  // Translations object (both languages required for complete address)
  translations: z.object({
    en: addressTranslationSchema,
    bn: addressTranslationSchema,
  }).optional(),
}).refine(
  (data) => {
    // At least one field must be provided
    return (
      !!data.postalCode ||
      !!data.latitude ||
      !!data.longitude ||
      !!data.googleMapsLink ||
      !!data.translations
    );
  },
  {
    message: 'message.validation.atLeastOne',
  }
);

export class UpdateShopAddressDto extends createZodDto(updateShopAddressSchema) {}
```

**Validation Rules:**
- ✅ Non-translatable fields are optional (partial updates)
- ✅ If `translations` provided, both `en` and `bn` required with all fields
- ✅ At least one field (translatable or non-translatable) must be provided
- ✅ Latitude/longitude kept as string for precision, converted in service

---

#### 1.2 Update Service Method

**File:** `src/api/user/seller/shop/shop.service.ts`

**Method:** `updateMyShopAddress`

**Current Implementation:**
```typescript
async updateMyShopAddress(shopId: string, dto: UpdateShopAddressDto, lang: string) {
  return this.updateShopSection(shopId, lang, async (tx) => {
    const address = await this.shopRepository.upsertShopAddress(
      shopId,
      {
        ...(dto.postalCode !== undefined && { postalCode: dto.postalCode }),
        ...(dto.latitude !== undefined && { latitude: dto.latitude.toFixed(10) }),
        ...(dto.longitude !== undefined && { longitude: dto.longitude.toFixed(10) }),
        ...(dto.googleMapsLink !== undefined && { googleMapsLink: dto.googleMapsLink }),
      },
      tx,
    );

    // English at root level
    if (dto.country || dto.division || dto.district || dto.street) {
      await this.shopRepository.upsertShopAddressTranslation(
        address.id,
        {
          locale: 'en',
          country: dto.country,
          division: dto.division,
          district: dto.district,
          street: dto.street,
        },
        tx,
      );
    }

    // Bengali in translations object
    if (dto.translations) {
      await this.shopRepository.upsertShopAddressTranslation(
        address.id,
        {
          locale: 'bn',
          country: dto.translations.country,
          division: dto.translations.division,
          district: dto.translations.district,
          street: dto.translations.street,
        },
        tx,
      );
    }
  });
}
```

**New Implementation:**
```typescript
async updateMyShopAddress(shopId: string, dto: UpdateShopAddressDto, lang: string) {
  return this.updateShopSection(shopId, lang, async (tx) => {
    // 1. Upsert main address (non-translatable fields)
    const addressPayload: typeof shopAddressTable.$inferInsert = {};
    
    if (dto.postalCode !== undefined) {
      addressPayload.postalCode = dto.postalCode;
    }
    
    if (dto.latitude !== undefined && dto.latitude !== '') {
      // Convert string to decimal with 10 decimal places precision
      const lat = parseFloat(dto.latitude);
      if (!isNaN(lat)) {
        addressPayload.latitude = lat.toFixed(10);
      }
    }
    
    if (dto.longitude !== undefined && dto.longitude !== '') {
      const lng = parseFloat(dto.longitude);
      if (!isNaN(lng)) {
        addressPayload.longitude = lng.toFixed(10);
      }
    }
    
    if (dto.googleMapsLink !== undefined) {
      addressPayload.googleMapsLink = dto.googleMapsLink;
    }

    const address = await this.shopRepository.upsertShopAddress(
      shopId,
      addressPayload,
      tx,
    );

    // 2. Upsert translations (both languages)
    if (dto.translations) {
      // Upsert English translation
      await this.shopRepository.upsertShopAddressTranslation(
        address.id,
        {
          locale: 'en',
          country: dto.translations.en.country,
          division: dto.translations.en.division,
          district: dto.translations.en.district,
          street: dto.translations.en.street,
        },
        tx,
      );

      // Upsert Bengali translation
      await this.shopRepository.upsertShopAddressTranslation(
        address.id,
        {
          locale: 'bn',
          country: dto.translations.bn.country,
          division: dto.translations.bn.division,
          district: dto.translations.bn.district,
          street: dto.translations.bn.street,
        },
        tx,
      );
    }
  });
}
```

**Key Changes:**
- ✅ Remove root-level `country`, `division`, `district`, `street` handling
- ✅ Use `translations.en` for English
- ✅ Use `translations.bn` for Bengali
- ✅ Handle empty string for lat/lng (treat as undefined)
- ✅ Consistent precision for GPS coordinates

---

#### 1.3 Repository Methods (No Changes)

The existing repository methods already support the upsert pattern:

```typescript
// ShopRepository.upsertShopAddressTranslation
async upsertShopAddressTranslation(
  addressId: string,
  translation: TNewShopAddressTranslation,
  tx: Tx,
) {
  return tx
    .insert(shopAddressTranslationsTable)
    .values(translation)
    .onConflictDoUpdate({
      target: [
        shopAddressTranslationsTable.addressId,
        shopAddressTranslationsTable.locale,
      ],
      set: {
        country: translation.country,
        division: translation.division,
        district: translation.district,
        street: translation.street,
      },
    });
}
```

✅ **No changes needed** - already supports upsert with locale.

---

### Phase 2: Frontend Changes (`byte-forge-frontend`)

#### 2.0 Create Bangladesh Address Data

**File:** `src/data/bangladesh-addresses.ts`

Create a hierarchical data structure with all Bangladesh divisions and districts:

```typescript
export interface District {
  en: string;
  bn: string;
}

export interface Division {
  en: string;
  bn: string;
  districts: District[];
}

export interface Country {
  code: string;
  en: string;
  bn: string;
  divisions: Division[];
}

export const BANGLADESH: Country = {
  code: 'BD',
  en: 'Bangladesh',
  bn: 'বাংলাদেশ',
  divisions: [
    {
      en: 'Dhaka',
      bn: 'ঢাকা',
      districts: [
        { en: 'Dhaka', bn: 'ঢাকা' },
        { en: 'Faridpur', bn: 'ফরিদপুর' },
        { en: 'Gazipur', bn: 'গাজীপুর' },
        { en: 'Gopalganj', bn: 'গোপালগঞ্জ' },
        { en: 'Jamalpur', bn: 'জামালপুর' },
        { en: 'Kishoreganj', bn: 'কিশোরগঞ্জ' },
        { en: 'Madaripur', bn: 'মাদারীপুর' },
        { en: 'Manikganj', bn: 'মানিকগঞ্জ' },
        { en: 'Munshiganj', bn: 'মুন্সিগঞ্জ' },
        { en: 'Mymensingh', bn: 'ময়মনসিংহ' },
        { en: 'Narayanganj', bn: 'নারায়ণগঞ্জ' },
        { en: 'Narsingdi', bn: 'নরসিংদী' },
        { en: 'Netrokona', bn: 'নেত্রকোণা' },
        { en: 'Rajbari', bn: 'রাজবাড়ী' },
        { en: 'Shariatpur', bn: 'শরীয়তপুর' },
        { en: 'Sherpur', bn: 'শেরপুর' },
        { en: 'Tangail', bn: 'টাঙ্গাইল' },
      ],
    },
    {
      en: 'Chattogram',
      bn: 'চট্টগ্রাম',
      districts: [
        { en: 'Bandarban', bn: 'বান্দরবান' },
        { en: 'Brahmanbaria', bn: 'ব্রাহ্মণবাড়িয়া' },
        { en: 'Chandpur', bn: 'চাঁদপুর' },
        { en: 'Chattogram', bn: 'চট্টগ্রাম' },
        { en: 'Cumilla', bn: 'কুমিল্লা' },
        { en: 'Cox\'s Bazar', bn: 'কক্সবাজার' },
        { en: 'Feni', bn: 'ফেনী' },
        { en: 'Khagrachari', bn: 'খাগড়াছড়ি' },
        { en: 'Lakshmipur', bn: 'লক্ষ্মীপুর' },
        { en: 'Noakhali', bn: 'নোয়াখালী' },
        { en: 'Rangamati', bn: 'রাঙ্গামাটি' },
      ],
    },
    {
      en: 'Rajshahi',
      bn: 'রাজশাহী',
      districts: [
        { en: 'Bogura', bn: 'বগুড়া' },
        { en: 'Chapainawabganj', bn: 'চাঁপাইনবাবগঞ্জ' },
        { en: 'Joypurhat', bn: 'জয়পুরহাট' },
        { en: 'Naogaon', bn: 'নওগাঁ' },
        { en: 'Natore', bn: 'নাটোর' },
        { en: 'Pabna', bn: 'পাবনা' },
        { en: 'Rajshahi', bn: 'রাজশাহী' },
        { en: 'Sirajganj', bn: 'সিরাজগঞ্জ' },
      ],
    },
    {
      en: 'Khulna',
      bn: 'খুলনা',
      districts: [
        { en: 'Bagerhat', bn: 'বাগেরহাট' },
        { en: 'Chuadanga', bn: 'চুয়াডাঙ্গা' },
        { en: 'Jessore', bn: 'যশোর' },
        { en: 'Jhenaidah', bn: 'झিনাইদহ' },
        { en: 'Khulna', bn: 'খুলনা' },
        { en: 'Kushtia', bn: 'কুষ্টিয়া' },
        { en: 'Magura', bn: 'মাগুরা' },
        { en: 'Meherpur', bn: 'মেহেরপুর' },
        { en: 'Narail', bn: 'নড়াইল' },
        { en: 'Satkhira', bn: 'সাতক্ষীরা' },
      ],
    },
    {
      en: 'Barishal',
      bn: 'বরিশাল',
      districts: [
        { en: 'Barishal', bn: 'বরিশাল' },
        { en: 'Bhola', bn: 'ভোলা' },
        { en: 'Jhalokati', bn: 'ঝালকাঠি' },
        { en: 'Patuakhali', bn: 'পটুয়াখালী' },
        { en: 'Pirojpur', bn: 'পিরোজপুর' },
      ],
    },
    {
      en: 'Sylhet',
      bn: 'সিলেট',
      districts: [
        { en: 'Habiganj', bn: 'হবিগঞ্জ' },
        { en: 'Moulvibazar', bn: 'মৌলভীবাজার' },
        { en: 'Sunamganj', bn: 'সুনামগঞ্জ' },
        { en: 'Sylhet', bn: 'সিলেট' },
      ],
    },
    {
      en: 'Rangpur',
      bn: 'রংপুর',
      districts: [
        { en: 'Dinajpur', bn: 'দিনাজপুর' },
        { en: 'Gaibandha', bn: 'গাইবান্ধা' },
        { en: 'Kurigram', bn: 'কুড়িগ্রাম' },
        { en: 'Lalmonirhat', bn: 'লালমনিরহাট' },
        { en: 'Nilphamari', bn: 'নীলফামারী' },
        { en: 'Panchagarh', bn: 'পঞ্চগড়' },
        { en: 'Rangpur', bn: 'রংপুর' },
        { en: 'Thakurgaon', bn: 'ঠাকুরগাঁও' },
      ],
    },
    {
      en: 'Mymensingh',
      bn: 'ময়মনসিংহ',
      districts: [
        { en: 'Jamalpur', bn: 'জামালপুর' },
        { en: 'Mymensingh', bn: 'ময়মনসিংহ' },
        { en: 'Netrokona', bn: 'নেত্রকোণা' },
        { en: 'Sherpur', bn: 'শেরপুর' },
      ],
    },
  ],
};

export const COUNTRIES = [BANGLADESH];
```

---

#### 2.1 Create Address Selector Components

Create three separate selector components:

**1. CountrySelector Component**

**File:** `src/components/seller/CountrySelector.tsx`

```typescript
interface CountrySelectorProps {
  value: string; // country code (e.g., 'BD')
  onChange: (code: string) => void;
  disabled?: boolean;
  error?: string;
}
```

- Single option (Bangladesh)
- Auto-selected by default
- Shows Bengali name in Bengali mode

**2. DivisionSelector Component**

**File:** `src/components/seller/DivisionSelector.tsx`

```typescript
interface DivisionSelectorProps {
  selectedEn: string;
  selectedBn: string;
  onChange: (en: string, bn: string) => void;
  disabled?: boolean;
  error?: string;
}
```

- Dropdown with 8 divisions
- Bengali script only display
- Syncs EN/BN automatically

**3. DistrictSelector Component**

**File:** `src/components/seller/DistrictSelector.tsx`

```typescript
interface DistrictSelectorProps {
  selectedDivisionEn: string;
  selectedDistrictEn: string;
  selectedDistrictBn: string;
  onChange: (en: string, bn: string) => void;
  disabled?: boolean;
  error?: string;
}
```

- Dropdown filtered by selected division
- Bengali script only display
- Syncs EN/BN automatically

---

#### 2.2 Update API Type Definitions

**File:** `src/lib/api/endpoints/seller-shop.api.ts`

**Current:**
```typescript
export interface UpdateAddressDto {
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  googleMapsLink?: string;
  country?: string;
  division?: string;
  district?: string;
  street?: string;
  translations?: {
    country?: string;
    division?: string;
    district?: string;
    street?: string;
  };
}
```

**New:**
```typescript
export interface AddressTranslation {
  country: string;
  division: string;
  district: string;
  street: string;
}

export interface UpdateAddressDto {
  postalCode?: string;
  latitude?: string;      // Keep as string for precision
  longitude?: string;     // Keep as string for precision
  googleMapsLink?: string;
  translations?: {
    en: AddressTranslation;
    bn: AddressTranslation;
  };
}
```

**Changes:**
- ✅ Add `AddressTranslation` interface
- ✅ Use `translations.en` and `translations.bn` structure
- ✅ Keep latitude/longitude as string (backend handles conversion)

---

#### 2.2 Update AddressEditModal Component

**File:** `src/components/seller/AddressEditModal.tsx`

##### 2.2.1 Update `AddressFormData` Interface

**Current:**
```typescript
export interface AddressFormData {
  postalCode: string;
  latitude?: string;
  longitude?: string;
  googleMapsLink?: string;
  
  // English
  country: string;
  division: string;
  district: string;
  street: string;
  
  // Bengali
  bnCountry: string;
  bnDivision: string;
  bnDistrict: string;
  bnStreet: string;
}
```

**New:**
```typescript
export interface AddressFormData {
  // Non-translatable
  postalCode: string;
  latitude?: string;
  longitude?: string;
  googleMapsLink?: string;
  
  // Translations object
  translations: {
    en: {
      country: string;
      division: string;
      district: string;
      street: string;
    };
    bn: {
      country: string;
      division: string;
      district: string;
      street: string;
    };
  };
}
```

---

##### 2.2.2 Update Form State Initialization

**Current:**
```typescript
const [formData, setFormData] = createSignal<AddressFormData>({
  postalCode: props.address?.postalCode || "",
  latitude: props.address?.latitude || "",
  longitude: props.address?.longitude || "",
  googleMapsLink: props.address?.googleMapsLink || "",
  country: enTranslation()?.country || "",
  division: enTranslation()?.division || "",
  district: enTranslation()?.district || "",
  street: enTranslation()?.street || "",
  bnCountry: bnTranslation()?.country || "",
  bnDivision: bnTranslation()?.division || "",
  bnDistrict: bnTranslation()?.district || "",
  bnStreet: bnTranslation()?.street || "",
});
```

**New:**
```typescript
const [formData, setFormData] = createSignal<AddressFormData>({
  postalCode: props.address?.postalCode || "",
  latitude: props.address?.latitude || "",
  longitude: props.address?.longitude || "",
  googleMapsLink: props.address?.googleMapsLink || "",
  translations: {
    en: {
      country: enTranslation()?.country || "",
      division: enTranslation()?.division || "",
      district: enTranslation()?.district || "",
      street: enTranslation()?.street || "",
    },
    bn: {
      country: bnTranslation()?.country || "",
      division: bnTranslation()?.division || "",
      district: bnTranslation()?.district || "",
      street: bnTranslation()?.street || "",
    },
  },
});
```

---

##### 2.2.3 Add Validation Function

**New:**
```typescript
const validateForm = (): boolean => {
  const t = formData().translations;
  const newErrors: Record<string, string> = {};
  let isValid = true;

  // Validate English translations
  if (!t.en.country.trim()) {
    newErrors.enCountry = t("seller.shop.myShop.shopAddress.countryRequired");
    isValid = false;
  }
  if (!t.en.division.trim()) {
    newErrors.enDivision = t("seller.shop.myShop.shopAddress.divisionRequired");
    isValid = false;
  }
  if (!t.en.district.trim()) {
    newErrors.enDistrict = t("seller.shop.myShop.shopAddress.districtRequired");
    isValid = false;
  }
  if (!t.en.street.trim()) {
    newErrors.enStreet = t("seller.shop.myShop.shopAddress.streetRequired");
    isValid = false;
  }

  // Validate Bengali translations
  if (!t.bn.country.trim()) {
    newErrors.bnCountry = t("seller.shop.myShop.shopAddress.countryRequired");
    isValid = false;
  }
  if (!t.bn.division.trim()) {
    newErrors.bnDivision = t("seller.shop.myShop.shopAddress.divisionRequired");
    isValid = false;
  }
  if (!t.bn.district.trim()) {
    newErrors.bnDistrict = t("seller.shop.myShop.shopAddress.districtRequired");
    isValid = false;
  }
  if (!t.bn.street.trim()) {
    newErrors.bnStreet = t("seller.shop.myShop.shopAddress.streetRequired");
    isValid = false;
  }

  setErrors(newErrors);
  return isValid;
};
```

---

##### 2.2.4 Update handleSubmit with Data Transformation

**Current:**
```typescript
const handleSubmit = async () => {
  setIsSubmitting(true);
  try {
    await props.onSave(formData());
    props.onClose();
  } catch (error) {
    console.error("Failed to save address:", error);
  } finally {
    setIsSubmitting(false);
  }
};
```

**New:**
```typescript
const handleSubmit = async () => {
  // Validate form before submission
  if (!validateForm()) {
    return;
  }

  setIsSubmitting(true);
  try {
    const data = formData();
    
    // Transform to API DTO format
    const dto: UpdateAddressDto = {
      postalCode: data.postalCode || undefined,
      latitude: data.latitude || undefined,
      longitude: data.longitude || undefined,
      googleMapsLink: data.googleMapsLink || undefined,
      translations: {
        en: {
          country: data.translations.en.country,
          division: data.translations.en.division,
          district: data.translations.en.district,
          street: data.translations.en.street,
        },
        bn: {
          country: data.translations.bn.country,
          division: data.translations.bn.division,
          district: data.translations.bn.district,
          street: data.translations.bn.street,
        },
      },
    };
    
    await props.onSave(dto);
    props.onClose();
  } catch (error) {
    console.error("Failed to save address:", error);
  } finally {
    setIsSubmitting(false);
  }
};
```

---

##### 2.2.5 Add Helper Function for Updates

**New:**
```typescript
const updateTranslationField = (
  locale: 'en' | 'bn',
  field: 'country' | 'division' | 'district' | 'street',
  value: string
) => {
  setFormData(prev => ({
    ...prev,
    translations: {
      ...prev.translations,
      [locale]: {
        ...prev.translations[locale],
        [field]: value,
      },
    },
  }));
};
```

---

##### 2.2.6 Replace Input Fields with Selectors

**Country Field (Auto-selected):**
```tsx
<CountrySelector
  value={formData().translations.en.country === 'Bangladesh' ? 'BD' : ''}
  onChange={(code) => {
    if (code === 'BD') {
      updateTranslationField("en", "country", "Bangladesh");
      updateTranslationField("bn", "country", "বাংলাদেশ");
    }
  }}
  error={errors().enCountry || errors().bnCountry}
  disabled
/>
```

**Division Field (Dropdown):**
```tsx
<DivisionSelector
  selectedEn={formData().translations.en.division}
  selectedBn={formData().translations.bn.division}
  onChange={(en, bn) => {
    updateTranslationField("en", "division", en);
    updateTranslationField("bn", "division", bn);
  }}
  error={errors().enDivision || errors().bnDivision}
/>
```

**District Field (Filtered Dropdown):**
```tsx
<DistrictSelector
  selectedDivisionEn={formData().translations.en.division}
  selectedDistrictEn={formData().translations.en.district}
  selectedDistrictBn={formData().translations.bn.district}
  onChange={(en, bn) => {
    updateTranslationField("en", "district", en);
    updateTranslationField("bn", "district", bn);
  }}
  error={errors().enDistrict || errors().bnDistrict}
/>
```

**Street Field (Remains Input):**
```tsx
<Input
  label={t("seller.shop.myShop.shopAddress.street")}
  value={formData().translations.en.street}
  onInput={(e) => updateTranslationField("en", "street", e.currentTarget.value)}
  placeholder="House 123, Road 45, Dhanmondi"
  error={errors().enStreet}
  required
/>

<Input
  label={t("seller.shop.myShop.shopAddress.street")}
  value={formData().translations.bn.street}
  onInput={(e) => updateTranslationField("bn", "street", e.currentTarget.value)}
  placeholder="বাড়ি ১২৩, রোড ৪৫, ধানমন্ডি"
  error={errors().bnStreet}
  required
/>
```

**New (English):**
```tsx
<Input
  label={t("seller.shop.myShop.shopAddress.country")}
  value={formData().translations.en.country}
  onInput={(e) => updateTranslationField("en", "country", e.currentTarget.value)}
  placeholder="Bangladesh"
  error={errors().enCountry}
  required
/>
```

**Current (Bengali):**
```tsx
<Input
  label={t("seller.shop.myShop.shopAddress.country")}
  value={formData().bnCountry}
  onInput={(e) => updateField("bnCountry", e.currentTarget.value)}
  placeholder="বাংলাদেশ"
/>
```

**New (Bengali):**
```tsx
<Input
  label={t("seller.shop.myShop.shopAddress.country")}
  value={formData().translations.bn.country}
  onInput={(e) => updateTranslationField("bn", "country", e.currentTarget.value)}
  placeholder="বাংলাদেশ"
  error={errors().bnCountry}
  required
/>
```

---

##### 2.2.7 Add Translation Keys

**File:** `src/i18n/en.ts` and `src/i18n/bn.ts`

**Add to `seller.shop.myShop.shopAddress`:**
```typescript
// English (en.ts)
shopAddress: {
  // ...existing keys
  countryRequired: "Country is required",
  divisionRequired: "Division is required",
  districtRequired: "District is required",
  streetRequired: "Street address is required",
  bothLanguagesRequired: "Both English and Bengali translations are required",
}

// Bengali (bn.ts)
shopAddress: {
  // ...existing keys
  countryRequired: "দেশ আবশ্যক",
  divisionRequired: "বিভাগ আবশ্যক",
  districtRequired: "জেলা আবশ্যক",
  streetRequired: "রাস্তার ঠিকানা আবশ্যক",
  bothLanguagesRequired: "ইংরেজি এবং বাংলা উভয় অনুবাদ প্রয়োজন",
}
```

---

#### 2.3 Update My Shop Page Handler

**File:** `src/routes/(protected)/app/seller/(seller-protected)/my-shop/(my-shop).tsx`

**Current:**
```typescript
const handleSaveAddress = async (data: AddressFormData) => {
  setIsSaving(true);
  try {
    await sellerShopApi.updateAddress({
      postalCode: data.postalCode,
      latitude: data.latitude ? parseFloat(data.latitude) : undefined,
      longitude: data.longitude ? parseFloat(data.longitude) : undefined,
      googleMapsLink: data.googleMapsLink,
      country: data.country,
      division: data.division,
      district: data.district,
      street: data.street,
      translations: {
        country: data.bnCountry,
        division: data.bnDivision,
        district: data.bnDistrict,
        street: data.bnStreet,
      },
    });
    window.location.reload();
  } catch (error) {
    console.error("Failed to update address:", error);
    throw error;
  } finally {
    setIsSaving(false);
  }
};
```

**New:**
```typescript
const handleSaveAddress = async (data: UpdateAddressDto) => {
  setIsSaving(true);
  try {
    await sellerShopApi.updateAddress(data);
    window.location.reload();
  } catch (error) {
    console.error("Failed to update address:", error);
    throw error;
  } finally {
    setIsSaving(false);
  }
};
```

**Changes:**
- ✅ Remove data transformation (handled in modal)
- ✅ Pass DTO directly to API

---

### Phase 3: Testing

#### 3.1 Backend Testing

**File:** `src/api/user/seller/shop/shop.controller.spec.ts` (if exists)

**Test Cases:**
```typescript
describe('updateMyShopAddress', () => {
  it('should update address with both translations', async () => {
    const dto: UpdateShopAddressDto = {
      postalCode: '1209',
      translations: {
        en: {
          country: 'Bangladesh',
          division: 'Dhaka',
          district: 'Dhaka',
          street: 'House 123, Road 45',
        },
        bn: {
          country: 'বাংলাদেশ',
          division: 'ঢাকা',
          district: 'ঢাকা',
          street: 'বাড়ি ১২৩, রোড ৪৫',
        },
      },
    };
    
    // Test service method
  });

  it('should reject if only English translation provided', async () => {
    const dto: UpdateShopAddressDto = {
      translations: {
        en: { /* ... */ },
        // bn missing
      },
    };
    
    // Should throw validation error
  });

  it('should update only non-translatable fields', async () => {
    const dto: UpdateShopAddressDto = {
      postalCode: '1209',
      latitude: '23.8103',
    };
    
    // Should update without translations
  });
});
```

---

#### 3.2 Frontend Testing

**Manual Testing Checklist:**

- [ ] Form loads with existing address data (both languages)
- [ ] Form shows empty state for new address
- [ ] Validation errors show for missing required fields
- [ ] Both English and Bengali sections must be filled
- [ ] Submitting valid data updates address successfully
- [ ] Page reloads with updated address
- [ ] Address displays correctly in both languages
- [ ] GPS coordinates save with correct precision
- [ ] Google Maps link validates as URL

---

#### 3.3 Integration Testing

**End-to-End Flow:**

1. Navigate to `/app/seller/my-shop`
2. Click "Edit Address" button
3. Fill all English fields
4. Fill all Bengali fields
5. Add postal code and GPS coordinates
6. Click "Save"
7. Verify success message
8. Verify address displays in both languages
9. Edit again and verify data persists

---

## Files to Modify

### Backend (`byte-forge-auth`)

| File | Changes | Estimated Time |
|------|---------|----------------|
| `src/api/user/seller/shop/dto/update-shop-address.dto.ts` | Update Zod schema to use `translations.en` and `translations.bn` | 30 min |
| `src/api/user/seller/shop/shop.service.ts` | Update `updateMyShopAddress` method | 30 min |

**Total Backend:** 1 hour

---

### Frontend (`byte-forge-frontend`)

| File | Changes | Estimated Time |
|------|---------|----------------|
| `src/data/bangladesh-addresses.ts` | Create Bangladesh divisions/districts data | 30 min |
| `src/components/seller/CountrySelector.tsx` | Create country selector component | 20 min |
| `src/components/seller/DivisionSelector.tsx` | Create division selector component | 30 min |
| `src/components/seller/DistrictSelector.tsx` | Create district selector component | 30 min |
| `src/lib/api/endpoints/seller-shop.api.ts` | Update `UpdateAddressDto` type | 15 min |
| `src/components/seller/AddressEditModal.tsx` | Refactor form structure, validation, submission | 1.5 hours |
| `src/routes/(protected)/app/seller/(seller-protected)/my-shop/(my-shop).tsx` | Simplify handler | 15 min |
| `src/i18n/en.ts` | Add validation error strings | 10 min |
| `src/i18n/bn.ts` | Add validation error strings (Bengali) | 10 min |

**Total Frontend:** 4 hours

---

### Testing

| Type | Estimated Time |
|------|----------------|
| Backend unit tests | 30 min |
| Frontend manual testing | 30 min |
| Integration testing | 30 min |

**Total Testing:** 1.5 hours

---

## Total Estimated Effort

| Phase | Time |
|-------|------|
| Backend Changes | 1 hour |
| Frontend Changes | 4 hours |
| Testing | 1.5 hours |
| **Total** | **6.5 hours** |

---

## Migration & Deployment

### Breaking Changes
- ⚠️ **API Request Body Format** - Changes from flat structure to `translations` object
- ⚠️ **Frontend Form Data** - Changes from `bn*` fields to `translations.bn` object

### Deployment Order
1. **Deploy Backend First** - New API format must be live
2. **Deploy Frontend Immediately After** - Minimize window of incompatibility
3. **Monitor Logs** - Watch for 400 errors from old format

### Rollback Plan
If issues occur:
1. Revert frontend deployment
2. Backend is backward compatible (Zod schema can be updated to accept both formats temporarily)

---

## Success Criteria

- [ ] Backend accepts `translations.en` and `translations.bn` format
- [ ] Backend validates both languages are provided
- [ ] Frontend form uses nested `translations` object
- [ ] Form validates both English and Bengali required
- [ ] Address upsert works correctly (create and update)
- [ ] Address displays in both languages after save
- [ ] No TypeScript errors
- [ ] No runtime errors
- [ ] All validation messages display correctly

---

## Notes

- ✅ Database schema unchanged (already supports translation pattern)
- ✅ Repository methods unchanged (already support upsert)
- ✅ Consistent with shop setup form pattern
- ✅ Both languages treated equally (required)
- ✅ Easy to maintain and extend

---

## Appendix: Before/After Comparison

### Request Body Comparison

**Before:**
```json
{
  "country": "Bangladesh",
  "division": "Dhaka",
  "district": "Dhaka",
  "street": "House 123, Road 45",
  "postalCode": "1209",
  "translations": {
    "country": "বাংলাদেশ",
    "division": "ঢাকা",
    "district": "ঢাকা",
    "street": "বাড়ি ১২৩, রোড ৪৫"
  }
}
```

**After:**
```json
{
  "postalCode": "1209",
  "translations": {
    "en": {
      "country": "Bangladesh",
      "division": "Dhaka",
      "district": "Dhaka",
      "street": "House 123, Road 45"
    },
    "bn": {
      "country": "বাংলাদেশ",
      "division": "ঢাকা",
      "district": "ঢাকা",
      "street": "বাড়ি ১২৩, রোড ৪৫"
    }
  }
}
```

### Frontend State Comparison

**Before:**
```typescript
{
  country: "Bangladesh",
  division: "Dhaka",
  district: "Dhaka",
  street: "House 123, Road 45",
  bnCountry: "বাংলাদেশ",
  bnDivision: "ঢাকা",
  bnDistrict: "ঢাকা",
  bnStreet: "বাড়ি ১২৩, রোড ৪৫",
  postalCode: "1209"
}
```

**After:**
```typescript
{
  postalCode: "1209",
  translations: {
    en: {
      country: "Bangladesh",
      division: "Dhaka",
      district: "Dhaka",
      street: "House 123, Road 45"
    },
    bn: {
      country: "বাংলাদেশ",
      division: "ঢাকা",
      district: "ঢাকা",
      street: "বাড়ি ১২৩, রোড ৪৫"
    }
  }
}
```

---

**Plan Approved:** Ready for implementation
