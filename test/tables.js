const expect = require('chai').expect;
const { getDD , render} = require('../index');
const path = require('path');


describe('Render "table.pdfml" from xml to Document-Definition', () => {
    let dd;
    before(async () => {
        dd = await getDD(path.join(__dirname, '../samples/table.pdfml'), { rows : [['A', 'B'], ['C', 'D']] });
    });

    it('Expect Document-Definition to be generated without error', () => {
        expect(dd).to.be.ok;
    });
});

describe('Detect mismatch of columns # and fill in empty cells for the missing', () => {
    let dd;
    const example = `<pdfml>
        <body>
            <table>
                <tbody>
                    <tr>
                        <td>A</td>
                        <td>B</td>
                    </tr>
                    <tr>
                        <td>C</td>
                    </tr>
                </tbody>
            </table>
        </body>
    </pdfml>`;
    before(async () => {
        dd = await getDD(example, {});
    });

    it('Generate Document-Definition without error', () => {
        expect(dd).to.be.ok;
    });

    it('Render table without error', async () => {
        let pdfDoc = await render({
            str : example,
            data: {}
        });
        expect(pdfDoc).to.be.ok;
    });

    it('Expect the table to have 2 rows', () => {
        expect(dd.content[0].table.body.length).to.equal(2);
    });

    it('Expect first row to have 2 columns', () => {
        expect(dd.content[0].table.body[0].length).to.equal(2);
    });

    it('Expect second row to have 2 columns', () => {
        expect(dd.content[0].table.body[1].length).to.equal(2);
    });

    it('Expect second cell of second row to be empty', () => {
        expect(dd.content[0].table.body[1][1]).to.equal('');
    });


});