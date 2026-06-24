export type StorefrontProfileTranslation = {
  tagline: string;
  about: string;
  sellerStory: string;
  brandMission: string;
};

export type StorefrontListItem = {
  id?: string;
  displayOrder: number;
  translations: {
    en: { text: string };
    bn: { text: string };
  };
};

export type SellerStorefrontData = {
  profile: {
    translations: {
      en: StorefrontProfileTranslation;
      bn: StorefrontProfileTranslation;
    };
  };
  whyChooseUs: StorefrontListItem[];
  valuePoints: StorefrontListItem[];
  categoriesServed: {
    en: string[];
    bn: string[];
    preview: string[];
  };
};

export type UpdateStorefrontProfilePayload = {
  translations: {
    en: Partial<StorefrontProfileTranslation>;
    bn: Partial<StorefrontProfileTranslation>;
  };
};

export type ReplaceStorefrontListPayload = {
  items: Array<{
    id?: string;
    translations: {
      en: { text: string };
      bn: { text: string };
    };
  }>;
};
