package com.drims.repository;

import com.drims.entity.Publication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PublicationRepository extends JpaRepository<Publication, String> {
    List<Publication> findByFacultyId(String facultyId);
    Optional<Publication> findByFacultyIdAndTitleIgnoreCase(String facultyId, String title);
    boolean existsByFacultyIdAndTitleIgnoreCase(String facultyId, String title);
}
