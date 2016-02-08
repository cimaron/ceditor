(function() {

	/**
	 * Document Class
	 */
	function CEDocument(element) {
		CEWidget.apply(this, [element]);

		this.menu = null;
	}

	//Inherit from Widget
	util.inherits(CEDocument, CEWidget);

	/**
	 * Initialize widget
	 */	
	CEDocument.prototype.init = function() {
		$(this.element).addClass('ce-document');
		CEWidget.prototype.init.apply(this, []);
	};

	/**
	 * Set menu
	 *
	 * @param   CEApplicationMenu   menu   The menu
	 *
	 * @return  Widget   this
	 */
	CEDocument.prototype.setMenu = function(menu) {
		
		this.menu = menu;
		menu.setParent(this);

		this.element.append(menu.element);

		return this;
	};

	window.CEDocument = CEDocument;

}());

