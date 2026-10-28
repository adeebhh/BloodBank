package com.example.bloodbank.controller;
import com.example.bloodbank.dto.DonorDTO;
import com.example.bloodbank.entity.Donor;
import com.example.bloodbank.service.DonorService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/donors")
public class DonorController {

    private final DonorService donorService;

    public DonorController(DonorService donorService) {
        this.donorService = donorService;
    }

    @PostMapping
    public Donor addDonor(@RequestBody DonorDTO donorDTO) {
        return donorService.addDonor(donorDTO);
    }

    @GetMapping
    public List<Donor> getAllDonors() {
        return donorService.getAllDonors();
    }

    @GetMapping("/{id}")
    public Donor getDonorById(@PathVariable Long id) {
        return donorService.getDonorById(id);
    }

    @PutMapping("/{id}")
    public Donor updateDonor(@PathVariable Long id,
                             @RequestBody DonorDTO donorDTO) {
        return donorService.updateDonor(id, donorDTO);
    }

    @DeleteMapping("/{id}")
    public String deleteDonor(@PathVariable Long id) {
        return donorService.deleteDonor(id);
    }
}