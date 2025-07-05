document.getElementById('summarizeBtn').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const tabId = tabs[0].id;

    // Inject content.js into the page first
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    }, () => {
      // Now send the message to the injected content script
      chrome.tabs.sendMessage(tabId, { action: "extractText" }, function(response) {
        if (chrome.runtime.lastError) {
          document.getElementById('result').innerText = 'Error: ' + chrome.runtime.lastError.message;
        } else if (response && response.content) {
          document.getElementById('result').innerText = response.content; 
        } else {
          document.getElementById('result').innerText = 'No content found.';
        }
      });
    });
  });
});

async function summarizeText(text) {
  const response = await fetch("https://your-render-app.onrender.com/summarize", {  // Replace this with your real Render URL
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: text })
  });

  const data = await response.json();
  return data.summary || "No summary.";
}
