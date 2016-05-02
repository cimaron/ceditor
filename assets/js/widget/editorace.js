(function() {

	/**
	 * ACE Editor Class
	 */
	function CEEditorAce(path) {
		CEEditor.apply(this, arguments);
	}

	//Inherit from Widget
	util.inherits(CEEditorAce, CEEditor);

	CEEditorAce.prototype.init = function() {
		CEEditor.prototype.init.apply(this, []);

        this.element.addClass('ce-editor-ace');

		this.editorEl = $('<div />');
		this.element.append(this.editorEl);

		var editor = ace.edit(this.editorEl[0]);
		editor.setTheme("ace/theme/dreamweaver");
		editor.getSession().setMode("ace/mode/" + this.config.mode);
		editor.setShowPrintMargin(false);

		this.editor = editor;

        this.editor.on('change', function(e) {

    		if (this.dirty) {
    			return;
    		}
    
    		var val = this.editor.getValue();
    
    		if (val != this.file.content) {
    			this.dirty = true;
    			this.updateTitle();
    		}
            
        }.bind(this));

		this.open();
	};
	
	/**
	 * Set window
	 * 
	 * @param   CEWindowEditor   win   The window
	 *
	 * @return  this
	 */
	CEEditorAce.prototype.setWindow = function(win) {

        CEEditor.prototype.setWindow.apply(this, [win]);

        this.window.on('resize', function(e, ui) {
            this.editor.resize(); 
        }.bind(this));

        return this;
	};

	CEEditorAce.prototype.open = function() {

		var promise = CEEditor.prototype.open.apply(this);
		
		promise.then(function(data) {
			this.editor.setValue(data, -1);
			
			this.editor.getSession().setUndoManager(new ace.UndoManager())

		}.bind(this));
	
		return promise;
	};

	CEEditorAce.prototype.save = function() {
		this.file.setContent(this.editor.getValue());
		CEEditor.prototype.save.apply(this, arguments);
	};

	CEEditorAce.prototype.redraw = function() {
	    this.editor.resize();
	    CEEditor.prototype.redraw.apply(this, arguments);
	};

	window.CEEditorAce = CEEditorAce;

}());
