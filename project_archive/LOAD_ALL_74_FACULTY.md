# Loading All 74 Faculty Members

## ✅ System Updated to Load All 74 Faculty

The system has been updated to load **all 74 faculty members** from the Excel data with their credentials.

### Changes Made:

1. **Updated Faculty Count Check**: Now checks if 74 faculty are already loaded (instead of just checking if any exist)
2. **Improved Loading Logic**: Better handling of existing faculty, continues numbering from where it left off
3. **Default Targets**: Every faculty member gets default research targets (1 journal, 1 conference) if not specified
4. **All Faculty Included**: All faculty from the Excel table (rows 1-74) are included in the list

### Default Credentials:

**All 74 faculty members use:**
- **Password**: `faculty123` (default)
- **Email**: Auto-generated from name (format: `firstname.lastname@drims.edu`)
- **Role**: `FACULTY`
- **Department**: Computer Science and Engineering

## 🔄 How to Load All 74 Faculty

### Option 1: Clear Database and Load Fresh (Recommended)

```bash
# 1. Clear MongoDB database
mongo
use drims
db.dropDatabase()
exit

# 2. Rebuild and restart backend
cd backend
.\mvnw.cmd clean install
.\mvnw.cmd spring-boot:run
```

### Option 2: Load Missing Faculty Only (If some already exist)

The system will automatically:
- Skip faculty that already exist (by email)
- Load only new faculty members
- Continue employee ID numbering from existing faculty

Just restart the backend:
```bash
cd backend
.\mvnw.cmd spring-boot:run
```

## ✅ Verification

After restarting the backend, check the console output:

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
```

## 📋 Faculty List (74 Total)

All 74 faculty members from the Excel table are included:

1. Prof. Dr. K.V.Krishna Kishore
2. Dr. S V Phani Kumar
3. Dr.M.Umadevi
4. ... (all faculty from rows 1-68)
5. Mr.K.Kiran Kumar (Row 68)
6. Mr. Y. Ram Mohan (Row 69)
7. Mr. B. Anil Babu (Row 70)
8. Mrs. S. Anitha (Row 71)
9. Mrs. D. Tipura (Row 72)
10. Mrs. Tanigundala Leelavathy (Row 73)
11. Mrs. Ch. Swarna Lalitha (Row 74)
... (up to 74 total)

## 🔐 Login Credentials for All Faculty

**All faculty can login with:**
- **Email**: `[auto-generated-email]@drims.edu`
- **Password**: `faculty123`

**Email Generation Rules:**
- Names are converted to lowercase
- Spaces replaced with dots
- Special characters removed
- Titles (Dr., Prof., Mr., Mrs., Ms.) removed
- Example: "Mr. Y. Ram Mohan" → `y.ram.mohan@drims.edu`

## 📊 Research Targets

All 74 faculty have research targets for 2025:
- **Default**: 1 journal, 1 conference (minimum)
- **Specific**: Targets from Excel data if available
- **Employee IDs**: EMP001 to EMP074

## ⚠️ Important Notes

1. **Database Must Be Empty**: For first-time loading, clear the database first
2. **Email Uniqueness**: System automatically handles duplicate emails by appending numbers
3. **Password**: All faculty use `faculty123` by default - they should change after first login
4. **No Duplicates**: System skips faculty that already exist (by email)

## 🚀 Quick Start

```bash
# 1. Navigate to backend
cd backend

# 2. Clear database (if needed)
mongo
use drims
db.dropDatabase()
exit

# 3. Rebuild and start
.\mvnw.cmd clean install
.\mvnw.cmd spring-boot:run

# 4. Wait for "Total faculty created: 74" message
# 5. All 74 faculty can now login with faculty123
```

## ✅ Success Criteria

After loading, you should see:
- ✅ Console shows "Total faculty created: 74 (Expected: 74)"
- ✅ No errors in the console
- ✅ All 74 faculty can login at `/login` with their email and `faculty123`
- ✅ Admin can view all 74 faculty in the admin panel
