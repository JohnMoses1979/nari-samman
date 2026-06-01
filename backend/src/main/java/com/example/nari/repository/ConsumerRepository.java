package com.example.nari.repository;

import com.example.nari.entity.Consumer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ConsumerRepository extends JpaRepository<Consumer, Long> {

    Optional<Consumer> findByEmail(String email);

    boolean existsByEmail(String email);

    // ADD this method to the existing ConsumerRepository interface:
    Optional<Consumer> findByPhone(String phone);

    boolean existsByPhone(String phone);
}
        