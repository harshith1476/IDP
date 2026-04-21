package com.drims.service;

import com.drims.dto.AnalyticsDTO;
import com.drims.entity.*;
import com.drims.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {
    
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
    
    public AnalyticsDTO getAnalytics() {
        AnalyticsDTO analytics = new AnalyticsDTO();
        
        // Fetch all data once to avoid repetitive DB calls
        List<Journal> journals = journalRepository.findAll();
        List<Conference> conferences = conferenceRepository.findAll();
        List<Patent> patents = patentRepository.findAll();
        List<BookChapter> bookChapters = bookChapterRepository.findAll();
        List<com.drims.entity.Book> books = bookRepository.findAll();
        List<Project> projects = projectRepository.findAll();
        List<FacultyProfile> allFaculty = facultyProfileRepository.findAll();
        
        // Year-wise totals
        Map<Integer, Integer> yearWise = new HashMap<>();
        addYearWiseCounts(journals, yearWise);
        addYearWiseCounts(conferences, yearWise);
        addYearWiseCounts(patents, yearWise);
        addYearWiseCounts(bookChapters, yearWise);
        addYearWiseCounts(books, yearWise);
        addYearWiseCounts(projects, yearWise);
        analytics.setYearWiseTotals(yearWise);
        
        // Category-wise totals
        Map<String, Integer> categoryWise = new HashMap<>();
        categoryWise.put("Journals", journals.size());
        categoryWise.put("Conferences", conferences.size());
        categoryWise.put("Patents", patents.size());
        categoryWise.put("Book Chapters", bookChapters.size());
        categoryWise.put("Books", books.size());
        categoryWise.put("Projects", projects.size());
        analytics.setCategoryWiseTotals(categoryWise);
        
        // Faculty-wise contribution (Optimized in-memory aggregation)
        // Map<FacultyId, Count>
        Map<String, Integer> facultyIdCounts = new HashMap<>();
        
        countFacultyContributions(journals, facultyIdCounts);
        countFacultyContributions(conferences, facultyIdCounts);
        countFacultyContributions(patents, facultyIdCounts);
        countFacultyContributions(bookChapters, facultyIdCounts);
        countFacultyContributions(books, facultyIdCounts);
        countFacultyContributions(projects, facultyIdCounts);

        Map<String, Integer> facultyWise = new HashMap<>();
        for (FacultyProfile faculty : allFaculty) {
            int count = facultyIdCounts.getOrDefault(faculty.getId(), 0);
            if (count > 0) {
                facultyWise.put(faculty.getName(), count);
            }
        }
        analytics.setFacultyWiseContribution(facultyWise);
        
        // Status-wise breakdown
        Map<String, Integer> statusWise = new HashMap<>();
        addStatusCounts(journals, statusWise);
        addStatusCounts(conferences, statusWise);
        addStatusCounts(patents, statusWise);
        addStatusCounts(bookChapters, statusWise);
        addStatusCounts(books, statusWise);
        addStatusCounts(projects, statusWise);
        analytics.setStatusWiseBreakdown(statusWise);
        
        return analytics;
    }

    // Helper to count contributions per faculty
    private void countFacultyContributions(List<?> items, Map<String, Integer> counts) {
        for (Object item : items) {
             String facultyId = null;
             if (item instanceof Journal) facultyId = ((Journal) item).getFacultyId();
             else if (item instanceof Conference) facultyId = ((Conference) item).getFacultyId();
             else if (item instanceof Patent) facultyId = ((Patent) item).getFacultyId();
             else if (item instanceof BookChapter) facultyId = ((BookChapter) item).getFacultyId();
             else if (item instanceof com.drims.entity.Book) facultyId = ((com.drims.entity.Book) item).getFacultyId();
             else if (item instanceof Project) facultyId = ((Project) item).getFacultyId();
             
             if (facultyId != null) {
                 counts.put(facultyId, counts.getOrDefault(facultyId, 0) + 1);
             }
        }
    }
    
    private void addYearWiseCounts(List<?> items, Map<Integer, Integer> yearWise) {
        for (Object item : items) {
            Integer year = null;
            if (item instanceof Journal) {
                year = ((Journal) item).getYear();
            } else if (item instanceof Conference) {
                year = ((Conference) item).getYear();
            } else if (item instanceof Patent) {
                year = ((Patent) item).getYear();
            } else if (item instanceof BookChapter) {
                year = ((BookChapter) item).getYear();
            } else if (item instanceof com.drims.entity.Book) {
                year = ((com.drims.entity.Book) item).getPublicationYear();
            } else if (item instanceof Project) {
                // For projects, we don't have a direct 'year' field, but we have 'dateApproved'
                // format typically "YYYY-MM-DD" or similar.
                try {
                    String dateStr = ((Project) item).getDateApproved();
                    if (dateStr != null && dateStr.length() >= 4) {
                        year = Integer.parseInt(dateStr.substring(0, 4));
                    }
                } catch (Exception e) {}
            }
            if (year != null) {
                yearWise.put(year, yearWise.getOrDefault(year, 0) + 1);
            }
        }
    }
    
    private void addStatusCounts(List<?> items, Map<String, Integer> statusWise) {
        for (Object item : items) {
            String status = null;
            if (item instanceof Journal) {
                status = ((Journal) item).getStatus();
            } else if (item instanceof Conference) {
                status = ((Conference) item).getStatus();
            } else if (item instanceof Patent) {
                status = ((Patent) item).getStatus();
            } else if (item instanceof BookChapter) {
                status = ((BookChapter) item).getStatus();
            } else if (item instanceof com.drims.entity.Book) {
                status = ((com.drims.entity.Book) item).getStatus();
            } else if (item instanceof Project) {
                status = ((Project) item).getStatus();
            }
            if (status != null) {
                statusWise.put(status, statusWise.getOrDefault(status, 0) + 1);
            }
        }
    }
}

