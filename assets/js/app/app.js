(function() {

	var CEApp = {};


	CEApp.init = function() {
		new CEAppKeyBindings();

		this.config = new CEConfig();

		this.document = new CEDocument();

			this.menu = new CEMenu();
			this.menu.element.addClass('ce-application-menu');

			var file = this.menu.addMenu('File');
			var edit = this.menu.addMenu('Edit');
			var view = this.menu.addMenu('View');
				var view_files = view.addItem("Files", {select:true});
				view_files.select();

				view_files.on('toggle', function() {
					CEApp.filelist[this.selected ? 'show' : 'hide']();
				});

				var view_log = view.addItem("Log", {select:true});
				view_log.select();
				view_log.on('click', function() {
					CEApp.logger[this.selected ? 'show' : 'hide']();
				});
			
			this.document.setMenu(this.menu);

		this.logger = new CEWindowLog();
		this.document.addChild(this.logger);
		this.logger.element.css('top', 500);

		this.ws = new WS("ws://dev.cimaron.vm:1984");
		this.ws.connect();

		this.filelist = new CEWindowFiles();
		this.document.addChild(this.filelist);
		this.filelist.element.css('top', 100);

		//restore windows
		var openfiles = this.config.get('editor.openfiles', []);

		for (var i = 0; i < openfiles.length; i++) {
			var win = CEWindowEditor.getInstance(openfiles[i]);
			win.display();
		}

		this.configWindow = new CEWindowConfig();
		this.document.addChild(this.configWindow);
		if (!this.config.get('config.open')) {
			this.configWindow.hide();
		}

		//Initialize default values
		if (!this.config.get('config.version')) {
			this.config.setData({
				"config.version":0.1,
				"desktop.backgroundImage":""
			});
		}
	};

	CEApp.log = function() {
		this.logger.log.apply(this.logger, arguments);
	};

	CEApp.on = events.prototype.on;
	CEApp.trigger = events.prototype.emit;

	window.CEApp = CEApp;

}());
