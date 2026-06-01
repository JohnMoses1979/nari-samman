package com.example.nari.repository;

import com.example.nari.entity.OrderDispatch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderDispatchRepository extends JpaRepository<OrderDispatch, Long> {
    Optional<OrderDispatch> findByOrderItemId(Long orderItemId);
    List<OrderDispatch> findAllByOrderByCreatedAtDesc();
}
