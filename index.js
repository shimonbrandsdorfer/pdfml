const ejs = require("ejs");
const { parseString } = require("xml2js");
const path = require("path");
const { camelCase } = require("./lib/helpers/general");

const ProcessDom = require("./lib/dom");
const PdfPrinter = require("pdfmake");

const fonts = {
    Avenir: {
        normal: getFontPath("Avenir/AvenirLTStd-Light"),
        bold: getFontPath("Avenir/AvenirLTStd-Roman")
    },
    Geo: {
        normal: getFontPath("Geogrotesque/Geogtq-Rg"),
        bold: getFontPath("Geogrotesque/Geogtq-Md"),
        italics: getFontPath("Geogrotesque/Geogtq-Lg")
    },
    Roboto: {
        normal: getFontPath("Roboto/Roboto-Regular"),
        bold: getFontPath("Roboto/Roboto-Bold"),
        italics: getFontPath("Geogrotesque/Geogtq-Lg")
    }
};


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
    getDD
}

/**
 * 
 * @param {String} textPath | xml as string or path to file 
 * @param {*} data 
 * @param {isFile : Boolean, ejs: Object} options 
 * @returns {docDefinition}
 */
async function getDD(textPath, data, options = { ejs: {} }) {
    let xml;
    if(textPath.startsWith("<pdfml")) options.isText = true;
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
        attrNameProcessors: [camelCase],
        tagNameProcessors: [camelCase]
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
        try{
            resolve(ejs.render(text, data, options));
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * 
 * @param {Object. |path, str} options 
 */
async function render(options) {
    let docDefinition = await getDD(
        options.path || options.str,
        options.data,
        {
            ...options,
            isText: !!options.str
        });
    return generatePDF(docDefinition, { fonts: options.fonts });
}

/**
 * 
 * @param {Object} docDefinition 
 * @param {Object} options 
 * @returns Promise<Buffer>
 */
function generatePDF(docDefinition, options) {
    return new Promise((resolve, reject) => {
        const printer = new PdfPrinter({ ...fonts, ...options.fonts });
        const doc = printer.createPdfKitDocument(docDefinition);

        let chunks = [];

        doc.on("data", chunk => {
            chunks.push(chunk);
        });

        doc.on("end", () => {
            const result = Buffer.concat(chunks);
            resolve(result);
            return Promise.resolve();
        });

        doc.on('error', reject)

        doc.end();
    });


}

function getFontPath(fileName) {
    return path.join(__dirname, "fonts", `${fileName}.ttf`);
}