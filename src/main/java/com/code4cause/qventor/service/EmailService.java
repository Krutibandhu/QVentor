package com.code4cause.qventor.service;

import com.code4cause.qventor.model.ImportRecord;
import com.code4cause.qventor.model.Item;
import com.code4cause.qventor.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final ItemRepository itemRepository;

    public EmailService(JavaMailSender mailSender, ItemRepository itemRepository) {
        this.mailSender = mailSender;
        this.itemRepository = itemRepository;
    }

    public void sendPurchaseOrderEmail(Long itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found with ID: " + itemId));

        String adminEmail = item.getAdmin().getEmail();
        String itemName = item.getName(); // Assuming Item has getName()
        LocalDate deliveryDate = LocalDate.now().plusDays(20);
        LocalDate deadlineDate = deliveryDate.minusDays(10);

        List<ImportRecord> imports = item.getImports(); // Assuming this returns List<Import>
        if (imports.isEmpty()) {
            throw new RuntimeException("No imports found for item ID: " + itemId);
        }

        // Sort imports by date or ID to get the latest one
        ImportRecord latestImport = imports.stream()
                .max(Comparator.comparing(ImportRecord::getId))
                .orElseThrow(() -> new RuntimeException("Unable to determine latest import"));

        int quantity = latestImport.getQuantityOrdered();

        // Get up to 5 unique vendor emails
        List<String> vendorEmails = imports.stream()
                .map(ImportRecord::getVendorEmail) // Assuming Import has getVendor()
                .filter(Objects::nonNull)
                .distinct()
                .limit(5)
                .toList();

        for (String vendorEmail : vendorEmails) {
            String vendorName = imports.stream()
                    .filter(i -> i.getVendorEmail().equals(vendorEmail))
                    .map(ImportRecord::getVendorName) // Assuming getName()
                    .findFirst()
                    .orElse("Vendor");

            String subject = "Purchase Order from " + adminEmail;

            String body = String.format(
                    "<div style='font-family: Arial, sans-serif; line-height:1.6;'>"
                            + "<h2 style='color:#0a1a3d;'>Request for Quotation</h2>"
                            + "<p>Dear <b>%s</b>,</p>"
                            + "<p>We, <b>%s</b>, are planning to procure the following item and would appreciate receiving your quotation for the same:</p>"
                            + "<table style='border-collapse:collapse; width:100%%; margin:20px 0;'>"
                            + "<tr style='background:#0a1a3d; color:#ffffff;'>"
                            + "<th style='padding:8px; border:1px solid #ddd;'>Item</th>"
                            + "<th style='padding:8px; border:1px solid #ddd;'>Quantity Required</th>"
                            + "<th style='padding:8px; border:1px solid #ddd;'>Expected Delivery Date</th>"
                            + "</tr>"
                            + "<tr>"
                            + "<td style='padding:8px; border:1px solid #ddd;'>%s</td>"
                            + "<td style='padding:8px; border:1px solid #ddd;'>%d</td>"
                            + "<td style='padding:8px; border:1px solid #ddd;'>%s</td>"
                            + "</tr>"
                            + "</table>"
                            + "<p>Please include the following details in your quotation:</p>"
                            + "<ul>"
                            + "<li>Comparative price</li>"
                            + "<li>Discounts & Bills</li>"
                            + "<li>Delivery timeline</li>"
                            + "<li>Payment terms & conditions</li>"
                            + "<li>Any applicable other charges</li>"
                            + "<li>Company details</li>"
                            + "<li>Cancellation period</li>"
                            + "</ul>"
                            + "<p>We kindly request you to respond with your quotation by %s.</p>"
                            + "<p>Looking forward to your prompt response.</p>"
                            + "<p>Regards,<br><b>%s</b></p>"
                            + "</div>",
                    vendorName, adminEmail, itemName, quantity, deliveryDate, deadlineDate ,adminEmail
            );

            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                helper.setFrom(adminEmail);
                helper.setTo(vendorEmail);
                helper.setSubject(subject);
                helper.setText(body, true);

                mailSender.send(message);
            } catch (MessagingException e) {
                throw new RuntimeException("Failed to send purchase order email to " + vendorEmail + ": " + e.getMessage(), e);
            }
        }
    }

    public String getEmailDraftUrl(Long itemId){
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found with ID: " + itemId));

        String adminEmail = item.getAdmin().getEmail();
        String itemName = item.getName();
        LocalDate deliveryDate = LocalDate.now().plusDays(20);
        LocalDate deadlineDate = deliveryDate.minusDays(10);

        List<ImportRecord> imports = item.getImports();
        if (imports.isEmpty()) {
            throw new RuntimeException("No imports found for item ID: " + itemId);
        }

        // Sort imports by date or ID to get the latest one
        ImportRecord latestImport = imports.stream()
                .max(Comparator.comparing(ImportRecord::getId))
                .orElseThrow(() -> new RuntimeException("Unable to determine latest import"));

        int quantity = latestImport.getQuantityOrdered();

        String subject = "Purchase Order from " + adminEmail;

        String body = String.format("Dear Distributor,\n\n"
                + "We %s planning to procure the following it em:\n"
                + "- Item: %s\n"
                + "- Quantity: %s\n"
                + "- Delivery Date: %s\n\n"
                + "Please send us your quotation including:\n"
                + "- Unit price\n"
                + "- Delivery timeline\n"
                + "- Payment terms\n\n"
                + "Regards,\n%s",adminEmail,itemName,quantity,deliveryDate,adminEmail);

        // Get up to 5 unique vendor emails
        List<String> vendorEmails = imports.stream()
                .map(ImportRecord::getVendorEmail)
                .filter(Objects::nonNull)
                .distinct()
                .limit(5)
                .toList();

        String toField = String.join(",", vendorEmails);

        String gmailUrl = String.format(
                "https://mail.google.com/mail/?view=cm&fs=1&to=%s&su=%s&body=%s",
                URLEncoder.encode(toField, StandardCharsets.UTF_8),
                URLEncoder.encode(subject, StandardCharsets.UTF_8),
                URLEncoder.encode(body, StandardCharsets.UTF_8)
        );

        return gmailUrl;

    }
}
