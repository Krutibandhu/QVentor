package com.code4cause.qventor.service;

import com.code4cause.qventor.model.Admin;
import com.code4cause.qventor.model.Item;
import com.code4cause.qventor.model.Warehouse;
import com.code4cause.qventor.myexception.ResourceNotFoundException;
import com.code4cause.qventor.repository.WarehouseRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class WarehouseService {


    private final WarehouseRepository warehouseRepository;

    @Autowired
    public WarehouseService(WarehouseRepository warehouseRepository) {
        this.warehouseRepository = warehouseRepository;
    }

//    get warehouse by id
    public Warehouse getWarehouseById(Long id) {
        return warehouseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Warehouse not found with id: " + id));
    }

    @Transactional
    //Update Warehouse info through warehouse id
    public Warehouse updateWarehouse(Long id, Warehouse warehouse) {
        Warehouse updateWarehouse = warehouseRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("No warehouse found")
        );

        updateWarehouse.setWarehouseName(warehouse.getWarehouseName());
        updateWarehouse.setLocation(warehouse.getLocation());

        return warehouseRepository.save(updateWarehouse);
    }


    /**
     * Set warehouse active/inActive by Warehouse name
     * It makes it active if it's inactive or vice versa
     */
    @Transactional
    public Warehouse activateOrDeactivateWarehouse(String warehouseName) {
        Warehouse warehouse = warehouseRepository.findByWarehouseName(warehouseName).orElseThrow(
                () -> new ResourceNotFoundException("Warehouse not found with this name")
        );

        warehouse.setEnabled(!warehouse.isEnabled());

        return warehouseRepository.save(warehouse);
    }

    /**
     * Set warehouse active/inActive by Warehouse Id
     * It makes it active if it's inactive or vice versa
     */
    @Transactional
    public Warehouse activateOrDeactivateWarehouse(Long id) {
        Warehouse warehouse = warehouseRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Warehouse not found with this name")
        );

        warehouse.setEnabled(!warehouse.isEnabled());

        return warehouseRepository.save(warehouse);
    }

    @Transactional
    public void deleteWarehouse(Long id) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found"));

        // Break relationships
        warehouse.getItems().forEach(item -> item.getWarehouses().remove(warehouse));
        warehouse.getItems().clear();

        warehouseRepository.delete(warehouse);
    }

    public Set<Item> getItemsFromWarehouse(Long id) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found"));
        return warehouse.getItems();
    }

}
