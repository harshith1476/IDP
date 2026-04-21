package com.drims.repository;

import com.drims.entity.Journal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JournalRepository extends JpaRepository<Journal, String> {
    List<Journal> findByFacultyId(String facultyId);
    List<Journal> findAllByDoi(String doi);
    List<Journal> findAllByTitleIgnoreCase(String title);
    List<Journal> findAllByTitleIgnoreCaseAndFacultyId(String title, String facultyId);
    List<Journal> findByStudentId(String studentId);
    List<Journal> findAll();
    List<Journal> findByYear(Integer year);
    List<Journal> findByFacultyIdAndYear(String facultyId, Integer year);
    List<Journal> findByApprovalStatus(String approvalStatus);
    List<Journal> findByApprovalStatusIn(List<String> approvalStatuses);
    long countByFacultyIdAndYear(String facultyId, Integer year);
}

