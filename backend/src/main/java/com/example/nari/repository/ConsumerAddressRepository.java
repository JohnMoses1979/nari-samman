package com.example.nari.repository;

import com.example.nari.entity.ConsumerAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConsumerAddressRepository extends JpaRepository<ConsumerAddress, Long> {

    List<ConsumerAddress> findByConsumerIdOrderByIsDefaultDescCreatedAtDesc(Long consumerId);

    Optional<ConsumerAddress> findByConsumerIdAndIsDefaultTrue(Long consumerId);

    boolean existsByConsumerIdAndId(Long consumerId, Long addressId);

    @Modifying
    @Query("UPDATE ConsumerAddress a SET a.isDefault = false WHERE a.consumer.id = :consumerId")
    void clearDefaultForConsumer(@Param("consumerId") Long consumerId);

    long countByConsumerId(Long consumerId);
}
