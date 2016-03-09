(function() {

	/**
	 * Editor Text Window Class
	 */
	function CEWindowEditorText(path) {
		this.path = path;
		CEWindow.apply(this, [path]);
	}

	//Inherit from Widget
	util.inherits(CEWindowEditorText, CEWindow);


	CEWindowEditorText.instances = {};

	CEWindowEditorText.getInstance = function(path) {

		if (this.instances[path]) {
			return this.instances[path];
		}

		this.instances[path] = new CEWindowEditorText(path);
		
		return this.instances[path];
	};

	CEWindowEditorText.prototype.init = function() {
		CEWindow.prototype.init.apply(this, []);

		this.body.html('<textarea class="ce-editor"></textarea>');
		this.editor = this.body.find('textarea');

		CEApp.currentEditor = this;

		this.editor.on('keyup', this.onKeyup.bind(this));

		this.bindTab();

		this.open();

		CEWindowEditorText.current = this;
	};


	CEWindowEditorText.prototype.bindTab = function() {

		this.editor.on('keydown', function(e) {

			if (e.keyCode === 9) { // tab was pressed
				// get caret position/selection
				var start = this.selectionStart;
				var end = this.selectionEnd;

				var value = this.value;

				// set textarea value to: text before caret + tab + text after caret
				this.value = value.substring(0, start)
					+ "\t"
					+ value.substring(end);

				// put caret at right position again (add one for the tab)
				this.selectionStart = this.selectionEnd = start + 1;

				// prevent the focus lose
				e.preventDefault();
			}

		});

	};
	
	CEWindowEditorText.prototype.open = function() {
		CEApp.log("Opening " + this.path.split("/").slice(-1));
		CEApp.ws.call('fs.readFile', {path : this.path}).then(function(data) {
			this.editor.val(data);
			this.value = data;
			CEApp.log("Loaded " + this.path.split("/").slice(-1));
		}.bind(this));

	};

	CEWindowEditorText.prototype.onClick = function() {
		CEWindowEditorText.current = this;
		CEWindow.prototype.onClick.apply(this, arguments);
	};

	CEWindowEditorText.current = null;

	CEWindowEditorText.prototype.onKeyup = function(e) {

		if (this.dirty) {
			return;
		}

		var val = this.editor.val();

		if (val != this.value) {
			this.dirty = true;
			this.setTitle(this.path + " *");
		}
	};

	CEWindowEditorText.prototype.save = function() {

		var path = this.path;
		var data = this.editor.val();
		CEApp.log("Saving " + this.path.split('/').slice(-1));

		CEApp.ws.call('fs.writeFile', {
			path : path,
			data : data
		}).then(function() {
			this.dirty = false;
			this.setTitle(this.path);
			this.value = this.editor.val();
			CEApp.log("Saved " + this.path.split('/').slice(-1));
		}.bind(this));
	};

	CEWindowEditorText.prototype.onClose = function(e) {
		CEWindow.prototype.onClose.apply(this, [e]);
		delete CEWindowEditorText.instances[this.path];
	};

	CEWindowEditorText.saveCurrent = function() {
		var current = CEWindowEditorText.current;
		if (current) {
			current.save();
		}
	};

	window.CEWindowEditorText = CEWindowEditorText;

}());