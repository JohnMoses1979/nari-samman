package com.example.nari.dto;

import java.util.List;

public class DispatchResponse {
    private String id;
    private String orderId;
    private String consumerOrderId;
    private String vendorOrderId;
    private String shgName;
    private List<String> productNames;
    private String destination;
    private String buyer;
    private String vehicle;
    private String driver;
    private String status;
    private String dispatchDate;
    private String eta;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    public String getConsumerOrderId() { return consumerOrderId; }
    public void setConsumerOrderId(String consumerOrderId) { this.consumerOrderId = consumerOrderId; }
    public String getVendorOrderId() { return vendorOrderId; }
    public void setVendorOrderId(String vendorOrderId) { this.vendorOrderId = vendorOrderId; }
    public String getShgName() { return shgName; }
    public void setShgName(String shgName) { this.shgName = shgName; }
    public List<String> getProductNames() { return productNames; }
    public void setProductNames(List<String> productNames) { this.productNames = productNames; }
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    public String getBuyer() { return buyer; }
    public void setBuyer(String buyer) { this.buyer = buyer; }
    public String getVehicle() { return vehicle; }
    public void setVehicle(String vehicle) { this.vehicle = vehicle; }
    public String getDriver() { return driver; }
    public void setDriver(String driver) { this.driver = driver; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getDispatchDate() { return dispatchDate; }
    public void setDispatchDate(String dispatchDate) { this.dispatchDate = dispatchDate; }
    public String getEta() { return eta; }
    public void setEta(String eta) { this.eta = eta; }
}
