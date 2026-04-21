package com.drims.repository;

import com.drims.entity.Target;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TargetRepository extends JpaRepository<Target, String> {
    List<Target> findByFacultyId(String facultyId);
    Optional<Target> findByFacultyIdAndYear(String facultyId, Integer year);
    List<Target> findAll();
}

