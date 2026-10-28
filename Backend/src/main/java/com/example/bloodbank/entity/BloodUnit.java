package com.example.bloodbank.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "blood_units")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BloodUnit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bloodUnitId;

    private String bloodGroup;

    private Integer quantity;

    private LocalDate collectionDate;

    private LocalDate expiryDate;

    private String status;

    @ManyToOne
    @JoinColumn(name = "donor_id")
    @JsonIgnoreProperties("bloodUnits")
    private Donor donor;
}