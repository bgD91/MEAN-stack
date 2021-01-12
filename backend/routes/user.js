const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require('../models/user');


const router = express.Router();

router.post(
  "/register",
  (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(result => {
            res.status(201).json({
              message: 'User created',
              result: result
            })
          })
          .catch(err => {
            res.status(500).json({
              error: err
            });
          })
      });
  });

router.post(
  "/login",
  (req, res, next) => {
    let fetchedUser;
    User.findOne({email: req.body.email})
      .then(user => {
        if (!user) {
          return res.status(404).json({
            message: 'Invalid user',
            request: req,
          });
        }
        fetchedUser = user;
        console.log(fetchedUser);
        return bcrypt.compare(req.body.password, user.password);
      })
      .then(result => {
        console.log(result);
        if (!result) {
          return res.status(401), json({
            message: 'Invalid password'
          });
        }
        const token = jwt.sign({
            email: fetchedUser.email,
            userId: fetchedUser._id
          },
          'very_long_secret_for_development12312',
          {expiresIn: '1h'});
        res.status(200).json({
          token: token,
          expiresIn: 3600
        });
      })
      .catch(authError => {
        return res.status(401).json({
          message: 'Auth failed',
          error: authError
        })
      })

  }
);

module.exports = router;