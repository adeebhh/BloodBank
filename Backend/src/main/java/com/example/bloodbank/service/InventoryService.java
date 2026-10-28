package com.example.bloodbank.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.bloodbank.dto.InventoryDTO;
import com.example.bloodbank.entity.BloodUnit;
import com.example.bloodbank.entity.Inventory;
import com.example.bloodbank.exception.ResourceNotFoundException;
import com.example.bloodbank.repository.BloodUnitRepository;
import com.example.bloodbank.repository.InventoryRepository;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final BloodUnitRepository bloodUnitRepository;

    public InventoryService(InventoryRepository inventoryRepository,
                            BloodUnitRepository bloodUnitRepository) {
        this.inventoryRepository = inventoryRepository;
        this.bloodUnitRepository = bloodUnitRepository;
    }

    public Inventory addInventory(InventoryDTO dto) {

        BloodUnit bloodUnit = bloodUnitRepository.findById(dto.getBloodUnitId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Blood Unit not found"));

        Inventory inventory = Inventory.builder()
                .availableUnits(dto.getAvailableUnits())
                .storageLocation(dto.getStorageLocation())
                .bloodUnit(bloodUnit)
                .build();

        return inventoryRepository.save(inventory);
    }

    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    public Inventory getInventoryById(Long id) {
        return inventoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Inventory not found"));
    }

    public Inventory updateInventory(Long id, InventoryDTO dto) {

        Inventory inventory = getInventoryById(id);

        BloodUnit bloodUnit = bloodUnitRepository.findById(dto.getBloodUnitId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Blood Unit not found"));

        inventory.setAvailableUnits(dto.getAvailableUnits());
        inventory.setStorageLocation(dto.getStorageLocation());
        inventory.setBloodUnit(bloodUnit);

        return inventoryRepository.save(inventory);
    }

    public String deleteInventory(Long id) {

        Inventory inventory = getInventoryById(id);

        inventoryRepository.delete(inventory);

        return "Inventory Deleted Successfully";
    }
}