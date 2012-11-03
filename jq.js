// Create our own namespace (because it's cool)
(function () {

    // Define the core element
    var	$ = function (query) {
		return new customNL(query);
	},
	
	// Custom Node List
	customNL = function (query) {
		query = document.querySelectorAll(query);

		this.length = query.length;
		for (var i=0; i<this.length; i++) {
			this[i] = query[i];
		}
		
		return this;
	},
	
	// Holds all functions to be executed on DOM ready
	readyFn = [],
	
	// Executed on DOMContentLoaded
	DOMReady = function () {
		for(var i=0, l=readyFn.length; i<l; i++) {
			readyFn[i]();
		}

		// free some mem
		readyFn = null;
		document.removeEventListener('DOMContentLoaded', DOMReady, false);
	};
	
    // Used to execute functions on DOM ready
    $.ready = function (fn) {
	  if (readyFn.length == 0) {
		document.addEventListener('DOMContentLoaded', DOMReady, false);
	  }

	  readyFn.push(fn);
    };

    // Expose $ to the world
    window.$ = $;

})();	// Execute our namespace
