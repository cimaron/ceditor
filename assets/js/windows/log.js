(function() {

	/**
	 * Log Window Class
	 */
	function CEWindowLog() {
		CEWindow.apply(this, ["Log"]);
	}

	//Inherit from Widget
	util.inherits(CEWindowLog, CEWindow);

	CEWindowLog.prototype.init = function() {
		CEWindow.prototype.init.apply(this, []);
		this.element.addClass('ce-window-log');
	};

	CEWindowLog.prototype.log = function() {
		var line;	
	
		for (var i = 0; i < arguments.length; i++) {

			line = $('<div />').addClass('ce-log-line');
			line.html('<div class="ce-timestamp">' + this.getTimeStamp() + '</div><div class="ce-log-text">' + arguments[i] + '</div>');
			this.body.append(line);
		}
	};

	CEWindowLog.prototype.getTimeStamp = function() {
       var now = new Date();
       return (now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + (now.getDate()) + " " + now.getHours() + ':'
                     + ((now.getMinutes() < 10) ? ("0" + now.getMinutes()) : (now.getMinutes())) + ':' + ((now.getSeconds() < 10) ? ("0" + now
                     .getSeconds()) : (now.getSeconds())));
	}

	window.CEWindowLog = CEWindowLog;

}());