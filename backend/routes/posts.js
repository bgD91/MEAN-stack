const express = require("express");
const multer = require("multer");

const Post = require('../models/post');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',

}

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimeType];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images")
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const extension = MIME_TYPE_MAP[file.mimeType];
    // Construct new file name with no error
    cb(null, name + '-' + Date.now() + '.' + extension)
  }
});


router.post("", multer(fileStorage).single("image"), (req, res, next) => {
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

router.put("/:id", (req, res, next) => {
  const updatedPost = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
  });
  Post.updateOne({_id: req.params.id}, updatedPost)
    .then(result => {
      res.status(200).json({message: 'Update successful!'});
    });
});

router.get("", (req, res, next) => {
  let allPosts;
  Post.find()
    .then((documents) => {
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: documents
      })
    })
    .catch((error) => {
      console.log(error);
    });

});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json({post});
    } else {
      res.status(404).json({message: 'Post not found!'});
    }
  })
});

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({_id: req.params.id})
    .then((response) => {
      console.log(response);
      res.status(200).json({
        message: "Post deleted!"
      });
    })
});

module.exports = router;
