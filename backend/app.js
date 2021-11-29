const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const postRoutes = require("./routes/posts");

const app = express();

mongoose
  .connect(
    "mongodb+srv://cody:NnPsjXQeEzj7cFjN@cluster0.jbuvc.mongodb.net/node-angular?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("connected to db");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ entended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS, PUT"
  );
  next();
});
app.use("/api/posts", postRoutes);
module.exports = app;
