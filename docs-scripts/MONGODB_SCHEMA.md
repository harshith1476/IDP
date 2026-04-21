# MongoDB Schema Documentation

## Database: `drims`

## Collections Overview

### 1. users
Stores user authentication information.

**Fields:**
- `_id` (ObjectId): Primary key
- `email` (String, unique, indexed): User email address
- `password` (String): BCrypt hashed password
- `role` (String): User role - "FACULTY" or "ADMIN"
- `facultyId` (String, nullable): Reference to faculty_profiles._id (null for ADMIN)
- `createdAt` (DateTime): Account creation timestamp
- `updatedAt` (DateTime): Last update timestamp

**Indexes:**
- `email` (unique)

**Example:**
```json
{
  "_id": ObjectId("..."),
  "email": "faculty@drims.edu",
  "password": "$2a$10$...",
  "role": "FACULTY",
  "facultyId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "createdAt": ISODate("2024-01-01T00:00:00Z"),
  "updatedAt": ISODate("2024-01-01T00:00:00Z")
}
```

---

### 2. faculty_profiles
Stores faculty member profile information.

**Fields:**
- `_id` (ObjectId): Primary key
- `employeeId` (String, unique, indexed): Employee identification number
- `name` (String): Full name
- `designation` (String): Job title (e.g., "Professor", "Associate Professor")
- `department` (String): Department name
- `researchAreas` (Array of String): List of research interests
- `orcidId` (String, optional): ORCID identifier
- `scopusId` (String, optional): Scopus author ID
- `googleScholarLink` (String, optional): Google Scholar profile URL
- `email` (String, unique, indexed): Email address (read-only for faculty)
- `userId` (String): Reference to users._id
- `createdAt` (DateTime): Profile creation timestamp
- `updatedAt` (DateTime): Last update timestamp

**Indexes:**
- `employeeId` (unique)
- `email` (unique)
- `userId` (for lookups)

**Example:**
```json
{
  "_id": ObjectId("65a1b2c3d4e5f6g7h8i9j0k1"),
  "employeeId": "EMP001",
  "name": "Dr. John Doe",
  "designation": "Professor",
  "department": "Computer Science",
  "researchAreas": ["Machine Learning", "Data Science", "AI"],
  "orcidId": "0000-0000-0000-0000",
  "scopusId": "1234567890",
  "googleScholarLink": "https://scholar.google.com/citations?user=xyz",
  "email": "faculty@drims.edu",
  "userId": ObjectId("..."),
  "createdAt": ISODate("2024-01-01T00:00:00Z"),
  "updatedAt": ISODate("2024-01-01T00:00:00Z")
}
```

---

### 3. targets
Stores yearly research targets for faculty members.

**Fields:**
- `_id` (ObjectId): Primary key
- `facultyId` (String): Reference to faculty_profiles._id
- `year` (Integer): Target year
- `journalTarget` (Integer): Number of journal publications targeted
- `conferenceTarget` (Integer): Number of conference publications targeted
- `patentTarget` (Integer): Number of patents targeted
- `bookChapterTarget` (Integer): Number of book chapters targeted
- `createdAt` (DateTime): Record creation timestamp
- `updatedAt` (DateTime): Last update timestamp

**Indexes:**
- Compound index on `facultyId` and `year` (for unique target per year per faculty)

**Example:**
```json
{
  "_id": ObjectId("..."),
  "facultyId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "year": 2024,
  "journalTarget": 5,
  "conferenceTarget": 3,
  "patentTarget": 2,
  "bookChapterTarget": 1,
  "createdAt": ISODate("2024-01-01T00:00:00Z"),
  "updatedAt": ISODate("2024-01-01T00:00:00Z")
}
```

---

### 4. journals
Stores journal publication records.

**Fields:**
- `_id` (ObjectId): Primary key
- `facultyId` (String): Reference to faculty_profiles._id
- `title` (String): Publication title
- `journalName` (String): Name of the journal
- `authors` (String): Author list
- `year` (Integer): Publication year
- `volume` (String, optional): Journal volume
- `issue` (String, optional): Journal issue
- `pages` (String, optional): Page numbers
- `doi` (String, optional): Digital Object Identifier
- `impactFactor` (String, optional): Journal impact factor
- `status` (String): Publication status - "Published", "Accepted", "Submitted"
- `proofDocumentPath` (String, optional): Path to uploaded PDF document
- `createdAt` (DateTime): Record creation timestamp
- `updatedAt` (DateTime): Last update timestamp

**Indexes:**
- `facultyId` (for faculty lookups)
- `year` (for year-based queries)

**Example:**
```json
{
  "_id": ObjectId("..."),
  "facultyId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "title": "Machine Learning Applications in Healthcare",
  "journalName": "Journal of Medical AI",
  "authors": "John Doe, Jane Smith",
  "year": 2024,
  "volume": "15",
  "issue": "3",
  "pages": "123-145",
  "doi": "10.1234/jmai.2024.001",
  "impactFactor": "5.2",
  "status": "Published",
  "proofDocumentPath": "65a1b2c3d4e5f6g7h8i9j0k1/journals/abc123.pdf",
  "createdAt": ISODate("2024-01-15T00:00:00Z"),
  "updatedAt": ISODate("2024-01-15T00:00:00Z")
}
```

---

### 5. conferences
Stores conference publication records.

**Fields:**
- `_id` (ObjectId): Primary key
- `facultyId` (String): Reference to faculty_profiles._id
- `title` (String): Publication title
- `conferenceName` (String): Name of the conference
- `authors` (String): Author list
- `year` (Integer): Publication year
- `location` (String, optional): Conference location
- `date` (String, optional): Conference date
- `status` (String): Publication status - "Published", "Accepted", "Submitted"
- `proofDocumentPath` (String, optional): Path to uploaded PDF document
- `createdAt` (DateTime): Record creation timestamp
- `updatedAt` (DateTime): Last update timestamp

**Indexes:**
- `facultyId` (for faculty lookups)
- `year` (for year-based queries)

**Example:**
```json
{
  "_id": ObjectId("..."),
  "facultyId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "title": "Deep Learning for Image Recognition",
  "conferenceName": "International Conference on AI",
  "authors": "John Doe, Jane Smith",
  "year": 2024,
  "location": "San Francisco, USA",
  "date": "2024-06-15",
  "status": "Accepted",
  "proofDocumentPath": "65a1b2c3d4e5f6g7h8i9j0k1/conferences/def456.pdf",
  "createdAt": ISODate("2024-02-10T00:00:00Z"),
  "updatedAt": ISODate("2024-02-10T00:00:00Z")
}
```

---

### 6. patents
Stores patent records.

**Fields:**
- `_id` (ObjectId): Primary key
- `facultyId` (String): Reference to faculty_profiles._id
- `title` (String): Patent title
- `patentNumber` (String, optional): Patent number
- `inventors` (String): List of inventors
- `year` (Integer): Patent year
- `country` (String, optional): Country of patent
- `status` (String): Patent status - "Granted", "Filed", "Pending"
- `proofDocumentPath` (String, optional): Path to uploaded PDF document
- `createdAt` (DateTime): Record creation timestamp
- `updatedAt` (DateTime): Last update timestamp

**Indexes:**
- `facultyId` (for faculty lookups)
- `year` (for year-based queries)

**Example:**
```json
{
  "_id": ObjectId("..."),
  "facultyId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "title": "Novel Algorithm for Data Compression",
  "patentNumber": "US1234567",
  "inventors": "John Doe, Jane Smith",
  "year": 2024,
  "country": "United States",
  "status": "Granted",
  "proofDocumentPath": "65a1b2c3d4e5f6g7h8i9j0k1/patents/ghi789.pdf",
  "createdAt": ISODate("2024-03-20T00:00:00Z"),
  "updatedAt": ISODate("2024-03-20T00:00:00Z")
}
```

---

### 7. book_chapters
Stores book chapter publication records.

**Fields:**
- `_id` (ObjectId): Primary key
- `facultyId` (String): Reference to faculty_profiles._id
- `title` (String): Chapter title
- `bookTitle` (String): Book title
- `authors` (String): Author list
- `editors` (String, optional): Book editors
- `publisher` (String, optional): Publisher name
- `year` (Integer): Publication year
- `pages` (String, optional): Page numbers
- `isbn` (String, optional): ISBN number
- `status` (String): Publication status - "Published", "Accepted", "Submitted"
- `proofDocumentPath` (String, optional): Path to uploaded PDF document
- `createdAt` (DateTime): Record creation timestamp
- `updatedAt` (DateTime): Last update timestamp

**Indexes:**
- `facultyId` (for faculty lookups)
- `year` (for year-based queries)

**Example:**
```json
{
  "_id": ObjectId("..."),
  "facultyId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "title": "Introduction to Machine Learning",
  "bookTitle": "Advanced Topics in Computer Science",
  "authors": "John Doe",
  "editors": "Dr. Jane Smith, Dr. Bob Johnson",
  "publisher": "Academic Press",
  "year": 2024,
  "pages": "45-78",
  "isbn": "978-0-123456-78-9",
  "status": "Published",
  "proofDocumentPath": "65a1b2c3d4e5f6g7h8i9j0k1/book_chapters/jkl012.pdf",
  "createdAt": ISODate("2024-04-05T00:00:00Z"),
  "updatedAt": ISODate("2024-04-05T00:00:00Z")
}
```

---

## Relationships

```
users (1) ──→ (1) faculty_profiles
                    │
                    └──→ (many) targets
                    └──→ (many) journals
                    └──→ (many) conferences
                    └──→ (many) patents
                    └──→ (many) book_chapters
```

## Query Examples

### Get all publications for a faculty member
```javascript
// Journals
db.journals.find({ facultyId: "65a1b2c3d4e5f6g7h8i9j0k1" })

// All publications in 2024
db.journals.find({ facultyId: "65a1b2c3d4e5f6g7h8i9j0k1", year: 2024 })
db.conferences.find({ facultyId: "65a1b2c3d4e5f6g7h8i9j0k1", year: 2024 })
```

### Get faculty profile by email
```javascript
db.faculty_profiles.findOne({ email: "faculty@drims.edu" })
```

### Get all publications by year
```javascript
db.journals.find({ year: 2024 })
db.conferences.find({ year: 2024 })
db.patents.find({ year: 2024 })
db.book_chapters.find({ year: 2024 })
```

### Count publications by status
```javascript
db.journals.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } }
])
```

---

## Data Integrity Notes

1. **Faculty-User Relationship**: Each faculty profile must have a corresponding user record
2. **Publication Ownership**: All publications must reference a valid faculty profile
3. **Unique Constraints**: 
   - Email must be unique across users and faculty_profiles
   - Employee ID must be unique
4. **Cascade Considerations**: Deleting a faculty profile should handle related publications (application-level logic)
5. **File Storage**: Proof documents are stored in filesystem, paths stored in database

---

## Indexing Strategy

**Recommended Indexes:**
```javascript
// Users
db.users.createIndex({ email: 1 }, { unique: true })

// Faculty Profiles
db.faculty_profiles.createIndex({ email: 1 }, { unique: true })
db.faculty_profiles.createIndex({ employeeId: 1 }, { unique: true })
db.faculty_profiles.createIndex({ userId: 1 })

// Publications (for performance)
db.journals.createIndex({ facultyId: 1, year: 1 })
db.conferences.createIndex({ facultyId: 1, year: 1 })
db.patents.createIndex({ facultyId: 1, year: 1 })
db.book_chapters.createIndex({ facultyId: 1, year: 1 })

// Targets
db.targets.createIndex({ facultyId: 1, year: 1 }, { unique: true })
```

