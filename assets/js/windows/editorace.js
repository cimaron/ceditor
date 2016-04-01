(function() {

	/**
	 * ACE Editor Window Class
	 */
	function CEWindowEditorAce(path) {		
		CEWindowEditor.apply(this, [path]);
	}

	//Inherit from Widget
	util.inherits(CEWindowEditorAce, CEWindowEditor);

	CEWindowEditorAce.prototype.init = function() {
		CEWindowEditor.prototype.init.apply(this, []);

		this.editorEl = $('<div />');
		this.body.append(this.editorEl);

		var editor = ace.edit(this.editorEl[0]);
		editor.setTheme("ace/theme/dreamweaver");
		editor.getSession().setMode("ace/mode/javascript");
		editor.setShowPrintMargin(false);

		this.editor = editor;

		this.open();
	};

	CEWindowEditorAce.prototype.open = function() {

		var promise = CEWindowEditor.prototype.open.apply(this);
		
		promise.then(function(data) {
			this.editor.setValue(data, -1);
		}.bind(this));
	
		return promise;
	};

	CEWindowEditorAce.prototype.save = function() {
		this.file.setContent(this.editor.getValue());
		CEWindowEditor.prototype.save.apply(this, arguments);
	};

	window.CEWindowEditorAce = CEWindowEditorAce;

}());