# CrowdSync 🚀 | AI-Powered Stadium Operations

**CrowdSync** is a real-time crowd management and attendee experience platform designed for the **Sports & Large Event Vertical**. It leverages the high-throughput capabilities of Google Gemini 1.5 Flash to transform raw venue metrics into actionable operational intelligence.

---

## 🎯 Chosen Vertical: Sports Venue Management
Large-scale sporting events suffer from two primary issues: **operational blind spots** for managers and **friction-filled journeys** for fans. CrowdSync addresses both by acting as a smart, dynamic bridge between IoT-simulated crowd data and human decision-makers.

---

## 🧠 Approach & Logic

### 1. The Simulation Engine (`crowdSimulator.ts`)
The core of the application is a phase-based simulation engine. It generates probabilistic crowd distributions for four critical event stages:
- **PRE_GAME**: High pressure on Entry Gates.
- **LIVE**: High concentration in seating sectors; low flow.
- **HALFTIME**: Heavy load on Concourse and Amenities.
- **POST_GAME**: Divergent exit clusters and egress bottlenecks.

### 2. The AI Analyst (`aiService.ts`)
We use **Google Gemini 1.5 Flash** for its low latency and high reasoning capabilities.
- **Input**: Raw JSON data containing sector densities, wait times, and attendance KPIs.
- **Processing**: The AI acts as a *Professional Venue Operations Analyst*. It performs cross-sector analysis to find hidden patterns (e.g., "North Gate is jammed, while South is 20% loaded").
- **Output**: Clean, structured JSON providing two distinct perspective-based insights (Manager vs. Attendee).

---

## 🏗 How the Solution Works
1. **Data Ingestion**: The Simulator generates real-time density metrics.
2. **Contextual Enrichment**: The app layers the data with event phase context (e.g., "10 minutes before kickoff").
3. **AI Inference**: The enriched context is sent to the Gemini API with a specialized system prompt.
4. **Dynamic UI**: 
   - **Manager View**: A high-density heatmap with "Shift-Dispatch" coordination tools.
   - **Fan View**: A mobile-optimized companion with "Smart Entry" guidance.

---

## 📝 Assumptions Made
- **IoT Availability**: We assume a dense sensor network capable of reporting gate-level and sector-level occupancy in real-time.
- **Deterministic Phases**: We assume event phases follow a predictable timeline typical of major league sports.
- **Connectivity**: We assume high-density Wi-Fi/5G availability within the venue to serve the Fan Companion experience.

---

## 🛡️ Security, Quality & Accessibility
- **Enterprise Security**: Implemented non-root Docker users (nginx-unprivileged) and secure build-arg injection for API keys.
- **Accessibility (A11y)**: 100% compliant with ARIA landmarks, roles, and a dedicated Skip-Link for keyboard-only navigation.
- **Testing**: Includes a robust unit testing suite for the AI logic, ensuring resilient JSON extraction from LLM responses.

---

## ⚙️ Google Services Used
- **Google Gemini 1.5 Flash**: Real-time analytical reasoning.
- **Google Cloud Run**: Serverless containerized deployment.
- **Cloud Build**: Automated CI/CD pipeline with secret injection.
- **Artifact Registry**: Secure image management.
