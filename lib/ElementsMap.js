//this file wraps the pdfml elements to make them more intuitive to use
const {isString} = require('./helpers/general');


module.exports = {
  hr: { onProcess: horizontalLine },
  row: {  mergeAsArray: true},
  cell: { mergeAsArray: true },
  tr: {  mergeAsArray: true},
  td: { mergeAsArray: true },
  table : { type : 'object' },
  tbody: { pdfMakeName: "body", empty: [[]] },
  image: { onProcess: image },
  br: { onProcess: breakLine },
  columns: { isArray: true },
  div: { pdfMakeName: "stack" },
  p: { pdfMakeName: "text", onProcess: text },
  text: { onProcess: text },
};

function text(elem, keyVals, _elem) {
  _elem.text = processText(_elem);

  return _elem;
}
//helper function for to process text
function processText({ text, preserveNL }) {
  if (preserveNL) return text;
  if (!isString(text)) return text;
  //for now we always remove new lines
  return text && text.split("\n").join(" ");
}

function image(elem, keyVals, _elem) {
  _elem.image = img.data || img.src;
  return _elem;
}

function breakLine() {
  return { text: "\n", preserveNL: true };
}

function horizontalLine(obj) {
  const _defs = {
    color: "black",
    h: 0.5,
    w: 500,
    x: 0,
    y: 0,
  };
  obj = Object.assign(_defs, obj);
  obj.type = "rect";

  return {
    canvas: [obj],
  };
}