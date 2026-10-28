package com.example.bloodbank.service;
import org.springframework.stereotype.Service;

import com.example.bloodbank.dto.ReportDTO;
import com.example.bloodbank.repository.BloodRequestRepository;
import com.example.bloodbank.repository.BloodUnitRepository;
import com.example.bloodbank.repository.CampRepository;
import com.example.bloodbank.repository.DonorRepository;
@Service
public class ReportService {
    private final BloodUnitRepository bloodUnitRepository;
    private final BloodRequestRepository bloodRequestRepository;
    private final CampRepository campRepository;
    private final DonorRepository donorRepository;

    public ReportService(BloodUnitRepository bloodUnitRepository,
                         BloodRequestRepository bloodRequestRepository,
                         CampRepository campRepository,
                         DonorRepository donorRepository) {

        this.bloodUnitRepository = bloodUnitRepository;
        this.bloodRequestRepository = bloodRequestRepository;
        this.campRepository = campRepository;
        this.donorRepository = donorRepository;
    }
    public ReportDTO generateReport() {

        return new ReportDTO(
                bloodUnitRepository.getBloodStockReport(),
                bloodRequestRepository.getBloodRequestReport(),
                campRepository.getCampReport(),
                donorRepository.getDonorGenderReport(),
                donorRepository.getDonorBloodGroupReport()
        );
    }
}