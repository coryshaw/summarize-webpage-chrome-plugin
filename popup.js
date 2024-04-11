document.addEventListener("DOMContentLoaded", function () {
  // Load and set the API key if available
  chrome.storage.local.get("apiKey", function (data) {
    if (data.apiKey) {
      document.getElementById("apiKeyForm").style.display = "none";
      document.getElementById("summarize").style.display = "block";
    } else {
      document.getElementById("apiKeyForm").style.display = "block";
      document.getElementById("summarize").style.display = "none";
    }
  });

  document.getElementById("summarize").addEventListener("click", function () {
    document.getElementById("summary").textContent = "Loading...";
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          func: extractContent,
        },
        (results) => {
          if (chrome.runtime.lastError || !results || results.length === 0) {
            document.getElementById("summary").textContent =
              "Error extracting text.";
            return;
          }
          const extractedText = results[0].result;
          fetchSummary(extractedText);
        }
      );
    });
  });

  document.getElementById("saveKey").addEventListener("click", function () {
    var newApiKey = document.getElementById("apiKey").value;
    if (newApiKey.trim() !== "") {
      chrome.storage.local.set({ apiKey: newApiKey.trim() }, function () {
        document.getElementById("apiKeyForm").style.display = "none";
        document.getElementById("summarize").style.display = "block";
        alert("API Key saved successfully!");
      });
    } else {
      alert("Please enter a valid API Key.");
    }
  });
});

function extractContent() {
  const doc = document.cloneNode(true); // Clone the document
  return new Readability(doc).parse().textContent || "No content available.";
}

function fetchSummary(text) {
  chrome.storage.local.get("apiKey", function (data) {
    if (!data.apiKey) {
      document.getElementById("summary").textContent = "API Key is not set.";
      return;
    }
    fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.apiKey}`,
      },
      body: JSON.stringify({
        model: "text-davinci-004",
        prompt: "Summarize this: " + text,
        max_tokens: 150,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("summary").textContent =
          data.choices[0].text.trim();
      })
      .catch((error) => {
        console.error("Error:", error);
        document.getElementById("summary").textContent =
          "Failed to fetch summary.";
      });
  });
}
