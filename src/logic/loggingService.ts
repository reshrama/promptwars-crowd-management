/**
 * Google Cloud Logging Utility
 * Formats logs for high-fidelity consumption by Cloud Logging (GCP).
 * In Cloud Run, structured JSON logs on stdout/stderr are automatically 
 * parsed into high-severity entries.
 */

type LogSeverity = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL' | 'DEBUG';

interface LogEntry {
    severity: LogSeverity;
    message: string;
    timestamp: string;
    service: string;
    metadata?: Record<string, any>;
}

export const logToGCP = (severity: LogSeverity, message: string, metadata?: Record<string, any>) => {
    const entry: LogEntry = {
        severity,
        message,
        timestamp: new Date().toISOString(),
        service: 'crowdsync-ai-service',
        metadata
    };

    // Writing to console in structured JSON for Cloud Run ingestion
    if (severity === 'ERROR' || severity === 'CRITICAL') {
        console.error(JSON.stringify(entry));
    } else {
        console.log(JSON.stringify(entry));
    }
};
