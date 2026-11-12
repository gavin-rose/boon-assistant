# Boon: Event Assistant
**#BuildHybridAI Hackathon Submission**

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Firebase](https://img.shields.io/badge/Firebase-AI%20Logic-orange.svg)](https://firebase.google.com/docs/ai-logic)
[![Gemini](https://img.shields.io/badge/Gemini-Nano%20%26%201.5%20Flash-4285F4.svg)](https://deepmind.google/technologies/gemini/)

> **Boon** is an intelligent, offline-first hybrid AI event copilot built for conferences, expos, and conventions. It runs real-time voice-and-text note triage directly on your device using **Gemini Nano** via the **Firebase AI Logic Hybrid Inference SDK**, and automatically engages **Cloud Gemini** when connected to execute deep cross-session executive synthesis and draft tailored follow-up outreach.

---

## ⚡ The Problem: The Convention Dead-Zone
Large industry events (AWS re:Invent, CES, Google I/O, SaaStr) suffer from severe cellular network congestion and unreliable captive Wi-Fi portals. Attendees face high cognitive overload:
1. **Keynote & Technical Sessions**: Speakers present dense architectures and obscure acronyms at high speeds. Attendees cannot look up terms or formulate concise microphone questions without internet.
2. **Expo Floor & Booth Interactions**: Walking away from dozens of vendor booths leaves attendees with disorganized notes and forgotten contact details.
3. **Post-Event Synthesis Bottleneck**: Days later, attendees struggle to turn fragmented notes into an executive briefing or remember who to follow up with.

---

## 🚀 The Solution: Cooperative Hybrid Architecture

Boon solves this with a deliberate, cooperative division of labor between on-device and cloud inference:

```
┌────────────────────────────────────────────────────────────────────────┐
│                               BOON PWA                                 │
│  - Works 100% offline via Service Worker & IndexedDB Persistence       │
│  - Built-in "Deadzone Simulator" toggle for testing & evaluation       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           │                                                 │
[⚡ On-Floor / Offline]                         [☁️ Reconnected / Hotel]
Firebase AI Logic (On-Device Preferred)         Firebase AI Logic (Cloud Engine)
InferenceMode.PREFER_ON_DEVICE                  InferenceMode.ONLY_IN_CLOUD
           │                                                 │
   1. SESSIONS                                       3. SUMMARIES
   - Live stream-of-consciousness scribe             - Macro cross-session trend detection
   - Sub-50ms actionable takeaway extraction         - High-impact Executive Debrief memo
   - On-device Jargon Buster & glossary              - Personalized follow-up email drafts
   - Microphone-ready Q&A questions                  - Post-event prioritized action plan
           │                                                 │
   2. INTERACTIONS                                           │
   - Instant lead & opportunity triage                       │
   - Deal potential & urgency classification                 │
   - Missing detail alert (e.g. missing email)               │
           │                                                 │
           └────────────────────────┬────────────────────────┘
                                    │
                         ┌──────────┴──────────┐
                         │      Firestore      │
                         │ (persistentLocal-   │
                         │ Cache & Auto-Sync)  │
                         └─────────────────────┘
```

---

## 🛠️ Terminology & Core Features

### 1. 🎙️ Sessions *(Talks, Keynotes, Panels, Workshops)*
* **Real-Time Voice Dictation**: Hands-free speech-to-text directly in the browser via the Web Speech API.
* **Instant Takeaway Extraction**: Gemini Nano summarizes disorganized shorthand into top key actionable bullets with sub-50ms latency.
* **On-Device Jargon Buster**: Detects acronyms (e.g., eBPF, CRDT, WASM, RAG, CDC) and explains them instantly in the margin without sending network requests.
* **Microphone-Ready Q&A Polisher**: Polishes raw attendee thoughts into articulate, high-level questions ready to ask at the auditorium microphone.

### 2. 🤝 Interactions *(Booth Visits, Hallway Track, 1-on-1 Chats)*
* **Rapid Floor Scribe**: Type or dictate notes immediately after walking away from a vendor or lead.
* **On-Site Triage & Completeness Check**: Gemini Nano parses the notes into structured company, role, opportunity, and urgency tiers (`🔥 High`, `Medium`, `Low`).
* **Missing Details Alert**: Warns the attendee immediately (e.g., *"⚠️ Missing direct email for Marcus"*) so they can turn around and get it before leaving the hall.

### 3. 📊 Summaries *(Cross-Event Cloud Synthesis)*
* **Executive Trip ROI Memo**: Generates a polished 3-paragraph executive memo detailing macro market patterns and business value to justify the company travel budget.
* **Detected Industry Trends**: Synthesizes themes observed across multiple talks and vendors into strategic insights.
* **Tailored Follow-Up Emails**: Generates bespoke, context-aware emails for each person met with 1-click clipboard copy.
* **Action Plan**: Outlines concrete post-event technical spikes, POC evaluations, and follow-ups.

---

## 💻 Tech Stack

* **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
* **PWA & Offline**: `vite-plugin-pwa` with Workbox Service Worker caching
* **Firebase SDKs**:
  * **Firebase AI Logic (`firebase/ai`)**: Hybrid inference orchestrator using `InferenceMode.PREFER_ON_DEVICE` and `InferenceMode.ONLY_IN_CLOUD`.
  * **Cloud Firestore**: Configured with `persistentLocalCache` and `persistentMultipleTabManager` for zero-latency local IndexedDB persistence with automatic cloud synchronization.
  * **Firebase App Check**: Securing cloud endpoints with debug token support.
  * **Firebase Hosting**: Fast static deployment with custom security headers.

---

## 🏃 Quick Start & Testing Instructions

### 1. Prerequisites
* Node.js v20+ 
* Google Chrome (recommended for native Gemini Nano Built-in AI)

### 2. Installation
```bash
git clone https://github.com/your-username/boon.git
cd boon
npm install
```

### 3. Running Locally
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. How to Test the Hybrid Experience (For Hackathon Judges)
1. **Test On-Device Speed (⚡)**:
   * Go to **Sessions** and click **"New Session Note"** → Click **"Load Sample Keynote"** → Click **"Structure with Gemini Nano"**.
   * Notice the **`⚡ On-Device [~40ms]`** badge, structured takeaways, jargon definitions, and polished Q&A questions.
2. **Test Deadzone Simulation**:
   * Click **"Simulate Deadzone"** in the top navigation bar (or disconnect your Wi-Fi).
   * Go to **Interactions** → Click **"Load Sample Booth Chat"** → Click **"Structure with Gemini Nano"**.
   * The app structures the lead and surfaces the missing email alert 100% offline without dropping a frame.
3. **Test Cloud Synthesis (☁️)**:
   * Turn off deadzone simulation (or reconnect Wi-Fi).
   * Go to **Summaries** and click **"Generate Cloud Synthesis"**.
   * Watch the **`☁️ Firebase AI Logic Cloud`** engine synthesize all sessions and interactions into the executive debrief, trend matrix, and follow-up emails.

---

## 📄 License
This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
