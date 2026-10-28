package com.example.bloodbank.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.bloodbank.entity.Inventory;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
}