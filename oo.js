/* jslint vars: true, white: true */
(function() {
	var initializing = false;
	var fnTest = /xyz/.test(function() {
		xyz;
	}) ? /\bsame_method_on_super_class\b/ : /.*/;

	Object.subClass = function(prop) {
		var name = null;
		var same_method_on_super_class = this.prototype;
		initializing = true;
		var proto = new this();
		// console.log('constructor=' + proto.constructor.name);
		initializing = false;
		for (name in prop) {
			if (typeof prop[name] == "function"
					&& typeof same_method_on_super_class[name] == "function"
					&& fnTest.test(prop[name])) {

				// console.log('applySuper invocado com name=' + name + ', prop["'
				//		+ name + '"]=' + prop[name]);
				var applySuper = function(name, fn) {
					return function() {
						var tmp = this.same_method_on_super_class;
						this.same_method_on_super_class = same_method_on_super_class[name];
						var fnName = (fn.name == '') ? 'anonymous function'
								: fn.name;
						// console.log('apply invocado com fn=' + fnName
						//		+ ', name=' + name + ', this='
						//		+ this.constructor + ' e tmp=' + tmp);
						var ret = fn.apply(this, arguments);
						this.same_method_on_super_class = tmp;
						return ret;
					};
				};
				proto[name] = applySuper(name, prop[name]);
			} else {
				// console.log('name=' + name + ', prop["' + name + '"]='
				//		+ prop[name]);
				proto[name] = prop[name];
			}
		}

		function Class() {
			if (!initializing && this.init)
				this.init.apply(this, arguments);
		}

		Class.prototype = proto;
		Class.constructor = Class;
		Class.subClass = arguments.callee;

		return Class;
	};
	// console.log('initializing=' + initializing);
}());
