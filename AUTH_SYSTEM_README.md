# Authentication System Documentation

## Overview
This authentication system provides automatic token refresh and session management for your application.

## Features
- ✅ Automatic access token refresh when expired
- ✅ Automatic redirect to sign-in when refresh token expires
- ✅ Request queuing during token refresh
- ✅ Protected routes
- ✅ Cookie-based refresh token (secure)
- ✅ LocalStorage-based access token

## File Structure

```
packages/
├── lib/
│   ├── apiClient.ts              # Main API client with interceptors
│   └── apiClientUsageExample.ts  # Usage examples
├── hooks/
│   └── useAuth.ts                # Authentication hook
└── components/
    └── ProtectedRoute.tsx        # Protected route wrapper
```

## How It Works

### 1. Token Storage
- **Access Token**: Stored in `localStorage` (short-lived)
- **Refresh Token**: Stored in HTTP-only cookies (long-lived, more secure)

### 2. Request Flow

```
User makes API request
    ↓
apiClient adds access token to headers
    ↓
Request sent to backend
    ↓
┌─────────────────────────────────────┐
│ Is response 401 (Unauthorized)?     │
└─────────────────────────────────────┘
    │                              │
   YES                            NO
    │                              │
    ↓                              ↓
Call /auth/refresh          Return response
    ↓
┌─────────────────────────────────────┐
│ Refresh successful?                 │
└─────────────────────────────────────┘
    │                              │
   YES                            NO
    │                              │
    ↓                              ↓
Save new access token      Redirect to /sign-in
Retry original request     Clear tokens
```

## Usage

### 1. Wrap Your App with Protected Routes

```tsx
// app/dashboard/layout.tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}
```

### 2. Make API Calls

```tsx
import apiClient from '@/lib/apiClient';

// In your component or service
const fetchData = async () => {
  try {
    const response = await apiClient.get('/expert/profile/list');
    return response.data;
  } catch (error) {
    // Errors are handled automatically
    // User will be redirected if tokens are invalid
    console.error(error);
  }
};
```

### 3. Use Authentication Hook

```tsx
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const { login, logout } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login({ email, password });
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    // Your login form
  );
}
```

## Backend Requirements

Your backend needs to:

1. **Return access token on login**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

2. **Set refresh token as HTTP-only cookie**
```typescript
res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});
```

3. **Refresh endpoint returns new access token**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

4. **Return 401 for expired access tokens**

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

## Security Best Practices

1. ✅ Refresh tokens stored in HTTP-only cookies (not accessible via JavaScript)
2. ✅ Access tokens stored in localStorage (short-lived)
3. ✅ HTTPS in production
4. ✅ SameSite cookie attribute
5. ✅ Token rotation on refresh

## Troubleshooting

### Issue: Infinite redirect loop
**Solution**: Check that your sign-in page is not wrapped in ProtectedRoute

### Issue: 401 errors not triggering refresh
**Solution**: Ensure you're using `apiClient` for all API calls, not regular `fetch` or `axios`

### Issue: Cookies not being sent
**Solution**: Ensure `withCredentials: true` is set and CORS is configured on backend

## Migration Guide

### Replace existing fetch calls:

**Before:**
```typescript
const response = await fetch('http://localhost:4000/api/v1/experts');
```

**After:**
```typescript
import apiClient from '@/lib/apiClient';
const response = await apiClient.get('/experts');
```

## Testing

```typescript
// Test token refresh
localStorage.setItem('accessToken', 'expired-token');
apiClient.get('/protected-endpoint'); // Should auto-refresh

// Test redirect on refresh failure
// Remove refresh token cookie
apiClient.get('/protected-endpoint'); // Should redirect to /sign-in
```

## Support

For issues or questions, check:
1. Browser console for errors
2. Network tab for failed requests
3. Backend logs for token validation errors
