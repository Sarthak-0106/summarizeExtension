from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os

app = FastAPI()

# ✅ Enable CORS for all origins (good for development, tighten for production)
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
    text = data.get("text", "").strip()[:4000]  # Limit to avoid token overflow

    if not text:
        return {"summary": "No input provided.", "appendix": ""}

    word_count = len(text.split())
    
    # 1️⃣ Short text → single term explanation
    if word_count <= 3:
        prompt = f"""
            You are a helpful study assistant. Provide a **clear, beginner-friendly explanation** of the following term or phrase in 4-5 lines:

            Term: {text}
            """
        max_tokens = 400
    else:
        # 2️⃣ Longer text → summary + appendix
        prompt = f"""
            You are a helpful study assistant.

            1️⃣ Summarize the following text in 5-6 concise sentences.
            2️⃣ Extract up to 5 important keywords or terms from the text.
            3️⃣ For each keyword, provide a one-line definition.

            Text:
            \"\"\"
            {text}
            \"\"\"

            Please format your response exactly as:

            Summary:
            <summary here>

            Appendix:
            1. Term: Definition
            2. Term: Definition
            3. Term: Definition
            4. Term: Definition
            5. Term: Definition
            """
        max_tokens = 700

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "llama3-8b-8192",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": max_tokens
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=payload
        )

        result = response.json()

        if 'choices' not in result or not result['choices']:
            return {"summary": "Error: No summary returned.", "appendix": "", "raw": result}

        content = result['choices'][0]['message']['content'].strip()

        # 📝 Smarter splitting based on headings
        if "Appendix:" in content:
            parts = content.split("Appendix:")
            summary_text = parts[0].replace("Summary:", "").strip()
            appendix_text = "Appendix:\n" + parts[1].strip()
        else:
            summary_text = content
            appendix_text = ""

        return {
            "summary": summary_text,
            "appendix": appendix_text
        }
