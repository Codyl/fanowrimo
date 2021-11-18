const express = require('express');
// const bodyParser = require("body-parser");

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
})
app.post("/api/posts", (req, res, next) => {
  const post = req.body;
  console.log(post);
  res.status(201).json();
});
app.get('/api/posts',(req, res, next) => {
  console.log("First middlware")
  const posts = [
    {
      id: 0,
      title: "test",
      content: "Content",
    },
    {
      id: 0,
      title: "test 2",
      content: "Content 2",
    }
  ];
  res.status(200).json(posts);
});

module.exports = app;