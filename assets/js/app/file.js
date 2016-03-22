(function() {

	/**
	 * File Class
	 */
	function CEFile(path) {
		this.path = path;
		this.content = null;
		this.mime = null;
	}

	CEFile.prototype.setPath = function(path) {
		this.path = path;
		return this;
	};

	CEFile.prototype.setContent = function(content) {
		this.content = content;
		return this;
	};

	CEFile.prototype.setMime = function(mime) {
		this.mime = mime;
		return this;
	};

	CEFile.prototype.open = function() {

		CEApp.log("Opening " + this.path.split("/").slice(-1));

		var promise = CEApp.ws.call('fs.readFile', {path : this.path}).then(function(data) {			
			this.content = data;
			CEApp.log("Loaded " + this.path.split("/").slice(-1));
			return data;
		}.bind(this));

		return promise;
	};

	CEFile.prototype.save = function() {

		var path = this.path;
		var data = this.content;
		CEApp.log("Saving " + this.path.split('/').slice(-1));

		var promise = CEApp.ws.call('fs.writeFile', {
			path : path,
			data : data
		}).then(function() {
			CEApp.log("Saved " + this.path.split('/').slice(-1));
		}.bind(this));

		return promise;
	};

	window.CEFile = CEFile;

}());

