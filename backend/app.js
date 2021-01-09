const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));

mongoose.connect('mongodb+srv://bgd321:N6kl59YdmuM6sFrQ@cluster0.flgly.mongodb.net/Cluster0?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('connected to db');
  })
  .catch((error) => {
    console.log(error);
  });


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader(
    'Access-Control-Allow-Headers',
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(result => {
    res.status(201).json({
      message: "Post added successfully!",
      postId: result._id
    });
  });

});

app.get("/api/posts", (req, res, next) => {
  let allPosts;
  Post.find()
    .then((documents) => {
      console.log(documents);
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: documents
      })
    })
    .catch((error) => {
      console.log(error);
    });

});

app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({_id: req.params.id})
    .then((response) => {
      console.log(response);
      res.status(200).json({
        message: "Post deleted!"
      })
    })
});

module.exports = app;
