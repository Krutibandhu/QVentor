package com.code4cause.qventor.controller;

import com.code4cause.qventor.model.Admin;
import com.code4cause.qventor.model.ExportRecord;
import com.code4cause.qventor.model.ImportRecord;
import com.code4cause.qventor.model.Item;
import com.code4cause.qventor.repository.AdminRepository;
import com.code4cause.qventor.service.AdminService;
import com.code4cause.qventor.service.ItemService;
import com.code4cause.qventor.service.WarehouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;


@RestController
@RequestMapping("/api/items")
public class ItemController {
    private final ItemService itemService;
    private final WarehouseService warehouseService;
    private final AdminService adminService;

    @Autowired
    public ItemController(ItemService itemService, WarehouseService warehouseService, AdminService adminService) {
        this.itemService = itemService;
        this.warehouseService = warehouseService;
        this.adminService = adminService;
    }

    //  Add item to admin by supabaseUserId
    @PostMapping("/save/{supabaseUserId}")
    public ResponseEntity<Item> addItemToAdmin(
            @PathVariable String supabaseUserId,
            @RequestBody Item item
    ) {
        Item savedItem = itemService.addItemToAdmin(supabaseUserId, item);
        return ResponseEntity.ok(savedItem);
    }

    //  Search endpoint
    @GetMapping("/search/{adminSupabaseUserId}")
    public ResponseEntity<List<Item>> searchItems(@RequestParam("q") String query,
        @PathVariable String adminSupabaseUserId
    ) {
        Admin admin = adminService.getAdminBySupabaseUserId(adminSupabaseUserId);
        List<Item> items = itemService.searchItems(query,admin.getId());
        return ResponseEntity.ok(items);
    }

    //  Get all items of a specific admin
    @GetMapping("/admin/{supabaseUserId}")
    public ResponseEntity<List<Item>> getItemsByAdmin(@PathVariable String supabaseUserId) {
        return ResponseEntity.ok(itemService.getItemsByAdmin(supabaseUserId));
    }

    //  Get all items of a specific admin
    @GetMapping("/warehouse/{warehouseId}")
    public ResponseEntity<Set<Item>> getItemsByWarehouse(@PathVariable Long warehouseId){
        return ResponseEntity.ok(warehouseService.getItemsFromWarehouse(warehouseId));
    }


    //  Get single item by ID
    @GetMapping("/{itemId}")
    public ResponseEntity<Item> getItemById(@PathVariable Long itemId) {
        return ResponseEntity.ok(itemService.getItemById(itemId));
    }

    //  Update item
    @PutMapping("/{itemId}")
    public ResponseEntity<Item> updateItem(@PathVariable Long itemId, @RequestBody Item item) {
        return ResponseEntity.ok(itemService.updateItem(itemId, item));
    }

    //  Delete item
    @DeleteMapping("/{itemId}")
    public ResponseEntity<String> deleteItem(@PathVariable Long itemId) {
        itemService.deleteItem(itemId);
        return ResponseEntity.ok("Item deleted successfully");
    }

    //  Create: add a new ImportRecord to an existing item
    @PostMapping("/{itemId}/imports")
    public ResponseEntity<ImportRecord> addImportToItem(
            @PathVariable Long itemId,
            @RequestBody ImportRecord importRecord
    ) {
        return ResponseEntity.ok(itemService.addImportToItem(itemId, importRecord));
    }

    //  Create: add a new ExportRecord to an existing item
    @PostMapping("/{itemId}/exports")
    public ResponseEntity<ExportRecord> addExportToItem(
            @PathVariable Long itemId,
            @RequestBody ExportRecord exportRecord
    ) {
        return ResponseEntity.ok(itemService.addExportToItem(itemId, exportRecord));
    }

    //  Get all import records for an item
    @GetMapping("/{itemId}/imports")
    public ResponseEntity<List<ImportRecord>> getImportRecords(@PathVariable Long itemId) {
        return ResponseEntity.ok(itemService.getImportRecordsByItem(itemId));
    }

    //  Get single import record
    @GetMapping("/{itemId}/imports/{importId}")
    public ResponseEntity<ImportRecord> getSingleImport(
            @PathVariable Long itemId,
            @PathVariable Long importId
    ) {
        return ResponseEntity.ok(itemService.getSingleImportRecord(itemId, importId));
    }

    //  Get all export records for an item
    @GetMapping("/{itemId}/exports")
    public ResponseEntity<List<ExportRecord>> getExportRecords(@PathVariable Long itemId) {
        return ResponseEntity.ok(itemService.getExportRecordsByItem(itemId));
    }

    //  Get single export record
    @GetMapping("/{itemId}/exports/{exportId}")
    public ResponseEntity<ExportRecord> getSingleExport(
            @PathVariable Long itemId,
            @PathVariable Long exportId
    ) {
        return ResponseEntity.ok(itemService.getSingleExportRecord(itemId, exportId));
    }
}
