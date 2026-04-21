# Troubleshooting 403 Error on Login

## Issue
Getting 403 Forbidden error when trying to login at `/api/auth/login`

## Immediate Steps to Fix

### 1. **REBUILD AND RESTART THE BACKEND** (CRITICAL)

The security configuration changes require a full rebuild:

```bash
cd backend

# Stop the running backend (Ctrl+C if it's running)

# Clean and rebuild
.\mvnw.cmd clean install

# Restart the backend
.\mvnw.cmd spring-boot:run
```

**IMPORTANT:** The changes to `SecurityConfig.java` and `JwtAuthenticationFilter.java` will NOT take effect until you rebuild and restart the backend!

### 2. Verify Backend is Running

Check that the backend starts successfully and you see:
```
Started DRIMSApplication in X.XXX seconds
```

### 3. Check Backend Logs

When you try to login, check the backend console for:
- Any CORS-related errors
- Security filter chain errors
- Any exceptions

### 4. Verify MongoDB is Running

```bash
# Check if MongoDB is running (Windows)
sc query MongoDB

# Or check if port 27017 is in use
netstat -an | findstr 27017
```

### 5. Test the Endpoint Directly

You can test the login endpoint directly using curl or Postman:

```bash
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -H "Origin: http://localhost:5173" ^
  -d "{\"email\":\"admin@drims.edu\",\"password\":\"admin123\"}"
```

If this works but the browser request doesn't, it's a CORS issue.
If this also gives 403, it's a backend security configuration issue.

## Changes Made

1. **JwtAuthenticationFilter**: Now skips `/api/auth/**` endpoints
2. **SecurityConfig**: 
   - OPTIONS requests are explicitly allowed first
   - CORS credentials set to false to match frontend
   - `/api/auth/**` endpoints are permitted

## If Still Getting 403 After Rebuild

1. **Clear Browser Cache** - Old CORS preflight responses might be cached
2. **Check Browser Console** - Look for CORS errors in the Network tab
3. **Try Incognito Mode** - This disables extensions and clears cache
4. **Check Backend Logs** - Spring Security debug logging should show why the request is rejected

## Expected Behavior After Fix

- Login requests to `/api/auth/login` should return 200 OK
- Response should contain JWT token
- No CORS errors in browser console
