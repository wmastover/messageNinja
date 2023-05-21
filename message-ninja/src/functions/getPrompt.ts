

// used to get text from a block when it contains multiple elements
function extractTextFromChildren(element: any): string {
    if (!element) {
      console.warn('Invalid element passed to the function.');
      return " invalid element passed, error in extract text from children";
    }
  
    let text = '';
  
    const children = element.children;
    for (let i = 0; i < children.length; i++) {
      const childElement = children[i] as HTMLElement;
      text += childElement.textContent;
    }
    if (text){
      return text
    } else{
      return "error in extract text from children"
    }
    ;
}


// used to get the prompt to send to openAI from a url and the content
export const getPrompt =  (url: string, iframe: HTMLIFrameElement): string => {


    let queryText = "";
    let query = ""


    if (url.includes("https://twitter.com")) {


        type profileObject = {
          twitterProfile: {
            twitterTag: string,
            userDescription: string,
            tweets: string[],
          }
        }

        const profileObject: profileObject = {
          twitterProfile: {
            twitterTag: "",
            userDescription: "",
            tweets: [],
          }
        }

        const profileUser = url.split("/")[3]


        const userDescriptionXpath = ".//div[@data-testid='UserDescription']";
        const userDescriptionResult = iframe.contentDocument?.evaluate(userDescriptionXpath, iframe.contentDocument, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        const targetElement = userDescriptionResult?.singleNodeValue;
  
        try {
          if (targetElement) {

            const userDescription = extractTextFromChildren(targetElement)

            
            profileObject.twitterProfile.twitterTag = profileUser
            profileObject.twitterProfile.userDescription = userDescription
            // queryText += `
            // \n Users Twitter Tag: ${profileUser}\n
            // \n User Description: ${userDescription}\n ` ;

            
    
          } else {
    
            console.log("user description not found")
    
          } 
        } catch {
          console.log("error getting name and user description")
        }

        //get tweets
        try{
          const xpathTweetsList = '//div[@data-testid="cellInnerDiv"]';
          const resultTweetsList = iframe.contentDocument?.evaluate(xpathTweetsList, iframe.contentDocument, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    
          // create counter so query can only send 3 tweets 
          let tweetsAdded = 0
  
          //check if cointainer exists
          if(resultTweetsList){
            //initiate loop if some tweets exist
            if (resultTweetsList.snapshotLength > 0) {
              for (let i = 0; i < resultTweetsList.snapshotLength; i++) {
  
                const tweet = resultTweetsList.snapshotItem(i);
  
                let tweetUser: string | null = "";
                let tweetText: string | null = "";
    
                try {
                  if (tweet){
                    //convert tweet to element so I can use query selector
                    const element = tweet as HTMLElement
  
                    const tweetUserElement = element.querySelector('div[data-testid="User-Name"] a');
                    const tweetTextElement = element.querySelector('div[data-testid="tweetText"]');
        
                    if (tweetUserElement) {
                      tweetUser = tweetUserElement.getAttribute("href");
                      
                    }
                    if (tweetTextElement) {
                      tweetText = extractTextFromChildren(tweetTextElement);
                    }
                  }
                } catch (error) {
                  console.error("Error while extracting tweet information:", error);
                }
                  
                if (tweetUser) {
                  tweetUser = tweetUser.replace("/", "")
                }
               
                if (tweetUser === profileUser) {
                  if (tweetsAdded < 3){
                    profileObject.twitterProfile.tweets.push(tweetText.replace(/[\r\n]+/g, ''))
                    // queryText += `\n User Tweet: ${tweetText}\n `;
                    tweetsAdded = tweetsAdded + 1
                  }
                }
              }
            }
          }
        } catch {
          console.log("error getting tweets")
        }
        const prompt = "Create a casual, non-salesy, one-line personalized message for the following Twitter user based on their twitter tag, user description, and an array of recent tweets. Start the message with 'Hey @twittertag’ and focus on one key detail: reference a specific tweet if informative or interesting. Alternatively: mention their industry, job, or interests based on their user description. Avoid controversial topics like politics and asking questions. If no useful information is available, create a friendly greeting. Here is a JSON object containing the profile details:"
        query = prompt + `\n` + JSON.stringify(profileObject)


    } else if (url.includes("www.linkedin.com")) {

      type profileObject = {
        linkedInProfile: {
          userName: string,
          userDescription: string,
          aboutDescripton: string,
          experience: string[],
        }
      }
      const profileObject: profileObject = {
        linkedInProfile: {
          userName: "",
          userDescription: "",
          aboutDescripton: "",
          experience: [],
        }
      }

      
      console.log("linkedIn")

      // get name and description pannel 
      try {
        const leftPanel = iframe.contentDocument?.getElementsByClassName("pv-text-details__left-panel")[0]

        let name: string | null | undefined = ""
        let userDescription: string | null | undefined = ""


        const nameElement = leftPanel?.getElementsByTagName("h1")
        if (nameElement) {
          name = nameElement[0].textContent?.split(" ")[0]
        }

        const userDescriptionElement = leftPanel?.getElementsByTagName("div")[1]
        if (userDescriptionElement ) {
          userDescription = userDescriptionElement.textContent
        }
        if (name) {
          profileObject.linkedInProfile.userName = name
        }
        if (userDescription) {
          profileObject.linkedInProfile.userDescription = userDescription
        }
        
        // queryText+= `
        // \n Users Name: ${name}\n
        // \n User Description: ${userDescription}\n `

      } catch(err) {
        console.log("error with description")
      }

      // get about panel 
      try{
        const aboutPanel = iframe.contentDocument?.getElementById("about")

        const aboutPanelItems = aboutPanel?.parentElement

        const aboutPanel2 = aboutPanelItems?.getElementsByClassName("inline-show-more-text")[0]

        const aboutTextItems = aboutPanel2?.getElementsByTagName("span")[0]


        const aboutText = aboutTextItems?.textContent

        if (aboutText) {
          profileObject.linkedInProfile.aboutDescripton = aboutText
        }
        // queryText+= `
        
        // \n About: ${aboutText}\n `
        

        } catch(err) {
          console.log("error with about")
        }


        // get experience panel 
        try{
          const experiencePanel = iframe.contentDocument?.getElementById("experience")

          const experiencePanelItemsContainer = experiencePanel?.parentElement


          const experiencePanelItems = experiencePanelItemsContainer?.getElementsByClassName("artdeco-list__item")
          

          let itterations = 0
          if (experiencePanelItems) {
            if (experiencePanelItems.length > 3) {
              itterations = 3
            } else {
              itterations = experiencePanelItems.length
            }
            for (let i = 0; i < itterations; i++) {
            
              const experiencePanelItem = experiencePanelItems[i]
              const array = experiencePanelItem.querySelectorAll('span[aria-hidden="true"]')
  
              let experience = `\n `
              
              
  
              for (let i = 0; i < array.length; i++) {
                experience += ` ${array[i].textContent} \n`
              }
              if (experience) {
                profileObject.linkedInProfile.experience.push(experience)
              }
              // queryText+= `
              // \n Experience: ${experience}\n `
            }
          }
        } catch(err) {
          console.log("error with experience")
        }
      
      const prompt = `
Create a succinct, personalized one-liner for the following LinkedIn user, using their profile information. The message should be a very short sentence and start with 'Hey **name**!'. Please reference a single detail from their profile information. Avoid controversial subjects and questions. Make sure to reference or comment on profile information, not just parrot it back. The reply should not contain any information about the sender.

Above all the reply should make sense, read well and be as succinct as possible.

Here is the JSON object containing the LinkedIn profile details:`

      query = prompt + `\n` + JSON.stringify(profileObject)


    } else {
      query = "not twitter or linkedIn"
    }
  
  return(query)
}