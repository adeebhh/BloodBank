package com.example.bloodbank.service;

import com.example.bloodbank.dto.DonorDTO;
import com.example.bloodbank.entity.Camp;
import com.example.bloodbank.entity.Donor;
import com.example.bloodbank.exception.ResourceNotFoundException;
import com.example.bloodbank.repository.CampRepository;
import com.example.bloodbank.repository.DonorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DonorService {

    private final DonorRepository donorRepository;
    private final CampRepository campRepository;

    public DonorService(DonorRepository donorRepository,
                        CampRepository campRepository) {
        this.donorRepository = donorRepository;
        this.campRepository = campRepository;
    }

    public Donor addDonor(DonorDTO donorDTO) {

        Camp camp = campRepository.findById(donorDTO.getCampId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Camp not found"));

        Donor donor = Donor.builder()
                .fullName(donorDTO.getFullName())
                .email(donorDTO.getEmail())
                .phoneNumber(donorDTO.getPhoneNumber())
                .bloodGroup(donorDTO.getBloodGroup())
                .gender(donorDTO.getGender())
                .age(donorDTO.getAge())
                .address(donorDTO.getAddress())
                .camp(camp)
                .build();

        return donorRepository.save(donor);
    }

    public List<Donor> getAllDonors() {
        return donorRepository.findAll();
    }

    public Donor getDonorById(Long id) {

        return donorRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Donor not found"));
    }

    public Donor updateDonor(Long id, DonorDTO donorDTO) {

        Donor donor = getDonorById(id);

        Camp camp = campRepository.findById(donorDTO.getCampId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Camp not found"));

        donor.setFullName(donorDTO.getFullName());
        donor.setEmail(donorDTO.getEmail());
        donor.setPhoneNumber(donorDTO.getPhoneNumber());
        donor.setBloodGroup(donorDTO.getBloodGroup());
        donor.setGender(donorDTO.getGender());
        donor.setAge(donorDTO.getAge());
        donor.setAddress(donorDTO.getAddress());
        donor.setCamp(camp);

        return donorRepository.save(donor);
    }

    public String deleteDonor(Long id) {

        Donor donor = getDonorById(id);

        donorRepository.delete(donor);

        return "Donor deleted successfully";
    }
}