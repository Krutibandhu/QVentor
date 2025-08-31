package com.code4cause.qventor.service;

import com.code4cause.qventor.model.Admin;
import com.code4cause.qventor.model.Employee;
import com.code4cause.qventor.myexception.ResourceNotFoundException;
import com.code4cause.qventor.repository.AdminRepository;
import com.code4cause.qventor.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final AdminRepository adminRepository;

    @Autowired
    public EmployeeService(EmployeeRepository employeeRepository, AdminRepository adminRepository) {
        this.employeeRepository = employeeRepository;
        this.adminRepository = adminRepository;
    }

    /**
     * Add a new employee to an admin using admin's Supabase User ID
     */
    @Transactional
    public Employee addEmployeeToAdmin(String adminSupabaseUserId, Employee employee) {
        Optional<Admin> adminOpt = adminRepository.findBySupabaseUserId(adminSupabaseUserId);
        if (adminOpt.isEmpty()) {
            throw new ResourceNotFoundException("Admin with Supabase ID " + adminSupabaseUserId + " not found");
        }
        Admin admin = adminOpt.get();
        employee.setAdmin(admin); // Link employee to admin
        return employeeRepository.save(employee);
    }

    /**
     * Get all employees of a specific admin using admin's Supabase User ID
     */
    public List<Employee> getEmployeesByAdmin(String adminSupabaseUserId) {
        Optional<Admin> adminOpt = adminRepository.findBySupabaseUserId(adminSupabaseUserId);
        if (adminOpt.isEmpty()) {
            throw new ResourceNotFoundException("Admin with Supabase ID " + adminSupabaseUserId + " not found");
        }
        return adminOpt.get().getEmployees();
    }

    /**
     * Get a single employee by their ID
     */
    public Employee getEmployeeById(Long employeeId) {
        return employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee with ID " + employeeId + " not found"));
    }

    /**
     * Get a single employee by their Supabase User ID
     */
    public Employee getEmployeeBySupabaseUserId(String supabaseUserId) {
        return employeeRepository.findBySupabaseUserId(supabaseUserId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Employee with Supabase User ID " + supabaseUserId + " not found"
                ));
    }


    /**
     * Update employee details
     */
    @Transactional
    public Employee updateEmployee(String supabaseEmployeeId, Employee updatedEmployee) {
        Employee existingEmployee = getEmployeeBySupabaseUserId(supabaseEmployeeId);

        existingEmployee.setFullName(updatedEmployee.getFullName());
        existingEmployee.setPhoneNumber(updatedEmployee.getPhoneNumber());
        existingEmployee.setCompanyName(updatedEmployee.getCompanyName());
        existingEmployee.setDepartment(updatedEmployee.getDepartment());
        existingEmployee.setRole(updatedEmployee.getRole());

        return employeeRepository.save(existingEmployee);
    }

    /**
     * Delete employee by ID
     */
    @Transactional
    public void deleteEmployee(String supabaseEmployeeId) {
        Employee employee = getEmployeeBySupabaseUserId(supabaseEmployeeId);
        if (employee == null) {
            throw new ResourceNotFoundException("Employee with ID " + supabaseEmployeeId + " not found");
        }
       employeeRepository.delete(employee);
    }

    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = getEmployeeById(id);
        if (employee == null) {
            throw new ResourceNotFoundException("Employee with ID " + id + " not found");
        }
       employeeRepository.delete(employee);
    }

}
