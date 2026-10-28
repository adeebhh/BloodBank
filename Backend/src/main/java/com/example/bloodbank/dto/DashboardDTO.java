package com.example.bloodbank.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {

    private Long totalDonors;
    private Long totalBloodUnits;
    private Long totalBloodRequests;
    private Long totalCamps;
    private Long totalUsers;
}