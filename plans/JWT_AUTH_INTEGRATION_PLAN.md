# JWT Auth & Token Refresh Integration Plan

## Overview

This plan outlines the integration of the new JWT-based authentication system with automatic token refresh from `byte-forge-auth` into the `byte-forge-frontend` SolidStart application.

## Backend Summary

### New Authentication Flow

The backend (`byte-forge-auth`) now implements:

1. **Session-based login** - Returns session cookie on login
2. **JWT Access Token** - Short-lived token for API authorization (stored in `userAccessToken` cookie)
3. **JWT Refresh Token** - Long-lived token for refreshing access (stored in `userRefreshToken` cookie)
4. **Automatic Token Rotation** - Refresh tokens are rotated on each use with race condition handling

### Key Endpoints

| Endpoint | Method | Cookies Set | Description |
|----------|--------|-------------|-------------|
| `/api/v1/user/auth/login` | POST | `sessionId` | Login with email/password |
| `/api/v1/user/auth/check` | GET | - | Check auth status (requires `UserAuthGuard`) |
| `/api/v1/user/auth/logout` | POST | - | Logout and clear session |
| `/api/v1/user/auth/refresh` | POST | `userAccessToken`, `userRefreshToken`, `xsrf-token` | **NEW** Refresh tokens |

### Cookie Names (Backend Sets)

- `sessionId` - Session identifier
- `userAccessToken` - JWT access token
- `userRefreshToken` - JWT refresh token  
- `xsrf-token` - CSRF protection token

## Frontend Integration Tasks

### 1. Update Auth Types

**File:** `src/lib/api/types/auth.types.ts`

Add new types for token-based authentication:

```typescript
export interface TokenAuthResponse {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  user: AuthUser;
}

export interface RefreshTokenResponse {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  user: AuthUser;
}
```

### 2. Add Refresh Token API Endpoint

**File:** `src/lib/api/endpoints/auth.api.ts`

Add new endpoint:

```typescript
/**
 * Refresh access and refresh tokens
 * Uses the refresh token cookie to get new tokens
 */
refreshTokens: async (): Promise<RefreshTokenResponse> => {
  return fetcher<RefreshTokenResponse>("/api/v1/user/auth/refresh", {
    method: "POST",
  });
};
```

### 3. Update API Client for Token Handling

**File:** `src/lib/api/api-client.ts`

The API client already handles cookies via `credentials: "include"`. The SSR cookie propagation is already implemented. No changes needed for basic functionality.

**Optional Enhancement:** Add automatic token refresh on 401:

```typescript
// In the error handling section (around line 156-189)
if (response.status === 401 && !isExcluded) {
  // Check if this is an access token expiry (not session expiry)
  // Attempt token refresh before redirecting to login
  if (endpoint !== "/api/v1/user/auth/refresh") {
    try {
      await authApi.refreshTokens();
      // Retry the original request with new tokens
      const retryResponse = await makeRequest(fetchOptions, headers);
      if (retryResponse.ok) {
        // ... handle successful retry
      }
    } catch (refreshError) {
      // Refresh failed, proceed with normal 401 handling
    }
  }
  // ... existing 401 handling
}
```

### 4. Update Session Management

**File:** `src/lib/auth/session.ts`

The current session management uses `authApi.checkAuth()` which relies on the session cookie. This should continue to work because:

1. The backend still uses `sessionId` cookie for session tracking
2. The `UserAuthGuard` validates the session and returns user data

**No changes required** for basic functionality.

### 5. Update Middleware (Optional)

**File:** `src/middleware/index.ts`

The current middleware checks for `sessionId` cookie. This continues to work.

**Optional Enhancement:** Add token expiry checking for proactive refresh:

```typescript
onRequest: async (event) => {
  const sessionCookie = getCookie(event.nativeEvent, "session");
  const accessToken = getCookie(event.nativeEvent, "userAccessToken");
  
  event.locals.isAuthenticated = !!sessionCookie;
  event.locals.sessionId = sessionCookie || null;
  event.locals.hasAccessToken = !!accessToken;
};
```

### 6. Update Login Route

**File:** `src/routes/(auth)/(access)/login/(login).tsx`

The current login action should work without changes because:
1. It calls `authApi.login()` which returns session data
2. The backend sets cookies via HTTP-only headers
3. SolidStart's middleware captures the cookies

**No changes required.**

### 7. Add Token Refresh Hook

**New File:** `src/lib/hooks/useTokenRefresh.ts`

Create a hook for automatic token refresh:

```typescript
import { createEffect, createSignal, onCleanup } from "solid-js";

/**
 * Automatic token refresh hook
 * Refreshes tokens before they expire
 */
export function useTokenRefresh() {
  const [isRefreshing, setIsRefreshing] = createSignal(false);
  const refreshTimer = useRef<number | null>(null);

  const scheduleRefresh = () => {
    // Schedule refresh 5 minutes before token expiry
    // Assuming 7-day refresh token expiry
    const REFRESH_LEEWAY = 5 * 60 * 1000; // 5 minutes
    const TOKEN_LIFETIME = 7 * 24 * 60 * 60 * 1000; // 7 days
    
    if (refreshTimer.current) {
      clearTimeout(refreshTimer.current);
    }
    
    refreshTimer.current = window.setTimeout(async () => {
      try {
        setIsRefreshing(true);
        await authApi.refreshTokens();
        scheduleRefresh(); // Schedule next refresh
      } catch (error) {
        console.error("Token refresh failed:", error);
        // Don't redirect here - let the next API call handle 401
      } finally {
        setIsRefreshing(false);
      }
    }, TOKEN_LIFETIME - REFRESH_LEEWAY);
  };

  const cancelRefresh = () => {
    if (refreshTimer.current) {
      clearTimeout(refreshTimer.current);
      refreshTimer.current = null;
    }
  };

  onCleanup(() => cancelRefresh());

  return {
    isRefreshing: isRefreshing(),
    scheduleRefresh,
    cancelRefresh,
  };
}
```

### 8. Update App Root for Token Management

**File:** `src/app.tsx`

Initialize token refresh on app mount:

```typescript
import { useTokenRefresh } from "~/lib/hooks/useTokenRefresh";
import { getSession } from "~/lib/auth/session";

export default function App() {
  // Start token refresh cycle when user is authenticated
  const session = getSession();
  const { scheduleRefresh } = useTokenRefresh();

  createEffect(() => {
    if (session()) {
      scheduleRefresh();
    }
  });

  return (
    // ... existing app structure
  );
}
```

### 9. Update Logout to Clear Tokens

**File:** `src/lib/auth/session.ts`

The current `performLogout()` calls `authApi.logout()` which clears the session cookie on the backend. The backend should also clear the token cookies.

**Verify backend clears these cookies on logout:**
- `userAccessToken`
- `userRefreshToken`
- `xsrf-token`

If not, update the backend logout endpoint or add client-side cleanup:

```typescript
export const performLogout = async () => {
  const { revalidate } = await import("@solidjs/router");

  try {
    await authApi.logout();
  } catch (error: any) {
    if (error?.statusCode !== 401) {
      console.error("[Auth] Logout error:", error);
    }
  } finally {
    // Clear any client-side stored tokens if applicable
    if (!import.meta.env.SSR) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
    await revalidate("user-session");
  }

  return true;
};
```

## Implementation Order

1. **Phase 1: Foundation** (Tasks 1-3)
   - Update auth types
   - Add refresh endpoint
   - Verify API client handles cookies

2. **Phase 2: Session Integration** (Tasks 4-6)
   - Verify session management works
   - Test login flow
   - Verify middleware

3. **Phase 3: Automatic Refresh** (Tasks 7-9)
   - Create token refresh hook
   - Integrate into app root
   - Test logout flow

4. **Phase 4: Testing**
   - Test concurrent tab refresh (race condition)
   - Test token expiry and refresh
   - Test logout and cleanup

## Testing Checklist

- [ ] Login creates session and tokens
- [ ] Protected routes work with JWT
- [ ] Token refresh works automatically
- [ ] Concurrent tab refresh doesn't cause logout
- [ ] Logout clears all tokens
- [ ] 401 on expired token redirects to login
- [ ] SSR preserves cookies correctly

## Notes

- The backend handles race conditions in token refresh, so frontend doesn't need special handling
- HTTP-only cookies mean tokens are not accessible via JavaScript (security feature)
- The frontend primarily needs to trigger refresh and handle failures
