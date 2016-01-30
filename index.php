<!doctype html>
<html>
<head>
	<title>Editor</title>

<script>

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

</script>




</head>
<body style="background-color:#666666;">

<div style="float:left; width: 20%; background-color:#FFFFFF;">
	<input type="text" style="width:80%" id="cwd" value="/var/www/www.cimaron.vm/files/projects/editor" /><button type="button" onclick="doCd(this.value);">CD</button>
	<div id="dir"></div>
</div>

<div style="float:left; width: 80%">
	<input type="text" id="file" disabled="disabled" style="width:100%;" /><br />
	<textarea id="editor" style="width:100%;height:600px"></textarea>
        <button type="button" onclick="doSave();">Save</button><br />
</div>


</body>
</html>

