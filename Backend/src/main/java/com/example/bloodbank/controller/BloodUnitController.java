package com.example.bloodbank.controller;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import com.example.bloodbank.dto.BloodUnitDTO;
import com.example.bloodbank.entity.BloodUnit;
import com.example.bloodbank.service.BloodUnitService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/blood-units")
public class BloodUnitController {

    private final BloodUnitService service;

    public BloodUnitController(BloodUnitService service) {
        this.service = service;
    }

    @PostMapping
    public BloodUnit addBloodUnit(@RequestBody BloodUnitDTO dto) {
        return service.addBloodUnit(dto);
    }

    @GetMapping
    public List<BloodUnit> getAllBloodUnits() {
        return service.getAllBloodUnits();
    }

    @GetMapping("/{id}")
    public BloodUnit getBloodUnitById(@PathVariable Long id) {
        return service.getBloodUnitById(id);
    }

    @PutMapping("/{id}")
    public BloodUnit updateBloodUnit(@PathVariable Long id,
                                     @RequestBody BloodUnitDTO dto) {
        return service.updateBloodUnit(id, dto);
    }

    @DeleteMapping("/{id}")
    public String deleteBloodUnit(@PathVariable Long id) {
        return service.deleteBloodUnit(id);
    }
}