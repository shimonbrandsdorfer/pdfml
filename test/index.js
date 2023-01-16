const { getDD , render} = require('../index');
const path = require('path');
const { expect } = require('chai');

describe('Render "simple.ejs" from xml to Document-Definition', () => {
    let dd;
    before(async () => {
        dd = await getDD(path.join(__dirname, '../samples/simple.ejs'), { text: 'TEXT' });
    });

    it('Expect Document-Definition to be generated without error', () => {
        expect(dd).to.be.ok;
    });

    it('Returns a JS Object', () => {
        expect(dd).to.be.an('object');
    });

    it('The body text is "TEXT" (using the ejs context)', () => {
        expect(dd.content[0].text).to.equal('TEXT');
    });

    it('The body style is  "npStyle"', () => {
        expect(dd.content[0].style).to.equal('npStyle');
    });
});


describe('Render "print-if.ejs" from xml to Document-Definition', () => {
    let ddFalse, ddTrue;
    before(async () => {
        ddFalse = await getDD(path.join(__dirname, '../samples/print-if.ejs'), { value: 'false', text: 'TEXT' });
        ddTrue = await getDD(path.join(__dirname, '../samples/print-if.ejs'), { value: 'true', text: 'TEXT' });
    });

    it('Expect Document-Definition to be generated without error', () => {
        expect(ddFalse).to.be.ok;
        expect(ddTrue).to.be.ok;
    });


    it('The body text is empty (when print-if value is false)', () => {
        expect(ddFalse.content[0]).to.be.undefined;
    });

    it('The body text to be "TEXT: (when print-if value is true)', () => {
        expect(ddTrue.content[0].text).to.equal('TEXT');
    });
});


describe('Render "table.ejs" from xml to Document-Definition', () => {
    let dd;
    before(async () => {
        dd = await getDD(path.join(__dirname, '../samples/table.ejs'), { rows : [['A', 'B'], ['C', 'D']] });
    });

    it('Expect Document-Definition to be generated without error', () => {
        expect(dd).to.be.ok;
    });
});

describe('Render "br.ejs" from xml to Document-Definition', () => {
    let dd;
    before(async () => {
        dd = await getDD(path.join(__dirname, '../samples/br.ejs'), {  });
    });

    it('Expect Document-Definition to be generated without error', () => {
        expect(dd).to.be.ok;
    });
});

describe('Genereate PDF with ejs file', () => {
    
    it('Generated properly', async () => {
        let pdfDoc = await render({
            path: path.join(__dirname, '../samples/simple.ejs'),
            data: { text: 'TEXT' }
        });

        expect(pdfDoc).to.be.ok;
    })
})