package com.example.bloodbank.repository;

import com.example.bloodbank.entity.Donor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DonorRepository extends JpaRepository<Donor, Long> {

    @Query("""
            SELECT d.gender, COUNT(d)
            FROM Donor d
            GROUP BY d.gender
            """)
    List<Object[]> getDonorGenderReport();

    @Query("""
            SELECT d.bloodGroup, COUNT(d)
            FROM Donor d
            GROUP BY d.bloodGroup
            """)
    List<Object[]> getDonorBloodGroupReport();
}