/*
	ant is http://antriver.com
	good luck!
	create by icecut@qq.com yichun jiang
*/
/*
* 乘法／除法／da 标志寄存器没处理
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
		p.PC = 0;
	};

	// Program point
	p.PC = 0;
	p.regGroup = 0;
	p.DPL = 0x82;
	p.DPH = 0x83;

	p.PSW = 0xD0;
	p.PSW_C = (1 << 7);
	p.PSW_A = (1 << 6);
	p.PSW_F = (1 << 5);
	p.PSW_RS0 = (1 << 4);
	p.PSW_RS1 = (1 << 3);
	p.PSW_OV = (1 << 2);
	p.PSW_P = (1 << 0);

	p.SP = 0x81;
	p.A = 0xe0;
	p.B = 0xf0;


	p.reset = function(){
		p.PC = 0;
	}
	p.setSpeed = function(curMhz){
		p.speed = curMhz;
	}
	p.rangeCheckUnsigned = function(x){
		if (x > 255) {
			alert("biger");
		};
	}
	p.rangeCheckSigned = function(x){
		if (x > 127) {
			alert("biger");
		};
		if (x < -128) {
			alert("smaller");
		};
	}
	/*
	* R0-R7 一共4组，				占据00- 1f区域。
	* 位寻址区共16字节			占据20-2f
	* 用户ram区域80字节			占据30-7f
	* dptr 寻址区域 P0 80H, SP:	 81H,DPL 82H,DPH 83H NC84/5/6 PCON 87H 
	*	TCON 88H,TMOD 89H, TL0 8AH, TH0 8BH
	*	TL1 8CH, TH1 8DH, NC 8E/FH, P1 90H, NC 9[1..F]H, P2 A0H, IE A8H,
	* P3 B0H, IP B8H, PSW D0H[C,A,F,RS0/1,OV,-,P]
	* A E0H, B F0H,
	*
	*/
	
	p.parser = function(){
		var times = 20000;
		while (times--){
			var d0 = p.rom[p.PC];
			switch(d0){
			case 0x00:
				p.NOP();
				break;
			case 0x02:
				p.LJMP();
				break;
			case 0x03:
				p.RR();
				break;
			case 0x04:case 0x05:case 0x06:case 0x07:case 0x08:case 0x09:
			case 0x0a:case 0x0b:case 0x0c:case 0x0d:case 0x0e:case 0x0f:
				p.INC();
				break;
			case 0x10:
				p.JBC();
				break;
			case 0x12:
				p.LCALL();
				break;
			case 0x13:
				p.RRC();
				break;
			case 0x14:case 0x15:case 0x16:case 0x17:case 0x18:case 0x19:
			case 0x1a:case 0x1b:case 0x1c:case 0x1d:case 0x1e:case 0x1f:
				p.DEC();
				break;	
			case 0x20:
				p.JB();
				break;
			case 0x22:
				p.RET();
				break;
			case 0x23:
				p.RLA();
				break;
			case 0x24:case 0x25:case 0x26:case 0x27:case 0x28:case 0x29:
			case 0x2a:case 0x2b:case 0x2c:case 0x2d:case 0x2e:case 0x2f:
				p.ADD();
				break;
			case 0x30:
				p.JNB();
				break;
			case 0x32:
				p.RETI();
				break;
			case 0x33:
				p.RLC();
				break;
			case 0x34:case 0x35:case 0x36:case 0x37:case 0x38:case 0x39:
			case 0x3a:case 0x3b:case 0x3c:case 0x3d:case 0x3e:case 0x3f:
				p.ADDC();
				break;
			case 0x40:
				p.JC();
				break;
			case 0x42:case 0x43:case 0x44:case 0x45:case 0x46:case 0x47:
			case 0x48:case 0x49:case 0x4A:case 0x4B:case 0x4C:case 0x4D:
			case 0x4E:case 0x4F:
				p.ORL();
				break;
			case 0x50:
				p.JNC();
				break;
			case 0x52:case 0x53:case 0x54:case 0x55:case 0x56:case 0x57:
			case 0x58:case 0x59:case 0x5a:case 0x5b:case 0x5c:case 0x5d:
			case 0x5e:case 0x5f:
				p.ANL5X();
				break;
			case 0x60:
				p.JZ();
				break;
			case 0x62:case 0x63:case 0x64:case 0x65:case 0x66:case 0x67:
			case 0x68:case 0x69:case 0x6a:case 0x6b:case 0x6c:case 0x6d:
			case 0x6e:case 0x6f:
				p.XRL();
				break;
			case 0x70:
				p.JNZ();
				break;
			case 0x72:
				p.ORL_72();
				break;
			case 0x73:
				p.JMP_73();
				break;
			case 0x74:case 0x75:case 0x76:case 0x77:case 0x77:case 0x78:
			case 0x79:case 0x7a:case 0x7b:case 0x7c:case 0x7d:case 0x7e:
			case 0x7f:
				p.MOV7x();
				break;
			case 0x80:
				p.SJMP();
				break;
			case 0x82:
				p.ANL8X();
				break;
			case 0x83:
				p.MOVC8();
				break;
			case 0x84:
				p.DIV();
				break;
			case 0x85:case 0x86:case 0x87:case 0x88:case 0x89:case 0x8a:
			case 0x8b:case 0x8c:case 0x8d:case 0x8e:case 0x8f:
				p.MOV8();
				break;
			case 0x90:
				p.MOV_DPTR();
				break;
			case 0x92:
				p.MOVC_92();
				break;
			case 0x93:
				p.MOVC_DPTR_A();
				break;
			case 0x94:case 0x95:case 0x96:case 0x97:case 0x98:case 0x99:
			case 0x9a:case 0x9b:case 0x9c:case 0x9d:case 0x9e:case 0x9f:
				p.SUBB();
				break;
			case 0xa0:
				p.ORL_A0();
				break;
			case 0xa2:
				p.MOVC_A2();
				break;
			case 0xA3:
				p.INC_DPTR();
				break;
			case 0xa4:
				p.MUL();
				break;
			case 0xa6:case 0xa7:case 0xa8:case 0xa9:case 0xaa:case 0xab:
			case 0xac:case 0xad:case 0xae:case 0xaf:
				p.MOVA();
				break;
			case 0xb0:
				p.ANLB0();
				break;
			case 0xb2:
				p.CPL_BIT();
				break;
			case 0xb3:
				p.CPL_C();
				break;
			case 0xb4:case 0xb5:case 0xb6:case 0xb7:case 0xb8:case 0xb9:
			case 0xba:case 0xbb:case 0xbc:case 0xbd:case 0xbe:case 0xbf:
				p.CJNE();
				break;
			case 0xc0:
				p.PUSH();
				break;
			case 0xc2:case 0xc3:
				p.CLR_C2();
				break;
			case 0xc4:
				p.SWAP();
				break;
			case 0xc5:case 0xc6:case 0xc7:case 0xc8:case 0xc9:case 0xca:
			case 0xcb:case 0xcc:case 0xcd:case 0xce:case 0xcf:
				p.XCH();
				break;
			case 0xd0:
				p.POP();
				break;
			case 0xd2:case 0xd3:
				p.SET();
				break;
			case 0xd4:
				p.DA();
				break;
			case 0xd5:
				p.DJNZ_D5();
				break;
			case 0xd6:case 0xd7:
				p.XCHD();
				break;
			case 0xd8:case 0xd9:case 0xda:case 0xdb:case 0xdc:case 0xdd:
			case 0xde:case 0xdf:
				p.DJNZ2();
				break;
			case 0xe0:case 0xe2:case 0xe3:
				p.MOVX_E();
				break;
			case 0xe4:
				p.CLRA();
				break;
			case 0xe5:case 0xe6:case 0xe7:case 0xe8:case 0xe9:case 0xea:
			case 0xeb:case 0xec:case 0xed:case 0xee:case 0xef:
				p.MOVE();
				break;
			case 0xf0:case 0xf2:case 0xf3:
				p.MOVX_F();
				break;
			case 0xf4:
				p.CPL_A();
				break;
			case 0xf5:case 0xf6:case 0xf7:case 0xf8:case 0xf9:case 0xfa:
			case 0xfb:case 0xfc:case 0xfd:case 0xfe:case 0xff:
				p.MOVFx();
				break;
			case 0x01:case 0x21:case 0x41:case 0x61:case 0x81:case 0xa1:
			case 0xc1:case 0xe1:
				p.AJMP();
				break;
			case 0x11:case 0x31:case 0x51:case 0x71:case 0x91:case 0xb1:
			case 0xd1:case 0xf1:
				p.ACALL();
				break;
			default:
				alert("0x" + d0.toString(16) +"----"+times);
				return;
			};
		}
		alert("times = "times);
	};

	// 00
	p.NOP = function(){
		p.PC++;
	}
	// 0x02
	p.LJMP = function(){
		var d1 = p.rom[p.PC+1];
		var d2 = p.rom[p.PC+2];
		p.PC = d1*0x100+d2;
	};
	// 03
	p.RR = function(){
		p.PC++;
		var b = p.ram[p.A] & 0x01;
		p.ram[p.A] >>= 1;
		p.ram[p.A] |= (b === 0) ? 0 : 0x80;
		return;
	}
	// 04..f
	p.INC = function(){
		var d0 = p.rom[p.PC];
		var d1 = p.rom[p.PC + 1];		
		p.PC++;
		if (d0 === 0x04) {
			p.ram[p.A]++;
			p.rangeCheckUnsigned(p.ram[p.A]);
			return;
		};

		if ((d0 & 0xf8) === 0x08) {
			var idx = d0 & 0x07;
			p.ram[8*p.regGroup+idx]++;
			p.rangeCheckUnsigned(p.ram[8*p.regGroup+idx]);
			return;
		};

		if ((d0 & 0xfe) === 0x06) {
			var idx = d0 & 1;
			var addr = p.ram[8*p.regGroup+idx];
			p.ram[addr]++;
			p.rangeCheckUnsigned(p.ram[addr]);
			return;
		};

		p.PC++;

		if (d0 === 0x05) {
			p.ram[d1]++;
			p.rangeCheckUnsigned(p.ram[d1]);
			return; 
		};
	};
	// 10
	p.JBC = function(){
		var d0 = p.rom[p.PC];
		var d1 = p.rom[p.PC + 1];
		var d2 = p.rom[p.PC + 2];
		p.PC += 3;

		var addr = parseInt(d1 / 8);
		var bit = 1 << (d1 % 8);
		
		if ((p.ram[0x20+addr] & bit) === 1) {
			p.ram[0x20+addr] &= ~bit;
			var rel = d2;
			if (d2 > 127) {
				rel -= 256;
			};
			p.PC += rel;
		};
	}
	// 12
	p.LCALL = function(){
		var d0 = p.rom[p.PC];
		var d1 = p.rom[p.PC + 1];
		var d2 = p.rom[p.PC + 2];
		p.PC += 3;
		p.ram[p.SP]++;
		var offset = p.ram[p.SP];
		p.ram[offset] = p.PC % 0x100;

		p.ram[p.SP]++;
		offset = p.ram[p.SP];
		p.ram[offset] = parseInt(p.PC / 0x100);

		p.PC = d1*0x100+d2;
	}
	// 13
	p.RRC = function(){
		p.PC++;
		var b0 = p.ram[p.A]&1;
		p.ram[p.A] >>= 1;
		if (p.ram[p.PSW] & 0x80) {
			p.ram[p.A] |= 0x80;
		};
		if (b0) {
			p.ram[p.PSW] |= 0x80;
		}else{
			p.ram[p.PSW] &= ~0x80;
		}
	}
	// 14..f
	p.DEC = function(){
		var d0 = p.rom[p.PC];
		var d1 = p.rom[p.PC + 1];		
		p.PC++;
		if (d0 === 0x14) {
			p.ram[p.A]--;
			p.rangeCheckSigned(p.ram[p.A]);
			return;
		};

		if ((d0 & 0xf8) === 0x18) {
			var idx = d0 & 0x07;
			p.ram[8*p.regGroup+idx]--;
			p.rangeCheckSigned(p.ram[8*p.regGroup+idx]);
			return;
		};

		if ((d0 & 0xfe) === 0x16) {
			var idx = d0 & 1;
			var addr = p.ram[8*p.regGroup+idx];
			p.ram[addr]--;
			p.rangeCheckSigned(p.ram[addr]);
			return;
		};

		p.PC++;

		if (d0 === 0x15) {
			p.ram[d1]--;
			p.rangeCheckSigned(p.ram[d1]);
			return; 
		};		
	}
	// 22
	p.RET = function(){
		var ph = p.ram[p.ram[p.SP]];
		p.ram[p.SP]--;
		var pl = p.ram[p.ram[p.SP]];
		p.ram[p.SP]--;
		p.PC = ph*0x100+pl;
		return;
	}
	// 20
	p.JB = function(){
		var d0 = p.rom[p.PC];
		var d1 = p.rom[p.PC + 1];
		var d2 = p.rom[p.PC + 2];
		p.PC += 3;

		var addr = parseInt(d1 / 8);
		var bit = 1 << (d1 % 8);
		
		if ((p.ram[0x20+addr] & bit) === 1) {
			var rel = d2;
			if (d2 > 127) {
				rel -= 256;
			};
			p.PC += rel;
		};
	}
	// 23
	p.RLA = function(){
		p.PC++;
		var b7 = p.ram[p.A] & 0x80;
		p.ram[p.A] <<= 1;
		if (b7) {
			p.ram[p.A] |= 1;
		};
		p.rangeCheckUnsigned(p.ram[p.A]);
	}

	p.addStatus = function(x,y){
		var cy = 0;
		var ov = 0;
		var bit7_s = 0, bit7_d = 0;
		var bit6_s = 0,	bit6_d = 0;

		bit7_s = x & 0x80;
		bit6_s = x & 0x40;
		bit7_d = y & 0x80;
		bit6_d = y & 0x40;
		cy = bit7_s && bit7_d;// 两个bit都是1才能进位
		ov = bit6_s && bit6_d;// 两个bit都是1才能进位
		ov = ov ^ cy;
		if (cy) {
			p.ram[p.PSW] |= p.PSW_C	;
		}else{
			p.ram[p.PSW] &= ~p.PSW_C;
		}

		if (ov) {
			p.ram[p.PSW] |= p.PSW_OV;
		}else{
			p.ram[p.PSW] &= ~p.PSW_OV;
		}
		
	}
	// 24..f
	p.ADD = function(){
		var d0 = p.rom[p.PC];
		var d1 = p.rom[p.PC + 1];
		p.PC++;
		
		if ((d0 & 0xf8) === 0x28) {
			var idx = d0 & 0x07;
			p.addStatus(p.ram[p.A], p.ram[8*p.regGroup+idx]);
			p.ram[p.A] = p.ram[p.A] + p.ram[8*p.regGroup+idx];
			p.rangeCheckUnsigned(p.ram[p.A]);
			return;
		};

		if ((d0 & 0xfe) === 0x26) {
			var idx = d0 & 1;
			var addr = p.ram[8*p.regGroup+idx];
			p.addStatus(p.ram[p.A], p.ram[addr]);
			p.ram[p.A] = p.ram[p.A] + p.ram[addr];
			p.rangeCheckUnsigned(p.ram[p.A]);
			return;
		};

		p.PC++;
		if (d0 === 0x24) {
			p.addStatus(p.ram[p.A], d1);
			p.ram[p.A] = p.ram[p.A] + d1;
			p.rangeCheckUnsigned(p.ram[p.A]);
			return;
		};

		if (d0 === 0x25) {
			p.addStatus(p.ram[p.A], p.ram[d1]);
			p.ram[p.A] = p.ram[p.A] + p.ram[d1];
			p.rangeCheckUnsigned(p.ram[p.A]);
			return;
		};
	}
	// 30
	p.JNB = function(){
		var d0 = p.rom[p.PC];
		var d1 = p.rom[p.PC + 1];
		var d2 = p.rom[p.PC + 2];
		p.PC += 3;

		var addr = parseInt(d1 / 8);
		var bit = 1 << (d1 % 8);
		
		if ((p.ram[0x20+addr] & bit) === 0) {
			var rel = d2;
			if (d2 > 127) {
				rel -= 256;
			};
			p.PC += rel;
		};
	}
	// 32
	p.RETI = function(){
		var ph = p.ram[p.ram[p.SP]];
		p.ram[p.SP]--;
		var pl = p.ram[p.ram[p.SP]];
		p.ram[p.SP]--;
		p.PC = ph*0x100+pl;
		return;
	}
	// 33
	p.RLC = function(){
		p.PC++;
		var b7 = p.ram[p.A];
		p.ram[p.A] <<= 1;
		if (p.ram[p.PSW] & 0x08) {
			p.ram[p.A] |= 1;
		};
		if (b7) {
			p.ram[p.PSW] |= 0x80;
		}else{
			p.ram[p.PSW] &= ~0x80;
		}
		p.rangeCheckUnsigned(p.ram[p.A]);
	}
	// 34..f
	p.ADDC = function(){
		var d0 = p.rom[p.PC];
		var d1 = p.rom[p.PC + 1];
		p.PC++;

		var c = 0;
		if (p.ram[p.PSW] & 0x80) {
			c=1;
		};

		if ((d0 & 0xf8) === 0x38) {
			var idx = d0 & 0x07;
			p.addStatus(p.ram[p.A], p.ram[8*p.regGroup+idx] + c);
			p.ram[p.A] = p.ram[p.A] + p.ram[8*p.regGroup+idx] + c;
			p.rangeCheckUnsigned(p.ram[p.A]);
			return;
		};

		if ((d0 & 0xfe) === 0x36) {
			var idx = d0 & 1;
			var addr = p.ram[8*p.regGroup+idx];
			p.addStatus(p.ram[p.A], p.ram[addr] + c);
			p.ram[p.A] = p.ram[p.A] + p.ram[addr] + c;
			p.rangeCheckUnsigned(p.ram[p.A]);
			return;
		};

		p.PC++;
		if (d0 === 0x34) {
			p.addStatus(p.ram[p.A], d1 + c);
			p.ram[p.A] = p.ram[p.A] + d1 + c;
			p.rangeCheckUnsigned(p.ram[p.A]);
			return;
		};

		if (d0 === 0x35) {
			p.addStatus(p.ram[p.A], p.ram[d1] + c);
			p.ram[p.A] = p.ram[p.A] + p.ram[d1] + c;
			p.rangeCheckUnsigned(p.ram[p.A]);
			return;
		};
	}
	// 0x40
	p.JC = function(){
		var d1 = p.rom[p.PC + 1];
		p.PC+= 2;
		if (p.ram[p.PSW] & 0x80) {
			if (d1 > 127) {
				d1 -= 256;
			};
			p.PC += d1;
		};
	}
	// 42..f
	p.ORL = function(){
		var d0 = p.rom[p.PC];
		var d1 = p.rom[p.PC + 1];
		var d2 = p.rom[p.PC + 2];
		p.PC ++;

		if ((d0 & 0xf8) === 0x48) {
			var idx = d0 & 0x07;
			p.ram[p.A] = p.ram[p.A] | p.ram[8*p.regGroup+idx];
			return;
		};

		if ((d0 & 0xfe) === 0x46) {
			var idx = d0 & 1;
			var addr = p.ram[8*p.regGroup+idx];
			p.ram[p.A] = p.ram[p.A] | p.ram[addr];
			return;
		};

		p.PC++;

		if (d0 === 0x42) {
			p.ram[d1] = p.ram[p.A] | p.ram[d1];
			return;
		};

		if (d0 === 0x44) {
			p.ram[p.A] = p.ram[p.A] | d1;
			return;
		};

		if (d0 === 0x45) {
			p.ram[p.A] = p.ram[p.A] | p.ram[d1];
			return;
		};

		p.PC++;

		if (d0 == 0x43) {
			p.ram[d1] = d2 | p.ram[d1];
			return;
		};
	}
	// 50
	p.JNC = function(){
		var d1 = p.rom[p.PC + 1];
		p.PC += 2;
		if (p.ram[p.PSW] & 0x80) {
			if (d1 > 127) {
				d1 -= 256;
			};
			p.PC += d1;
		};
	}
	// 0x52-f
	p.ANL5X = function(){
		var d0 = p.rom[p.PC];
		var d1 = p.rom[p.PC + 1];
		var d2 = p.rom[p.PC + 2];
		p.PC ++;

		if ((d0 & 0xf8) === 0x58) {
			var idx = d0 & 0x07;
			p.ram[p.A] = p.ram[p.A] & p.ram[8*p.regGroup+idx];
			return;
		};

		if ((d0 & 0xfe) === 0x56) {
			var idx = d0 & 1;
			var addr = p.ram[8*p.regGroup+idx];
			p.ram[p.A] = p.ram[p.A] & p.ram[addr];
			return;
		};

		p.PC++;

		if (d0 === 0x52) {
			p.ram[d1] = p.ram[p.A] & p.ram[d1];
			return;
		};

		if (d0 === 0x54) {
			p.ram[p.A] = p.ram[p.A] & d1;
			return;
		};

		if (d0 === 0x55) {
			p.ram[p.A] = p.ram[p.A] & p.ram[d1];
			return;
		};

		p.PC++;

		if (d0 == 0x53) {
			p.ram[d1] = d2 & p.ram[d1];
			return;
		};
	};
	// 0x60
	p.JZ = function(){
		var d1 = p.rom[p.PC + 1];
		if (d1 > 127) {
			d1 -= 256;
		};
		p.PC += 2;
		if (p.ram[p.A] === 0) {
			p.PC += d1;
		};
	}

	// 62..F
	p.XRL = function(){
		var d0 = p.rom[p.PC];
		var d1 = p.rom[p.PC + 1];
		var d2 = p.rom[p.PC + 2];
		p.PC ++;

		if ((d0 & 0xf8) === 0x68) {
			var idx = d0 & 0x07;
			p.ram[p.A] = p.ram[p.A] ^ p.ram[8*p.regGroup+idx];
			return;
		};

		if ((d0 & 0xfe) === 0x66) {
			var idx = d0 & 1;
			var addr = p.ram[8*p.regGroup+idx];
			p.ram[p.A] = p.ram[p.A] ^ p.ram[addr];
			return;
		};

		p.PC++;

		if (d0 === 0x62) {
			p.ram[d1] = p.ram[p.A] ^ p.ram[d1];
			return;
		};

		if (d0 === 0x64) {
			p.ram[p.A] = p.ram[p.A] ^ d1;
			return;
		};

		if (d0 === 0x65) {
			p.ram[p.A] = p.ram[p.A] ^ p.ram[d1];
			return;
		};

		p.PC++;

		if (d0 == 0x63) {
			p.ram[d1] = d2 ^ p.ram[d1];
			return;
		};
	};
	// 70
	p.JNZ = function(){
		var d1 = p.rom[p.PC + 1];
		if (d1 > 127) {
			d1 -= 256;
		};
		p.PC += 2;
		if (p.ram[p.A] !== 0) {
			p.PC += d1;
		};
	}
	// 72
	p.ORL_72 = function(){
		var d0 = p.rom[p.PC];
		var d1 = p.rom[p.PC + 1];
		p.PC += 2;

		var addr = d1 / 8;
		var bit = 1 << (d1 % 8);
		if (p.ram[0x20+addr] & bit) {
			p.ram[p.PSW] |= 0x80;
		};
	}
	// 73 
	p.JMP_73 = function(){
		p.PC = p.ram[p.A] + p.ram[p.DPH]*0x100+p.ram[p.DPL];
	}
	// 0x74-7f
	p.MOV7x = function(){
		var d0 = p.rom[p.PC];
		var d1 = p.rom[p.PC + 1];
		var d2 = p.rom[p.PC + 2];
		p.PC += 2;
		if (d0 === 0x74) {
			p.ram[p.A] = d1;
			return;
		};
		if (d0 === 0x75) {
			p.ram[d1] = d2;
			p.PC++;
			return;
		};
		
		if ((d0 & 0xfe) === 0x76) {
			var idx = d0 & 1;
			var addr = p.ram[8*p.regGroup+idx];
			p.ram[addr] = d1;
			return;
		};
		
		if ((d0 & 0xf8) === 0x78) {
			var idx = d0 & 0x07;
			p.ram[8*p.regGroup+idx] = d1;
			return;
		};
	};
	p.SJMP = function(){
		var d0 = p.rom[p.PC];
		var d1 = p.rom[p.PC + 1];
		p.PC += 2;
		if (d1 > 127) {
			d1 -= 256;
		};
		p.PC+= d1;
	}
	// 82
	p.ANL8X = function(){
		var d0 = p.rom[p.PC];
		var d1 = p.rom[p.PC + 1];
		p.PC += 2;
		var addr = parseInt(d1 / 8);
		var bit_idx = 1 << (d1 % 8);
		var bit = p.ram[0x20+addr] & bit_idx;
		if (bit !== 0) {
			return;
		}else{
			p.ram[p.PSW] &= 0x7f;
			return;
		}
	}
	// 83
	p.MOVC8 = function(){
		p.PC++;
		p.ram[p.A] = p.rom[p.ram[p.A]+p.PC];
		return;
	}
	// 84
	p.DIV = function(){
		p.PC++;
		var c = p.ram[p.A] / p.ram[p.B];
		var d = p.ram[p.A] % p.ram[p.B];
		p.ram[p.A] = c;
		p.ram[p.B] = d;
		p.ram[p.PSW] &= ~0x80;

	}
	// 85..F
	p.MOV8 = function(){
		var d0 = p.rom[p.PC];
		var d1 = p.rom[p.PC + 1];
		var d2 = p.rom[p.PC + 2];
		p.PC += 2;
		if (d0 === 0x85) {
			p.ram[d1] = p.ram[d2];
			p.PC++;
			return;
		};
		if ((d0 & 0xfe) === 0x86) {
			var idx = d0 & 1;
			var addr = p.ram[8*p.regGroup+idx];
			d1 = p.ram[addr];
			return;
		};
		if ((d0 & 0xf8) === 0x88) {
			var idx = d0 & 0x07;
			p.ram[d1] = p.ram[8*p.regGroup+idx];
			return;
		};
	}
	// 0x90
	p.MOV_DPTR = function(){
		var d0 = p.rom[p.PC];
		var d1 = p.rom[p.PC + 1];
		var d2 = p.rom[p.PC + 2];
		p.PC += 3;
		p.ram[p.DPH] = d1;
		p.ram[p.DPL] = d2;
	};
	// 0x92
	p.MOVC_92 = function(){
		var d0 = p.rom[p.PC];
		var d1 = p.rom[p.PC + 1];
		p.PC += 2;

		var addr = d1 / 8;
		var bit = 1 << (d1 % 8);
		if (p.ram[0x20+addr] & bit) {
			p.ram[p.PSW] |= 0x80;
		}else{
			p.ram[p.PSW] &= ~0x80;
		}
	}
	// 0x93
	p.MOVC_DPTR_A = function(){
		var offset = p.ram[p.DPH]*0x100 + p.ram[p.DPL] + p.ram[p.A];
		p.ram[p.A] = p.rom[offset];
		p.PC++;
	};
	p.subbStatus = function(x, c, y){
		if (x !== 0) {x -= c};
		var cy = (x < y) ? 1 : 0;
		var o1 = x & 0x7f;
		var o2 = y & 0x7f;
		var ov = (x - y) & 0x80;
		ov = ov ^ cy;
		if (cy) {
			p.ram[p.PSW] |= p.PSW_C	;
		}else{
			p.ram[p.PSW] &= ~p.PSW_C;
		}

		if (ov) {
			p.ram[p.PSW] |= p.PSW_OV;
		}else{
			p.ram[p.PSW] &= ~p.PSW_OV;
		}
	}
	// 94..f
	p.SUBB = function(){
		var d0 = p.rom[p.PC];
		var d1 = p.rom[p.PC + 1];

		p.PC++;
		var c = (p.ram[p.PSW] & 0x80) ? 1 : 0;
		if ((d0 & 0xf8) === 0x98) {
			var idx = d0 & 0x07;
			p.subbStatus(p.ram[p.A], c, p.ram[8*p.regGroup+idx]);
			p.ram[p.A] = p.ram[p.A] - c - p.ram[8*p.regGroup+idx];
			p.rangeCheckSigned(p.ram[p.A]);
			return;
		};

		if ((d0 & 0xfe) === 0x96) {
			var idx = d0 & 1;
			var addr = p.ram[8*p.regGroup+idx];
			p.subbStatus(p.ram[p.A], c, p.ram[addr]);
			p.ram[p.A] = p.ram[p.A] - c - p.ram[addr];
			p.rangeCheckSigned(p.ram[p.A]);
			return;
		};
		
		p.PC++;

		if (d0 === 0x94) {
			p.subbStatus(p.ram[p.A], c, d1);
			p.ram[p.A] = p.ram[p.A] - c - d1;
			p.rangeCheckSigned(p.ram[p.A]);
			return;
		};

		if (d0 === 0x95) {
			p.subbStatus(p.ram[p.A], c, p.ram[d1]);
			p.ram[p.A] = p.ram[p.A] - c - p.ram[d1];
			p.rangeCheckSigned(p.ram[p.A]);
			return;
		};
	}
	// 0xa0
	p.ORL_A0 = function(){
		var d0 = p.rom[p.PC];
		var d1 = p.rom[p.PC + 1];
		p.PC += 2;

		var addr = d1 / 8;
		var bit = 1 << (d1 % 8);
		if ((p.ram[0x20+addr] & bit) == 0) {
			p.ram[p.PSW] |= 0x80;
		};
	}
	// a2
	p.MOVC_A2 = function(){
		var d0 = p.rom[p.PC];
		var d1 = p.rom[p.PC + 1];
		p.PC += 2;

		var addr = d1 / 8;
		var bit = 1 << (d1 % 8);
		if (p.ram[p.PSW] | 0x80) {
			p.ram[0x20+addr] |= bit;
		}else{
			p.ram[0x20+addr] &= ~bit;
		}
	}
	// 0xa3
	p.INC_DPTR = function(){
		var dptr = p.ram[p.DPH]*0x100+p.ram[p.DPL];
		dptr++;
		p.ram[p.DPL] = dptr % 0x100;
		p.ram[p.DPH] = parseInt(dptr / 0x100);
		p.PC++;
	}
	// a4
	p.MUL = function(){
		p.PC++;
		var x = p.ram[p.A] * p.ram[p.B];
		p.ram[p.A] = x % 0x100;
		p.ram[p.B] = parseInt(x / 0x100);

	}
	// a6..f
	p.MOVA = function(){
		var d0 = p.rom[p.PC];
		var d1 = p.rom[p.PC + 1];
		p.PC += 2;

		if ((d0 & 0xf6) === 0xa6) {
			var idx = d0 & 1;
			var addr = p.ram[8*p.regGroup+idx];
			p.ram[addr] = p.ram[d1];
			return;
		};
		if ((d0 & 0xf8) === 0xa8) {
			var idx = d0 & 0x07;
			p.ram[8*p.regGroup+idx] = p.ram[d1];
			return;
		};
	}
	// b0
	p.ANLB0 = function(){
		var d0 = p.rom[p.PC];
		var d1 = p.rom[p.PC + 1];
		p.PC += 2;
		var addr = parseInt(d1 / 8);
		var bit_idx = 1 << (d1 % 8);
		var bit = p.ram[0x20+addr] & bit_idx;
		if (bit === 0) {
			return;
		}else{
			p.ram[p.PSW] &= 0x7f;
			return;
		}
	}
	// B2
	p.CPL_BIT = function(){
		var d0 = p.rom[p.PC];
		var d1 = p.rom[p.PC + 1];
		p.PC += 2;

		var addr = d1 / 8;
		var bit = 1 << (d1 % 8);
		if (p.ram[0x20+addr] & bit) {
			p.ram[0x20+addr] &= ~bit
		}else{
			p.ram[0x20+addr] |= bit;
		}
	}
	// b3
	p.CPL_C = function(){
		p.PC++;
		var bit = 1 << 8;
		if (p.ram[p.PSW] & bit) {
			p.ram[p.PSW] &= ~bit
		}else{
			p.ram[p.PSW] |= bit;
		}
	}
	// b4..f
	p.CJNE = function(){
		var d0 = p.rom[p.PC];
		var d1 = p.rom[p.PC + 1];
		var d2 = p.rom[p.PC + 2];
		p.PC += 3;

		if (d2 > 127) {
			d2 -= 256;
		};

		if (d0 === 0xb5) {
			if (p.ram[p.A] !== p.ram[d1])
				p.PC += d2;
			if (p.ram[p.A] < p.ram[d1]) {
				p.ram[p.PSW] |=  0x80;
			}else{
				p.ram[p.PSW] &= ~0x80;
			}
			return;
		};

		if (d0 === 0xb4) {
			if (p.ram[p.A] !== d1)
				p.PC += d2;
			if (p.ram[p.A] < d1) {
				p.ram[p.PSW] |=  0x80;
			}else{
				p.ram[p.PSW] &= ~0x80;
			}
			return;
		};

		if ((d0 & 0xf8) === 0xb8) {
			var idx = d0 & 0x07;
			var x = p.ram[8*p.regGroup+idx];
			if (x !== d1)
				p.PC += d2;
			if (x < d1) {
				p.ram[p.PSW] |=  0x80;
			}else{
				p.ram[p.PSW] &= ~0x80;
			}
			return;
		};

		if ((d0 & 0xfe) === 0xc6) {
			var idx = d0 & 1;
			var addr = p.ram[8*p.regGroup+idx];
			var x  = p.ram[addr];
			if (x !== d1)
				p.PC += d2;
			if (x < d1) {
				p.ram[p.PSW] |=  0x80;
			}else{
				p.ram[p.PSW] &= ~0x80;
			}
			return;
		};
	}
	// c0
	p.PUSH = function(){
		var d0 = p.rom[p.PC];
		var d1 = p.rom[p.PC + 1];
		p.PC += 2;

		p.ram[p.SP]++;
		var addr = p.ram[p.SP];
		p.ram[addr] = p.ram[d1];
		return;
	}
	// c4 
	p.SWAP = function(){
		p.PC++;
		var x = p.ram[p.A] & 0x0f;
		var y = p.ram[p.A] & 0xf0;
		p.ram[p.A] = (x << 4) | (y >> 4);

	}
	// c5..f
	p.XCH = function(){
		var d0 = p.rom[p.PC];
		var d1 = p.rom[p.PC + 1];
		p.PC++;

		if ((d0 & 0xf8) === 0xc8) {
			var idx = d0 & 0x07;
			var x = p.ram[8*p.regGroup+idx];
			p.ram[8*p.regGroup+idx] = p.ram[p.A];
			p.ram[p.A] = x;
			return;
		};

		if ((d0 & 0xfe) === 0xc6) {
			var idx = d0 & 1;
			var addr = p.ram[8*p.regGroup+idx];
			var x  = p.ram[addr];
			p.ram[addr] = p.ram[p.A];
			p.ram[p.A] = x;
			return;
		};

		p.PC++;
		if (d0 === 0xc5) {
			var x  = p.ram[d1];
			p.ram[d1] = p.ram[p.A] ;
			p.ram[p.A] = x;
			return;
		};

	}
	// D0
	p.POP = function(){
		var d0 = p.rom[p.PC];
		var d1 = p.rom[p.PC + 1];

		p.PC += 2;

		p.ram[d1] = p.ram[p.ram[p.SP]];
		p.ram[p.SP]--;
	}
	// d2-3
	p.SET = function(){
		var d0 = p.rom[p.PC];
		var d1 = p.rom[p.PC + 1];

		p.PC++;
		if (d0 === 0xd3) {
			p.ram[p.PSW] |= 0x80;
			return;
		};

		p.PC++;
		if (d0 === 0xd2) {
			var addr = parseInt(d1 / 8);
			var bit = 1 << (d1%8);
			p.ram[0x20+addr] |= bit;
			return;	
		};
	}
	// d4
	p.DA = function(){
		p.PC++;
		if ((p.ram[p.PSW] & p.PSW_A) || (p.ram[p.A]&0x0f > 9)) {
			p.ram[p.A] += 6;
		};
		if ((p.ram[p.PSW] & p.PSW_C) || (p.ram[p.A]&0x0f > 0x90)) {
			p.ram[p.A] += 0x60;
		};
	}
	// d5 
	p.DJNZ_D5 = function(){
		var d0 = p.rom[p.PC];
		var d1 = p.rom[p.PC + 1];
		var d2 = p.rom[p.PC + 2]
		p.PC += 3;

		p.ram[d1]--;
		if (p.ram[d1]) {
			if (d2 > 127) {
				d2 -= 256;
			};
			p.PC += d2;
		};
	}
	// d6
	p.XCHD = function(){
		var d0 = p.rom[p.PC];
		p.PC++;

		if (d0 & 0xfe === 0xd6) {
			var idx = d0 & 1;
			var addr = p.ram[8*p.regGroup+idx];
			var xa = p.ram[p.A] & 0x0f;
			var xr = p.ram[addr] & 0x0f;
			p.ram[p.A] &= 0xf0;
			p.ram[addr] &= 0xf0;
			p.ram[p.A] |= xr;
			p.ram[addr] |= xa;
			return;
		};
	}
	// e0..3
	p.MOVX_E = function(){
		var d0 = p.rom[p.PC];
		var d1 = p.rom[p.PC + 1];

		p.PC ++;

		if (d0 === 0xe0) {
			var dptr = p.ram[p.DPH]*0x100+p.ram[p.DPL];
			p.ram[p.A] = p.ram[dptr];
			return;
		};
		if ((d0 & 0xfe) === 0xe2) {
			var idx = d0 & 1;
			var addr = p.ram[8*p.regGroup+idx];
			p.ram[p.A] = p.ram[addr];
			return;
		};
	};
	// 0xe4
	p.CLRA = function(){
		p.ram[p.A] = 0;
		p.PC++;
	};
	// e5..f
	p.MOVE = function(){
		var d0 = p.rom[p.PC];
		var d1 = p.rom[p.PC + 1];

		p.PC ++;

		if ((d0 & 0xf8) === 0xe8) {
			var idx = d0 & 0x07;
			p.ram[p.A] = p.ram[8*p.regGroup+idx];
			return;
		};

		if ((d0 & 0xfe) === 0xe6) {
			var idx = d0 & 1;
			var addr = p.ram[8*p.regGroup+idx];
			p.ram[p.A] = p.ram[addr];
			return;
		};

		p.PC++;
		if (d0 === 0xe5) {
			p.ram[p.A] = p.ram[d1];
			return;
		};
	};
	// f0..3
	p.MOVX_F = function(){
		var d0 = p.rom[p.PC];
		var d1 = p.rom[p.PC + 1];

		p.PC ++;

		if (d0 === 0xf0) {
			var dptr = p.ram[p.DPH]*0x100+p.ram[p.DPL];
			p.ram[dptr] = p.ram[p.A];
			return;
		};
		if ((d0 & 0xfe) === 0xf2) {
			var idx = d0 & 1;
			var addr = p.ram[8*p.regGroup+idx];
			p.ram[addr] = p.ram[p.A];
			return;
		};

	};
	// f4
	p.CPL_A = function(){
		p.PC++;
		p.ram[p.A] = ~p.ram[p.A];
		alert(p.ram[p.A]);// 多少bit？
	}
	// 0xf6-7
	p.MOVFx = function(){
		var d0 = p.rom[p.PC];
		var d1 = p.rom[p.PC + 1];
		p.PC++;

		if ((d0 & 0xfe) === 0xf6) {
			var idx = d0 & 1;
			var addr = p.ram[8*p.regGroup+idx];
			p.ram[addr] = p.ram[p.A];
			return;
		};
		if ((d0 & 0xf8) === 0xf8) {
			var idx = d0 & 0x07;
			p.ram[8*p.regGroup+idx] = p.ram[p.A];
			return;
		};

		p.PC++;
		if (d0 === 0xf5) {
			p.ram[d1] = p.ram[p.A];
			return;
		};
	};
	// 0xd8..f
	p.DJNZ2 = function(){
		var d0 = p.rom[p.PC];
		var d1 = p.rom[p.PC + 1];
		p.PC += 2;

		if (d1 > 127) {
			d1 -= 256;
		};

		var idx = d0 & 0x07;
		p.ram[8*p.regGroup+idx]--;
		if (p.ram[8*p.regGroup+idx]) {
			p.PC += d1;
		};
		return;
	}
	p.AJMP = function(){
		var d0 = p.rom[p.PC];
		var d1 = p.rom[p.PC + 1];
		p.PC += 2;
		p.PC &= 0xf800;
		var offset = (d0 & 0xe0)*8+d1;
		p.PC += offset;
	};
	p.ACALL = function(){
		var d0 = p.rom[p.PC];
		var d1 = p.rom[p.PC + 1];
		p.PC += 2;

		p.ram[p.SP]++;
		var addr = p.ram[p.SP];
		p.ram[addr] = p.PC % 0x100;

		p.ram[p.SP]++;
		addr = p.ram[p.SP];
		p.ram[addr] = parseInt(p.PC / 0x100);

		var rel = (d0 & 0xe0) * 8 + d1;
		p.PC &= 0xf800;
		p.PC |= rel;
		return;
	};
	p.CLR_C2 = function(){
		var d0 = p.rom[p.PC];
		var d1 = p.rom[p.PC + 1];
		p.PC += 2;
		var addr = parseInt(d1 / 8);
		var off = 1 << (d1 % 8);
		p.ram[0x20+addr] &= ~off;
	};




























	ant8051.core = core;

})();