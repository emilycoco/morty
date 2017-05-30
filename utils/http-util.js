const axios = require('axios');

class HttpUtils {
	makeRequest(method, url, data) {
		const config = {
			method: method,
			url: url
		};

		if (data) {
			config.data = data;
		}

		return axios(config);
	}
}

module.exports = HttpUtils;
