var logger = (function(isWebSocketEnable, socket) {
	
	var argumentsToArray = function(args) { 
		return Array.prototype.slice.call(args);
	};
	var Logger = Object.subClass({
		init : function() {
			// this.same_method_on_super_class();
			this.ws_enable = isWebSocketEnable || null;
			this.socket = socket || null;
			this.active = false;
		},
		log : function() {
			if (this.ws_enable && this.active) {
				var msg = 'LOG: ' + argumentsToArray(arguments)[0];
				console.log(msg);
				this.socket.emit('log-event', { my: msg });
			} else {
				console.log.apply(console, argumentsToArray(arguments));
			}
		},
		error : function(filter, referenceID) {
			console.error.apply(console, argumentsToArray(arguments));;
		},
		setSocket: function(socket) {
			this.socket = socket;
			this.ws_enable = true;
		},
		setActive: function(socket) {
			this.active = true;
		} 
	});

	// The module Pattern must be return the private Class as public Class, so
	// ...
	return {
		Logger : Logger
	};

}(false));