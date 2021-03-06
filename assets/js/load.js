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
		("assets/js/app/config.js"),

		("assets/js/widget/widget.js"),
		("assets/js/app/app.js"),
		("assets/js/app/keybindings.js"),
		("assets/js/app/file.js"),
		("assets/js/app/document.js"),
		("assets/js/widget/window.js"),
		("assets/js/widget/tabs.js"),
		("assets/js/widget/vertical.js"),

        //Editors
        ("assets/js/windows/editor.js"),
		("assets/js/widget/editor.js"),
		("assets/js/widget/editorace.js"),
		("assets/js/widget/editortext.js"),

		("assets/js/windows/log.js"),
		("assets/js/windows/config.js"),
		("assets/js/widget/menu.js"),
		("assets/js/widget/menuitem.js"),
		("assets/js/ws.js"),
		("assets/js/windows/sites.js"),
		("assets/js/windows/files.js"),
	]).then(function() {

		CEApp.init();
	});

}(jQuery));