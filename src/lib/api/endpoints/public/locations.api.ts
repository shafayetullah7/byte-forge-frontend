import { query } from "@solidjs/router";
import { fetcher } from '../../api-client';

/**
 * District with resolved name (translations already resolved by backend)
 */
export interface District {
  id: string;
  code: string;
  name: string;
}

/**
 * Division with resolved name and nested districts
 */
export interface Division {
  id: string;
  code: string;
  name: string;
  districts: District[];
}

/**
 * Get all divisions with districts
 * Uses query for SSR caching and locale-aware responses
 */
export const getDivisions = query(
  async (): Promise<Division[]> => {
    "use server";
    return fetcher<Division[]>('/api/v1/locations/divisions');
  },
  "public-divisions"
);

/**
 * Get all districts
 * Uses query for SSR caching and locale-aware responses
 */
export const getDistricts = query(
  async (): Promise<District[]> => {
    "use server";
    return fetcher<District[]>('/api/v1/locations/districts');
  },
  "public-districts"
);

/**
 * Locations API endpoints
 */
export const locationsApi = {
  getAllDistricts: getDistricts,
  getAllDivisions: getDivisions,
};
