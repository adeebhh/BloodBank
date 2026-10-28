package com.example.bloodbank.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import com.example.bloodbank.dto.CampDTO;
import com.example.bloodbank.entity.Camp;
import com.example.bloodbank.service.CampService;
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/camps")
public class CampController {

    private final CampService service;

    public CampController(CampService service) {
        this.service = service;
    }

    @PostMapping
    public Camp addCamp(@RequestBody CampDTO dto) {
        return service.addCamp(dto);
    }

    @GetMapping
    public List<Camp> getAllCamps() {
        return service.getAllCamps();
    }

    @GetMapping("/{id}")
    public Camp getCampById(@PathVariable Long id) {
        return service.getCampById(id);
    }

    @PutMapping("/{id}")
    public Camp updateCamp(@PathVariable Long id,
                           @RequestBody CampDTO dto) {
        return service.updateCamp(id, dto);
    }

    @DeleteMapping("/{id}")
    public String deleteCamp(@PathVariable Long id) {
        return service.deleteCamp(id);
    }
}