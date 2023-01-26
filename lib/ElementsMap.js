//this file wraps the pdfml elements to make them more intuitive to use
const { processTextElem, fillMissing } = require("./helpers/general");

module.exports = {
  hr: { onProcess: horizontalLine },
  row: { mergeAsArray: true },
  cell: { mergeAsArray: true },
  tr: { mergeAsArray: true },
  td: { mergeAsArray: true, type: "object" },
  table: {
    type: "object",
    onProcess: table,
    empty: { body: [[]] },
    attrDefs: { widths: { type: "array", }, heights: {type : 'array'} },
  },
  tbody: { onProcess: tbody, pdfMakeName: "body", empty: [[]] },
  image: { onProcess: image },
  img: { pdfMakeName: "image", onProcess: image },
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

function table(elem, keyVals, _elem) {
  const numOfCols = _elem.table.body[0].length;

  //loop through all attributes from elem, and attach them to the table
  for (let key in elem.$attrs) {
    if (key !== "widths" && key !== "heights") {
      _elem[key] = elem.$attrs[key];
    }

    //TODO: abastrct this to a general setting for elements of type object (some attributes are properties of the parent object while others are properties of the table object)
    //if the attribute is widths or heights, fill the missing values with auto and attach it on the table
    if (key === "widths") {
      _elem.table.widths = fillMissing(elem.$attrs.widths, "auto", numOfCols);
    }
  
    if (key === "heights") {
      _elem.table.heights =fillMissing(elem.$attrs.heights, "auto", numOfCols);
    }
  }
  

  return _elem;
}

function tbody(elem, keyVals, _elem) {
  //get max number of columns
  const maxCols = _elem.body.reduce((acc, curr) => {
    return Math.max(acc, curr.length);
  }, 0);

  //add empty cells to make sure all rows have the same number of columns
  _elem.body = _elem.body.map((row) => {
    return fillMissing(row, '', maxCols);
  });
  return _elem;
}
