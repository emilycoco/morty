var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var UserSchema = new mongoose.Schema({
	access_token: String,
	refresh_token: String,
	token_type: String,
	expiry_date: Date
});

var User = mongoose.model('User', UserSchema);
module.exports = User;
