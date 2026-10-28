package com.example.bloodbank.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DonorDTO {

    private String fullName;
    private String email;
    private String phoneNumber;
    private String bloodGroup;
    private String gender;
    private Integer age;
    private String address;

    private Long campId;
}