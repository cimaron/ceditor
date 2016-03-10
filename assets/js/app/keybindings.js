(function() {

	function CEAppKeyBindings() {
		$(window).on('keydown', this.onKeyDown.bind(this));
	}

	CEAppKeyBindings.prototype.onKeyDown = function(e) {
	
		if (e.ctrlKey || e.metaKey) {
			this.onCtrlKey(e, String.fromCharCode(e.which).toLowerCase());
		}
	};

	CEAppKeyBindings.prototype.onCtrlKey = function(e, ch) {

		switch (ch) {

			case 's':
				CEApp.trigger('key.ctrl-s', e);
				e.preventDefault();
				break;
					
			case 'f':
				e.preventDefault();
				console.log('ctrl-f');
				break;

			case 'g':
				e.preventDefault();
				console.log('ctrl-g');
				break;
		}
	};

	window.CEAppKeyBindings = CEAppKeyBindings;

}());