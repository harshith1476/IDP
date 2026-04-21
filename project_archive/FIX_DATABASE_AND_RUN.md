# Fix Database Issue and Load All 74 Faculty

## ❌ Problem Identified

The error shows:
```
E11000 duplicate key error collection: drims.users index: universityId_1 dup key: { universityId: null }
```

This is caused by an **old database index** (`universityId_1`) from a previous schema version that doesn't exist in the current code.

## ✅ Solution Implemented

I've fixed the code to:
1. **Automatically drop old indexes** (like `universityId_1`) on startup
2. **Create faculty profile FIRST**, then user with `facultyId` already set (avoids null index issues)
3. **Auto-clear collections** if index errors occur

## 🚀 Commands to Run (Automated)

### Step 1: Clear Database (REQUIRED)

**Option A: Using MongoDB Compass (Easiest - GUI)**
1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. Select `drims` database
4. Click "Drop Database" button
5. Done!

**Option B: Using MongoDB Shell (If Available)**
```bash
mongosh
use drims
db.dropDatabase()
exit
```

**Option C: Manual PowerShell (If mongosh is in PATH)**
```powershell
mongosh --eval "use drims; db.dropDatabase(); print('Database cleared!');" --quiet
```

### Step 2: Rebuild and Start Backend

The code has been fixed to automatically handle old indexes. Just run:

```bash
cd C:\Users\vemul\Desktop\DRIMS-master\backend
mvn clean install -DskipTests
mvn spring-boot:run
```

Or use the automated script:
```bash
cd C:\Users\vemul\Desktop\DRIMS-master
.\clear-and-load-faculty.bat
```

## ✅ What the Fixed Code Does

1. **On Startup**: Automatically tries to drop old `universityId` indexes
2. **If Index Error Occurs**: Automatically drops `users` and `faculty_profiles` collections
3. **Creates Faculty**: Creates profile first, then user (with facultyId already set)
4. **Loads All 74**: Loads all faculty from the list

## 📋 Complete Command Sequence

```bash
# Step 1: Clear Database (Choose one method above)

# Step 2: Navigate and Rebuild
cd C:\Users\vemul\Desktop\DRIMS-master\backend
mvn clean install -DskipTests

# Step 3: Start Backend (Loads all 74 faculty)
mvn spring-boot:run
```

## 🔍 Expected Output

After clearing database and starting:

```
Loading faculty data...
Current faculty count: 0. Loading all 74 faculty members...
Admin created: admin@drims.edu / admin123
Starting to load faculty. Current count: 0
Created: Prof. Dr. K.V.Krishna Kishore (prof.dr.k.v.krishna.kishore@drims.edu / faculty123) [Employee ID: EMP001]
Created: Dr. S V Phani Kumar (dr.s.v.phani.kumar@drims.edu / faculty123) [Employee ID: EMP002]
...
Created: Mrs. Ch. Swarna Lalitha (mrs.ch.swarna.lalitha@drims.edu / faculty123) [Employee ID: EMP074]
Created 74 new faculty members.
Total faculty count: 74
Faculty data loaded successfully!
Total faculty created: 74 (Expected: 74)

Started DRIMSApplication in X.XXX seconds
```

## ⚠️ If You Still Get Index Error

If the automatic fix doesn't work, **manually clear the database**:

1. **Open MongoDB Compass** (easiest way)
   - Connect to `mongodb://localhost:27017`
   - Right-click on `drims` database
   - Click "Drop Database"

2. **OR use MongoDB Shell**:
   ```bash
   mongosh
   use drims
   db.dropDatabase()
   exit
   ```

3. **Then restart backend**:
   ```bash
   cd C:\Users\vemul\Desktop\DRIMS-master\backend
   mvn spring-boot:run
   ```

## ✅ All 74 Faculty Will Have

- **Email**: Auto-generated (e.g., `y.ram.mohan@drims.edu`)
- **Password**: `faculty123` (default for all)
- **Role**: `FACULTY`
- **Employee ID**: EMP001 to EMP074
- **Research Targets**: For 2025

## 🎯 Success Criteria

✅ Backend starts without errors
✅ Console shows: `Total faculty created: 74 (Expected: 74)`
✅ All 74 faculty can login with their email + `faculty123`
✅ Admin can see all 74 faculty in admin panel
