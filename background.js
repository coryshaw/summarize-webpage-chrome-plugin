chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "fetchSummary") {
    const bodyData = {
      model: "text-davinci-004", // You can change this to GPT-4 or any specific model you prefer
      prompt: "Summarize this: " + request.content,
      max_tokens: 150,
      temperature: 0.5,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    };

    fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${request.apiKey}`,
      },
      body: JSON.stringify(bodyData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch summary: " + response.statusText);
        }
      })
      .then((data) => sendResponse({ summary: data.choices[0].text.trim() }))
      .catch((error) => {
        console.error("Error:", error);
        sendResponse({ error: error.message });
      });

    return true; // Indicates to Chrome that the response will be sent asynchronously
  }
});
