const express = require("express");
const cors = require("cors");

// ====================== << DOTENV VARIABLES >> ======================
const dotenv = require("dotenv");
dotenv.config();

// ====================== << EXPRESS SERVER >> ======================
const app = express();
app.use(cors());
app.use(express.json());

// ====================== << DATABASE CONNECTION >> ======================
const db = require("./models");

// ====================== << ROUTES >> ======================
const userRouter = require("./routes/Users"); // << Required User SQL Table
app.use("/users", userRouter); // << Set User Route
app.use("/auth", userRouter); // << Set Authentication Route

// ====================== << SERVER LISTENERS >> ======================
db.sequelize.sync().then(() => {
  app.listen(process.env.SERVER_PORT, () => {
    console.log(`Connected to server on port ${process.env.SERVER_PORT}`);
  });
});