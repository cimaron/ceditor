(function() {

	/**
	 * File Tree Class
	 */
	function CEFileTree() {
		this.cwd = CEApp.config.get("filetree.cwd", "/");

		CEWindow.apply(this, ["Files"]);
	}

	//Inherit from Widget
	util.inherits(CEFileTree, CEWindow);

	CEFileTree.prototype.init = function() {

		CEWindow.prototype.init.apply(this, []);

		$(window).on('keydown', function(e) {

			if (!this.active) {
				return;
			}

			var active, next;

			//up key
			if (e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 13) {
				active = this.body.find("a.selected").parent();
			}

			if (e.keyCode == 38) {
				next = active.prev("div");
			}

			if (e.keyCode == 40) {
				next = active.next("div");
			}

			if (e.keyCode == 13) {
				this.openSelected();
				return;
			}

			if (next.length > 0) {
				active.find("a").removeClass("selected");
				next.find("a").addClass("selected");
			}


		}.bind(this));

		this.refresh();
	};

	CEFileTree.prototype.refresh = function() {

		CEApp.ws.call('fs.lsStat', {path : this.cwd}).then(function(files) {

			files.sort(function(a, b) {
				if (a.is_dir && !b.is_dir) {
					return -1;
				}
				if (b.is_dir && !a.is_dir) {
					return 1;
				}
				return a < b ? 1 : -1;
			});

			var out = "";
			
			if (this.cwd != "/") {
				out += '<div><a href="#" class="ce-dir" data-path="..">..</a></div>';
			}

			for (var i = 0; i < files.length; i++) {
				file = files[i];

				if (file.is_dir) {
					out += '<div><a href="#" class="ce-dir" data-path="' + file.name + '">' + file.name + '</a></div>';
				} else {
					out += '<div><a href="#" class="ce-file" data-path="' + file.name + '">' + file.name + '</a></div>';
				}
			}

			this.body.html(out);
			this.body.find("a").on('dblclick', this.openSelected.bind(this));

			this.body.find("a").on('click', this.click.bind(this));

		}.bind(this));
	};

	CEFileTree.prototype.click = function(e) {
		var el = $(e.target);
		this.body.find("a").removeClass('selected');
		el.addClass('selected');
	};

	CEFileTree.prototype.openSelected = function() {
		var el = this.body.find("a.selected");
		var path = el.data('path');
		var cwd = this.cwd;

		if (path == '..') {
			cwd = cwd.split("/");
			cwd.pop();
			cwd = cwd.join("/");
		} else {
			cwd = cwd + (cwd != "/" ? "/" : "") + path;
		}

		CEApp.config.set("filetree.cwd", this.cwd);

		if (el.hasClass('ce-dir')) {
			this.cwd = cwd;
			this.refresh();
		} else if (el.hasClass('ce-file')) {
			this.open(cwd);
		}
		
	};

	CEFileTree.prototype.open = function(path) {
		var pos = CEWindow.pos;
		
		var win = CEWindowEditorText.getInstance(path);

		if (!win.element.parent().length) {
			CEApp.document.addChild(win);
			//Shift new window position by 40 up to 10 times
			win.element.css('left', pos.x + (pos.n % 10) * 40);
			win.element.css('top', pos.y + (pos.n % 10) * 40);
			win.element.width(800);
			win.element.height(600);
		}

		win.setActive();
	};

	window.CEFileTree = CEFileTree;

}());
