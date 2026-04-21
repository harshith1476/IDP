# DRIMS Enhancement - Implementation Plan

## Overview
This document outlines the comprehensive enhancement to DRIMS system to add Student role, Books entity, approval workflow, and enhanced reporting.

## Phase 1: Backend - Core Entities & Authentication (PRIORITY)

### 1.1 Student Entity & User Enhancement
- [x] Update User entity to support STUDENT role
- [ ] Add registerNumber field to User (for student login)
- [ ] Create StudentProfile entity (similar to FacultyProfile)
- [ ] Update User entity comment to include STUDENT

### 1.2 Books Entity (NEW)
- [ ] Create Book entity with fields:
  - Book Title, Publisher, ISBN, Publication Year
  - Role (Author/Editor), Category (National/International)
  - Status workflow, File uploads

### 1.3 Enhanced Existing Entities
- [ ] Add approval workflow fields to Journal:
  - approvalStatus (SUBMITTED, APPROVED, REJECTED, SENT_BACK, LOCKED)
  - remarks (admin comments)
  - category (National/International)
  - indexType (SCI, SCIE, Scopus, ESCI, WoS, UGC CARE)
  - author2-6 fields (optional authors)
  - file upload paths (acceptanceMail, publishedPaper, indexProof)

- [ ] Add approval workflow to Conference:
  - approvalStatus, remarks, category
  - student participation fields (name, registerNumber, guide)
  - registrationAmount, paymentMode
  - file uploads (registrationReceipt, certificate)

- [ ] Add approval workflow to BookChapter:
  - approvalStatus, remarks, category
  - file uploads (chapterPDF, isbnProof)

- [ ] Add approval workflow to Patent:
  - approvalStatus, remarks, category
  - status flow (Filed → Published → Granted)
  - file uploads (filingProof, publicationCertificate, grantCertificate)

- [ ] Add approval workflow to Book (new entity):
  - Same as above

## Phase 2: Backend - Services & Controllers

### 2.1 Authentication Updates
- [ ] Update AuthService to support register number login for students
- [ ] Update LoginRequest DTO to support email OR registerNumber
- [ ] Update JwtTokenProvider to handle studentId

### 2.2 Student Module
- [ ] Create StudentRepository
- [ ] Create StudentService
- [ ] Create StudentController with endpoints:
  - POST /api/student/journals (submit)
  - POST /api/student/conferences (submit)
  - GET /api/student/publications (view status)
  - GET /api/student/publications/:id/status (view approval status)

### 2.3 Faculty Module Extensions
- [ ] Extend FacultyController with:
  - POST /api/faculty/books (create book)
  - PUT /api/faculty/books/:id (update book)
  - DELETE /api/faculty/books/:id (delete book)
  - GET /api/faculty/books (list books)
  - Enhanced Journal/Conference endpoints with new fields
  - File upload endpoints for all publication types

### 2.4 Admin Module Enhancements
- [ ] Extend AdminController with:
  - GET /api/admin/publications/pending (all pending approvals)
  - POST /api/admin/publications/:id/approve
  - POST /api/admin/publications/:id/reject (with mandatory remarks)
  - POST /api/admin/publications/:id/send-back
  - POST /api/admin/publications/:id/lock
  - GET /api/admin/reports/naac
  - GET /api/admin/reports/nba
  - GET /api/admin/reports/nirf
  - POST /api/admin/reports/export/excel
  - POST /api/admin/reports/export/pdf

## Phase 3: Backend - Security Configuration

### 3.1 Security Updates
- [ ] Update SecurityConfig to allow STUDENT role
- [ ] Add /api/student/** endpoints with STUDENT role access
- [ ] Update JWT filter to handle student authentication

## Phase 4: Frontend - Login & Authentication

### 4.1 Login Page Enhancement
- [ ] Add login type selector (Faculty/Admin/Student)
- [ ] When Student selected, show "Register Number" field instead of email
- [ ] Keep existing UI unchanged (just add selector)
- [ ] Update authService to handle student login
- [ ] Update routing after login based on role

## Phase 5: Frontend - Student Dashboard

### 5.1 Student Dashboard Component
- [ ] Create StudentDashboard.jsx
- [ ] Add route /student in App.jsx
- [ ] Create tabs: Journals, Conferences
- [ ] Each tab: Add/View/Status functionality
- [ ] Show approval status, remarks
- [ ] Disable edit after approval
- [ ] File upload components for each submission type

## Phase 6: Frontend - Faculty Dashboard Extensions

### 6.1 Enhanced FacultyPublications
- [ ] Add Books tab
- [ ] Enhance existing tabs with new fields:
  - Journals: Category, Index Type, Author 2-6, File uploads
  - Conferences: Category, Student participation, Registration amount, File uploads
  - Book Chapters: Category, File uploads
  - Patents: Category, Status flow, File uploads
- [ ] Add approval status display
- [ ] Show remarks if rejected/sent back

### 6.2 FacultyDashboard Stats
- [ ] Add Books count to dashboard stats
- [ ] Show pending approvals count

## Phase 7: Frontend - Admin Dashboard Enhancements

### 7.1 Admin Approval Workflow
- [ ] Create AdminApprovals.jsx component
- [ ] List all pending submissions (faculty + student)
- [ ] Filter by type (Journal, Conference, etc.)
- [ ] Approve/Reject/Send Back actions
- [ ] Mandatory remarks field for rejection
- [ ] Lock approved records

### 7.2 Admin Reports
- [ ] Create AdminReports.jsx component
- [ ] Generate NAAC, NBA, NIRF reports
- [ ] Year-wise, Faculty-wise filters
- [ ] National vs International split
- [ ] Export to Excel and PDF functionality

## Phase 8: File Upload Implementation

### 8.1 Backend File Upload
- [ ] Create FileStorageService
- [ ] Configure file upload directory
- [ ] Handle PDF uploads for all publication types
- [ ] Store file paths in entities
- [ ] Endpoint to serve uploaded files

### 8.2 Frontend File Upload
- [ ] Create FileUpload component
- [ ] Integrate with all publication forms
- [ ] Show uploaded files
- [ ] Download functionality

## Phase 9: Testing & Validation

### 9.1 Validation
- [ ] Add form validation for all new fields
- [ ] Mandatory file upload validation
- [ ] Student can't edit after approval
- [ ] Admin mandatory remarks on rejection

### 9.2 Testing
- [ ] Test student login with register number
- [ ] Test faculty submission with all new fields
- [ ] Test admin approval workflow
- [ ] Test reports generation
- [ ] Test file uploads
- [ ] Test export functionality

## Priority Order

1. **P0 (Critical)**: Student entity, authentication, basic student dashboard
2. **P1 (High)**: Enhanced entities with approval workflow, Books entity
3. **P2 (Medium)**: Admin approval workflow, file uploads
4. **P3 (Low)**: Reports, export functionality

---

**Status**: Starting implementation
**Last Updated**: 2026-01-10
