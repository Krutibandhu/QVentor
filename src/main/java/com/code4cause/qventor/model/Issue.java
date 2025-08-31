package com.code4cause.qventor.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
public class Issue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;         // Short problem title
    private String description;   // Detailed description
    private String status;        // e.g., "OPEN", "IN_PROGRESS", "RESOLVED"
    private LocalDateTime createdAt;

    // 🔗 Many issues can be raised by one employee
    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    // 🔗 Many issues belong to one admin
    @ManyToOne
    @JoinColumn(name = "admin_id")
    private Admin admin;

    public Issue(String title, String description, String status, LocalDateTime createdAt, Employee employee, Admin admin) {
        this.title = title;
        this.description = description;
        this.status = status;
        this.createdAt = createdAt;
        this.employee = employee;
        this.admin = admin;
    }
}
