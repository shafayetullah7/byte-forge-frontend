export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ReviewImage {
  id: string;
  displayOrder: number;
  media: { id: string; url: string } | null;
}

export interface ReviewSummary {
  total: number;
  average: number;
  distribution: Array<{
    rating: number;
    count: number;
    percentage: number;
  }>;
}

export interface PublicReview {
  id: string;
  productId: string;
  rating: number;
  title: string | null;
  comment: string | null;
  isVerifiedPurchase: boolean;
  createdAt: string;
  customerName: string;
  images: ReviewImage[];
}

export interface FeaturedPublicReview extends PublicReview {
  product: {
    id: string;
    slug: string;
    thumbnail: { id: string; url: string } | null;
  } | null;
  featuredAt: string | null;
}

export interface PublicReviewResponse {
  summary: ReviewSummary;
  reviews: PublicReview[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CreateReviewRequest {
  orderItemId: string;
  rating: number;
  title?: string | null;
  comment?: string | null;
}

export interface BuyerReviewEligibility {
  canReview: boolean;
  reason: string | null;
  productId: string | null;
  review: {
    id: string;
    status: ReviewStatus;
  } | null;
}

export interface SellerProductReview extends PublicReview {
  orderItemId: string;
  status: ReviewStatus;
  updatedAt: string;
}

export interface SellerProductReviewResponse {
  summary: ReviewSummary;
  reviews: SellerProductReview[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
