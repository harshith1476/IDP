# 🚀 How to Start the Backend - Fixed Version

## ✅ Port 8080 Issue - SOLVED

The backend was failing because **port 8080 was already in use**. This has been fixed with automated scripts.

## 🎯 Quick Start (Easiest Method)

### Option 1: Use the Automated Script (RECOMMENDED)

```batch
START_BACKEND.bat
```

This script will:
1. ✅ Automatically kill any process using port 8080
2. ✅ Verify port is free
3. ✅ Navigate to backend directory
4. ✅ Start the backend
5. ✅ Load all 74 faculty members

### Option 2: Manual Start

If the automated script doesn't work, do this step-by-step:

**Step 1: Free Port 8080**
```batch
kill-port-8080.bat
```

**Step 2: Navigate and Start**
```batch
cd backend
mvn spring-boot:run
```

### Option 3: PowerShell (If batch files fail)

```powershell
# Kill any process on port 8080
Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue | ForEach-Object { taskkill /PID $_.OwningProcess /F }

# Wait a moment
Start-Sleep -Seconds 2

# Navigate and start
cd backend
mvn spring-boot:run
```

## 📋 What Happens When Backend Starts

1. **Auto-Fix Database Indexes**
   - Drops old indexes (like `universityId_1`)
   - Drops entire collections if needed
   - Recreates only necessary indexes

2. **Create Admin Account**
   - Email: `admin@drims.edu`
   - Password: `admin123`

3. **Load All 74 Faculty Members**
   - Auto-generates emails: `<firstname>.<lastname>@drims.edu`
   - Default password: `faculty123`
   - Employee IDs: EMP001, EMP002, ..., EMP074
   - Research targets assigned automatically

## ✅ Success Indicators

Look for these messages in the console:

```
✅ "Total faculty created: 74 (Expected: 74)"
✅ "Faculty data loaded successfully!"
✅ "Tomcat started on port(s): 8080 (http)"
```

## ❌ If Port 8080 is Still Blocked

### Method 1: Find and Kill Manually
```powershell
# Find the process
netstat -ano | findstr :8080

# Kill it (replace <PID> with actual process ID)
taskkill /PID <PID> /F
```

### Method 2: Use Task Manager
1. Open Task Manager (Ctrl+Shift+Esc)
2. Go to "Details" tab
3. Sort by "PID" or search for "java"
4. Find process using port 8080
5. Right-click → End Task

### Method 3: Restart Computer
This will definitely free the port, but takes longer.

## 🔍 Verify Backend is Running

**Check if port 8080 is listening:**
```powershell
Get-NetTCPConnection -LocalPort 8080
```

**Check if backend responds:**
```powershell
curl http://localhost:8080/api/auth/test
```

Or open in browser: `http://localhost:8080/api/auth/test`

## 📝 Default Credentials

- **Admin**: `admin@drims.edu` / `admin123`
- **Faculty**: `<email>` / `faculty123`
  - Example: `john.doe@drims.edu` / `faculty123`

## 🐛 Troubleshooting

### Error: "Port 8080 was already in use"

**Solution:** Run `kill-port-8080.bat` first, then start backend again.

### Error: "Database index error" or "universityId_1"

**Solution:** The backend will auto-fix this. If it fails, clear the database manually:
- Open MongoDB Compass
- Connect to `mongodb://localhost:27017`
- Select `drims` database
- Click "Drop Database"

### Error: "MongoDB connection failed"

**Solution:** Make sure MongoDB is running:
- Check MongoDB service is started
- Try: `mongod` in a separate terminal
- Or start MongoDB from services.msc

### Backend starts but no faculty loaded

**Check:**
- Look for error messages in console
- Verify database connection
- Check if faculty count is already 74 (may have been loaded previously)

## 📞 Quick Commands Reference

```batch
# Kill port 8080
kill-port-8080.bat

# Start backend (includes kill step)
START_BACKEND.bat

# Or manually
cd backend
mvn clean install -DskipTests
mvn spring-boot:run
```

## ✅ Success Checklist

- [ ] Port 8080 is free
- [ ] MongoDB is running
- [ ] Backend starts without errors
- [ ] Console shows "Total faculty created: 74"
- [ ] Can access `http://localhost:8080`
- [ ] Can login with admin credentials
- [ ] Can login with faculty credentials

---

**Last Updated:** After fixing port 8080 issue
**Status:** ✅ Working - Backend auto-fixes database and loads all 74 faculty
