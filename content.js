chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractText") {
    const pageText = document.body.innerText || "No text found.";
    sendResponse({ content: pageText });
  }
  return true;  // Important!
});
