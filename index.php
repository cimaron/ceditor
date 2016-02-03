<!doctype html>
<html>
<head>
	<title>Editor</title>

<link href="style.css" rel="stylesheet" />

<script src="script.js"></script>




</head>
<body>

<div class="left">
	<input type="text" id="cwd" value="/var/www/www.cimaron.vm/files/projects/editor/simple" /><button type="button" onclick="cwd();">CD</button>
	<div id="dir"></div>

	<textarea id="console" disabled="disabled"></textarea>
</div>

<div class="right">
	<input type="text" id="file" disabled="disabled" style="width:100%;" /><br />
	<textarea id="editor" style="tab-size:4;width:100%;height:600px; border: none;"></textarea>
        <button type="button" onclick="doSave();">Save</button><br />
</div>


</body>
</html>
