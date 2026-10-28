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
import com.example.bloodbank.dto.BloodRequestDTO;
import com.example.bloodbank.entity.BloodRequest;
import com.example.bloodbank.service.BloodRequestService;
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/blood-requests")
public class BloodRequestController {

    private final BloodRequestService requestService;

    public BloodRequestController(BloodRequestService requestService) {
        this.requestService = requestService;
    }

    @PostMapping
    public BloodRequest addRequest(@RequestBody BloodRequestDTO dto) {
        return requestService.addRequest(dto);
    }

    @GetMapping
    public List<BloodRequest> getAllRequests() {
        return requestService.getAllRequests();
    }

    @GetMapping("/{id}")
    public BloodRequest getRequestById(@PathVariable Long id) {
        return requestService.getRequestById(id);
    }

    @PutMapping("/{id}")
    public BloodRequest updateRequest(@PathVariable Long id,
                                      @RequestBody BloodRequestDTO dto) {
        return requestService.updateRequest(id, dto);
    }

    @DeleteMapping("/{id}")
    public String deleteRequest(@PathVariable Long id) {
        return requestService.deleteRequest(id);
    }
}