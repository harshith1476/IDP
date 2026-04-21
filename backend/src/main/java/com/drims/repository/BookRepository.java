package com.drims.repository;

import com.drims.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, String> {
    List<Book> findByFacultyId(String facultyId);
    List<Book> findAll();
    List<Book> findByPublicationYear(Integer publicationYear);
    List<Book> findByFacultyIdAndPublicationYear(String facultyId, Integer publicationYear);
    List<Book> findByApprovalStatus(String approvalStatus);
    List<Book> findByApprovalStatusIn(List<String> approvalStatuses);
    long countByFacultyIdAndPublicationYear(String facultyId, Integer publicationYear);
}
