package com.example.nari.dto;

import java.util.List;

public class VendorOrderResponse {
    private String id;
    private String buyer;
    private String item;
    private Integer qty;
    private Double amount;
    private String status;
    private String paymentStatus;
    private String date;
    private String consumerOrderId;
    private Long productId;
    private String image;
    private List<String> imageUrls;
    private String tracking;
    private String logisticsStatus;
    private String shgName;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getBuyer() { return buyer; }
    public void setBuyer(String buyer) { this.buyer = buyer; }
    public String getItem() { return item; }
    public void setItem(String item) { this.item = item; }
    public Integer getQty() { return qty; }
    public void setQty(Integer qty) { this.qty = qty; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public String getConsumerOrderId() { return consumerOrderId; }
    public void setConsumerOrderId(String consumerOrderId) { this.consumerOrderId = consumerOrderId; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
    public String getTracking() { return tracking; }
    public void setTracking(String tracking) { this.tracking = tracking; }
    public String getLogisticsStatus() { return logisticsStatus; }
    public void setLogisticsStatus(String logisticsStatus) { this.logisticsStatus = logisticsStatus; }
    public String getShgName() { return shgName; }
    public void setShgName(String shgName) { this.shgName = shgName; }
}
