(function() {

	/**
	 * Menu Item Class
	 */
	function CEMenuItem(name, options) {
		this.name = name;
		this.menu = null;
		this.selected = false;

		this.options = options || {};

		CEWidget.apply(this, []);
	}

	//Inherit from Widget
	util.inherits(CEMenuItem, CEWidget);

	/**
	 * Initialize widget
	 */	
	CEMenuItem.prototype.init = function() {
		CEWidget.prototype.init.apply(this, []);

		this.element = 	$('<li />')
			.text(this.name)
			.addClass('ce-menu-item')
			;

		this.element.on('click', function() {

			if (this.options.select) {
				if (this.selected) {
					this.deselect();
				} else {
					this.select();
				}
			};

			this.emit('click');

		}.bind(this));
	};

	CEMenuItem.prototype.addMenu = function(menu) {
		this.menu = menu;
		this.element.append(menu.element);

		this.element.on('click', function() {
			menu.element.toggle();
		});
	};

	/**
	 * Select item
	 */
	CEMenuItem.prototype.select = function() {
		if (!this.selected) {
			this.toggle();
			this.emit('select');
		}
	};

	/**
	 * Deselect item
	 */
	CEMenuItem.prototype.deselect = function() {
		if (this.selected) {
			this.toggle();
			this.emit('deselect');
		}
	};

	/**
	 * Toggle item
	 */
	CEMenuItem.prototype.toggle = function() {
		this.selected = !this.selected;
		this.element.toggleClass('selected');
		this.emit('toggle');
	};

	window.CEMenuItem = CEMenuItem;

}());