import React, { useState, useEffect } from 'react';
import { getActiveTab } from '../functions/getActiveTab';
import { getToken } from '../functions/getToken';
import { loginMessage } from '../types';
import { sendMessageToBackgroundScript } from '../functions/sendMessageToBackgroundScript';

interface LoginPageProps {
  setLoggedIn: (arg0: boolean) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ setLoggedIn }) => {
  const getMessageFunction = async () => {
    getActiveTab().then((response) => {
      const token = getToken(response.url, response.iframe);
      if (token != "no token") {
        try {
          const toSend: loginMessage = {
            type: "login",
            token: token,
          };
          sendMessageToBackgroundScript(toSend).then((response: any) => {
            if (response.success) {
              console.log("send token to background script success");
              console.log(response.output);
              setLoggedIn(true);
            } else {
              console.log("send token to background script failure");
              console.log(response.output);
            }
          });
        } catch (error: any) {
          console.log("response --");
          console.log(error.message);
        }  
      }
    });
  }

  useEffect(() => {
    console.log("useEffect");
    getMessageFunction();
  }, []);

  return (
    <div className='app' style={{color:"white"}}>
      <h2 className='heading unselectable'>Message Ninja </h2>
      <p> 1. Head to <a href="https://www.messageninja.ai" className='hyperlink'>messageninja.ai</a></p>
      <p> 2. log in to the website</p>
      <p> 3. Open the extension to log in</p>
    </div>
  );
};
