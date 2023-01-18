const expect = require('chai').expect;
const { getDD , render} = require('../index');
const path = require('path');

const dataUri = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQYV2NgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=`;

describe('Render "image.pdfml" from xml to Document-Definition', () => {
    let dd;
    before(async () => {
        dd = await getDD(path.join(__dirname, '../samples/image.pdfml'), { dataUri });
    });

    it('Expect Document-Definition to be generated without error', () => {
        expect(dd).to.be.ok;
    });

    it('expect image to be ab object', () => {
        expect(dd.content[0]).to.be.an('object')
    });

    it('expect image to have a property image equal to data-url', () => {
        expect(dd.content[0].image).to.equal(dataUri);
    });

    it('Render file without error', async () => {
        let pdfDoc = await render({
            path : path.join(__dirname, '../samples/image.pdfml'),
            data: {dataUri}
        });
        expect(pdfDoc).to.be.ok;
    });


});

describe('image inside columns', () => {
    const example = `<pdfml>
        <body>
            <columns>
                <image src="${dataUri}" />
            </columns>
        </body>
    </pdfml>`;

    let dd;
    before(async () => {
        dd = await getDD(example, { dataUri });
    });

    it('Expect Document-Definition to be generated without error', () => {
        expect(dd).to.be.ok;
    });

    it('expect image data uri to match', () => {
        expect(dd.content[0].columns[0].image).to.equal(dataUri);
    });
});