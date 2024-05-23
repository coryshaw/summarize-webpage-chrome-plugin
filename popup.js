document.addEventListener("DOMContentLoaded", function () {
  const apiKeyInput = document.getElementById("apiKey");
  const apiKeyForm = document.getElementById("apiKeyForm");
  const app = document.getElementById("app");
  const changeKeyLink = document.getElementById("changeKeyLink");

  // Initially load and set the API key if available
  chrome.storage.local.get("apiKey", function (data) {
    if (data.apiKey) {
      apiKeyInput.value = data.apiKey; // Pre-populate the field
      apiKeyForm.style.display = "none";
      app.style.display = "block";
      changeKeyLink.style.display = "block";
    } else {
      apiKeyForm.style.display = "block";
      app.style.display = "none";
      changeKeyLink.style.display = "none";
    }
  });

  // cancel button
  document.getElementById("cancel-btn").addEventListener("click", function () {
    window.close();
  });

  // close button
  document.getElementById("close-btn").addEventListener("click", function () {
    window.close();
  });

  // Extract content from the current tab and fetch a summary on content loaded
  document.getElementById("summary").textContent = "Summarizing this page...";
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

  document.getElementById("save-btn").addEventListener("click", function () {
    var newApiKey = apiKeyInput.value;
    if (newApiKey.trim() !== "") {
      chrome.storage.local.set({ apiKey: newApiKey.trim() }, function () {
        apiKeyForm.style.display = "none";
        apiKeySuccess.style.display = "block";
      });
    } else {
      alert("Please enter a valid API Key.");
    }
  });

  changeKeyLink.addEventListener("click", function () {
    apiKeyForm.style.display = "block";
    app.style.display = "none";
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
        model: "gpt-3.5-turbo-0125",
        messages: [
          {
            role: "system",
            content:
              "Summarize the content provided clearly and concisely in as few words as possible (but enough to highlight the important points). Use basic markdown formatting such as headings, bold, italics, and bullets. If (and only if) there is factually incorrect information found, or if the information is one sided, add 'Special Note:' then describe the concern FIRST above the summary. The special note block should be formatted as a markdown 'callout' with a warning emoji. Format the response as markdown",
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
          document.getElementById("summary").innerHTML = marked.parse(response);
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
