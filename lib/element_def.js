const ElementDef = require("./ElementDef");
const ElementsMap = require("./ElementsMap");

//keep a chache of element definition objects
const elementsDefCache = {};

/**
 * 
 * @param {String} elemName 
 * @returns ElementDef
 */
module.exports = (elemName) => {
  if (elementsDefCache[elemName]) return elementsDefCache[elemName];
  elementsDefCache[elemName] = new ElementDef(elemName, ElementsMap[elemName]);
  return elementsDefCache[elemName];
};
