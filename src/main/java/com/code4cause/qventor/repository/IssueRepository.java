package com.code4cause.qventor.repository;

import com.code4cause.qventor.model.Issue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IssueRepository extends JpaRepository<Issue, Long> {
    List<Issue> findByAdminId(Long adminId);
    List<Issue> findByEmployeeId(Long employeeId);
}
