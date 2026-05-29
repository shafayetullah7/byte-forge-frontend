import { fetcher } from '../../api-client';

/**
 * District with translation
 */
export interface District {
  id: string;
  code: string;
  divisionId: string;
  translations: Array<{
    locale: string;
    name: string;
  }>;
}

/**
 * Division with districts
 */
export interface Division {
  id: string;
  code: string;
  translations: Array<{
    locale: string;
    name: string;
  }>;
  districts: District[];
}

/**
 * Locations API endpoints
 */
export const locationsApi = {
  /**
   * Get all districts
   */
  getAllDistricts: async (): Promise<District[]> => {
    return fetcher<District[]>('/api/v1/locations/districts');
  },

  /**
   * Get all divisions with districts
   */
  getAllDivisions: async (): Promise<Division[]> => {
    return fetcher<Division[]>('/api/v1/locations/divisions');
  },
};
