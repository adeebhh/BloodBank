package com.example.bloodbank.entity;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "donors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Donor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long donorId;

    private String fullName;

    @Column(unique = true)
    private String email;

    private String phoneNumber;

    private String bloodGroup;

    private String gender;

    private Integer age;

    private String address;

    @ManyToOne
    @JoinColumn(name = "camp_id")
    @JsonIgnoreProperties("donors")
    private Camp camp;

    @OneToMany(mappedBy = "donor", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<BloodUnit> bloodUnits;
}