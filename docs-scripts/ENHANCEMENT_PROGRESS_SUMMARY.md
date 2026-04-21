# DRIMS Enhancement - Progress Summary

## ✅ Completed Backend Work (Phase 1)

### 1. Entity Enhancements

#### User Entity ✅
- ✅ Added `registerNumber` field (unique, sparse index) for student login
- ✅ Added `studentId` field to reference StudentProfile
- ✅ Updated role comment to include STUDENT
- ✅ Maintained backward compatibility with existing fields

#### New Entities Created ✅
- ✅ **StudentProfile** entity with:
  - registerNumber (unique), name, department, program, year
  - guideId, guideName (for faculty supervisor)
  - userId reference

- ✅ **Book** entity with:
  - bookTitle, publisher, ISBN, publicationYear
  - role (Author/Editor), category (National/International)
  - Approval workflow fields (approvalStatus, remarks, approvedBy, approvedAt)
  - File upload fields (bookCoverPath, isbnProofPath)

#### Enhanced Existing Entities ✅

**Journal Entity:**
- ✅ Added `studentId` field (for student publications)
- ✅ Added author2-6 fields (optional authors)
- ✅ Added category (National/International)
- ✅ Added indexType (SCI, SCIE, Scopus, ESCI, WoS, UGC CARE)
- ✅ Added publisher, ISSN, openAccess fields
- ✅ Added approval workflow (approvalStatus, remarks, approvedBy, approvedAt)
- ✅ Added specific file uploads (acceptanceMailPath, publishedPaperPath, indexProofPath)
- ✅ Maintained backward compatibility with `proofDocumentPath`

**Conference Entity:**
- ✅ Added `studentId` field (for student publications)
- ✅ Added organizer, category fields
- ✅ Added registrationAmount, paymentMode
- ✅ Added student participation fields (isStudentPublication, studentName, studentRegisterNumber, guideId, guideName)
- ✅ Added approval workflow fields
- ✅ Added specific file uploads (registrationReceiptPath, certificatePath)
- ✅ Maintained backward compatibility

**BookChapter Entity:**
- ✅ Added category (National/International)
- ✅ Added approval workflow fields
- ✅ Added specific file uploads (chapterPdfPath, isbnProofPath)
- ✅ Maintained backward compatibility

**Patent Entity:**
- ✅ Added applicationNumber, filingDate fields
- ✅ Added category (National/International)
- ✅ Updated status flow (Filed → Published → Granted)
- ✅ Added approval workflow fields
- ✅ Added conditional file uploads (filingProofPath, publicationCertificatePath, grantCertificatePath)
- ✅ Maintained backward compatibility

### 2. Repository Layer ✅
- ✅ **StudentProfileRepository** created with:
  - findByRegisterNumber, findByUserId, existsByRegisterNumber

- ✅ **BookRepository** created with:
  - findByFacultyId, findByApprovalStatus

- ✅ **UserRepository** updated:
  - Added findByRegisterNumber
  - Added existsByRegisterNumber

### 3. Authentication & Security ✅

**LoginRequest DTO:**
- ✅ Updated to support both email (FACULTY/ADMIN) and registerNumber (STUDENT)
- ✅ Made email optional (required only for FACULTY/ADMIN)
- ✅ Added loginType field (optional, can be inferred)

**JwtResponse DTO:**
- ✅ Added studentId field
- ✅ Updated email field comment (now represents email for FACULTY/ADMIN, registerNumber for STUDENT)

**AuthService:**
- ✅ Enhanced login method to support both email and registerNumber
- ✅ Added getCurrentStudentProfile method
- ✅ Updated getCurrentUser to support both email and registerNumber lookup
- ✅ Token generation includes studentId

**JwtTokenProvider:**
- ✅ Updated generateToken to accept studentId
- ✅ Added getStudentIdFromToken method
- ✅ Maintained backward compatibility with legacy generateToken method

**SecurityConfig:**
- ✅ Added STUDENT role access for `/api/student/**` endpoints
- ✅ STUDENT and ADMIN can access student endpoints

### 4. Compilation Status ✅
- ✅ All entities compile successfully
- ✅ All repositories compile successfully
- ✅ Authentication service compiles successfully
- ✅ Security configuration compiles successfully
- ✅ Backward compatibility maintained (existing code still works)

---

## ⏳ Remaining Work

### Backend - Critical (P0)

#### 1. Student Module Services & Controllers
- [ ] Create StudentService with:
  - submitJournal, submitConference methods
  - getPublications (with approval status)
  - viewApprovalStatus methods
  - Validation: no edit after approval

- [ ] Create StudentController with endpoints:
  - POST /api/student/journals (submit)
  - POST /api/student/conferences (submit)
  - GET /api/student/publications (list all)
  - GET /api/student/publications/:id/status (view status)
  - GET /api/student/profile (get student profile)

#### 2. Book Service & Controller
- [ ] Create BookService with CRUD operations
- [ ] Create BookController or extend FacultyController
- [ ] Add endpoints:
  - POST /api/faculty/books
  - PUT /api/faculty/books/:id
  - DELETE /api/faculty/books/:id
  - GET /api/faculty/books

#### 3. Faculty Controller Extensions
- [ ] Update FacultyController to handle new fields in Journal/Conference
- [ ] Add Books endpoints to FacultyController
- [ ] Update DTOs to include new fields (category, indexType, author2-6, etc.)
- [ ] Add file upload endpoints for all publication types

#### 4. Admin Approval Workflow
- [ ] Create AdminApprovalService with:
  - approve, reject (with mandatory remarks), sendBack, lock methods
  - getPendingApprovals method (all types)
  - Filter by type, faculty, student

- [ ] Create AdminApprovalController or extend AdminController with:
  - GET /api/admin/approvals/pending (all pending)
  - POST /api/admin/approvals/:type/:id/approve
  - POST /api/admin/approvals/:type/:id/reject (with mandatory remarks)
  - POST /api/admin/approvals/:type/:id/send-back
  - POST /api/admin/approvals/:type/:id/lock
  - GET /api/admin/approvals (filtered list)

#### 5. File Upload Service
- [ ] Create FileStorageService:
  - Save PDF files to disk/cloud storage
  - Generate unique file names
  - Serve uploaded files
  - Validate file type (PDF only)
  - Validate file size

- [ ] Configure file upload directory in application.properties
- [ ] Add file upload endpoints:
  - POST /api/upload/journal/:id
  - POST /api/upload/conference/:id
  - GET /api/files/:type/:id/:fileType (serve files)

#### 6. Reports Generation
- [ ] Create ReportService with:
  - generateNAACReport (year-wise, faculty-wise, national/international split)
  - generateNBAReport
  - generateNIRFReport
  - Export to Excel (using Apache POI)
  - Export to PDF (using iText or similar)

- [ ] Create AdminReportsController with:
  - GET /api/admin/reports/naac
  - GET /api/admin/reports/nba
  - GET /api/admin/reports/nirf
  - POST /api/admin/reports/export/excel
  - POST /api/admin/reports/export/pdf

#### 7. DTOs Update
- [ ] Update JournalDTO to include:
  - category, indexType, author2-6, publisher, ISSN, openAccess
  - approvalStatus, remarks
  - file upload paths

- [ ] Update ConferenceDTO to include:
  - category, organizer, registrationAmount, paymentMode
  - student participation fields
  - approvalStatus, remarks
  - file upload paths

- [ ] Update BookChapterDTO, PatentDTO similarly
- [ ] Create BookDTO
- [ ] Create StudentProfileDTO
- [ ] Create ApprovalActionDTO (for admin approval actions)

---

### Frontend - Critical (P0)

#### 1. Login Page Enhancement
- [ ] Add login type selector (Faculty/Admin/Student) - keep existing UI unchanged
- [ ] Show "Register Number" field when Student selected (hide email)
- [ ] Show "Email" field when Faculty/Admin selected (hide register number)
- [ ] Update authService.js to handle registerNumber login
- [ ] Update routing after login based on role (add /student route)

#### 2. Student Dashboard (NEW)
- [ ] Create StudentDashboard.jsx component
- [ ] Add route /student in App.jsx
- [ ] Create tabs: Journals, Conferences
- [ ] Each tab:
  - Form to submit publications
  - List view with approval status
  - View remarks if rejected/sent back
  - Disable edit after approval
  - File upload components

#### 3. Faculty Dashboard Enhancements
- [ ] Update FacultyDashboard.jsx to include Books count in stats
- [ ] Add pending approvals count (if any)

#### 4. FacultyPublications Enhancement (CRITICAL)
- [ ] Add Books tab (new)
- [ ] Enhance Journals tab with:
  - Category (National/International) - Radio buttons
  - Index Type dropdown (SCI, SCIE, Scopus, ESCI, WoS, UGC CARE)
  - Author 2-6 fields (optional)
  - Publisher, ISSN, Open Access fields
  - File uploads (Acceptance Mail, Published Paper, Index Proof)
  - Approval status display
  - Remarks display (if rejected/sent back)

- [ ] Enhance Conferences tab with:
  - Category (National/International)
  - Organizer field
  - Registration Amount, Payment Mode
  - Student participation checkbox (if checked, show student fields)
  - Student Name, Register Number, Guide fields (when student participation)
  - File uploads (Registration Receipt, Certificate)
  - Approval status display

- [ ] Enhance BookChapters tab with:
  - Category field
  - File uploads (Chapter PDF, ISBN Proof)
  - Approval status display

- [ ] Enhance Patents tab with:
  - Category field
  - Status flow (Filed → Published → Granted)
  - Application Number, Filing Date fields
  - Conditional file uploads based on status
  - Approval status display

- [ ] Update form validation for all new fields
- [ ] Update API calls to include new fields

#### 5. Admin Approval Workflow UI (NEW)
- [ ] Create AdminApprovals.jsx component
- [ ] Add route /admin/approvals in App.jsx
- [ ] List all pending submissions (faculty + student)
- [ ] Filter by type (Journal, Conference, Book, BookChapter, Patent)
- [ ] Filter by status (SUBMITTED, SENT_BACK)
- [ ] Action buttons for each submission:
  - Approve (with confirmation)
  - Reject (with mandatory remarks field)
  - Send Back (with optional remarks)
  - View Details (full form view)
- [ ] Show remarks in rejection/send back
- [ ] Lock approved records (disable edit)

#### 6. Admin Reports UI (NEW)
- [ ] Create AdminReports.jsx component
- [ ] Add route /admin/reports in App.jsx
- [ ] Report type selector (NAAC, NBA, NIRF)
- [ ] Filters:
  - Year (dropdown)
  - Faculty (dropdown, optional)
  - Category (National/International, optional)
- [ ] Generate button
- [ ] Display report in table format
- [ ] Export buttons:
  - Export to Excel
  - Export to PDF
- [ ] Preview before export

#### 7. File Upload Components
- [ ] Create FileUpload component (reusable)
- [ ] Integrate with all publication forms
- [ ] Show uploaded files list
- [ ] Download functionality
- [ ] File validation (PDF only, max size)
- [ ] Upload progress indicator

---

### Configuration & Setup

#### Backend Configuration
- [ ] Update application.properties:
  - Add file.upload.directory property
  - Add file.upload.max-size property
  - Update CORS allowed origins if needed

#### Dependencies (pom.xml)
- [ ] Add Apache POI for Excel export
- [ ] Add iText or Apache PDFBox for PDF export
- [ ] Ensure file upload dependencies are present

---

## 📋 Implementation Priority

### Phase 1: Core Functionality (P0 - Critical)
1. ✅ Entity enhancements (COMPLETED)
2. ✅ Authentication updates (COMPLETED)
3. ⏳ StudentService and StudentController
4. ⏳ BookService and BookController
5. ⏳ AdminApprovalService and Controller
6. ⏳ Frontend Login enhancement
7. ⏳ Student Dashboard creation
8. ⏳ FacultyPublications enhancement (most critical)

### Phase 2: Enhanced Features (P1 - High)
1. ⏳ File upload service and endpoints
2. ⏳ Admin approval workflow UI
3. ⏳ Enhanced form validations
4. ⏳ Approval status display in all views

### Phase 3: Reporting (P2 - Medium)
1. ⏳ Reports generation service
2. ⏳ Reports UI
3. ⏳ Export functionality (Excel, PDF)

### Phase 4: Polish & Testing (P3 - Low)
1. ⏳ Complete testing of all workflows
2. ⏳ UI/UX refinements
3. ⏳ Performance optimization
4. ⏳ Documentation

---

## 🎯 Next Steps (Immediate Action Items)

### Step 1: Complete Student Module Backend
1. Create StudentService.java with publication submission logic
2. Create StudentController.java with REST endpoints
3. Update SecurityConfig if needed
4. Test student login and publication submission

### Step 2: Update Frontend Login
1. Modify Login.jsx to show register number field for students
2. Update authService.js to send registerNumber in login request
3. Update routing to handle /student route after login
4. Test student login flow

### Step 3: Create Student Dashboard
1. Create StudentDashboard.jsx with tabs
2. Create Journal and Conference submission forms
3. Add approval status display
4. Test student submission workflow

### Step 4: Enhance FacultyPublications
1. Add Books tab
2. Enhance existing tabs with new fields
3. Add file upload components
4. Update API service calls
5. Test faculty submission workflow

### Step 5: Admin Approval Workflow
1. Create AdminApprovalService
2. Create AdminApprovalController
3. Create AdminApprovals.jsx UI
4. Test approval workflow end-to-end

---

## 📝 Notes

- **Backward Compatibility**: All changes maintain backward compatibility with existing code
- **Legacy Fields**: `proofDocumentPath` fields are kept as `@Deprecated` for backward compatibility
- **Database Migration**: Existing data will continue to work; new fields will be null initially
- **File Upload**: Need to configure file storage directory before enabling uploads
- **Security**: All endpoints are protected with role-based access control
- **Validation**: Form validation needs to be added for all new fields
- **Testing**: Comprehensive testing required for all new workflows

---

**Status**: Backend entities and authentication complete ✅  
**Next**: Student module backend + Frontend updates  
**Last Updated**: 2026-01-10
