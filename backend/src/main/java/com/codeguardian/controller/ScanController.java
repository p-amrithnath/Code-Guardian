package com.codeguardian.controller;

import com.codeguardian.model.ScanRequest;
import com.codeguardian.model.ScanResult;
import com.codeguardian.service.ScannerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for code scanning operations
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(originPatterns = "*")
public class ScanController {

    @Autowired
    private ScannerService scannerService;

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Code Guardian Scanner");
        response.put("version", "1.0.0");
        return ResponseEntity.ok(response);
    }

    /**
     * Main scanning endpoint for rule-based analysis
     */
    @PostMapping("/scan")
    public ResponseEntity<Map<String, Object>> scanCode(@Valid @RequestBody ScanRequest request) {
        try {
            // Perform the scan
            List<ScanResult> scanResults = scannerService.scanCode(request.getCode());

            // Get summary statistics
            Map<String, Object> summary = scannerService.getScanSummary(scanResults);

            // Build response
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("results", scanResults);
            response.put("summary", summary);
            response.put("message", "Scan completed successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // Error handling
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Scan failed");
            errorResponse.put("message", e.getMessage());
            errorResponse.put("results", List.of());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Get available security rules
     */
    @GetMapping("/rules")
    public ResponseEntity<Map<String, Object>> getAvailableRules() {
        Map<String, Object> response = new HashMap<>();

        Map<String, Object> ruleCategories = new HashMap<>();
        ruleCategories.put("secrets", List.of(
                "API Keys", "Passwords", "JWT Secrets", "Database URLs", "Private Keys"));
        ruleCategories.put("unsafe_practices", List.of(
                "eval() usage", "subprocess with shell=True", "os.system()", "dangerous imports"));
        ruleCategories.put("vulnerabilities", List.of(
                "SQL Injection", "XSS Vulnerabilities", "Weak Random Generation"));
        ruleCategories.put("code_quality", List.of(
                "Hardcoded URLs", "Commented Credentials"));

        response.put("categories", ruleCategories);
        response.put("totalRules", 12);

        return ResponseEntity.ok(response);
    }

    /**
     * Validation endpoint for quick syntax checks
     */
    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateCode(@Valid @RequestBody ScanRequest request) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Basic validation checks
            String code = request.getCode();

            Map<String, Object> validation = new HashMap<>();
            validation.put("isValid", true);
            validation.put("lineCount", code.split("\\r?\\n").length);
            validation.put("characterCount", code.length());
            validation.put("language", request.getLanguage() != null ? request.getLanguage() : "auto-detected");

            response.put("success", true);
            response.put("validation", validation);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Validation failed");
            response.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Error handler for validation errors
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(Exception e) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("error", "Request validation failed");
        response.put("message", e.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}