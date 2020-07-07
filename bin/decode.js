#!/usr/bin/env node

// #example:
//
// > node decode.js 'uint,uint32[],string,address' '0000000000000000000000000000000000000000000000000000000000000123000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000008d731f3fed1536a57412239d750a2becb5cb24be000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000004560000000000000000000000000000000000000000000000000000000000000789000000000000000000000000000000000000000000000000000000000000000d48656c6c6f2c20776f726c642100000000000000000000000000000000000000'
// [291, [1110, 1929], "Hello, world!", "8d731f3fed1536a57412239d750a2becb5cb24be"]

const BN = require('bn.js');
const ABI = require('ethereumjs-abi');

var argv = process.argv;
var typesStr = argv[2];
if(typesStr!=null)typesStr=typesStr.trim();
var types = typesStr.split(',');
var data = argv[3];
if (data != null) {
    data = data.trim();
    if (data.toLowerCase().substring(0, 2) == "0x") {
        data = data.slice(2)
    }	
}

var execute = 'ABI.rawDecode(types, Buffer.from(data, "hex"))';

try {
    var decoded = eval(execute);
    var str = array2Str(decoded);
    console.log(str);
} catch (error) {
    console.log(error);
    console.log("execute: "+execute);
    console.log("types: "+types);
    console.log("data: "+data);
    for(var i=0; i<argv.length; i++) {
        console.log("argv["+i+"]: "+argv[i]);
    }
}

function array2Str(arr){
    var str = "[";
    for (var i=0; i<arr.length; i++) {
        if (i != 0) {
            str = str + ", ";
        }
        var e = arr[i];
        
        var str1 = "";
        if (e == undefined) {
            str1 = "undefined";
            
        } else if (e == null) {
            str1 = "null";
            
        } else if (BN.isBN(e)) {
            str1 = e.toString(10);
            
        } else if (typeof e == "string") {
            str1 = '"' + e + '"';
            
        } else if (e instanceof Buffer) {
            str1 = '"' + buffer2Str(e) + '"';
            
        } else if (e instanceof Array) {
            str1 = arguments.callee(e);
            
        } else {
            str1 = e.toString();
        }
        
        str = str + str1;
    }
    str = str + "]"
    return str;
}

function buffer2Str(buffer){
    var array = Array.prototype.slice.call(buffer);
    var str = hex2Str(array);
    return str;
}

function hex2Str(arr) {
    var str = "";
    for(var i=0; i<arr.length; i++) {
       var tmp = arr[i].toString(16);
       tmp = String.fromCharCode(parseInt(tmp,16));
       str += tmp;
    }
    return str;
}


