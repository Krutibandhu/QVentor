package com.code4cause.qventor.controller;

import com.code4cause.qventor.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/purchase-orders")
public class PurchaseOrderController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/{id}/approve")
    public String approvePurchaseOrder(
            @PathVariable Long id,
            @RequestParam Long itemId
    ) {
        // ⚡️ Fire email service
        emailService.sendPurchaseOrderEmail(itemId);

        return " Purchase Order Approved & Email Sent!";
    }

    @GetMapping("/view")
    public ResponseEntity<String> viewEmail(@RequestParam Long itemId){
        return ResponseEntity.ok(emailService.getEmailDraftUrl(itemId));
    }
}
