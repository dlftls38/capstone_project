var mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Chatbot = new Schema({
	number: Number,
    userid: String,
    chatbotid: String,
    entity: String,
	intent: String,
	sentence: String,
    date: {
        created: { type: Date, default: Date.now },
        edited: { type: Date, default: Date.now }
    },
});

module.exports = mongoose.model('chatbot', Chatbot);
