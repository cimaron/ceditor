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
	 * Remove variable
	 */
	CEConfig.prototype.remove = function(name, value) {
		delete this.data[name];
		this.save();
	};

	/**
	 * Get variable
	 */
	CEConfig.prototype.get = function(name, def) {
		return this.data[name] || def;
	};	

	/**
	 * Get all data
	 */
	CEConfig.prototype.getData = function() {
		return this.data;
	};	

	/**
	 * Set all data
	 *
	 * @param   object   data
	 */
	CEConfig.prototype.setData = function(data) {
		this.data = data;
		this.save();
	};

	window.CEConfig = CEConfig;

}(jQuery));