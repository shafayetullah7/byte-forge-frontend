// Re-export API client
export { api, fetcher, type FetchOptions } from "./api-client";

// Re-export common types
export * from "./types";
export * from "./types/auth.types";
export * from "./types/media.types";
export * from "./types/library.types";
export * from "./types/seller.types";
export type {
  VerificationStatus,
  UpdateVerificationRequest,
} from "./types/seller.types";

// Re-export auth utilities
export * from "./utils/server-auth";
export * from "./utils/client-auth";

// Re-export API endpoints
export * from "./endpoints/public";
export * from "./endpoints/user";
export * from "./endpoints/seller";
export * from "./endpoints/admin";
