#!/usr/bin/env node

// #example:
//
// > node encode.js 'func(uint,uint32[],string,address)' '0x123, [0x456, 0x789], "Hello, world!", "0x8d731f3fed1536a57412239d750a2becb5cb24be"'
// efd3b4250000000000000000000000000000000000000000000000000000000000000123000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000008d731f3fed1536a57412239d750a2becb5cb24be000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000004560000000000000000000000000000000000000000000000000000000000000789000000000000000000000000000000000000000000000000000000000000000d48656c6c6f2c20776f726c642100000000000000000000000000000000000000
//
// > node encode.js 'uint,uint32[],string,address' '0x123, [0x456, 0x789], "Hello, world!", "0x8d731f3fed1536a57412239d750a2becb5cb24be"'
// 0000000000000000000000000000000000000000000000000000000000000123000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000008d731f3fed1536a57412239d750a2becb5cb24be000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000004560000000000000000000000000000000000000000000000000000000000000789000000000000000000000000000000000000000000000000000000000000000d48656c6c6f2c20776f726c642100000000000000000000000000000000000000

const ABI = require('ethereumjs-abi');

var argv = process.argv;
var func = argv[2];
if(func!=null)func=func.trim();
var args = argv[3];
if(args!=null)args=args.trim();

var patt = /^[_a-z0-9]+\(.+\)$/i;
var isFunc = patt.test(func);
if (!isFunc) {
    func = "f(" + func + ")";
}  

var execute = 'ABI.simpleEncode("'+func+'", '+args+')';

try {
    var encoded = eval(execute);
    var str = buffer2Str16(encoded);
    if (!isFunc) {
        str = str.slice(8);
    }  
    console.log(str);
} catch (error) {
    console.log(error);
    console.log("execute: "+execute);
    for(var i=0; i<argv.length; i++) {
        console.log("argv["+i+"]: "+argv[i]);
    }
}

function buffer2Str16(buffer){
    var array = Array.prototype.slice.call(buffer);
    var str = bytes2Str(array);
    return str;
}

function bytes2Str(arr) {
    var str = "";
    for(var i=0; i<arr.length; i++) {
       var tmp = arr[i].toString(16);
       if(tmp.length == 1) {
           tmp = "0" + tmp;
       }
       str += tmp;
    }
    return str;
}


