// ====== Utils ======
let express = require('express');
let path = require('path');
let router = express.Router();
var User = require('../db/User');
let moment = require('moment');
// ===== Google =====
const google = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const google_config = require('../client_secret.json');
let redirect = '';


const oauth2Client = new OAuth2(
	google_config.client_id,
	google_config.client_secret,
	'http://localhost:3000/google-docs/oauthcallback'
);

google.options({
	auth: oauth2Client
});

var drive = google.drive({
	version: 'v3',
	auth: oauth2Client
});

const scopes =	[
	'https://www.googleapis.com/auth/drive'
];

const authUrl = oauth2Client.generateAuthUrl({
	access_type: 'offline',
	scope: scopes
});

function createUserFromTokens(tokens){
	var newUser = new User({
		access_token: tokens.access_token,
		refresh_token: tokens.refresh_token,
		token_type: tokens.token_type,
		expiry_date: tokens.expiry_date
	});

	return newUser.save();
}

function setCredentials() {
	return User.findOne({token_type: 'Bearer'})
		.then(user => {
			oauth2Client.setCredentials(user);
			return { success: true }
		})
		.catch(err => {
			res.redirect('/authorize');
		});
}

// ===== Public =====

function redirectToGoogleAuth(req, res) {
	res.redirect(authUrl);
}

function getAuthTokenFromCode(req, res) {
	oauth2Client.getToken(req.query.code, (err, tokens) => {
		if (err) {
			console.log('success', err, tokens)
			res.status(500).send({success: false});
		} else {
			createUserFromTokens(tokens)
				.then(rsp => {
					if (redirect) {
						res.redirect(redirect);
						res.status(200).send({success: true});
					} else {
					}
				})
				.catch(err => {
					console.log(err)
				});
		}
	});
}

function uploadFile(req, res) {
	setCredentials()
		.then(rsp => {
			console.log('creds set', rsp);
			drive.files.create({
				resource: {
					name: moment().format('YYYY[-]MM[-]DD'),
					mimeType: 'text/plain'
				},
				media: {
					mimeType: 'text/plain',
					body: 'Hello World'
				}
			}, (err, file) => {
				res.status(200).send({document: file});
			});
		})
		.catch(err => {
			redirect = '/google-docs/postFile';
			res.redirect('/google-docs/authorize');
		})
}

class GoogleDocsController {
	static setupRoutes(router) {
		router.get('/authorize', redirectToGoogleAuth);
		router.get('/oauthcallback', getAuthTokenFromCode);
		router.get('/postFile', uploadFile);
	}
}

GoogleDocsController.setupRoutes(router);

module.exports = router;
