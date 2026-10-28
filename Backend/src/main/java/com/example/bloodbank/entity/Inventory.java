package com.example.bloodbank.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "inventory")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long inventoryId;

    private Integer availableUnits;

    private String storageLocation;

    @ManyToOne
    @JoinColumn(name = "blood_unit_id")
    @JsonIgnoreProperties("donor")
    private BloodUnit bloodUnit;
}