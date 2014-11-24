var express = require('express');
var bodyParser = require('body-parser');
var models = require('./models')
var config = require('./config')
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var leaderboard = require('./authentication');
app.use(leaderboard);

app.all('*', function(req, res){
	res.status(404).json({msg: 'Can\'t find', path: req.path});
});

function runServer() {
	app.listen(config.port)
	console.log('Server running on port ' + config.port);
}

if (config.name == 'production')
	runServer()
else
	models.sequelize.sync().success(runServer)