const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  id: String,
  title: {type: String, require: true},
  content: {type: String, require: true},
  imagePath: {type: String, require: true}
});

module.exports = mongoose.model('Post', postSchema);

