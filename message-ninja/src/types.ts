export type getMessageType = {
    prompt: string,
    APIKey: string,
  }


  
export type reloadMessage = {
  type: "reloadMessage",
  APIKey: string,
}

export type  getVariableMessage = {
    type: "getVariable",
    key: string,
  }

export type queryGPTMessage= {
    type: "queryGPT",
    content: string
    APIKey: string
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

export type backgroundScriptMessage = getVariableMessage | queryGPTMessage | storeVariableMessage | reloadMessage |loginMessage