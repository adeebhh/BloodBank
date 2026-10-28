package com.example.bloodbank.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BloodRequestDTO {

    private String patientName;

    private String hospitalName;

    private String bloodGroup;

    private Integer unitsRequired;

    private String status;

    private Long bloodUnitId;
}