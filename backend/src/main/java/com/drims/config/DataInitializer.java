package com.drims.config;

import com.drims.entity.User;
import com.drims.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Create Admin User only
        // Faculty data is loaded by FacultyDataLoader
        if (!userRepository.existsByEmail("admin@drims.edu")) {
            User admin = new User();
            admin.setEmail("admin@drims.edu");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            admin.setFacultyId(null);
            admin.setCreatedAt(LocalDateTime.now());
            admin.setUpdatedAt(LocalDateTime.now());
            userRepository.save(admin);
            System.out.println("Admin user created: admin@drims.edu / admin123");
        }
    }
}

