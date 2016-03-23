(function() {

	/**
	 * Editor Text Window Class
	 */
	function CEWindowEditorText(path) {		
		CEWindowEditor.apply(this, [path]);
	}

	//Inherit from Widget
	util.inherits(CEWindowEditorText, CEWindowEditor);

//Continue removing CEEditor class stuff from CEEditorText

	CEWindowEditorText.prototype.init = function() {
		CEWindowEditor.prototype.init.apply(this, []);

		this.body.html('<textarea class="ce-editor" spellcheck="false"></textarea>');
		this.editor = this.body.find('textarea');
		this.status = $('<div />').addClass('ce-editor-status');
		this.statusPos = $('<span />').addClass('ce-editor-status-pos');

		//Set up search
		this.searchBox = $('<div />').addClass('ce-editor-searchbox');
		this.searchInput = $('<input />').attr('type', 'text').addClass('ce-editor-search');
		this.searchPrev = $('<button />').text("Prev");
		this.searchNext = $('<button />').text("Next");

		this.searchBox
			.append(this.searchInput)
			.append(this.searchPrev)
			.append(this.searchNext)
			;

		this.body.append(this.status);
		this.status.append(this.statusPos);
		this.status.append(this.searchBox);

		this.editor.on('keyup', this.onKeyup.bind(this));
		this.editor.on('click', this.updateStatus.bind(this));

		this.searchInput.on('keyup', this.search.bind(this));

		this.bindTab();
		this.open();
	};


	CEWindowEditorText.prototype.bindTab = function() {

		var win = this;

		this.editor.on('keydown', function(e) {

			if (e.keyCode != 9) {
				return;
			}

			// prevent the focus lose
			e.preventDefault();

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

		});

		this.editor.on('keypress', function(e) {

			if (e.keyCode != 9) {
				return;
			}

			// prevent the focus lose
			e.preventDefault();

			//indent instead
			if (start != end) {
				win.indent();
			}		

			// put caret at right position again (add one for the tab)
			//this.selectionStart = this.selectionEnd = start + 1;
		});

	};
	
	CEWindowEditorText.prototype.indent = function() {
		var start = this.editor[0].selectionStart;
		var end = this.editor[0].selectionEnd;
		
		var text = this.editor.val();
		var begin = text.substr(0, start).lastIndexOf("\n");

		text = text.substr(0, begin) + text.substr(begin, end).replace("\n", "\n\t") + text.substr(end);
		this.editor.val(text);

		CEApp.log('indent', start, end, begin);

	};

	CEWindowEditorText.prototype.open = function() {

		var promise = CEWindowEditor.prototype.open.apply(this);
		
		promise.then(function(data) {
			this.editor.val(data);
		}.bind(this));
	
		return promise;
	};

	CEWindowEditorText.prototype.onClick = function() {
		CEWindowEditorText.current = this;
		CEWindow.prototype.onClick.apply(this, arguments);
	};

	CEWindowEditorText.prototype.updateStatus = function() {
		var pos = this.editor.prop('selectionStart');
		this.lastPos = pos;

		var before = this.editor.val().substr(0, pos);
		var row = before.split("\n").length;
		var col = before.length - before.lastIndexOf("\n");

		this.statusPos.text(/*"raw: " + pos + " | " + */ "row: " + row + " | col: " + col);
	};

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
		CEWindowEditor.prototype.save.apply(this, arguments);
	};

	CEWindowEditorText.prototype.search = function(e) {

		if (e.which != 13) {
			return;
		}

		var start = this.selectionStart;
		var val = this.searchInput.val();
		var text = this.editor.val();

		var pos = text.indexOf(val, start);
		if (pos == start) {
			start++;
			var pos = text.indexOf(val, start);
		}
		if (pos == -1) {
			start = 0;
			var pos = text.indexOf(val, start);
		}

		if (pos == -1) {
			CEApp.log("Not found");
		} else {
			this.editor.focus();
			this.editor[0].setSelectionRange(pos, pos + val.length);
			this.updateStatus();
			//this.editor.scrollTop(18 * 
		}

		CEApp.log(pos);
	};

	window.CEWindowEditorText = CEWindowEditorText;

}());