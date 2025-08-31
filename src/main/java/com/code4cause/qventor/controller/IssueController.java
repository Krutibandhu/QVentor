package com.code4cause.qventor.controller;

import com.code4cause.qventor.model.Issue;
import com.code4cause.qventor.service.IssueService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
public class IssueController {

    private final IssueService issueService;

    public IssueController(IssueService issueService) {
        this.issueService = issueService;
    }

    // 🟢 Employee creates issue
    @PostMapping("/employee/{employeeSupabaseUserId}")
    public ResponseEntity<Issue> createIssue(
            @PathVariable String employeeSupabaseUserId,
            @RequestBody Issue issue) {
        return ResponseEntity.ok(issueService.createIssue(employeeSupabaseUserId, issue));
    }


    // 🟢 Admin views all issues
    @GetMapping("/admin/{adminId}")
    public ResponseEntity<List<Issue>> getIssuesByAdminById(@PathVariable String adminId) {
        return ResponseEntity.ok(issueService.getIssuesByAdmin(adminId));
    }

    // 🟢 Employee views their issues
    @GetMapping("/employee/{employeeSupabaseId}")
    public ResponseEntity<List<Issue>> getIssuesByEmployee(@PathVariable String employeeSupabaseId) {
        return ResponseEntity.ok(issueService.getIssuesByEmployee(employeeSupabaseId));
    }

    // 🟢 Admin updates issue status
    @PutMapping("/{issueId}/status")
    public ResponseEntity<Issue> updateIssueStatus(
            @PathVariable Long issueId,
            @RequestParam String status) {
        return ResponseEntity.ok(issueService.updateIssueStatus(issueId, status));
    }
}
