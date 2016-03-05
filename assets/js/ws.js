(function() {
	
	/**
	 * WS Class
	 */
	function WS(host) {
		this.host = host;
		this.uid = 1;
		this.requests = [];
		this.connected = false;
		this.connecting = false;
	}

	/**
	 * Connect to server
	 */
	WS.prototype.connect = function() {

		if (this.connected) {
			return;
		}

		this.ws = new WebSocket(this.host);

		this.ws.onerror = function() {
			this.connected = false;
			this.connecting = false;
			CEApp.log("Connection error");
		};

		this.ws.onopen = function() {

			this.ws.onmessage = this.onMessage.bind(this);
			this.connected = true;
			this.connecting = false;

			this.flush();

			CEApp.log("Connected to server");

		}.bind(this);

		this.ws.onclose = function() {
			
			this.connected = false;
			CEApp.log("Disconnected from server");

		}.bind(this);

		this.connecting = true;
	};

	/**
	 * Process message
	 */
	WS.prototype.onMessage = function(event) {

		var data = JSON.parse(event.data);
			
		if (data.uid) {

			if (this.requests[data.uid]) {

				var item = this.requests[data.uid];
				delete this.requests[data.uid];

				if (data.err) {
					item.reject(data.err);
				} else {
					item.resolve(data.ret);
				}
			}
		}

	};

	/**
	 * Send request
	 */
	WS.prototype.call = function(fn, args) {

		var item = {
			uid : ++this.uid,
			fn : fn,
			args : args,
			ret : null
		};

		var promise = new Promise(function(resolve, reject) {
			item.resolve = resolve;
			item.reject = reject;
		});

		this.requests[item.uid] = item;

		this.flush();

		return promise;
	};

	/**
	 * Flush the queue
	 */
	WS.prototype.flush = function() {

		if (!this.connected) {
			//try to connect
			if (!this.connecting) {
				this.connect();
			}
			return;
		}

		var item, i;
		for (i in this.requests) {
			item = this.requests[i];		
			this.ws.send(JSON.stringify({uid : item.uid, fn : item.fn, args : item.args}));
		}
	};

	window.WS = WS;

}());


