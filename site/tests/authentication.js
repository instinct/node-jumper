var post = require('../core/post.js')

exports.testRegister1 = function(test) {
	post.post('http://localhost:8081/api/authentication/register', {username: 'test', email: 'test@example.com', 'password': 'password'}, function(result) {
		test.ok(result['status'] == 'ok')
		test.done()
	});
}

exports.testRegister2 = function(test) {
	post.post('http://localhost:8081/api/authentication/register', {username: 'test2', email: 'test@example.com', password: 'password'}, function(result) {
		test.ok(result['status'] == 'emailexists')
		test.done()
	});
}

exports.testLoginSuccess = function(test) {
	post.post('http://localhost:8081/api/authentication/login', {username: 'test', password: 'password'}, function(result) {
		test.ok(result['status'] == 'ok')
		test.done()
	});
}

exports.testLoginFail = function(test) {
	post.post('http://localhost:8081/api/authentication/login', {username: 'test', password: 'badpassword'}, function(result) {
		test.ok(result['status'] == 'fail')
		test.done()
	});
}



