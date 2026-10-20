export type SearchSuggestItemType = "plant" | "shop";

export type SearchSuggestMedia = {
  id: string;
  url: string;
};

export type SearchSuggestItem = {
  type: SearchSuggestItemType;
  slug: string;
  name: string;
  subtitle?: string;
  image?: SearchSuggestMedia | null;
};

export type SearchSuggestData = {
  items: SearchSuggestItem[];
};
