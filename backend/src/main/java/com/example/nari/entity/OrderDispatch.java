package com.example.nari.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "order_dispatches")
public class OrderDispatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long orderId;
    private Long orderItemId;
    private Long vendorId;
    private String shgName;
    private String productNames;
    private String destination;
    private String buyer;
    private String status = "at_hub";
    private String vehicle;
    private String driver;
    private String eta = "Assigning delivery partner";
    private LocalDateTime dispatchDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public Long getOrderItemId() { return orderItemId; }
    public void setOrderItemId(Long orderItemId) { this.orderItemId = orderItemId; }
    public Long getVendorId() { return vendorId; }
    public void setVendorId(Long vendorId) { this.vendorId = vendorId; }
    public String getShgName() { return shgName; }
    public void setShgName(String shgName) { this.shgName = shgName; }
    public String getProductNames() { return productNames; }
    public void setProductNames(String productNames) { this.productNames = productNames; }
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    public String getBuyer() { return buyer; }
    public void setBuyer(String buyer) { this.buyer = buyer; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getVehicle() { return vehicle; }
    public void setVehicle(String vehicle) { this.vehicle = vehicle; }
    public String getDriver() { return driver; }
    public void setDriver(String driver) { this.driver = driver; }
    public String getEta() { return eta; }
    public void setEta(String eta) { this.eta = eta; }
    public LocalDateTime getDispatchDate() { return dispatchDate; }
    public void setDispatchDate(LocalDateTime dispatchDate) { this.dispatchDate = dispatchDate; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
