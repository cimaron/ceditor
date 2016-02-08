(function() {

	function CEConfig() {
		this.data = {};
		this.load();
	}

	/**
	 * Load data
	 */
	CEConfig.prototype.load = function() {
		var raw = localStorage.getItem('config');
		try {
			this.data = JSON.parse(raw || "{}");
		} catch (e) {
			this.data = {};
		}
	};

	/**
	 * Set variable
	 */
	CEConfig.prototype.save = function() {
		localStorage.setItem('config', JSON.stringify(this.data));
	};

	/**
	 * Set variable
	 */
	CEConfig.prototype.set = function(name, value) {
		this.data[name] = value;
		this.save();
	};

	/**
	 * Get variable
	 */
	CEConfig.prototype.get = function(name, def) {
		return this.data[name] || def;
	};	

	window.CEConfig = CEConfig;

}(jQuery));