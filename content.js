function extractMainContent() {
  const article = document.querySelector('article');
  if (article) {
    return article.innerText;
  }

  const main = document.querySelector('main');
  if (main) {
    return main.innerText;
  }

  const headings = Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.innerText).join('\n');
  const paragraphs = Array.from(document.querySelectorAll('p')).map(p => p.innerText).join('\n');

  return headings + '\n' + paragraphs;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractText") {
    const extracted = extractMainContent();
    sendResponse({ content: extracted });
  }
});