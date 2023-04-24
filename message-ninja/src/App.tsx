import React, { useState, useEffect } from 'react';
import './App.css';

import {getMessage} from './functions/getMessage'
import { getPrompt } from './functions/getPrompt';
import { getActiveTab } from './functions/getActiveTab';



const App: React.FC = () => {
  // create iframe to contain the DOM

  const [query, setQuery] = useState("")
  const [message, setMessage] = useState("")


  const getMessageFunction = async () => {
    getActiveTab().then((response) => {

      console.log("getActiveTab")
      setMessage("loading...")

      const prompt = getPrompt(response.url,response.iframe)
      console.log(prompt)

      getMessage(prompt).then((message) => {
        setMessage(message)
      })
      

    })
  }

  useEffect(() => {
    getMessageFunction()
    
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
  <p
    style={{
      width: 250,
      height: 50,
      backgroundColor: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "10px",
      borderRadius: "5px",
    }}
  >
    {message}
  </p>
  <button onClick={getMessageFunction}>reload</button>
</div>

  );
};

export default App;
