package com.example.nari.dto;

public class OrderItemResponse {
    private String id;
    private Long productId;
    private Long vendorId;
    private String name;
    private Integer qty;
    private String unit;
    private Double price;
    private Double amount;
    private String image;
    private String status;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public Long getVendorId() { return vendorId; }
    public void setVendorId(Long vendorId) { this.vendorId = vendorId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Integer getQty() { return qty; }
    public void setQty(Integer qty) { this.qty = qty; }
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
