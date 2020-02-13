var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const Account = new Schema({
    username: String,
    id: String,
    password: String,
    phone_number: String,
    created: { type: Date, default: Date.now  }
});

Account.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, 8);
};

// compares the password
Account.methods.validateHash = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('account', Account);
