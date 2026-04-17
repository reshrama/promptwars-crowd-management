/**
 * Security Utility: LLM Prompt Sanitization
 * Mitigates "Prompt Injection" risk vectors by stripping 
 * potentially malicious control characters or overrides.
 */

export const sanitizePromptInput = (input: string): string => {
    if (!input) return "";

    // Remove common injection patterns and control characters
    return input
        .replace(/[<>]/g, '') // Strip HTML tags
        .replace(/ignore previous instructions/gi, '[REDACTED]')
        .replace(/you are now/gi, '[REDACTED]')
        .trim()
        .slice(0, 1000); // Enforce character limits
};

/**
 * Enterprise Token Validation
 * (Simulation of secure service-to-service handshake)
 */
export const validateServiceToken = (token: string): boolean => {
    return !!token && token.startsWith('AIza');
};
