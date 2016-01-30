window.onload = function() {

	var editor = document.getElementById('editor');
	var path = document.getElementById('path');


	var ws = new WebSocket("ws://dev.cimaron.vm:1984");
	ws.onopen = function (event) {

		ws.send(JSON.stringify({
			uid : 1,
			fn : 'fs.ls',
			args : {path : "/var/www/www.cimaron.vm/files/"}
		}));

		ws.onmessage = function(event) {
			var data = JSON.parse(event.data);
			
			if (data.uid) {
				if (requests[data.uid]) {
					var item = requests[data.uid];
					delete requests[data.uid];
					if (data.err) {
						item.reject(data.err);
					} else {
						item.resolve(data.ret);
					}
				}
			}

		};

		cwd();
	};

	var uid = 1;
	var requests = [];

	Server = {
		call : function(fn, args) {


			var item = {
				uid : ++uid,
				fn : fn,
				args : args,
				ret : null
			};

			var promise = new Promise(function(resolve, reject) {
				item.resolve = resolve;
				item.reject = reject;
			});

			requests[item.uid] = item;

			ws.send(JSON.stringify({uid : item.uid, fn : item.fn, args : item.args}));
			
			return promise;
		}
	};

document.getElementById('editor').addEventListener('keydown', function(e) {
    if(e.keyCode === 9) { // tab was pressed
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

        // prevent the focus lose
        e.preventDefault();
    }
});

};

var CWD = "";
function cwd(path) {
	CWD = document.getElementById('cwd').value;
	if (path) {

		if (path == '..') {
			CWD = CWD.split('/');
			CWD.pop();
			CWD = CWD.join('/');
		} else {
			CWD += "/" + path;
		}
	}
	document.getElementById('cwd').value = CWD;

	Server.call('fs.lsStat', {path : CWD}).then(function(files) {
		var out = "";
		var file;

		out += '<div><a href="#" onclick="cwd(\'..\');">..</a></div>';

		for (var i = 0; i < files.length; i++) {
			file = files[i];

			if (file.is_dir) {
				out += '<div><a href="#" onclick="cwd(\'' + file.name + '\');">' + file.name + '</a></div>';
			} else {
				out += '<div><a href="#" onclick="doLoad(\'' + file.name + '\');">' + file.name + '</a></div>';
			}
		}

		var div = document.getElementById('dir');
		div.innerHTML = out;
	});
}

function doLoad(name) {
	var path = CWD + '/' + name;

	document.getElementById('file').value = path;

	Server.call('fs.readFile', {path : path})
	.then(function(data) {
		document.getElementById('editor').value = data;
	});
}

function doSave() {
	var data = document.getElementById('editor').value;
	var file = document.getElementById('file').value;
	
	Server.call('fs.writeFile', {
		path : file,
		data : data
	}).then(function() {
		console.log('Saved!');
	});

}
