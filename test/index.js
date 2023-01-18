const { getDD , render} = require('../index');
const path = require('path');
const { expect } = require('chai');

describe('Render "simple.pdfml" from xml to Document-Definition', () => {
    let dd;
    before(async () => {
        dd = await getDD(path.join(__dirname, '../samples/simple.pdfml'), { text: 'TEXT' });
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

describe('Render "pdfml-attrs.pdfml" from xml to Document-Definition', () => {
    let dd;
    before(async () => {
        dd = await getDD(path.join(__dirname, '../samples/pdfml-attrs.pdfml'), { text: 'TEXT' });
    });

    it('Expect Document-Definition to be generated without error', () => {
        expect(dd).to.be.ok;
    });

    it('The page size is "LETTER"', () => {
        expect(dd.pageSize).to.equal('LETTER');
    });

    it('The page orientation is "landscape"', () => {
        expect(dd.pageOrientation).to.equal('landscape');
    });

    it('The page margins is = "25 140 24 30"', () => {
        expect(dd.pageMargins).to.deep.equal([ 25, 140, 24, 30 ]);
    });
});


describe('Render "print-if.pdfml" from xml to Document-Definition', () => {
    let ddFalse, ddTrue;
    before(async () => {
        ddFalse = await getDD(path.join(__dirname, '../samples/print-if.pdfml'), { value: 'false', text: 'TEXT' });
        ddTrue = await getDD(path.join(__dirname, '../samples/print-if.pdfml'), { value: 'true', text: 'TEXT' });
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


describe('Render "table.pdfml" from xml to Document-Definition', () => {
    let dd;
    before(async () => {
        dd = await getDD(path.join(__dirname, '../samples/table.pdfml'), { rows : [['A', 'B'], ['C', 'D']] });
    });

    it('Expect Document-Definition to be generated without error', () => {
        expect(dd).to.be.ok;
    });
});

describe('Render "br.pdfml" from xml to Document-Definition', () => {
    let dd;
    before(async () => {
        dd = await getDD(path.join(__dirname, '../samples/br.pdfml'), {  });
    });

    it('Expect Document-Definition to be generated without error', () => {
        expect(dd).to.be.ok;
    });
});

describe('Genereate PDF with ejs file', () => {
    
    it('Generated properly', async () => {
        let pdfDoc = await render({
            path: path.join(__dirname, '../samples/simple.pdfml'),
            data: { text: 'TEXT' }
        });

        expect(pdfDoc).to.be.ok;
    })
});


describe('Genereate PDF using include functions and templates', () => {

    let dd;
    before(async () => {
        dd = await getDD(path.join(__dirname, '../samples/main.pdfml'), {});
    });

    it('Generated properly', async () => {
        let pdfDoc = await render({
            path: path.join(__dirname, '../samples/main.pdfml'),
            data: {  }
        });
        expect(pdfDoc).to.be.ok;
    });

    it('PDF Content exists', () => {
        expect(dd.content).to.be.ok;
    });

    it('PDF Content at least one element', () => {
        expect(dd.content.length).to.be.greaterThan(0);
    });
});


