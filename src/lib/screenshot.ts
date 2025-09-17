// Screenshot utility functions

// Global variable to store the latest screenshot data
declare global {
  interface Window {
    latestScreenshot: string | undefined;
  }
}

// Initialize the global variable if it doesn't exist
if (typeof window.latestScreenshot === 'undefined') {
  window.latestScreenshot = undefined;
}

// Function to store the latest screenshot
export const storeScreenshot = (dataUrl: string) => {
  window.latestScreenshot = dataUrl;
};

// Function to get the latest screenshot
export const getLatestScreenshot = (): string | undefined => {
  return window.latestScreenshot;
};