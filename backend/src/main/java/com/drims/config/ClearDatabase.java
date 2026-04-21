package com.drims.config;

import com.drims.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Utility class to clear database if needed
 * Run with: java -jar app.jar --clear-db
 */
// @Component
public class ClearDatabase implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private FacultyProfileRepository facultyProfileRepository;
    
    @Autowired
    private JournalRepository journalRepository;
    
    @Autowired
    private ConferenceRepository conferenceRepository;
    
    @Autowired
    private PatentRepository patentRepository;
    
    @Autowired
    private BookChapterRepository bookChapterRepository;
    
    @Autowired
    private TargetRepository targetRepository;
    
    @Override
    public void run(String... args) {
        // Only clear if explicitly requested OR if --clear-db flag is present
        boolean shouldClear = false;
        for (String arg : args) {
            if (arg.equals("--clear-db") || arg.equals("clear-db")) {
                shouldClear = true;
                break;
            }
        }
        
        // Also check environment variable or system property
        String clearDbProperty = System.getProperty("clear.db");
        if (clearDbProperty != null && clearDbProperty.equalsIgnoreCase("true")) {
            shouldClear = true;
        }
        
        if (shouldClear) {
            System.out.println("========================================");
            System.out.println("Clearing database completely...");
            System.out.println("This will drop all collections and indexes!");
            System.out.println("========================================");
            
            try {
                // Delete data using JPA repositories
                journalRepository.deleteAllInBatch();
                conferenceRepository.deleteAllInBatch();
                patentRepository.deleteAllInBatch();
                bookChapterRepository.deleteAllInBatch();
                targetRepository.deleteAllInBatch();
                facultyProfileRepository.deleteAllInBatch();
                userRepository.deleteAllInBatch();
                System.out.println("All tables cleared successfully!");
            } catch (Exception e) {
                System.out.println("Error clearing tables: " + e.getMessage());
                // Fallback to deleteAll if deleteAllInBatch fails
                journalRepository.deleteAll();
                conferenceRepository.deleteAll();
                patentRepository.deleteAll();
                bookChapterRepository.deleteAll();
                targetRepository.deleteAll();
                facultyProfileRepository.deleteAll();
                userRepository.deleteAll();
                System.out.println("All data deleted via fallback!");
            }
            
            System.out.println("========================================");
            System.out.println("Database cleared successfully!");
            System.out.println("You can now restart the backend to load all 74 faculty.");
            System.out.println("========================================");
        }
    }
}

