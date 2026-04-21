package com.drims.repository;

import com.drims.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByRegisterNumber(String registerNumber);
    boolean existsByEmail(String email);
    boolean existsByRegisterNumber(String registerNumber);
}

