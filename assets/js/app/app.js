(function() {

	var CEApp = {};


	CEApp.init = function() {
		new CEAppKeyBindings();

		this.config = new CEConfig();

		this.document = new CEDocument($('body'));

			this.menu = new CEMenu();
			this.menu.element.addClass('ce-application-menu');
			
			this.menu.element.html('<li><u>F</u>ile</li><li>Edit</li><li>View</li><li>Insert</li><li>Help</li>');
			
			this.document.setMenu(this.menu);

		this.logger = new CEWindowLog();
		this.document.addChild(this.logger);
		this.logger.element.css('top', 500);

		this.ws = new WS("ws://dev.cimaron.vm:1984");
		this.ws.connect();

		this.filelist = new CEFileTree();
		this.document.addChild(this.filelist);
		this.filelist.element.css('top', 100);

		//restore windows
		var openfiles = this.config.get('editor.openfiles', []);

		for (var i = 0; i < openfiles.length; i++) {
			var win = CEWindowEditorText.getInstance(openfiles[i]);
			win.display();
		}

	};

	CEApp.log = function() {
		this.logger.log.apply(this.logger, arguments);
	};

	CEApp.on = events.prototype.on;
	CEApp.trigger = events.prototype.emit;

	window.CEApp = CEApp;

}());
