# ✅ Complete Commands to Clear Database and Load All 74 Faculty

## 🎯 Problem Fixed

The error `E11000 duplicate key error collection: drims.users index: universityId_1` has been fixed in the code. The backend will now:
1. Automatically drop old indexes
2. Auto-clear collections if index errors occur
3. Create faculty profiles first, then users (avoiding null index issues)

## 🚀 Commands to Run

### Option 1: Clear Database First, Then Start (RECOMMENDED)

#### Step 1: Clear Database (Choose ONE method)

**Method A: Using MongoDB Compass (EASIEST - GUI)**
1. Open **MongoDB Compass**
2. Connect to: `mongodb://localhost:27017`
3. Select **`drims`** database from left sidebar
4. Click **"Drop Database"** button
5. Confirm deletion
6. ✅ Database cleared!

**Method B: Using MongoDB Shell (If Available)**
```bash
mongosh
use drims
db.dropDatabase()
exit
```

**Method C: Using Command Line (If mongosh is in PATH)**
```bash
mongosh --eval "use drims; db.dropDatabase(); print('Database cleared!');" --quiet
```

#### Step 2: Start Backend (Loads All 74 Faculty)

```bash
cd C:\Users\vemul\Desktop\DRIMS-master\backend
mvn spring-boot:run
```

**This will automatically:**
- ✅ Create admin user
- ✅ Load all 74 faculty members
- ✅ Create employee IDs (EMP001-EMP074)
- ✅ Set default password `faculty123` for all
- ✅ Create research targets for 2025

---

### Option 2: Use the Automated Script

```bash
cd C:\Users\vemul\Desktop\DRIMS-master
.\clear-and-load-faculty.bat
```

This script will:
1. Prompt you to clear the database
2. Rebuild the backend
3. Start the backend

---

### Option 3: Use JAR File with Clear Flag

```bash
cd C:\Users\vemul\Desktop\DRIMS-master\backend

# Step 1: Build JAR
mvn clean package -DskipTests

# Step 2: Clear database using JAR
java -jar target\drims-backend-1.0.0.jar --clear-db

# Step 3: Start backend normally (loads all 74 faculty)
mvn spring-boot:run
```

---

## ✅ What You'll See (Success Output)

```
Loading faculty data...
Current faculty count: 0. Loading all 74 faculty members...
Admin created: admin@drims.edu / admin123
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

Started DRIMSApplication in 3.XXX seconds
```

---

## 🔍 Verify All 74 Faculty Are Loaded

### Check Console:
- Look for: `Total faculty created: 74 (Expected: 74)`

### Check MongoDB (Optional):
```bash
mongosh
use drims
db.users.count({role: "FACULTY"})
# Should return: 74
exit
```

### Test Login:
1. Start frontend: `cd frontend && npm run dev`
2. Go to: `http://localhost:5173/login`
3. Login with any faculty email + `faculty123`
   - Example: `y.ram.mohan@drims.edu` / `faculty123`
   - Example: `b.anil.babu@drims.edu` / `faculty123`

---

## ⚠️ If You Still Get Index Error

The code will **automatically try to fix** by dropping collections. If it still fails:

1. **Use MongoDB Compass** (easiest):
   - Open MongoDB Compass
   - Connect to `mongodb://localhost:27017`
   - Select `drims` database
   - Click "Drop Database"
   - Restart backend

2. **Or use MongoDB Shell**:
   ```bash
   mongosh
   use drims
   db.dropDatabase()
   exit
   cd C:\Users\vemul\Desktop\DRIMS-master\backend
   mvn spring-boot:run
   ```

---

## 📋 Quick Reference - Copy & Paste Commands

```bash
# Navigate to backend
cd C:\Users\vemul\Desktop\DRIMS-master\backend

# Rebuild (if needed)
mvn clean install -DskipTests

# Start backend (loads all 74 faculty)
mvn spring-boot:run
```

**Before running, make sure to clear the database first using MongoDB Compass!**

---

## ✅ Success Checklist

- [ ] Database cleared (no old indexes)
- [ ] Backend built successfully
- [ ] Backend started without errors
- [ ] Console shows: `Total faculty created: 74`
- [ ] All 74 faculty can login with `faculty123`
- [ ] Admin can see all 74 faculty in admin panel

---

## 🎯 All 74 Faculty Default Credentials

**Email Format**: `[auto-generated]@drims.edu`
**Password**: `faculty123` (same for all)
**Employee IDs**: EMP001 to EMP074
