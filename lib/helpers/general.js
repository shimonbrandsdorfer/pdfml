

const isString = (obj) => {
    return typeof obj === 'string' || obj instanceof String;
}

const isArray = (obj) => {
    return Array.isArray(obj);
}

const isUndefined = (obj) => {
    return typeof obj === 'undefined';
}

const camelCase = (str) => {
    return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
}

const isFunction = (obj) => {
    return typeof obj === 'function';
}

const strToArr = (string = '', forceArray) => {
    if(forceArray) string  = String(string);
    if(!isString(string)) return string;
    return string.trim().split(' ');
}

const cleanText = (text) => {
    return text.replace(/(\r\n|\n|\r)/gm, " ").trim();
}

const fillMissing = (arr, fillWith, desiredLength) => {
    if(arr.length >= desiredLength) return arr;
    let filled = new Array(desiredLength - arr.length).fill(fillWith);
    return arr.concat(filled);
}


module.exports = {
    isString,
    isUndefined,
    camelCase,
    isFunction,
    strToArr,
    cleanText,
    isArray,
    fillMissing
}