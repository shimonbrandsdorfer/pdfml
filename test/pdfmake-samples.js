//this is testing the samples provided in pdfmake webiste
//http://pdfmake.org/playground.html

const expect = require('chai').expect;
const { getDD , render} = require('../index');
const path = require('path');

describe('basics example', () => {
    const DD = {
        content: [
            { text : 'First paragraph'},
            { text : 'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'}
        ]
        
    };

    it('Generated properly', async () => {
        let pdfDoc = await render({
            path: path.join(__dirname, '../samples/pdfmake-samples/basics.pdfml'),
            data: {  }
        });
        expect(pdfDoc).to.be.ok;
    });

    it('PDF Content matches', async () => {
        let _DD = await getDD(path.join(__dirname, '../samples/pdfmake-samples/basics.pdfml'), {});
        expect(_DD.content).to.deep.equal(DD.content);
    });

});


describe('Simple Tables example', () => {
    const DD = {
        content : [
            {
                style: 'tableExample',
                table: {
                    body: [
                        ['Column 1', 'Column 2', 'Column 3']
                    ]
                }
            }
        ]
    };


    it('Generated properly', async () => {
        let pdfDoc = await render({
            path: path.join(__dirname, '../samples/pdfmake-samples/tables.pdfml'),
            data: {  }
        });
        expect(pdfDoc).to.be.ok;
    });

    it('PDF Content matches', async () => {
        let _DD = await getDD(path.join(__dirname, '../samples/pdfmake-samples/tables.pdfml'), {});
        expect(_DD.content).to.deep.equal(DD.content);
    });
});
