(function() {

	/**
	 * Document Class
	 */
	function CEDocument(element) {
		CEWidget.apply(this, [element]);
	}

	//Inherit from Widget
	util.inherits(Document, CEWidget);

	/**
	 * Initialize widget
	 */	
	CEDocument.prototype.init = function() {
		$(this.element).addClass('ce-document');
		CEWidget.prototype.init.apply(this, []);
	}

	window.CEDocument = CEDocument;

}());

