package com.drims.service;

import com.drims.entity.*;
import com.drims.repository.*;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Collection;
import java.util.List;
import java.util.Map;

@Service
public class ExcelExportService {
    
    @Autowired
    private JournalRepository journalRepository;
    
    @Autowired
    private ConferenceRepository conferenceRepository;
    
    @Autowired
    private PatentRepository patentRepository;
    
    @Autowired
    private BookChapterRepository bookChapterRepository;
    
    @Autowired
    private BookRepository bookRepository;
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private FacultyProfileRepository facultyProfileRepository;
    
    @Autowired
    private FacultyProfileService facultyProfileService;

    private void createJournalSheet(Workbook workbook, Integer year, Map<String, String> facultyNames) {
        Sheet sheet = workbook.createSheet("Journals");
        int rowNum = 0;
        
        // Header
        Row headerRow = sheet.createRow(rowNum++);
        String[] headers = {"Faculty Name", "Title", "Journal Name", "Authors", "Year", "Volume", "Issue", "Pages", "DOI", "Impact Factor", "Status"};
        createHeaderRow(headerRow, headers, workbook);
        
        // Data
        List<Journal> journals = year != null ? journalRepository.findByYear(year) : journalRepository.findAll();
        for (Journal journal : journals) {
            Row row = sheet.createRow(rowNum++);
            String facultyName = facultyNames.getOrDefault(journal.getFacultyId(), "");
            row.createCell(0).setCellValue(facultyName);
            row.createCell(1).setCellValue(journal.getTitle());
            row.createCell(2).setCellValue(journal.getJournalName());
            row.createCell(3).setCellValue(journal.getAuthors() != null ? String.join(", ", journal.getAuthors()) : "");
            row.createCell(4).setCellValue(journal.getYear() != null ? journal.getYear() : 0);
            row.createCell(5).setCellValue(journal.getVolume() != null ? journal.getVolume() : "");
            row.createCell(6).setCellValue(journal.getIssue() != null ? journal.getIssue() : "");
            row.createCell(7).setCellValue(journal.getPages() != null ? journal.getPages() : "");
            row.createCell(8).setCellValue(journal.getDoi() != null ? journal.getDoi() : "");
            row.createCell(9).setCellValue(journal.getImpactFactor() != null ? journal.getImpactFactor() : "");
            row.createCell(10).setCellValue(journal.getStatus());
        }
        
        // autoSizeColumns(sheet, headers.length); // Disabled for performance
    }
    
    public byte[] exportToExcel(Integer year, String category, String facultyName) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        
        // Optimize: Fetch all faculty names once
        List<FacultyProfile> profiles = facultyProfileRepository.findAll();
        java.util.Map<String, String> facultyNames = profiles.stream()
            .collect(java.util.stream.Collectors.toMap(FacultyProfile::getId, FacultyProfile::getName, (a, b) -> a));

        if (category == null || category.equals("Journals")) {
            createJournalSheet(workbook, year, facultyNames);
        }
        if (category == null || category.equals("Conferences")) {
            createConferenceSheet(workbook, year, facultyNames);
        }
        if (category == null || category.equals("Patents")) {
            createPatentSheet(workbook, year, facultyNames);
        }
        if (category == null || category.equals("BookChapters")) {
            createBookChapterSheet(workbook, year, facultyNames);
        }
        if (category == null || category.equals("Books")) {
            createBookSheet(workbook, year, facultyNames);
        }
        if (category == null || category.equals("Projects")) {
            createProjectSheet(workbook, year, facultyNames);
        }
        if ("FacultySubmissions".equals(category)) {
            createFacultySubmissionSheet(workbook, year, facultyName);
        }
        
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();
        
        return outputStream.toByteArray();
    }
    
    // createJournalSheet is already updated in previous step, skipping it here in replacement to avoid conflicts if I use range.
    // Actually I need to be careful not to overwrite the previously edited createJournalSheet if I select a large range.
    // I will target from createConferenceSheet onwards.

    private void createConferenceSheet(Workbook workbook, Integer year, java.util.Map<String, String> facultyNames) {
        Sheet sheet = workbook.createSheet("Conferences");
        int rowNum = 0;
        
        Row headerRow = sheet.createRow(rowNum++);
        String[] headers = {"Faculty Name", "Title", "Conference Name", "Authors", "Year", "Location", "Date", "Status"};
        createHeaderRow(headerRow, headers, workbook);
        
        List<Conference> conferences = year != null ? conferenceRepository.findByYear(year) : conferenceRepository.findAll();
        for (Conference conference : conferences) {
            Row row = sheet.createRow(rowNum++);
            String facultyName = facultyNames.getOrDefault(conference.getFacultyId(), "");
            row.createCell(0).setCellValue(facultyName);
            row.createCell(1).setCellValue(conference.getTitle());
            row.createCell(2).setCellValue(conference.getConferenceName());
            row.createCell(3).setCellValue(conference.getAuthors() != null ? String.join(", ", conference.getAuthors()) : "");
            row.createCell(4).setCellValue(conference.getYear() != null ? conference.getYear() : 0);
            row.createCell(5).setCellValue(conference.getLocation() != null ? conference.getLocation() : "");
            row.createCell(6).setCellValue(conference.getDate() != null ? conference.getDate() : "");
            row.createCell(7).setCellValue(conference.getStatus());
        }
    }
    
    private void createPatentSheet(Workbook workbook, Integer year, java.util.Map<String, String> facultyNames) {
        Sheet sheet = workbook.createSheet("Patents");
        int rowNum = 0;
        
        Row headerRow = sheet.createRow(rowNum++);
        String[] headers = {"Faculty Name", "Title", "Patent Number", "Inventors", "Year", "Country", "Status"};
        createHeaderRow(headerRow, headers, workbook);
        
        List<Patent> patents = year != null ? patentRepository.findByYear(year) : patentRepository.findAll();
        for (Patent patent : patents) {
            Row row = sheet.createRow(rowNum++);
            String facultyName = facultyNames.getOrDefault(patent.getFacultyId(), "");
            row.createCell(0).setCellValue(facultyName);
            row.createCell(1).setCellValue(patent.getTitle());
            row.createCell(2).setCellValue(patent.getPatentNumber() != null ? patent.getPatentNumber() : "");
            row.createCell(3).setCellValue(patent.getInventors() != null ? String.join(", ", patent.getInventors()) : "");
            row.createCell(4).setCellValue(patent.getYear() != null ? patent.getYear() : 0);
            row.createCell(5).setCellValue(patent.getCountry() != null ? patent.getCountry() : "");
            row.createCell(6).setCellValue(patent.getStatus());
        }
    }
    
    private void createBookChapterSheet(Workbook workbook, Integer year, java.util.Map<String, String> facultyNames) {
        Sheet sheet = workbook.createSheet("Book Chapters");
        int rowNum = 0;
        
        Row headerRow = sheet.createRow(rowNum++);
        String[] headers = {"Faculty Name", "Title", "Book Title", "Authors", "Editors", "Publisher", "Year", "Pages", "ISBN", "Status"};
        createHeaderRow(headerRow, headers, workbook);
        
        List<BookChapter> bookChapters = year != null ? bookChapterRepository.findByYear(year) : bookChapterRepository.findAll();
        for (BookChapter bookChapter : bookChapters) {
            Row row = sheet.createRow(rowNum++);
            String facultyName = facultyNames.getOrDefault(bookChapter.getFacultyId(), "");
            row.createCell(0).setCellValue(facultyName);
            row.createCell(1).setCellValue(bookChapter.getTitle());
            row.createCell(2).setCellValue(bookChapter.getBookTitle());
            row.createCell(3).setCellValue(bookChapter.getAuthors() != null ? String.join(", ", bookChapter.getAuthors()) : "");
            row.createCell(4).setCellValue(bookChapter.getEditors() != null ? bookChapter.getEditors() : "");
            row.createCell(5).setCellValue(bookChapter.getPublisher() != null ? bookChapter.getPublisher() : "");
            row.createCell(6).setCellValue(bookChapter.getYear() != null ? bookChapter.getYear() : 0);
            row.createCell(7).setCellValue(bookChapter.getPages() != null ? bookChapter.getPages() : "");
            row.createCell(8).setCellValue(bookChapter.getIsbn() != null ? bookChapter.getIsbn() : "");
            row.createCell(9).setCellValue(bookChapter.getStatus());
        }
    }
    
    private void createBookSheet(Workbook workbook, Integer year, java.util.Map<String, String> facultyNames) {
        Sheet sheet = workbook.createSheet("Books");
        int rowNum = 0;
        
        Row headerRow = sheet.createRow(rowNum++);
        String[] headers = {"Faculty Name", "Book Title", "Publisher", "ISBN", "Publication Year", "Category", "Role", "Status"};
        createHeaderRow(headerRow, headers, workbook);
        
        List<Book> books = year != null ? bookRepository.findByPublicationYear(year) : bookRepository.findAll();
        for (Book book : books) {
            Row row = sheet.createRow(rowNum++);
            String facultyName = facultyNames.getOrDefault(book.getFacultyId(), "");
            row.createCell(0).setCellValue(facultyName);
            row.createCell(1).setCellValue(book.getBookTitle());
            row.createCell(2).setCellValue(book.getPublisher() != null ? book.getPublisher() : "");
            row.createCell(3).setCellValue(book.getIsbn() != null ? book.getIsbn() : "");
            row.createCell(4).setCellValue(book.getPublicationYear() != null ? book.getPublicationYear() : 0);
            row.createCell(5).setCellValue(book.getCategory() != null ? book.getCategory() : "");
            row.createCell(6).setCellValue(book.getRole() != null ? book.getRole() : "");
            row.createCell(7).setCellValue(book.getApprovalStatus() != null ? book.getApprovalStatus() : "");
        }
    }
    
    private void createProjectSheet(Workbook workbook, Integer year, java.util.Map<String, String> facultyNames) {
        Sheet sheet = workbook.createSheet("Projects");
        int rowNum = 0;
        
        Row headerRow = sheet.createRow(rowNum++);
        String[] headers = {"Faculty Name", "Title", "Project Type", "Investigator", "Department", "Employee ID", "Date Approved", "Duration", "Amount", "Approval Status"};
        createHeaderRow(headerRow, headers, workbook);
        
        List<Project> projects = projectRepository.findAll();
        // Filtering by year for projects based on dateApproved
        for (Project project : projects) {
            if (year != null) {
                try {
                    String dateStr = project.getDateApproved();
                    if (dateStr == null || !dateStr.startsWith(year.toString())) {
                        continue;
                    }
                } catch (Exception e) {
                    continue;
                }
            }
            
            Row row = sheet.createRow(rowNum++);
            String facultyName = facultyNames.getOrDefault(project.getFacultyId(), "");
            row.createCell(0).setCellValue(facultyName);
            row.createCell(1).setCellValue(project.getTitle());
            row.createCell(2).setCellValue(project.getProjectType());
            row.createCell(3).setCellValue(project.getInvestigatorName());
            row.createCell(4).setCellValue(project.getDepartment());
            row.createCell(5).setCellValue(project.getEmployeeId());
            row.createCell(6).setCellValue(project.getDateApproved());
            row.createCell(7).setCellValue(project.getDuration());
            row.createCell(8).setCellValue(project.getAmount());
            row.createCell(9).setCellValue(project.getApprovalStatus());
        }
    }

    private void createFacultySubmissionSheet(Workbook workbook, Integer year, String facultyName) {
        Sheet sheet = workbook.createSheet("Faculty Submissions");
        int rowNum = 0;
        
        // Header
        Row headerRow = sheet.createRow(rowNum++);
        String[] headers = {"Employee ID", "Faculty Name", "Department", "Year", "Total Submissions", "Submission Status"};
        createHeaderRow(headerRow, headers, workbook);

        // Data
        List<com.drims.dto.FacultySubmissionDTO> submissions = facultyProfileService.getFacultySubmissions(
            year != null ? year : java.time.Year.now().getValue(), 
            facultyName
        );
        for (com.drims.dto.FacultySubmissionDTO sub : submissions) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(sub.getEmployeeId() != null ? sub.getEmployeeId() : "N/A");
            row.createCell(1).setCellValue(sub.getName() != null ? sub.getName() : "N/A");
            row.createCell(2).setCellValue(sub.getDepartment() != null ? sub.getDepartment() : "N/A");
            row.createCell(3).setCellValue(sub.getYear());
            row.createCell(4).setCellValue(sub.getTotalSubmissions());
            row.createCell(5).setCellValue(sub.getSubmissionStatus());
        }
    }
    
    private void createHeaderRow(Row headerRow, String[] headers, Workbook workbook) {
        CellStyle headerStyle = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        headerStyle.setFont(font);
        headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }
    }
    
    private void autoSizeColumns(Sheet sheet, int numColumns) {
        for (int i = 0; i < numColumns; i++) {
            sheet.autoSizeColumn(i);
        }
    }
    
    // Export report data to Excel
    public byte[] exportReportToExcel(Map<String, Object> reportData, String reportType) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet(reportType + " Report");
        int rowNum = 0;
        
        // Report Header
        Row titleRow = sheet.createRow(rowNum++);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue(reportType + " Research Report");
        CellStyle titleStyle = workbook.createCellStyle();
        Font titleFont = workbook.createFont();
        titleFont.setBold(true);
        titleFont.setFontHeightInPoints((short) 16);
        titleStyle.setFont(titleFont);
        titleCell.setCellStyle(titleStyle);
        
        rowNum++; // Blank row
        
        if (reportData != null) {
        // Report Data
        for (Map.Entry<String, Object> entry : reportData.entrySet()) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(entry.getKey());

                Object val = entry.getValue();
                Cell valueCell = row.createCell(1);

                if (val == null) {
                    valueCell.setCellValue("");
                } else if (val instanceof Number) {
                    valueCell.setCellValue(((Number) val).doubleValue());
                } else if (val instanceof Map) {
                // Handle nested maps (category-wise, year-wise, etc.)
                    valueCell.setCellValue(val.toString());
                } else if (val instanceof Collection) {
                    valueCell.setCellValue("Items: " + ((Collection<?>) val).size());
            } else {
                    valueCell.setCellValue(val.toString());
                }
            }
        }
        
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();
        
        return outputStream.toByteArray();
    }
}

