package com.drims.repository;

import com.drims.entity.Patent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatentRepository extends JpaRepository<Patent, String> {
    List<Patent> findByFacultyId(String facultyId);
    List<Patent> findAll();
    List<Patent> findByYear(Integer year);
    List<Patent> findByFacultyIdAndYear(String facultyId, Integer year);
    List<Patent> findByApprovalStatus(String approvalStatus);
    List<Patent> findByApprovalStatusIn(List<String> approvalStatuses);
    long countByFacultyIdAndYear(String facultyId, Integer year);
}

