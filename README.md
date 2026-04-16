# CrowdSync 🚀

**CrowdSync** is a real-time crowd management and attendee experience platform designed for large-scale sporting venues. It provides ops intelligence for venue managers and a seamless companion experience for fans.

## ✨ Core Features

### 📊 Manager Operations Intelligence
A high-level dashboard for venue operators to monitor and coordinate crowd flow.
- **Live Heatmap**: Interactive stadium map with real-time density visualization.
- **Critical KPIs**: Track attendance, peak flow rates, and operational efficiency.
- **Bottleneck Analysis**: Automated identification of congested areas with wait-time estimates.
- **Broadcast System**: Push live coordination alerts directly to attendee mobile devices.

### 📱 Fan Companion Experience
A mobile-optimized view designed to reduce friction and improve the fan journey.
- **Smart Entry**: Recommendations for the fastest gates based on live traffic.
- **Amenity Tracking**: Live wait times for restrooms and concessions.
- **Real-time Alerts**: Direct notifications from venue management.

### ⚙️ Simulation Engine
A robust logic layer that simulates dynamic event phases (`PRE_GAME`, `LIVE`, `HALFTIME`, `POST_GAME`), driving all metrics and visualizations.

---

## 🛠 Technical Stack
- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Premium dark-mode UI with Vanilla CSS
- **Animations**: Framer Motion
- **Testing**: Vitest
- **Hosting**: Google Cloud Run (Containerized via Docker/Nginx)
- **Infrastructure**: Artifact Registry, Cloud Build

---

## 🚀 Getting Started

### Local Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

### Running Tests
Verify the simulation logic and metrics:
```bash
npm test
```

### Deployment
To deploy to Google Cloud Run:
1. Ensure `gcloud` is authenticated.
2. Update `PROJECT_ID` in `deploy.sh`.
3. Run the deployment script:
   ```bash
   ./deploy.sh
   ```

---

## 🛡️ Quality & Security
- **Accessibility (A11y)**: Built with ARIA landmarks and roles for screen-reader compatibility.
- **Security**: Hardened Docker configuration running with a non-root user (`nginx-unprivileged`).
- **Testing**: Full unit test coverage for core simulation logic.

---

## 📂 Project Structure
- `src/logic/`: Core simulation and data logic.
- `src/components/`: Reusable UI components including the interactive SVG map.
- `deploy.sh`: Automated Google Cloud deployment script.
- `Dockerfile`: Secure, multi-stage production build configuration.
