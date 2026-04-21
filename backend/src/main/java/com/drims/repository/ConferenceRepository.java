package com.drims.repository;

import com.drims.entity.Conference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConferenceRepository extends JpaRepository<Conference, String> {
    List<Conference> findByFacultyId(String facultyId);
    List<Conference> findAllByDoi(String doi);
    List<Conference> findAllByTitleIgnoreCase(String title);
    List<Conference> findAllByTitleIgnoreCaseAndFacultyId(String title, String facultyId);
    List<Conference> findByStudentId(String studentId);
    List<Conference> findAll();
    List<Conference> findByYear(Integer year);
    List<Conference> findByFacultyIdAndYear(String facultyId, Integer year);
    List<Conference> findByApprovalStatus(String approvalStatus);
    List<Conference> findByApprovalStatusIn(List<String> approvalStatuses);
    long countByFacultyIdAndYear(String facultyId, Integer year);
}

