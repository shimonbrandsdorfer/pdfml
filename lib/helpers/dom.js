const { isString, strToArr, cleanText, isArray } = require("./general");

/**
 * 
 * @param {*} attrs 
 * @param {*} keyVals 
 * @param {*} attrDefs 
 * @returns 
 */
function processAttrs(attrs, keyVals = {}, attrDefs = {}) {
  for (var prop in attrs) {
    //parse value
    let attrDef = attrDefs[prop];

    attrs[prop] = parseAttr(attrs[prop], keyVals);

    attrs[prop] = arrayLike(attrs[prop], attrDef && attrDef.type === "array");
    //convert number values to number
    if(!isArray(attrs[prop])) attrs[prop] = numberLike(attrs[prop]);
  }
  return attrs;
}

function arrayLike(val, forceArray = false) {
  let arr = strToArr(val, forceArray);
  if (arr && arr.length > 1 || forceArray){
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
