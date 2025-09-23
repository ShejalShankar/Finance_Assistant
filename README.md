# Financial Insight Assistant
A full-stack, AI-powered assistant that interprets real-time Reddit investor sentiment and overlays it with 5-day stock price trends — delivering concise, actionable insights on trending market topics.
Built to help users cut through noise, it combines conversational AI with financial data to reveal what retail investors are really thinking.

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


