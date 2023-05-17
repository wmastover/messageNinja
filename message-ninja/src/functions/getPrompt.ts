

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
Create a casual, non-salesy, one-line (less than 15 words) personalized message for the following LinkedIn user based on their name, user description, about description, and an array of their experience. Start the message with 'Hey **name**!'. Focus on one key detail: If they have an interesting 'about description' or 'user description', reference this. If not, reference their experience at a specific job and mention the company name. Avoid controversial topics like politics and asking questions. If no useful information is available, create a friendly greeting. 

Here is some examples, with good responses and bad responses:

Example 1 profile JSON:
{"linkedInProfile":{"userName":"Thomas","userDescription":"\n      Business Sales Graduate at Virgin Media O2\n    ","aboutDescripton":"Graduate of the University of Bath with a first-class honours in BSc International Management and French. I'm currently working at Virgin Media O2 on the Business Sales Graduate Scheme.","experience":["\n  Business Sales Graduate \n Virgin Media O2 · Full-time \n Sep 2022 - Present · 9 mos \n Manchester, England, United Kingdom \n","\n  EMEA Account Manager \n Waze · Internship \n Jan 2021 - Jul 2021 · 7 mos \n Paris, Île-de-France, France \n","\n  Junior Marketing Manager \n Moona · Internship \n Jun 2020 - Dec 2020 · 7 mos \n Paris, Île-de-France, France \n"]}}

Example 1 Good Response:
Hey Thomas! Your experience as an EMEA Account Manager at Waze sounds fascinating.

Example 1 Bad Response:
Hey Thomas! Business Sales Graduate at Virgin Media O2


Example 2 profile JSON:
{"linkedInProfile":{"userName":"Jack","userDescription":"\n      Analyst at Johnson Matthey\n    ","aboutDescripton":"-Studied at the University of Bath, where I graduated with First class honours in Chemistry (Mchem).-Completed a final year project that focused on reproducing the transient photovoltage behaviour of perovskite solar cells on the IonMonger simulation where I achieved a strong first class mark of 78%. -Currently working as an Analyst at Johnson Matthey, where I play a key role in the QC process. - Incoming PhD student in Materials Science and Engineering at Georgia Institute of Technology.","experience":["\n  Analyst \n Johnson Matthey · Full-time \n Jul 2022 - Present · 11 mos \n At Johnson Matthey I analyse a wide range or Platinum Group Metal compounds to ensure that JM products reach industry and client standards. This involves sticking to many tight deadlines and completing work of an exceptional standard consistently.I also play a key role in the EHS process but analysing effluent samples to ensure the company is in compliance with environmental regulations.I also take part in risk assessment reviews to ensure that procedures are conducted in the safest way possible.I have also been able to develop my understanding of 5S-Lean method as a way of optimising procedures and processes in the workplace. This includes optimising procedures to minimise wasted time and materials. \n Skills: 5S · Environment, Health, and Safety (EHS) · Problem Solving · Data Analysis · Analytical Chemistry · Platinum Group Chemistry  \n","\n  Member \n upReach · Full-time \n Jan 2022 - Present · 1 yr 5 mos \n Member of the UpReach social mobility platform \n","\n  Masters Project \n University of Bath · Full-time \n Oct 2021 - Jun 2022 · 9 mos \n Title : 'On the transient photovoltage behaviour of CsPbBr3 solar cells'This project involved 3 main parts:1) A broad literature review that focused on the underlying theory behind PSCs, the Pros and Cons associated with PSCs and the simulation of these cells as a diagnostic and predictive tool. This review received a first class grade.2) The generation of a parameter set and modification of the IonMonger software on MATLAB to create a simulation that could effectively model CsPbBr3 PSCs.3) Open-Circuit Photovoltage Decay (OCPV) measurements were taken on real life CsPbBr3 cells at varying temperatures and were then simulated on IonMonger. This led to the development of a theory focusing on mobile ions to explain the temperature dependence of the trends observed in the OCPV data.The final project also included a presentation and viva voce and received an overall first class mark of 78%. \n Skills: Presentation Skills · Electrochemistry · Python (Programming Language) · MATLAB · Programatical thinking · Analytical Thinking \n"]}}

Example 2 Good Response:
Hey Jack! Impressive Masters Project on transient photovoltage behaviour of CsPbBr3 solar cells.

Example 2 Bad Response:
Hey Jack! Your skills include 5S, Environment, Health, and Safety, Problem Solving, Data Analysis, Analytical Chemistry and Platinum Group Chemistry, impressive!

Here is a JSON object containing their linkedIn profile details :`

      query = prompt + `\n` + JSON.stringify(profileObject)


    } else {
      query = "not twitter or linkedIn"
    }
  
  return(query)
}