var http = require('request');
var config = require('../config')

function post(url, data, callback) {

	var requestBody = JSON.stringify(data)
	if (config.debug) {
		console.log('URL: ' + url);
		console.log('Request: ' + requestBody);
	}

	http.post({ url: url, body: requestBody, headers: { 'Content-Type': 'application/json'} }, function(error, response, body) {

		if (response == undefined)
			body = '{ "status": "fail" }'

		if (config.debug)
			console.log('Response: ' + body);

		callback(JSON.parse(body))
	});
}

module.exports = {post: post}
