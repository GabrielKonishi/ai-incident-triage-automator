# AI Incident Triage Automator

📋 Project Overview
This repository contains an automated system designed to handle high-volume operational incident triaging. By integrating Google Sheets with Generative AI (Gemini 2.0) via Dify, the system transforms raw, unstructured incident reports into categorized, prioritized, and actionable data in real-time.

## 🛠️ Architecture & Tech Stack
The solution is built on a decoupled architecture to ensure flexibility and ease of maintenance:
* **Interface:** Google Sheets (as the primary data entry point).
* **Orchestration Layer:** Dify.ai for LLM workflow management.
* **LLM Model:** Gemini 2.0 Flash-Lite, chosen for its low latency and high-performance classification capabilities.
* **Back-end Logic:** Google Apps Script (JavaScript V8) for API handling and spreadsheet manipulation.

## ⚙️ Core Features
* **Automated Classification:** Identifies incident category and urgency levels using few-shot prompting techniques.
* **Structured Output:** Enforces strict output formatting for seamless integration with downstream data tools.
* **Security-First Design:** Implements secure API key management using environment-like variables (Script Properties) to prevent credential exposure.
* **Error Handling:** Robust try-catch implementation and Utilities.sleep logic to respect API rate limits and ensure script stability.
* **Visual Feedback:** Dynamic UI updates within the spreadsheet, including status messages and priority-based conditional formatting.

## 🚧 Future Roadmap
This project is in continuous evolution. Planned updates include:
* **Automated Triggers:** Implementing `onEdit` triggers for real-time analysis without manual clicks.
* **Notification System:** Integrating Email or Telegram alerts for high-priority incidents.
* **Analytics Dashboard:** A dedicated Google Sheets tab for statistical visualization of incident trends.
  
## 🚀 Setup & Deployment
1. **Workflow Setup:** Export the dify_workflow.yml and import it into your Dify workspace.
  * Import the `incident_triage_workflow.yml` file into your [Dify.ai](https://dify.ai) account.
  * Publish the workflow and copy your **API Key**.
  * Add the API Key to your Google Apps Script "Script Properties".
2. **App Script Configuration:**
  * Navigate to Extensions > Apps Script in your Google Sheet.
  * Deploy the provided script.gs code.
  * Set the DIFY_API_KEY in the Script Properties menu.
  * Execution: Trigger the analysis via the spreadsheet's custom menu or assigned buttons.
