package com.drims.service;

import com.drims.entity.*;
import com.drims.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {
    
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
    private FacultyProfileRepository facultyProfileRepository;
    
    @Autowired
    private StudentProfileRepository studentProfileRepository;
    
    // NAAC Report
    public Map<String, Object> generateNAACReport(Integer year, String facultyId) {
        Map<String, Object> report = new HashMap<>();
        
        // Filter by year if provided
        List<Journal> allJournals = year != null ? 
            journalRepository.findByYear(year) : journalRepository.findAll();
        List<Conference> allConferences = year != null ? 
            conferenceRepository.findByYear(year) : conferenceRepository.findAll();
        List<Patent> allPatents = year != null ? 
            patentRepository.findByYear(year) : patentRepository.findAll();
        List<BookChapter> allBookChapters = year != null ? 
            bookChapterRepository.findByYear(year) : bookChapterRepository.findAll();
        List<Book> allBooks = year != null ? 
            bookRepository.findByPublicationYear(year) : bookRepository.findAll();
        
        // Filter by faculty if provided
        if (facultyId != null) {
            allJournals = allJournals.stream()
                .filter(j -> facultyId.equals(j.getFacultyId()))
                .collect(Collectors.toList());
            allConferences = allConferences.stream()
                .filter(c -> facultyId.equals(c.getFacultyId()))
                .collect(Collectors.toList());
            allPatents = allPatents.stream()
                .filter(p -> facultyId.equals(p.getFacultyId()))
                .collect(Collectors.toList());
            allBookChapters = allBookChapters.stream()
                .filter(bc -> facultyId.equals(bc.getFacultyId()))
                .collect(Collectors.toList());
            allBooks = allBooks.stream()
                .filter(b -> facultyId.equals(b.getFacultyId()))
                .collect(Collectors.toList());
        }
        
        // Only approved publications
        allJournals = allJournals.stream()
            .filter(j -> "APPROVED".equals(j.getApprovalStatus()) || "LOCKED".equals(j.getApprovalStatus()))
            .collect(Collectors.toList());
        allConferences = allConferences.stream()
            .filter(c -> "APPROVED".equals(c.getApprovalStatus()) || "LOCKED".equals(c.getApprovalStatus()))
            .collect(Collectors.toList());
        allPatents = allPatents.stream()
            .filter(p -> "APPROVED".equals(p.getApprovalStatus()) || "LOCKED".equals(p.getApprovalStatus()))
            .collect(Collectors.toList());
        allBookChapters = allBookChapters.stream()
            .filter(bc -> "APPROVED".equals(bc.getApprovalStatus()) || "LOCKED".equals(bc.getApprovalStatus()))
            .collect(Collectors.toList());
        allBooks = allBooks.stream()
            .filter(b -> "APPROVED".equals(b.getApprovalStatus()) || "LOCKED".equals(b.getApprovalStatus()))
            .collect(Collectors.toList());
        
        // National vs International split
        Map<String, Long> journalsByCategory = allJournals.stream()
            .collect(Collectors.groupingBy(
                j -> j.getCategory() != null ? j.getCategory() : "Not Specified",
                Collectors.counting()
            ));
        
        Map<String, Long> conferencesByCategory = allConferences.stream()
            .collect(Collectors.groupingBy(
                c -> c.getCategory() != null ? c.getCategory() : "Not Specified",
                Collectors.counting()
            ));
        
        Map<String, Long> patentsByCategory = allPatents.stream()
            .collect(Collectors.groupingBy(
                p -> p.getCategory() != null ? p.getCategory() : "Not Specified",
                Collectors.counting()
            ));
        
        Map<String, Long> bookChaptersByCategory = allBookChapters.stream()
            .collect(Collectors.groupingBy(
                bc -> bc.getCategory() != null ? bc.getCategory() : "Not Specified",
                Collectors.counting()
            ));
        
        Map<String, Long> booksByCategory = allBooks.stream()
            .collect(Collectors.groupingBy(
                b -> b.getCategory() != null ? b.getCategory() : "Not Specified",
                Collectors.counting()
            ));
        
        // Year-wise distribution
        Map<Integer, Long> yearWiseJournals = allJournals.stream()
            .collect(Collectors.groupingBy(Journal::getYear, Collectors.counting()));
        
        Map<Integer, Long> yearWiseConferences = allConferences.stream()
            .collect(Collectors.groupingBy(Conference::getYear, Collectors.counting()));
        
        // Faculty-wise contribution
        Map<String, Long> facultyWiseJournals = allJournals.stream()
            .filter(j -> j.getFacultyId() != null)
            .collect(Collectors.groupingBy(
                j -> getFacultyName(j.getFacultyId()),
                Collectors.counting()
            ));
        
        report.put("totalJournals", allJournals.size());
        report.put("totalConferences", allConferences.size());
        report.put("totalPatents", allPatents.size());
        report.put("totalBookChapters", allBookChapters.size());
        report.put("totalBooks", allBooks.size());
        report.put("journalsByCategory", journalsByCategory);
        report.put("conferencesByCategory", conferencesByCategory);
        report.put("patentsByCategory", patentsByCategory);
        report.put("bookChaptersByCategory", bookChaptersByCategory);
        report.put("booksByCategory", booksByCategory);
        report.put("yearWiseJournals", yearWiseJournals);
        report.put("yearWiseConferences", yearWiseConferences);
        report.put("facultyWiseJournals", facultyWiseJournals);
        report.put("generatedAt", LocalDateTime.now());
        report.put("year", year);
        report.put("facultyId", facultyId);
        
        return report;
    }
    
    // NBA Report
    public Map<String, Object> generateNBAReport(Integer year, String facultyId) {
        Map<String, Object> report = generateNAACReport(year, facultyId);
        report.put("reportType", "NBA");
        
        // Additional NBA-specific metrics
        List<Journal> allJournals = year != null ? 
            journalRepository.findByYear(year) : journalRepository.findAll();
        
        if (facultyId != null) {
            allJournals = allJournals.stream()
                .filter(j -> facultyId.equals(j.getFacultyId()))
                .collect(Collectors.toList());
        }
        
        allJournals = allJournals.stream()
            .filter(j -> "APPROVED".equals(j.getApprovalStatus()) || "LOCKED".equals(j.getApprovalStatus()))
            .collect(Collectors.toList());
        
        // Index type distribution
        Map<String, Long> indexTypeDistribution = allJournals.stream()
            .filter(j -> j.getIndexType() != null)
            .collect(Collectors.groupingBy(Journal::getIndexType, Collectors.counting()));
        
        report.put("indexTypeDistribution", indexTypeDistribution);
        
        return report;
    }
    
    // NIRF Report
    public Map<String, Object> generateNIRFReport(Integer year, String facultyId) {
        Map<String, Object> report = generateNAACReport(year, facultyId);
        report.put("reportType", "NIRF");
        
        // Additional NIRF-specific metrics
        List<Journal> allJournals = year != null ? 
            journalRepository.findByYear(year) : journalRepository.findAll();
        List<Conference> allConferences = year != null ? 
            conferenceRepository.findByYear(year) : conferenceRepository.findAll();
        
        if (facultyId != null) {
            allJournals = allJournals.stream()
                .filter(j -> facultyId.equals(j.getFacultyId()))
                .collect(Collectors.toList());
            allConferences = allConferences.stream()
                .filter(c -> facultyId.equals(c.getFacultyId()))
                .collect(Collectors.toList());
        }
        
        allJournals = allJournals.stream()
            .filter(j -> "APPROVED".equals(j.getApprovalStatus()) || "LOCKED".equals(j.getApprovalStatus()))
            .collect(Collectors.toList());
        allConferences = allConferences.stream()
            .filter(c -> "APPROVED".equals(c.getApprovalStatus()) || "LOCKED".equals(c.getApprovalStatus()))
            .collect(Collectors.toList());
        
        // Publication quality metrics
        long highImpactJournals = allJournals.stream()
            .filter(j -> j.getImpactFactor() != null)
            .filter(j -> {
                try {
                    double impact = Double.parseDouble(j.getImpactFactor());
                    return impact >= 3.0;
                } catch (NumberFormatException e) {
                    return false;
                }
            })
            .count();
        
        report.put("highImpactJournals", highImpactJournals);
        report.put("publicationQualityScore", calculateQualityScore(allJournals, allConferences));
        
        return report;
    }
    
    private String getFacultyName(String facultyId) {
        return facultyProfileRepository.findById(facultyId)
            .map(FacultyProfile::getName)
            .orElse("Unknown Faculty");
    }
    
    private double calculateQualityScore(List<Journal> journals, List<Conference> conferences) {
        // Simple quality score calculation
        long totalPublications = journals.size() + conferences.size();
        if (totalPublications == 0) return 0.0;
        
        long highQualityCount = 0;
        for (Journal j : journals) {
            if (j.getImpactFactor() != null) {
                try {
                    double impact = Double.parseDouble(j.getImpactFactor());
                    if (impact >= 2.0) highQualityCount++;
                } catch (NumberFormatException e) {
                    // Ignore invalid impact factors
                }
            }
        }
        
        return totalPublications > 0 ? (double) highQualityCount / totalPublications * 100 : 0.0;
    }
}
