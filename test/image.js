const expect = require('chai').expect;
const { getDD , render} = require('../index');
const path = require('path');

describe('Render "image.pdfml" from xml to Document-Definition', () => {
    let dd;
    before(async () => {
        dd = await getDD(path.join(__dirname, '../samples/image.pdfml'));
    });

    it('Expect Document-Definition to be generated without error', () => {
        expect(dd).to.be.ok;
    });

    it('Render file without error', async () => {
        let pdfDoc = await render({
            path : path.join(__dirname, '../samples/image.pdfml'),
            data: {}
        });
        expect(pdfDoc).to.be.ok;
    });


});