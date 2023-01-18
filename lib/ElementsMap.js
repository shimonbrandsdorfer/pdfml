//this file wraps the pdfml elements to make them more intuitive to use
const {processTextElem} = require('./helpers/general');


module.exports = {
  hr: { onProcess: horizontalLine },
  row: {  mergeAsArray: true},
  cell: { mergeAsArray: true },
  tr: {  mergeAsArray: true},
  td: { mergeAsArray: true,  },
  table : { type : 'object', empty: {body : [[]]} },
  tbody: { onProcess : tbody, pdfMakeName: "body", empty: [[]] },
  image: { onProcess: image },
  img : {pdfMakeName : "image", onProcess: image},
  br: { onProcess: breakLine },
  columns: { isArray: true, empty: [] },
  div: { pdfMakeName: "stack" },
  p: { pdfMakeName: "text", onProcess: processTextElem },
  text: { onProcess: processTextElem },
};

function image(elem, keyVals, _elem) {
  _elem.image = _elem.src;
  delete _elem.src;
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

function tbody (elem, keyVals, _elem) {
  //get max number of columns
  const maxCols = _elem.body.reduce((acc, curr) => {
    return Math.max(acc, curr.length);
  }, 0);

  //add empty cells to make sure all rows have the same number of columns
  _elem.body = _elem.body.map((row) => {
    while (row.length < maxCols) {
      row.push('');
    }
    return row;
  });
  return _elem;
}