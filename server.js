const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Define allowed origins
const allowedOrigins = ['http://localhost:3000'];

// Basic middleware
app.use(express.json());

// Custom CORS middleware
app.use((req, res, next) => {
    const origin = req.headers.origin;
    
    // Check if the origin is allowed
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    }

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// GitHub auth endpoint
app.post('/api/github/auth', async (req, res) => {
    try {
        const { code } = req.body;
        
        const response = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code: code
        }, {
            headers: {
                Accept: 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Token exchange error:', error.response?.data || error.message);
        res.status(500).json({ 
            error: 'Failed to exchange code for token',
            details: error.response?.data || error.message 
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('CORS enabled for:', allowedOrigins.join(', '));
});