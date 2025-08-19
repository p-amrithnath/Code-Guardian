package com.codeguardian.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request model for code scanning operations
 */
@Data
@NoArgsConstructor
public class ScanRequest {
    
    /**
     * The code content to be scanned
     */
    @NotBlank(message = "Code content cannot be empty")
    @Size(max = 1000000, message = "Code content too large (max 1MB)")
    private String code;
    
    /**
     * Optional: Programming language hint
     */
    private String language;
    
    /**
     * Optional: Filename for context
     */
    private String filename;
} 