package com.example.society.repository;

import com.example.society.entity.SocietyAdmin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SocietyAdminRepository extends JpaRepository<SocietyAdmin, Long> {
    Optional<SocietyAdmin> findByUsername(String username);
    Optional<SocietyAdmin> findByEmail(String email);
}
