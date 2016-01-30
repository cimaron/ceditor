var fsp = require('./fsp.js');


FS = {
	ls : function(args, cb) {

		var prom = fsp.readdir(args.path);
			
		prom.then(function(files) {
			cb(null, files);
		}, function(err) {
			cb(err, null);
		});

		return prom;
	},

	lsStat : function(args, cb) {

		var prom = fsp.readdir(args.path);

		prom.then(function(files) {

			var all = [];
			var stats = [];
			
			for (var i = 0; i < files.length; i++) {
				(function(file) {
					var prom = fsp.stat(args.path + '/' + file).then(function(stat) {
						stat.is_file = stat.isFile();
						stat.is_dir = stat.isDirectory();
						stat.name = file;
						stat.path = args.path + '/' + file;
						stats.push(stat);
					});
					all.push(prom);
				}(files[i]));
			};

			prom = Promise.all(all);
			prom.then(function(list) {
				cb(null, stats);
			});

			return prom;

		}, function(err) {
			cb(err, null);
		});

		return prom;
	},

	readFile : function(args, cb) {
		fsp.readFile(args.path).then(function(data) {
			cb(null, data.toString());
		}, function(err) {
			cb(err, null);
		});
	},

	writeFile : function(args, cb) {
		fsp.writeFile(args.path, args.data, args.options).then(function() {
			cb(null, null);
		}, function(err) {
			cb(err, null);
		});
	}
};


Server = {};

Server.fn = {
	'fs.ls' : FS.ls,
	'fs.readFile' : FS.readFile,
	'fs.lsStat' : FS.lsStat,
	'fs.writeFile' : FS.writeFile
};

Server.exec = function(req, cb) {

	if (!this.fn[req.fn]) {
		cb("Method not found");
		return;
	}

	this.fn[req.fn](req.args, function(err, ret) {
		cb(err, ret);
	});

};



module.exports = {

	Server : Server
};
