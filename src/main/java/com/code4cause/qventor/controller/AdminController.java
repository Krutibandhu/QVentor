package com.code4cause.qventor.controller;

import com.code4cause.qventor.model.Admin;
import com.code4cause.qventor.model.ExportRecord;
import com.code4cause.qventor.model.ImportRecord;
import com.code4cause.qventor.model.Warehouse;
import com.code4cause.qventor.service.AdminService;
import com.code4cause.qventor.service.WarehouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/admins")
public class AdminController {

    private final AdminService adminService;
    public final WarehouseService warehouseService;

    @Autowired
    public AdminController(AdminService adminService,WarehouseService warehouseService) {
        this.adminService = adminService;
        this.warehouseService =warehouseService;
    }

    //  Create new admin
    @PostMapping
    public ResponseEntity<Admin> createAdmin(@RequestBody Admin admin) {
        return ResponseEntity.ok(adminService.createAdmin(admin));
    }

    //  Get all admins
    @GetMapping
    public ResponseEntity<List<Admin>> getAllAdmins() {
        return ResponseEntity.ok(adminService.getAllAdmins());
    }

    //  Get single admin by Supabase user ID
    @GetMapping("/{supabaseUserId}")
    public ResponseEntity<Admin> getAdminBySupabaseUserId(@PathVariable String supabaseUserId) {
        return ResponseEntity.ok(adminService.getAdminBySupabaseUserId(supabaseUserId));
    }

    //  Get all imports for an admin
    @GetMapping("/{supabaseUserId}/imports")
    public ResponseEntity<List<ImportRecord>> getAllImports(@PathVariable String supabaseUserId) {
        return ResponseEntity.ok(adminService.getAllImportsByAdmin(supabaseUserId));
    }

    //  Get all exports for an admin
    @GetMapping("/{supabaseUserId}/exports")
    public ResponseEntity<List<ExportRecord>> getAllExports(@PathVariable String supabaseUserId) {
        return ResponseEntity.ok(adminService.getAllExportsByAdmin(supabaseUserId));
    }

    //  Update admin
    @PutMapping("/{supabaseUserId}")
    public ResponseEntity<Admin> updateAdmin(@PathVariable String supabaseUserId, @RequestBody Admin admin) {
        return ResponseEntity.ok(adminService.updateAdmin(supabaseUserId, admin));
    }

    //  Add New Warehouse to Admin by Supabase User ID
    @PostMapping("/{supabaseUserId}/warehouses")
    public Admin addWarehouseToAdmin(
            @PathVariable String supabaseUserId,
            @RequestBody Warehouse warehouse
    ) {
        return adminService.addWarehouseToAdmin(supabaseUserId, warehouse);
    }

    //  Get single warehouse by ID
    @GetMapping("/warehouse/{warehouseId}")
    public ResponseEntity<Warehouse> getWarehouseById(@PathVariable Long warehouseId) {
        Warehouse warehouse = warehouseService.getWarehouseById(warehouseId);
        return ResponseEntity.ok(warehouse);
    }

    //  update Warehouse info through warehouse id
    @PutMapping("/warehouse/{warehouseId}")
    public Warehouse updateWarehouse(
            @PathVariable Long warehouseId,
            @RequestBody Warehouse warehouse
    ){
        return warehouseService.updateWarehouse(warehouseId,warehouse);
    }

    //  update Warehouse activate or Inactive status through warehouse name
    @PutMapping("/warehouse/status/{warehouseName}")
    public Warehouse updateActiveInactiveOfWarehouse( @PathVariable String warehouseName){
        return warehouseService.activateOrDeactivateWarehouse(warehouseName);
    }

    //  update Warehouse activate or Inactive status through warehouse id
    @PutMapping("/warehouse/status/id/{warehouseId}")
    public Warehouse updateActiveInactiveOfWarehouse( @PathVariable Long warehouseId){
        return warehouseService.activateOrDeactivateWarehouse(warehouseId);
    }

    @DeleteMapping("/warehouse/id/{warehouseId}")
    public ResponseEntity<String> deleteWarehouse(@PathVariable long warehouseId){
        warehouseService.deleteWarehouse(warehouseId);
        return ResponseEntity.ok("Warehouse deleted successfully");
    }


    //  Delete admin
    @DeleteMapping("/{supabaseUserId}")
    public ResponseEntity<String> deleteAdmin(@PathVariable String supabaseUserId) {
        adminService.deleteAdmin(supabaseUserId);
        return ResponseEntity.ok("Admin deleted successfully");
    }
}
