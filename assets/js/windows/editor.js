(function() {

	/**
	 * Editor Text Window Class
	 */
	function CEWindowEditor(path) {
		this.file = new CEFile(path);
		CEWindow.apply(this, [path]);
	}

	//Inherit from Widget
	util.inherits(CEWindowEditor, CEWindow);


	CEWindowEditor.instances = {};
	CEWindowEditor.filetypes = null;

	CEWindowEditor.getInstance = function(path) {

		if (this.instances[path]) {
			return this.instances[path];
		}

		if (this.filetypes === null) {
			this.filetypes = {};
			var filetypes = CEApp.config.get('document.filetypes');
			for (var i = 0; i < filetypes.length; i++) {
				var info = CEApp.config.get('document.filetypes.' + filetypes[i]);
				var exts = info.extensions.split(",");
				for (var j = 0; j < exts.length; j++) {
					this.filetypes[exts[j]] = info;
				}
			}
		}

		var ext = path.substr(path.lastIndexOf('.') + 1);
		if (this.filetypes[ext]) {
			var className = this.filetypes[ext]['class'];
		} else {
			var className = "CEWindowEditorText";
		}

		this.instances[path] = new window[className](path);
		
		var openfiles = CEApp.config.get('editor.openfiles', []);
		if (openfiles.indexOf(path) == -1) {
			openfiles.push(path);
			CEApp.config.set('editor.openfiles', openfiles);
		}

		return this.instances[path];
	};

	CEWindowEditor.prototype.init = function() {
		CEWindow.prototype.init.apply(this, []);

		this.element.addClass('ce-editor-window');

		CEApp.currentEditor = this;
		CEWindowEditor.current = this;
	};

	/**
	 * Open file
	 *
	 * @return  promise
	 */
	CEWindowEditor.prototype.open = function() {
		return this.file.open();
	};

	/**
	 * Save file
	 *
	 * @return  promise
	 */
	CEWindowEditor.prototype.save = function() {
		var save, then;

		save = this.file.save();

		then = save.then(function() {
			this.dirty = false;
			this.setTitle(this.file.path);
		}.bind(this));

		return then;
	};

	/**
	 * Close editor window
	 */
	CEWindowEditor.prototype.close = function(e) {

		CEWindow.prototype.close.apply(this, [e]);
		delete CEWindowEditor.instances[this.file.path];

		var openfiles = CEApp.config.get('editor.openfiles', []);
		openfiles.splice(openfiles.indexOf(this.path), 1);
		CEApp.config.set('editor.openfiles', openfiles);
	};

	CEWindowEditor.prototype.onClick = function() {
		CEWindowEditor.current = this;
		CEWindow.prototype.onClick.apply(this, arguments);
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

	CEWindowEditor.current = null;

	CEWindowEditor.saveCurrent = function() {

		var current = CEWindow.getActiveWindow();

		if (current instanceof CEWindowEditor) {
			current.save();
		}
	};

	//Events
	CEApp.on('key.ctrl-s', CEWindowEditor.saveCurrent);


	window.CEWindowEditor = CEWindowEditor;

}());