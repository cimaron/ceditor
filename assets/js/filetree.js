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
			this.body.find("a").on('dblclick', this.dblclick.bind(this));

			this.body.find("a").on('click', this.click.bind(this));

		}.bind(this));
	};

	CEFileTree.prototype.click = function(e) {
		var el = $(e.target);
		this.body.find("a").removeClass('selected');
		el.addClass('selected');
	};

	CEFileTree.prototype.dblclick = function(e) {

		var el = $(e.target);
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
		
		var win = CEEditorWindow.getInstance(path);
		CEApp.document.addChild(win);
		win.element.css('left', 500);
		win.element.css('top', 100);
		win.element.width(800);
		win.element.height(600);

	};

	window.CEFileTree = CEFileTree;

}());