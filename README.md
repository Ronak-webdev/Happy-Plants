# Happy Plants - AI Plant Doctor 🌿

Happy Plants is a premium AI-powered assistant designed to help you care for your plants. It identifies plants and diagnoses diseases using multi-modal AI models (Gemini 2.0 Flash, Qwen 2.5 VL, and Llama 3.2 Vision).

## Features

- **Plant Diagnosis:** Upload photos to identify issues and get cures.
- **Strict Botanical Persona:** Focused only on plant-related care.
- **Voice Input:** Use your microphone to ask questions.
- **Drag & Drop:** Easily upload images by dragging them into the chat.
- **Modern UI:** Premium glassmorphism design with a responsive layout.

## Setup Instructions

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Configuration
Create a `.env` file in the root directory and add your OpenRouter API key:
```env
OPENROUTER_API_KEY=your_api_key_here
```

### 4. Running the App
Start the local server:
```bash
npm start
```
Open `http://localhost:3000` in your browser.

## Security Note
The project is configured with a `.gitignore` file to ensure that your `.env` (API keys) and `node_modules` are not uploaded to GitHub. Never share your `.env` file publicly.

---
🌿 *Keep your plants happy!*
