import React, { useState, useEffect } from 'react';
import { CoreApp} from "./components/coreApp"
import { LoginPage }  from "./components/loginPage"
import "./App.css"
import { sendMessageToBackgroundScript } from './functions/sendMessageToBackgroundScript';
import { checkLogin } from './types';

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(true)
  //message is linked to the text in the box
  
  const checkLogin = async () => {

    const toSend: checkLogin = {
      type: "checkLogin"

    }

    sendMessageToBackgroundScript(toSend).then((response: any) => {
      if (response.success) {
      
        console.log("logged In")
        console.log(response)
        

      } else {
        console.log("not logged in")
        console.log(response)
        setLoggedIn(false)
      }
  })
}

useEffect(() => {
  checkLogin()

}, [])
  

  //display app
  return (
  <>
    {loggedIn?
       <CoreApp/> 
       :
       <LoginPage setLoggedIn={setLoggedIn}/>
    }
    
  </>

  );
};

export default App;
