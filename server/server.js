var static = require('node-static');
var file = new static.Server('../public_html');

require('http').createServer(function(request, response) {
	request.addListener('end', function() {
		file.serve(request, response);
	}).resume();
}).listen(1337);
console.log("running");