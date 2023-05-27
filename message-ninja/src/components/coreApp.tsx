import React, { useState, useEffect } from 'react';
import {getMessage} from '../functions/getMessage'
import { getPrompt } from '../functions/getPrompt';
import { getActiveTab } from '../functions/getActiveTab';
import { getMessageType, profile, eventMessage} from '../types';
import  { copyToClipboard } from '../functions/copyToClipboard'
import { BsClipboard, BsFillClipboardCheckFill } from 'react-icons/bs';
import { TfiReload } from 'react-icons/tfi'
import { getReloadMessage } from '../functions/reloadMessage';
import "../App.css"

import { sendMessageToBackgroundScript } from '../functions/sendMessageToBackgroundScript';

export const CoreApp: React.FC = () => {
  
  //message is linked to the text in the box
  const [message, setMessage] = useState("")
  //copied
  const [copied, setCopied] = useState(false)

  const [profile, setProfile] = useState<profile>(null)

  //changes which page is displayed ( settings currently just contains api key form) true = hidden  

  //function to initiate the api call
  const getMessageFunction = async () => {
    console.log("get message function")

    //gets the dom from the current tab
    getActiveTab().then((response) => {
      setMessage("loading...")

      //reads through the dom and creates a prompt
      const returnValue = getPrompt(response.url,response.iframe)
      
      //checks if prompt returned not linkedIn or twitter error 
      if (returnValue.prompt != "not linkedIn" && returnValue.prompt){
        
        //create the object to send to background 
        const getMessageProps: getMessageType = {
          prompt: returnValue.prompt,
        }

        //pass the object to the function that sends it to the background script
        getMessage(getMessageProps).then((message) => {
          setMessage(message)
        })

        setProfile(returnValue.profile)
        
      } else {
        setMessage("not linkedIn")
      }
    })
  }

  const getReloadMessageButton = async () => {
    setMessage("Loading...")
    setCopied(false)
    const reloadedMessage = await getReloadMessage()
    const originalMessage = message

    setMessage(reloadedMessage)

    const eventMessage: eventMessage = {
      type: "event",
      profile: profile,
      message: originalMessage,
      eventType: "reload"
    }


    sendMessageToBackgroundScript(eventMessage)

  }

  const copyToClipboardButton = (message:string) => {
      copyToClipboard(message)
      setCopied(true)

      const eventMessage: eventMessage = {
        type: "event",
        profile: profile,
        message: message,
        eventType: "copy"
      }
  
      sendMessageToBackgroundScript(eventMessage)
  
  }

  useEffect(() => {

    getMessageFunction()

  }, []);
  

  //display app
  return (
    <div className='app'>
      <h2 className='heading unselectable'>Message Ninja </h2>
      <div className='textBox' onClick={() => {copyToClipboardButton(message)}}>
        <p className='unselectable'>{message}</p>
      </div>
      <div style={{display: "flex",flexDirection: "row"}}>
        <button onClick={() =>  copyToClipboardButton(message)} className="button" >
          {copied?  <BsFillClipboardCheckFill /> : <BsClipboard /> }
        </button>
        <button onClick={() =>  getReloadMessageButton()} className="button" >
          <TfiReload />  
        </button> 
      </div>
    </div>
  );
};


