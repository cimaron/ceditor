(function() {

	/**
	 * Widget Class
	 */
	function CEWidget(element) {
		
		//defaults
		this.children = [];
		this.parent = null;

		this.element = $(element);

		this.init();
	}

	util.inherits(CEWidget, events);

	/**
	 * Initialize widget
	 */
	CEWidget.prototype.init = function() {
		this.element.addClass('ce-widget');
	};
	
	/**
	 * Render this widget and all children
	 */
	CEWidget.prototype.render = function() {
		var i;
		
		for (i = 0; i < this.children.length; i++) {
			this.children[i].render();	
		}
	};

	/**
	 * Add child
	 *
	 * @param   Widget   child   The child
	 *
	 * @return  Widget  this
	 */
	CEWidget.prototype.addChild = function(child) {

		this.children.push(child);
		
		child.setParent(this);

		return this;
	};

	/**
	 * Set parent
	 *
	 * @param   Widget   parent   The parent
	 *
	 * @return  Widget  this
	 */
	CEWidget.prototype.setParent = function(parent) {

		this.parent = parent;
		
		this.parent.element.append(this.element);

		return this;
	};

	window.CEWidget = CEWidget;

}());
