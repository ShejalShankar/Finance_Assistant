# Financial Insight Assistant
Empowering investors to understand the pulse of the market, Financial Insight Assistant leverages conversational AI to reveal what retail traders are talking about—and whether their optimism matches the latest price moves. Instantly surface the hottest debates and data-driven opinions across Reddit, paired with smart trend visualizations, for informed, confident investing. Built with a modern stack—RAG for retrieval-augmented generation, FastAPI for efficient backend APIs, React for a seamless front end, plus integration with the Reddit and Yahoo Finance APIs to deliver rich, real‑time insights.

## Features
- 💬 Ask natural language questions like _“What’s going on with Tesla stock?”_
- 🔍 Extracts ticker with over **92% accuracy** using rule-based NLP
- 🧠 Uses **LangChain + Mistral (via Ollama)** for contextual understanding
- 💡 Retrieves Reddit discussions and ranks them using **ChromaDB + HuggingFace embeddings**
- 📈 Displays real-time **5-day stock chart** using yFinance and Recharts
- 🗂️ Remembers previous questions and supports **chat-style interface**
- 🖥️ Built with modern full-stack technologies — React + FastAPI

## Tech Stack
| Layer       | Tech                                              |
|-------------|---------------------------------------------------|
| Frontend    | React, TypeScript, TailwindCSS, Recharts          |
| Backend     | FastAPI (Python)                                  |
| AI Engine   | LangChain + Mistral 7B (via Ollama)               |
| Embeddings  | HuggingFace Sentence Transformers                 |
| Vector DB   | ChromaDB                                          |
| Stock Data  | [yFinance](https://github.com/ranaroussi/yfinance) |
| Sources     | Reddit (via API / scraped posts)                  |

## Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/financial-insight-assistant.git
cd financial-insight-assistant
```
### 2. Start Backend
```bash
cd backend
pip install -r requirements.txt
ollama run mistral
uvicorn api:app --reload
```
### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
### 4. UI
A quick look at the current UI
<img width="1200" height="851" alt="Screenshot (206)" src="https://github.com/user-attachments/assets/378f42bc-ba73-4d4b-8a96-81153f1b267e" />

