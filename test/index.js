const {xmlToDom} = require('../index');
const path = require('path');
const { expect } = require('chai');

describe('Render "simple.ejs" from xml to Document-Definition', () => {
    let dd;
    before(async () => {
        dd = await xmlToDom(path.join(__dirname, '../samples/simple.ejs'), {text : 'TEXT'}, {isFile : true});
    });

    it('Expect Document-Definition to be generated without error', () => {
        expect(dd).to.be.ok;
    });

    it('Returns a JS Object', () => {
        expect(dd).to.be.an('object');
    });

    it('The body text is "TEXT" (using the ejs context)', () => {
        expect(dd.content[0].text).to.equal('TEXT')
    });

    it('The body style is  "npStyle"', () => {
        expect(dd.content[0].style).to.equal('npStyle')
    });
})