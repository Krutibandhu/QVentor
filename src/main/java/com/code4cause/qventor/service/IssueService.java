package com.code4cause.qventor.service;

import com.code4cause.qventor.myexception.ResourceNotFoundException;
import com.code4cause.qventor.model.Admin;
import com.code4cause.qventor.model.Employee;
import com.code4cause.qventor.model.Issue;
import com.code4cause.qventor.repository.AdminRepository;
import com.code4cause.qventor.repository.EmployeeRepository;
import com.code4cause.qventor.repository.IssueRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class IssueService {

    private final IssueRepository issueRepository;
    private final EmployeeRepository employeeRepository;
    private final AdminRepository adminRepository;

    public IssueService(IssueRepository issueRepository,
                        EmployeeRepository employeeRepository,
                        AdminRepository adminRepository) {
        this.issueRepository = issueRepository;
        this.employeeRepository = employeeRepository;
        this.adminRepository = adminRepository;
    }

    //  Employee raises a new issue
    public Issue createIssue(String employeeSupabaseUserId, Issue issue) {
        Employee employee = employeeRepository.findBySupabaseUserId(employeeSupabaseUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with SupabaseUserId: " + employeeSupabaseUserId));

        Admin admin = employee.getAdmin(); // employee is already linked to admin

        issue.setEmployee(employee);
        issue.setAdmin(admin);
        issue.setCreatedAt(LocalDateTime.now());
        issue.setStatus("OPEN");

        return issueRepository.save(issue);
    }


    //  Admin can view all issues
    public List<Issue> getIssuesByAdmin(String adminSupabaseId) {
        Admin admin = adminRepository.findBySupabaseUserId(adminSupabaseId).orElseThrow(
                ()-> new ResourceNotFoundException("Admin not found with thing id"));

        return issueRepository.findByAdminId(admin.getId());
    }

    //  Employee can view their own issues
    public List<Issue> getIssuesByEmployee(String employeeSupabaseId) {
        Employee employee = employeeRepository.findBySupabaseUserId(employeeSupabaseId).orElseThrow(
                ()-> new ResourceNotFoundException("Employee not found with this id ")
        );

        return issueRepository.findByEmployeeId(employee.getId());
    }

    //  Admin updates issue status
    public Issue updateIssueStatus(Long issueId, String status) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with ID: " + issueId));

        issue.setStatus(status);
        return issueRepository.save(issue);
    }
}
