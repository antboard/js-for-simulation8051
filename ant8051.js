/*
	ant is http://antriver.com
	good luck!
	create by icecut@qq.com yichun jiang
*/

this.ant8051 = this.ant8051 || {};
// init ram size
this.ant8051.ramSize = this.ant8051.ramSize || 256;

(function(){
	/*
		now I'think ant8051 core need program input.
	*/
	var core = function(data){
		this.initialize(data);
	}

	var p = core.prototype;

	p.initialize = function(data){
		p.ram = Array(ant8051.ramSize);
		if (ant8051.fromHexFile == null) {
			alert("include hex2bin.js first!");
		};
		p.rom = ant8051.fromHexFile(data);
	};

	ant8051.core = core;

})();