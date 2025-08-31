package com.code4cause.qventor.repository;

import com.code4cause.qventor.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee,Long> {
    Optional<Employee> findBySupabaseUserId(String supabaseUserId);
}
