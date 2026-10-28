package com.example.bloodbank.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.bloodbank.entity.BloodUnit;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface BloodUnitRepository extends JpaRepository<BloodUnit, Long> {
    @Query("""
SELECT b.bloodGroup, COUNT(b)
FROM BloodUnit b
GROUP BY b.bloodGroup
""")
List<Object[]> getBloodStockReport();
}
