package com.drims.repository;

import com.drims.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, String> {
    List<Project> findByFacultyId(String facultyId);
    List<Project> findByApprovalStatus(String approvalStatus);
    List<Project> findByApprovalStatusIn(List<String> approvalStatuses);
    List<Project> findAll();
}
