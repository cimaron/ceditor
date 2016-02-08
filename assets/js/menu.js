(function() {

	/**
	 * Menu Class
	 */
	function CEMenu(element) {
		CEWidget.apply(this, [element]);
	}

	//Inherit from Widget
	util.inherits(CEMenu, CEWidget);

	/**
	 * Initialize widget
	 */	
	CEMenu.prototype.init = function() {
		
		if (!this.element || this.element.length == 0) {
			this.element = 	$('<ul />');
		}

		$(this.element).addClass('ce-menu');
		CEWidget.prototype.init.apply(this, []);
	};

	window.CEMenu = CEMenu;

}());

