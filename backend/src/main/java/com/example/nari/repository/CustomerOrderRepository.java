package com.example.nari.repository;

import com.example.nari.entity.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Long> {
    List<CustomerOrder> findByConsumerIdOrderByCreatedAtDesc(Long consumerId);
    List<CustomerOrder> findAllByOrderByCreatedAtDesc();
}
