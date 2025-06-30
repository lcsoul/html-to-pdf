const express = require('express');
const { generatePDF } = require('./generatePDF');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/generate-pdf', async (req, res) => {
    try {
        const { html: htmlString, options = {} } = req.body;
        
        if (!htmlString) {
            return res.status(400).send('HTML content is required');
        }

        const pdfBuffer = await generatePDF(htmlString, options);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=generated.pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error('PDF generation error:', error);
        res.status(500).send('Error generating PDF');
    }
});

app.listen(port, () => {
    console.log(`PDF generation service running on port ${port}`);
});
