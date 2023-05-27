

export type twitterProfileObject = {
  twitterProfile: {
    twitterTag: string,
    userDescription: string,
    tweets: string[],
  }
}



export type linkedInProfileObject = {
  linkedInProfile: {
    userName: string,
    userDescription: string,
    aboutDescripton: string,
    experience: string[],
  }
}

export type profile = linkedInProfileObject | twitterProfileObject | null


export type getPromptType = {
  prompt: string | null
  profile: profile
}


export type getMessageType = {
    prompt: string,
  }

  
export type reloadMessage = {
  type: "reloadMessage",
}

export type eventMessage = {
    type: "event",
    profile: profile,
    message: string,
    eventType: "copy" | "reload"
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

export type backgroundScriptMessage = getVariableMessage | queryGPTMessage | storeVariableMessage | reloadMessage |loginMessage | checkLogin | eventMessage