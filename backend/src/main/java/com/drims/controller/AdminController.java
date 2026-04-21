package com.drims.controller;

import com.drims.dto.*;
import com.drims.service.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {
    
    @Autowired
    private FacultyProfileService facultyProfileService;
    
    @Autowired
    private TargetService targetService;
    
    @Autowired
    private JournalService journalService;
    
    @Autowired
    private ConferenceService conferenceService;
    
    @Autowired
    private PatentService patentService;
    
    @Autowired
    private BookChapterService bookChapterService;
    
    @Autowired
    private BookService bookService;
    
    @Autowired
    private ProjectService projectService;
    
    @Autowired
    private AdminApprovalService adminApprovalService;
    
    @Autowired
    private AnalyticsService analyticsService;
    
    @Autowired
    private ExcelExportService excelExportService;
    
    @Autowired
    private ScholarService scholarService;
    
    // Faculty Profiles (Read-only)
    @GetMapping("/faculty-profiles")
    public ResponseEntity<List<FacultyProfileDTO>> getAllProfiles() {
        List<FacultyProfileDTO> profiles = facultyProfileService.getAllProfiles();
        return ResponseEntity.ok(profiles);
    }

    @GetMapping("/faculty-submissions")
    public ResponseEntity<List<FacultySubmissionDTO>> getFacultySubmissions(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String facultyName) {
        if (year == null) {
            year = java.time.Year.now().getValue();
        }
        List<FacultySubmissionDTO> submissions = facultyProfileService.getFacultySubmissions(year, facultyName);
        return ResponseEntity.ok(submissions);
    }
    
    @GetMapping("/faculty-profiles/{id}")
    public ResponseEntity<FacultyProfileDTO> getProfileById(@PathVariable String id) {
        FacultyProfileDTO profile = facultyProfileService.getProfileById(id);
        return ResponseEntity.ok(profile);
    }
    
    @GetMapping("/faculty-profiles/{id}/complete")
    public ResponseEntity<FacultyCompleteDataDTO> getCompleteFacultyData(@PathVariable String id) {
        FacultyCompleteDataDTO completeData = new FacultyCompleteDataDTO();
        completeData.setProfile(facultyProfileService.getProfileById(id));
        completeData.setTargets(targetService.getTargetsByFaculty(id));
        completeData.setJournals(journalService.getJournalsByFaculty(id));
        completeData.setConferences(conferenceService.getConferencesByFaculty(id));
        completeData.setPatents(patentService.getPatentsByFaculty(id));
        completeData.setBookChapters(bookChapterService.getBookChaptersByFaculty(id));
        completeData.setBooks(bookService.getBooksByFaculty(id));
        completeData.setProjects(projectService.getProjectsByFaculty(id));
        return ResponseEntity.ok(completeData);
    }
    
    // All Targets
    @GetMapping("/targets")
    public ResponseEntity<List<TargetDTO>> getAllTargets() {
        List<TargetDTO> targets = targetService.getAllTargets();
        return ResponseEntity.ok(targets);
    }
    
    // All Publications
    @GetMapping("/journals")
    public ResponseEntity<List<JournalDTO>> getAllJournals() {
        List<JournalDTO> journals = journalService.getAllJournals();
        return ResponseEntity.ok(journals);
    }
    
    @GetMapping("/conferences")
    public ResponseEntity<List<ConferenceDTO>> getAllConferences() {
        List<ConferenceDTO> conferences = conferenceService.getAllConferences();
        return ResponseEntity.ok(conferences);
    }
    
    @GetMapping("/patents")
    public ResponseEntity<List<PatentDTO>> getAllPatents() {
        List<PatentDTO> patents = patentService.getAllPatents();
        return ResponseEntity.ok(patents);
    }
    
    @GetMapping("/book-chapters")
    public ResponseEntity<List<BookChapterDTO>> getAllBookChapters() {
        List<BookChapterDTO> bookChapters = bookChapterService.getAllBookChapters();
        return ResponseEntity.ok(bookChapters);
    }
    
    @GetMapping("/books")
    public ResponseEntity<List<com.drims.dto.BookDTO>> getAllBooks() {
        List<com.drims.dto.BookDTO> books = bookService.getAllBooks();
        return ResponseEntity.ok(books);
    }
    
    @GetMapping("/projects")
    public ResponseEntity<List<ProjectDTO>> getAllProjects() {
        List<ProjectDTO> projects = projectService.getAllProjects();
        return ResponseEntity.ok(projects);
    }
    
    // Approval Workflow
    @GetMapping("/approvals/pending")
    public ResponseEntity<List<PendingApprovalDTO>> getPendingApprovals(
            @RequestParam(required = false) String type) {
        List<PendingApprovalDTO> pending = adminApprovalService.getPendingApprovals(type);
        return ResponseEntity.ok(pending);
    }
    
    @PostMapping("/approvals/{type}/{id}/approve")
    public ResponseEntity<Void> approvePublication(
            Authentication authentication,
            @PathVariable String type,
            @PathVariable String id) {
        // Get admin ID - use email from authentication or default to "admin"
        String adminId = authentication != null ? authentication.getName() : "admin";
        adminApprovalService.approvePublication(type, id, adminId);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/approvals/{type}/{id}/reject")
    public ResponseEntity<Void> rejectPublication(
            Authentication authentication,
            @PathVariable String type,
            @PathVariable String id,
            @RequestBody(required = false) ApprovalActionDTO actionDto) {
        // Get admin ID - use email from authentication or default to "admin"
        String adminId = authentication != null ? authentication.getName() : "admin";
        
        // Get remarks - handle null or empty actionDto
        String remarks = "Rejected by admin";
        if (actionDto != null && actionDto.getRemarks() != null && !actionDto.getRemarks().trim().isEmpty()) {
            remarks = actionDto.getRemarks().trim();
        }
        
        // Reject the publication
        adminApprovalService.rejectPublication(type, id, adminId, remarks);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/approvals/{type}/{id}/send-back")
    public ResponseEntity<Void> sendBackPublication(
            Authentication authentication,
            @PathVariable String type,
            @PathVariable String id,
            @RequestBody(required = false) ApprovalActionDTO actionDto) {
        // Get admin ID - use email from authentication or default to "admin"
        String adminId = authentication != null ? authentication.getName() : "admin";
        String remarks = actionDto != null && actionDto.getRemarks() != null ? actionDto.getRemarks() : "Sent back for revision";
        adminApprovalService.sendBackPublication(type, id, adminId, remarks);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/approvals/{type}/{id}/lock")
    public ResponseEntity<Void> lockPublication(
            Authentication authentication,
            @PathVariable String type,
            @PathVariable String id) {
        String adminId = authentication.getName();
        adminApprovalService.lockPublication(type, id, adminId);
        return ResponseEntity.ok().build();
    }
    
    // Analytics
    @GetMapping("/analytics")
    public ResponseEntity<AnalyticsDTO> getAnalytics() {
        AnalyticsDTO analytics = analyticsService.getAnalytics();
        return ResponseEntity.ok(analytics);
    }
    
    @Autowired
    private ReportService reportService;
    
    // Reports Generation
    @GetMapping("/reports/naac")
    public ResponseEntity<Map<String, Object>> generateNAACReport(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String facultyId) {
        Map<String, Object> report = reportService.generateNAACReport(year, facultyId);
        return ResponseEntity.ok(report);
    }
    
    @GetMapping("/reports/nba")
    public ResponseEntity<Map<String, Object>> generateNBAReport(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String facultyId) {
        Map<String, Object> report = reportService.generateNBAReport(year, facultyId);
        return ResponseEntity.ok(report);
    }
    
    @GetMapping("/reports/nirf")
    public ResponseEntity<Map<String, Object>> generateNIRFReport(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String facultyId) {
        Map<String, Object> report = reportService.generateNIRFReport(year, facultyId);
        return ResponseEntity.ok(report);
    }
    
    // Excel Export
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportToExcel(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String facultyName) {
        try {
            byte[] excelData = excelExportService.exportToExcel(year, category, facultyName);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "research_data.xlsx");
            headers.setAccessControlExposeHeaders(List.of("Content-Disposition"));
            
            return new ResponseEntity<>(excelData, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // Export Reports to Excel/PDF
    @PostMapping("/reports/export/excel")
    public ResponseEntity<byte[]> exportReportToExcelPost(
            @RequestParam String reportType, // NAAC, NBA, NIRF
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String facultyId) {
        return exportReportToExcel(reportType, year, facultyId);
    }
    
    @GetMapping("/reports/export/excel")
    public ResponseEntity<byte[]> exportReportToExcelGet(
            @RequestParam String reportType, // NAAC, NBA, NIRF
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String facultyId) {
        return exportReportToExcel(reportType, year, facultyId);
    }
    
    @PostMapping("/reports/export/pdf")
    public ResponseEntity<byte[]> exportReportToPDFPost(
            @RequestParam String reportType, // NAAC, NBA, NIRF
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String facultyId) {
        return exportReportToPDF(reportType, year, facultyId);
    }
    
    @GetMapping("/reports/export/pdf")
    public ResponseEntity<byte[]> exportReportToPDFGet(
            @RequestParam String reportType, // NAAC, NBA, NIRF
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String facultyId) {
        return exportReportToPDF(reportType, year, facultyId);
    }
    
    private ResponseEntity<byte[]> exportReportToExcel(String reportType, Integer year, String facultyId) {
        try {
            Map<String, Object> reportData = resolveReportData(reportType, year, facultyId);
            if (reportData == null) {
                String errorMsg = "Invalid report type: " + reportType;
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(errorMsg.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            }

            byte[] excelData = excelExportService.exportReportToExcel(reportData, reportType);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", reportType.toLowerCase() + "_report.xlsx");
            headers.setAccessControlExposeHeaders(List.of("Content-Disposition"));
            
            return new ResponseEntity<>(excelData, headers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            String errorMsg = "Error exporting Excel: " + e.getMessage();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorMsg.getBytes(java.nio.charset.StandardCharsets.UTF_8));
        }
    }
    
    private ResponseEntity<byte[]> exportReportToPDF(String reportType, Integer year, String facultyId) {
        try {
            Map<String, Object> reportData = resolveReportData(reportType, year, facultyId);
            if (reportData == null) {
                String errorMsg = "Invalid report type: " + reportType;
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(errorMsg.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            }
            
            byte[] pdfData = generatePDFFromReport(reportData, reportType);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", reportType.toLowerCase() + "_report.pdf");
            headers.setAccessControlExposeHeaders(List.of("Content-Disposition"));
            
            return new ResponseEntity<>(pdfData, headers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            String errorMsg = "Error exporting PDF: " + e.getMessage();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorMsg.getBytes(java.nio.charset.StandardCharsets.UTF_8));
        }
    }
    
    private Map<String, Object> resolveReportData(String reportType, Integer year, String facultyId) {
        switch (reportType.toUpperCase()) {
            case "NAAC":
                return reportService.generateNAACReport(year, facultyId);
            case "NBA":
                return reportService.generateNBAReport(year, facultyId);
            case "NIRF":
                return reportService.generateNIRFReport(year, facultyId);
            default:
                return null;
        }
    }
    
    private byte[] generatePDFFromReport(Map<String, Object> reportData, String reportType) {
        // Lightweight fallback (not a real formatted PDF, but a textual export)
        // For production, replace with a proper PDF generator (iText/PDFBox).
        StringBuilder sb = new StringBuilder();
        sb.append(reportType.toUpperCase()).append(" REPORT\n\n");
        reportData.forEach((k, v) -> {
            sb.append(k).append(": ").append(v).append("\n");
        });
        return sb.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8);
    }

    @PostMapping("/initialize-system")
    public ResponseEntity<Void> initializeSystem(@RequestBody List<String> facultyNames) {
        scholarService.initializeSystem(facultyNames);
        return ResponseEntity.ok().build();
    }
}

