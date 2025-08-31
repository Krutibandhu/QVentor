package com.code4cause.qventor.service;

import com.code4cause.qventor.model.*;
import com.code4cause.qventor.myexception.BadRequestException;
import com.code4cause.qventor.myexception.ResourceNotFoundException;
import com.code4cause.qventor.repository.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ItemService {
    private final ItemRepository itemRepository;
    private final AdminRepository adminRepository;
    private final ImportRecordRepository importRecordRepository;
    private final ExportRecordRepository exportRecordRepository;
    private final WarehouseRepository warehouseRepository;
    private final EntityManager entityManager;

    @Autowired
    public ItemService(ItemRepository itemRepository,
                       AdminRepository adminRepository,
                       ImportRecordRepository importRecordRepository,
                       ExportRecordRepository exportRecordRepository, WarehouseRepository warehouseRepository, EntityManager entityManager) {
        this.itemRepository = itemRepository;
        this.adminRepository = adminRepository;
        this.importRecordRepository = importRecordRepository;
        this.exportRecordRepository = exportRecordRepository;
        this.warehouseRepository = warehouseRepository;
        this.entityManager = entityManager;
    }

    @Transactional
    //  Add a new item linked to an admin and warehouse(s) using supabaseUserId
    public Item addItemToAdmin(String supabaseUserId, Item item) {
        Admin admin = adminRepository.findBySupabaseUserId(supabaseUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with SupabaseUserId: " + supabaseUserId));

        Item existingItem = itemRepository.findByName(item.getName());

        if (existingItem != null) {
            throw new BadRequestException("Item Already Exist with the same name");
        }

        item.setAdmin(admin);

        // Link imports to this item
        if (item.getImports() != null) {
            item.getImports().forEach(importRecord -> importRecord.setItem(item));
        }

        // Link exports to this item
        if (item.getExports() != null) {
            item.getExports().forEach(exportRecord -> exportRecord.setItem(item));
        }

        //  Link warehouses to this item
        if (item.getWarehouses() != null && !item.getWarehouses().isEmpty()) {
            Set<Warehouse> attachedWarehouses = new HashSet<>();

            for (Warehouse warehouse : item.getWarehouses()) {
                Warehouse existingWarehouse = warehouseRepository.findByWarehouseName(warehouse.getWarehouseName())
                        .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found with name: " + warehouse.getWarehouseName()));

                // Add the item to warehouse's list (only if needed for bidirectional mapping)
                existingWarehouse.getItems().add(item);

                attachedWarehouses.add(existingWarehouse);
            }

            item.setWarehouses(attachedWarehouses);
        }

        return itemRepository.save(item);
    }


    //  Get all items of a specific admin
    public List<Item> getItemsByAdmin(String supabaseUserId) {
        Admin admin = adminRepository.findBySupabaseUserId(supabaseUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));
        return admin.getItems();
    }

    //  Get a single item by ID
    public Item getItemById(Long itemId) {
        return itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));
    }

    //  Search items by name
    public List<Item> searchItems(String keyword, Long adminId) {
        String[] words = keyword.toLowerCase().split("\\s+");

        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Item> query = cb.createQuery(Item.class);
        Root<Item> root = query.from(Item.class);

        List<Predicate> predicates = new ArrayList<>();

        // Restrict by adminId
        predicates.add(cb.equal(root.get("admin").get("id"), adminId));

        // Add LIKE conditions for each word
        for (String word : words) {
            predicates.add(cb.like(cb.lower(root.get("name")), "%" + word + "%"));
        }

        query.select(root).where(cb.and(predicates.toArray(new Predicate[0])));

        return entityManager.createQuery(query).getResultList();
    }


    @Transactional
    //  Update an item
    public Item updateItem(Long itemId, Item updatedItem) {
        Item existingItem = getItemById(itemId);
        existingItem.setName(updatedItem.getName());
        existingItem.setDescription(updatedItem.getDescription());
        existingItem.setPrice(updatedItem.getPrice());
        existingItem.setQuantity(updatedItem.getQuantity());
        return itemRepository.save(existingItem);
    }

    @Transactional
    //  Delete an item
    public void deleteItem(Long itemId) {
        if (!itemRepository.existsById(itemId)) {
            throw new ResourceNotFoundException("Item not found");
        }
        itemRepository.deleteById(itemId);
    }

    //  Get all import records for an item
    public List<ImportRecord> getImportRecordsByItem(Long itemId) {
        getItemById(itemId); // ensure item exists
        return importRecordRepository.findByItemId(itemId);
    }

    //  Get single import record
    public ImportRecord getSingleImportRecord(Long itemId, Long importId) {
        ImportRecord rec = importRecordRepository.findById(importId)
                .orElseThrow(() -> new ResourceNotFoundException("Import record not found"));
        if (!rec.getItem().getId().equals(itemId)) {
            throw new ResourceNotFoundException("Import record does not belong to this item");
        }
        return rec;
    }

    //  Get all export records for an item
    public List<ExportRecord> getExportRecordsByItem(Long itemId) {
        getItemById(itemId); // ensure item exists
        return exportRecordRepository.findByItemId(itemId);
    }

    //  Get single export record
    public ExportRecord getSingleExportRecord(Long itemId, Long exportId) {
        ExportRecord rec = exportRecordRepository.findById(exportId)
                .orElseThrow(() -> new ResourceNotFoundException("Export record not found"));
        if (!rec.getItem().getId().equals(itemId)) {
            throw new ResourceNotFoundException("Export record does not belong to this item");
        }
        return rec;
    }

    @Transactional
    //  CREATE: Add a new ImportRecord to an existing item
    public ImportRecord addImportToItem(Long itemId, ImportRecord newImport) {
        Item item = getItemById(itemId);
        newImport.setItem(item);

        // (Optional) Update on-hand quantity by what actually arrived
        if (newImport.getQuantityReceived() > 0) {
            item.setQuantity(item.getQuantity() + newImport.getQuantityReceived());
            itemRepository.save(item);
        }
        return importRecordRepository.save(newImport);
    }

    @Transactional
    //  CREATE: Add a new ExportRecord to an existing item
    public ExportRecord addExportToItem(Long itemId, ExportRecord newExport) {
        Item item = getItemById(itemId);
        newExport.setItem(item);

        // (Optional) Reduce on-hand quantity by what shipped
        if (newExport.getQuantityShipped() > 0) {
            int newQty = item.getQuantity() - newExport.getQuantityShipped();
            if (newQty < 0) {
                throw new ResourceNotFoundException("Not enough stock to ship");
            }
            item.setQuantity(newQty);
            itemRepository.save(item);
        }
        return exportRecordRepository.save(newExport);
    }
}
