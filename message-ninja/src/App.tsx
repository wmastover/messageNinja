import React, { useState } from 'react';
import './App.css';
import { browser } from 'webextension-polyfill-ts';

const App: React.FC = () => {
  const [activeTabUrl, setActiveTabUrl] = useState('');
  const [activeTabHtml, setActiveTabHtml] = useState('');



  const getActiveTabUrl = async () => {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  
    if (tab.id) {
      setActiveTabUrl(tab.url || 'No URL available');
  
      try {
        await browser.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['contentScript.js'],
        });
  
        const response = await browser.tabs.sendMessage(tab.id, { action: 'getHtmlBody' });
  
        if (response && response.htmlBody) {
          setActiveTabHtml(response.htmlBody);
        } else {
          setActiveTabHtml('No HTML body available');
        }
      } catch (error) {
        console.error('Error injecting content script:', error);
        setActiveTabHtml('Error injecting content script');
      }
    }
  };  
  

  return (
    <div className="App">
      <h1>Active Tab URL</h1>
      <button onClick={getActiveTabUrl}>Get Active Tab URL</button>
      <p>{activeTabUrl}</p>
      <p>{activeTabHtml}</p>
    </div>
  );
};

export default App;
