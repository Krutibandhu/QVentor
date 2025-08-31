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
public class ExportRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    private String documentNumber;
    private String status;
    private int quantityOrdered;
    private String customerEntityId;
    private String customerName;
    private int quantityBilled;
    private int quantityShipped;

    // Many exports belong to one item
    @ManyToOne
    @JoinColumn(name = "item_id", nullable = false)
    @JsonIgnoreProperties({"imports", "exports", "warehouses"})
    private Item item;

    public ExportRecord(LocalDate date, String documentNumber, String status, int quantityOrdered, String customerEntityId, String customerName, int quantityBilled, int quantityShipped, Item item) {
        this.date = date;
        this.documentNumber = documentNumber;
        this.status = status;
        this.quantityOrdered = quantityOrdered;
        this.customerEntityId = customerEntityId;
        this.customerName = customerName;
        this.quantityBilled = quantityBilled;
        this.quantityShipped = quantityShipped;
        this.item = item;
    }
}
