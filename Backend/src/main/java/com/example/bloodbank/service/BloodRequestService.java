package com.example.bloodbank.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.bloodbank.dto.BloodRequestDTO;
import com.example.bloodbank.entity.BloodRequest;
import com.example.bloodbank.entity.BloodUnit;
import com.example.bloodbank.exception.ResourceNotFoundException;
import com.example.bloodbank.repository.BloodRequestRepository;
import com.example.bloodbank.repository.BloodUnitRepository;

@Service
public class BloodRequestService {

    private final BloodRequestRepository requestRepository;
    private final BloodUnitRepository bloodUnitRepository;

    public BloodRequestService(BloodRequestRepository requestRepository,
                               BloodUnitRepository bloodUnitRepository) {
        this.requestRepository = requestRepository;
        this.bloodUnitRepository = bloodUnitRepository;
    }

    public BloodRequest addRequest(BloodRequestDTO dto) {

        BloodUnit bloodUnit = bloodUnitRepository.findById(dto.getBloodUnitId())
                .orElseThrow(() -> new ResourceNotFoundException("Blood Unit not found"));

        BloodRequest request = BloodRequest.builder()
                .patientName(dto.getPatientName())
                .hospitalName(dto.getHospitalName())
                .bloodGroup(dto.getBloodGroup())
                .unitsRequired(dto.getUnitsRequired())
                .status(dto.getStatus())
                .bloodUnit(bloodUnit)
                .build();

        return requestRepository.save(request);
    }

    public List<BloodRequest> getAllRequests() {
        return requestRepository.findAll();
    }

    public BloodRequest getRequestById(Long id) {
        return requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blood Request not found"));
    }

    public BloodRequest updateRequest(Long id, BloodRequestDTO dto) {

        BloodRequest request = getRequestById(id);

        BloodUnit bloodUnit = bloodUnitRepository.findById(dto.getBloodUnitId())
                .orElseThrow(() -> new ResourceNotFoundException("Blood Unit not found"));

        request.setPatientName(dto.getPatientName());
        request.setHospitalName(dto.getHospitalName());
        request.setBloodGroup(dto.getBloodGroup());
        request.setUnitsRequired(dto.getUnitsRequired());
        request.setStatus(dto.getStatus());
        request.setBloodUnit(bloodUnit);

        return requestRepository.save(request);
    }

    public String deleteRequest(Long id) {

        BloodRequest request = getRequestById(id);

        requestRepository.delete(request);

        return "Blood Request Deleted Successfully";
    }
}