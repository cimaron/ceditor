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

	CEMenu.prototype.addMenu = function(name) {
		
		var item = this.addItem(name);
		var menu = new CEMenu();

		item.data('menu', menu);
		item.append(menu.element);

		return menu;
	};

	CEMenu.prototype.addItem = function(name) {
		var item = $('<li />').text(name);

		item.on('click', function() {
			if (item.data('menu')) {
				item.data('menu').element.toggle();
			}
		});

		this.items.push(item);
		this.element.append(item);
		return item;
	};

	window.CEMenu = CEMenu;

}());
