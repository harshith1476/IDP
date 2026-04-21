# Commands to Load All 74 Faculty Members

## Quick Start Commands

### Step 1: Clear MongoDB Database (Required for First Time)

**Option A: Using MongoDB Shell**
```bash
mongo
use drims
db.dropDatabase()
exit
```

**Option B: Using MongoDB Compass (GUI)**
- Open MongoDB Compass
- Connect to `mongodb://localhost:27017`
- Select `drims` database
- Click "Drop Database"

**Option C: Using Command Line (if mongo command not available)**
```bash
mongosh
use drims
db.dropDatabase()
exit
```

### Step 2: Navigate to Backend Directory

```bash
cd backend
```

### Step 3: Rebuild the Backend

```bash
.\mvnw.cmd clean install
```

**Or if Maven is installed globally:**
```bash
mvn clean install
```

### Step 4: Start the Backend (This will load all 74 faculty)

```bash
.\mvnw.cmd spring-boot:run
```

**Or if Maven is installed globally:**
```bash
mvn spring-boot:run
```

---

## Complete Command Sequence (Copy & Paste)

### For PowerShell:

```powershell
# Step 1: Clear MongoDB
mongo
use drims
db.dropDatabase()
exit

# Step 2: Navigate to backend
cd C:\Users\vemul\Desktop\DRIMS-master\backend

# Step 3: Rebuild
.\mvnw.cmd clean install

# Step 4: Start backend (loads all 74 faculty)
.\mvnw.cmd spring-boot:run
```

### For Command Prompt (CMD):

```cmd
REM Step 1: Clear MongoDB
mongo
use drims
db.dropDatabase()
exit

REM Step 2: Navigate to backend
cd C:\Users\vemul\Desktop\DRIMS-master\backend

REM Step 3: Rebuild
mvnw.cmd clean install

REM Step 4: Start backend (loads all 74 faculty)
mvnw.cmd spring-boot:run
```

---

## Alternative: Using the Rebuild Script

If you have the rebuild script:

```powershell
cd backend
.\rebuild-backend.ps1
```

---

## What to Expect

### During Build:
```
[INFO] Building drims-backend 1.0.0
[INFO] BUILD SUCCESS
```

### During Startup (Loading Faculty):
```
Loading faculty data...
Starting to load faculty. Current count: 0
Created: Prof. Dr. K.V.Krishna Kishore (prof.dr.k.v.krishna.kishore@drims.edu / faculty123) [Employee ID: EMP001]
Created: Dr. S V Phani Kumar (dr.s.v.phani.kumar@drims.edu / faculty123) [Employee ID: EMP002]
Created: Dr.M.Umadevi (dr.m.umadevi@drims.edu / faculty123) [Employee ID: EMP003]
...
Created: Mrs. Ch. Swarna Lalitha (mrs.ch.swarna.lalitha@drims.edu / faculty123) [Employee ID: EMP074]
Created 74 new faculty members.
Total faculty count: 74
Faculty data loaded successfully!
Total faculty created: 74 (Expected: 74)

Started DRIMSApplication in X.XXX seconds
```

---

## Verify Faculty Are Loaded

### Option 1: Check Backend Console
Look for: `Total faculty created: 74 (Expected: 74)`

### Option 2: Check MongoDB
```bash
mongo
use drims
db.users.count({role: "FACULTY"})
# Should return: 74
exit
```

### Option 3: Login as Admin
1. Start frontend: `cd frontend && npm run dev`
2. Go to `http://localhost:5173/login`
3. Login as admin: `admin@drims.edu` / `admin123`
4. Navigate to Faculty section
5. Should see all 74 faculty members

---

## Troubleshooting

### If MongoDB is not running:
```bash
# Windows - Start MongoDB service
net start MongoDB

# Or check if it's running
sc query MongoDB
```

### If Maven wrapper fails:
```bash
# Download wrapper
powershell -ExecutionPolicy Bypass -File download-wrapper.ps1
```

### If JAVA_HOME is not set:
```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-22"
```

### If you get "Port 8080 already in use":
```bash
# Find and kill the process
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Clear Database | `mongo` → `use drims` → `db.dropDatabase()` → `exit` |
| Rebuild | `.\mvnw.cmd clean install` |
| Start Backend | `.\mvnw.cmd spring-boot:run` |
| Check Faculty Count | `mongo` → `use drims` → `db.users.count({role: "FACULTY"})` |

---

## Expected Result

✅ **74 faculty members loaded**
✅ **All can login with `faculty123`**
✅ **Employee IDs: EMP001 to EMP074**
✅ **All have research targets for 2025**
