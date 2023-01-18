const {isString} = require('./helpers/general');
const getElementDef = require('./element_def');

const {processAttrs} = require('./helpers/dom');

module.exports  = function processDOM(DOM, options = {defaultStyle : {}}) {
  if(!DOM) throw new Error('PDFML file is empty');
  let keyVals = processKeyVals(DOM);
  let content = processBody(DOM, keyVals);
  let styles = processStyles(DOM, keyVals);
  let header = processHeader(DOM, keyVals);
  let footer = processFooter(DOM, keyVals);

  let dd = {
    content,
    defaultStyle : options.defaultStyle,
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
 * This function can be replaced processEl
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
    if (Array.isArray(elem)) val = elem[0];
    else val = elem;
  }
  return elem;
}

function getChildrenOfEl(el) {
  if (Array.isArray(el)) el = el[0];
  return el && el.children;
}

/**
 *
 * @param {Object} elem | element to be processed
 * @param {Object} keyVals
 * 
 * @returns {Object} processed element as pdfmake object
 */
/**
 */
function processEl(elem, keyVals) {

  let elDef = getElementDef(elem["#name"]);

  let _elem = elDef.processElement(elem, keyVals, processEl);


  if (_elem?.value) handleVars(_elem, keyVals);
  
  return _elem;
}

function handleVars(_elem, keyVals) {
  _elem.text = keyVals[_elem.value];
  delete _elem.value;
}
