package com.example.bloodbank.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.bloodbank.dto.CampDTO;
import com.example.bloodbank.entity.Camp;
import com.example.bloodbank.exception.ResourceNotFoundException;
import com.example.bloodbank.repository.CampRepository;

@Service
public class CampService {

    private final CampRepository repository;

    public CampService(CampRepository repository) {
        this.repository = repository;
    }

    public Camp addCamp(CampDTO dto) {

        Camp camp = Camp.builder()
                .campName(dto.getCampName())
                .location(dto.getLocation())
                .campDate(dto.getCampDate())
                .organizer(dto.getOrganizer())
                .build();

        return repository.save(camp);
    }

    public List<Camp> getAllCamps() {
        return repository.findAll();
    }

    public Camp getCampById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Camp not found"));
    }

    public Camp updateCamp(Long id, CampDTO dto) {

        Camp camp = getCampById(id);

        camp.setCampName(dto.getCampName());
        camp.setLocation(dto.getLocation());
        camp.setCampDate(dto.getCampDate());
        camp.setOrganizer(dto.getOrganizer());

        return repository.save(camp);
    }

    public String deleteCamp(Long id) {

        Camp camp = getCampById(id);

        repository.delete(camp);

        return "Camp Deleted Successfully";
    }
}