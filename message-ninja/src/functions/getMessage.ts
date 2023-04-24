export const getMessage= async (inputText: string) => {

    let message = ""

    function sendMessageToBackgroundScript(message: string) {
        return new Promise((resolve, reject) => {
          chrome.runtime.sendMessage(message, (response) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve(response);
            }
          });
        });
      }

    try {
      const response: any = await sendMessageToBackgroundScript(inputText);
      
      if (response.success) {
        
        message = response.output

      } else {
        console.log("error ")
        console.log(response.output)

      }
    } catch (error:any) {
        console.log("response --")
        console.log(error.message)
        
    }
    return(message)
}