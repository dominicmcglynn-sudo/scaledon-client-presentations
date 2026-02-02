const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function generatePDF(url, outputPath) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set viewport width (height will auto-expand for full page screenshot)
  await page.setViewportSize({ width: 1280, height: 800 });

  // Set credentials for basic auth
  await page.setExtraHTTPHeaders({
    'Authorization': 'Basic ' + Buffer.from('scaledon:daphnis2026').toString('base64')
  });

  await page.goto(url, { waitUntil: 'networkidle' });

  // Take a full-page screenshot as PNG
  const screenshotPath = outputPath.replace('.pdf', '.png');
  await page.screenshot({
    path: screenshotPath,
    fullPage: true,
  });

  console.log(`Screenshot saved to: ${screenshotPath}`);
  console.log('');
  console.log('To convert to PDF, open the PNG in Preview and export as PDF,');
  console.log('or use: sips -s format pdf ' + screenshotPath + ' --out ' + outputPath);

  await browser.close();
}

// Get URL and output from command line args
const url = process.argv[2] || 'https://scaledon-client-presentations.pages.dev/daphnis/';
const output = process.argv[3] || 'presentation.pdf';

generatePDF(url, output);
