(function() {

	/**
	 * Window Class
	 */
	function CEWindow(title) {
		CEWidget.apply(this, []);
		this.setTitle(title);
		this.events = new events();
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
		this.element.css({left : 0, top : 0});

		this.titlebar = $('<div />').addClass('ce-window-title');
		this.titlebar.append('<div class="ce-window-title-text" />');

		this.body = $('<div />').addClass('ce-window-body');
		this.closeBtn = $('<div />').html('&times;').addClass('ce-window-close');

		this.element.append(this.titlebar);
		this.element.append(this.body);
		this.titlebar.append(this.closeBtn);

		this.element.draggable({ handle: this.titlebar });
		this.element.resizable();
		
		this.closeBtn.on('click', this.close.bind(this));

		this.element.on('mousedown', this.setActive.bind(this));
		this.setActive();
		CEWindow.pos.n++;

		CEWidget.prototype.init.apply(this, []);
	};

	CEWindow.pos = {
		z : 2,
		x : 400,
		y : 50,
		n : -1
	};

	CEWindow.activeWindow = null;

	CEWindow.prototype.setTitle = function(title) {
		this.titlebar.find('.ce-window-title-text').text(title);
	};

	CEWindow.prototype.close = function() {
		this.element.remove();
	};

	CEWindow.prototype.isActive = function() {
		return this.active;
	};

	/**
	 * Set current window as active
	 */
	CEWindow.prototype.setActive = function() {
	
		var current = CEWindow.activeWindow;

		if (this === current) {
			return;
		}

		if (current) {
			current.active = false;
			current.titlebar.removeClass('active');
		}

		CEWindow.activeWindow = this;
		this.active = true;

		this.element.css('z-index', CEWindow.pos.z++);

		this.titlebar.addClass('active');
	};

	window.CEWindow = CEWindow;

}());