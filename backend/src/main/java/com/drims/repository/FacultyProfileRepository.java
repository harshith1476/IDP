package com.drims.repository;

import com.drims.entity.FacultyProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FacultyProfileRepository extends JpaRepository<FacultyProfile, String> {
    Optional<FacultyProfile> findByEmail(String email);
    Optional<FacultyProfile> findByEmployeeId(String employeeId);
    Optional<FacultyProfile> findByUserId(String userId);
    List<FacultyProfile> findAll();
    boolean existsByEmployeeId(String employeeId);
    boolean existsByEmail(String email);
    List<FacultyProfile> findByNameContainingIgnoreCase(String name);
}

