package com.example.society.repository;

import com.example.society.entity.Guard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GuardRepository extends JpaRepository<Guard, Long> {
    Optional<Guard> findByUsername(String username);
}
