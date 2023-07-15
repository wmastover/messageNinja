import React, { useState, useEffect } from 'react';
import { getActiveTab } from '../functions/getActiveTab';
import { getToken } from '../functions/getToken';
import { loginMessage } from '../types';
import { sendMessageToBackgroundScript } from '../functions/sendMessageToBackgroundScript';

interface LoginPageProps {
  setLoggedIn: (arg0: boolean) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ setLoggedIn }) => {
  const getTokenFunction = async () => {
    getActiveTab().then((response) => {
      console.log("got active tab")

      const token = getToken(response.url, response.iframe);
      if (token != "no token") {

        console.log("token found")
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
      } else {
        console.log("no token")
      }
    });
  }

  useEffect(() => {
    console.log("useEffect in login page");
    getTokenFunction();
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
