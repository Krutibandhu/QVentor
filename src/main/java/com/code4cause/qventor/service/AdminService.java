package com.code4cause.qventor.service;

import com.code4cause.qventor.model.Admin;
import com.code4cause.qventor.model.ExportRecord;
import com.code4cause.qventor.model.ImportRecord;
import com.code4cause.qventor.model.Warehouse;
import com.code4cause.qventor.myexception.BadRequestException;
import com.code4cause.qventor.myexception.ResourceNotFoundException;
import com.code4cause.qventor.repository.AdminRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdminService {
    private final AdminRepository adminRepository;

    @Autowired
    public AdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    /**
     * Create a new Admin.
     * Throws RuntimeException if an admin with the same supabaseUserId already exists.
     */
    public Admin createAdmin(Admin admin) {
        if (admin.getSupabaseUserId() == null || admin.getSupabaseUserId().isBlank()) {
            throw new BadRequestException("supabaseUserId is required");
        }

        boolean exists = adminRepository.findBySupabaseUserId(admin.getSupabaseUserId()).isPresent();
        if (exists) {
            throw new ResourceNotFoundException("Admin with given Supabase ID already exists");
        }
        return adminRepository.save(admin);
    }



    //Save or update an admin in the database.
    public Admin saveAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    //Get all admins from the database.
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    /**
     * Get an admin by its primary key ID.
     * Throws ResourceNotFoundException() if not found.
     */
    public Admin getAdminById(Long id) {
        return adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));
    }

    //Get an admin using their Supabase user ID.
    public Admin getAdminBySupabaseUserId(String id) {
        return adminRepository.findBySupabaseUserId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));
    }

    //Update Admin
    @Transactional
    public Admin updateAdmin(String supabaseUserId, Admin adminUpdates) {
        Admin admin = adminRepository.findBySupabaseUserId(supabaseUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        // Update allowed fields if provided (avoid changing supabaseUserId)
        if (adminUpdates.getFullName() != null) {
            admin.setFullName(adminUpdates.getFullName());
        }
        if (adminUpdates.getEmail() != null) {
            admin.setEmail(adminUpdates.getEmail());
        }
        if (adminUpdates.getPhoneNumber() != null) {
            admin.setPhoneNumber(adminUpdates.getPhoneNumber());
        }
        if (adminUpdates.getCompanyName() != null) {
            admin.setCompanyName(adminUpdates.getCompanyName());
        }

        // Optionally replace warehouses if provided (careful: this will replace existing list)
        if (adminUpdates.getWarehouses() != null) {
            admin.setWarehouses(adminUpdates.getWarehouses());
        }

        // We intentionally do NOT replace items here; items are managed by ItemService.
        return adminRepository.save(admin);
    }

    /**
     * Delete an Admin (by supabaseUserId). Because of cascade = ALL on warehouses and items,
     * related warehouses/items will be removed as well.
     */
    @Transactional
    public void deleteAdmin(String supabaseUserId) {
        Admin admin = adminRepository.findBySupabaseUserId(supabaseUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));
        adminRepository.delete(admin);
    }

    /**
     * Add a new warehouse to an existing admin.
     * Finds the admin using Supabase user ID,
     * adds the warehouse to the list, and saves the admin.
     */
    @Transactional
    public Admin addWarehouseToAdmin(String supabaseUserId, Warehouse newWarehouse) {
        Admin admin = adminRepository.findBySupabaseUserId(supabaseUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        admin.getWarehouses().add(newWarehouse);

        return adminRepository.save(admin);
    }

    //  Get all imports for an admin
    public List<ImportRecord> getAllImportsByAdmin(String supabaseUserId) {
        Admin admin = adminRepository.findBySupabaseUserId(supabaseUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with SupabaseUserId: " + supabaseUserId));

        List<ImportRecord> imports = new ArrayList<>();
        admin.getItems().forEach(item -> imports.addAll(item.getImports()));
        return imports;
    }

    //  Get all exports for an admin
    public List<ExportRecord> getAllExportsByAdmin(String supabaseUserId) {
        Admin admin = adminRepository.findBySupabaseUserId(supabaseUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with SupabaseUserId: " + supabaseUserId));

        List<ExportRecord> exports = new ArrayList<>();
        admin.getItems().forEach(item -> exports.addAll(item.getExports()));
        return exports;
    }
}
