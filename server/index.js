var WebSocketServer = require('ws').Server;
var Server = require('./server.js').Server;

var wss = new WebSocketServer({ port : 1984});



wss.on('connection', function connection(ws) {
	console.log('connection');

	ws.on('message', function(message) {
		console.log('message');
		var message = JSON.parse(message);

		Server.exec(message, function(err, ret) {
			console.log('response');
			var response = {
				uid : message.uid,
				error : err,
				ret : ret
			};

			ws.send(JSON.stringify(response));
		});
	});
});


