const express = require("express");
const app = express();

app.get("/", (req, res) =>{
  res.send("Welcome to the Continuous Integration/Deployment with zero downtime latest");
});

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.get("/users", (req, res) => {
  res.json([{ id: 1, name: "Aakash" }]);
});

app.get("/books",(req,res) => {
    res.json([{ id: 1, name: "Book New" }]);
});

app.get("/prices",(req,res) => {
  res.json([{ id: 1, name: "price" }]);
});

module.exports = app;