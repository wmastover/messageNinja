import { getMessageType } from "../types"
import { queryGPTMessage } from "../types"
import { sendMessageToBackgroundScript } from "./sendMessageToBackgroundScript"

export const getMessage = async (props: getMessageType) => {

    let message = ""

    try {

      const toSend: queryGPTMessage = {
        type: "queryGPT",
        content: props.prompt,
      }
      const response: any = await sendMessageToBackgroundScript(toSend);
      
      if (response.success) {
        
        message = response.output

      } else {
        console.log("input text:")
        console.log(props.prompt)
        console.log("error response output:")
        console.log(response.output)

      }
    } catch (error:any) {
        console.log("response --")
        console.log(error.message)
        
    }
    return(message)
}