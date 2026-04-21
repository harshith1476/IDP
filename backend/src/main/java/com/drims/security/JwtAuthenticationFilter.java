package com.drims.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        // Skip JWT filtering for authentication endpoints
        return path.startsWith("/api/auth/");
    }
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String jwt = getJwtFromRequest(request);
        
        if (jwt != null) {
            try {
                if (tokenProvider.validateToken(jwt)) {
            // Get identifier from token subject (subject is always set to email for FACULTY/ADMIN, registerNumber for STUDENT)
            String identifier = tokenProvider.getIdentifierFromToken(jwt);
            String role = tokenProvider.getRoleFromToken(jwt);
            
            if (identifier != null && role != null) {
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        identifier, null, Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role)));
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                SecurityContextHolder.getContext().setAuthentication(authentication);
                    } else {
                        System.err.println("JWT Filter: Missing identifier or role in token. Identifier: " + identifier + ", Role: " + role);
                    }
                } else {
                    System.err.println("JWT Filter: Token validation failed for request: " + request.getRequestURI());
                }
            } catch (Exception e) {
                System.err.println("JWT Filter: Error processing token: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            // Only log if it's a protected endpoint
            String path = request.getRequestURI();
            if (path.startsWith("/api/faculty/") || path.startsWith("/api/admin/") || path.startsWith("/api/student/")) {
                System.err.println("JWT Filter: No token found in request for: " + path);
            }
        }
        
        filterChain.doFilter(request, response);
    }
    
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}

