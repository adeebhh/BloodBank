package com.example.bloodbank.service;

import com.example.bloodbank.dto.BloodUnitDTO;
import com.example.bloodbank.entity.BloodUnit;
import com.example.bloodbank.entity.Donor;
import com.example.bloodbank.exception.ResourceNotFoundException;
import com.example.bloodbank.repository.BloodUnitRepository;
import com.example.bloodbank.repository.DonorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BloodUnitService {

    private final BloodUnitRepository repository;
    private final DonorRepository donorRepository;

    public BloodUnitService(BloodUnitRepository repository,
                            DonorRepository donorRepository) {
        this.repository = repository;
        this.donorRepository = donorRepository;
    }

    public BloodUnit addBloodUnit(BloodUnitDTO dto) {

        Donor donor = donorRepository.findById(dto.getDonorId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Donor not found"));

        BloodUnit bloodUnit = BloodUnit.builder()
                .bloodGroup(dto.getBloodGroup())
                .quantity(dto.getQuantity())
                .collectionDate(dto.getCollectionDate())
                .expiryDate(dto.getExpiryDate())
                .status(dto.getStatus())
                .donor(donor)
                .build();

        return repository.save(bloodUnit);
    }

    public List<BloodUnit> getAllBloodUnits() {
        return repository.findAll();
    }

    public BloodUnit getBloodUnitById(Long id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Blood Unit not found"));
    }

    public BloodUnit updateBloodUnit(Long id, BloodUnitDTO dto) {

        BloodUnit bloodUnit = getBloodUnitById(id);

        Donor donor = donorRepository.findById(dto.getDonorId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Donor not found"));

        bloodUnit.setBloodGroup(dto.getBloodGroup());
        bloodUnit.setQuantity(dto.getQuantity());
        bloodUnit.setCollectionDate(dto.getCollectionDate());
        bloodUnit.setExpiryDate(dto.getExpiryDate());
        bloodUnit.setStatus(dto.getStatus());
        bloodUnit.setDonor(donor);

        return repository.save(bloodUnit);
    }

    public String deleteBloodUnit(Long id) {

        BloodUnit bloodUnit = getBloodUnitById(id);

        repository.delete(bloodUnit);

        return "Blood Unit Deleted Successfully";
    }
}