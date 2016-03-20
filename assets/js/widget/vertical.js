(function() {

	/**
	 * Document Class
	 */
	function CEWidgetVertical() {
		CEWidget.apply(this, []);
		this.windows = [];
	}

	//Inherit from Widget
	util.inherits(CEWidgetVertical, CEWidget);

	/**
	 * Initialize widget
	 */	
	CEWidgetVertical.prototype.init = function() {
		CEWidget.prototype.init.apply(this, []);

		this.element = $('<div />').addClass('ce-vertical');
	};

	CEWidgetVertical.prototype.attach = function(win) {
		win.pin(this.element);
		this.windows.push(win);
	};

	CEWidgetVertical.prototype.hoverIn = function(show) {
		this.hovering = true;
		this.element.addClass('ce-snap-snapping');
	};

	CEWidgetVertical.prototype.hoverOut = function() {
		this.hovering = false;
		this.element.removeClass('ce-snap-snapping');
	};

	window.CEWidgetVertical = CEWidgetVertical;

}());