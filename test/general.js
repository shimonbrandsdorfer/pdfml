const { getDD , render} = require('../index');
const { expect } = require('chai');

describe('Support render string', () => {

    const example = `<pdfml><body><text>Hello World!</text></body></pdfml>`;
    let _DD;
    before(async () => {
        _DD = await getDD(example, {});
    });

    it(`allow "${example}" to work`, () => {
        expect(_DD).to.be.ok;
    });

    it('Generates dd as expected', () => {
        expect(_DD.content[0].text).to.equal('Hello World!');
    });
});


describe('Support self closing tags', () => {

    const example = `<pdfml><body><br/></body></pdfml>`;
    let _DD;
    before(async () => {
        _DD = await getDD(example, {});
    });

    it(`allow "${example}" to work`, () => {
        expect(_DD).to.be.ok;
    });

    it('Generates a new line', () => {
        expect(_DD.content[0].text).to.equal('\n');
    });
});