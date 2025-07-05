
# 🌐 Page & Text Summarizer Chrome Extension

A Chrome Extension that allows users to **summarize any web page** or **paste their own text** for quick summarization along with a keyword appendix — powered by **Groq’s LLaMA API**.

---

## 🚀 Features

✅ Summarize the content of the current web page in one click  
✅ Paste your own text and get a clean, quick summary  
✅ Extracts and defines key terms (Appendix) automatically  
✅ Copy Summary or Appendix easily to clipboard  
✅ Shows loading spinner while processing  

---

## 🛠 Tech Stack

| Frontend | Backend | AI |
|----------|---------|----|
| HTML, CSS, JavaScript | FastAPI (Python) | Groq (LLaMA 3 Model)  

---

## 📦 Folder Structure

```
summarizerExtension/
│
├── manifest.json
├── popup.html
├── popup.js
├── content.js
│
├── summarizer-backend/
│   ├── server.py
│   └── requirements.txt
```

---

## 🔑 How It Works

1. **User clicks "Summarize This Page"** → Extension scrapes visible text → Sends to backend for summary & appendix.
2. **User pastes text and clicks "Summarize This Text"** → Sends directly to backend for summary & appendix.
3. The backend uses **Groq’s LLaMA 3 API** to generate concise summaries and keyword definitions.

---

## 📝 Setup Instructions

### 1. Clone This Repository
```bash
git clone https://github.com/yourusername/summarizerExtension.git
cd summarizerExtension
```

---

### 2. Backend Setup (FastAPI + Groq)

1. Go to `summarizer-backend` folder:
   ```bash
   cd summarizer-backend
   python3 -m venv venv
   source venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create `.env` file:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. Run the server:
   ```bash
   uvicorn server:app --host 0.0.0.0 --port 8000
   ```

✅ You can also deploy this on [Render](https://render.com) for free.

---

### 3. Frontend (Chrome Extension)

1. Go to Chrome → Extensions → Enable **Developer Mode**
2. Click **Load Unpacked** → Select your `summarizerExtension` folder.
3. Pin the extension and start using it.

---

## 💡 Example Use Cases

- Quick study and revision from articles, blogs, PDFs
- Generating glossary terms for educational content
- Summarizing technical documentation or research papers

---

## 📝 Future Ideas

- Export summaries as PDF/Markdown
- Offline summarization using local models (future)
- Multiple language support

---

## 🙌 Credits

Built using:
- 🦙 Groq's LLaMA API
- ⚡ FastAPI
- ❤️ HTML, CSS, JS
