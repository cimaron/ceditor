(function() {

	/**
	 * File Tree Class
	 */
	function CEEditorWindow(path) {
		this.path = path;
		CEWindow.apply(this, [path]);
	}

	//Inherit from Widget
	util.inherits(CEEditorWindow, CEWindow);



	CEEditorWindow.instances = {};

	CEEditorWindow.getInstance = function(path) {

		if (this.instances[path]) {
			return this.instances[path];
		}

		return new CEEditorWindow(path);
	};

	CEEditorWindow.prototype.init = function() {
		CEWindow.prototype.init.apply(this, []);

		this.body.html('<textarea class="ce-editor"></textarea>');
		this.editor = this.body.find('textarea');

		CEApp.currentEditor = this;

		this.editor.on('keyup', this.onKeyup.bind(this));

		this.bindTab();

		this.open();

		CEEditorWindow.current = this;
	};


	CEEditorWindow.prototype.bindTab = function() {

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
	
	CEEditorWindow.prototype.open = function() {

		CEApp.ws.call('fs.readFile', {path : this.path}).then(function(data) {
			this.editor.val(data);
			this.value = data;
		}.bind(this));

	};

	CEEditorWindow.prototype.onClick = function() {
		CEEditorWindow.current = this;
		CEWindow.prototype.onClick.apply(this, arguments);
	};

	CEEditorWindow.current = null;

	CEEditorWindow.prototype.onKeyup = function(e) {

		if (this.dirty) {
			return;
		}

		var val = this.editor.val();

		if (val != this.value) {
			this.dirty = true;
			this.setTitle(this.path + " *");
		}
	};

	CEEditorWindow.prototype.save = function() {

		var path = this.path;
		var data = this.editor.val();

		CEApp.ws.call('fs.writeFile', {
			path : path,
			data : data
		}).then(function() {
			this.dirty = false;
			this.setTitle(this.path);
			this.value = this.editor.val();
		}.bind(this));
	};

	CEEditorWindow.saveCurrent = function() {
		var current = CEEditorWindow.current;
		if (current) {
			current.save();
		}
	};

	window.CEEditorWindow = CEEditorWindow;

}());

