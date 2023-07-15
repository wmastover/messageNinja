import React, { useState, useEffect, useRef } from 'react';
import { getMessage } from '../functions/getMessage'
import { getPrompt } from '../functions/getPrompt';
import { getActiveTab } from '../functions/getActiveTab';
import { getMessageType, profile, eventMessage } from '../types';
import  { copyToClipboard } from '../functions/copyToClipboard'
import { BsClipboard, BsFillClipboardCheckFill } from 'react-icons/bs';
import { TfiReload } from 'react-icons/tfi'
import { getReloadMessage } from '../functions/reloadMessage';
import "../App.css"
import '../assets/DINCondensed-Regular.ttf'
import '../assets/DINCondensed-Regular.woff'
import { LoadingBar } from './loadingBar'
import { sendMessageToBackgroundScript } from '../functions/sendMessageToBackgroundScript';

export const CoreApp: React.FC = () => {
  
  const [message, setMessage] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [profile, setProfile] = useState<profile | null>(null);
  const [loadingBarVisible, setLoadingBarVisible] = useState<boolean>(false);
  const [ apiResponded, setAPIResponded] = useState<boolean>(false);
  
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const openLoadingBar = () => {
    setAPIResponded(false)
    setLoadingBarVisible(true)
  }

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const closeLoadingBar = async () => {
    setAPIResponded(true)
    await delay(100);
    setLoadingBarVisible(false)
  }

  const getMessageFunction = async () => {
    console.log("get message function")
    getActiveTab().then((response) => {
      const returnValue = getPrompt(response.url, response.iframe)
      
      if (returnValue.prompt != "not linkedIn" && returnValue.prompt){
        openLoadingBar()
        const getMessageProps: getMessageType = {
          prompt: returnValue.prompt,
        }

        getMessage(getMessageProps).then((message) => {
          setMessage(message)
          closeLoadingBar()
        })
        setProfile(returnValue.profile)
        
      } else {
        setMessage("Navigate to a linkedIn user profile to generate a personalised message")
      }
    })
  }

  const getReloadMessageButton = async () => {
    openLoadingBar()
    setCopied(false)
    const reloadedMessage = await getReloadMessage()
    const originalMessage = message

    setMessage(reloadedMessage)
    closeLoadingBar()

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
      setIsEditing(false);

      const eventMessage: eventMessage = {
        type: "event",
        profile: profile,
        message: message,
        eventType: "copy"
      }
      
      sendMessageToBackgroundScript(eventMessage)
  
  }

  const handleTextClick = () => {
    setIsEditing(true);
    setCopied(false)
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
  };

  const inputRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    getMessageFunction();
  }, []);
  

  return (
    <div className='app'>
      <div className="textBoxContainer">
        {isEditing ?
          <textarea
            className='textBox'
            ref={inputRef}
            onBlur={handleInputBlur}
            onChange={handleInputChange}
            value={message}
          />
          : 

        <div className='textBox'>
          {loadingBarVisible ? 
            <LoadingBar apiResponded={apiResponded}/> 
            : 
            <p className='unselectable' onClick={handleTextClick}>{message}</p>
          }
        </div>
        }
        
      </div>
      <div className='buttonContainer'>
        <button onClick={() =>  copyToClipboardButton(message)} className="button copy" >
          {copied?  <BsFillClipboardCheckFill /> : <BsClipboard /> }
        </button>
        <button onClick={() =>  getReloadMessageButton()} className="button reload" >
          <TfiReload />  
        </button> 
      </div>
    </div>
  );
};
