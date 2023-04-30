import React, { useState, useEffect } from 'react';
import {getMessage} from './functions/getMessage'
import { getPrompt } from './functions/getPrompt';
import { getActiveTab } from './functions/getActiveTab';
import { SettingsPage } from './components/settingsPage';
import { getMessageType } from './types';
import { getVariableMessage } from './types';
import { sendMessageToBackgroundScript } from './functions/sendMessageToBackgroundScript';

const App: React.FC = () => {
  // create iframe to contain the DOM

  const [message, setMessage] = useState("")
  const [settings, changeSettings] = useState(true);
  const [APIKey, setAPIKey] = useState("");

  const getMessageFunction = async (APIKey: string) => {
    console.log("get message function api key:")
    console.log(APIKey)

    getActiveTab().then((response) => {
      setMessage("loading...")

      const prompt = getPrompt(response.url,response.iframe)
      
      if (prompt != "not twitter or linkedIn"){
        const getMessageProps: getMessageType = {
          prompt: prompt,
          APIKey: APIKey,
        }

        getMessage(getMessageProps).then((message) => {
          setMessage(message)
        })
      } else {
        setMessage("not twitter or linkedIn")
      }
    })
  }

  useEffect(() => {

    const toSend: getVariableMessage = {
      type: "getVariable",
      key: "APIKey",
    }

    sendMessageToBackgroundScript(toSend).then((response: any)=> {
      if (response.value) {
        
        setAPIKey(response.value)
        console.log("api key value")
        console.log(response.value)
        getMessageFunction(response.value)
      } else {
        changeSettings(false)
        console.log("no api key in storage")
      }
      
    })
  }, []);
  
  

  //display app
  return (
    <div
  style={{
    width: 300,
    height: 200,
    backgroundColor: "#F0F0F0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  
  <h1>🥷 Message Ninja 🥷</h1>
  

  {settings? <p style={{
      width: 250,
      height: 50,
      backgroundColor: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "10px",
      borderRadius: "5px",
    }}>{message}</p> : <SettingsPage changeSettings={changeSettings} setAPIKey={setAPIKey} getMessage={getMessageFunction}/>}
  <div style={{
    display: "flex",
    flexDirection: "row"

  }}>
    <button onClick={() =>  getMessageFunction(APIKey)} style={{backgroundColor: "grey"}} >🔄</button>
    {/* <button onClick={() => toggleSettings(settings, changeSettings)}>⚙️</button> */}
  </div>
  
</div>

  );
};

export default App;
