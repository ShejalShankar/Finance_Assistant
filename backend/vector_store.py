import json
import os
from dotenv import load_dotenv
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document

load_dotenv()

# Load Reddit posts
with open("reddit_posts.json", "r") as f:
    posts = json.load(f)

# Prepare documents
documents = []
for post in posts:
    content = f"Title: {post['title']}\n\nBody: {post['text']}"
    documents.append(Document(page_content=content, metadata={"subreddit": post["subreddit"], "url": post["url"]}))

# Split text into chunks
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
docs = text_splitter.split_documents(documents)

# Embed and store with FAISS
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
vectorstore = Chroma.from_documents(docs, embeddings, persist_directory="reddit_chroma_index")
vectorstore.persist()

print(f"✅ Embedded and saved {len(docs)} chunks to reddit_faiss_index/")
