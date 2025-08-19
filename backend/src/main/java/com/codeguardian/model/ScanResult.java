package com.codeguardian.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a single security issue found during code scanning
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScanResult {
    
    /**
     * Line number where the issue was found (1-based)
     */
    private int line;
    
    /**
     * Type/category of the security issue
     */
    private String type;
    
    /**
     * Detailed message describing the issue
     */
    private String message;
    
    /**
     * Suggested fix or remediation for the issue
     */
    private String suggestion;
    
    /**
     * Severity level of the issue
     */
    private Severity severity;
    
    /**
     * The actual code snippet that triggered the issue
     */
    private String codeSnippet;
    
    public enum Severity {
        LOW, MEDIUM, HIGH, CRITICAL
    }
} 