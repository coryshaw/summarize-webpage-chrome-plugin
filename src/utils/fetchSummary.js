const model = "gpt-3.5-turbo-0125";
const systemPrompt =
  "Summarize the content provided clearly and concisely in as few words as possible (but enough to highlight the important points). Use basic markdown formatting such as headings, bold, italics, and bullets. If (and only if) there is factually incorrect information found, or if the information is one sided, add 'Special Note:' then describe the concern FIRST above the summary. The special note block should be formatted as a markdown 'callout' with a warning emoji. Format the response as markdown";

export const fetchSummary = async (text) => {
  chrome.storage.local.get("apiKey", function (data) {
    if (!data.apiKey) {
      throw new Error("API Key is not set.");
    }
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: systemPrompt,
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
          return response;
        } else {
          throw new Error("Unexpected OpenAI response");
        }
      })
      .catch((error) => {
        throw new Error("Error fetching summary from OpenAI: " + error.message);
      });
  });
};
