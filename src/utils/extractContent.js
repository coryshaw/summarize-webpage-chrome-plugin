// This function will be executed in the context of the webpage
function extractContent() {
  const doc = document.cloneNode(true);
  const article = new Readability(doc).parse();
  return article.textContent || "No content available.";
}

export const extractPageText = async () => {
  const [tab] = await new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (chrome.runtime.lastError || !tabs || tabs.length === 0) {
        return reject(new Error("No active tab found."));
      }
      resolve(tabs);
    });
  });

  // load the Readability script
  await new Promise((resolve, reject) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        files: ["lib/Readability.min.js"],
      },
      () => {
        if (chrome.runtime.lastError) {
          return reject(new Error(chrome.runtime.lastError.message));
        }
        resolve();
      }
    );
  });

  // execute the extractContent function
  const results = await new Promise((resolve, reject) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        func: extractContent,
      },
      (results) => {
        if (chrome.runtime.lastError || !results || results.length === 0) {
          console.log(chrome.runtime.lastError);
          return reject(new Error("Error extracting text."));
        }
        resolve(results);
      }
    );
  });

  const extractedText = results[0].result;
  if (!extractedText) {
    throw new Error("Error extracting text.");
  }
  return extractedText;
};
