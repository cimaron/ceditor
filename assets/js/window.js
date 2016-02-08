(function() {

	/**
	 * Window Class
	 */
	function CEWindow(title) {
		CEWidget.apply(this, []);
		this.setTitle(title);
	}

	//Inherit from Widget
	util.inherits(CEWindow, CEWidget);

	/**
	 * Initialize widget
	 */	
	CEWindow.prototype.init = function() {
		
		if (!this.element || this.element.length == 0) {
			this.element = 	$('<div />');
		}

		this.element.addClass('ce-window');

		this.titlebar = $('<div />').addClass('ce-window-title');
		this.body = $('<div />').addClass('ce-window-body');

		this.element.append(this.titlebar);
		this.element.append(this.body);

		this.element.draggable({ handle: this.titlebar });
		this.element.resizable();
		this.element.on('click', this.onClick.bind(this));

		CEWidget.prototype.init.apply(this, []);
	};

	CEWindow.topZ = 2;

	CEWindow.prototype.setTitle = function(title) {
		this.titlebar.text(title);
	};

	CEWindow.prototype.onClick = function() {
		this.element.css('z-index', CEWindow.topZ);
		CEWindow.topZ++;
	};

	window.CEWindow = CEWindow;

}());