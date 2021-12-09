<h1 align="center">
  <a href='https://github.com/nutrition-power/pdfml'>PDFML</a> - <em>PDF</em>  Markdown Language
</h1>

<p align="center">
  Write dynamic PDF files using a markdown language similar to HTML, Using the EJS rendering engine.
<p>

<p align="center">
  This project is built using <a href='http://pdfmake.org/#/'>pdfmake</a> and <a href='https://ejs.co/'>ejs</a>
<p>


## Table of Contents

<!--ts-->
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Usage](#usage)
  - [Convert to JS Object]
  - [Get A Buffer]
  - [Serve with express.js](#serve-with-express.js)
- [Features](#features)
  - [Conditional Elements](#conditional-elements)
- [Fonts](#Fonts)
<!--te-->

## Installation


```sh
npm i pdfml --save
```


## Usage
```js
const pdfml = require('pdfml');
```

### Serve with express.js
```js
const pdfml = require('pdfml');

///in your express router
router.get('/pdf', (res, res, next) => {
  //you can query some data here
  pdfml.render({
    path : '', //path to your ejs file
    data : {} ,// data for context in your ejs file,
    fonts : {} //if you want to supply fonts
  }, function (err, pdfDoc){
    if(err) return next(err);
    res.setHeader("Content-type", "application/pdf");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.attachment("PDF_FILE.pdf");
    res.send(pdfDoc)
  });
})
```


## Features

### Conditional Elements

Use the attribute ```print-if``` and pass a boolean value to include this elements (and it's children or not).

Note - that the inner content is still rendered with ejs, so the variables need to be defined.

## Fonts

Supported fonts are:
- Avenir
- Geo
- Roboto
