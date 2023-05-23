import React, { useState, useEffect } from 'react';
import { CoreApp} from "./components/coreApp"
import { LoginPage }  from "./components/loginPage"
import "./App.css"

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState("false")
  //message is linked to the text in the box
 
  

  //display app
  return (
  <>
    {loggedIn?
       <LoginPage/>
       :
       <CoreApp/> 
    }
    
  </>

  );
};

export default App;
