package com.code4cause.qventor.controller;

import com.code4cause.qventor.model.Employee;
import com.code4cause.qventor.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    @Autowired
    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    //  Add employee to an admin
    @PostMapping("/{adminSupabaseUserId}")
    public ResponseEntity<Employee> addEmployeeToAdmin(
            @PathVariable String adminSupabaseUserId,
            @RequestBody Employee employee
    ) {
        return ResponseEntity.ok(employeeService.addEmployeeToAdmin(adminSupabaseUserId, employee));
    }

    //  Get all employees for a specific admin
    @GetMapping("/admin/{adminSupabaseUserId}")
    public ResponseEntity<List<Employee>> getEmployeesByAdmin(@PathVariable String adminSupabaseUserId) {
        return ResponseEntity.ok(employeeService.getEmployeesByAdmin(adminSupabaseUserId));
    }

    //  Get single employee by database ID
    @GetMapping("/id/{employeeId}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long employeeId) {
        return ResponseEntity.ok(employeeService.getEmployeeById(employeeId));
    }

    //  Get single employee by Supabase User ID
    @GetMapping("/supabase/{supabaseUserId}")
    public ResponseEntity<Employee> getEmployeeBySupabaseUserId(@PathVariable String supabaseUserId) {
        return ResponseEntity.ok(employeeService.getEmployeeBySupabaseUserId(supabaseUserId));
    }

    //  Update employee by Supabase User ID
    @PutMapping("/supabase/{supabaseUserId}")
    public ResponseEntity<Employee> updateEmployee(
            @PathVariable String supabaseUserId,
            @RequestBody Employee updatedEmployee
    ) {
        return ResponseEntity.ok(employeeService.updateEmployee(supabaseUserId, updatedEmployee));
    }

    //  Delete employee by Supabase User ID
    @DeleteMapping("/supabase/{supabaseUserId}")
    public ResponseEntity<String> deleteEmployee(@PathVariable String supabaseUserId) {
        employeeService.deleteEmployee(supabaseUserId);
        return ResponseEntity.ok("Employee deleted successfully");
    }

    //  Delete employee by normal ID
    @DeleteMapping("/id/{employeeId}")
    public ResponseEntity<String> deleteEmployee(@PathVariable Long employeeId) {
        employeeService.deleteEmployee(employeeId);
        return ResponseEntity.ok("Employee deleted successfully");
    }
}
