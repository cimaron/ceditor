(function() {

	/**
	 * Menu Class
	 */
	function CEMenu() {
		CEWidget.apply(this, []);
		this.items = [];
	}

	//Inherit from Widget
	util.inherits(CEMenu, CEWidget);

	/**
	 * Initialize widget
	 */	
	CEMenu.prototype.init = function() {
		CEWidget.prototype.init.apply(this, []);

		this.element = 	$('<ul />');
		this.element.addClass('ce-menu');
	};

	CEMenu.prototype.addMenu = function(name, options) {
		
		var item = this.addItem(name, options);
		var menu = new CEMenu();

		item.addMenu(menu);

		return menu;
	};

	CEMenu.prototype.addItem = function(name, options) {

		var item = new CEMenuItem(name, options);

		this.items.push(item);
		this.element.append(item.element);

		return item;
	};

	window.CEMenu = CEMenu;

}());