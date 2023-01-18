const { isUndefined } = require("./helpers/general");
const { processAttrs } = require("./helpers/dom");

module.exports = class ElementDef {
  constructor(elemName, settings = {}) {
    this.elemName = elemName;
    this.settings = settings;
    this.type = settings.type || "array";
  }

  get pdfMakeName() {
    return this.settings.pdfMakeName || this.elemName;
  }

  onEmpty() {
    if (this.settings.empty) return this.settings.empty;
    return this.settings.isArray ? [] : "";
  }

  onProcess(elem, keyVals, _elem) {
    if (this.settings.onProcess)
      return this.settings.onProcess(elem, keyVals, _elem);
    if(this.settings.mergeAsArray) {
      return _elem ? _elem[this.pdfMakeName] : elem._;
    }
    return _elem;
  }

  /**
   *
   * @param {Object} elem
   * @param {Object} keyVals
   * @param {Object} _elem
   * @param {Function} processCB
   * @returns {Object} | returns the element object that will be used in the pdfmake document
   */
  processChildren(elem, keyVals, _elem, processCB) {
    if(!elem.children) return _elem;
    let children = elem.children
      .map((child) => {
        return processCB(child, keyVals);
      })
      .filter((x) => !!x);

    if (this.type === "array") {
      _elem[this.pdfMakeName] = children;
    } else if(this.type === "object") {
      _elem[this.pdfMakeName] = children.reduce((acc, curr) => {
        Object.assign(acc, curr);
        return acc;
      }, {});
    }
    return _elem;
  }

  /**
   *
   * @param {Object} elem | takes the element object as parsed from the xml
   * @param {Object} keyVals
   * @returns {Object} | returns the element object that will be used in the pdfmake document
   */
  processElement(elem, keyVals, processCB) {
    let _elem = {};

    //use the name of the attribute for the character
    _elem[this.pdfMakeName] = elem._ || this.onEmpty();

    if (elem.attrs) {
      Object.assign(_elem, processAttrs(elem.attrs, keyVals));
      if (!isUndefined(_elem.printIf) && !_elem.printIf) return;
    }

    
    _elem = this.processChildren(elem, keyVals, _elem, processCB);
    //handle custom defined elements (that are not defined with pdf-make)
    _elem = this.onProcess(elem, keyVals, _elem);

    return _elem;
  }
};
