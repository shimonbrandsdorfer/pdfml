

const isString = (obj) => {
    return typeof obj === 'string' || obj instanceof String;
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

const strToArr = (string = '') => {
    if(!isString(string)) return string;
    return string.trim().split(' ');
}

const cleanText = (text) => {
    return text.replace(/(\r\n|\n|\r)/gm, " ").trim();
}


module.exports = {
    isString,
    isUndefined,
    camelCase,
    isFunction,
    strToArr,
    cleanText
}