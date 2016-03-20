(function() {

	/**
	 * Config Window Class
	 */
	function CEWindowConfig() {
		CEWindow.apply(this, ["Config"]);
	}

	//Inherit from Widget
	util.inherits(CEWindowConfig, CEWindow);

	CEWindowConfig.prototype.init = function() {
		CEWindow.prototype.init.apply(this, []);

		this.element.addClass('ce-config');

		this.table = $('<table />');
		this.body.append(this.table);

		var data = CEApp.config.getAll();

		var keys = Object.keys(data);
		keys.sort();

		for (var i = 0; i < keys.length; i++) {
			this.addRow(keys[i], data[keys[i]]);
		}

		this.addRow();

	};

	CEWindowConfig.prototype.addRow = function(name, data) {
		var row, label, isString, input, btn, val;

		isString = typeof data == "string";

		row = $('<tr />');

		if (name) {
			label = $('<label />').text(name);
		} else {
			label = $('<input type="text" />');
		}

		input = $('<input type="text" />');

		if (name) {

			input.on('change', function(e) {
				var el = $(e.target);

				try {
					val = JSON.parse(el.val());
				} catch (e) {
					val = el.val();
				}

				CEApp.config.set(name, val);
				CEApp.log("Saved config " + name);
			}.bind(this));

			input.val(isString ? data : JSON.stringify(data));
		} else {
			input.attr('disabled', 'disabled');
		}

		if (name) {
			btn = $('<button />').html("&times;");
			btn.on('click', function(e) {
				CEApp.config.remove(name);
				CEApp.log("Removed config " + name);
				row.remove();
			});
		} else {

			btn = $('<button />').html("+");
			btn.on('click', function(e) {
				this.addRow(label.val(), "");
				label.val("");
				this.table.append(row);
			}.bind(this));

		}

		row
			.append($('<td />').append(label))
			.append($('<td />').append(input))
			.append($('<td />').append(btn))
			;

		this.table.append(row);
	};

	window.CEWindowConfig = CEWindowConfig;
}());