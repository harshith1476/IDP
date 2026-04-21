package com.drims.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtTokenProvider {
    
    @Value("${jwt.secret}")
    private String jwtSecret;
    
    @Value("${jwt.expiration}")
    private long jwtExpiration;
    
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }
    
    public String generateToken(String email, String registerNumber, String role, String facultyId, String studentId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);
        
        // Subject is email for FACULTY/ADMIN, registerNumber for STUDENT
        String subject = email != null ? email : registerNumber;
        
        return Jwts.builder()
                .subject(subject) // email for FACULTY/ADMIN, registerNumber for STUDENT
                .claim("email", email) // Store email explicitly
                .claim("registerNumber", registerNumber) // Store registerNumber explicitly
                .claim("role", role)
                .claim("facultyId", facultyId)
                .claim("studentId", studentId)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }
    
    // Legacy method for backward compatibility
    public String generateToken(String email, String role, String facultyId) {
        return generateToken(email, null, role, facultyId, null);
    }
    
    // Overload for identifier-based login (backward compatibility)
    public String generateToken(String identifier, String role, String facultyId, String studentId) {
        // If identifier contains @, treat as email, else as registerNumber
        if (identifier != null && identifier.contains("@")) {
            return generateToken(identifier, null, role, facultyId, studentId);
        } else {
            return generateToken(null, identifier, role, facultyId, studentId);
        }
    }
    
    public String getEmailFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        // Return email claim if present, else null (don't use subject as fallback for email)
        return claims.get("email", String.class);
    }
    
    public String getRegisterNumberFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        // Return registerNumber claim if present, else null (don't use subject as fallback for registerNumber)
        return claims.get("registerNumber", String.class);
    }
    
    public String getIdentifierFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        // Subject is always set to the correct identifier (email or registerNumber)
        return claims.getSubject();
    }
    
    public String getRoleFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.get("role", String.class);
    }
    
    public String getFacultyIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.get("facultyId", String.class);
    }
    
    public String getStudentIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.get("studentId", String.class);
    }
    
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}

