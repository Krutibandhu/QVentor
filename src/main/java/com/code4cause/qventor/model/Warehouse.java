package com.code4cause.qventor.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
public class Warehouse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String warehouseName;
    private String location;
    private boolean enabled;

    public Warehouse(String warehouseName, String location, boolean enabled) {
        this.warehouseName = warehouseName;
        this.location = location;
        this.enabled = enabled;
    }

    @ManyToMany(mappedBy = "warehouses", fetch = FetchType.LAZY)
    @JsonIgnore // prevents automatic loading & infinite recursion
    private Set<Item> items = new HashSet<>();

}
