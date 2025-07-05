document.getElementById('summarizeBtn').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const tabId = tabs[0].id;

    // Inject content.js into the page first
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    }, () => {
      // Now send the message to the injected content script
      chrome.tabs.sendMessage(tabId, { action: "extractText" }, async function(response) {
        const resultDiv = document.getElementById('result');

        if (chrome.runtime.lastError) {
          resultDiv.innerText = 'Error: ' + chrome.runtime.lastError.message;
          return;
        }

        if (response && response.content) {
          resultDiv.innerText = 'Summarizing...';

          try {
            const summary = await summarizeText(response.content);
            resultDiv.innerText = summary;
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
  const response = await fetch("https://summarizeextension.onrender.com/summarize", {   // 🛠 Corrected URL
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: text })
  });

  const data = await response.json();
  return data.summary || "No summary.";
}
