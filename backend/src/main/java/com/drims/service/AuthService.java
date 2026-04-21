package com.drims.service;

import com.drims.dto.JwtResponse;
import com.drims.dto.LoginRequest;
import com.drims.entity.FacultyProfile;
import com.drims.entity.StudentProfile;
import com.drims.entity.User;
import com.drims.repository.FacultyProfileRepository;
import com.drims.repository.StudentProfileRepository;
import com.drims.repository.UserRepository;
import com.drims.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private FacultyProfileRepository facultyProfileRepository;
    
    @Autowired
    private StudentProfileRepository studentProfileRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    public JwtResponse login(LoginRequest loginRequest) {
        Optional<User> userOpt;
        
        // Support both email (FACULTY/ADMIN) and registerNumber (STUDENT) login
        if (loginRequest.getRegisterNumber() != null && !loginRequest.getRegisterNumber().isEmpty()) {
            // Student login with register number
            userOpt = userRepository.findByRegisterNumber(loginRequest.getRegisterNumber());
        } else if (loginRequest.getEmail() != null && !loginRequest.getEmail().isEmpty()) {
            // Faculty/Admin login with email
            userOpt = userRepository.findByEmail(loginRequest.getEmail());
        } else {
            throw new RuntimeException("Email or Register Number is required");
        }
        
        if (userOpt.isEmpty() || !passwordEncoder.matches(loginRequest.getPassword(), userOpt.get().getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        User user = userOpt.get();
        
        // Generate token with email and registerNumber
        String token = tokenProvider.generateToken(user.getEmail(), user.getRegisterNumber(), user.getRole(), user.getFacultyId(), user.getStudentId());
        
        // Build response with email and registerNumber
        return new JwtResponse(token, "Bearer", user.getEmail(), user.getRegisterNumber(), user.getRole(), user.getFacultyId(), user.getStudentId());
    }
    
    public User getCurrentUser(String identifier) {
        // Try email first, then registerNumber
        Optional<User> userOpt = userRepository.findByEmail(identifier);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByRegisterNumber(identifier);
        }
        return userOpt.orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    public FacultyProfile getCurrentFacultyProfile(String email) {
        User user = getCurrentUser(email);
        if (user.getFacultyId() == null) {
            throw new RuntimeException("Faculty profile not found");
        }
        return facultyProfileRepository.findById(user.getFacultyId())
                .orElseThrow(() -> new RuntimeException("Faculty profile not found"));
    }
    
    public StudentProfile getCurrentStudentProfile(String registerNumber) {
        User user = getCurrentUser(registerNumber);
        if (user.getStudentId() == null) {
            throw new RuntimeException("Student profile not found");
        }
        return studentProfileRepository.findById(user.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student profile not found"));
    }
}

