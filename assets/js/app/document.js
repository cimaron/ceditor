(function() {

	/**
	 * Document Class
	 */
	function CEDocument() {
		CEWidget.apply(this, []);

		this.menu = null;
	}

	//Inherit from Widget
	util.inherits(CEDocument, CEWidget);

	/**
	 * Initialize widget
	 */	
	CEDocument.prototype.init = function() {
		
		this.element = $('<div />').addClass('ce-document');
		$('body').append(this.element);
		
		var bgImage = CEApp.config.get('desktop.backgroundImage');

		if (bgImage) {
			this.element.css('background-image', "url(" + bgImage + ")");
		}

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
