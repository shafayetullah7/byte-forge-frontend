/**
 * Media object structure
 */
export interface Media {
  id: string;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
  usedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * User upload media link
 */
export interface UserUploadMedia {
  userId: string;
  mediaId: string;
}

/**
 * Cloudinary media details
 */
export interface CloudinaryMedia {
  id: string;
  mediaId: string;
  publicKey: string;
}

/**
 * Media record as returned by getAllMedia
 */
export interface MediaRecord {
  media: Media;
  userUploadMedia: UserUploadMedia;
  cloudinaryMedia: CloudinaryMedia | null;
}

/**
 * Upload media response
 * Refactored: Backend returns Media object directly.
 */
export type UploadMediaResponse = Media;

