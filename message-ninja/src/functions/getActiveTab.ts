import { browser } from 'webextension-polyfill-ts';

type MyType = {
    url: string;
    iframe: HTMLIFrameElement;
  };

export const getActiveTab = async (): Promise<MyType> => {
    const iframe = document.createElement("iframe")
    let url = ""
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  
    //get iframe containing DOM
    if (tab.id) {
      
      try {
        await browser.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['contentScript.js'],
        });
  
        const response = await browser.tabs.sendMessage(tab.id, { action: 'getHtmlBody' })
        
        if (response && response.htmlBody) {

          iframe.style.display = "none";
          document.body.appendChild(iframe);

          if (iframe.contentDocument){
            iframe.contentDocument.documentElement.innerHTML = response.htmlBody
          }
          
          if(tab.url){
            url = tab.url 
          }
          
        } else {
          console.log("html body error")
          ;
        }
      } catch (error) {
        console.error('Error injecting content script:', error);
      }
    }
    return({url: url, iframe: iframe})
  };  