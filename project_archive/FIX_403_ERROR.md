# 🔧 Fix 403 Error - Access Denied

## Problem
You're getting a `403 Forbidden` error when trying to access faculty endpoints like `/api/faculty/targets`.

## Common Causes

1. **Token Expired** - JWT tokens expire after 24 hours (86400000ms)
2. **Invalid Token** - Token might be corrupted or invalid
3. **Role Mismatch** - User might not have the correct role in the token
4. **Backend Not Running** - Backend server might not be running

## Quick Fixes

### Solution 1: Log Out and Log Back In (Most Common Fix)

1. **Click the "Logout" button** in the top right
2. **Log back in** with your credentials:
   - Email: `renugadevi.r@drims.edu`
   - Password: `faculty123`
3. **Try again** - The 403 error should be gone

### Solution 2: Clear Browser Storage

1. **Open Browser Console** (F12)
2. **Go to Application tab** (Chrome) or **Storage tab** (Firefox)
3. **Clear Local Storage:**
   ```javascript
   localStorage.clear();
   ```
4. **Refresh the page** and log in again

### Solution 3: Check Backend is Running

Make sure the backend server is running:

```powershell
cd backend
mvn spring-boot:run
# OR
.\mvnw.cmd spring-boot:run
```

You should see:
```
Started DRIMSApplication in X.XXX seconds
```

### Solution 4: Check Token in Browser Console

1. **Open Browser Console** (F12)
2. **Run this command:**
   ```javascript
   console.log('Token:', localStorage.getItem('token'));
   console.log('User:', JSON.parse(localStorage.getItem('user') || '{}'));
   ```
3. **Check if token exists** - If it's `null`, you need to log in again

## Debugging Steps

### Step 1: Check Token Exists
```javascript
// In browser console
localStorage.getItem('token')
```
Should return a long string (JWT token). If `null`, log in again.

### Step 2: Check User Role
```javascript
// In browser console
const user = JSON.parse(localStorage.getItem('user') || '{}');
console.log('Role:', user.role);
```
Should show `"FACULTY"` or `"ADMIN"`. If different, that's the issue.

### Step 3: Check Backend Logs
Look at your backend console for errors like:
- "Invalid token"
- "Token expired"
- "Authentication failed"

## Prevention

The token expires after 24 hours. To prevent this:
- **Log out and log back in** if you see 403 errors
- **Don't keep the browser open for more than 24 hours** without refreshing

## Still Not Working?

1. **Check browser console** (F12) for detailed error messages
2. **Check backend console** for authentication errors
3. **Verify backend is running** on `http://localhost:8080`
4. **Try a different browser** to rule out browser-specific issues
5. **Clear all browser data** and try again

## What I Fixed

I've added better error handling that will:
- ✅ Show detailed error messages in console
- ✅ Log token status when 403 occurs
- ✅ Provide helpful debugging information
- ✅ Check for token before making requests

**The most common fix is simply logging out and logging back in!** 🔄
