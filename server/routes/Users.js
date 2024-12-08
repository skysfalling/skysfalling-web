const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");

// << GET : GET ALL USERS >> ==============================================
router.get("/", async (req, res) => {
    const listOfUsers = await Users.findAll();
    res.json(listOfUsers);
});

// << POST : REGISTER USER >> ==============================================
router.post("/", async (req, res) => {
    const { email, password } = req.body;
    
    // Hash password
    bcrypt.hash(password, 10).then((hash) => {
        Users.create({
            email: email,
            password: hash
        });
    });
    
    // Return success message
    res.json("SUCCESS");
});

// << POST : LOGIN USER >> ==============================================
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Attempt to find user by email
    const user = await Users.findOne({ where: { email: email } });

    // If user doesn't exist, return error
    if (!user) res.json({ error: "User doesn't exist" });

    // Compare password with hashed password
    bcrypt.compare(password, user.password).then((match) => {
        if (!match) res.json({ error: "Wrong username and password combination" });
    });

    res.json("SUCCESS");
}); 


module.exports = router;