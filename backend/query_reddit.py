from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.llms import Ollama
from dotenv import load_dotenv
import os

load_dotenv()

# Load vector store
embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
vectorstore = Chroma(persist_directory="reddit_chroma_index", embedding_function=embedding_model)

# Use local Ollama model
llm = Ollama(model="llama2", format="text")

# Set up RetrievalQA
qa = RetrievalQA.from_chain_type(
    llm=llm,
    retriever = vectorstore.as_retriever(
    search_type="mmr",
    search_kwargs={"k": 5, "lambda_mult": 0.8}  # lambda = tradeoff between relevance & diversity
),
    return_source_documents=True
)

# Ask the user
question = input("🔍 Ask your financial question: ")
response = qa.invoke(question)

# Display
print("\n📊 Answer:")
print(response["result"])

print("\n📎 Sources:")
urls = {doc.metadata.get("url", "No URL") for doc in response["source_documents"]}
for url in urls:
    print("-", url)