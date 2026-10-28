package com.example.bloodbank.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReportDTO {

    private List<Object[]> bloodStockReport;
    private List<Object[]> bloodRequestReport;
    private List<Object[]> campReport;
    private List<Object[]> donorGenderReport;
    private List<Object[]> donorBloodGroupReport;
}