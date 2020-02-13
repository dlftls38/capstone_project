var mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Post = new Schema({
    writer: String,
    contents: String,
    title: String,
    date: {
        created: { type: Date, default: Date.now },
        edited: { type: Date, default: Date.now }
    },
    is_edited: { type: Boolean, default: false }
});

module.exports = mongoose.model('post', Post);
