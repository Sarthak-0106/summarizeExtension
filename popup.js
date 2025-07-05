document.getElementById('summarizeBtn').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const tabId = tabs[0].id;

    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    }, () => {
      chrome.tabs.sendMessage(tabId, { action: "extractText" }, async function(response) {
        const resultDiv = document.getElementById('result');
        const appendixDiv = document.getElementById('appendix');
        resultDiv.innerText = 'Summarizing...';
        appendixDiv.innerHTML = '';

        if (chrome.runtime.lastError) {
          resultDiv.innerText = 'Error: ' + chrome.runtime.lastError.message;
          return;
        }

        if (response && response.content) {
          try {
            const fullSummary = await summarizeText(response.content);
            const [summaryPart, appendixPart] = fullSummary.split('Appendix:');

            resultDiv.innerText = summaryPart ? summaryPart.trim() : 'No summary.';
            
            if (appendixPart) {
              const items = appendixPart.trim().split('\n');
              appendixDiv.innerHTML = items.map(item => `<li>${item}</li>`).join('');
            }
          } catch (err) {
            resultDiv.innerText = 'Error fetching summary.';
          }
        } else {
          resultDiv.innerText = 'No content found.';
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
  return data.summary || "No summary.";
}

// Copy button functionality
document.getElementById('copySummaryBtn').addEventListener('click', () => {
  const text = document.getElementById('result').innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert('Summary copied to clipboard!');
  });
});
