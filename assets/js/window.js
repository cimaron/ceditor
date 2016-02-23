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
		this.titlebar.append('<div class="ce-window-title-text" />');

		this.body = $('<div />').addClass('ce-window-body');
		this.closeBtn = $('<div />').html('&times;').addClass('ce-window-close');

		this.element.append(this.titlebar);
		this.element.append(this.body);
		this.titlebar.append(this.closeBtn);

		this.element.draggable({ handle: this.titlebar });
		this.element.resizable();
		
		this.element.on('mousedown', function() {
			this.element.css('z-index', CEWindow.topZ);
			CEWindow.topZ++;
		}.bind(this));

		this.element.css('z-index', CEWindow.topZ);
		CEWindow.topZ++;

		this.closeBtn.on('click', this.close.bind(this));

		CEWidget.prototype.init.apply(this, []);
	};

	CEWindow.topZ = 2;

	CEWindow.prototype.setTitle = function(title) {
		this.titlebar.find('.ce-window-title-text').text(title);
	};

	CEWindow.prototype.close = function() {
		this.element.remove();
	};

	window.CEWindow = CEWindow;

}());