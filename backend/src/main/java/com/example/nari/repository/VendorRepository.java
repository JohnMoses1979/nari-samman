package com.example.nari.repository;

import com.example.nari.entity.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {

    Optional<Vendor> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByMobileNumber(String mobileNumber);
    // ADD to VendorRepository if not already present:

    Optional<Vendor> findByMobileNumber(String mobileNumber);
}
