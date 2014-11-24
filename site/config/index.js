"use strict"
var merge = require("merge")
var envname = process.env.NODE_ENV || "development";

var envConfig = require("./" + envname + ".js")

var config = {
	name: envname,
	debug: envname != "production",
	port: 8081
}

module.exports = merge(config, envConfig)