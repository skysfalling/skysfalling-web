// Import the required modules
const express = require('express'); // Express framework for creating the server
const fs = require('fs'); // File system module to interact with the file system
const path = require('path'); // Path module for working with file and directory paths

// Configuration object to easily adjust path references
const config = {
    fontsDir: path.join(__dirname, 'src', 'fonts'), // Directory containing font files
    htmlFilePath: path.join(__dirname, 'src', 'pages', 'font-viewer.html'), // Path to the HTML file
    staticDir: path.join(__dirname, 'src'), // Directory to serve static files
    port: 5500 // Port number for the server
};

// Create an instance of an Express application
const app = express();

// Serve static files from the src directory
app.use(express.static(config.staticDir));
console.log(`Serving static files from directory: ${config.staticDir}`);

// API endpoint to get the list of font files
app.get('/api/fonts', (req, res) => {
    console.log(`Reading fonts from directory: ${config.fontsDir}`);
    // Read the contents of the fonts directory
    fs.readdir(config.fontsDir, (err, files) => {
        if (err) {
            // Log the error and send a 500 response with an error message
            console.error(`Error reading fonts directory: ${err.message}`);
            return res.status(500).json({ error: 'Unable to read fonts directory' });
        }
        // Filter the files to include only .ttf and .otf files
        const fonts = files.filter(file => file.endsWith('.ttf') || file.endsWith('.otf'));

        // Log the types of fonts found and the total count to the console
        const ttfFonts = fonts.filter(file => file.endsWith('.ttf')).length;
        const otfFonts = fonts.filter(file => file.endsWith('.otf')).length;
        console.log(`Found ${ttfFonts} TTF fonts and ${otfFonts} OTF fonts. Total: ${fonts.length} fonts.`);

        // Send the list of font files as a JSON response
        res.json(fonts);
    });
});

// Serve the index.html file when the root URL is accessed
app.get('/', (req, res) => {
    console.log(`Serving HTML file from path: ${config.htmlFilePath}`);
    res.sendFile(config.htmlFilePath, (err) => {
        if (err) {
            // Log the error if the file cannot be sent
            console.error(`Error serving HTML file: ${err.message}`);
            res.status(500).send('Unable to load the HTML file');
        }
    });
});

// Start the server on the specified port
app.listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port}`);
});
