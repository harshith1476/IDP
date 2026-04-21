package com.drims.repository;

import com.drims.entity.BookChapter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookChapterRepository extends JpaRepository<BookChapter, String> {
    List<BookChapter> findByFacultyId(String facultyId);
    List<BookChapter> findAll();
    List<BookChapter> findByYear(Integer year);
    List<BookChapter> findByFacultyIdAndYear(String facultyId, Integer year);
    List<BookChapter> findByApprovalStatus(String approvalStatus);
    List<BookChapter> findByApprovalStatusIn(List<String> approvalStatuses);
    long countByFacultyIdAndYear(String facultyId, Integer year);
}

