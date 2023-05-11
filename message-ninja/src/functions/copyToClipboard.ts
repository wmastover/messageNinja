export const copyToClipboard = async (text: string) => {
    try {
      // navigator.clipboard API is asynchronous
      await navigator.clipboard.writeText(text);
      console.log('Text copied to clipboard');
    } catch (err) {
      console.log('Failed to copy text: ', err);
    }
  }