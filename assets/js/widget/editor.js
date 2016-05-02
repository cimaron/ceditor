
(function() {

	/**
	 * Editor Class
	 */
	function CEEditor(path, config) {
	
		this.file = new CEFile(path);
		this.config = config || {};
		this.window = null;

		CEWidget.apply(this);
	}

	//Inherit from Widget
	util.inherits(CEEditor, CEWidget);


	CEEditor.instances = {};
	CEEditor.filetypes = null;
	CEEditor.current = null;

    /**
     * Get an editor instance
     */
	CEEditor.getInstance = function(path) {

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
		var filetype, type;
		
		if (!this.filetypes[ext]) {
		    ext = "txt";
		}

        filetype = this.filetypes[ext];
        type = "CEEditor" + filetype['class'];

        var editor = new window[type](path, filetype);
        var win = new CEWindowEditor(path);
        editor.setWindow(win);
        win.setEditor(editor);

		this.instances[path] = win;

		var openfiles = CEApp.config.get('editor.openfiles', []);
		if (openfiles.indexOf(path) == -1) {
			openfiles.push(path);
			CEApp.config.set('editor.openfiles', openfiles);
		}

		return this.instances[path];
	};

	CEEditor.saveCurrent = function() {
        if (CEEditor.current) {
            CEEditor.current.save();
        }
	};

	CEEditor.prototype.init = function() {
		CEWidget.prototype.init.apply(this, []);
		
		this.element = $('<div />')
		    .addClass('ce-editor')
		    ;

		CEEditor.current = this;
	};

	/**
	 * Open file
	 *
	 * @return  promise
	 */
	CEEditor.prototype.open = function() {
		return this.file.open();
	};

    /**
     * Set the window object for this editor
     * 
     * @param   CEWindowEditor   window   The window
     * 
     * @return  this
     */
    CEEditor.prototype.setWindow = function(win) {
        this.window = win;
        return this;
    };

	/**
	 * Save file
	 *
	 * @return  promise
	 */
	CEEditor.prototype.save = function() {
		var save, then;

		save = this.file.save();

		then = save.then(function() {
			this.dirty = false;
			this.updateTitle();
		}.bind(this));
		
		this.emit('save', [this]);

		return then;
	};

    /**
     * Update the windows title
     * 
     * @return  this
     */
    CEEditor.prototype.updateTitle = function() {
        var suffix, title

        suffix = this.dirty ? " *" : "";
        title = this.tab ? this.file.getFilename() : this.file.getPath();

        this.window.setTitle(title + suffix);
        
        return this;
    };

	/**
	 * Close editor
	 */
	CEEditor.prototype.close = function(e) {

		delete CEEditor.instances[this.file.path];

		var openfiles = CEApp.config.get('editor.openfiles', []);
		openfiles.splice(openfiles.indexOf(this.path), 1);
		CEApp.config.set('editor.openfiles', openfiles);
		
		this.emit('close', [this]);
	};

	//Events
	CEApp.on('key.ctrl-s', CEEditor.saveCurrent);


	window.CEEditor = CEEditor;

}());

