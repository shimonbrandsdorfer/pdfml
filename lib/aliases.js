module.exports = {
    hr: horizontalLine,
    row,
    cell,
    table,
    image,
    br : breakLine
}

function image(img) {
    img.image = img.data;
    return img;
}

function breakLine(obj){
    return {text : '\n', preserveNL : true};
}


function horizontalLine(obj) {
    const _defs = {
        color: 'black',
        h: 0.5,
        w: 500,
        x: 0,
        y: 0
    }
    obj = Object.assign(_defs, obj);
    obj.type = 'rect';

    return {
        canvas: [
            obj
        ]
    };
}

function row(obj) {
    return obj.row;
}

function table(elem) {
    let {table, ...props} = elem;
    elem.table = Object.assign(table?.[0], props);
    elem.table.body = table?.body;
    return elem;
}

function cell(obj) {
    obj.text = obj.cell;
    delete obj.cell;
    return obj;
}


