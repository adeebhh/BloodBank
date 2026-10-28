package com.example.bloodbank.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BloodUnitDTO {

    private String bloodGroup;

    private Integer quantity;

    private LocalDate collectionDate;

    private LocalDate expiryDate;

    private String status;

    private Long donorId;
}