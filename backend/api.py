from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.llms import Ollama
from dotenv import load_dotenv
from langchain.prompts import PromptTemplate
from fastapi.responses import JSONResponse
import yfinance as yf
from fastapi import Query
import os

load_dotenv()
# Initialize app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Input model
class Question(BaseModel):
    question: str

# Load vector DB
embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
vectorstore = Chroma(persist_directory="reddit_chroma_index", embedding_function=embedding_model)

# Use local LLaMA 2 via Ollama
llm = Ollama(
    model="mistral",
    temperature=0.7,
    num_predict=512
)
prompt_template = PromptTemplate.from_template("""
You are a financial analyst tasked with summarizing Reddit investor sentiment.

Question: {question}

Here are Reddit post excerpts:
{context}

Please provide a concise, objective 3–5 line summary based on the posts.
""")



# Setup RetrievalQA with MMR for diversity
qa = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=vectorstore.as_retriever(
        search_type="mmr",
        search_kwargs={"k": 3}
    ),
    chain_type="stuff",  # 👈 Add this
    chain_type_kwargs={"prompt": prompt_template},
    return_source_documents=True
)
def infer_sentiment(text: str) -> str:
    text = text.lower()
    if any(word in text for word in ["bullish", "buying", "optimistic", "strong", "positive", "rising"]):
        return "Bullish"
    elif any(word in text for word in ["bearish", "selling", "pessimistic", "weak", "crash", "negative", "falling"]):
        return "Bearish"
    else:
        return "Mixed"

@app.post("/ask")
def ask(question: Question):
    try:
        result = qa.invoke(question.question)

        # Sentiment logic here
        sentiment = infer_sentiment(result["result"])

        unique_urls = {doc.metadata.get("url", "No URL") for doc in result["source_documents"]}
        
        return {
            "answer": result["result"],
            "sentiment": sentiment,
            "sources": list(unique_urls)
        }

    except Exception as e:
        print("ERROR:", e)
        return {
            "answer": "Error processing your request.",
            "sentiment": "Unknown",
            "sources": []
        }

from fastapi import Query
from fastapi.responses import JSONResponse
import yfinance as yf

@app.get("/stock-data")
def get_stock_data(ticker: str = Query(..., description="Ticker symbol like AAPL or TSLA")):
    try:
        stock = yf.Ticker(ticker)
        hist = stock.history(period="5d")
        hist.reset_index(inplace=True)

        # Clean date and reduce payload
        hist["Date"] = hist["Date"].dt.strftime("%Y-%m-%d")
        data = hist[["Date", "Open", "High", "Low", "Close", "Volume"]].to_dict(orient="records")

        return JSONResponse(content={
            "ticker": ticker.upper(),
            "history": data  # This will now be a proper list, not a string
        })

    except Exception as e:
        print("ERROR:", e)
        return JSONResponse(status_code=500, content={"error": "Could not retrieve stock data"})

    
# @app.post("/debug")
# def debug_test(q: Question):
#     docs = vectorstore.similarity_search(q.question, k=3)
#     context = "\n".join(doc.page_content for doc in docs)
#     full_prompt = prompt_template.format(context=context, question=q.question)

#     print("\n=== FINAL PROMPT ===")
#     print(full_prompt)

#     raw = llm.invoke(full_prompt)

#     print("\n=== RAW LLM OUTPUT ===")
#     print(raw)

#     return {"answer": raw} 

