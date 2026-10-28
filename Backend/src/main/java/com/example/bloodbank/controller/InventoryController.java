package com.example.bloodbank.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import com.example.bloodbank.dto.InventoryDTO;
import com.example.bloodbank.entity.Inventory;
import com.example.bloodbank.service.InventoryService;
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @PostMapping
    public Inventory addInventory(@RequestBody InventoryDTO dto) {
        return inventoryService.addInventory(dto);
    }

    @GetMapping
    public List<Inventory> getAllInventory() {
        return inventoryService.getAllInventory();
    }

    @GetMapping("/{id}")
    public Inventory getInventoryById(@PathVariable Long id) {
        return inventoryService.getInventoryById(id);
    }

    @PutMapping("/{id}")
    public Inventory updateInventory(@PathVariable Long id,
                                     @RequestBody InventoryDTO dto) {
        return inventoryService.updateInventory(id, dto);
    }

    @DeleteMapping("/{id}")
    public String deleteInventory(@PathVariable Long id) {
        return inventoryService.deleteInventory(id);
    }
}