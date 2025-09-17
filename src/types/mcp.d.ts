// Type definitions for MCP (Puppeteer)

interface PuppeteerScreenshotOptions {
  name: string;
  selector?: string;
  width?: number;
  height?: number;
  encoded?: boolean;
}

interface PuppeteerScreenshotResult {
  success: boolean;
  data: string;
  message?: string;
}

interface PuppeteerMCP {
  puppeteer_screenshot: (options: PuppeteerScreenshotOptions) => Promise<PuppeteerScreenshotResult>;
  puppeteer_navigate: (options: { url: string }) => Promise<{ success: boolean }>;
  puppeteer_click: (options: { selector: string }) => Promise<{ success: boolean }>;
  puppeteer_fill: (options: { selector: string; value: string }) => Promise<{ success: boolean }>;
  puppeteer_evaluate: (options: { script: string }) => Promise<any>;
}

declare global {
  interface Window {
    mcp?: {
      puppeteer_screenshot: PuppeteerMCP['puppeteer_screenshot'];
      puppeteer_navigate: PuppeteerMCP['puppeteer_navigate'];
      puppeteer_click: PuppeteerMCP['puppeteer_click'];
      puppeteer_fill: PuppeteerMCP['puppeteer_fill'];
      puppeteer_evaluate: PuppeteerMCP['puppeteer_evaluate'];
    };
  }
}