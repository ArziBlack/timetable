import React, { useEffect } from 'react';
import { storeScreenshot } from '../lib/screenshot';

interface ScreenshotHandlerProps {
  // Optional props can be added here
}

/**
 * Component that handles taking screenshots using Puppeteer MCP
 * This component doesn't render anything visible
 */
export const ScreenshotHandler: React.FC<ScreenshotHandlerProps> = () => {
  // Function to take a screenshot using Puppeteer MCP
  const takeScreenshot = async () => {
    try {
      // Use the Puppeteer MCP to take a screenshot
      // This will be called when the component mounts
      // and will store the screenshot in the global variable
      
      // @ts-ignore - Using MCP Puppeteer
      const puppeteerScreenshot = await window.mcp?.puppeteer_screenshot({
        name: 'timetable-screenshot',
        width: 1200,
        height: 800,
        encoded: true
      });
      
      if (puppeteerScreenshot && puppeteerScreenshot.data) {
        // Store the screenshot for later use
        storeScreenshot(puppeteerScreenshot.data);
        console.log('Screenshot taken and stored successfully');
      } else {
        console.warn('Failed to take screenshot with Puppeteer MCP');
      }
    } catch (error) {
      console.error('Error in screenshot handler:', error);
    }
  };

  // Initialize the screenshot handler
  useEffect(() => {
    // Take initial screenshot when component mounts
    takeScreenshot();
    
    // Set up interval to refresh screenshot every 5 seconds
    const intervalId = setInterval(takeScreenshot, 5000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  // This component doesn't render anything visible
  return null;
};