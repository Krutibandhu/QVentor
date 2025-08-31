package com.code4cause.qventor.repository;

import com.code4cause.qventor.model.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WarehouseRepository extends JpaRepository<Warehouse,Long> {
    Optional<Warehouse> findByWarehouseName(String warehouseName);
}
