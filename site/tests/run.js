#!/usr/bin/env node
process.env.NODE_ENV = 'test'
var nodeunit = require('nodeunit')
var config = require('../config')
var exec = require('child_process').spawn;
var sleep = require('sleep')
var mysql = require('mysql');

var tests = ['authentication.js']

var reporter = nodeunit.reporters.default;


function startWebserver()
{
	console.log('Spawning server');
	var webServer = exec('node', ['../app.js'], { env: { NODE_ENV: 'test' }})
	webServer.stdout.on('data', function (data) {
		console.log('server: ' + String(data).trim());
		if (!global.webServer && String(data).indexOf('running') >= 0)
			global.webServer = webServer;
	});
	webServer.stderr.on('data', function (data) {
		console.log('server: ' + String(data).trim());
	});
}

function setupDatabase()
{
	console.log('Setting up database ' + config.database.database);
	var connection = mysql.createConnection({
  		host	: config.database.host,
  		user	: config.database.username,
  		password: config.database.password,
	});

	connection.connect(function(err) {
		if (err)
		{
			console.log('Failed to connect to database')
			process.exit()
		}
		connection.query('DROP DATABASE IF EXISTS' + config.database.database, undefined, function(err, result) {
			connection.query('CREATE DATABASE ' + config.database.database, undefined, function(err, result) {
				global.database = connection;
			});
		});
	});
	return connection;
}

function shutdown() {
	global.database.query('DROP DATABASE ' + config.database.database, undefined, function(err, result) {
		global.webServer.kill('SIGKILL');
		global.database.end();
	});
}

function runTests() {
	if (!global.webServer || !global.database) {
		setTimeout(runTests, 500);
		return;
	}

	reporter.run(tests, undefined, function(result) {
		shutdown();
	});
}

setupDatabase();
startWebserver();

setTimeout(runTests, 500);