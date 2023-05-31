try {
  // you need to manually have firebase-compat.js file in your dir
self.importScripts('./firebase-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyB78Wj5cPff9GdU7KPB7fXvI5NfA7BKDxI",
  authDomain: "messageninja-5f315.firebaseapp.com",
  projectId: "messageninja-5f315",
  storageBucket: "messageninja-5f315.appspot.com",
  messagingSenderId: "207350695816",
  appId: "1:207350695816:web:49fddbb5cd70e3f2ab5c3d",
  measurementId: "G-8SQ6MFBG7B"
};

firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

} catch (e) {
console.error(e);
}


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
  
const firebaseFunctions = firebase.functions();



//talks to firebase function 
async function queryGPT3(queryGPTInput) {
  console.log("queryGPTINput");
  console.log(queryGPTInput);
  const prompt = queryGPTInput.content;

  console.log(prompt);

  let messages = [
    {"role": "system", "content": "You are a recruiter, that reads through linkedIn profiles and crafts custom messages"},
    {"role": "user", "content": prompt},
  ]

  try {
    const queryGPT3 = firebaseFunctions.httpsCallable('queryGPT3');
    const output = await queryGPT3({ messages });
    
    
    messages.push({"role": "assistant", "content": output.data});
    storeVariable("Messages", messages);
    return output.data;
  } catch (error) {
    throw new Error("Failed to query GPT API. Message: " + error.message);
  }
}


//talks to firebase function 
async function reloadQueryGPT() {

  const result = await new Promise((resolve) => getVariable("Messages", resolve));
  let messages = result;

  console.log("messages");
  console.log(messages);

  if (messages) {
    messages.push({"role": "user", "content": "give me an alternative option"});
  } else {
    messages = [];
  }

  console.log("reload messages");
  console.log(messages);

  try {
    const queryGPT3 = firebaseFunctions.httpsCallable('queryGPT3');
    const output = await queryGPT3({ messages });
    

    messages.push({"role": "assistant", "content": output.data});
    storeVariable("Messages", messages);
    return output.data;
  } catch (error) {
    throw new Error("Failed to query GPT API. Message: " + error.message);
  }
}


// Store a variable

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  console.log("background message recived")
  if(request.type == "queryGPT") {
    console.log("type = queryGPT")
    
    queryGPTInput = {
      content: request.content,
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

    reloadQueryGPT()
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
  } else if (request.type == "login"){

    console.log("login in background running")

    firebase.auth().signInWithCustomToken(request.token).then((user) => {
      // User is signed in
      console.log(user)
      console.log("User is signed in");
      sendResponse({ success: true });
    }).catch((error) => {
      console.log(" error in login")
      console.log('error', error)
      sendResponse({ success: false });
    })
    return true;
  } else if (request.type == "checkLogin") {
    firebase.auth().onAuthStateChanged((user) => {
      
      if (user) {
        console.log('User is signed in:', user);
        // User is signed in, perform some operations if you need
        // ...
        sendResponse({ success: true })
      } else {
        console.log('No user is signed in.');
        // No user is signed in, you can redirect the user to a login page
        // ...
        sendResponse({ success: false })
      }
    });
    return true;
  // ...

} else if (request.type == "event") {
  // add document to firestore, in the users collection, document named after the user Id, in the events collection. 
  let eventDocument = {
    profile: request.profile,
    message: request.message,
    eventType: request.eventType,
    timestamp: firebase.firestore.FieldValue.serverTimestamp() // Add timestamp if you want to keep track of when the event was logged
  };

  let user = firebase.auth().currentUser;
  if (user) { // Check if user is authenticated before trying to add data to Firestore
    db.collection('users').doc(user.uid).collection('events').add(eventDocument)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  } else {
    console.log("User not authenticated. Please authenticate before logging events.");
  }
  
  return true;
}


});
  



  