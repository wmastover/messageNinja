chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.create({ url: 'index.html' });
  });

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
  
async function reloadQueryGPT(APIKey) {
  console.log("queryGPTINput")
  console.log(queryGPTInput)
  const API_KEY = APIKey;
  const API_URL = "https://api.openai.com/v1/chat/completions";
  
  console.log("reloading query gpt")

  const result = await new Promise((resolve) => getVariable("Messages", resolve));
  let messages = result;

  console.log("messages")
  console.log(messages)
  if (messages) {
    messages.push({"role": "user", "content": "give me an alternative option"});
  } else {
    messages = [];
  }

  console.log("reload messages")
  console.log(messages)

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + API_KEY
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: messages,
    }),
  });
  console.log("response:")
  
  if (!response.ok) {
    console.log("reponse not ok")
    const errorText = await response.text();
    throw new Error("Failed to query GPT API. Status: " + response.status + ", Response: " + errorText);
  }
  
  console.log("response ok")
  const jsonResponse = await response.json();
  const output = jsonResponse.choices[0].message.content.trim();
  console.log(output)
  
  messages.push({"role": "assistant", "content": output})
  storeVariable("Messages", messages)


  return output;
}


  
async function queryGPT3(queryGPTInput) {

  console.log("queryGPTINput")
  console.log(queryGPTInput)
  const API_KEY = queryGPTInput.APIKey;
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const prompt = queryGPTInput.content;

  console.log(prompt)

  messages = [
    {"role": "system", "content": "You are a recruiter, that reads through linkedIn profiles and crafts custom messages"},
    {"role": "user", "content": prompt},
  ]

  

  const response = await fetch(API_URL, {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + API_KEY
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages,
      }),
  });
  
  if (!response.ok) {
      const errorText = await response.text();
      throw new Error("Failed to query GPT API. Status: " + response.status + ", Response: " + errorText);
  }
  
  const jsonResponse = await response.json();
  const output = jsonResponse.choices[0].message.content.trim();

  messages.push({"role": "assistant", "content": output})
  storeVariable("Messages", messages)

  return output;
}

// Store a variable

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

    queryGPT3(queryGPTInput)
    .then((output) => {
      sendResponse({ success: true, output });
    })
    .catch((error) => {
      sendResponse({ success: false, output: error.message });
    });
  // Keep the channel open for the asynchronous response
  return true;

  } else if(request.type == "reloadMessage") {
    console.log("type = reloadMessage")
    

    console.log("listener input")
    console.log(request)

    reloadQueryGPT(request.APIKey)
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
  



  