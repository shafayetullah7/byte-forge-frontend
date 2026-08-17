/**
 * User data returned from OIDC session check (`/api/v1/user/auth/oidc-check`).
 */
export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
