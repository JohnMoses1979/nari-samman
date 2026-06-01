package com.example.nari.service;

import com.example.nari.dto.AddressRequest;
import com.example.nari.dto.AddressResponse;
import com.example.nari.entity.Consumer;
import com.example.nari.entity.ConsumerAddress;
import com.example.nari.repository.ConsumerAddressRepository;
import com.example.nari.repository.ConsumerRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddressService {

    private static final int MAX_ADDRESSES = 10;

    private final ConsumerAddressRepository addressRepository;
    private final ConsumerRepository consumerRepository;

    public AddressService(ConsumerAddressRepository addressRepository,
            ConsumerRepository consumerRepository) {
        this.addressRepository = addressRepository;
        this.consumerRepository = consumerRepository;
    }

    // ─── Get all addresses for a consumer ─────────────────────────────────────
    public List<AddressResponse> getAddresses(Long consumerId) {
        return addressRepository
                .findByConsumerIdOrderByIsDefaultDescCreatedAtDesc(consumerId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ─── Add new address ──────────────────────────────────────────────────────
    @Transactional
    public AddressResponse addAddress(Long consumerId, AddressRequest request) {
        Consumer consumer = consumerRepository.findById(consumerId)
                .orElseThrow(() -> new IllegalArgumentException("Consumer not found"));

        long existingCount = addressRepository.countByConsumerId(consumerId);
        if (existingCount >= MAX_ADDRESSES) {
            throw new IllegalStateException("Maximum of " + MAX_ADDRESSES + " addresses allowed");
        }

        // First address is automatically default
        boolean shouldBeDefault = existingCount == 0;
        if (shouldBeDefault) {
            addressRepository.clearDefaultForConsumer(consumerId);
        }

        ConsumerAddress address = new ConsumerAddress();
        address.setConsumer(consumer);
        address.setFullName(request.getFullName().trim());
        address.setPhoneNumber(request.getPhoneNumber().trim());
        address.setAddressLine(request.getAddressLine().trim());
        address.setLandmark(request.getLandmark() != null ? request.getLandmark().trim() : null);
        address.setCity(request.getCity().trim());
        address.setState(request.getState().trim());
        address.setPincode(request.getPincode().trim());
        address.setAddressType(request.getAddressType().trim());
        address.setIsDefault(shouldBeDefault);

        return toResponse(addressRepository.save(address));
    }

    // ─── Update address ───────────────────────────────────────────────────────
    @Transactional
    public AddressResponse updateAddress(Long consumerId, Long addressId, AddressRequest request) {
        ConsumerAddress address = findOwnedAddress(consumerId, addressId);

        address.setFullName(request.getFullName().trim());
        address.setPhoneNumber(request.getPhoneNumber().trim());
        address.setAddressLine(request.getAddressLine().trim());
        address.setLandmark(request.getLandmark() != null ? request.getLandmark().trim() : null);
        address.setCity(request.getCity().trim());
        address.setState(request.getState().trim());
        address.setPincode(request.getPincode().trim());
        address.setAddressType(request.getAddressType().trim());

        return toResponse(addressRepository.save(address));
    }

    // ─── Delete address ───────────────────────────────────────────────────────
    @Transactional
    public void deleteAddress(Long consumerId, Long addressId) {
        ConsumerAddress address = findOwnedAddress(consumerId, addressId);
        boolean wasDefault = Boolean.TRUE.equals(address.getIsDefault());
        addressRepository.delete(address);

        // If we deleted the default, promote the most recently added address
        if (wasDefault) {
            List<ConsumerAddress> remaining = addressRepository
                    .findByConsumerIdOrderByIsDefaultDescCreatedAtDesc(consumerId);
            if (!remaining.isEmpty()) {
                remaining.get(0).setIsDefault(true);
                addressRepository.save(remaining.get(0));
            }
        }
    }

    // ─── Set default address ──────────────────────────────────────────────────
    @Transactional
    public AddressResponse setDefault(Long consumerId, Long addressId) {
        findOwnedAddress(consumerId, addressId); // ownership check

        // Clear all existing defaults for this consumer first
        addressRepository.clearDefaultForConsumer(consumerId);

        // Set the chosen address as default
        ConsumerAddress address = addressRepository.findById(addressId)
                .orElseThrow(() -> new IllegalArgumentException("Address not found"));
        address.setIsDefault(true);

        return toResponse(addressRepository.save(address));
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────
    private ConsumerAddress findOwnedAddress(Long consumerId, Long addressId) {
        ConsumerAddress address = addressRepository.findById(addressId)
                .orElseThrow(() -> new IllegalArgumentException("Address not found"));
        if (!address.getConsumer().getId().equals(consumerId)) {
            throw new SecurityException("Access denied");
        }
        return address;
    }

    private AddressResponse toResponse(ConsumerAddress a) {
        return new AddressResponse(
                a.getId(),
                a.getConsumer().getId(),
                a.getFullName(),
                a.getPhoneNumber(),
                a.getAddressLine(),
                a.getLandmark(),
                a.getCity(),
                a.getState(),
                a.getPincode(),
                a.getAddressType(),
                a.getIsDefault(),
                a.getCreatedAt()
        );
    }
}
