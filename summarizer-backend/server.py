from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os

app = FastAPI()

# ✅ Add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

@app.post("/summarize")
async def summarize(request: Request):
    data = await request.json()
    text = data.get("text", "")[:4000]  # Limit

    prompt = f"""Summarize this text in 5-6 sentences. Then extract 5 key terms from the text and define each in 1 line.\n\n{text}"""

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "llama3-8b-8192",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 600
    }

    async with httpx.AsyncClient() as client:
        response = await client.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload)
        result = response.json()

        if 'choices' not in result:
            return {"summary": "Error: No summary returned.", "appendix": "", "raw": result}

        content = result['choices'][0]['message']['content']

        # Smarter split: Look for the phrase the model actually uses
        split_key = "Here are 5 key terms"
        parts = content.split(split_key)

        summary_text = parts[0].strip()
        appendix_text = (split_key + parts[1].strip()) if len(parts) > 1 else ""

        return {
            "summary": summary_text,
            "appendix": appendix_text
        }