package com.codeguardian.service;

import com.codeguardian.model.ScanResult;
import com.codeguardian.model.ScanResult.Severity;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Core service for rule-based code scanning
 */
@Service
public class ScannerService {

    // Security patterns for detecting various vulnerabilities
    private static final Map<String, SecurityRule> SECURITY_RULES = new HashMap<>();
    
    static {
        // Hardcoded secrets patterns
        SECURITY_RULES.put("API_KEY", new SecurityRule(
            Pattern.compile("(?i)(api[_\\-]?key|apikey)\\s*[=:]\\s*['\"]([a-zA-Z0-9_\\-]{16,})['\"]"),
            "Hardcoded API Key",
            "Store API keys in environment variables or secure configuration files",
            Severity.HIGH
        ));
        
        SECURITY_RULES.put("PASSWORD", new SecurityRule(
            Pattern.compile("(?i)(password|pwd|pass)\\s*[=:]\\s*['\"]([^'\"\\s]{4,})['\"]"),
            "Hardcoded Password",
            "Use environment variables or secure credential management",
            Severity.CRITICAL
        ));
        
        SECURITY_RULES.put("JWT_SECRET", new SecurityRule(
            Pattern.compile("(?i)(jwt[_\\-]?secret|secret[_\\-]?key)\\s*[=:]\\s*['\"]([a-zA-Z0-9_\\-]{20,})['\"]"),
            "Hardcoded JWT Secret",
            "Store JWT secrets in secure environment variables",
            Severity.CRITICAL
        ));
        
        SECURITY_RULES.put("DATABASE_URL", new SecurityRule(
            Pattern.compile("(?i)(database[_\\-]?url|db[_\\-]?url|connection[_\\-]?string)\\s*[=:]\\s*['\"]([^'\"\\s]+://[^'\"\\s]+)['\"]"),
            "Hardcoded Database URL",
            "Use environment variables for database connection strings",
            Severity.HIGH
        ));
        
        SECURITY_RULES.put("PRIVATE_KEY", new SecurityRule(
            Pattern.compile("-----BEGIN\\s+(RSA\\s+)?PRIVATE\\s+KEY-----"),
            "Hardcoded Private Key",
            "Store private keys in secure key management systems",
            Severity.CRITICAL
        ));
        
        // Unsafe imports and functions
        SECURITY_RULES.put("EVAL_USAGE", new SecurityRule(
            Pattern.compile("\\beval\\s*\\("),
            "Use of eval() function",
            "Avoid eval() - use safer alternatives like JSON.parse() or specific parsing libraries",
            Severity.HIGH
        ));
        
        SECURITY_RULES.put("SUBPROCESS_SHELL", new SecurityRule(
            Pattern.compile("(?i)subprocess\\.(call|run|Popen)\\s*\\([^)]*shell\\s*=\\s*True"),
            "Subprocess with shell=True",
            "Avoid shell=True in subprocess calls - use direct command execution",
            Severity.HIGH
        ));
        
        SECURITY_RULES.put("OS_SYSTEM", new SecurityRule(
            Pattern.compile("\\bos\\.system\\s*\\("),
            "Use of os.system()",
            "Replace os.system() with subprocess.run() for better security",
            Severity.MEDIUM
        ));
        
        SECURITY_RULES.put("DANGEROUS_IMPORTS", new SecurityRule(
            Pattern.compile("(?i)import\\s+(pickle|marshal|shelve|dill)\\b"),
            "Potentially dangerous import",
            "Be cautious with serialization libraries - validate input sources",
            Severity.MEDIUM
        ));
        
        // SQL Injection patterns
        SECURITY_RULES.put("SQL_INJECTION", new SecurityRule(
            Pattern.compile("(?i)(select|insert|update|delete)\\s+.*(\\+|\\||f['\"]).*\\bwhere\\b"),
            "Potential SQL Injection",
            "Use parameterized queries or prepared statements",
            Severity.HIGH
        ));
        
        // XSS patterns
        SECURITY_RULES.put("XSS_VULNERABILITY", new SecurityRule(
            Pattern.compile("(?i)innerHTML\\s*[=:]\\s*[^;]*\\+|document\\.write\\s*\\([^)]*\\+"),
            "Potential XSS Vulnerability",
            "Sanitize user input and use textContent instead of innerHTML",
            Severity.HIGH
        ));
        
        // Insecure random generation
        SECURITY_RULES.put("WEAK_RANDOM", new SecurityRule(
            Pattern.compile("\\b(Math\\.random|random\\.random)\\s*\\(\\)"),
            "Weak Random Generation",
            "Use cryptographically secure random generators for security purposes",
            Severity.MEDIUM
        ));
        
        // Hardcoded URLs and endpoints
        SECURITY_RULES.put("HARDCODED_URL", new SecurityRule(
            Pattern.compile("(?i)https?://[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}[^\\s'\"]*"),
            "Hardcoded URL",
            "Consider using configuration files for URLs and endpoints",
            Severity.LOW
        ));
        
        // Commented credentials
        SECURITY_RULES.put("COMMENTED_SECRETS", new SecurityRule(
            Pattern.compile("(?i)//.*(?:password|secret|key|token)\\s*[=:]\\s*['\"]?[a-zA-Z0-9_\\-]{8,}"),
            "Commented Credentials",
            "Remove commented credentials from source code",
            Severity.MEDIUM
        ));
    }
    
    /**
     * Scans the provided code and returns a list of security issues
     */
    public List<ScanResult> scanCode(String code) {
        List<ScanResult> results = new ArrayList<>();
        String[] lines = code.split("\\r?\\n");
        
        for (int lineNum = 0; lineNum < lines.length; lineNum++) {
            String line = lines[lineNum];
            
            // Apply each security rule to the current line
            for (Map.Entry<String, SecurityRule> entry : SECURITY_RULES.entrySet()) {
                String ruleId = entry.getKey();
                SecurityRule rule = entry.getValue();
                
                Matcher matcher = rule.getPattern().matcher(line);
                if (matcher.find()) {
                    ScanResult result = new ScanResult();
                    result.setLine(lineNum + 1); // 1-based line numbers
                    result.setType(rule.getType());
                    result.setMessage(rule.getMessage());
                    result.setSuggestion(rule.getSuggestion());
                    result.setSeverity(rule.getSeverity());
                    result.setCodeSnippet(line.trim());
                    
                    results.add(result);
                }
            }
        }
        
        // Sort results by line number, then by severity
        results.sort((a, b) -> {
            int lineComparison = Integer.compare(a.getLine(), b.getLine());
            if (lineComparison != 0) return lineComparison;
            return compareSeverity(b.getSeverity(), a.getSeverity()); // Descending severity
        });
        
        return results;
    }
    
    /**
     * Gets summary statistics of the scan results
     */
    public Map<String, Object> getScanSummary(List<ScanResult> results) {
        Map<String, Object> summary = new HashMap<>();
        
        long criticalCount = results.stream().filter(r -> r.getSeverity() == Severity.CRITICAL).count();
        long highCount = results.stream().filter(r -> r.getSeverity() == Severity.HIGH).count();
        long mediumCount = results.stream().filter(r -> r.getSeverity() == Severity.MEDIUM).count();
        long lowCount = results.stream().filter(r -> r.getSeverity() == Severity.LOW).count();
        
        summary.put("totalIssues", results.size());
        summary.put("criticalIssues", criticalCount);
        summary.put("highIssues", highCount);
        summary.put("mediumIssues", mediumCount);
        summary.put("lowIssues", lowCount);
        summary.put("scanTime", new Date());
        
        return summary;
    }
    
    /**
     * Helper method to compare severity levels
     */
    private int compareSeverity(Severity a, Severity b) {
        Map<Severity, Integer> severityOrder = Map.of(
            Severity.CRITICAL, 4,
            Severity.HIGH, 3,
            Severity.MEDIUM, 2,
            Severity.LOW, 1
        );
        return Integer.compare(severityOrder.get(a), severityOrder.get(b));
    }
    
    /**
     * Inner class to represent a security rule
     */
    private static class SecurityRule {
        private final Pattern pattern;
        private final String type;
        private final String message;
        private final String suggestion;
        private final Severity severity;
        
        public SecurityRule(Pattern pattern, String type, String suggestion, Severity severity) {
            this.pattern = pattern;
            this.type = type;
            this.message = "Found: " + type.toLowerCase();
            this.suggestion = suggestion;
            this.severity = severity;
        }
        
        // Getters
        public Pattern getPattern() { return pattern; }
        public String getType() { return type; }
        public String getMessage() { return message; }
        public String getSuggestion() { return suggestion; }
        public Severity getSeverity() { return severity; }
    }
} 