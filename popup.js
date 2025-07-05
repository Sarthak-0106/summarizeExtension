const resultDiv = document.getElementById('result');
const appendixDiv = document.getElementById('appendix');
const loadingDiv = document.getElementById('loading');
const userInput = document.getElementById('userInput');

const summarizeBtn = document.getElementById('summarizeBtn');
const summarizeInputBtn = document.getElementById('summarizeInputBtn');
const copySummaryBtn = document.getElementById('copySummaryBtn');
const copyAppendixBtn = document.getElementById('copyAppendixBtn');

summarizeBtn.addEventListener('click', () => {
  resultDiv.innerText = '';
  appendixDiv.innerText = '';
  loadingDiv.style.display = 'block';

  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const tabId = tabs[0].id;

    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    }, () => {
      chrome.tabs.sendMessage(tabId, { action: "extractText" }, async function(response) {
        if (chrome.runtime.lastError) {
          resultDiv.innerText = 'Error: ' + chrome.runtime.lastError.message;
          loadingDiv.style.display = 'none';
          return;
        }

        const cleanText = cleanUpText(response?.content || '');
        await processText(cleanText);
      });
    });
  });
});

summarizeInputBtn.addEventListener('click', async () => {
  resultDiv.innerText = '';
  appendixDiv.innerText = '';
  loadingDiv.style.display = 'block';

  const inputText = cleanUpText(userInput.value);
  if (!inputText) {
    resultDiv.innerText = 'Please enter some text.';
    loadingDiv.style.display = 'none';
    return;
  }

  await processText(inputText);
});

function cleanUpText(text) {
  return (text || '')
    .trim()
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s{2,}/g, ' ')
    .slice(0, 4000);
}

async function processText(text) {
  try {
    const { summary, appendix } = await summarizeText(text);
    resultDiv.innerText = summary || 'No summary.';
    appendixDiv.innerText = appendix?.trim() || 'No appendix.';
  } catch (err) {
    resultDiv.innerText = 'Error fetching summary.';
    appendixDiv.innerText = '';
  } finally {
    loadingDiv.style.display = 'none';
  }
}

async function summarizeText(text) {
  const response = await fetch("https://summarizeextension.onrender.com/summarize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });
  const data = await response.json();
  return {
    summary: data.summary || '',
    appendix: data.appendix || ''
  };
}

copySummaryBtn.addEventListener('click', () => {
  const text = resultDiv.innerText;
  navigator.clipboard.writeText(text).then(() => alert('Summary copied!'));
});

copyAppendixBtn.addEventListener('click', () => {
  const text = appendixDiv.innerText;
  navigator.clipboard.writeText(text).then(() => alert('Appendix copied!'));
});
