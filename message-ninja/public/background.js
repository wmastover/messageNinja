chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.create({ url: 'index.html' });
  });


async function queryGPT(inputText) {

  const API_KEY = "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";
  const API_URL = "https://api.openai.com/v1/engines/text-davinci-003/completions";
  const prompt = inputText

  console.log(prompt)

  const response = await fetch(API_URL, {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + API_KEY
      },
      body: JSON.stringify({
      prompt,
      max_tokens: 50,
      n: 1,
      stop: null,
      temperature: 0.5,
      }),
  });
  
  if (!response.ok) {
      const errorText = await response.text();
      throw new Error("Failed to query GPT API. Status: " + response.status + ", Response: " + errorText);
  }
  
  const jsonResponse = await response.json();
  const output = jsonResponse.choices[0].text.trim();
  return output;
}
  

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

      queryGPT(request)
      .then((output) => sendResponse({ success: true, output }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
  
      return true; // Required to handle async sendResponse.
  
  });
  
  