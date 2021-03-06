(function() {

	/**
	 * Files Class
	 */
	function CEWindowFiles() {
		this.cwd = CEApp.config.get("filetree.cwd", "/");

		CEWindow.apply(this, ["Files"]);
	}

	//Inherit from Widget
	util.inherits(CEWindowFiles, CEWindow);

	CEWindowFiles.prototype.init = function() {

		CEWindow.prototype.init.apply(this, []);

		$(window).on('keydown', function(e) {

			if (CEWindow.getActiveWindow() != this) {
				return;
			}

			var active, next;

			//up key
			if (e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 13) {
				active = this.body.find("a.selected").parent();
			}

			if (e.keyCode == 38) {
			    if (active.length) {
                    next = active.prev("div");
			    } else {
	                next = this.body.children().last();
			    }
			}

			if (e.keyCode == 40) {
			    if (active.length) {
    				next = active.next("div");
			    } else {
	                next = this.body.children().first();
			    }
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

        this.body.on('click', this.click.bind(this));

		this.refresh();
	};

	CEWindowFiles.prototype.refresh = function() {

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
			
			if (this.cwd != CEApp.sites.getCurrent().path) {
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

	CEWindowFiles.prototype.click = function(e) {
		var el = $(e.target);
		this.body.find("a").removeClass('selected');
		if (e.target !== this.body.get(0)) {
    		el.addClass('selected');
		}
		e.stopPropagation();
	};

	CEWindowFiles.prototype.openSelected = function() {
		var el = this.body.find("a.selected");
		
		if (!el.length) {
		    return;
		}
		
		var path = el.data('path');
		var cwd = this.cwd;

		if (el.hasClass('ce-dir')) {
            this.cd(path);
		} else if (el.hasClass('ce-file')) {
			path = this.removeTrailingSlash(cwd) + "/" + path;
			this.open(path);
		}
	};

	CEWindowFiles.prototype.cd = function(path) {
        var cwd = this.cwd;

		if (path == '..') {
			cwd = cwd.split("/");
			cwd.pop();
			cwd = cwd.join("/");
		} else if (path.substr(0, 1) == "/") {
		    cwd = path;
		} else {
			cwd = this.removeTrailingSlash(cwd) + "/" + path;
		}
        
        this.cwd = cwd;
		CEApp.config.set("filetree.cwd", this.cwd);

		this.refresh();
		
		CEApp.sites.setCwd(this.cwd);
	};
	
	CEWindowFiles.prototype.removeTrailingSlash = function(path) {
	    var parts = path.split("");
	    if (parts.pop() == "/") {
            return parts.join("");
	    }
	    return path;
	};

	CEWindowFiles.prototype.open = function(path) {
		var win = CEEditor.getInstance(path);
		win.display();
	};

	window.CEWindowFiles = CEWindowFiles;

}());