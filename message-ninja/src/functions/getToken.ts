

// used to get the prompt to send to openAI from a url and the content
export const getToken =  (url: string, iframe: HTMLIFrameElement): string => {


  var returnToken = "no token"

  
  if (url.includes("https://messageninja.ai")) {

    try {
      const token = iframe.contentDocument?.getElementById("authenticationToken")?.textContent
      console.log("this is the token")
      console.log(token)
      if(token) {
        returnToken = token
      }

    } catch {
      console.log("error withe get Token")


    }
    
  }
  return(returnToken)
}