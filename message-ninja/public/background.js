chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.create({ url: 'index.html' });
  });


async function queryGPT(queryGPTInput) {

  console.log("queryGPTINput")
  console.log(queryGPTInput)
  const API_KEY = queryGPTInput.APIKey;
  const API_URL = "https://api.openai.com/v1/engines/text-davinci-003/completions";
  const prompt = queryGPTInput.content;

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
  
// Store a variable
function storeVariable(key, value) {
  chrome.storage.local.set({ [key]: value }, () => {
    console.log(`Value for '${key}' is set to '${value}'.`);
  });
}

// Retrieve a variable
function getVariable(key, callback) {
  chrome.storage.local.get([key], (result) => {
    callback(result[key]);
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  console.log("background message recived")
  if(request.type == "queryGPT") {
    console.log("type = queryGPT")
    
    queryGPTInput = {
      content: request.content,
      APIKey: request.APIKey,
    }

    console.log("listener input")
    console.log(request)

    queryGPT(queryGPTInput)
    .then((output) => {
      sendResponse({ success: true, output });
    })
    .catch((error) => {
      sendResponse({ success: false, output: error.message });
    });
  // Keep the channel open for the asynchronous response
  return true;

  } else if (request.type == "storeVariable") {
    console.log("type = store var")

    storeVariable(request.key, request.value)
    console.log("store variable completed")
    return true;

  } else if (request.type == "getVariable") {
    getVariable(request.key, (value, error) => {
      if (error) {
        sendResponse({ success: false, message: error.message });
      } else if (value !== undefined) {
        sendResponse({ success: true, value });
      } else {
        sendResponse({ success: false, message: 'Unexpected error occurred while retrieving the value.' });
      }
    });
    // Keep the channel open for the asynchronous response
    return true;
  }
});
  



  