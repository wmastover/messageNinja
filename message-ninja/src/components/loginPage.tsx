import React, { useState, useEffect } from 'react';
import { getActiveTab } from '../functions/getActiveTab';
import { getToken } from '../functions/getToken';


export const LoginPage: React.FC = () => {
  

  const getMessageFunction = async () => {
 

    //gets the dom from the current tab
    getActiveTab().then((response) => {
      const token = getToken(response.url, response.iframe)
      console.log("token in login page")
      console.log(token)
    })
  }
  //message is linked to the text in the box
  useEffect(() => {
    console.log("useEffect")
    getMessageFunction()

  }, [])

  //display app
  return (
    <div className='app' style={{color:"white"}}>
      <h2 className='heading unselectable'>Message Ninja </h2>
      <p> 1. Head to messageNinja.ai</p>
      <p> 2. log in to the website</p>
      <p> 3. Open the extension to log in</p>
      
    </div>
  );
};

