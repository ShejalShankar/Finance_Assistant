from fastapi import FastAPI
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from langchain_openai import OpenAI  # updated import

load_dotenv()

app = FastAPI()

llm = OpenAI(openai_api_key=os.getenv("OPENAI_API_KEY"))

class Prompt(BaseModel):
    question: str

@app.post("/ask")
def ask_question(prompt: Prompt):
    try:
        response = llm.invoke(prompt.question)
        return {"answer": response}
    except Exception as e:
        print("Error:", e)
        return {"error": str(e)}
