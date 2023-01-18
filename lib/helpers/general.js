

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

module.exports = {
    isString,
    isUndefined,
    camelCase,
    isFunction
}