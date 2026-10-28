package com.example.bloodbank.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InventoryDTO {

    private Integer availableUnits;

    private String storageLocation;

    private Long bloodUnitId;
}
