require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3501;
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("../config/dbconn.js");

connectDB();

app.use("/register", require("../controllers/registerController"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.get("/excel.html", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/excel.html"));
});

app.listen(PORT, () => console.log(`Server runing on port ${PORT}`));

mongoose.connection.once("open", () => {
  console.log("Connceted to MongoDB");
});

module.exports = app;
