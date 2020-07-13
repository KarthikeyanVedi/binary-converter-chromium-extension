/**
 * Conversion - https://www.rapidtables.com
 */

"use strict";

let calcform = document.querySelector("form[name=calcform]");
let calcform2 = document.querySelector("form[name=calcform2]");

calcform.bin.onkeyup = function (element) {
  let num = calcform.bin.value;
  if (num == "") return;
  num = parseInt(num, 2);
  calcform.oct.value = num.toString(8);
  calcform.dec.value = num.toString(10);
  num = num.toString(16);
  calcform.hex.value = num.toUpperCase();
};

calcform.oct.onkeyup = function (element) {
  let num = document.calcform.oct.value;
  if (num == "") return;
  num = parseInt(num, 8);
  document.calcform.bin.value = num.toString(2);
  document.calcform.dec.value = num.toString(10);
  num = num.toString(16);
  document.calcform.hex.value = num.toUpperCase();
};

calcform.dec.onkeyup = function (element) {
  let num = document.calcform.dec.value;
  if (num == "") return;
  num = parseInt(num, 10);

  if (num < 0) {
    if (num >= -32768) num += 65536;
    else if (num >= -Math.pow(2, 31)) num += Math.pow(2, 32);
    else if (num >= -Math.pow(2, 63)) num += Math.pow(2, 64);
  }

  document.calcform.bin.value = num.toString(2);
  document.calcform.oct.value = num.toString(8);
  num = num.toString(16);
  document.calcform.hex.value = num.toUpperCase();
};

calcform.hex.onkeyup = function (element) {
  let num = document.calcform.hex.value;
  if (num == "") return;
  num = parseInt(num, 16);
  document.calcform.bin.value = num.toString(2);
  document.calcform.oct.value = num.toString(8);
  document.calcform.dec.value = num.toString(10);
};

function UpdateData(x, src) {
  var txt = "",
    hex = "",
    dec = "",
    bin = "";

  var c, h, d, b;
  var del = " ";
  var prefix = document.querySelector("#prefix").checked;
  var hexprefix = "",
    binprefix = "";

  if (prefix) {
    hexprefix = "0x";
    binprefix = "0b";
  }

  for (var i = 0; i < x.length; i++) {
    h = x[i].toString(16);
    d = x[i].toString(10);
    b = x[i].toString(2);
    if (h.length == 1) h = "0" + h;
    if (b.length < 8) b = "0".repeat(8 - b.length) + b;
    if (d < 256) txt += String.fromCharCode(x[i]);
    hex += hexprefix + h.toUpperCase();
    dec += d;
    bin += binprefix + b;

    if (i < x.length - 1) {
      hex += del;
      dec += del;
      bin += del;
    }
  } //var base64 = window.btoa(unescape(encodeURIComponent(txt)));

  var base64 = b64EncodeUnicode(txt);
  if (src != 1) document.calcform2.txt.value = txt;
  if (src != 2) document.calcform2.hex2.value = hex;
  if (src != 3) document.calcform2.bin2.value = bin;
  if (src != 4) document.calcform2.dec2.value = dec;
  document.calcform2.len.value = x.length;
}

function b64EncodeUnicode(str) {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes(
      match,
      p1
    ) {
      return String.fromCharCode("0x" + p1);
    })
  );
}

function b64DecodeUnicode(str) {
  return decodeURIComponent(
    atob(str)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
}

function Convert_ASCII() {
  var x = [];
  var txt = document.calcform2.txt.value;
  if (txt.length == 0) return;

  for (var i = 0; i < txt.length; i++) {
    x[i] = txt.charCodeAt(i);
  }

  UpdateData(x, 1);
}

calcform2.prefix.onchange = Convert_ASCII;

calcform2.txt.onkeyup = Convert_ASCII;

calcform2.hex2.onkeyup = function (element) {
  var x = [];
  var hex = document.calcform2.hex2.value;
  if (hex.length == 0) return;
  hex = hex.replace(/0x/gim, "");
  hex = hex.toUpperCase();
  hex = hex.match(/[0-9A-Fa-f]{1,2}/g);

  for (var i = 0; i < hex.length; i++) {
    x[i] = parseInt(hex[i], 16);
  }

  UpdateData(x, 2);
};

calcform2.bin2.onkeyup = function (element) {
  var x = [];
  var bin = document.calcform2.bin2.value;
  if (bin.length == 0) return;
  bin = bin.replace(/0b/gim, "");
  bin = bin.match(/[0-1]{1,8}/g);
  if (!bin) return;

  for (var i = 0; i < bin.length; i++) {
    x[i] = parseInt(bin[i], 2);
  }

  UpdateData(x, 3);
};

calcform2.dec2.onkeyup = function (element) {
  var x = [];
  var dec = document.calcform2.dec2.value;
  if (dec.length == 0) return;
  dec = dec.match(/[0-9]{1,3}/g);
  if (!dec) return;

  for (var i = 0; i < dec.length; i++) {
    x[i] = parseInt(dec[i], 10);
  }

  UpdateData(x, 4);
};
