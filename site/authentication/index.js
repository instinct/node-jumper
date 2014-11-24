var express = require('express');
var app = express();
var models = require('../models');

app.post('/api/authentication/register', function(req, res) {

	var username = req.body['username'];
	var email = req.body['email'];
	var password = req.body['password'];

	models.User.find({ where: { username: username } }).success(function(users) {
		if (users != null)
		{
			res.json({ 'status': 'usernameexists', 'message': 'Username already in use'})
			return;
		}

		models.User.find({ where: { email: email } }).success(function(users) {

			if (users != null)
			{
				res.json({ 'status': 'emailexists', 'message': 'Email already exists'})
				return;
			}

			models.User.create({username: username, email:email, password: password, joined: new Date(), lastLogin: new Date() })

    		res.json({ status: 'ok' })
		});
	})
});

app.post('/api/authentication/login', function(req, res) {

	var username = req.body['username'];
	var password = req.body['password'];

	console.log(req.body);

	models.User.find({ where: { username: username, password: password } }).success(function(users) {

		if (users == null)
		{
			res.json({ 'status': 'fail', 'message': 'Invalid username or password'})
		}
		else
		{
			res.json({ status: 'ok' })
		}
	});
});

module.exports = app;
