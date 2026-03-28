const express = require("express");
const app = express();

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.get("/users", (req, res) => {
  res.json([{ id: 1, name: "Aakash" }]);
});

app.get("/books",(req,res) => {
    res.json([{ id: 1, name: "Book New" }]);
});

module.exports = app;