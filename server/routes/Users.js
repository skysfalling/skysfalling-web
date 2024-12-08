const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const dummyUsers = require("../user-dummies.json");

// << GET : ALL USERS >> ===================================================
router.get("/getAll", async (req, res) => {
    const users = await Users.findAll({
        order: [
            ['email', 'ASC']  // Sort by email in ascending order
        ]
    });
    return res.json(users);
});

// << POST : REGISTER USER >> ==============================================
router.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user already exists
        const existingUser = await Users.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash password
        const hash = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await Users.create({
            email: email,
            password: hash
        });

        // Return success message
        return res.json({
            message: "REGISTER USER : SUCCESS",
            user: email
        });
    } catch (error) {
        return res.status(500).json({
            error: "An error occurred during registration",
            details: error.message
        });
    }
});

// << POST : LOGIN USER >> ==============================================
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Attempt to find user by email
        const user = await Users.findOne({ where: { email: email } });

        // If user doesn't exist, return error
        if (!user) {
            return res.status(404).json({ error: "User doesn't exist" });
        }

        // Compare password with hashed password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: "Wrong username and password combination" });
        }

        // If everything is correct, send success response
        return res.json({
            message: "LOGIN USER : SUCCESS",
            user: email
        });
    } catch (error) {
        return res.status(500).json({
            error: "An error occurred during login",
            details: error.message
        });
    }
});


// << POST : CREATE DUMMY USERS >> ==============================================
router.post("/dummies", async (req, res) => {
    try {
        const results = [];
        
        // Process each dummy user
        for (const dummyUser of dummyUsers) {
            try {
                // Check if user already exists
                const existingUser = await Users.findOne({ where: { email: dummyUser.email } });
                if (existingUser) {
                    results.push({ email: dummyUser.email, status: 'skipped', message: 'User already exists' });
                    continue;
                }

                // Hash password
                const hash = await bcrypt.hash(dummyUser.password, 10);

                // Create user
                await Users.create({
                    email: dummyUser.email,
                    password: hash,
                    name: dummyUser.name
                });

                results.push({ email: dummyUser.email, status: 'success', message: 'User created successfully' });
            } catch (error) {
                results.push({ email: dummyUser.email, status: 'error', message: error.message });
            }
        }

        return res.json({
            message: "DUMMY USERS CREATION COMPLETE",
            results: results
        });
    } catch (error) {
        return res.status(500).json({
            error: "An error occurred while creating dummy users",
            details: error.message
        });
    }
});

module.exports = router;