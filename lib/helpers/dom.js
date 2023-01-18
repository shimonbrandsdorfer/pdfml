const { isString, strToArr, cleanText } = require("./general");
function processAttrs(attrs, keyVals = {}) {
  for (var prop in attrs) {
    //parse value
    attrs[prop] = parseAttr(attrs[prop], keyVals);

    attrs[prop] = arrayLike(attrs[prop]);
    //convert number values to number
    attrs[prop] = numberLike(attrs[prop]);
  }
  return attrs;
}

function arrayLike(val) {
  let arr = strToArr(val);
  if (arr?.length > 1){
    return arr.map(numberLike);
  }
  return val;
}

function numberLike(val) {
  return !isNaN(val) ? Number(val) : val;
}

function parseAttr(val, keyVals) {
  if (!isString(val)) return val;

  var regex = /\${(\w*)}/g;

  let _val = val.replace(regex, (a, inner) => {
    return keyVals[inner];
  });

  try {
    return eval(_val);
  } catch (e) {
    return _val;
  }
}

function processTextElem(elem, keyVals, _elem) {
  if(isString(_elem)) _elem = processText(_elem);
  else _elem.text = processText(_elem.text, _elem.preserveNL);

  return _elem;
}

//helper function for to process text
function processText( text, preserveNL ) {
  if (preserveNL) return text;
  if (!isString(text)) return text;
  return cleanText(text);
}


module.exports = {
  processAttrs,
  processTextElem
};
