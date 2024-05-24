// const model = "gpt-3.5-turbo-0125";
// const model = "gpt-4";
const model = "gpt-4o";
const systemPrompt = `Summarize the content provided clearly and concisely in as few words as possible (but enough to highlight the important points). Use basic formatting such as headings, bold, italics, line breaks, and bullets. Format for maximum clarity. The response output should be in markdown format.

  If (and only if) there is inaccurate, one-sided, or additional context that could be helpful, add a markdown callout to the top of the response using the following format:
  > **Note:**
  > Special note text goes here`;

export const fetchSummary = async (text) => {
  try {
    const apiKey = await new Promise((resolve, reject) => {
      chrome.storage.local.get("apiKey", function (data) {
        if (chrome.runtime.lastError || !data.apiKey) {
          reject(new Error("API Key is not set."));
        } else {
          resolve(data.apiKey);
        }
      });
    });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
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
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.choices && data.choices[0]) {
      return data.choices[0].message.content;
    } else {
      throw new Error("Unexpected OpenAI response");
    }
  } catch (error) {
    throw new Error("Error fetching summary from OpenAI: " + error.message);
  }
};
