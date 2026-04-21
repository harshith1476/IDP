package com.drims.service;

import com.drims.dto.BookDTO;
import com.drims.entity.Book;
import com.drims.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookService {
    
    @Autowired
    private BookRepository bookRepository;
    
    public BookDTO createBook(String facultyId, BookDTO dto) {
        Book book = new Book();
        book.setFacultyId(facultyId);
        book.setBookTitle(dto.getBookTitle());
        book.setAuthors(dto.getAuthors());
        book.setCorrespondingAuthors(dto.getCorrespondingAuthors());
        book.setPublisher(dto.getPublisher());
        book.setIsbn(dto.getIsbn());
        book.setPublicationYear(dto.getPublicationYear());
        book.setRole(dto.getRole());
        book.setCategory(dto.getCategory());
        book.setStatus(dto.getStatus());
        book.setDoi(dto.getDoi());
        book.setVolume(dto.getVolume());
        book.setImpactFactor(dto.getImpactFactor());
        book.setJournalHIndex(dto.getJournalHIndex());
        book.setApprovalStatus("SUBMITTED");
        book.setBookCoverPath(dto.getBookCoverPath());
        book.setIsbnProofPath(dto.getIsbnProofPath());
        book.setCreatedAt(LocalDateTime.now());
        book.setUpdatedAt(LocalDateTime.now());
        
        book = bookRepository.save(book);
        return convertToDTO(book);
    }
    
    public BookDTO updateBook(String id, String facultyId, BookDTO dto) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));
        
        if (!book.getFacultyId().equals(facultyId)) {
            throw new RuntimeException("Unauthorized to update this book");
        }
        
        // Don't allow updates if already approved/locked
        if ("APPROVED".equals(book.getApprovalStatus()) || "LOCKED".equals(book.getApprovalStatus())) {
            throw new RuntimeException("Cannot update approved/locked book");
        }
        
        book.setBookTitle(dto.getBookTitle());
        book.setAuthors(dto.getAuthors());
        book.setCorrespondingAuthors(dto.getCorrespondingAuthors());
        book.setPublisher(dto.getPublisher());
        book.setIsbn(dto.getIsbn());
        book.setPublicationYear(dto.getPublicationYear());
        book.setRole(dto.getRole());
        book.setCategory(dto.getCategory());
        book.setStatus(dto.getStatus());
        book.setDoi(dto.getDoi());
        book.setVolume(dto.getVolume());
        book.setImpactFactor(dto.getImpactFactor());
        book.setJournalHIndex(dto.getJournalHIndex());
        if (dto.getBookCoverPath() != null) {
            book.setBookCoverPath(dto.getBookCoverPath());
        }
        if (dto.getIsbnProofPath() != null) {
            book.setIsbnProofPath(dto.getIsbnProofPath());
        }
        book.setUpdatedAt(LocalDateTime.now());
        
        book = bookRepository.save(book);
        return convertToDTO(book);
    }
    
    public List<BookDTO> getBooksByFaculty(String facultyId) {
        return bookRepository.findByFacultyId(facultyId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<BookDTO> getAllBooks() {
        return bookRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public void deleteBook(String id, String facultyId) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));
        
        if (!book.getFacultyId().equals(facultyId)) {
            throw new RuntimeException("Unauthorized to delete this book");
        }
        
        // Don't allow deletion if already approved/locked
        if ("APPROVED".equals(book.getApprovalStatus()) || "LOCKED".equals(book.getApprovalStatus())) {
            throw new RuntimeException("Cannot delete approved/locked book");
        }
        
        bookRepository.delete(book);
    }
    
    private BookDTO convertToDTO(Book book) {
        BookDTO dto = new BookDTO();
        dto.setId(book.getId());
        dto.setBookTitle(book.getBookTitle());
        dto.setAuthors(book.getAuthors());
        dto.setCorrespondingAuthors(book.getCorrespondingAuthors());
        dto.setPublisher(book.getPublisher());
        dto.setIsbn(book.getIsbn());
        dto.setPublicationYear(book.getPublicationYear());
        dto.setRole(book.getRole());
        dto.setCategory(book.getCategory());
        dto.setStatus(book.getStatus());
        dto.setDoi(book.getDoi());
        dto.setVolume(book.getVolume());
        dto.setImpactFactor(book.getImpactFactor());
        dto.setJournalHIndex(book.getJournalHIndex());
        dto.setApprovalStatus(book.getApprovalStatus());
        dto.setRemarks(book.getRemarks());
        dto.setBookCoverPath(book.getBookCoverPath());
        dto.setIsbnProofPath(book.getIsbnProofPath());
        return dto;
    }
}
