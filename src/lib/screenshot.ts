// Screenshot utility functions

// Global variable to store the latest screenshot data
declare global {
  var latestScreenshot: string | undefined;
}

// Initialize the global variable if it doesn't exist
if (typeof global.latestScreenshot === 'undefined') {
  global.latestScreenshot = undefined;
}

// Function to store the latest screenshot
export const storeScreenshot = (dataUrl: string) => {
  global.latestScreenshot = dataUrl;
};

// Function to get the latest screenshot
export const getLatestScreenshot = (): string | undefined => {
  return global.latestScreenshot;
};