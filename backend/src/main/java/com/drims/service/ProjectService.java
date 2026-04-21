package com.drims.service;

import com.drims.dto.ProjectDTO;
import com.drims.entity.Project;
import com.drims.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    public ProjectDTO createProject(String facultyId, ProjectDTO dto) {
        Project project = new Project();
        project.setFacultyId(facultyId);
        project.setProjectType(dto.getProjectType());
        project.setSeedGrantLink(dto.getSeedGrantLink());
        project.setInvestigatorName(dto.getInvestigatorName());
        project.setDepartment(dto.getDepartment());
        project.setEmployeeId(dto.getEmployeeId());
        project.setTitle(dto.getTitle());
        project.setDateApproved(dto.getDateApproved());
        project.setDuration(dto.getDuration());
        project.setAmount(dto.getAmount());
        project.setStatus(dto.getStatus());
        project.setOutcomeProofPath(dto.getOutcomeProofPath());
        project.setApprovalStatus("SUBMITTED");
        project.setCreatedAt(LocalDateTime.now());
        project.setUpdatedAt(LocalDateTime.now());

        project = projectRepository.save(project);
        return convertToDTO(project);
    }

    public ProjectDTO updateProject(String id, String facultyId, ProjectDTO dto) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.getFacultyId().equals(facultyId)) {
            throw new RuntimeException("Unauthorized to update this project");
        }

        if ("APPROVED".equals(project.getApprovalStatus()) || "LOCKED".equals(project.getApprovalStatus())) {
            throw new RuntimeException("Cannot update approved/locked project");
        }

        project.setProjectType(dto.getProjectType());
        project.setSeedGrantLink(dto.getSeedGrantLink());
        project.setInvestigatorName(dto.getInvestigatorName());
        project.setDepartment(dto.getDepartment());
        project.setEmployeeId(dto.getEmployeeId());
        project.setTitle(dto.getTitle());
        project.setDateApproved(dto.getDateApproved());
        project.setDuration(dto.getDuration());
        project.setAmount(dto.getAmount());
        project.setStatus(dto.getStatus());
        
        if (dto.getOutcomeProofPath() != null) {
            project.setOutcomeProofPath(dto.getOutcomeProofPath());
        }

        project.setUpdatedAt(LocalDateTime.now());
        project = projectRepository.save(project);
        return convertToDTO(project);
    }

    public List<ProjectDTO> getProjectsByFaculty(String facultyId) {
        return projectRepository.findByFacultyId(facultyId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ProjectDTO> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public void deleteProject(String id, String facultyId) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.getFacultyId().equals(facultyId)) {
            throw new RuntimeException("Unauthorized to delete this project");
        }

        if ("APPROVED".equals(project.getApprovalStatus()) || "LOCKED".equals(project.getApprovalStatus())) {
            throw new RuntimeException("Cannot delete approved/locked project");
        }

        projectRepository.delete(project);
    }

    private ProjectDTO convertToDTO(Project project) {
        ProjectDTO dto = new ProjectDTO();
        dto.setId(project.getId());
        dto.setProjectType(project.getProjectType());
        dto.setSeedGrantLink(project.getSeedGrantLink());
        dto.setInvestigatorName(project.getInvestigatorName());
        dto.setDepartment(project.getDepartment());
        dto.setEmployeeId(project.getEmployeeId());
        dto.setTitle(project.getTitle());
        dto.setDateApproved(project.getDateApproved());
        dto.setDuration(project.getDuration());
        dto.setAmount(project.getAmount());
        dto.setOutcomeProofPath(project.getOutcomeProofPath());
        dto.setStatus(project.getStatus());
        dto.setApprovalStatus(project.getApprovalStatus());
        dto.setRemarks(project.getRemarks());
        return dto;
    }
}
