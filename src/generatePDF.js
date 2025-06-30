const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generatePDF(htmlContent, options = {}) {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: [
            '--disable-dev-shm-usage',
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, {
        waitUntil: 'networkidle0'
    });
    
    const pdfOptions = {
        format: 'A4',
        printBackground: true,
        margin: {
            top: '10mm',
            right: '10mm',
            bottom: '10mm',
            left: '10mm'
        },
        ...options
    };
    
    const pdfBuffer = await page.pdf(pdfOptions);
    await browser.close();
    
    return pdfBuffer;
}

module.exports = { generatePDF };
