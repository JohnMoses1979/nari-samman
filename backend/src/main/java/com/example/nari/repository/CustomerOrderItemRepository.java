package com.example.nari.repository;

import com.example.nari.entity.CustomerOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomerOrderItemRepository extends JpaRepository<CustomerOrderItem, Long> {
    List<CustomerOrderItem> findByVendorIdOrderByCreatedAtDesc(Long vendorId);
    List<CustomerOrderItem> findAllByOrderByCreatedAtDesc();
}
