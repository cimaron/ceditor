(function() {

	/**
	 * Editor Text Window Class
	 */
	function CEWindowEditor(path, config) {
		this.config = config || {};
		CEWindow.apply(this, [path]);
	}

	//Inherit from Widget
	util.inherits(CEWindowEditor, CEWindow);

	CEWindowEditor.prototype.init = function() {
		CEWindow.prototype.init.apply(this, []);
		this.element.addClass('ce-editor-window');
	};

    /**
     * Set editor for the window
     * 
     * @param   CEEditor   editor   The editor object
     * 
     * @return  this
     */
    CEWindowEditor.prototype.setEditor = function(editor) {

        this.editor = editor;
        this.body.append(editor.element);
        editor.window = this;

        this.titlebar.attr('title', this.editor.file.getPath());

        return this;
    };

	/**
	 * Close editor window
	 */
	CEWindowEditor.prototype.close = function(e) {
		CEWindow.prototype.close.apply(this, [e]);
	    this.editor.close();
	};

	/**
	 * Set current window as active
	 */
	CEWindowEditor.prototype.setActive = function(force) {
	    CEWindow.prototype.setActive.apply(this, [force]);
		CEEditor.current = this.editor;
	};

	CEWindowEditor.prototype.display = function() {

		var pos = CEWindow.pos, element = this.element;

		if (!element.parent().length) {
			CEApp.document.addChild(this);
			//Shift new window position by 40 up to 10 times
			element.css('left', pos.x + (pos.n % 10) * 40);
			element.css('top', pos.y + (pos.n % 10) * 40);
			element.width(1000);
			element.height(700);
		}

		this.setActive();
	};

    CEWindowEditor.prototype.redraw = function() {
        this.updateTitle();
        CEWindow.prototype.redraw.apply(this, arguments);
    };

	window.CEWindowEditor = CEWindowEditor;

}());

