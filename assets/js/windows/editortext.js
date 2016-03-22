(function() {

	/**
	 * Editor Text Window Class
	 */
	function CEWindowEditorText(path) {
		this.file = new CEFile(path);
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
		
		var openfiles = CEApp.config.get('editor.openfiles', []);
		if (openfiles.indexOf(path) == -1) {
			openfiles.push(path);
			CEApp.config.set('editor.openfiles', openfiles);
		}

		return this.instances[path];
	};

	CEWindowEditorText.prototype.init = function() {
		CEWindow.prototype.init.apply(this, []);

		this.element.addClass('ce-editor-window');

		this.body.html('<textarea class="ce-editor" spellcheck="false"></textarea>');
		this.editor = this.body.find('textarea');
		this.status = $('<div />').addClass('ce-editor-status');

		this.body.append(this.status);

		CEApp.currentEditor = this;

		this.editor.on('keyup', this.onKeyup.bind(this));
		this.editor.on('click', this.updateStatus.bind(this));

		this.bindTab();

		this.open();

		CEWindowEditorText.current = this;
	};


	CEWindowEditorText.prototype.bindTab = function() {

		var win = this;

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
		this.file.open().then(function(data) {
			this.editor.val(data);
		}.bind(this));
	};

	CEWindowEditorText.prototype.onClick = function() {
		CEWindowEditorText.current = this;
		CEWindow.prototype.onClick.apply(this, arguments);
	};

	CEWindowEditorText.prototype.updateStatus = function() {
		var pos = this.editor.prop('selectionStart');

		var before = this.editor.val().substr(0, pos);
		var row = before.split("\n").length;
		var col = before.length - before.lastIndexOf("\n");

		this.status.text(/*"raw: " + pos + " | " + */ "row: " + row + " | col: " + col);
	};

	CEWindowEditorText.current = null;

	CEWindowEditorText.prototype.onKeyup = function(e) {

		this.updateStatus();


		if (this.dirty) {
			return;
		}

		var val = this.editor.val();

		if (val != this.file.content) {
			this.dirty = true;
			this.setTitle(this.file.path + " *");
		}
	};

	CEWindowEditorText.prototype.save = function() {

		this.file.setContent(this.editor.val());

		this.file.save().then(function() {
			this.dirty = false;
			this.setTitle(this.file.path);
		}.bind(this));
	};

	CEWindowEditorText.prototype.close = function(e) {
		CEWindow.prototype.close.apply(this, [e]);
		delete CEWindowEditorText.instances[this.path];

		var openfiles = CEApp.config.get('editor.openfiles', []);
		openfiles.splice(openfiles.indexOf(this.path), 1);
		CEApp.config.set('editor.openfiles', openfiles);
	};

	CEWindowEditorText.prototype.display = function() {

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

	CEWindowEditorText.saveCurrent = function() {

		var current = CEWindow.getActiveWindow();

		if (current instanceof CEWindowEditorText) {
			current.save();
		}
	};

	//Events
	CEApp.on('key.ctrl-s', CEWindowEditorText.saveCurrent);


	window.CEWindowEditorText = CEWindowEditorText;

}());