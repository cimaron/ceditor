(function($) {

	/**
	 * Load javascript file and complete promise when loaded
	 *
	 * @param   string   name   File name
	 *
	 * @return  Promise
	 */
	function loadScript(name) {

		var promise = new Promise(function(resolve, reject) {
			
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = name;
			script.async = true;
			var loaded = false;

			script.onload = function() {
				if (!loaded) {
					loaded = true;
					resolve(this);
				}
			};

			script.onerror = script.onabort = reject;
	
			document.getElementsByTagName("head")[0].appendChild(script);
		});

		return promise;
	}



	function loadScripts(list) {

		return list.reduce(function(cur, next) {
			return cur.then(function() {
				return loadScript(next);
			});
		}, Promise.resolve());
	}

	
	//When all the scripts have loaded, complete the promise
	//var all = Promise.all([
	loadScripts([

		//Load files here
		("assets/js/node/node.js"),
		("assets/js/config.js"),

		("assets/js/widget.js"),
		("assets/js/document.js"),
		("assets/js/menu.js"),
		("assets/js/ws.js"),
		("assets/js/window.js"),
		("assets/js/filetree.js"),
		("assets/js/editorwindow.js")
	
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