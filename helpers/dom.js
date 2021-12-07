const _ = require("lodash");
const custom = require("./aliases");

const DEF_STYLE = {
  font: "Avenir"
};

const ELEMENS_ALIAS = {
  div: "stack"
};

module.exports  = function processDOM(DOM) {
  let defaultStyle = DEF_STYLE;
  let keyVals = processKeyVals(DOM);
  let content = processBody(DOM, keyVals);
  let styles = processStyles(DOM, keyVals);
  let header = processHeader(DOM, keyVals);
  let footer = processFooter(DOM, keyVals);

  let dd = {
    content,
    defaultStyle,
    styles,
    header,
    footer
  };
  Object.assign(dd, processAttrs(DOM.attrs));
  return dd;
}

function processBody(doc, keyVals) {
  let body = getDirectElementByPath(doc, "body");

  body = getChildrenOfEl(body);
  return processContent(body, keyVals);
}


/**
 *
 * @param {Array} elements - An array of elements to be the content array
 * @param {Object} keyVals
 */
function processContent(elements, keyVals) {
  if (!elements) return [];

  let content = elements.map(elem => {
    return processEl(elem, keyVals);
  })
  .filter(x => !!x);

  return content;
}

function processStyles(doc) {
  let styles = getDirectElementByPath(doc, "head.styles");
  styles = getChildrenOfEl(styles);
  let _styles = {};
  styles &&
    styles.forEach(style => {
      _styles[style["#name"]] = processEl(style);
    });
  return _styles;
}

function processKeyVals(doc) {
  let values = getDirectElementByPath(doc, "head.values");
  values = values && values[0];
  return values && values.attrs;
}

function processHeader(doc) {
  return (current_page, page_count, page_size) => {
    let header = getDirectElementByPath(doc, "head.header");
    header = getChildrenOfEl(header);
    let page_width = page_size.width;
    let content = processContent(header, {
      current_page,
      page_count,
      page_width
    });
    return content;
  };
}

function processFooter(doc) {
  return (current_page, page_count) => {
    let footer = getDirectElementByPath(doc, "head.footer");
    footer = getChildrenOfEl(footer);
    return processContent(footer, { current_page, page_count });
  };
}

/**
 *
 * @param {Object} parent
 * @param {String} path ex : 'head.header'
 * @returns the first object found with specified path
 */
function getDirectElementByPath(parent, path) {
  let props = path.split(".");
  let val = parent,
    elem;
  for (var i = 0; i < props.length; i++) {
    let prop = props[i];
    elem = val[prop];
    if (!elem) return;
    if (_.isArray(elem)) val = elem[0];
    else val = elem;
  }
  return elem;
}

function getChildrenOfEl(el) {
  if (_.isArray(el)) el = el[0];
  return el && el.children;
}

/**
 *
 * @param {Object} elem
 * @param {*} keyVals
 */
/**
 * Here are the possible ways an element might look like
 * this shall be {text : "Custom style"}
 *  {
        "_": "Custom style",
        "attrs": {
            "style": "npStyle"
        },
        "#name": "text"
    },
 */
function processEl(elem, keyVals) {
  let _elem = {};
  let elementName = getElName(elem);
  //use the name of the attribute for the character
  _elem[elementName] = elem._ || "";
  if (elem.attrs) {
    Object.assign(_elem, processAttrs(elem.attrs, keyVals));
    if(!_.isUndefined(_elem.printIf) && !_elem.printIf) return;
  }


  if (_elem.value) handleVars(_elem, keyVals);
  if (elem.children) {
    _elem[elementName] = elem.children.map(child => {
      return processEl(child, keyVals);
    }).filter(x => !!x);
  }

  //handle custom defined elements (that are not defined with pdf-make)  
  _elem = handleCustom(_elem, elementName); 

  if(_elem.text) {
    _elem.text = processText(_elem)
  }
  
  return _elem;
}

function processText({text, preserveNL}){
  if(preserveNL) return text;
  if(!_.isString(text)) return text;
  //for now we always remove new lines
  return text && text.split('\n').map(x => x.trim()).join(' ').trim();
}

function handleVars(elem, keyVals) {
  elem.text = keyVals[elem.value];
  delete elem.value;
}

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
  if (!_.isString(val)) return val;
  let isArrayLike = val.startsWith("[") && val.endsWith("]");
  if (!isArrayLike) return val;
  var result = val.substring(1, val.length - 1);
  return result.split(",").map(numberLike);
}

function numberLike(val) {
  return !isNaN(val) ? Number(val) : val;
}

function getElName(el) {
  let name = el["#name"];
  if (ELEMENS_ALIAS[name]) name = ELEMENS_ALIAS[name];
  return name;
}

function parseAttr(val, keyVals) {
  if (!_.isString(val)) return val;

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

function handleCustom(elem, elName) {
  if (custom[elName]) {
    return custom[elName](elem);
  } else {
    return elem;
  }
}
