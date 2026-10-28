package com.example.bloodbank.service;

import org.springframework.stereotype.Service;

import com.example.bloodbank.dto.DashboardDTO;
import com.example.bloodbank.repository.BloodRequestRepository;
import com.example.bloodbank.repository.BloodUnitRepository;
import com.example.bloodbank.repository.CampRepository;
import com.example.bloodbank.repository.DonorRepository;
import com.example.bloodbank.repository.UserRepository;

@Service
public class DashboardService {

    private final DonorRepository donorRepository;
    private final BloodUnitRepository bloodUnitRepository;
    private final BloodRequestRepository bloodRequestRepository;
    private final CampRepository campRepository;
    private final UserRepository userRepository;

    public DashboardService(DonorRepository donorRepository,
                            BloodUnitRepository bloodUnitRepository,
                            BloodRequestRepository bloodRequestRepository,
                            CampRepository campRepository,
                            UserRepository userRepository) {

        this.donorRepository = donorRepository;
        this.bloodUnitRepository = bloodUnitRepository;
        this.bloodRequestRepository = bloodRequestRepository;
        this.campRepository = campRepository;
        this.userRepository = userRepository;
    }

    public DashboardDTO getDashboardData() {

        return new DashboardDTO(
                donorRepository.count(),
                bloodUnitRepository.count(),
                bloodRequestRepository.count(),
                campRepository.count(),
                userRepository.count()
        );
    }
}