import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
from langchain_openai import ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
import json
from datetime import datetime

# Load environment variables
load_dotenv()

app = FastAPI(title="Co-creation Agent API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GameRequest(BaseModel):
    card1: str
    card2: str
    constraints: str = ""  # optional

class QueryRequest(BaseModel):
    query: str

class CoCreationResponse(BaseModel):
    response: dict
    context_used: List[str]

def save_game_output(output: dict, path: str = "game_library.jsonl"):
    """Save the generated game to a JSONL file"""
    try:
        # Add timestamp to the output
        output["timestamp"] = datetime.now().isoformat()
        
        # Create the file if it doesn't exist
        if not os.path.exists(path):
            with open(path, "w", encoding="utf-8") as f:
                pass
        
        # Append to the file
        with open(path, "a", encoding="utf-8") as f:
            f.write(json.dumps(output) + "\n")
            
        print(f"Successfully saved output to {path}")
    except Exception as e:
        print(f"Error saving output to {path}: {str(e)}")

def create_rag_chain():
    """Create a RAG chain for game-related queries"""
    # Initialize the language model
    llm = ChatOpenAI(
        model_name="gpt-3.5-turbo",
        temperature=0.7
    )
    
    # Create embeddings
    embeddings = OpenAIEmbeddings()
    
    # Create a simple text splitter
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    
    # Create a simple vector store with some example game rules
    texts = [
        "Football is a team sport played with a ball between two teams of 11 players.",
        "Basketball is played on a rectangular court with a hoop at each end.",
        "Yoga combines physical postures, breathing exercises, and meditation.",
        "Tag is a playground game where one player chases others to touch them.",
        "Dance involves rhythmic movement of the body, usually to music."
    ]
    
    # Split texts into chunks
    docs = text_splitter.create_documents(texts)
    
    # Create vector store
    vectorstore = FAISS.from_documents(docs, embeddings)
    
    # Create retriever
    retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 3}
    )
    
    # Create RAG chain
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True
    )
    
    return qa_chain

@app.on_event("startup")
def startup_event():
    global qa_chain
    qa_chain = create_rag_chain()
    print("RAG Chain initialized")

@app.post("/supervisor/combine")
async def combine_cards(request: GameRequest) -> Dict[str, Any]:
    """Combine two cards into a new game using RAG"""
    try:
        # Prompt the AI to generate full game content as JSON
        prompt = (
            f"Combine {request.card1} and {request.card2} into a new game"
            f"{(' with constraints: ' + request.constraints) if request.constraints else ''}. "
            "Return a JSON object with keys: description (string), rules (list of step-by-step instructions), "
            "materials_needed (list of strings), and safety_considerations (list of strings)."
        )
        result = qa_chain({"query": prompt})
        # Parse the AI's JSON output
        parsed = json.loads(result["result"])
        # Construct the final response using AI-generated fields
        response = {
            "game_name": f"{request.card1.capitalize()} {request.card2.capitalize()} Fusion",
            **parsed
        }
        
        # Save the response
        save_game_output(response)
        
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/supervisor/ask")
async def ask_question(request: QueryRequest) -> Dict[str, Any]:
    """Handle general questions about games using RAG"""
    try:
        # Get response from RAG chain
        result = qa_chain({"query": request.query})
        
        response = {
            "response": result["result"],
            "suggestions": [
                "Try combining different sports",
                "Consider indoor/outdoor variations",
                "Think about group size"
            ]
        }
        
        # Save the response
        save_game_output(response)
        
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 