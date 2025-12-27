import os
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Initialize FastAPI
app = FastAPI(title="T5 Text Summarizer API")

# Enable CORS for React dev servers on 3000 and 3001
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Fix model path relative to this file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "..", "model", "t5_finetuned")
MODEL_PATH = os.path.abspath(MODEL_PATH)

# Load tokenizer and model
device = "cuda" if torch.cuda.is_available() else "cpu"
tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_PATH).to(device)

# Pydantic model for input
class InputText(BaseModel):
    text: str

# Summarization function
def summarize(text: str, max_output_length: int = 150) -> str:
    input_text = "Summarize: " + text
    inputs = tokenizer(
        input_text,
        return_tensors="pt",
        truncation=True,
        padding=True
    ).to(device)
    outputs = model.generate(
        **inputs,
        max_length=max_output_length,
        num_beams=4,
        early_stopping=True,
        no_repeat_ngram_size=2
    )
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

# API endpoints
@app.post("/summarize")
def summarize_api(data: InputText):
    try:
        summary_text = summarize(data.text)
        return {"summary": summary_text}
    except Exception as e:
        return {"error": str(e)}

@app.get("/")
def root():
    return {"status": "backend running"}
