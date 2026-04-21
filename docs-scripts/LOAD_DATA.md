# Loading Faculty Data

## Automatic Data Loading

When you start the backend for the first time, all faculty data is automatically loaded:

1. **Admin account** is created
2. **All faculty members** are created with:
   - User accounts (email + password)
   - Faculty profiles
   - Their publications (conferences, journals, patents, book chapters)

## Faculty Included

The system loads **17+ faculty members** with their complete research data:

1. Renugadevi R
2. Maridu Bhargavi
3. B Suvarna
4. Venkatrama Phani Kumar Sistla
5. S Deva Kumar
6. Sajida Sultana Sk
7. Chavva Ravi Kishore Reddy
8. Venkatrajulu Pilli
9. Dega Balakotaiah
10. Mr.Kiran Kumar Kaveti
11. K Pavan Kumar
12. Ongole Gandhi
13. KOLLA JYOTSNA
14. Saubhagya Ranjan Biswal
15. Sumalatha M
16. O. Bhaskaru
17. Venkata Krishna Kishore Kolli
18. Dr. Md Oqail Ahmad
19. Dr Satish Kumar Satti
20. Dr. E. Deepak Chowdary
21. Dr Sunil Babu Melingi

## Publications Loaded

- **Conferences:** 50+ conference publications
- **Journals:** (Can be added from Excel data)
- **Patents:** 8+ patent records
- **Book Chapters:** (Can be added from Excel data)

## Default Credentials

All faculty use the same default password: **`faculty123`**

Email format: `firstname.lastname@drims.edu`

See `FACULTY_CREDENTIALS.md` for complete list.

## Reloading Data

If you need to reload the data:

### Option 1: Clear MongoDB and Restart
```bash
# Connect to MongoDB
mongo
use drims
db.dropDatabase()
exit

# Restart backend
mvn spring-boot:run
```

### Option 2: Use Clear Script (if implemented)
```bash
java -jar target/drims-backend-1.0.0.jar --clear-db
```

## Verifying Data Load

After starting the backend, check the console output:
```
Loading faculty data...
Created: Renugadevi R (renugadevi.r@drims.edu / faculty123)
Created: Maridu Bhargavi (maridu.bhargavi@drims.edu / faculty123)
...
Faculty data loaded successfully!
Total faculty created: 21
```

## Admin View

Admin can view all faculty:
1. Login as `admin@drims.edu` / `admin123`
2. Go to "Faculty" section
3. All faculty profiles are visible
4. View their publications in "Publications" section
5. See analytics in "Analytics" section

## Adding More Faculty

To add more faculty, edit:
`backend/src/main/java/com/drims/config/FacultyDataLoader.java`

Add entries to the `getFacultyData()` method.

