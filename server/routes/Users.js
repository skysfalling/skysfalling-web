const express = require("express");
const router = express.Router();
const { Users } = require("../models");

// << GET : GET ALL USERS >> ==============================================
router.get("/", async (req, res) => {
    const listOfUsers = await Users.findAll();
    res.json(listOfUsers);
});

// << POST : CREATE USER >> ==============================================
router.post("/", async (req, res) => {
    const user = req.body;
    await Users.create(user);
    res.json(user);
});

module.exports = router;