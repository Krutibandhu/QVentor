package com.code4cause.qventor.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "item")
@Getter
@Setter
@NoArgsConstructor
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private double price;
    private int quantity;

    // Link to the Admin who owns this item
    @ManyToOne
    @JoinColumn(name = "admin_id")
    @JsonIgnore
    private Admin admin;

    // One item can have many import records
    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ImportRecord> imports;

    // One item can have many export records
    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ExportRecord> exports;

    // Connection to warehouse
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "warehouse_items",
            joinColumns = @JoinColumn(name = "item_id"),
            inverseJoinColumns = @JoinColumn(name = "warehouse_id")
    )
    private Set<Warehouse> warehouses = new HashSet<>();


    public Item(String name, String description, double price, int quantity, Admin admin, List<ImportRecord> imports, List<ExportRecord> exports) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
        this.admin = admin;
        this.imports = imports;
        this.exports = exports;
    }
}
