import { z } from "zod";

/**
 * Zod schema for address form validation
 */
export const addressSchema = z.object({
  postalCode: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  googleMapsLink: z.string().optional(),
  translations: z.object({
    en: z.object({
      country: z.string().min(1, "seller.shop.myShop.shopAddress.countryRequired"),
      division: z.string().min(1, "seller.shop.myShop.shopAddress.divisionRequired"),
      district: z.string().min(1, "seller.shop.myShop.shopAddress.districtRequired"),
      street: z.string().min(1, "seller.shop.myShop.shopAddress.streetRequired"),
    }),
    bn: z.object({
      country: z.string().min(1, "seller.shop.myShop.shopAddress.countryRequired"),
      division: z.string().min(1, "seller.shop.myShop.shopAddress.divisionRequired"),
      district: z.string().min(1, "seller.shop.myShop.shopAddress.districtRequired"),
      street: z.string().min(1, "seller.shop.myShop.shopAddress.streetRequired"),
    }),
  }),
});

/**
 * Type inferred from the zod schema
 */
export type AddressFormData = z.infer<typeof addressSchema>;
