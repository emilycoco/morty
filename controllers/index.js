var express = require('express');
var router = express.Router();
var path = require('path');

// Define top level routes here and secondary routes in controllers. Secondary routes are matched as children of top level routes.
class IndexController {
	static setupRouters() {
		router.use('/google-docs', require(path.resolve(__dirname, './googleDocs.controller')));
	}
}

IndexController.setupRouters();

module.exports = router;
