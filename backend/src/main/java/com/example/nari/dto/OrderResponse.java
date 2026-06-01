package com.example.nari.dto;

import java.util.List;

public class OrderResponse {
    private String id;
    private String date;
    private String status;
    private String paymentStatus;
    private List<OrderItemResponse> items;
    private Double total;
    private String address;
    private String tracking;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
    public List<OrderItemResponse> getItems() { return items; }
    public void setItems(List<OrderItemResponse> items) { this.items = items; }
    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getTracking() { return tracking; }
    public void setTracking(String tracking) { this.tracking = tracking; }
}
