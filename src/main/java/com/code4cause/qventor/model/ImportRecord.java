package com.code4cause.qventor.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
public class ImportRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    private String documentNumber;
    private String status;
    private int quantityOrdered;
    private String vendorEntityId;
    private String vendorName;
    private String vendorEmail;
    private int quantityBilled;
    private int quantityReceived;

    // Many imports belong to one item
    @ManyToOne
    @JoinColumn(name = "item_id", nullable = false)
    @JsonIgnoreProperties({"imports", "exports", "warehouses"})
    private Item item;

    public ImportRecord(LocalDate date, String documentNumber, String status, int quantityOrdered, String vendorEntityId, String vendorName, int quantityBilled, int quantityReceived, Item item) {
        this.date = date;
        this.documentNumber = documentNumber;
        this.status = status;
        this.quantityOrdered = quantityOrdered;
        this.vendorEntityId = vendorEntityId;
        this.vendorName = vendorName;
        this.quantityBilled = quantityBilled;
        this.quantityReceived = quantityReceived;
        this.item = item;
    }
}
