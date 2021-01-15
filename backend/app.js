const path = require("path");

const express = require('express');

const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();

mongoose.connect(
    "mongodb+srv://bgd321:" +
    process.env.MONGO_ATLAS_PASSWORD +
    "@cluster0.flgly.mongodb.net/Cluster0?retryWrites=true&w=majority", {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('connected to db');
    })
    .catch((error) => {
        console.log('connection to db failed');
    });


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/* Use express.static() to grant static access to any requests
 that are targeting /images */
app.use("/images", express.static(path.join("images")));




app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
