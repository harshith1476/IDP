# 🔧 Fix MongoDB Target Index Error

## Problem
Getting error: `E11000 duplicate key error collection: drims.targets index: facultyId_1_academicYear_1`

This happens because MongoDB has an old index on `academicYear` but the code uses `year`.

## Automatic Fix (Recommended)

**Just restart the backend** - The fix runs automatically on startup:

```powershell
cd backend
mvn spring-boot:run
# OR
.\mvnw.cmd spring-boot:run
```

You should see in the console:
```
Dropping index: facultyId_1_academicYear_1
Successfully dropped index: ...
Target index configured correctly: facultyId + year (unique)
```

## Manual Fix (If Automatic Doesn't Work)

### Option 1: Using MongoDB Shell

1. **Open MongoDB Shell:**
   ```powershell
   mongosh
   # OR if using older version
   mongo
   ```

2. **Connect to your database:**
   ```javascript
   use drims
   ```

3. **Drop the old index:**
   ```javascript
   db.targets.dropIndex("facultyId_1_academicYear_1")
   ```

4. **Create the correct index:**
   ```javascript
   db.targets.createIndex({ "facultyId": 1, "year": 1 }, { unique: true })
   ```

5. **Verify the index:**
   ```javascript
   db.targets.getIndexes()
   ```

### Option 2: Drop and Recreate Collection

If the index can't be dropped:

1. **Open MongoDB Shell:**
   ```powershell
   mongosh
   ```

2. **Drop the targets collection:**
   ```javascript
   use drims
   db.targets.drop()
   ```

3. **Restart the backend** - It will recreate the collection with the correct index

### Option 3: Using MongoDB Compass (GUI)

1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Select `drims` database
4. Go to `targets` collection
5. Click "Indexes" tab
6. Delete the index: `facultyId_1_academicYear_1`
7. Create new index:
   - Field: `facultyId` (Ascending)
   - Field: `year` (Ascending)
   - Options: Check "Unique"

## Verify Fix

After fixing, try saving a target again. The error should be gone!

## What Was Fixed

- ✅ Old index `facultyId_1_academicYear_1` removed
- ✅ New index `facultyId + year` (unique) created
- ✅ Automatic fix on backend startup
