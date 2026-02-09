import os
import torch
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

app = FastAPI(title="Text Summarizer API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# PATH FIX (models, not model)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "t5_finetuned")

# SAFETY CHECK
if not os.path.exists(MODEL_PATH):
    raise RuntimeError(f"Model folder not found at: {MODEL_PATH}")

device = "cuda" if torch.cuda.is_available() else "cpu"

tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH, local_files_only=True)
model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_PATH, local_files_only=True).to(device)

class InputText(BaseModel):
    text: str

def summarize(text: str) -> str:
    prefix = "summarize the following text in a professional and concise manner: "
    
    inputs = tokenizer(
        prefix + text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=512
    ).to(device)

    outputs = model.generate(
        **inputs,
        max_length=150,
        min_length=40,
        do_sample=False,
        no_repeat_ngram_size=3,
        repetition_penalty=2.5
    )

    return tokenizer.decode(outputs[0], skip_special_tokens=True)

@app.post("/summarize")
def summarize_api(data: InputText):
    return {"summary": summarize(data.text)}

@app.get("/")
def root():
    return {"status": "backend running"}
