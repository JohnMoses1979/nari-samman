package com.example.nari.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.nari.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Consumer: only APPROVED products
    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.images WHERE p.status = 'APPROVED' ORDER BY p.createdAt DESC")
    List<Product> findAllApproved();

    // Consumer: APPROVED by category
    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.images WHERE p.status = 'APPROVED' AND p.category = :category ORDER BY p.createdAt DESC")
    List<Product> findApprovedByCategory(@Param("category") String category);

    // Vendor: own products (all statuses)
    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.images WHERE p.vendor.id = :vendorId ORDER BY p.createdAt DESC")
    List<Product> findByVendorId(@Param("vendorId") Long vendorId);

    // Admin: by status
    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.images LEFT JOIN FETCH p.vendor WHERE p.status = :status ORDER BY p.createdAt DESC")
    List<Product> findByStatus(@Param("status") String status);

    // Admin: all products with vendor info
    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.images LEFT JOIN FETCH p.vendor ORDER BY p.createdAt DESC")
    List<Product> findAllWithVendor();

    // Admin: count pending
    long countByStatus(String status);
}
