var runner = (function() {	
  this.Fifo = function() {
	    var queue = [];
		var paused = true;	
	var run = function() {                           
	  if (!paused && queue.length) {
		queue.shift()();
	    if (! paused) {
		  // run usa Clousure e não é membro de Fifo
		  // método resumeExecution também não pode ser membro de Fifo
		  resumeExecution();
	    }
	  } 
	};
	var resumeExecution = function() {                    
	  paused = false;
	  // setTimeout sempre executa no context de Window
	  // método run não pode ser membro de Fifo
	  setTimeout(run, 1);
	};					
	this.process = function(fn) {                    
	  queue.push(fn);
	  run();
    };
	this.pause = function() {
	  paused = true;                      
	};	
	this.resume = resumeExecution;	
	this.start = resumeExecution;	
  };

  // The module Pattern must be return the private Class as public Class, so
  // ...
  return {
	Fifo : Fifo
  };

}());