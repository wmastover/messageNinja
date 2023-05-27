import { reloadMessage } from "../types"
import { sendMessageToBackgroundScript } from "./sendMessageToBackgroundScript"

export const getReloadMessage = async () => {
    
    let message = ""

    try {

      const toSend: reloadMessage = {
        type: "reloadMessage",

      }

      console.log("reloadMessage.ts => background.js")
      const response: any = await sendMessageToBackgroundScript(toSend);
      
      if (response.success) {
        
        console.log("RELOAD MESSAGE SCRIPT RESPONSE:")
        message = response.output
        console.log(response)
        console.log(message)

      } else {
        
        console.log("reload message error response output:")
        console.log(response.output)

      }
    } catch (error:any) {
        console.log("response --")
        console.log(error.message)
        
    }
    return(message)
}

/// this functions needs to query the redux store to get the previous message array from the 