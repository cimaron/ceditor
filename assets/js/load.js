(function($) {

	/**
	 * Load javascript file and complete promise when loaded
	 *
	 * @param   string   name   File name
	 *
	 * @return  Promise
	 */
	function loadScript(name) {

		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = name;

		var promise = new Promise(function(resolve, reject) {
			$(script).on('load', function() {
				resolve();
			});
		});

		document.getElementsByTagName("head")[0].appendChild(script);
		
		return promise;
	}

	
	//When all the scripts have loaded, complete the promise
	var all = Promise.all([

		//Load files here
		loadScript("assets/js/node/node.js"),

		loadScript("assets/js/widget.js"),
		loadScript("assets/js/config.js"),
		loadScript("assets/js/document.js"),
		loadScript("assets/js/menu.js"),
		loadScript("assets/js/ws.js"),
		loadScript("assets/js/window.js"),
		loadScript("assets/js/filetree.js"),
		loadScript("assets/js/editorwindow.js")
	
	]).then(function() {

		CEApp = {};
		CEApp.config = new CEConfig();

		CEApp.document = new CEDocument($('body'));

			CEApp.menu = new CEMenu();
			CEApp.menu.element.addClass('ce-application-menu');
			
			CEApp.menu.element.html('<li><u>F</u>ile</li><li>Edit</li><li>View</li><li>Insert</li><li>Help</li>');
			
			CEApp.document.setMenu(CEApp.menu);

		CEApp.ws = new WS("ws://dev.cimaron.vm:1984");
		CEApp.ws.connect();

		$(window).on('keydown', function(e) {

if (e.ctrlKey || e.metaKey) {
        switch (String.fromCharCode(e.which).toLowerCase()) {
        case 's':
			CEEditorWindow.saveCurrent();
            e.preventDefault();
            break;
        case 'f':
            e.preventDefault();
			console.log('ctrl-f');
            break;
        case 'g':
            e.preventDefault();
			console.log('ctrl-g');
            break;
        }
    }

		});

		CEApp.filelist = new CEFileTree();
		CEApp.document.addChild(CEApp.filelist);

		CEApp.filelist.element.css('top', 100);

	});

}(jQuery));