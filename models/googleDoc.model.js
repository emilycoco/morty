// ===== Utils =====
const HttpUtils = require('../utils/http-util');
const google = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const google_config = require('../client_secret.json');

const oauth2Client = new OAuth2(
	google_config.client_id,
	google_config.client_secret,
	'http://localhost:3000/'
);

const scopes =	[
	'https://www.googleapis.com/auth/drive.metadata.readonly'
];

const url = oauth2Client.generateAuthUrl({
	scope: scopes
});

class GoogleDocsModel {
	redirectToGoogleDocsAuth() {

	}
}

module.exports = GoogleDocsModel;
