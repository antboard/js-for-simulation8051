/*
*	ant is http://antriver.com
*	good luck!
*	create by icecut@qq.com yichun jiang
*
* covert hex file to bin data
*
*/

this.ant8051 = this.ant8051 || {};
this.ant8051.romSize = this.ant8051.romSize | 64*1024;

(function(){
	var hexFile = function(data){
		var lines = data.split(":");
		var types = [0, 1];
		var rom = Array(ant8051.romSize);
		var ret = _.every(lines, function(value){
			if (value.length == 0) 
				return true;
			//-- console.log(value);

			// 根据hex格式进行解析
			// 第一个hex是长度。2byte
			var len = parseInt(value.substring(0,2), 16);

			//-- console.log(len);
			var offset = parseInt(value.substring(2,6), 16);

			//-- console.log(offset);
			var type = parseInt(value.substring(6,8), 16);
			if (types.indexOf(type) == -1) {
				alert("type "+type+"is not support");
				return false;
			};
			//-- console.log(type);

			// 计算校验和
			value = value.replace("\n","")
			if (len*2 + 10 !== value.length-1){ // the last null
				alert("hex line short "+ value);
				return false;
			}
			var checksum = 256;
			for (var i = 0; i < len*2+8; i+=2) {
				checksum -= parseInt(value.substring(i,i+2),16);
			};
			// make chechsum longer than 2
			if (checksum.toString(16).length<4) {
				checksum += 0x100;
			};
			// get last 2bit
			var ck = checksum.toString(16);
			ck = ck.substring(ck.length-2, ck.length);
			if (checksum < 0) {
				// 计算补码
				var n = parseInt(ck,16);
				if (n === 0) {
					ck = 0;
				}else{
					var nck = 0x100-parseInt(ck, 16);
					ck = nck.toString(16);
				}
			};

			//-- console.log("0x"+(checksum.toString(16)) +"   "+ck.toString(16));
			if (parseInt(ck, 16)  !== parseInt(value.substring(i, i+2), 16)) {
				alert("checksum error: compute is"+ck + " data is:" + value.substring(i, i+2));
				return false;
			};

			// data convert
			for (var i = 0; i < len; i++) {
				rom[offset+i] = parseInt(value.substring(8+i*2, 10+i*2), 16); 
			};
			return true;
		});
		if (ret == false) {
			alert("parse lines error");
		}else{
			return rom;
		}
	};
	this.ant8051.fromHexFile = hexFile;
})();