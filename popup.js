document.addEventListener("DOMContentLoaded", function () {
  const apiKeyInput = document.getElementById("apiKey");
  const apiKeyForm = document.getElementById("apiKeyForm");
  const changeKeyLink = document.getElementById("changeKeyLink");

  // Initially load and set the API key if available
  chrome.storage.local.get("apiKey", function (data) {
    if (data.apiKey) {
      apiKeyInput.value = data.apiKey; // Pre-populate the field
      apiKeyForm.style.display = "none";
      changeKeyLink.style.display = "block";
    } else {
      apiKeyForm.style.display = "block";
      changeKeyLink.style.display = "none";
    }
  });

  document.getElementById("summarize").addEventListener("click", function () {
    document.getElementById("summary").textContent = "Loading...";

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          files: ["lib/Readability.js"],
        },
        () => {
          chrome.scripting.executeScript(
            {
              target: { tabId: tabs[0].id },
              func: extractContent,
            },
            (results) => {
              if (
                chrome.runtime.lastError ||
                !results ||
                results.length === 0
              ) {
                document.getElementById("summary").textContent =
                  "Error extracting text.";
                return;
              }
              const extractedText = results[0].result;
              if (extractedText) {
                fetchSummary(extractedText);
              } else {
                document.getElementById("summary").textContent =
                  "No content was found.";
                return;
              }
            }
          );
        }
      );
    });
  });

  document.getElementById("saveKey").addEventListener("click", function () {
    var newApiKey = apiKeyInput.value;
    if (newApiKey.trim() !== "") {
      chrome.storage.local.set({ apiKey: newApiKey.trim() }, function () {
        apiKeyForm.style.display = "none";
        changeKeyLink.style.display = "block";
        alert("API Key saved successfully!");
      });
    } else {
      alert("Please enter a valid API Key.");
    }
  });

  changeKeyLink.addEventListener("click", function () {
    apiKeyForm.style.display = "block";
    changeKeyLink.style.display = "none";
  });
});

function extractContent() {
  const doc = document.cloneNode(true);
  const article = new Readability(doc).parse();
  console.log(article.title, article.textContent);
  return article.textContent || "No content available.";
}

function fetchSummary(text) {
  chrome.storage.local.get("apiKey", function (data) {
    if (!data.apiKey) {
      document.getElementById("summary").textContent = "API Key is not set.";
      return;
    }
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "system",
            content:
              "You're job is to summarize content provided clearly and concisely using bullets. Your responses should also point out any factually incorrect information in a subnote after the bullets with the header 'Special Note:'.",
          },
          {
            role: "user",
            content: text,
          },
        ],
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const response = data.choices[0].message.content;
        if (data.choices && data.choices[0]) {
          document.getElementById("summary").textContent = response;
        } else {
          throw new Error("Unexpected response");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        document.getElementById("summary").textContent =
          "Error: " + error.message;
      });
  });
}
