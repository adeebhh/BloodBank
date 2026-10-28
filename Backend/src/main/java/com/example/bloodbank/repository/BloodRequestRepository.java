package com.example.bloodbank.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.bloodbank.entity.BloodRequest;
import org.springframework.data.jpa.repository.Query;
public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {
    @Query("""
SELECT b.status, COUNT(b)
FROM BloodRequest b
GROUP BY b.status
""")
List<Object[]> getBloodRequestReport();
}
