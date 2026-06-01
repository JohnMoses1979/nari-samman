package com.example.nari.service;

import com.example.nari.dto.DispatchResponse;
import com.example.nari.dto.OrderCreateRequest;
import com.example.nari.dto.OrderItemRequest;
import com.example.nari.dto.OrderItemResponse;
import com.example.nari.dto.OrderResponse;
import com.example.nari.dto.VendorOrderResponse;
import com.example.nari.entity.CustomerOrder;
import com.example.nari.entity.CustomerOrderItem;
import com.example.nari.entity.OrderDispatch;
import com.example.nari.entity.Product;
import com.example.nari.repository.CustomerOrderItemRepository;
import com.example.nari.repository.CustomerOrderRepository;
import com.example.nari.repository.OrderDispatchRepository;
import com.example.nari.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final Map<String, String> TRACKING = Map.of(
            "confirmed", "Order confirmed - vendor is preparing your items",
            "packed", "Items packed by SHG and ready for quality checking",
            "sent_to_logistics", "Handed to IS&SF logistics hub for admin quality checking",
            "shipped", "Your order has been dispatched to the delivery address",
            "delivered", "Delivered successfully - thank you for your purchase"
    );

    private final CustomerOrderRepository orderRepo;
    private final CustomerOrderItemRepository itemRepo;
    private final OrderDispatchRepository dispatchRepo;
    private final ProductRepository productRepo;

    public OrderService(CustomerOrderRepository orderRepo,
            CustomerOrderItemRepository itemRepo,
            OrderDispatchRepository dispatchRepo,
            ProductRepository productRepo) {
        this.orderRepo = orderRepo;
        this.itemRepo = itemRepo;
        this.dispatchRepo = dispatchRepo;
        this.productRepo = productRepo;
    }

    @Transactional
    public OrderResponse createOrder(Long consumerId, OrderCreateRequest request) {
        validateCreateRequest(request);

        CustomerOrder order = new CustomerOrder();
        order.setConsumerId(consumerId);
        order.setBuyerName(blankToDefault(request.getBuyerName(), "Consumer"));
        order.setBuyerPhone(request.getBuyerPhone());
        order.setDeliveryAddress(request.getDeliveryAddress().trim());
        order.setPaymentMethod(blankToDefault(request.getPaymentMethod(), "UPI"));
        order.setPaymentStatus(blankToDefault(request.getPaymentStatus(), "paid").toLowerCase());
        order.setPaymentReference(request.getPaymentReference());
        order.setStatus("confirmed");
        order.setTracking(TRACKING.get("confirmed"));

        double total = 0.0;
        for (OrderItemRequest itemRequest : request.getItems()) {
            CustomerOrderItem item = buildOrderItem(order, itemRequest);
            total += item.getAmount();
            order.getItems().add(item);
        }

        order.setTotalAmount(request.getTotalAmount() != null && request.getTotalAmount() > 0 ? request.getTotalAmount() : total);
        return toOrderResponse(orderRepo.save(order));
    }

    public List<OrderResponse> getConsumerOrders(Long consumerId) {
        return orderRepo.findByConsumerIdOrderByCreatedAtDesc(consumerId)
                .stream()
                .map(this::toOrderResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getAllConsumerOrders() {
        return orderRepo.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toOrderResponse)
                .collect(Collectors.toList());
    }

    public List<VendorOrderResponse> getVendorOrders(Long vendorId) {
        return itemRepo.findByVendorIdOrderByCreatedAtDesc(vendorId)
                .stream()
                .map(this::toVendorOrderResponse)
                .collect(Collectors.toList());
    }

    public List<VendorOrderResponse> getAllVendorOrders() {
        return itemRepo.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toVendorOrderResponse)
                .collect(Collectors.toList());
    }

    public List<DispatchResponse> getDispatches() {
        return dispatchRepo.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toDispatchResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public VendorOrderResponse markPacked(Long vendorId, String vendorOrderId) {
        CustomerOrderItem item = findVendorItem(vendorId, vendorOrderId);
        if (!"confirmed".equals(item.getStatus())) {
            throw new IllegalArgumentException("Only confirmed orders can be marked as packed.");
        }
        item.setStatus("packed");
        item.setTracking(TRACKING.get("packed"));
        item.setPackedAt(LocalDateTime.now());
        refreshParentOrderStatus(item.getOrder());
        return toVendorOrderResponse(itemRepo.save(item));
    }

    @Transactional
    public VendorOrderResponse sendToLogistics(Long vendorId, String vendorOrderId) {
        CustomerOrderItem item = findVendorItem(vendorId, vendorOrderId);
        if (!"packed".equals(item.getStatus())) {
            throw new IllegalArgumentException("Pack the order before sending it to logistics.");
        }
        item.setStatus("sent_to_logistics");
        item.setLogisticsStatus("at_hub");
        item.setTracking(TRACKING.get("sent_to_logistics"));
        item.setSentToLogisticsAt(LocalDateTime.now());

        dispatchRepo.findByOrderItemId(item.getId()).orElseGet(() -> {
            OrderDispatch dispatch = new OrderDispatch();
            dispatch.setOrderId(item.getOrder().getId());
            dispatch.setOrderItemId(item.getId());
            dispatch.setVendorId(item.getVendorId());
            dispatch.setShgName(item.getShgName());
            dispatch.setProductNames(item.getProductName() + " x" + item.getQuantity());
            dispatch.setDestination(item.getOrder().getDeliveryAddress());
            dispatch.setBuyer(item.getOrder().getBuyerName());
            dispatch.setStatus("at_hub");
            dispatch.setEta("Assigning delivery partner");
            return dispatchRepo.save(dispatch);
        });

        refreshParentOrderStatus(item.getOrder());
        return toVendorOrderResponse(itemRepo.save(item));
    }

    @Transactional
    public DispatchResponse updateDispatchStatus(String dispatchId, String status) {
        if (!List.of("at_hub", "dispatched", "in_transit", "delivered").contains(status)) {
            throw new IllegalArgumentException("Invalid dispatch status.");
        }

        OrderDispatch dispatch = dispatchRepo.findById(parseId(dispatchId))
                .orElseThrow(() -> new IllegalArgumentException("Dispatch not found."));
        CustomerOrderItem item = itemRepo.findById(dispatch.getOrderItemId())
                .orElseThrow(() -> new IllegalArgumentException("Order item not found."));

        dispatch.setStatus(status);
        if (List.of("dispatched", "in_transit", "delivered").contains(status) && dispatch.getDispatchDate() == null) {
            dispatch.setDispatchDate(LocalDateTime.now());
        }
        dispatch.setEta(status.equals("delivered") ? "Delivered " + DATE_FMT.format(LocalDateTime.now()) : status.equals("at_hub") ? "Assigning delivery partner" : "On the way");

        String vendorStatus = status.equals("at_hub") ? "sent_to_logistics" : status.equals("delivered") ? "delivered" : "shipped";
        item.setStatus(vendorStatus);
        item.setLogisticsStatus(status);
        item.setTracking(TRACKING.get(vendorStatus));
        if ("delivered".equals(vendorStatus)) {
            item.setPaymentStatus("pending_payment");
        }
        refreshParentOrderStatus(item.getOrder());
        itemRepo.save(item);
        return toDispatchResponse(dispatchRepo.save(dispatch));
    }

    private CustomerOrderItem buildOrderItem(CustomerOrder order, OrderItemRequest request) {
        if (request.getProductId() == null) {
            throw new IllegalArgumentException("Product id is required.");
        }

        Product product = productRepo.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + request.getProductId()));

        Integer qty = request.getQuantity() != null && request.getQuantity() > 0 ? request.getQuantity() : 1;
        Double price = request.getPrice() != null && request.getPrice() > 0 ? request.getPrice() : product.getSellingPrice();

        CustomerOrderItem item = new CustomerOrderItem();
        item.setOrder(order);
        item.setProductId(product.getId());
        item.setVendorId(product.getVendor().getId());
        item.setShgName(product.getVendor().getShgName());
        item.setProductName(blankToDefault(request.getName(), product.getName()));
        item.setQuantity(qty);
        item.setUnit(blankToDefault(request.getUnit(), product.getUnit()));
        item.setPrice(price);
        item.setAmount(price * qty);
        item.setImageUrl(firstNonBlank(request.getImageUrl(), primaryImage(product)));
        item.setStatus("confirmed");
        item.setPaymentStatus(order.getPaymentStatus());
        item.setTracking(TRACKING.get("confirmed"));
        return item;
    }

    private void validateCreateRequest(OrderCreateRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Order request is required.");
        }
        if (request.getDeliveryAddress() == null || request.getDeliveryAddress().isBlank()) {
            throw new IllegalArgumentException("Delivery address is required.");
        }
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Cart is empty.");
        }
    }

    private CustomerOrderItem findVendorItem(Long vendorId, String vendorOrderId) {
        CustomerOrderItem item = itemRepo.findById(parseId(vendorOrderId))
                .orElseThrow(() -> new IllegalArgumentException("Vendor order not found."));
        if (!Objects.equals(item.getVendorId(), vendorId)) {
            throw new SecurityException("Access denied - this order belongs to another vendor.");
        }
        return item;
    }

    private void refreshParentOrderStatus(CustomerOrder order) {
        List<CustomerOrderItem> items = order.getItems();
        if (items == null || items.isEmpty()) {
            return;
        }
        if (items.stream().allMatch(i -> "delivered".equals(i.getStatus()))) {
            order.setStatus("delivered");
            order.setPaymentStatus("paid");
        } else if (items.stream().anyMatch(i -> "shipped".equals(i.getStatus()))) {
            order.setStatus("shipped");
        } else if (items.stream().anyMatch(i -> "sent_to_logistics".equals(i.getStatus()))) {
            order.setStatus("packed");
        } else if (items.stream().allMatch(i -> "packed".equals(i.getStatus()))) {
            order.setStatus("packed");
        } else {
            order.setStatus("confirmed");
        }
        order.setTracking(TRACKING.getOrDefault(order.getStatus(), TRACKING.get("confirmed")));
        orderRepo.save(order);
    }

    private OrderResponse toOrderResponse(CustomerOrder order) {
        OrderResponse response = new OrderResponse();
        response.setId("ord" + order.getId());
        response.setDate(formatDate(order.getCreatedAt()));
        response.setStatus(order.getStatus());
        response.setPaymentStatus(order.getPaymentStatus());
        response.setTotal(order.getTotalAmount());
        response.setAddress(order.getDeliveryAddress());
        response.setTracking(order.getTracking());
        response.setItems(order.getItems().stream().map(this::toOrderItemResponse).collect(Collectors.toList()));
        return response;
    }

    private OrderItemResponse toOrderItemResponse(CustomerOrderItem item) {
        OrderItemResponse response = new OrderItemResponse();
        response.setId("oi" + item.getId());
        response.setProductId(item.getProductId());
        response.setVendorId(item.getVendorId());
        response.setName(item.getProductName());
        response.setQty(item.getQuantity());
        response.setUnit(item.getUnit());
        response.setPrice(item.getPrice());
        response.setAmount(item.getAmount());
        response.setImage(item.getImageUrl());
        response.setStatus(item.getStatus());
        return response;
    }

    private VendorOrderResponse toVendorOrderResponse(CustomerOrderItem item) {
        VendorOrderResponse response = new VendorOrderResponse();
        response.setId("vo" + item.getId());
        response.setBuyer(item.getOrder().getBuyerName());
        response.setItem(item.getProductName());
        response.setQty(item.getQuantity());
        response.setAmount(item.getAmount());
        response.setStatus(item.getStatus());
        response.setPaymentStatus(item.getPaymentStatus());
        response.setDate(formatDate(item.getCreatedAt()));
        response.setConsumerOrderId("ord" + item.getOrder().getId());
        response.setProductId(item.getProductId());
        response.setImage(item.getImageUrl());
        response.setImageUrls(item.getImageUrl() == null ? new ArrayList<>() : List.of(item.getImageUrl()));
        response.setTracking(item.getTracking());
        response.setLogisticsStatus(item.getLogisticsStatus());
        response.setShgName(item.getShgName());
        return response;
    }

    private DispatchResponse toDispatchResponse(OrderDispatch dispatch) {
        DispatchResponse response = new DispatchResponse();
        response.setId("d" + dispatch.getId());
        response.setOrderId("ord" + dispatch.getOrderId());
        response.setConsumerOrderId("ord" + dispatch.getOrderId());
        response.setVendorOrderId("vo" + dispatch.getOrderItemId());
        response.setShgName(dispatch.getShgName());
        response.setProductNames(Arrays.stream(blankToDefault(dispatch.getProductNames(), "").split(",")).filter(s -> !s.isBlank()).map(String::trim).collect(Collectors.toList()));
        response.setDestination(dispatch.getDestination());
        response.setBuyer(dispatch.getBuyer());
        response.setVehicle(dispatch.getVehicle());
        response.setDriver(dispatch.getDriver());
        response.setStatus(dispatch.getStatus());
        response.setDispatchDate(formatDate(dispatch.getDispatchDate()));
        response.setEta(dispatch.getEta());
        return response;
    }

    private Long parseId(String id) {
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("Invalid id.");
        }
        String digits = id.replaceAll("\\D+", "");
        if (digits.isBlank()) {
            throw new IllegalArgumentException("Invalid id.");
        }
        return Long.parseLong(digits);
    }

    private String formatDate(LocalDateTime date) {
        return date == null ? null : DATE_FMT.format(date);
    }

    private String blankToDefault(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value.trim();
    }

    private String firstNonBlank(String first, String second) {
        return first != null && !first.isBlank() ? first : second;
    }

    private String primaryImage(Product product) {
        if (product.getImages() == null || product.getImages().isEmpty()) {
            return null;
        }
        return product.getImages().stream()
                .sorted((a, b) -> Integer.compare(a.getSortOrder() == null ? 0 : a.getSortOrder(), b.getSortOrder() == null ? 0 : b.getSortOrder()))
                .map(img -> img.getFilePath())
                .filter(Objects::nonNull)
                .findFirst()
                .orElse(null);
    }
}
