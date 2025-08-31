package com.code4cause.qventor.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String email;
    private String phoneNumber;
    private String companyName;
    private String supabaseUserId;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "admin_id") // This column will be added in Warehouse table
    private List<Warehouse> warehouses;

    @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Item> items;

    @OneToMany(mappedBy = "admin", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Employee> employees;

    public Admin(String fullName, String email, String phoneNumber, String companyName, String supabaseUserId, List<Warehouse> warehouses, List<Item> items, List<Employee> employees) {
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.companyName = companyName;
        this.supabaseUserId = supabaseUserId;
        this.warehouses = warehouses;
        this.items = items;
        this.employees = employees;
    }

    //  Automatically calculated warehouse amount
    @Transient // Not stored in DB
    public int getWarehouseAmount() {
        return (warehouses != null) ? warehouses.size() : 0;
    }


}
