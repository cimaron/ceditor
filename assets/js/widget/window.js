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
		
		this.element = 	$('<div />')
		    .addClass('ce-window')
		    ;

		//this.element.css({left : 0, top : 0});

		this.titlebar = $('<div />').addClass('ce-window-title');
		this.titlebar.append('<div class="ce-window-title-text" />');

		this.body = $('<div />').addClass('ce-window-body');
		this.closeBtn = $('<div />').html('&times;').addClass('ce-window-close');

		this.element.append(this.titlebar);
		this.element.append(this.body);
		this.element.data('window', this);
		this.titlebar.append(this.closeBtn);

		this.element.draggable({
			handle: this.titlebar,
			start : function(e, ui) {
				if (this.pinned) {
					this.unpin();
				}
			}.bind(this)
		});
		
		this.element.resizable({
		    stop: function(e, ui) {
		        this.emit('resize', e, ui);
		    }.bind(this)
		});
		
		this.closeBtn.on('click', this.close.bind(this));

		this.element.on('mousedown', this.setActive.bind(this));

		CEWindow.pos.order.unshift(this);
		this.setActive(true);
		CEWindow.pos.n++;

		CEWidget.prototype.init.apply(this, []);
	};

	CEWindow.pos = {
		z : 2,
		x : 400,
		y : 50,
		n : -1,
		order : []
	};

	CEWindow.getActiveWindow = function() {
		var order = this.pos.order;

		if (order.length == 0) {
			return null;
		}

		return order[order.length - 1];
	};

	CEWindow.prototype.setTitle = function(title) {
		this.titlebar.find('.ce-window-title-text').text(title);
	};

	CEWindow.prototype.close = function() {
		var order = CEWindow.pos.order,
		    current = CEWindow.getActiveWindow()
			;

		order.splice(order.indexOf(this), 1);

		this.element.remove();
		if (current) {
			current.setActive(true);
		}
	};

	CEWindow.prototype.isActive = function() {
		return this.active;
	};

	/**
	 * Set current window as active
	 */
	CEWindow.prototype.setActive = function(force) {
	
		var current = CEWindow.getActiveWindow();

		if (this === current && !force) {
			return;
		}

		if (current) {
			current.active = false;
			current.element.removeClass('active');
		}

		//Move element
		var order = CEWindow.pos.order;
		order.splice(order.indexOf(this), 1);
		order.push(this);

		this.active = true;
		this.element.css('z-index', CEWindow.pos.z++);
		this.element.addClass('active');
	};

	/**
	 * Show window
	 */
	CEWindow.prototype.show = function() {
		this.element.show();
	};

	/**
	 * Hide window
	 */
	CEWindow.prototype.hide = function() {
		this.element.hide();
	};

	/**
	 * Toggle window
	 */
	CEWindow.prototype.toggle = function() {
		this.element.toggle();
	};

	CEWindow.prototype.pin = function(parent_el) {
		this.pinned = true;
		this.element.draggable('option', 'distance', 20);
		parent_el.append(this.element);
	};

	CEWindow.prototype.unpin = function() {
		this.pinned = false;
		this.element.draggable('option', 'distance', 1);
		CEApp.document.element.append(this.element);
	};

	window.CEWindow = CEWindow;

}());