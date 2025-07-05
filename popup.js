const resultDiv = document.getElementById('result');
const appendixDiv = document.getElementById('appendix');
const loadingDiv = document.getElementById('loading');  // if you added spinner

document.getElementById('summarizeBtn').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const tabId = tabs[0].id;

    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    }, () => {
      chrome.tabs.sendMessage(tabId, { action: "extractText" }, async function(response) {
        resultDiv.innerText = '';
        appendixDiv.innerHTML = '';
        if (loadingDiv) loadingDiv.style.display = 'block';  // 🔥 show spinner

        if (chrome.runtime.lastError) {
          resultDiv.innerText = 'Error: ' + chrome.runtime.lastError.message;
          if (loadingDiv) loadingDiv.style.display = 'none';
          return;
        }

        if (response && response.content) {
          try {
            const { summary, appendix } = await summarizeText(response.content);

            resultDiv.innerText = summary || 'No summary.';
            if (appendix) {
                appendixDiv.innerText = appendix.trim();
            }

          } catch (err) {
            resultDiv.innerText = 'Error fetching summary.';
          } finally {
            if (loadingDiv) loadingDiv.style.display = 'none';  // ✅ hide spinner
          }
        } else {
          resultDiv.innerText = 'No content found.';
          if (loadingDiv) loadingDiv.style.display = 'none';
        }
      });
    });
  });
});

async function summarizeText(text) {
  const response = await fetch("https://summarizeextension.onrender.com/summarize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: text })
  });

  const data = await response.json();
  return {
    summary: data.summary || "No summary.",
    appendix: data.appendix || ""
  };
}

document.getElementById('copySummaryBtn').addEventListener('click', () => {
  const text = resultDiv.innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert('Summary copied to clipboard!');
  });
});
