package com.example.nari.controller;

 
import com.example.nari.entity.Payment;
import com.example.nari.repository.PaymentRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    private final PaymentRepository paymentRepository;

    public PaymentController(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> request) {
        try {
            int amount = Integer.parseInt(request.get("amount").toString());
            String paymentMethod = request.get("paymentMethod") != null
                    ? request.get("paymentMethod").toString()
                    : "online";

            String deliveryAddress = request.get("deliveryAddress") != null
                    ? request.get("deliveryAddress").toString()
                    : "";

            RazorpayClient razorpayClient = new RazorpayClient(
                    razorpayKeyId,
                    razorpayKeySecret
            );

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amount * 100);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "receipt_" + System.currentTimeMillis());

            Order order = razorpayClient.orders.create(orderRequest);

            Payment payment = new Payment();
            payment.setRazorpayOrderId(order.get("id"));
            payment.setAmount(amount);
            payment.setCurrency("INR");
            payment.setPaymentMethod(paymentMethod);
            payment.setPaymentStatus("PENDING");
            payment.setDeliveryAddress(deliveryAddress);

            paymentRepository.save(payment);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "key", razorpayKeyId,
                    "orderId", order.get("id"),
                    "amount", order.get("amount"),
                    "currency", order.get("currency"),
                    "paymentDbId", payment.getId()
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> request) {
        try {
            String razorpayOrderId = request.get("razorpay_order_id");
            String razorpayPaymentId = request.get("razorpay_payment_id");
            String razorpaySignature = request.get("razorpay_signature");

            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", razorpayOrderId);
            options.put("razorpay_payment_id", razorpayPaymentId);
            options.put("razorpay_signature", razorpaySignature);

            boolean isValid = Utils.verifyPaymentSignature(options, razorpayKeySecret);

            Payment payment = paymentRepository
                    .findByRazorpayOrderId(razorpayOrderId)
                    .orElse(null);

            if (payment == null) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Payment record not found"
                ));
            }

            if (isValid) {
                payment.setRazorpayPaymentId(razorpayPaymentId);
                payment.setRazorpaySignature(razorpaySignature);
                payment.setPaymentStatus("SUCCESS");
                paymentRepository.save(payment);

                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Payment verified successfully"
                ));
            }

            payment.setPaymentStatus("FAILED");
            paymentRepository.save(payment);

            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Invalid payment signature"
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }
}
