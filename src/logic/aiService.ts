import { GoogleGenerativeAI } from "@google/generative-ai";
import { CrowdData, EventPhase } from "./crowdSimulator";

const API_KEY = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
const genAI = new GoogleGenerativeAI(API_KEY);

export interface AIInsights {
    managerSuggestion: string;
    attendeeGuidance: string;
}

const SYSTEM_PROMPT = `
You are the CrowdSync AI, a professional Venue Operations Analyst for a major sporting stadium.
Your goal is to analyze real-time crowd data and provide two specific outputs:
1. Manager Suggestion: A strategic operational recommendation to optimize crowd flow, reduce wait times, or improve safety.
2. Attendee Guidance: A helpful, friendly tip for fans to improve their experience (e.g., shortest lines, best entry/exit).

Keep both outputs concise (under 30 words each). Use a professional yet helpful tone.
For density: 0-30% is Low, 31-70% is Moderate, 71-100% is Critical.
`;

export const getAIInsights = async (crowdData: CrowdData, phase: EventPhase): Promise<AIInsights> => {
    if (!API_KEY) {
        return {
            managerSuggestion: "AI Insights unavailable: API Key not configured.",
            attendeeGuidance: "Enhance your experience with real-time AI guidance (Coming soon)."
        };
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `
        Current Event Phase: ${phase}
        
        Stadium Data:
        - Total Attendance: ${crowdData.stats.totalAttendance}
        - Sector Densities: 
            * North: ${crowdData.sectorDensities.north}%
            * South: ${crowdData.sectorDensities.south}%
            * East: ${crowdData.sectorDensities.east}%
            * West: ${crowdData.sectorDensities.west}%
        - Main Gates Density: ${crowdData.zones.gates}%
        - Concourse Load: ${crowdData.zones.concourse}%
        - Critical Bottlenecks: ${crowdData.bottlenecks.map(b => `${b.area} (${b.waitMinutes}m wait)`).join(", ")}

        Provide the Manager Suggestion and Attendee Guidance in JSON format:
        { "managerSuggestion": "...", "attendeeGuidance": "..." }
        `;

        const result = await model.generateContent([SYSTEM_PROMPT, prompt]);
        const response = await result.response;
        const text = response.text();

        // Basic JSON extraction (Gemini might wrap it in markdown)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                return JSON.parse(jsonMatch[0]) as AIInsights;
            } catch (parseError) {
                console.error("AI JSON Parse Error:", parseError);
            }
        }

        return {
            managerSuggestion: "Analyzing real-time patterns... Monitor traffic at Gate G for sudden peaks.",
            attendeeGuidance: "Heads up! Concourse B usually has shorter lines during this phase."
        };
    } catch (error: any) {
        console.error("AI Insight Error Details:", error);
        return {
            managerSuggestion: "Optimizing crowd flow... Monitor South Gate traffic for upcoming peak.",
            attendeeGuidance: "Check the live dashboard for route optimizations and crowd density status."
        };
    }
};
