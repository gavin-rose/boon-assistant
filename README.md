# Boon: Event Assistant
**#BuildHybridAI 2026 Hackathon Submission**

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Firebase](https://img.shields.io/badge/Firebase-AI%20Logic-orange.svg)](https://firebase.google.com/docs/ai-logic)
[![Gemini](https://img.shields.io/badge/Gemini-Nano%20%26%201.5%20Flash-4285F4.svg)](https://deepmind.google/technologies/gemini/)

> **Boon** is an offline-first hybrid AI event assistant built for conferences, expos, and conventions. It runs real-time note triage directly on your device using **Gemini Nano** via the **Firebase AI Logic Hybrid Inference SDK**, and automatically engages **Cloud Gemini** when connected to execute deep cross-session executive summaries, and draft tailored follow-up outreach.

---

## The Problem: Deadzones
Large events in all sorts of places for all kinds of people suffer from cellular network congestion and unreliable Wi-Fi. Participants are expected to digest, engage, and summarize:
1. **Keynote & Technical Sessions**: Speakers present dense architectures and obscure acronyms at high speeds. Attendees cannot look up terms or formulate concise microphone questions without internet.
2. **Expo Floor & Booth Interactions**: Walking away from dozens of vendor booths leaves attendees with disorganized notes and forgotten contact details.
3. **Post-Event Debriefs**: Days later, attendees struggle to turn fragmented notes into an executive briefing or remember who to follow up with.

---

## The Solution: Cooperative Hybrid Architecture

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
[On-Floor / Offline]                         [Reconnected / Hotel]
Firebase AI Logic (On-Device Preferred)         Firebase AI Logic (Cloud Engine)
InferenceMode.PREFER_ON_DEVICE                  InferenceMode.ONLY_IN_CLOUD
           │                                                 │
   1. SESSIONS                                       3. SUMMARIES
   - Live and local scribe                           - Macro cross-session trend detection
   - Quick and actionable takeaway extraction        - High-impact Executive Debrief memo
   - Buzz Word tracking & glossary                   - Personalized follow-up email drafts
   - Q&A questions                                   - Post-event prioritized action plan
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

## Core Features

### 1. Sessions *(Talks, Keynotes, Panels, Workshops)*
* **Real-Time Voice Dictation**: Hands-free speech-to-text directly in the browser via the Web Speech API.
* **Instant Takeaway Extraction**: Gemini Nano summarizes disorganized shorthand into top key actionable bullets with sub-50ms latency.
* **On-Device Buzz Word definitions**: Detects acronyms (e.g., eBPF, CRDT, WASM, RAG, CDC) and explains them instantly in the margin without sending network requests.
* **Q&A Question Creation**: Polishes raw thoughts into articulate, high-level questions ready to ask the speaker.

### 2. Interactions *(Booth Visits, Hallway Track, 1-on-1 Chats)*
* **Rapid Floor Scribe**: Type or dictate notes immediately after walking away from a vendor or lead.
* **Contact Triage & Completeness Check**: Gemini Nano parses the notes into structured company, role, opportunity, and urgency tiers (`High`, `Medium`, `Low`).
* **Missing Details Alert**: Warns the attendee immediately (e.g., *"⚠️ Missing direct email for Marcus"*) so they can get it before leaving the hall.

### 3. Summaries *(Cross-Event Cloud Synthesis)*
* **Debriefing**: Generates a polished 3-paragraph executive memo detailing macro market patterns and business value.
* **Detected Trends**: Synthesizes themes observed across multiple talks and vendors into strategic insights.
* **Tailored Follow-Ups**: Generates bespoke, context-aware emails for each person met with 1-click clipboard copy.
* **Action Plan**: Outlines concrete post-event technical spikes, evaluations, and follow-ups.

---

## Tech Stack

* **Frontend**: React, TypeScript, Vite, Tailwind
* **PWA & Offline**: `vite-plugin-pwa` with Workbox Service Worker caching
* **Firebase SDKs**:
  * **Firebase AI Logic (`firebase/ai`)**: Hybrid inference orchestrator using `InferenceMode.PREFER_ON_DEVICE` and `InferenceMode.ONLY_IN_CLOUD`.
  * **Cloud Firestore**: Configured with `persistentLocalCache` and `persistentMultipleTabManager` for zero-latency local IndexedDB persistence with automatic cloud synchronization.
  * **Firebase App Check**: Securing cloud endpoints with debug token support.
  * **Firebase Hosting**: Fast static deployment with custom security headers.

---

## Quick Start

### 1. Prerequisites
* Node.js v20+ 
* Google Chrome (recommended for native Gemini Nano Built-in AI)

### 2. Installation
```bash
git clone https://github.com/gavin-rose/boon-assistant.git
cd boon-assistant
npm install
```

### 3. Running Locally
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Testing the full hybrid AI experience
* Toggle the deadzone simulator on and off to test local inference for sessions and interactions as well as cloud inference for summaries. Note that when you do have a connection and you are not using the simulator, the local inference is preferred for sessions and interactions but not guaranteed.

---

## License
This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
