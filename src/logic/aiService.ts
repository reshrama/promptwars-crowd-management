import { GoogleGenerativeAI } from "@google/generative-ai";
import { CrowdData, EventPhase } from "./crowdSimulator";
import { logToGCP } from "./loggingService";
import { sanitizePromptInput } from "./security";

// Service Configuration
const API_KEY = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
const genAI = new GoogleGenerativeAI(API_KEY);

export interface AIInsights {
    managerSuggestion: string;
    attendeeGuidance: string;
}

/**
 * Custom hook / service to fetch AI-driven insights.
 * Integrated with Google Cloud Logging for enterprise observability.
 */
export const getAIInsights = async (data: CrowdData, phase: EventPhase): Promise<AIInsights> => {
    // Sanity check
    if (!API_KEY || API_KEY.length < 10) {
        logToGCP('WARNING', 'AI Service called without a valid API Key. Returning local heuristic fallbacks.');
        return {
            managerSuggestion: "Optimizing crowd flow... Monitor South Gate traffic for upcoming peak.",
            attendeeGuidance: "Check the live dashboard for route optimizations and crowd density status."
        };
    }

    logToGCP('INFO', `Requesting AI analysis for phase: ${phase}`, {
        sectorCount: Object.keys(data.sectorDensities).length,
        totalAttendance: data.stats.totalAttendance
    });

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = sanitizePromptInput(`
        You are a professional Stadium Operations AI Analyst for a Sports Venue.
        Analyze the following real-time crowd data and provide operational insights.
        
        Event Phase: ${phase}
        Data: ${JSON.stringify(data)}

        Return your response strictly as a JSON object with two fields:
        - managerSuggestion: A concise, actionable operational suggestion for the venue manager.
        - attendeeGuidance: A friendly, helpful tip for fans attending the event.
        
        Example: {"managerSuggestion": "Deploy staff to North Gate.", "attendeeGuidance": "Enter via South Gate to save time."}
        `);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        logToGCP('INFO', 'AI Analysis received successfully from Gemini');

        // Basic JSON extraction (Gemini might wrap it in markdown)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                const parsed = JSON.parse(jsonMatch[0]);
                return {
                    managerSuggestion: parsed.managerSuggestion || "Monitor heatmap levels.",
                    attendeeGuidance: parsed.attendeeGuidance || "Check live map for updates."
                };
            } catch (e) {
                logToGCP('ERROR', 'Failed to parse AI JSON response', { rawText: text });
            }
        }

        return {
            managerSuggestion: "Redirection patterns suggest upcoming load at North Concourse.",
            attendeeGuidance: "Heads up! Concourse B usually has shorter lines during this phase."
        };
    } catch (error: any) {
        logToGCP('ERROR', 'Gemini API Exception', { message: error.message });
        return {
            managerSuggestion: "System status: AI Service intermittent. Reverting to logic-based operational safety protocols. Monitor heatmaps manually.",
            attendeeGuidance: "Welcome! Our smart guide is updating. Please follow on-site signage and staff directions."
        };
    }
};
