function getHtmlBody() {
    return document.body.innerHTML;
  }
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getHtmlBody') {
      sendResponse({ htmlBody: getHtmlBody() });
    }
  });
  