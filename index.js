const ejs = require("ejs");
const { parseString } = require("xml2js");
const path = require("path");
const _ = require("lodash");

const ProcessDom = require("./helpers/dom");
const PdfPrinter = require("pdfmake");


/**
 * 
 * @param {String} filePath  or String
 * @param {Object} data | for ejs context
 * @param {} options 
 * @returns {Promise}
 */
module.exports = {
    generatePDF,
    render,
    xmlToDom
}

/**
 * 
 * @param {String} textPath | xml as string or path to file 
 * @param {*} data 
 * @param {isFile : Boolean, ejs: Object} options 
 * @returns 
 */
async function xmlToDom(textPath, data, options = { ejs: {} }) {
    let xml;
    if (!options.isText) xml = await renderFile(textPath, data, options.ejs);
    else xml = await renderString(textPath, data, options.ejs);
    const OPTIONS = {
        attrkey: "attrs",
        charkey: "_",
        explicitChildren: true,
        explicitArray: false,
        childkey: "children",
        preserveChildrenOrder: true,
        explicitRoot: false,
        attrNameProcessors: [_.camelCase],
        tagNameProcessors: [_.camelCase]
    };
    let DOM = await parseXml(xml, OPTIONS);
    return ProcessDom(DOM);
}

function parseXml(xml, options) {
    return new Promise((resolve, reject) => {

        parseString(xml, options, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    });
}

function renderFile(filePath, data, options) {
    return new Promise((resolve, reject) => {

        ejs.renderFile(filePath, data, options, (err, str) => {
            if (err) reject(err);
            else resolve(str);
        });
    });
}

function renderString(text, data, options) {
    return new Promise((resolve, reject) => {

        ejs.render(text, data, options, (err, str) => {
            if (err) reject(err);
            else resolve(str);
        });
    });
}

/**
 * 
 * @param {Object. |path, str} options 
 */
async function render(options, cb) {
    let docDefinition = await xmlToDom(options.path || options.str, options.data, {
        ...options,
        isFile: !!options.path
    });
    return generatePDF(docDefinition, cb)
}


async function generatePDF(docDefinition, cb) {

    const printer = new PdfPrinter(fonts);
    const doc = printer.createPdfKitDocument(docDefinition);

    let chunks = [];

    doc.on("data", chunk => {
        chunks.push(chunk);
    });

    doc.on("end", () => {
        const result = Buffer.concat(chunks);
        cb(result)
        return Promise.resolve();
    });

    doc.end();
}