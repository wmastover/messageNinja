export type getMessageType = {
    prompt: string,
  }


  
export type reloadMessage = {
  type: "reloadMessage",
}

export type  getVariableMessage = {
    type: "getVariable",
    key: string,
  }

export type queryGPTMessage= {
    type: "queryGPT",
    content: string
  }

export type storeVariableMessage = {
  type: "storeVariable",
  key: string,
  value: string,
}

export type loginMessage = {
  type: "login",
  token: string

}

export type checkLogin = {
  type: "checkLogin",

}

export type backgroundScriptMessage = getVariableMessage | queryGPTMessage | storeVariableMessage | reloadMessage |loginMessage | checkLogin