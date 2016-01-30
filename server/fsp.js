var fs = require('fs');

var fsp = {};


fsp.readdir = function(path) {
	
	var promise = new Promise(function(resolve, reject) {
		
		fs.readdir(path, function(err, files) {
			if (err) {
				reject(err);
			} else {
				resolve(files);
			}
		});

	});

	return promise;
};

fsp.stat = function(path) {

	var promise = new Promise(function(resolve, reject) {

		fs.stat(path, function(err, stats) {
			if (err) {
				reject(err);
			} else {
				resolve(stats);
			}
		});

	});

	return promise;
};

fsp.readFile = function(file, options) {	

	var promise = new Promise(function(resolve, reject) {

		fs.readFile(file, options, function(err, data) {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});

	});

	return promise;
};

fsp.writeFile = function(file, data, options) {

	var promise = new Promise(function(resolve, reject) {

		fs.writeFile(file, data, options, function(err) {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});

	});

	return promise;
};


module.exports = fsp;
