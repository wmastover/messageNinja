import React, { useState, useEffect } from 'react';
import {getMessage} from './functions/getMessage'
import { getPrompt } from './functions/getPrompt';
import { getActiveTab } from './functions/getActiveTab';
import { SettingsPage } from './components/settingsPage';
import { getMessageType } from './types';
import { getVariableMessage } from './types';
import  { copyToClipboard } from './functions/copyToClipboard'
import { BsFillClipboardFill, BsFillClipboardCheckFill } from 'react-icons/bs';
import { TfiReload } from 'react-icons/tfi'
import { GiNinjaMask } from 'react-icons/gi'


import { sendMessageToBackgroundScript } from './functions/sendMessageToBackgroundScript';
import { getReloadMessage } from './functions/reloadMessage';
import "./App.css"

const App: React.FC = () => {
  
  //message is linked to the text in the box
  const [message, setMessage] = useState("")

  //copied
  const [copied, setCopied] = useState(false)

  //changes which page is displayed ( settings currently just contains api key form)
  const [settings, changeSettings] = useState(true);
  
  //contains api key for queries
  const [APIKey, setAPIKey] = useState("");

  //function to initiate the api call
  const getMessageFunction = async (APIKey: string) => {
    console.log("get message function api key:")
    console.log(APIKey)

    //gets the dom from the current tab
    getActiveTab().then((response) => {
      setMessage("loading...")

      //reads through the dom and creates a promp
      const prompt = getPrompt(response.url,response.iframe)
      
      //checks if prompt returned not linkedIn or twitter error 
      if (prompt != "not twitter or linkedIn"){

        //create the object to send to background 
        const getMessageProps: getMessageType = {
          prompt: prompt,
          APIKey: APIKey,
        }

        //pass the object to the function that sends it to the background script
        getMessage(getMessageProps).then((message) => {
          setMessage(message)
        })

      } else {
        setMessage("not twitter or linkedIn")
      }
    })
  }


  const getReloadMessageButton = async (APIKey: string) => {
    setMessage("Loading...")
    const reloadedMessage = await getReloadMessage(APIKey)
    setMessage(reloadedMessage)
  }

  const copyToClipboardButton = (APIKey: string) => {
    copyToClipboard(message)
    setCopied(true)

  }



  useEffect(() => {

    //create object to check the local storage for an api key
    const toSend: getVariableMessage = {
      type: "getVariable",
      key: "APIKey",
    }

    //check the local storage for an api key
    sendMessageToBackgroundScript(toSend).then((response: any)=> {
      if (response.value) {

        //if found set API key value
        setAPIKey(response.value)
        console.log("api key value")
        console.log(response.value)
        //automatically try to get message on load
        getMessageFunction(response.value)
      } else {

        // if not found open settings (API key form)
        changeSettings(false)
        console.log("no api key in storage")
      }
      
    })
  }, []);
  
  

  //display app
  return (
    <div className='app'>
  

  <h2 className='heading'>Message Ninja </h2>
  <div className='textBox' onClick={() => {copyToClipboardButton(APIKey)}}>
    {settings? <p className='unselectable'>{message}</p> : <SettingsPage changeSettings={changeSettings} setAPIKey={setAPIKey} getMessage={getMessageFunction}/>}
  </div>
  <div style={{
    display: "flex",
    flexDirection: "row"

  }}>
    <button onClick={() =>  copyToClipboardButton(message)} className="button" >
      {copied?  <BsFillClipboardCheckFill /> : <BsFillClipboardFill /> }
    </button>
    <button onClick={() =>  getReloadMessageButton(APIKey)} className="button" >
      <TfiReload />  
    </button> 
  </div>
  
</div>

  );
};

export default App;
