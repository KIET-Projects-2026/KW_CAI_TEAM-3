import os
import torch
import pdfplumber
import docx
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from typing import Optional, List, Dict, Any

app = FastAPI(title="AI Summarizer Pro API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# PATH FIX
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "t5_finetuned")

if not os.path.exists(MODEL_PATH):
    raise RuntimeError(f"Model folder not found at: {MODEL_PATH}")

device = "cuda" if torch.cuda.is_available() else "cpu"
tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH, local_files_only=True)
model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_PATH, local_files_only=True).to(device)

class InputText(BaseModel):
    text: str
    mode: Optional[str] = "summarize" # summarize, paraphrase, simplify, bullets

class ChatRequest(BaseModel):
    message: str
    context: str

# --- SMART KEYWORD SEARCH ---
def search_context_for_answer(question: str, context: str) -> str:
    """
    Extract the most relevant sentence(s) from context using keyword matching.
    This is much more accurate for factual lookups than running through a
    summarization model.
    """
    import re

    # Normalize and clean
    q_lower = question.lower().strip().rstrip('?')
    context_sentences = [s.strip() for s in re.split(r'[.!\n]', context) if len(s.strip()) > 10]

    # Extract meaningful keywords from the question (skip stopwords)
    stopwords = {'is', 'he', 'she', 'they', 'it', 'a', 'an', 'the', 'of', 'in',
                 'for', 'and', 'to', 'was', 'are', 'what', 'who', 'how', 'why',
                 'when', 'where', 'called', 'known', 'ha', 'as', 'by', 'does'}
    keywords = [w for w in re.findall(r'\b\w+\b', q_lower) if w not in stopwords and len(w) > 2]

    if not keywords:
        return ""

    # Score each sentence by how many question keywords it contains
    scored = []
    for sent in context_sentences:
        sent_lower = sent.lower()
        score = sum(1 for kw in keywords if kw in sent_lower)
        if score > 0:
            scored.append((score, sent))

    if not scored:
        return ""

    # Return the best-matching sentence(s)
    scored.sort(key=lambda x: x[0], reverse=True)
    top_score = scored[0][0]
    # Include all sentences with the top score (up to 2)
    best = [s for sc, s in scored if sc == top_score][:2]
    return " ".join(best)

# --- GENERIC AI GENERATOR ---
def generate_ai_content(text: str, mode: str) -> str:
    # Standard T5 prefixes often work better even for derived tasks
    prefixes = {
        "summarize": "summarize: ",
        "paraphrase": "summarize: ", # T5 is best at 'summarize', we'll use sampling for variety
        "simplify": "summarize: ",
        "bullets": "summarize: ",
        "notes": "summarize: ",
        "qa": "summarize: "
    }
    
    # Custom instructions for modes that T5 might not natively support
    # We prepend these to the text but keep the 'summarize:' prefix if the model is fine-tuned for it
    if mode == "paraphrase":
        text = f"rewrite the following text in different words: {text}"
    elif mode == "simplify":
        text = f"simplify this text for a child: {text}"
    elif mode == "bullets":
        text = f"extract key points as a list: {text}"
    
    prefix = prefixes.get(mode, "summarize: ")
    
    inputs = tokenizer(
        prefix + text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=512
    ).to(device)

    # Use different generation params based on mode
    gen_config: Dict[str, Any] = {
        "max_length": 250,
        "min_length": 40,
        "num_beams": 4,
        "early_stopping": True,
        "no_repeat_ngram_size": 2,
    }

    if mode in ["paraphrase", "simplify"]:
        # Add randomness for paraphrase/simplify to avoid identical outputs
        gen_config["do_sample"] = True
        gen_config["top_k"] = 50
        gen_config["top_p"] = 0.95
        gen_config["temperature"] = 0.7
        gen_config["num_beams"] = 1 # Sampling usually better with beam size 1 or small
    elif mode == "bullets":
        gen_config["min_length"] = 20
        gen_config["repetition_penalty"] = 1.5

    outputs = model.generate(**inputs, **gen_config)
    result = tokenizer.decode(outputs[0], skip_special_tokens=True).strip()

    # Post-process bullets if the model didn't return a list
    if mode == "bullets" and not any(res.startswith(('-', '•', '*')) for res in result.split('\n')):
        # Split into sentences and add bullets
        sentences = [s.strip() for s in result.split('.') if len(s.strip()) > 10]
        if sentences:
            result = "\n".join([f"• {s}" for s in sentences])
        else:
            result = f"• {result}"

    return result

# --- ENDPOINTS ---

@app.post("/summarize")
def summarize_api(data: InputText):
    return {"summary": generate_ai_content(data.text, str(data.mode))}

@app.post("/analyze-doc")
async def analyze_doc_api(file: UploadFile = File(...)):
    name = file.filename
    content = ""
    
    if name.endswith(".pdf"):
        with pdfplumber.open(file.file) as pdf:
            content = "\n".join([page.extract_text() for page in pdf.pages if page.extract_text()])
    elif name.endswith(".docx"):
        doc = docx.Document(file.file)
        content = "\n".join([para.text for para in doc.paragraphs])
    else:
        content = (await file.read()).decode("utf-8")

    # Generate multi-part analysis
    summary = generate_ai_content(content, "summarize")
    bullets = generate_ai_content(content, "bullets")
    
    # Simple keyword extraction
    raw_words: List[str] = content.lower().split()
    # Filter for long words and ensure they are strings
    filtered_words: List[str] = [str(w) for w in raw_words if len(str(w)) > 5]
    unique_words: List[str] = sorted(list(set(filtered_words)))
    top_keywords = unique_words[:10]

    return {
        "text": content,
        "summary": summary,
        "key_points": bullets,
        "keywords": top_keywords
    }

@app.post("/chat")
def chat_api(data: ChatRequest):
    # --- TIER 1: Fast keyword-based context search ---
    # This directly extracts the most relevant sentence from the source text.
    # It's accurate for factual questions (e.g., "is he called cheeku?")
    keyword_answer = search_context_for_answer(data.message, data.context)
    
    if keyword_answer and len(keyword_answer) > 10:
        return {"reply": keyword_answer}

    # --- TIER 2: Model-based fallback ---
    # Uses the best-tested prompt format: putting context BEFORE the question
    # with the summarize prefix to leverage the model's strength.
    prompt = f"summarize: {data.context} question: {data.message}"
    
    inputs = tokenizer(
        prompt,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=512
    ).to(device)

    outputs = model.generate(
        **inputs, 
        max_length=150,
        num_beams=4,
        early_stopping=True,
        no_repeat_ngram_size=2
    )
    answer = tokenizer.decode(outputs[0], skip_special_tokens=True).strip()
    
    if not answer or len(answer) < 2:
        answer = "I'm sorry, I couldn't find a direct answer in the text. Could you rephrase your question?"

    return {"reply": answer}

@app.get("/")
def root():
    return {"status": "backend running"}
