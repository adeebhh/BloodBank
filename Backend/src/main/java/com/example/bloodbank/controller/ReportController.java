package com.example.bloodbank.controller;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import com.example.bloodbank.dto.ReportDTO;
import com.example.bloodbank.service.ReportService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping
    public ReportDTO generateReport() {
        return reportService.generateReport();
    }
}