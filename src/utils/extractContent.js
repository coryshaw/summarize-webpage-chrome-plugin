import { Readability } from "@mozilla/readability";

function extractContent() {
  const doc = document.cloneNode(true);
  const article = new Readability(doc).parse();
  return article.textContent || "No content available.";
}

export const extractPageText = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        files: ["lib/Readability.min.js"],
      },
      () => {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            func: extractContent,
          },
          (results) => {
            if (chrome.runtime.lastError || !results || results.length === 0) {
              throw new Error("Error extracting text.");
            }
            const extractedText = results[0].result;
            if (extractedText) {
              return extractedText;
            } else {
              throw new Error("Error extracting text.");
            }
          }
        );
      }
    );
  });
};
